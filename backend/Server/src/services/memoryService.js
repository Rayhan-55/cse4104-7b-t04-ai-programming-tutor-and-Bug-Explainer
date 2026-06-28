// src/services/memoryService.js
// ---------------------------------------------------------------------------
// A lightweight "memory" so the tutor remembers each student over time.
// We store short notes per user and feed a compact summary back into prompts,
// so answers can reference what the student worked on before. This is the
// personalization layer that a plain chatbot can't offer.
// ---------------------------------------------------------------------------

import Memory from '../models/Memory.js';
import WeakTopic from '../models/WeakTopic.js';
import { isDBReady } from '../config/db.js';

const MAX_NOTES = 40;

// Add a short note to a user's memory (best-effort; never throws to caller).
export async function addNote(userId, text) {
  if (!userId || !isDBReady() || !text) return;
  try {
    const mem = await Memory.findOneAndUpdate(
      { userId },
      { $push: { notes: { $each: [{ text }], $slice: -MAX_NOTES } } },
      { upsert: true, new: true }
    );
    return mem;
  } catch (_) {
    /* ignore */
  }
}

// Build a compact context string to prepend to AI prompts. Returns '' if none.
export async function getContext(userId) {
  if (!userId || !isDBReady()) return '';
  try {
    const [mem, weak] = await Promise.all([
      Memory.findOne({ userId }),
      WeakTopic.find({ userId }).sort({ mistakeCount: -1 }).limit(5),
    ]);

    const recent = (mem?.notes || []).slice(-6).map((n) => `- ${n.text}`);
    const weakList = weak.map((w) => `${w.topic} (${w.mistakeCount}x)`);

    if (recent.length === 0 && weakList.length === 0) return '';

    let ctx = '';
    if (recent.length) ctx += `Recently this student worked on:\n${recent.join('\n')}\n`;
    if (weakList.length) ctx += `Topics they often struggle with: ${weakList.join(', ')}.\n`;
    return ctx.trim();
  } catch (_) {
    return '';
  }
}

// Read a user's full memory (used by the admin panel & profile).
export async function getMemory(userId) {
  if (!isDBReady()) return null;
  return Memory.findOne({ userId });
}
