// src/pages/Profile.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { AuthAPI } from '../api/client.js';
import { validateName, validateOptionalPassword, runValidators } from '../utils/validation.js';

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-2.5 last:border-none">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-semibold text-e7ebf3">{value}</span>
    </div>
  );
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ name: user?.name || '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  // level progress: how far into the current level (0-100)
  const xp = user?.xp ?? 0;
  const level = user?.level ?? 1;
  const intoLevel = xp % 100;
  const toNext = 100 - intoLevel;

  const save = async () => {
    const { errors: errs, isValid } = runValidators({
      name: () => validateName(form.name),
      password: () => validateOptionalPassword(form.password),
    });
    setErrors(errs);
    if (!isValid) return;

    // nothing changed?
    if (form.name.trim() === user.name && !form.password) {
      toast.info('Nothing to update.');
      return;
    }

    setBusy(true);
    try {
      const body = { name: form.name.trim() };
      if (form.password) body.password = form.password;
      const { user: updated } = await AuthAPI.updateProfile(body);
      setUser(updated);
      setForm({ name: updated.name, password: '' });
      toast.success('Profile updated successfully ✓');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const initials = (user?.name || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center"
      >
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber text-xl font-extrabold text-ink">
          {initials}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-display text-xl font-extrabold">{user?.name}</h1>
          <p className="text-sm text-muted">{user?.email}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs capitalize text-teal">
              {user?.role || 'student'}
            </span>
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
              {user?.subscription || 'free'} plan
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* stats */}
        <div className="glass p-6">
          <h3 className="font-display text-sm font-semibold text-muted">Progress stats</h3>
          <div className="mt-3">
            <StatRow label="Total XP" value={xp} />
            <StatRow label="Current level" value={`Level ${level}`} />
            <StatRow label="Daily streak" value={`${user?.streak ?? 0} days 🔥`} />
          </div>

          {/* level progress bar */}
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink/60">
              <div className="h-2 rounded-full bg-amber transition-all" style={{ width: `${intoLevel}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between text-xs text-muted">
              <span>Level {level}</span>
              <span>{toNext} XP to Level {level + 1}</span>
            </div>
          </div>
        </div>

        {/* edit form */}
        <div className="glass p-6">
          <h3 className="font-display text-sm font-semibold text-muted">Edit profile</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">Full name</label>
              <input
                className={`input ${errors.name ? '!border-[#ff5f57]/70 focus:!ring-[#ff5f57]/20' : ''}`}
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
              {errors.name && <p className="mt-1 text-xs text-[#ff9a94]">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Email address</label>
              <input className="input cursor-not-allowed opacity-60" value={user?.email || ''} disabled />
              <p className="mt-1 text-xs text-muted">Email cannot be changed — it is your account ID.</p>
            </div>
            <div>
              <label className="label">New password</label>
              <input
                className={`input ${errors.password ? '!border-[#ff5f57]/70 focus:!ring-[#ff5f57]/20' : ''}`}
                type="password"
                placeholder="Leave blank to keep current"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
              />
              {errors.password && <p className="mt-1 text-xs text-[#ff9a94]">{errors.password}</p>}
            </div>
            <button className="btn-primary w-full" disabled={busy} onClick={save}>
              {busy ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
