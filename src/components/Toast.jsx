import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../store';

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  const colors = {
    success: { bg: 'rgba(22,163,74,0.1)', border: 'rgba(22,163,74,0.3)', dot: '#16A34A' },
    error:   { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   dot: '#DC2626' },
    info:    { bg: 'rgba(245,166,35,0.1)',  border: 'rgba(245,166,35,0.3)',  dot: '#F5A623' },
  };

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(t => {
          const c = colors[t.type] || colors.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              onClick={() => removeToast(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 20px', borderRadius: 10,
                background: c.bg, border: `1px solid ${c.border}`,
                backdropFilter: 'blur(12px)',
                cursor: 'pointer', maxWidth: 400,
                boxShadow: 'var(--shadow-md)',
              }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', fontFamily: "'Inter',sans-serif" }}>
                {t.message}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
