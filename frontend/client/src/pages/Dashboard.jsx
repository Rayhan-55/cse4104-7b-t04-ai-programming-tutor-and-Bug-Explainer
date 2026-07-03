// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { AiAPI } from '../api/client.js';

const FEATURE_LABEL = {
  tutor: 'Tutor',
  bugExplainer: 'Bug Explainer',
  errorTranslator: 'Error Translator',
  codeImprover: 'Code Improver',
};

const tools = [
  { to: '/tutor', label: '🎓 Ask the Tutor' },
  { to: '/bug-explainer', label: '🐞 Explain a Bug' },
  { to: '/error-translator', label: '🌐 Translate an Error' },
  { to: '/code-improver', label: '💡 Improve Code' },
  { to: '/repo-explainer', label: '🐙 Explain a GitHub Repo' },
  { to: '/doc-explainer', label: '📄 Explain a PDF / Image' },
];

function Stat({ label, value, accent }) {
  return (
    <div className="glass p-5">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-1 font-display text-3xl font-extrabold ${accent}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    AiAPI.history().then(setHistory).catch(() => setHistory([]));
  }, []);

  // Build a tiny "activity by feature" chart from history.
  const counts = history.reduce((acc, h) => {
    acc[h.feature] = (acc[h.feature] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(FEATURE_LABEL).map(([k, label]) => ({ name: label, count: counts[k] || 0 }));
  const palette = ['#f5a524', '#3dd7c0', '#8a93a6', '#a78bfa'];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl font-extrabold">
        Hi {user?.name?.split(' ')[0]} 👋
      </motion.h1>
      <p className="mt-1 text-sm text-muted">Here's your learning snapshot.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="XP" value={user?.xp ?? 0} accent="text-amber" />
        <Stat label="Level" value={user?.level ?? 1} accent="text-teal" />
        <Stat label="Streak" value={`${user?.streak ?? 0}🔥`} accent="text-e7ebf3" />
        <Stat label="Activities" value={history.length} accent="text-e7ebf3" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="glass p-5 lg:col-span-3">
          <h3 className="font-display text-sm font-semibold text-muted">Activity by tool</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: '#8a93a6', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#8a93a6', fontSize: 12 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} contentStyle={{ background: '#12151d', border: '1px solid #222838', borderRadius: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-5 lg:col-span-2">
          <h3 className="font-display text-sm font-semibold text-muted">Jump back in</h3>
          <div className="mt-4 grid gap-2">
            {tools.map((t) => (
              <Link key={t.to} to={t.to} className="btn-ghost justify-start">{t.label}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="glass mt-6 p-5">
        <h3 className="font-display text-sm font-semibold text-muted">Recent history</h3>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No activity yet — try a tool above!</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {history.slice(0, 8).map((h) => (
              <li key={h._id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <span className="truncate text-e7ebf3/80">{h.message}</span>
                <span className="shrink-0 rounded-md border border-line px-2 py-0.5 text-xs text-teal">
                  {FEATURE_LABEL[h.feature] || h.feature}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
