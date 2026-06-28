// src/services/githubService.js
// ---------------------------------------------------------------------------
// Reads PUBLIC GitHub repositories using the free GitHub REST API.
// No token needed (60 requests/hour). Set GITHUB_TOKEN in .env to raise the
// limit to 5000/hour — optional.
// ---------------------------------------------------------------------------

const API = 'https://api.github.com';

// Files/folders we never want to show or send to the AI (noise / binary / huge).
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', 'vendor', '.next', 'coverage', '__pycache__'];
const IGNORE_FILES = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', '.ds_store'];
const BINARY_EXT = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'webp', 'pdf', 'zip', 'mp4', 'mp3', 'woff', 'woff2', 'ttf', 'eot', 'lock'];

function headers() {
  const h = { Accept: 'application/vnd.github+json', 'User-Agent': 'CodeMentor-AI' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

// Accepts "https://github.com/owner/repo", "github.com/owner/repo", or "owner/repo".
export function parseRepoUrl(input = '') {
  const cleaned = input.trim().replace(/\.git$/, '').replace(/\/$/, '');
  const m = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/) || cleaned.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (!m) throw new Error('Invalid GitHub URL. Example: https://github.com/facebook/react');
  return { owner: m[1], repo: m[2] };
}

function isIgnored(path) {
  const lower = path.toLowerCase();
  if (IGNORE_DIRS.some((d) => lower.split('/').includes(d))) return true;
  const base = lower.split('/').pop();
  if (IGNORE_FILES.includes(base)) return true;
  const ext = base.includes('.') ? base.split('.').pop() : '';
  if (BINARY_EXT.includes(ext)) return true;
  return false;
}

async function gh(path) {
  const res = await fetch(`${API}${path}`, { headers: headers() });
  if (res.status === 404) throw new Error('Repository not found (or it is private).');
  if (res.status === 403) throw new Error('GitHub rate limit reached. Try again later, or add a GITHUB_TOKEN.');
  if (!res.ok) throw new Error(`GitHub error: ${res.status}`);
  return res.json();
}

// Repo description, language, default branch.
export async function getRepoMeta({ owner, repo }) {
  const d = await gh(`/repos/${owner}/${repo}`);
  return {
    name: d.full_name,
    description: d.description,
    language: d.language,
    stars: d.stargazers_count,
    defaultBranch: d.default_branch,
    url: d.html_url,
  };
}

// README text (decoded from base64). Returns '' if none.
export async function getReadme({ owner, repo }) {
  try {
    const d = await gh(`/repos/${owner}/${repo}/readme`);
    return Buffer.from(d.content, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

// Full recursive file list, filtered to meaningful code files only.
export async function getFileTree({ owner, repo, branch }) {
  const d = await gh(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  return (d.tree || [])
    .filter((node) => node.type === 'blob' && !isIgnored(node.path))
    .map((node) => ({ path: node.path, size: node.size }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

// Raw text of a single file (truncated so we never blow the AI token limit).
export async function getFileContent({ owner, repo, path, branch }) {
  if (isIgnored(path)) throw new Error('This file type cannot be explained (binary or ignored).');
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'CodeMentor-AI' } });
  if (!res.ok) throw new Error('Could not read that file.');
  const text = await res.text();
  const MAX = 16000; // characters
  return text.length > MAX ? text.slice(0, MAX) + '\n\n... (file truncated for length) ...' : text;
}

// One call that gathers everything needed for the overview.
export async function getRepoSnapshot(input) {
  const { owner, repo } = parseRepoUrl(input);
  const meta = await getRepoMeta({ owner, repo });
  const [readme, tree] = await Promise.all([
    getReadme({ owner, repo }),
    getFileTree({ owner, repo, branch: meta.defaultBranch }),
  ]);
  return { owner, repo, meta, readme, tree };
}
