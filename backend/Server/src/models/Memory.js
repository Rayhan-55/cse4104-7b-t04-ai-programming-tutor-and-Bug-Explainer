// src/models/Memory.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  { text: { type: String, required: true } },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const memorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    notes: { type: [noteSchema], default: [] }, // short facts about the learner
  },
  { timestamps: true }
);

export default mongoose.model('Memory', memorySchema);
