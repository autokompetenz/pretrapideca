import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Home() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  const fadeUp = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <>
      {/* ══ HERO — PARALLAX ══ */}
      <section style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Background avec effet parallaxe */}
        <motion.div style={{ y, position: 'absolute', inset: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #0A1F44 0%, #061232 50%, #1A3A6E 100%)',
            backgroundSize: 'cover',
            height: '110%', width: '100%',
          }} />
        </motion.div>

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,31,68,0.92) 0%, rgba(6,18,50,0.55) 60%, rgba(26,58,110,0.35) 100%)',
        }} />

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: 'min(500px, 70vw)', height: 'min(500px, 70vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-5%',
          width: 'min(350px, 50vw)', height: 'min(350px, 50vw)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.05) 0%, transparent 70%)',
        }} />

        <motion.div style={{ opacity, position: 'relative', zIndex: 1, padding: '140px 6% 120px', width: '100%' }}>
          <div style={{ maxWidth: 620 }}>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(245,166,35,0.1)',
                color: 'var(--gold)',
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: 20,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
                Simple · Rapide · Fiable
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="hero-text"
              style={{ fontSize: 'clamp(44px, 6vw, 72px)', marginBottom: 16, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              Obtenez votre <span style={{ color: 'var(--gold)' }}>prêt en 24h</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hero-sub"
              style={{ fontSize: 17, lineHeight: 1.65, marginBottom: 36, maxWidth: 480 }}
            >
              Financement rapide sans paperasse. Découvrez votre éligibilité en quelques minutes et recevez votre argent sous 24h.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
            >
              <Link to="/demande" className="btn-gold" style={{ fontSize: 14, padding: '16px 38px', textDecoration: 'none' }}>
                Faire une demande →
              </Link>
              <Link to="/comment-ca-marche" className="btn-ghost" style={{
                borderColor: 'rgba(255,255,255,0.25)', color: '#fff', textDecoration: 'none',
              }}>
                Comment ça marche
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
          <div style={{
            display: 'flex', justifyContent: 'space-around', alignItems: 'center',
            padding: '16px 5%', gap: 12,
          }}>
            {[
              { end: 10, suffix: '+ ans', label: "D'expérience" },
              { end: 15000, suffix: '+', label: 'Clients' },
              { end: 98, suffix: '%', label: 'Satisfaits' },
              { end: 50, suffix: 'M$', label: 'Débloqués' },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 'clamp(16px, 2.5vw, 24px)',
                  fontWeight: 800, color: 'var(--gold)',
                  lineHeight: 1, marginBottom: 2,
                }}>
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ TRUST BADGES ══ */}
      <section style={{ padding: '80px 6%', background: 'var(--bg-card2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 44 }}>
            <span className="section-eyebrow">Pourquoi nous choisir</span>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, marginBottom: 12 }}>
              Des services pensés pour vous
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-3)', maxWidth: 480, margin: '0 auto' }}>
              Un accompagnement sur mesure pour chaque demande
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: '🔒', title: 'Paiement sécurisé', desc: 'Données cryptées et protégées selon les normes les plus strictes.' },
              { icon: '⚡', title: 'Rapide et efficace', desc: 'Réponse sous 24h maximum. Un processus 100% en ligne.' },
              { icon: '📄', title: 'Sans paperasse', desc: 'Zéro document à fournir. Simple et dématérialisé.' },
              { icon: '🤝', title: 'Conseiller dédié', desc: 'Un interlocuteur unique pour vous accompagner.' },
            ].map((b, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="card"
                style={{ padding: '32px 24px', textAlign: 'center' }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{b.icon}</div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ padding: '80px 6%', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-eyebrow">Processus</span>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, marginBottom: 12 }}>
              Comment ça marche ?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-3)', maxWidth: 400, margin: '0 auto' }}>
              Obtenez votre prêt en 3 étapes simples
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { step: '01', title: 'Remplissez le formulaire', desc: 'Indiquez vos informations personnelles et professionnelles en quelques minutes.', icon: '📝' },
              { step: '02', title: 'Validation rapide', desc: 'Notre équipe analyse votre demande et vous répond sous 24h maximum.', icon: '✅' },
              { step: '03', title: 'Réception des fonds', desc: 'Une fois approuvé, recevez l\'argent directement sur votre compte bancaire.', icon: '💰' },
            ].map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex', gap: 24, alignItems: 'flex-start',
                  padding: '32px 0', position: 'relative',
                }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--navy), var(--navy-light))',
                  border: '2px solid rgba(245,166,35,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 900, color: 'var(--gold)',
                  flexShrink: 0, fontFamily: "'Outfit',sans-serif",
                }}>
                  {item.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 800 }}>{item.title}</h3>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{
        padding: '80px 6%',
        background: 'var(--navy)', position: 'relative', overflow: 'hidden',
      }}>
        <div className="noise" style={{ position: 'absolute', inset: 0 }} />
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 32, maxWidth: 1100, margin: '0 auto', textAlign: 'center',
        }}>
          {[
            { end: 15000, suffix: '+', label: 'Clients satisfaits' },
            { end: 50, suffix: 'M$', label: 'Montants débloqués' },
            { end: 24, suffix: 'h', label: 'Délai de réponse' },
            { end: 98, suffix: '%', label: 'Taux de satisfaction' },
          ].map((s, i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}>
              <div style={{
                fontSize: 'clamp(32px,4vw,48px)',
                fontWeight: 900, color: 'var(--gold)',
                fontFamily: "'Outfit',sans-serif", lineHeight: 1, marginBottom: 8,
              }}>
                <CountUp end={s.end} suffix={s.suffix} />
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding: '80px 6%', textAlign: 'center', background: 'var(--bg)' }}>
        <motion.div {...fadeUp} style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, marginBottom: 14 }}>
            Prêt à obtenir votre prêt ?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-3)', marginBottom: 32, lineHeight: 1.6 }}>
            Rejoignez plus de 15 000 clients satisfaits. Faites votre demande en 2 minutes chrono.
          </p>
          <Link to="/demande" className="btn-primary" style={{ fontSize: 14, padding: '16px 40px', textDecoration: 'none' }}>
            Faire une demande →
          </Link>
        </motion.div>
      </section>
    </>
  );
}
