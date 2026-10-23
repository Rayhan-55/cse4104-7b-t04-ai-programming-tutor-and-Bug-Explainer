// src/api/client.js
import axios from 'axios';

// Uses the Vite dev proxy (/api -> backend). In production set VITE_API_URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach the JWT (if present) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- typed-ish helpers used across the app ----
export const AuthAPI = {
  register: (body) => api.post('/auth/register', body).then((r) => r.data),
  login: (body) => api.post('/auth/login', body).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
  updateProfile: (body) => api.patch('/auth/profile', body).then((r) => r.data),
};

export const AiAPI = {
  // Each tool now accepts an optional `history` array of prior turns
  // ([{ role: 'user' | 'assistant', text }]). The backend already threads this
  // into Claude so the learner can keep a multi-turn conversation.
  tutor: (message, history = []) =>
    api.post('/ai/tutor', { message, history }).then((r) => r.data.response),
  bug: (code, language, history = []) =>
    api.post('/ai/bug-explainer', { code, language, history }).then((r) => r.data.response),
  error: (error, language, history = []) =>
    api.post('/ai/error-translator', { error, language, history }).then((r) => r.data.response),
  improve: (code, language, history = []) =>
    api.post('/ai/code-improver', { code, language, history }).then((r) => r.data.response),

  // A follow-up ("bujhlam na", "ekta example dao", "aro shohoj kore bolo") is a
  // plain text question. We route it through the tutor brain and pass the full
  // prior thread as history, so Claude already has the original code/error +
  // its first explanation as context and simply continues the same topic.
  followUp: (message, history = []) =>
    api.post('/ai/tutor', { message, history }).then((r) => r.data.response),

  history: () => api.get('/ai/history').then((r) => r.data.history),
};

export const RepoAPI = {
  overview: (url, lang) => api.post('/repo/overview', { url, lang }).then((r) => r.data),
  file: (url, path, branch, lang) =>
    api.post('/repo/file', { url, path, branch, lang }).then((r) => r.data),
};

export const DocAPI = {
  explain: (file, lang, question) => {
    const fd = new FormData();
    fd.append('file', file);
    if (lang) fd.append('lang', lang);
    if (question) fd.append('question', question);
    return api.post('/doc/explain', fd).then((r) => r.data);
  },
};

export const AdminAPI = {
  stats: () => api.get('/admin/stats').then((r) => r.data),
  users: () => api.get('/admin/users').then((r) => r.data.users),
  activity: () => api.get('/admin/activity').then((r) => r.data.activity),
  setRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data.user),
};

export default api;