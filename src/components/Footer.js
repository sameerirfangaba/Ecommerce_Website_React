import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer" style={{
      background: '#0D0D0D',
      padding: '64px 0 0'
    }}>
      <div className="footer-inner" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '48px'
      }}>
        <div>
          <div className="footer-brand-name" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '12px'
          }}>Ismora</div>
          <p className="footer-brand-desc" style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            marginBottom: '24px',
            maxWidth: '280px'
          }}>Your one-stop destination for premium products. Quality guaranteed, delivery assured.</p>
          <div className="footer-socials" style={{
            display: 'flex',
            gap: '10px'
          }}>
            <a href="https://www.facebook.com/shopismora" className="social-btn" style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/shopismora/" className="social-btn" style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }}>
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <div>
          <p className="footer-col-title" style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '20px'
          }}>Shop</p>
          <ul className="footer-links" style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: 0
          }}>
            <li><Link to="/shop" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>All Products</Link></li>
            <li><Link to="/shop" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>New Arrivals</Link></li>
            <li><Link to="/shop" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>Best Sellers</Link></li>
            <li><Link to="/shop" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>Sale</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title" style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '20px'
          }}>Help</p>
          <ul className="footer-links" style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: 0
          }}>
            <li><Link to="/faq" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>FAQ</Link></li>
            <li><Link to="/shipping-policy" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>Shipping Policy</Link></li>
            <li><Link to="/returns" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>Returns</Link></li>
          </ul>
        </div>
        <div>
          <p className="footer-col-title" style={{
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '20px'
          }}>Company</p>
          <ul className="footer-links" style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: 0
          }}>
            <li><Link to="/about-us" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>About Us</Link></li>
            <li><Link to="/contact-us" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>Contact</Link></li>
            <li><Link to="/privacy-policy" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>Privacy Policy</Link></li>
            <li><Link to="/terms" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none' }}>Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom" style={{
        marginTop: '48px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '20px 24px',
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>© 2026 Ismora. All rights reserved. Made by Sameer Irfan.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="fab fa-cc-visa" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.6rem' }}></i>
          <i className="fab fa-cc-mastercard" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.6rem' }}></i>
          <i className="fab fa-cc-paypal" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.6rem' }}></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;