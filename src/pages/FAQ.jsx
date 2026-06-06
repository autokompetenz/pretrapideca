import { useState } from 'react';
import { motion } from 'framer-motion';

function FAQItem({ question, answer, open, onClick }) {
  return (
    <div className="card" style={{ marginBottom:12, overflow:'hidden' }}>
      <button onClick={onClick} style={{
        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'20px 24px', background:'none', border:'none', cursor:'pointer',
        fontFamily:"'Outfit',sans-serif", fontSize:15, fontWeight:600, color:'var(--text)',
        textAlign:'left', transition:'color 0.2s', minHeight:56,
      }}>
        <span style={{ flex:1, paddingRight:12 }}>{question}</span>
        <span style={{
          fontSize:14, color:'var(--gold)', fontWeight:700, flexShrink:0,
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition:'transform 0.3s var(--ease)',
        }}>+</span>
      </button>
      <motion.div initial={false} animate={{ height:open?'auto':0, opacity:open?1:0 }} transition={{ duration:0.25, ease:[0.16,1,0.3,1] }} style={{ overflow:'hidden' }}>
        <div style={{ padding:'0 24px 20px' }}>
          <p style={{ fontSize:14, color:'var(--text-3)', lineHeight:1.7 }}>{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [sent, setSent] = useState(false);

  const faqs = [
    { q:'Quels sont les critères pour obtenir un prêt ?', a:"Il vous suffit d'avoir au moins 18 ans, un revenu mensuel stable et un compte bancaire valide. Aucune condition de crédit préalable n'est requise." },
    { q:'Combien de temps faut-il pour recevoir une réponse ?', a:'Nous traitons votre demande sous 24h maximum. Dans la plupart des cas, vous recevez une réponse en quelques heures.' },
    { q:'Quels sont les montants proposés ?', a:'Nous proposons des prêts de 500$ à 50 000$, avec des durées de remboursement flexibles de 6 à 60 mois.' },
    { q:'Y a-t-il des frais cachés ?', a:'Non, aucun frais caché. Tous les frais sont clairement indiqués avant la signature de votre contrat. Transparence totale.' },
    { q:'Puis-je faire une demande en couple ?', a:"Oui, vous pouvez faire une demande conjointe avec votre conjoint(e). Cela peut augmenter votre capacité d'emprunt." },
    { q:'Comment se fait le remboursement ?', a:'Les remboursements sont effectués par prélèvement automatique mensuel sur votre compte bancaire, à une date convenue.' },
    { q:'Que se passe-t-il en cas de retard de paiement ?', a:"En cas de difficulté, contactez-nous immédiatement. Nous étudions des solutions adaptées à votre situation." },
    { q:'Mes données sont-elles sécurisées ?', a:'Absolument. Toutes vos données sont cryptées et protégées conformément au RGPD. Nous ne partageons jamais vos informations avec des tiers.' },
  ];

  const handleSubmit = (e) => { e.preventDefault(); setSent(true); setForm({ name:'', email:'', message:'' }); setTimeout(() => setSent(false), 4000); };

  const fadeUp = { initial:{ opacity:0, y:32 }, whileInView:{ opacity:1, y:0 }, viewport:{ once:true, margin:'-40px' }, transition:{ duration:0.65, ease:[0.16,1,0.3,1] } };

  return (
    <>
      <section style={{
        position:'relative', padding:'130px 6% 60px',
        background:'linear-gradient(135deg, #0A1F44 0%, #061232 50%, #1A3A6E 100%)',
        overflow:'hidden',
      }}>
        <div className="noise" style={{ position:'absolute', inset:0 }} />
        <div style={{ position:'absolute', top:'-15%', right:'-8%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, ease:[0.16,1,0.3,1] }} style={{ position:'relative', zIndex:1 }}>
          <span className="section-eyebrow" style={{ color:'var(--gold)' }}>Contact</span>
          <h1 className="hero-text" style={{ fontSize:'clamp(32px,5vw,52px)', marginBottom:12 }}>FAQ & Contact</h1>
          <p className="hero-sub" style={{ fontSize:15, lineHeight:1.65 }}>Vous avez des questions ? Consultez notre FAQ ou contactez-nous directement.</p>
        </motion.div>
      </section>

      <section style={{ padding:'60px 6% 40px', background:'var(--bg)' }}>
        <div style={{ maxWidth:740, margin:'0 auto' }}>
          <motion.div {...fadeUp} style={{ marginBottom:36 }}>
            <span className="section-eyebrow">FAQ</span>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(24px,3vw,32px)', fontWeight:900 }}>Questions fréquentes</h2>
          </motion.div>
          <div>{faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} open={openIndex===i} onClick={() => setOpenIndex(openIndex===i ? null : i)} />
          ))}</div>
        </div>
      </section>

      <section style={{ padding:'60px 6%', background:'var(--bg-card2)' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign:'center', marginBottom:36 }}>
            <span className="section-eyebrow">Contact</span>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(24px,3vw,32px)', fontWeight:900, marginBottom:8 }}>Envoyez-nous un message</h2>
            <p style={{ fontSize:14, color:'var(--text-3)' }}>Notre équipe vous répondra sous 24h</p>
          </motion.div>

          {sent ? (
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="card" style={{ padding:'48px 32px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:800, marginBottom:8 }}>Message envoyé !</h3>
              <p style={{ fontSize:14, color:'var(--text-3)' }}>Notre équipe vous recontactera dans les plus brefs délais.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <Field label="Nom complet" value={form.name} onChange={v => setForm({...form, name:v})} placeholder="Jean Dupont" />
                <Field label="Email" value={form.email} onChange={v => setForm({...form, email:v})} placeholder="jean@exemple.com" type="email" />
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:6, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Message</label>
                <textarea className="input-luxury" placeholder="Votre message..." rows={4} value={form.message} onChange={e => setForm({...form, message:e.target.value})} required />
              </div>
              <button type="submit" className="btn-primary" style={{ alignSelf:'flex-start', fontSize:12, padding:'13px 32px' }}>Envoyer →</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, value, onChange, placeholder, type='text' }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:5, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</label>
      <input className="input-luxury" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
