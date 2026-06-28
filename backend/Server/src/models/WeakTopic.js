// src/models/WeakTopic.js
import mongoose from 'mongoose';

const weakTopicSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true }, // e.g. "recursion", "pointers"
    mistakeCount: { type: Number, default: 1 },
    confidenceLevel: { type: Number, default: 0, min: 0, max: 100 }, // 0 = weak, 100 = strong
  },
  { timestamps: true }
);

// One row per (user, topic).
weakTopicSchema.index({ userId: 1, topic: 1 }, { unique: true });

export default mongoose.model('WeakTopic', weakTopicSchema);
