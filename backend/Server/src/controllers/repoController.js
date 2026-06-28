// src/controllers/repoController.js
import { askAI } from '../services/aiService.js';
import { getRepoSnapshot, getFileContent, parseRepoUrl, getRepoMeta } from '../services/githubService.js';
import ChatHistory from '../models/ChatHistory.js';
import { isDBReady } from '../config/db.js';

async function saveHistory({ userId, message, response }) {
  if (!userId || !isDBReady()) return;
  try {
    await ChatHistory.create({ userId, feature: 'tutor', message, response, topic: 'github-repo' });
  } catch (_) {}
}

// POST /api/repo/overview   body: { url, lang }
export async function overview(req, res) {
  const { url, lang } = req.body;
  if (!url) return res.status(400).json({ message: 'GitHub url is required' });

  // Real GitHub data (works regardless of AI provider).
  const snapshot = await getRepoSnapshot(url);

  // AI explanation of the whole project.
  const explanation = await askAI('repoOverview', {
    meta: snapshot.meta,
    readme: snapshot.readme,
    tree: snapshot.tree,
    lang,
  });

  await saveHistory({ userId: req.user?._id, message: `Explain repo: ${snapshot.meta.name}`, response: explanation });

  res.json({
    meta: snapshot.meta,
    branch: snapshot.meta.defaultBranch,
    owner: snapshot.owner,
    repo: snapshot.repo,
    tree: snapshot.tree, // clickable file list for the frontend
    explanation,
  });
}

// POST /api/repo/file   body: { url, path, branch, lang }
export async function file(req, res) {
  const { url, path, branch, lang } = req.body;
  if (!url || !path) return res.status(400).json({ message: 'url and path are required' });

  const { owner, repo } = parseRepoUrl(url);
  const usedBranch = branch || (await getRepoMeta({ owner, repo })).defaultBranch;

  const content = await getFileContent({ owner, repo, path, branch: usedBranch });
  const explanation = await askAI('fileExplain', { path, content, lang });

  await saveHistory({ userId: req.user?._id, message: `Explain file: ${path}`, response: explanation });

  res.json({ path, content, explanation });
}
