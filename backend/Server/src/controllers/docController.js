// src/controllers/docController.js
import { askAI, askAIVision } from '../services/aiService.js';
import { getDocumentProxy, extractText } from 'unpdf';
import ChatHistory from '../models/ChatHistory.js';
import { isDBReady } from '../config/db.js';

async function saveHistory({ userId, message, response }) {
  if (!userId || !isDBReady()) return;
  try {
    await ChatHistory.create({ userId, feature: 'tutor', message, response, topic: 'document' });
  } catch (_) {}
}

// POST /api/doc/explain  (multipart) — field "file" + optional "lang", "question"
export async function explainDoc(req, res) {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'Please upload a PDF or image file.' });

  const { lang, question } = req.body;
  const mime = file.mimetype;

  let explanation;

  if (mime === 'application/pdf') {
    // ---- PDF: extract text, then explain it ----
    let text = '';
    try {
      const pdf = await getDocumentProxy(new Uint8Array(file.buffer));
      const out = await extractText(pdf, { mergePages: true });
      text = (out.text || '').trim();
    } catch {
      return res.status(422).json({ message: 'Could not read this PDF. It may be corrupted or scanned/image-only.' });
    }
    if (!text) {
      return res.status(422).json({
        message: 'No selectable text found. If this is a scanned PDF, upload a photo of the page instead (image mode reads it).',
      });
    }
    const MAX = 16000;
    explanation = await askAI('docExplain', {
      lang,
      question,
      text: text.length > MAX ? text.slice(0, MAX) + '\n... (truncated) ...' : text,
    });
  } else if (mime.startsWith('image/')) {
    // ---- Image: send to the AI's vision model ----
    explanation = await askAIVision(
      'docExplain',
      { lang, question },
      { base64: file.buffer.toString('base64'), mimeType: mime }
    );
  } else {
    return res.status(415).json({ message: 'Only PDF and image files are supported.' });
  }

  await saveHistory({
    userId: req.user?._id,
    message: `Explain document: ${file.originalname}`,
    response: explanation,
  });

  res.json({ filename: file.originalname, kind: mime === 'application/pdf' ? 'pdf' : 'image', explanation });
}
