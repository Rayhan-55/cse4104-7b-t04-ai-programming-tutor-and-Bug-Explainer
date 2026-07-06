// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

const links = [
  { to: '/tutor', label: 'Tutor' },
  { to: '/bug-explainer', label: 'Bug Explainer' },
  { to: '/error-translator', label: 'Error Translator' },
  { to: '/code-improver', label: 'Code Improver' },
  { to: '/repo-explainer', label: 'Repo Explainer' },
  { to: '/doc-explainer', label: 'PDF & Image' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const doLogout = () => {
    logout();
    setConfirmLogout(false);
    setMenuOpen(false);
    toast.info('You have been logged out.');
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-1.5 text-sm transition ${
      isActive ? 'text-amber' : 'text-muted hover:text-e7ebf3'
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="font-display text-lg font-extrabold tracking-tight" onClick={() => setMenuOpen(false)}>
          <span className="text-amber">&gt;_</span> BugTutor<span className="text-teal">AI</span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm text-amber hover:brightness-110">
                  Admin
                </Link>
              )}
              <span className="rounded-lg border border-line px-2.5 py-1 text-xs text-teal">
                ⚡ {user.xp} XP · Lv {user.level}
              </span>
              <Link to="/dashboard" className="text-sm text-muted hover:text-e7ebf3">
                Dashboard
              </Link>
              <Link to="/profile" className="text-sm text-muted hover:text-e7ebf3">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={() => setConfirmLogout(true)} className="text-sm text-muted hover:text-amber">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted hover:text-e7ebf3">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-1.5 text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* mobile hamburger button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-e7ebf3 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* mobile dropdown menu */}
      {menuOpen && (
        <div className="border-t border-line bg-ink/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 border-t border-line pt-4">
            {user ? (
              <div className="flex flex-col gap-2">
                <span className="rounded-lg border border-line px-2.5 py-1 text-xs text-teal w-fit">
                  ⚡ {user.xp} XP · Lv {user.level}
                </span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm text-amber" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <Link to="/dashboard" className="text-sm text-muted" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/profile" className="text-sm text-muted" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
                <button onClick={() => setConfirmLogout(true)} className="text-left text-sm text-muted hover:text-amber">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="text-sm text-muted" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !px-4 !py-1.5 text-sm w-fit"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmLogout}
        title="Log out?"
        message="You will need to log in again to access your dashboard and saved history."
        confirmLabel="Log out"
        cancelLabel="Stay"
        onConfirm={doLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </header>
  );
}
