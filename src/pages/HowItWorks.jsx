import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  const fadeUp = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  };

  const steps = [
    {
      icon: '📝', number: '1',
      title: 'Remplissez le formulaire',
      desc: 'Indiquez vos informations personnelles, professionnelles et le montant souhaité. Le processus prend moins de 5 minutes et est accessible 24h/24.',
      details: ['Formulaire 100% en ligne', 'Aucun document à fournir', 'Processus guidé étape par étape'],
    },
    {
      icon: '🔍', number: '2',
      title: 'Validation de votre dossier',
      desc: 'Notre équipe analyse votre demande rapidement. Grâce à notre système automatisé, vous recevez une réponse sous 24h maximum.',
      details: ['Analyse automatisée et humaine', 'Réponse sous 24h', 'Aucun impact sur votre crédit'],
    },
    {
      icon: '💰', number: '3',
      title: 'Réception des fonds',
      desc: 'Une fois votre prêt approuvé, les fonds sont transférés directement sur votre compte bancaire. Simple et rapide.',
      details: ['Virement bancaire direct', 'Réception sous 24h après approbation', 'Suivi en temps réel'],
    },
  ];

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
          <span className="section-eyebrow" style={{ color:'var(--gold)' }}>Processus</span>
          <h1 className="hero-text" style={{ fontSize:'clamp(32px,5vw,52px)', marginBottom:12 }}>Comment ça marche ?</h1>
          <p className="hero-sub" style={{ fontSize:15, lineHeight:1.65 }}>Obtenez votre prêt en 3 étapes simples. Transparent, rapide et sans tracas.</p>
        </motion.div>
      </section>

      <section style={{ padding:'60px 6%', background:'var(--bg)' }}>
        <div style={{ maxWidth:800, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>
          {steps.map((step, i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration:0.55, delay:i*0.1, ease:[0.16,1,0.3,1] }}
              className="card" style={{ padding:'36px 32px', display:'flex', gap:24, alignItems:'flex-start', flexWrap:'wrap' }}>
              <div style={{
                width:72, height:72, borderRadius:'50%',
                background:'linear-gradient(135deg, var(--navy), var(--navy-light))',
                border:'2px solid rgba(245,166,35,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:28, flexShrink:0,
              }}>{step.icon}</div>
              <div style={{ flex:1, minWidth:260 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ background:'rgba(245,166,35,0.1)', color:'var(--gold)', fontSize:10, fontWeight:800, letterSpacing:'0.1em', padding:'3px 10px', borderRadius:4, border:'1px solid rgba(245,166,35,0.2)' }}>ÉTAPE {step.number}</span>
                  <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:20, fontWeight:800 }}>{step.title}</h3>
                </div>
                <p style={{ fontSize:14, color:'var(--text-3)', lineHeight:1.7, marginBottom:14 }}>{step.desc}</p>
                <ul style={{ display:'flex', flexDirection:'column', gap:6, listStyle:'none' }}>
                  {step.details.map((d, j) => (
                    <li key={j} style={{ fontSize:13, color:'var(--text-2)', display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ color:'var(--gold)', fontSize:13 }}>✦</span> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding:'60px 6%', textAlign:'center', background:'var(--bg-card2)' }}>
        <motion.div {...fadeUp} style={{ maxWidth:480, margin:'0 auto' }}>
          <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(24px,3.5vw,36px)', fontWeight:900, marginBottom:12 }}>Prêt à commencer ?</h2>
          <p style={{ fontSize:14, color:'var(--text-3)', marginBottom:28 }}>Faites votre demande dès maintenant et recevez une réponse sous 24h.</p>
          <Link to="/demande" className="btn-primary" style={{ fontSize:14, padding:'16px 40px', textDecoration:'none' }}>Faire une demande →</Link>
        </motion.div>
      </section>
    </>
  );
}
