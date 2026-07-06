// src/context/ToastContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'info') => {
      const id = ++idCounter;
      setToasts((t) => [...t, { id, message, type }]);
      // auto-dismiss after 3.5s
      setTimeout(() => remove(id), 3500);
    },
    [remove]
  );

  const toast = {
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
    info: (m) => push(m, 'info'),
  };

  const style = {
    success: 'border-teal/40 bg-teal/10 text-teal',
    error: 'border-[#ff5f57]/40 bg-[#ff5f57]/10 text-[#ff9a94]',
    info: 'border-line bg-panel/80 text-e7ebf3',
  };

  const icon = { success: '✓', error: '✕', info: 'ℹ' };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast stack — fixed bottom-right, responsive */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md ${style[t.type]}`}
            role="status"
          >
            <span className="text-base font-bold">{icon[t.type]}</span>
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="text-muted transition hover:text-e7ebf3"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
