import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Disclaimer() {
  return (
    <>
      <Navbar />
      
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '60px 24px'
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '8px',
          color: '#1a1a2e'
        }}>
          Disclaimer
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
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1a1a2e'
            }}>
              General Information
            </h2>
            <p style={{ color: '#4a4a68', lineHeight: '1.8' }}>
              The information provided by Ismora ("we," "us," or "our") on ismora.shop (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1a1a2e'
            }}>
              Professional Disclaimer
            </h2>
            <p style={{ color: '#4a4a68', lineHeight: '1.8' }}>
              The Site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1a1a2e'
            }}>
              External Links Disclaimer
            </h2>
            <p style={{ color: '#4a4a68', lineHeight: '1.8' }}>
              The Site may contain links to external websites that are not provided or maintained by or in any way affiliated with us. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1a1a2e'
            }}>
              Affiliate Disclaimer
            </h2>
            <p style={{ color: '#4a4a68', lineHeight: '1.8' }}>
              Some of the links on the Site may be affiliate links. This means that if you click on the link and make a purchase, we may receive a small commission at no extra cost to you. We only recommend products and services that we believe will add value to our users.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1a1a2e'
            }}>
              Limitation of Liability
            </h2>
            <p style={{ color: '#4a4a68', lineHeight: '1.8' }}>
              In no event shall Ismora be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your use of the Site or the products and services offered, whether based on contract, tort, strict liability, or otherwise.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#1a1a2e'
            }}>
              Contact Us
            </h2>
            <p style={{ color: '#4a4a68', lineHeight: '1.8' }}>
              If you have any questions about this Disclaimer, please contact us at:
            </p>
            <ul style={{
              color: '#4a4a68',
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

export default Disclaimer;