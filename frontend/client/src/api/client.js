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
  tutor: (message) => api.post('/ai/tutor', { message }).then((r) => r.data.response),
  bug: (code, language) => api.post('/ai/bug-explainer', { code, language }).then((r) => r.data.response),
  error: (error, language) => api.post('/ai/error-translator', { error, language }).then((r) => r.data.response),
  improve: (code, language) => api.post('/ai/code-improver', { code, language }).then((r) => r.data.response),
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
