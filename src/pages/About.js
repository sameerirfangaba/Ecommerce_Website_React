import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />

      <style>{`
        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .stat-number {
          font-family: 'DM Sans', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1A1A1A;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
          .value-card {
            padding: 24px !important;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-about" style={{
        background: '#1A1A1A',
        padding: '100px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)'
        }}></div>
        <div className="section-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 className="hero-title" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '700',
            color: 'white',
            lineHeight: '1.1',
            marginBottom: '20px'
          }}>Our Story</h1>
          <p className="hero-sub" style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>Crafted with passion, delivered with care — Ismora brings you premium products that elevate your everyday life.</p>
        </div>
      </section>

      {/* About Content */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="section-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div className="grid md:grid-cols-2 gap-12 items-center" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div>
              <p style={{
                color: '#6B6B6B',
                lineHeight: '1.6',
                marginBottom: '16px',
                fontSize: '1rem'
              }}>Ismora is a newly launched e-commerce brand based in the UAE, built for people who want their everyday essentials — from customized jewelry to fashion, accessories, and more — to feel a little more considered. We're just getting started, and every product in our collection is chosen the same way we'd shop for ourselves: for quality, style, and lasting value.</p>
              <p style={{
                color: '#6B6B6B',
                lineHeight: '1.6',
                marginBottom: '24px',
                fontSize: '1rem'
              }}>As a new brand, we're focused on getting the fundamentals right — carefully sourced products, honest pricing, and reliable shipping across the UAE. We'd rather grow slowly with happy customers than rush the process, so expect our collection to keep evolving as we learn what you love.</p>
              <Link to="/shop" className="btn btn-accent" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s',
                textDecoration: 'none',
                background: '#1A1A1A',
                color: 'white'
              }}>
                <i className="fas fa-shopping-bag"></i> Shop Our Collection
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=450&fit=crop" 
                alt="Ismora Store" 
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
                onError={(e) => e.target.src = 'https://placehold.co/600x450/f0f0f0/aaa?text=Ismora+Store'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section" style={{
        padding: '80px 0',
        background: '#FAFAFA'
      }}>
        <div className="section-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div className="section-header" style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <p className="section-label" style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>What Drives Us</p>
            <h2 className="section-title" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700',
              color: '#1A1A1A',
              letterSpacing: '-0.02em'
            }}>Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            <div className="value-card" style={{
              background: 'white',
              border: '1px solid #EAEAEA',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div className="value-icon" style={{
                width: '70px',
                height: '70px',
                background: '#FAFAFA',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#1A1A1A'
              }}>
                <i className="fas fa-gem"></i>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#1A1A1A'
              }}>Quality First</h3>
              <p style={{
                color: '#6B6B6B',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>Every product is carefully selected to ensure it meets our high standards of durability and design.</p>
            </div>

            <div className="value-card" style={{
              background: 'white',
              border: '1px solid #EAEAEA',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div className="value-icon" style={{
                width: '70px',
                height: '70px',
                background: '#FAFAFA',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#1A1A1A'
              }}>
                <i className="fas fa-heart"></i>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#1A1A1A'
              }}>Customer Love</h3>
              <p style={{
                color: '#6B6B6B',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>Your satisfaction is our priority. We're here to help you find exactly what you need.</p>
            </div>

            <div className="value-card" style={{
              background: 'white',
              border: '1px solid #EAEAEA',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div className="value-icon" style={{
                width: '70px',
                height: '70px',
                background: '#FAFAFA',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#1A1A1A'
              }}>
                <i className="fas fa-leaf"></i>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#1A1A1A'
              }}>Sustainable Choices</h3>
              <p style={{
                color: '#6B6B6B',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>We're committed to responsible sourcing and eco-friendly packaging.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ padding: '80px 0' }}>
        <div className="section-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            textAlign: 'center'
          }}>
            <div>
              <div className="stat-number" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1A1A1A'
              }}>{loading ? '...' : `${products.length}+`}</div>
              <div style={{
                color: '#6B6B6B',
                fontSize: '0.875rem'
              }}>Products</div>
            </div>
            <div>
              <div className="stat-number" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1A1A1A'
              }}>UAE</div>
              <div style={{
                color: '#6B6B6B',
                fontSize: '0.875rem'
              }}>Wide Shipping</div>
            </div>
            <div>
              <div className="stat-number" style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#1A1A1A'
              }}>2026</div>
              <div style={{
                color: '#6B6B6B',
                fontSize: '0.875rem'
              }}>Est.</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;