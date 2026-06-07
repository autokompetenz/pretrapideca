import { Link } from 'react-router-dom';
import { useLangStore } from '../store';
import { t } from '../utils/i18n';

export default function Footer() {
  const { lang } = useLangStore();
  const l = lang || 'fr';

  return (
    <footer style={{
      background: 'var(--navy)',
      color: '#fff',
      padding: '40px 5% 24px',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 28,
        }}>
          <div>
            <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 6 }}>
              PRÊT RAPIDE
            </h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              {t('footer_desc', l)}
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {t('footer_pages', l)}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { to: '/', label: t('nav_home', l) },
                { to: '/comment-ca-marche', label: t('nav_how', l) },
                { to: '/faq', label: t('nav_faq', l) },
                { to: '/demande', label: t('nav_apply', l) },
              ].map(item => (
                <Link key={item.to} to={item.to} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s', padding: '2px 0' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {t('footer_contact', l)}
            </h4>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p>📍 Montréal, QC, Canada</p>
              <p>📞 <a href="tel:+14387702189" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>+1 438 770 2189</a></p>
              <p>💬 <a href="https://wa.me/14387702552" target="_blank" rel="noopener noreferrer" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>+1 438 770 2552 (WhatsApp)</a></p>
              <p>✉️ <a href="mailto:info@pretrapide.ca" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>info@pretrapide.ca</a></p>
            </div>
          </div>
        </div>
      </div>
      <div style={{
        marginTop: 28,
        paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
        fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
      }}>
        © {new Date().getFullYear()} Prêt Rapide. {t('footer_rights', l)}
      </div>
    </footer>
  );
}
