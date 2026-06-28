// src/models/ChatHistory.js
import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    feature: {
      type: String,
      enum: ['tutor', 'bugExplainer', 'errorTranslator', 'codeImprover', 'problemGenerator'],
      required: true,
    },
    message: { type: String, required: true }, // what the user sent
    response: { type: String, required: true }, // what the AI replied
    language: { type: String, default: 'en' }, // programming language or ui language
    topic: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('ChatHistory', chatHistorySchema);
