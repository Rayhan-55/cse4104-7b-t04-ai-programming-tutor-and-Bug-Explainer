// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

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
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="font-display text-lg font-extrabold tracking-tight">
          <span className="text-amber">&gt;_</span> CodeMentor<span className="text-teal">AI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm transition ${
                  isActive ? 'text-amber' : 'text-muted hover:text-e7ebf3'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="hidden text-sm text-amber hover:brightness-110 sm:inline">
                  Admin
                </Link>
              )}
              <span className="hidden rounded-lg border border-line px-2.5 py-1 text-xs text-teal sm:inline">
                ⚡ {user.xp} XP · Lv {user.level}
              </span>
              <Link to="/dashboard" className="text-sm text-muted hover:text-e7ebf3">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-muted hover:text-amber">
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
      </nav>
    </header>
  );
}
