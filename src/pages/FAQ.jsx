import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLangStore } from '../store';
import { t } from '../utils/i18n';

const FAQ_DATA = {
  q1: { fr:'Quels sont les critères pour obtenir un prêt ?', en:'What are the requirements to get a loan?', it:'Quali sono i requisiti per ottenere un prestito?', es:'¿Cuáles son los requisitos para obtener un préstamo?', de:'Welche Voraussetzungen gibt es für einen Kredit?', pt:'Quais são os requisitos para obter um empréstimo?' },
  a1: { fr:"Il vous suffit d'avoir au moins 18 ans, un revenu mensuel stable et un compte bancaire valide. Aucune condition de crédit préalable n'est requise.", en:'You must be at least 18, have a stable monthly income and a valid bank account. No prior credit check required.', it:'Devi avere almeno 18 anni, un reddito mensile stabile e un conto bancario valido. Nessun controllo di credito preliminare richiesto.', es:'Debes tener al menos 18 años, ingresos mensuales estables y una cuenta bancaria válida. No se requiere verificación de crédito previa.', de:'Sie müssen mindestens 18 Jahre alt sein, ein stabiles monatliches Einkommen und ein gültiges Bankkonto haben. Keine vorherige Bonitätsprüfung erforderlich.', pt:'Você deve ter pelo menos 18 anos, renda mensal estável e uma conta bancária válida. Nenhuma verificação de crédito prévia é necessária.' },
  q2: { fr:'Combien de temps faut-il pour recevoir une réponse ?', en:'How long does it take to get a response?', it:'Quanto tempo ci vuole per ricevere una risposta?', es:'¿Cuánto tiempo se tarda en recibir una respuesta?', de:'Wie lange dauert es, bis ich eine Antwort erhalte?', pt:'Quanto tempo leva para receber uma resposta?' },
  a2: { fr:'Nous traitons votre demande sous 24h maximum. Dans la plupart des cas, vous recevez une réponse en quelques heures.', en:'We process your application within 24h. In most cases, you get a response within hours.', it:'Elaboriamo la tua richiesta entro 24h. Nella maggior parte dei casi, ricevi una risposta in poche ore.', es:'Procesamos tu solicitud en un máximo de 24h. En la mayoría de los casos, recibes respuesta en pocas horas.', de:'Wir bearbeiten Ihren Antrag innerhalb von 24h. In den meisten Fällen erhalten Sie innerhalb weniger Stunden eine Antwort.', pt:'Processamos sua solicitação em até 24h. Na maioria dos casos, você recebe uma resposta em algumas horas.' },
  q3: { fr:'Quels sont les montants proposés ?', en:'What loan amounts are available?', it:'Quali importi sono disponibili?', es:'¿Qué montos se ofrecen?', de:'Welche Beträge werden angeboten?', pt:'Quais valores são oferecidos?' },
  a3: { fr:'Nous proposons des prêts de 500$ à 50 000$, avec des durées de remboursement flexibles de 6 à 60 mois.', en:'We offer loans from $500 to $50,000, with flexible repayment terms from 6 to 60 months.', it:'Offriamo prestiti da 500$ a 50.000$, con termini di rimborso flessibili da 6 a 60 mesi.', es:'Ofrecemos préstamos de 500$ a 50.000$, con plazos de reembolso flexibles de 6 a 60 meses.', de:'Wir bieten Kredite von 500$ bis 50.000$ mit flexiblen Laufzeiten von 6 bis 60 Monaten.', pt:'Oferecemos empréstimos de $500 a $50.000, com prazos de pagamento flexíveis de 6 a 60 meses.' },
  q4: { fr:'Y a-t-il des frais cachés ?', en:'Are there any hidden fees?', it:'Ci sono costi nascosti?', es:'¿Hay comisiones ocultas?', de:'Gibt es versteckte Gebühren?', pt:'Existem taxas ocultas?' },
  a4: { fr:'Non, aucun frais caché. Tous les frais sont clairement indiqués avant la signature de votre contrat. Transparence totale.', en:'No hidden fees. All costs are clearly stated before you sign. Total transparency.', it:'Nessun costo nascosto. Tutti i costi sono chiaramente indicati prima della firma. Trasparenza totale.', es:'Sin comisiones ocultas. Todos los costes se indican claramente antes de firmar. Transparencia total.', de:'Keine versteckten Gebühren. Alle Kosten werden vor Vertragsunterzeichnung klar angegeben. Volle Transparenz.', pt:'Sem taxas ocultas. Todos os custos são claramente indicados antes da assinatura. Transparência total.' },
  q5: { fr:'Puis-je faire une demande en couple ?', en:'Can I apply as a couple?', it:'Posso fare una richiesta in coppia?', es:'¿Puedo solicitar en pareja?', de:'Kann ich als Paar beantragen?', pt:'Posso solicitar em casal?' },
  a5: { fr:"Oui, vous pouvez faire une demande conjointe avec votre conjoint(e). Cela peut augmenter votre capacité d'emprunt.", en:'Yes, you can apply jointly with your spouse. This may increase your borrowing capacity.', it:'Sì, puoi fare una richiesta congiunta con il tuo coniuge. Questo può aumentare la tua capacità di prestito.', es:'Sí, puedes solicitar conjuntamente con tu cónyuge. Esto puede aumentar tu capacidad de préstamo.', de:'Ja, Sie können gemeinsam mit Ihrem Ehepartner einen Antrag stellen. Dies kann Ihre Kreditfähigkeit erhöhen.', pt:'Sim, você pode solicitar em conjunto com seu cônjuge. Isso pode aumentar sua capacidade de empréstimo.' },
  q6: { fr:'Comment se fait le remboursement ?', en:'How does repayment work?', it:'Come funziona il rimborso?', es:'¿Cómo se realiza el reembolso?', de:'Wie funktioniert die Rückzahlung?', pt:'Como funciona o reembolso?' },
  a6: { fr:'Les remboursements sont effectués par prélèvement automatique mensuel sur votre compte bancaire, à une date convenue.', en:'Repayments are made by monthly automatic debit from your bank account on an agreed date.', it:'I rimborsi vengono effettuati tramite addebito automatico mensile sul tuo conto bancario in una data concordata.', es:'Los reembolsos se realizan mediante domiciliación mensual en tu cuenta bancaria en una fecha acordada.', de:'Die Rückzahlung erfolgt per monatlicher Lastschrift von Ihrem Bankkonto zu einem vereinbarten Datum.', pt:'Os reembolsos são feitos por débito automático mensal em sua conta bancária em uma data acordada.' },
  q7: { fr:'Que se passe-t-il en cas de retard de paiement ?', en:'What happens if I miss a payment?', it:'Cosa succede in caso di ritardo nel pagamento?', es:'¿Qué pasa si me retraso en un pago?', de:'Was passiert bei Zahlungsverzug?', pt:'O que acontece em caso de atraso no pagamento?' },
  a7: { fr:"En cas de difficulté, contactez-nous immédiatement. Nous étudions des solutions adaptées à votre situation.", en:'If you have difficulties, contact us immediately. We will find solutions adapted to your situation.', it:'In caso di difficoltà, contattaci immediatamente. Studieremo soluzioni adatte alla tua situazione.', es:'En caso de dificultad, contáctanos inmediatamente. Estudiaremos soluciones adaptadas a tu situación.', de:'Bei Schwierigkeiten kontaktieren Sie uns sofort. Wir finden Lösungen für Ihre Situation.', pt:'Em caso de dificuldade, entre em contato conosco imediatamente. Estudaremos soluções adequadas à sua situação.' },
  q8: { fr:'Mes données sont-elles sécurisées ?', en:'Is my data secure?', it:'I miei dati sono al sicuro?', es:'¿Mis datos están seguros?', de:'Sind meine Daten sicher?', pt:'Meus dados estão seguros?' },
  a8: { fr:'Absolument. Toutes vos données sont cryptées et protégées conformément au RGPD. Nous ne partageons jamais vos informations avec des tiers.', en:'Absolutely. All your data is encrypted and protected according to GDPR. We never share your information with third parties.', it:'Assolutamente. Tutti i tuoi dati sono crittografati e protetti secondo il GDPR. Non condividiamo mai le tue informazioni con terzi.', es:'Absolutamente. Todos tus datos están cifrados y protegidos según el RGPD. Nunca compartimos tu información con terceros.', de:'Absolut. Alle Ihre Daten werden gemäß der DSGVO verschlüsselt und geschützt. Wir geben Ihre Daten niemals an Dritte weiter.', pt:'Absolutamente. Todos os seus dados são criptografados e protegidos de acordo com o GDPR. Nunca compartilhamos suas informações com terceiros.' },
};

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
  const { lang } = useLangStore();
  const l = lang || 'fr';
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [sent, setSent] = useState(false);

  const faqs = [
    { q: FAQ_DATA.q1[l] || FAQ_DATA.q1.fr, a: FAQ_DATA.a1[l] || FAQ_DATA.a1.fr },
    { q: FAQ_DATA.q2[l] || FAQ_DATA.q2.fr, a: FAQ_DATA.a2[l] || FAQ_DATA.a2.fr },
    { q: FAQ_DATA.q3[l] || FAQ_DATA.q3.fr, a: FAQ_DATA.a3[l] || FAQ_DATA.a3.fr },
    { q: FAQ_DATA.q4[l] || FAQ_DATA.q4.fr, a: FAQ_DATA.a4[l] || FAQ_DATA.a4.fr },
    { q: FAQ_DATA.q5[l] || FAQ_DATA.q5.fr, a: FAQ_DATA.a5[l] || FAQ_DATA.a5.fr },
    { q: FAQ_DATA.q6[l] || FAQ_DATA.q6.fr, a: FAQ_DATA.a6[l] || FAQ_DATA.a6.fr },
    { q: FAQ_DATA.q7[l] || FAQ_DATA.q7.fr, a: FAQ_DATA.a7[l] || FAQ_DATA.a7.fr },
    { q: FAQ_DATA.q8[l] || FAQ_DATA.q8.fr, a: FAQ_DATA.a8[l] || FAQ_DATA.a8.fr },
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
          <h1 className="hero-text" style={{ fontSize:'clamp(32px,5vw,52px)', marginBottom:12 }}>{t('faq_title', l)}</h1>
          <p className="hero-sub" style={{ fontSize:15, lineHeight:1.65 }}>{t('faq_sub', l)}</p>
        </motion.div>
      </section>

      <section style={{ padding:'60px 6% 40px', background:'var(--bg)' }}>
        <div style={{ maxWidth:740, margin:'0 auto' }}>
          <motion.div {...fadeUp} style={{ marginBottom:36 }}>
            <span className="section-eyebrow">FAQ</span>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(24px,3vw,32px)', fontWeight:900 }}>{t('faq_heading', l)}</h2>
          </motion.div>
          <div>{faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} open={openIndex===i} onClick={() => setOpenIndex(openIndex===i ? null : i)} />
          ))}</div>
        </div>
      </section>

      <section style={{ padding:'60px 6%', background:'var(--bg-card2)' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign:'center', marginBottom:36 }}>
            <span className="section-eyebrow">{t('faq_contact', l)}</span>
            <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(24px,3vw,32px)', fontWeight:900, marginBottom:8 }}>{t('faq_contact_h', l)}</h2>
            <p style={{ fontSize:14, color:'var(--text-3)' }}>{t('faq_contact_sub', l)}</p>
          </motion.div>

          {sent ? (
            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="card" style={{ padding:'48px 32px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:800, marginBottom:8 }}>{t('faq_sent_title', l)}</h3>
              <p style={{ fontSize:14, color:'var(--text-3)' }}>{t('faq_sent_desc', l)}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <Field label={t('faq_name', l)} value={form.name} onChange={v => setForm({...form, name:v})} placeholder="Jean Dupont" />
                <Field label={t('faq_email', l)} value={form.email} onChange={v => setForm({...form, email:v})} placeholder="jean@exemple.com" type="email" />
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, marginBottom:6, color:'var(--text-2)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{t('faq_message', l)}</label>
                <textarea className="input-luxury" placeholder={t('faq_message', l)} rows={4} value={form.message} onChange={e => setForm({...form, message:e.target.value})} required />
              </div>
              <button type="submit" className="btn-primary" style={{ alignSelf:'flex-start', fontSize:12, padding:'13px 32px' }}>{t('faq_send', l)}</button>
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
