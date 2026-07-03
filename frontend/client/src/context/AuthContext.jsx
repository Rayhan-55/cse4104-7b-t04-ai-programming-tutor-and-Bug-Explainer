// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we have a token, fetch the user.
  useEffect(() => {
    const token = localStorage.getItem('cm_token');
    if (!token) return setLoading(false);
    AuthAPI.me()
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('cm_token'))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = ({ user, token }) => {
    localStorage.setItem('cm_token', token);
    setUser(user);
  };

  const login = async (email, password) => handleAuth(await AuthAPI.login({ email, password }));
  const register = async (name, email, password) =>
    handleAuth(await AuthAPI.register({ name, email, password }));
  const logout = () => {
    localStorage.removeItem('cm_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
