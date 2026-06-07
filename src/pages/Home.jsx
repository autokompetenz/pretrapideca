import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLangStore } from '../store';
import { t } from '../utils/i18n';

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
  const { lang } = useLangStore();
  const l = lang || 'fr';
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
      <section style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        <motion.div style={{ y, position: 'absolute', inset: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #0A1F44 0%, #061232 50%, #1A3A6E 100%)',
            backgroundSize: 'cover',
            height: '110%', width: '100%',
          }} />
        </motion.div>

        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,31,68,0.92) 0%, rgba(6,18,50,0.55) 60%, rgba(26,58,110,0.35) 100%)',
        }} />

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
                {t('hero_badge', l)}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="hero-text"
              style={{ fontSize: 'clamp(44px, 6vw, 72px)', marginBottom: 16, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              Obtenez votre <span style={{ color: 'var(--gold)' }}>{t('hero_title_hl', l)}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hero-sub"
              style={{ fontSize: 17, lineHeight: 1.65, marginBottom: 36, maxWidth: 480 }}
            >
              {t('hero_sub', l)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
            >
              <Link to="/demande" className="btn-gold" style={{ fontSize: 14, padding: '16px 38px', textDecoration: 'none' }}>
                {t('hero_cta', l)}
              </Link>
              <Link to="/comment-ca-marche" className="btn-ghost" style={{
                borderColor: 'rgba(255,255,255,0.25)', color: '#fff', textDecoration: 'none',
              }}>
                {t('hero_cta2', l)}
              </Link>
            </motion.div>
          </div>
        </motion.div>

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
              { end: 10, suffix: '+ ans', label: t('stat_exp', l) },
              { end: 15000, suffix: '+', label: t('stat_clients', l) },
              { end: 98, suffix: '%', label: t('stat_satisfied', l) },
              { end: 50, suffix: 'M$', label: t('stat_unlocked', l) },
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

      <section style={{ padding: '80px 6%', background: 'var(--bg-card2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 44 }}>
            <span className="section-eyebrow">{t('why_title', l)}</span>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, marginBottom: 12 }}>
              {t('why_heading', l)}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-3)', maxWidth: 480, margin: '0 auto' }}>
              {t('why_sub', l)}
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: '🔒', title: t('badge1_title', l), desc: t('badge1_desc', l) },
              { icon: '⚡', title: t('badge2_title', l), desc: t('badge2_desc', l) },
              { icon: '📄', title: t('badge3_title', l), desc: t('badge3_desc', l) },
              { icon: '🤝', title: t('badge4_title', l), desc: t('badge4_desc', l) },
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

      <section style={{ padding: '80px 6%', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-eyebrow">{t('process_label', l)}</span>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, marginBottom: 12 }}>
              {t('process_heading', l)}
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-3)', maxWidth: 400, margin: '0 auto' }}>
              {t('process_sub', l)}
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { step: '01', title: t('step1_title', l), desc: t('step1_desc', l), icon: '📝' },
              { step: '02', title: t('step2_title', l), desc: t('step2_desc', l), icon: '✅' },
              { step: '03', title: t('step3_title', l), desc: t('step3_desc', l), icon: '💰' },
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
            { end: 15000, suffix: '+', label: t('stat_client', l) },
            { end: 50, suffix: 'M$', label: t('stat_amount', l) },
            { end: 24, suffix: 'h', label: t('stat_delay', l) },
            { end: 98, suffix: '%', label: t('stat_rate', l) },
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

      <section style={{ padding: '80px 6%', textAlign: 'center', background: 'var(--bg)' }}>
        <motion.div {...fadeUp} style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, marginBottom: 14 }}>
            {t('cta_title', l)}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-3)', marginBottom: 32, lineHeight: 1.6 }}>
            {t('cta_desc', l)}
          </p>
          <Link to="/demande" className="btn-primary" style={{ fontSize: 14, padding: '16px 40px', textDecoration: 'none' }}>
            {t('cta_btn', l)}
          </Link>
        </motion.div>
      </section>
    </>
  );
}
