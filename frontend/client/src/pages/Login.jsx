// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { validateEmail, validatePassword, runValidators } from '../utils/validation.js';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () =>
    runValidators({
      email: () => validateEmail(form.email),
      password: () => validatePassword(form.password),
    });

  const submit = async () => {
    const { errors: errs, isValid } = validate();
    setErrors(errs);
    if (!isValid) return;

    setBusy(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-md flex-col px-5 py-16">
      <div className="glass p-8">
        <h1 className="font-display text-2xl font-extrabold">Welcome back 👋</h1>
        <p className="mt-1 text-sm text-muted">Log in to keep your XP, streak, and history.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              className={`input ${errors.email ? '!border-[#ff5f57]/70 focus:!ring-[#ff5f57]/20' : ''}`}
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
            {errors.email && <p className="mt-1 text-xs text-[#ff9a94]">{errors.email}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className={`input ${errors.password ? '!border-[#ff5f57]/70 focus:!ring-[#ff5f57]/20' : ''}`}
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            {errors.password && <p className="mt-1 text-xs text-[#ff9a94]">{errors.password}</p>}
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
