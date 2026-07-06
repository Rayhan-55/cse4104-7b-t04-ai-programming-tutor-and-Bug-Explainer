// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Tutor from './pages/Tutor.jsx';
import BugExplainer from './pages/BugExplainer.jsx';
import CompilerTranslator from './pages/CompilerTranslator.jsx';
import CodeImprover from './pages/CodeImprover.jsx';
import RepoExplainer from './pages/RepoExplainer.jsx';
import DocExplainer from './pages/DocExplainer.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <div className="min-h-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* AI tools are open to guests; progress is saved when logged in */}
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/bug-explainer" element={<BugExplainer />} />
        <Route path="/error-translator" element={<CompilerTranslator />} />
        <Route path="/code-improver" element={<CodeImprover />} />
        <Route path="/repo-explainer" element={<RepoExplainer />} />
        <Route path="/doc-explainer" element={<DocExplainer />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div className="p-16 text-center text-muted">Page not found.</div>} />
      </Routes>
    </div>
  );
}
