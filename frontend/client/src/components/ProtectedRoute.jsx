// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const toast = useToast();
  const location = useLocation();

  const denied = !loading && !user;
  const notAdmin = !loading && user && adminOnly && user.role !== 'admin';

  useEffect(() => {
    if (denied) toast.error('Please log in to access that page.');
    else if (notAdmin) toast.error('Admin access required.');
  }, [denied, notAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="flex items-center gap-3 text-muted">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-amber" />
          Loading…
        </div>
      </div>
    );
  }

  if (denied) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (notAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}
