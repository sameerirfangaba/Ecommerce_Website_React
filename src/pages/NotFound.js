import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '120px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '6rem',
          fontWeight: '700',
          color: '#FF6B35',
          marginBottom: '16px'
        }}>404</h1>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1a1a2e',
          marginBottom: '16px'
        }}>Page Not Found</h2>
        <p style={{
          color: '#4a4a68',
          fontSize: '1.1rem',
          marginBottom: '32px'
        }}>Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 32px',
          borderRadius: '10px',
          background: '#FF6B35',
          color: 'white',
          textDecoration: 'none',
          fontWeight: '600',
          transition: 'all 0.2s'
        }}>
          <i className="fas fa-home"></i> Return Home
        </Link>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;