import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToastStore } from '../store';
import { t } from '../utils/i18n';

const F = "'Outfit',sans-serif";

const STATUS_OPTIONS = ['en_attente', 'refusee', 'confirmee'];
const BANK_STATUS_OPTIONS = ['', 'en_attente', 'en_cours_envoi', 'bloque', 'rejete'];

const STATUS_META = {
  en_attente:     '#D97706',
  refusee:        '#DC2626',
  confirmee:      '#16A34A',
  en_cours_envoi: '#16A34A',
  bloque:         '#DC2626',
  rejete:         '#DC2626',
};

function Pill({ status }) {
  if (!status) return null;
  const color = STATUS_META[status] || '#8896a8';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: `${color}14`, border: `1px solid ${color}55`,
      color, borderRadius: 12, padding: '2px 10px',
      fontSize: 10, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
      {t(`st_${status}`, 'fr')}
    </span>
  );
}

function RequestCard({ req, onSave }) {
  const addToast = useToastStore(s => s.addToast);
  const [status, setStatus] = useState(req.status);
  const [bankStatus, setBankStatus] = useState(req.bankInfoStatus || '');
  const [message, setMessage] = useState(req.adminMessage || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/requests/${req.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': sessionStorage.getItem('pr_admin_pw') || '',
        },
        body: JSON.stringify({ status, bankInfoStatus: bankStatus || null, adminMessage: message }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      addToast(t('admin_saved', 'fr'), 'success');
    } catch {
      addToast(t('admin_save_err', 'fr'), 'error');
    }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: F, marginBottom: 2 }}>{req.fullName || t('admin_anonymous', 'fr')}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontWeight: 800, color: 'var(--navy)', letterSpacing: '0.05em' }}>{req.trackingNumber}</span>
            {' · '}{req.bankName || '—'}
            {req.loanAmount ? ` · ${req.loanAmount}$` : ''}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
            {req.phone || '—'}{req.email ? ` · ${req.email}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Pill status={req.status} />
          <Pill status={req.bankInfoStatus} />
        </div>
      </div>

      {req.bankInfo && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8, marginBottom: 14 }}>
          {Object.entries(req.bankInfo).map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg-card2)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 2 }}>{t(`bank_${k}`, 'fr')}</div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Courier New',monospace" }}>{v}</div>
            </div>
          ))}
        </div>
      )}
      {req.bankInfoImage && (
        <img src={req.bankInfoImage} alt="Infos bancaires" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 14 }} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 5 }}>{t('admin_status_label', 'fr')}</label>
          <select className="input-luxury" style={{ padding: '10px 12px', fontSize: 14, minHeight: 42 }} value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{t(`st_${s}`, 'fr')}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 5 }}>{t('admin_bank_status_label', 'fr')}</label>
          <select className="input-luxury" style={{ padding: '10px 12px', fontSize: 14, minHeight: 42 }} value={bankStatus} onChange={e => setBankStatus(e.target.value)}>
            <option value="">{t('admin_none', 'fr')}</option>
            {BANK_STATUS_OPTIONS.filter(x => x).map(s => <option key={s} value={s}>{t(`st_${s}`, 'fr')}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 5 }}>{t('admin_msg_label', 'fr')}</label>
        <textarea className="input-luxury" rows="2" value={message} onChange={e => setMessage(e.target.value)} placeholder={t('admin_msg_placeholder', 'fr')} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={save} disabled={saving} className="btn-gold" style={{ fontSize: 11, padding: '10px 22px' }}>
          {saving ? t('admin_saving', 'fr') : t('admin_save', 'fr')}
        </button>
      </div>
    </motion.div>
  );
}

export default function Admin() {
  const addToast = useToastStore(s => s.addToast);
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('pr_admin_pw'));
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/requests', {
        headers: { 'x-admin-password': password },
      });
      const data = await res.json();
      if (!data.success) { setError(t('admin_bad_pw', 'fr')); setLoading(false); return; }
      sessionStorage.setItem('pr_admin_pw', password);
      setAuthed(true);
      setRequests(data.requests || []);
    } catch {
      setError(t('admin_login_err', 'fr'));
    }
    setLoading(false);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/requests', {
        headers: { 'x-admin-password': sessionStorage.getItem('pr_admin_pw') || '' },
      });
      const data = await res.json();
      if (!data.success) { setAuthed(false); sessionStorage.removeItem('pr_admin_pw'); setLoading(false); return; }
      setRequests(data.requests || []);
    } catch {
      addToast(t('admin_list_err', 'fr'), 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const logout = () => {
    sessionStorage.removeItem('pr_admin_pw');
    setAuthed(false);
    setRequests(null);
  };

  return (
    <>
      <section style={{
        position: 'relative', padding: '130px 6% 56px',
        background: 'linear-gradient(135deg, #0A1F44 0%, #061232 50%, #1A3A6E 100%)',
        overflow: 'hidden',
      }}>
        <div className="noise" style={{ position: 'absolute', inset: 0 }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>{t('admin_eyebrow', 'fr')}</span>
          <h1 className="hero-text" style={{ fontSize: 'clamp(32px,5vw,52px)', marginBottom: 12 }}>{t('admin_title', 'fr')}</h1>
          <p className="hero-sub" style={{ fontSize: 15, lineHeight: 1.65 }}>{t('admin_sub', 'fr')}</p>
        </motion.div>
      </section>

      <section style={{ padding: '56px 6% 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {!authed ? (
            <motion.form onSubmit={login} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="card" style={{ padding: '36px 32px', maxWidth: 420, margin: '0 auto' }}>
              <div style={{ fontSize: 32, textAlign: 'center', marginBottom: 10 }}>🔐</div>
              <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>{t('admin_login_title', 'fr')}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginBottom: 22 }}>{t('admin_login_sub', 'fr')}</p>
              <input
                className="input-luxury"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('admin_pw_placeholder', 'fr')}
                style={{ marginBottom: 14, textAlign: 'center', fontFamily: "'Courier New',monospace" }}
              />
              {error && <p style={{ fontSize: 12, color: '#DC2626', fontWeight: 600, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                {loading ? t('admin_login_loading', 'fr') : t('admin_login', 'fr')}
              </button>
            </motion.form>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 800, margin: 0 }}>
                  {t('admin_dossiers', 'fr')} {requests ? `(${requests.length})` : ''}
                </h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={refresh} className="btn-ghost" style={{ fontSize: 11, padding: '9px 20px' }}>{t('admin_refresh', 'fr')}</button>
                  <button onClick={logout} className="btn-outline" style={{ fontSize: 11, padding: '9px 20px', borderColor: 'rgba(239,68,68,0.4)' }}>{t('admin_logout', 'fr')}</button>
                </div>
              </div>

              {loading && requests === null && (
                <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>{t('admin_loading', 'fr')}</div>
              )}

              {requests && requests.length === 0 && (
                <div className="card" style={{ padding: '40px 30px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                  <p style={{ fontSize: 14, color: 'var(--text-3)' }}>{t('admin_empty', 'fr')}</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {requests && requests.map(req => (
                  <RequestCard key={req.id} req={req} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}