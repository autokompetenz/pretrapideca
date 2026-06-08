import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import Home from './pages/Home';
import LoanForm from './pages/LoanForm';
import QuickLoan from './pages/QuickLoan';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/demande" element={<Layout><LoanForm /></Layout>} />
        <Route path="/quick" element={<Layout><QuickLoan /></Layout>} />
        <Route path="/comment-ca-marche" element={<Layout><HowItWorks /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
        <Route path="*" element={
          <Layout>
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 120, fontWeight: 900, color: 'var(--navy)', lineHeight: 1, letterSpacing: '-0.05em' }}>404</p>
                <h1 style={{ fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 32 }}>Page introuvable</h1>
                <a href="/" className="btn-primary" style={{ fontSize: 14, padding: '16px 40px' }}>← Accueil</a>
              </div>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}
