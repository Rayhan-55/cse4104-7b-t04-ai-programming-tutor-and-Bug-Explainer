// src/pages/Admin.jsx
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { AdminAPI } from '../api/client.js';

const FEATURE_LABEL = {
  tutor: 'Tutor',
  bugExplainer: 'Bug',
  errorTranslator: 'Error',
  codeImprover: 'Improve',
};

function Stat({ label, value }) {
  return (
    <div className="glass p-5">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold text-amber">{value}</p>
    </div>
  );
}

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('users');

  const load = () => {
    AdminAPI.stats().then(setStats).catch((e) => setError(e?.response?.data?.message || 'লোড করা গেল না।'));
    AdminAPI.users().then(setUsers).catch(() => {});
    AdminAPI.activity().then(setActivity).catch(() => {});
  };
  useEffect(load, []);

  const toggleRole = async (u) => {
    const next = u.role === 'admin' ? 'student' : 'admin';
    try {
      const updated = await AdminAPI.setRole(u._id, next);
      setUsers((prev) => prev.map((x) => (x._id === u._id ? updated : x)));
    } catch (e) {
      alert(e?.response?.data?.message || 'পরিবর্তন করা গেল না।');
    }
  };

  const palette = ['#f5a524', '#3dd7c0', '#a78bfa', '#8a93a6'];
  const chartData = (stats?.byFeature || []).map((f) => ({
    name: FEATURE_LABEL[f.feature] || f.feature,
    count: f.count,
  }));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="font-display text-2xl font-extrabold">🛠️ Admin Panel</h1>
      <p className="mt-1 text-sm text-muted">পুরো প্ল্যাটফর্মের ইউজার ও অ্যাক্টিভিটি এখানে।</p>

      {error && (
        <p className="mt-4 rounded-lg border border-[#ff5f57]/40 bg-[#ff5f57]/10 px-3 py-2 text-sm text-[#ff9a94]">{error}</p>
      )}

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total users" value={stats?.users ?? '—'} />
        <Stat label="Admins" value={stats?.admins ?? '—'} />
        <Stat label="AI activities" value={stats?.activities ?? '—'} />
        <Stat label="Top XP" value={stats?.topUsers?.[0]?.xp ?? '—'} />
      </div>

      {/* Feature usage chart */}
      <div className="glass mt-6 p-5">
        <h3 className="font-display text-sm font-semibold text-muted">Tool usage</h3>
        <div className="mt-4 h-52">
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

      {/* Tabs */}
      <div className="mt-6 flex gap-2">
        {['users', 'activity'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm transition ${
              tab === t ? 'bg-amber text-ink font-semibold' : 'border border-line text-muted hover:text-e7ebf3'
            }`}
          >
            {t === 'users' ? `Users (${users.length})` : `Recent activity (${activity.length})`}
          </button>
        ))}
      </div>

      {/* Users table */}
      {tab === 'users' && (
        <div className="glass mt-4 overflow-x-auto p-2">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-muted">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">XP</th>
                <th className="px-3 py-2">Lvl</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-line">
                  <td className="px-3 py-2.5 text-e7ebf3/90">{u.name}</td>
                  <td className="px-3 py-2.5 text-muted">{u.email}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-md px-2 py-0.5 text-xs ${u.role === 'admin' ? 'bg-amber/15 text-amber' : 'bg-white/5 text-muted'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-teal">{u.xp}</td>
                  <td className="px-3 py-2.5 text-muted">{u.level}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button onClick={() => toggleRole(u)} className="rounded-lg border border-line px-2.5 py-1 text-xs transition hover:border-amber/60 hover:text-amber">
                      {u.role === 'admin' ? 'Make student' : 'Make admin'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="6" className="px-3 py-6 text-center text-muted">কোনো ইউজার নেই (DB connect করো)।</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Activity list */}
      {tab === 'activity' && (
        <div className="glass mt-4 p-3">
          <ul className="divide-y divide-line">
            {activity.map((a) => (
              <li key={a._id} className="flex items-center justify-between gap-4 px-2 py-2.5 text-sm">
                <span className="truncate text-e7ebf3/80">
                  <span className="text-muted">{a.userId?.name || 'Guest'}:</span> {a.message}
                </span>
                <span className="shrink-0 rounded-md border border-line px-2 py-0.5 text-xs text-teal">
                  {FEATURE_LABEL[a.feature] || a.feature}
                </span>
              </li>
            ))}
            {activity.length === 0 && <li className="px-2 py-6 text-center text-muted">কোনো অ্যাক্টিভিটি নেই।</li>}
          </ul>
        </div>
      )}
    </main>
  );
}
