// src/components/ConfirmDialog.jsx
import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

          {/* dialog */}
          <motion.div
            className="glass relative w-full max-w-sm p-6"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
          >
            <h3 className="font-display text-lg font-extrabold">{title}</h3>
            {message && <p className="mt-2 text-sm text-muted">{message}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-ghost !py-2 !px-4 text-sm" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98] ${
                  danger
                    ? 'bg-[#ff5f57] text-white hover:brightness-110'
                    : 'btn-primary !py-2 !px-4'
                }`}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
