import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore, useLangStore } from '../store';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { t, LANGUAGES } from '../utils/i18n';

export default function Navbar() {
  const { theme, toggle } = useThemeStore();
  const { lang, setLang } = useLangStore();
  const l = lang || 'fr';
  const location = useLocation();
  const { isMobile } = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const isHero = location.pathname === '/' && !scrolled;
  const F = "'Outfit',sans-serif";

  const iconColor = scrolled
    ? (isDark ? 'rgba(255,255,255,0.85)' : '#222')
    : isHero ? '#fff' : (isDark ? 'rgba(255,255,255,0.8)' : '#333');

  const navTextColor = scrolled
    ? (isDark ? 'rgba(255,255,255,0.75)' : '#444')
    : isHero ? 'rgba(255,255,255,0.8)' : (isDark ? 'rgba(255,255,255,0.75)' : '#444');

  const btnBg = scrolled
    ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
    : isHero ? 'rgba(255,255,255,0.1)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)');

  const btnBorder = (open) => open
    ? 'var(--gold)'
    : scrolled
    ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')
    : isHero ? 'rgba(255,255,255,0.2)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');

  const menuBg     = isDark ? '#0f0f0f' : '#ffffff';
  const menuText   = isDark ? '#ffffff' : '#111111';
  const menuText2  = isDark ? 'rgba(255,255,255,0.65)' : '#444444';
  const menuText3  = isDark ? 'rgba(255,255,255,0.35)' : '#999999';
  const menuBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const menuHover  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';

  const NavLink = ({ to, label }) => {
    const active = location.pathname.startsWith(to) && to !== '/';
    return (
      <Link to={to} style={{
        fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: active ? 'var(--gold)' : navTextColor,
        textDecoration: 'none', transition: 'color 0.2s',
        borderBottom: active ? '1.5px solid var(--gold)' : '1.5px solid transparent',
        paddingBottom: 2,
      }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'}
        onMouseOut={e => e.currentTarget.style.color = active ? 'var(--gold)' : navTextColor}>
        {label}
      </Link>
    );
  };

  const itemStyle = (mobile) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: mobile ? '14px 0' : '10px 18px',
    fontSize: mobile ? 16 : 14,
    color: menuText2,
    textDecoration: 'none',
    transition: 'background 0.15s',
    fontWeight: mobile ? 600 : 400,
    fontFamily: F,
    background: 'transparent',
    border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
  });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'transparent',
        borderBottom: scrolled ? `1px solid ${menuBorder}` : '1px solid transparent',
        transition: 'border-color 0.4s var(--ease)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 4%' : '0 5%', height: 68,
      }}>
        {scrolled && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: -1,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            background: isDark ? 'rgba(10,10,11,0.97)' : 'rgba(255,255,255,0.97)',
            transition: 'background 0.4s',
          }} />
        )}

        <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', lineHeight: 1.1, flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: F, fontSize: 16, fontWeight: 900,
            color: scrolled ? (isDark ? '#fff' : '#111') : isHero ? '#fff' : (isDark ? '#fff' : '#111'),
            letterSpacing: '0.05em', transition: 'color 0.3s',
          }}>
            PRÊT RAPIDE
          </div>
          <div style={{ fontSize: 9, letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginTop: 2 }}>
            {t('tagline', l)}
          </div>
        </Link>

          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, position: 'relative', zIndex: 1 }}>
              <NavLink to="/" label={t('nav_home', l)} />
              <NavLink to="/comment-ca-marche" label={t('nav_how', l)} />
              <NavLink to="/faq" label={t('nav_faq', l)} />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
            {!isMobile && (
              <Link to="/demande" className="btn-gold" style={{ fontSize: 11, padding: '9px 18px', letterSpacing: '0.12em', textDecoration: 'none' }}>
                {t('nav_apply', l)}
              </Link>
            )}

          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: btnBg,
                border: `1.5px solid ${btnBorder(menuOpen)}`,
                borderRadius: 8,
                padding: isMobile ? '8px' : '7px 12px',
                cursor: 'pointer', transition: 'all 0.2s',
                height: 38, width: isMobile ? 38 : 'auto',
                justifyContent: 'center',
              }}>
              {isMobile ? (
                <span style={{ fontSize: 20, lineHeight: 1, color: iconColor }}>
                  {menuOpen ? '✕' : '☰'}
                </span>
              ) : (
                <>
                  <span style={{ fontSize: 14, color: iconColor, fontWeight: 600, fontFamily: F }}>{t('nav_menu', l)}</span>
                  <span style={{ fontSize: 10, color: iconColor, opacity: 0.6 }}>▾</span>
                </>
              )}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  style={{
                    position: isMobile ? 'fixed' : 'absolute',
                    right: 0,
                    top: isMobile ? 68 : 'calc(100% + 10px)',
                    left: isMobile ? 0 : 'auto',
                    bottom: isMobile ? 0 : 'auto',
                    background: menuBg,
                    border: isMobile ? 'none' : `1px solid ${menuBorder}`,
                    borderTop: isMobile ? `1px solid ${menuBorder}` : undefined,
                    borderRadius: isMobile ? 0 : 12,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
                    overflow: 'auto',
                    minWidth: isMobile ? '100%' : 220,
                    zIndex: 9999,
                    padding: isMobile ? '20px 5%' : 0,
                  }}>
                  {isMobile && (
                    <div style={{ marginBottom: 20 }}>
                      {[
                        { to: '/', label: t('nav_home', l) },
                        { to: '/comment-ca-marche', label: t('nav_how', l) },
                        { to: '/faq', label: t('nav_faq', l) },
                      ].map(({ to, label }) => (
                        <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '14px 0', fontSize: 16,
                            color: menuText,
                            textDecoration: 'none',
                            borderBottom: `1px solid ${menuBorder}`,
                            fontWeight: 600, fontFamily: F,
                          }}>
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div style={{ padding: isMobile ? '16px 0' : '6px 0' }}>
                    <Link to="/demande" onClick={() => setMenuOpen(false)}
                      style={{
                        ...itemStyle(isMobile),
                        display: 'flex',
                        color: 'var(--gold)',
                        fontWeight: 700,
                      }}
                      onMouseOver={e => { if (!isMobile) e.currentTarget.style.background = 'rgba(245,166,35,0.06)'; }}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ fontSize: isMobile ? 20 : 16, width: isMobile ? 28 : 20, textAlign: 'center' }}>✦</span>
                      {t('nav_apply', l)}
                    </Link>
                  </div>

                  <div style={{ height: 1, background: menuBorder, margin: isMobile ? '8px 0' : 0 }} />

                  <div style={{ padding: isMobile ? '8px 0' : '6px 0' }}>
                    <button onClick={toggle} style={{ ...itemStyle(isMobile), width: '100%', color: menuText2 }}
                      onMouseOver={e => { if (!isMobile) e.currentTarget.style.background = menuHover; }}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ fontSize: isMobile ? 20 : 16, width: isMobile ? 28 : 20, textAlign: 'center' }}>
                        {isDark ? '☀️' : '🌙'}
                      </span>
                      {isDark ? t('theme_light', l) : t('theme_dark', l)}
                    </button>
                  </div>

                  <div style={{ height: 1, background: menuBorder, margin: isMobile ? '8px 0' : 0 }} />

                  <div style={{ padding: isMobile ? '8px 0' : '6px 0' }}>
                    <p style={{
                      fontSize: 10, fontWeight: 800, letterSpacing: '0.25em',
                      textTransform: 'uppercase', color: menuText3,
                      padding: isMobile ? '4px 0 10px' : '4px 18px 8px',
                      margin: 0,
                    }}>
                      {t('language', l)}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? 8 : 4, padding: isMobile ? 0 : '0 10px 6px' }}>
                      {LANGUAGES.map(ln => (
                        <button key={ln.code} onClick={() => { setLang(ln.code); setMenuOpen(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            padding: isMobile ? '10px 6px' : '8px 10px',
                            background: ln.code === l ? 'rgba(245,166,35,0.1)' : 'transparent',
                            border: `1px solid ${ln.code === l ? 'rgba(245,166,35,0.3)' : 'transparent'}`,
                            borderRadius: 6, cursor: 'pointer',
                            fontSize: isMobile ? 14 : 13,
                            color: ln.code === l ? 'var(--gold)' : menuText2,
                            fontFamily: F, fontWeight: ln.code === l ? 700 : 400,
                            transition: 'all 0.15s',
                          }}>
                          <span style={{ fontSize: isMobile ? 18 : 16 }}>{ln.flag}</span> {ln.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </>
  );
}
