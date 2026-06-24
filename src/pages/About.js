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
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #FF6B35;
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
        background: '#1a1a2e',
        padding: '100px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,107,53,0.12) 0%, transparent 60%)'
        }}></div>
        <div className="section-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1
        }}>
          <h1 className="hero-title" style={{
            fontFamily: "'Playfair Display', serif",
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
                color: '#4a4a68',
                lineHeight: '1.6',
                marginBottom: '16px',
                fontSize: '1rem'
              }}>Founded in 2024, Ismora has quickly become a trusted name for those who seek elegance, durability, and style in their everyday essentials. We believe that the things you own should bring you joy, and we're committed to curating a collection that does exactly that.</p>
              <p style={{
                color: '#4a4a68',
                lineHeight: '1.6',
                marginBottom: '24px',
                fontSize: '1rem'
              }}>From our carefully sourced materials to our dedicated customer support, every aspect of Ismora is designed with you in mind. We're not just selling products — we're building relationships and creating experiences that last.</p>
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
                background: '#FF6B35',
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
        background: '#f8f8fc'
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
              color: '#FF6B35',
              marginBottom: '8px'
            }}>What Drives Us</p>
            <h2 className="section-title" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700',
              color: '#1a1a2e',
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
              border: '1px solid #e8e8f0',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div className="value-icon" style={{
                width: '70px',
                height: '70px',
                background: '#f8f8fc',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#FF6B35'
              }}>
                <i className="fas fa-gem"></i>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#1a1a2e'
              }}>Quality First</h3>
              <p style={{
                color: '#4a4a68',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>Every product is carefully selected to ensure it meets our high standards of durability and design.</p>
            </div>

            <div className="value-card" style={{
              background: 'white',
              border: '1px solid #e8e8f0',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div className="value-icon" style={{
                width: '70px',
                height: '70px',
                background: '#f8f8fc',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#FF6B35'
              }}>
                <i className="fas fa-heart"></i>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#1a1a2e'
              }}>Customer Love</h3>
              <p style={{
                color: '#4a4a68',
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>Your satisfaction is our priority. We're here to help you find exactly what you need.</p>
            </div>

            <div className="value-card" style={{
              background: 'white',
              border: '1px solid #e8e8f0',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div className="value-icon" style={{
                width: '70px',
                height: '70px',
                background: '#f8f8fc',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#FF6B35'
              }}>
                <i className="fas fa-leaf"></i>
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#1a1a2e'
              }}>Sustainable Choices</h3>
              <p style={{
                color: '#4a4a68',
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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px',
            textAlign: 'center'
          }}>
            <div>
              <div className="stat-number" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#FF6B35'
              }}>5000+</div>
              <div style={{
                color: '#4a4a68',
                fontSize: '0.875rem'
              }}>Happy Customers</div>
            </div>
            <div>
              <div className="stat-number" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#FF6B35'
              }}>{loading ? '...' : `${products.length}+`}</div>
              <div style={{
                color: '#4a4a68',
                fontSize: '0.875rem'
              }}>Products</div>
            </div>
            <div>
              <div className="stat-number" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#FF6B35'
              }}>50+</div>
              <div style={{
                color: '#4a4a68',
                fontSize: '0.875rem'
              }}>Cities Served</div>
            </div>
            <div>
              <div className="stat-number" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#FF6B35'
              }}>4.9★</div>
              <div style={{
                color: '#4a4a68',
                fontSize: '0.875rem'
              }}>Avg. Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;