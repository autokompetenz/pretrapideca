import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToastStore, useLangStore } from '../store';
import { t } from '../utils/i18n';

const F = "'Outfit',sans-serif";

function statusMeta(status) {
  const map = {
    en_attente:     { color: '#D97706', bg: 'rgba(245,166,35,0.1)', border: 'rgba(245,166,35,0.3)' },
    refusee:        { color: '#DC2626', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)' },
    confirmee:      { color: '#16A34A', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)' },
    en_cours_envoi: { color: '#16A34A', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)' },
    en_attente_env: { color: '#D97706', bg: 'rgba(245,166,35,0.1)', border: 'rgba(245,166,35,0.3)' },
    en_attente_bank:{ color: '#D97706', bg: 'rgba(245,166,35,0.1)', border: 'rgba(245,166,35,0.3)' },
    bloque:         { color: '#DC2626', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)' },
    rejete:         { color: '#DC2626', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)' },
  };
  return map[status] || { color: '#8896a8', bg: 'rgba(136,150,168,0.1)', border: 'rgba(136,150,168,0.3)' };
}

function StatusBadge({ status }) {
  const m = statusMeta(status);
  const label = t(`st_${status}`, 'fr');
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: m.bg, border: `1px solid ${m.border}`,
      borderRadius: 20, padding: '5px 14px',
      fontSize: 12, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
      color: m.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.color }} />
      {label}
    </span>
  );
}

function StepItem({ step, label, desc, state, icon }) {
  const isDone = state === 'done';
  const isActive = state === 'active';
  const isErr = state === 'error';
  const color = isErr ? '#DC2626' : (isDone ? '#16A34A' : isActive ? 'var(--gold)' : 'var(--text-3)');
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 800,
        background: isErr ? 'rgba(239,68,68,0.1)' : isActive ? 'var(--gold)' : isDone ? 'rgba(34,197,94,0.12)' : 'var(--bg-card2)',
        color: isErr ? '#DC2626' : isActive ? '#0A1F44' : isDone ? '#16A34A' : 'var(--text-3)',
        border: `2px solid ${isErr ? '#DC2626' : isActive ? 'var(--gold)' : isDone ? 'rgba(34,197,94,0.35)' : 'var(--border-2)'}`,
      }}>
        {isDone ? '✓' : isErr ? '✕' : isActive ? icon : icon}
      </div>
      <div style={{ minWidth: 0, paddingTop: 2 }}>
        <div style={{ fontSize: 15, fontWeight: 800, fontFamily: F, color: isErr ? '#DC2626' : 'var(--text)' }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3, lineHeight: 1.6 }}>{desc}</div>}
      </div>
    </div>
  );
}

export default function Tracking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const addToast = useToastStore(s => s.addToast);
  const { lang } = useLangStore();
  const l = lang || 'fr';

  const [input, setInput] = useState(params.get('num') || '');
  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '', transitNumber: '', institutionNumber: '' });
  const [bankImage, setBankImage] = useState('');
  const [sendingBankInfo, setSendingBankInfo] = useState(false);

  const load = useCallback(async (num) => {
    if (!num) { setDossier(null); setNotFound(false); return; }
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(num.trim())}`);
      const data = await res.json();
      if (!data.success) { setDossier(null); setNotFound(true); return; }
      setDossier(data);
      setInput(num.trim().toUpperCase());
    } catch {
      setNotFound(true);
      setDossier(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.get('num')) load(params.get('num'));
  }, [params, load]);

  const handleLookup = (e) => {
    e.preventDefault();
    load(input);
  };

  const readImage = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { addToast(t('bank_img_size', l), 'error'); return; }
    const reader = new FileReader();
    reader.onload = () => setBankImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBankInfo = async () => {
    const manualOk = bankForm.bankName.trim() && bankForm.accountNumber.trim() && bankForm.transitNumber.trim() && bankForm.institutionNumber.trim();
    if (!manualOk && !bankImage) { addToast(t('bank_required', l), 'error'); return; }
    if (sendingBankInfo) return;
    setSendingBankInfo(true);
    try {
      const res = await fetch(`/api/tracking/${dossier.trackingNumber}/bank-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: bankForm.bankName,
          accountNumber: bankForm.accountNumber,
          transitNumber: bankForm.transitNumber,
          institutionNumber: bankForm.institutionNumber,
          bankInfoImage: bankImage,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      addToast(t('bank_sent', l), 'success');
      load(dossier.trackingNumber);
    } catch (err) {
      addToast(t('bank_sent_err', l), 'error');
    }
    setSendingBankInfo(false);
  };

  const inputErr = notFound;
  const showBankForm = dossier && dossier.status === 'confirmee' && !dossier.bankInfo && !dossier.bankInfoImage;

  return (
    <>
      <section style={{
        position: 'relative', padding: '130px 6% 56px',
        background: 'linear-gradient(135deg, #0A1F44 0%, #061232 50%, #1A3A6E 100%)',
        overflow: 'hidden',
      }}>
        <div className="noise" style={{ position: 'absolute', inset: 0 }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-eyebrow" style={{ color: 'var(--gold)' }}>{t('track_eyebrow', l)}</span>
          <h1 className="hero-text" style={{ fontSize: 'clamp(32px,5vw,52px)', marginBottom: 12 }}>{t('track_title', l)}</h1>
          <p className="hero-sub" style={{ fontSize: 15, lineHeight: 1.65 }}>{t('track_sub', l)}</p>
        </motion.div>
      </section>

      <section style={{ padding: '56px 6% 80px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <form onSubmit={handleLookup} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              className="input-luxury"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('track_placeholder', l)}
              style={{ flex: 1, minWidth: 200, textTransform: 'uppercase', fontFamily: "'Courier New',monospace", fontWeight: 800, letterSpacing: '0.08em', borderColor: inputErr ? '#DC2626' : undefined }}
            />
            <button type="submit" className="btn-gold" style={{ fontSize: 12, padding: '13px 26px', whiteSpace: 'nowrap' }}>
              {loading ? t('track_loading', l) : t('track_btn', l)}
            </button>
          </form>
          {inputErr && (
            <p style={{ fontSize: 12, color: '#DC2626', marginTop: 10, fontWeight: 600 }}>{t('track_notfound', l)}</p>
          )}

          {dossier && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div className="card" style={{ padding: '28px 26px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>{t('track_num', l)}</div>
                    <div style={{ fontFamily: "'Courier New',monospace", fontSize: 24, fontWeight: 800, color: 'var(--navy)', letterSpacing: '0.08em' }}>
                      {dossier.trackingNumber}
                    </div>
                  </div>
                  <StatusBadge status={dossier.bankInfoStatus || dossier.status} />
                </div>
                {dossier.email && (
                  <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
                    {t('track_sent_to', l)} <strong style={{ color: 'var(--text-2)' }}>{dossier.email}</strong>
                  </p>
                )}
              </div>

              <div className="card" style={{ padding: '26px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <StepItem step="1" icon="📝" state="done" label={t('st_step1', l)} desc={t('st_step1_desc', l)} />
                  <StepItem
                    step="2" icon="🕒" state={dossier.status === 'refusee' ? 'error' : dossier.status === 'confirmee' ? 'done' : 'active'}
                    label={t('st_step2', l)}
                    desc={dossier.status === 'refusee' ? t('st_step2_refused', l) : dossier.status === 'confirmee' ? t('st_step2_ok', l) : t('st_step2_pending', l)}
                  />
                  <StepItem
                    step="3" icon="🏦" state={dossier.bankInfoStatus || dossier.bankInfo ? 'done' : showBankForm ? 'active' : 'idle'}
                    label={t('st_step3', l)}
                    desc={dossier.bankInfoStatus ? '' : showBankForm ? t('st_step3_todo', l) : t('st_step3_idle', l)}
                  />
                  {dossier.bankInfoStatus && (
                    <StepItem
                      step="4" icon="💸"
                      state={['bloque', 'rejete'].includes(dossier.bankInfoStatus) ? 'error' : 'active'}
                      label={t('st_step4', l)}
                      desc={t(`st_${dossier.bankInfoStatus}`, l)}
                    />
                  )}
                </div>
              </div>

              {dossier.adminMessage && (
                <div style={{
                  background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.25)',
                  borderLeft: '3px solid var(--gold)', borderRadius: 10, padding: '18px 20px',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
                    {t('track_admin_msg', l)}
                  </div>
                  <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{dossier.adminMessage}</p>
                </div>
              )}

              {dossier.bankInfo && (
                <div className="card" style={{ padding: '22px 26px' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
                    {t('bank_info_sent_title', l)}
                  </div>
                  {dossier.bankInfoImage ? (
                    <img src={dossier.bankInfoImage} alt="Infos bancaires" style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)' }} />
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {Object.entries(dossier.bankInfo).map(([k, v]) => (
                        <div key={k} style={{ background: 'var(--bg-card2)', borderRadius: 8, padding: '12px 14px' }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 3 }}>{t(`bank_${k}`, l)}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: "'Courier New',monospace" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showBankForm && (
                <div className="card" style={{ padding: '28px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏦</span>
                    <div>
                      <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 800, margin: 0 }}>{t('bank_title', l)}</h3>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-3)' }}>{t('bank_title_desc', l)}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Field label={t('bank_bankName', l)} value={bankForm.bankName} onChange={v => setBankForm(f => ({ ...f, bankName: v }))} placeholder="Banque TD" />
                    <Field label={t('bank_accountNumber', l)} value={bankForm.accountNumber} onChange={v => setBankForm(f => ({ ...f, accountNumber: v }))} placeholder="012345678" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Field label={t('bank_transitNumber', l)} value={bankForm.transitNumber} onChange={v => setBankForm(f => ({ ...f, transitNumber: v }))} placeholder="12345" />
                      <Field label={t('bank_institutionNumber', l)} value={bankForm.institutionNumber} onChange={v => setBankForm(f => ({ ...f, institutionNumber: v }))} placeholder="004" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '18px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t('bank_or', l)}</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>

                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    padding: '16px', borderRadius: 8, cursor: 'pointer',
                    border: `1.5px dashed ${bankImage ? '#16A34A' : 'var(--border-2)'}`,
                    background: bankImage ? 'rgba(34,197,94,0.05)' : 'var(--bg-input)',
                    transition: 'all 0.2s',
                  }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => readImage(e.target.files[0])} />
                    <span style={{ fontSize: 20 }}>{bankImage ? '✅' : '📷'}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 600, textAlign: 'center' }}>
                      {bankImage ? t('bank_img_ok', l) : t('bank_img_upload', l)}
                    </span>
                  </label>
                  {bankImage && (
                    <img src={bankImage} alt="Aperçu" style={{ marginTop: 12, width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)' }} />
                  )}

                  <button onClick={handleBankInfo} disabled={sendingBankInfo} className="btn-gold"
                    style={{ width: '100%', marginTop: 20, padding: '14px', fontSize: 13, justifyContent: 'center' }}>
                    {sendingBankInfo ? t('bank_sending', l) : t('bank_submit', l)}
                  </button>
                </div>
              )}

              {dossier.status === 'refusee' && (
                <div className="card" style={{ padding: '26px', textAlign: 'center', borderColor: 'rgba(239,68,68,0.3)' }}>
                  <div style={{ fontSize: 34, marginBottom: 10 }}>😔</div>
                  <h3 style={{ fontFamily: F, fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{t('refused_title', l)}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 20 }}>{t('refused_desc', l)}</p>
                  <button onClick={() => navigate('/demande')} className="btn-primary" style={{ fontSize: 12, padding: '12px 26px' }}>
                    {t('refused_cta', l)}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {!dossier && !loading && !notFound && (
            <div className="card" style={{ marginTop: 36, padding: '40px 30px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🧭</div>
              <h3 style={{ fontFamily: F, fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{t('track_empty_title', l)}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto' }}>{t('track_empty_desc', l)}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 5, color: 'var(--text-2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
      <input className="input-luxury" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}