import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CookiePolicy() {
  return (
    <>
      <Navbar />
      
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '60px 24px'
      }}>
        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '8px',
          color: '#1A1A1A'
        }}>
          Cookie Policy
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '40px' }}>
          Last updated: June 25, 2026
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          maxWidth: '800px'
        }}>
          <section>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1A1A1A'
            }}>
              What Are Cookies?
            </h2>
            <p style={{ color: '#6B6B6B', lineHeight: '1.8' }}>
              Cookies are small text files that are stored on your device when you visit a website. They help us provide you with a better experience by remembering your preferences and understanding how you interact with our site.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1A1A1A'
            }}>
              How We Use Cookies
            </h2>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '16px 20px'
              }}>
                <h3 style={{
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '4px'
                }}>
                  🛒 Essential Cookies
                </h3>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                  These cookies are necessary for the website to function properly. They enable basic features like page navigation, shopping cart, and secure checkout.
                </p>
              </div>

              <div style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '16px 20px'
              }}>
                <h3 style={{
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '4px'
                }}>
                  📊 Analytics Cookies
                </h3>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                  We use Google Analytics to understand how visitors interact with our website. This helps us improve our content and user experience.
                </p>
              </div>

              <div style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '16px 20px'
              }}>
                <h3 style={{
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginBottom: '4px'
                }}>
                  🎯 Advertising Cookies
                </h3>
                <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>
                  We may use third-party advertising cookies to show you relevant ads based on your browsing history.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1A1A1A'
            }}>
              Your Cookie Choices
            </h2>
            <p style={{ color: '#6B6B6B', lineHeight: '1.8', marginBottom: '16px' }}>
              You can control and manage cookies in your browser settings. You can:
            </p>
            <ul style={{
              color: '#6B6B6B',
              lineHeight: '1.8',
              paddingLeft: '20px'
            }}>
              <li>Delete all cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Set your browser to notify you when a cookie is being set</li>
              <li>Opt-out of third-party cookies</li>
            </ul>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1A1A1A'
            }}>
              Contact Us
            </h2>
            <p style={{ color: '#6B6B6B', lineHeight: '1.8' }}>
              If you have any questions about our Cookie Policy, please contact us at:
            </p>
            <ul style={{
              color: '#6B6B6B',
              lineHeight: '1.8',
              marginTop: '8px',
              paddingLeft: '20px'
            }}>
              <li>Email: ismora.ae@gmail.com</li>
              <li>Address: Dubai, UAE</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CookiePolicy;