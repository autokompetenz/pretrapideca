import { Link } from 'react-router-dom';

export default function Footer() {
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
              Votre solution de prêt rapide et fiable. Obtenez votre financement en 24h, sans paperasse.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Pages
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { to: '/', label: 'Accueil' },
                { to: '/comment-ca-marche', label: 'Comment ça marche' },
                { to: '/faq', label: 'FAQ' },
                { to: '/demande', label: 'Faire une demande' },
              ].map(l => (
                <Link key={l.to} to={l.to} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s', padding: '2px 0' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Contact
            </h4>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p>📍 Milan, Italie</p>
              <p>📞 +39 02 1234 5678</p>
              <p>✉️ contact@pretrapide.it</p>
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
        © {new Date().getFullYear()} Prêt Rapide. Tous droits réservés.
      </div>
    </footer>
  );
}
