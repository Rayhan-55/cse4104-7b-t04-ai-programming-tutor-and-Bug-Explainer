// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { validateName, validateEmail, validatePassword, runValidators } from '../utils/validation.js';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () =>
    runValidators({
      name: () => validateName(form.name),
      email: () => validateEmail(form.email),
      password: () => validatePassword(form.password),
    });

  const submit = async () => {
    const { errors: errs, isValid } = validate();
    setErrors(errs);
    if (!isValid) return;

    setBusy(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      toast.success('Account created! Welcome to BugTutor AI 🎉');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  // live password strength hint
  const pwLen = form.password.length;
  const pwStrength = pwLen === 0 ? '' : pwLen < 6 ? 'weak' : pwLen < 10 ? 'okay' : 'strong';
  const pwColor = { weak: 'text-[#ff9a94]', okay: 'text-amber', strong: 'text-teal' }[pwStrength];

  return (
    <main className="mx-auto flex max-w-md flex-col px-5 py-16">
      <div className="glass p-8">
        <h1 className="font-display text-2xl font-extrabold">Create your account</h1>
        <p className="mt-1 text-sm text-muted">It's free. Start learning in seconds.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              className={`input ${errors.name ? '!border-[#ff5f57]/70 focus:!ring-[#ff5f57]/20' : ''}`}
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
            />
            {errors.name && <p className="mt-1 text-xs text-[#ff9a94]">{errors.name}</p>}
          </div>
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
            {errors.password ? (
              <p className="mt-1 text-xs text-[#ff9a94]">{errors.password}</p>
            ) : (
              pwStrength && (
                <p className={`mt-1 text-xs ${pwColor}`}>
                  Password strength: {pwStrength}
                </p>
              )
            )}
          </div>
          <button className="btn-primary w-full" disabled={busy} onClick={submit}>
            {busy ? 'Creating…' : 'Sign up'}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="text-amber">Log in</Link>
        </p>
      </div>
    </main>
  );
}
