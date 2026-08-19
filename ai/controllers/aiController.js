// src/controllers/aiController.js
import { askAI } from '../services/aiService.js';
import ChatHistory from '../models/ChatHistory.js';
import { isDBReady } from '../config/db.js';
import { addNote, getContext } from '../services/memoryService.js';

// Saves a turn to history if a user is logged in and the DB is up. Best-effort.
async function saveHistory({ userId, feature, message, response, language, topic }) {
  if (!userId || !isDBReady()) return;
  try {
    await ChatHistory.create({ userId, feature, message, response, language, topic });
  } catch (err) {
    console.error('[history] save failed:', err.message);
  }
}

// Awards a little XP for engaging. Best-effort, never blocks the response.
async function awardXP(user, amount) {
  if (!user || !isDBReady()) return;
  try {
    user.xp += amount;
    user.level = Math.floor(user.xp / 100) + 1;
    await user.save();
  } catch (_) {}
}

// 2. POST /api/ai/tutor
export async function tutor(req, res) {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'message is required' });

  const memory = await getContext(req.user?._id);
  const response = await askAI('tutor', { message, memory });
  await saveHistory({ userId: req.user?._id, feature: 'tutor', message, response, topic: message });
  await addNote(req.user?._id, `Asked the tutor about: "${message.slice(0, 80)}"`);
  await awardXP(req.user, 5);
  res.json({ response });
}

// 3. POST /api/ai/bug-explainer
export async function bugExplainer(req, res) {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ message: 'code is required' });

  const memory = await getContext(req.user?._id);
  const response = await askAI('bugExplainer', { code, language, memory });
  await saveHistory({ userId: req.user?._id, feature: 'bugExplainer', message: code, response, language });
  await addNote(req.user?._id, `Debugged some ${language || ''} code`.trim());
  await awardXP(req.user, 10);
  res.json({ response });
}

// 4. POST /api/ai/error-translator  (flagship)
export async function errorTranslator(req, res) {
  const { error, language } = req.body;
  if (!error) return res.status(400).json({ message: 'error is required' });

  const memory = await getContext(req.user?._id);
  const response = await askAI('errorTranslator', { error, language, memory });
  await saveHistory({ userId: req.user?._id, feature: 'errorTranslator', message: error, response, language });
  await addNote(req.user?._id, `Hit a ${language || ''} error: "${error.slice(0, 60)}"`.trim());
  await awardXP(req.user, 5);
  res.json({ response });
}

// 5. POST /api/ai/code-improver
export async function codeImprover(req, res) {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ message: 'code is required' });

  const memory = await getContext(req.user?._id);
  const response = await askAI('codeImprover', { code, language, memory });
  await saveHistory({ userId: req.user?._id, feature: 'codeImprover', message: code, response, language });
  await addNote(req.user?._id, `Asked to improve some ${language || ''} code`.trim());
  await awardXP(req.user, 10);
  res.json({ response });
}

// 6. POST /api/ai/problem
export async function problem(req, res) {
  const { topic, difficulty } = req.body;
  if (!topic || !difficulty) {
    return res.status(400).json({ message: 'topic and difficulty are required' });
  }

  const raw = await askAI('problemGenerator', { topic, difficulty });
  // The model is asked to return JSON; parse defensively.
  let parsed;
  try {
    parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    parsed = { title: `${topic} (${difficulty})`, statement: raw };
  }
  res.json({ problem: parsed });
}

// GET /api/ai/history  (protected)
export async function history(req, res) {
  if (!isDBReady()) return res.json({ history: [] });
  const items = await ChatHistory.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ history: items });
}
