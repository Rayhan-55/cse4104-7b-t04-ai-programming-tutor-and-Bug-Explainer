// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-md flex-col px-5 py-16">
      <div className="glass p-8">
        <h1 className="font-display text-2xl font-extrabold">Welcome back 👋</h1>
        <p className="mt-1 text-sm text-muted">Log in to keep your XP, streak, and history.</p>

        {error && <p className="mt-4 rounded-lg border border-[#ff5f57]/40 bg-[#ff5f57]/10 px-3 py-2 text-sm text-[#ff9a94]">{error}</p>}

        <div className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && submit()} />
          </div>
          <button className="btn-primary w-full" disabled={busy} onClick={submit}>
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          New here? <Link to="/register" className="text-amber">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
