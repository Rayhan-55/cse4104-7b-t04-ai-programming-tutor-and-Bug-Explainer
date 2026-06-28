
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import repoRoutes from './routes/repoRoutes.js';
import docRoutes from './routes/docRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '1mb' }));

// Gentle rate limit on AI endpoints to protect your API quota.
app.use(
  ['/api/ai', '/api/repo', '/api/doc'],
  rateLimit({ windowMs: 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false })
);

app.get('/api/health', (req, res) => res.json({ status: 'ok', provider: process.env.AI_PROVIDER || 'mock' }));
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/repo', repoRoutes);
app.use('/api/doc', docRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().finally(() => {
  app.listen(PORT, () => console.log(`[server] CodeMentor AI API running on http://localhost:${PORT}`));
});
