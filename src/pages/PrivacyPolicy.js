import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('information-we-collect');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.policy-section');
      let current = '';
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= 150) {
          current = s.id;
        }
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const sections = [
    { id: 'information-we-collect', num: '1', title: 'Information We Collect' },
    { id: 'how-we-use', num: '2', title: 'How We Use It' },
    { id: 'sharing', num: '3', title: 'Sharing Information' },
    { id: 'cookies', num: '4', title: 'Cookies' },
    { id: 'security', num: '5', title: 'Data Security' },
    { id: 'your-rights', num: '6', title: 'Your Rights' },
    { id: 'third-party', num: '7', title: 'Third-Party Links' },
    { id: 'children', num: '8', title: "Children's Privacy" },
    { id: 'changes', num: '9', title: 'Policy Changes' },
    { id: 'contact', num: '10', title: 'Contact Us' }
  ];

  return (
    <>
      <Navbar />

      <style>{`
        .page-hero {
          background: #1A1A1A;
          padding: 72px 0 64px;
          position: relative;
          overflow: hidden;
        }
        .page-hero-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 15% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.07) 0%, transparent 40%);
        }
        .page-hero-grid {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .toc-list a.active {
          background: #FAFAFA;
          color: #1A1A1A;
        }
        .toc-list a.active .toc-num {
          background: #1A1A1A;
          color: white;
        }
        .info-card:hover {
          border-color: #1A1A1A;
        }
        .policy-highlight {
          background: #FAFAFA;
          border-left: 3px solid #1A1A1A;
          border-radius: 0 10px 10px 0;
          padding: 16px 20px;
          margin: 20px 0;
        }
        @media (max-width: 1024px) {
          .content-wrap { grid-template-columns: 1fr !important; }
          .toc-sidebar { position: static !important; }
          .info-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .page-hero { padding: 48px 0 40px; }
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="page-hero-grid"></div>
        <div className="page-hero-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1
        }}>
          <nav className="breadcrumb" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <Link to="/" style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.82rem',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>›</span>
            <span className="current" style={{
              color: '#1A1A1A',
              fontSize: '0.82rem',
              fontWeight: 500
            }}>Privacy Policy</span>
          </nav>
          <div className="page-hero-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#1A1A1A',
            borderRadius: '100px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <i className="fas fa-shield-alt"></i> &nbsp;Legal
          </div>
          <h1 className="page-hero-title" style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '14px'
          }}>
            Privacy <em style={{ fontStyle: 'italic', color: '#1A1A1A' }}>Policy</em>
          </h1>
          <p className="page-hero-sub" style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '560px'
          }}>We value your trust. Learn how Ismora collects, uses, and protects your personal information when you shop with us.</p>
          <div className="page-hero-meta" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            flexWrap: 'wrap'
          }}>
            <div className="meta-item" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.82rem'
            }}>
              <i className="fas fa-calendar-alt" style={{ color: '#1A1A1A', fontSize: '0.85rem' }}></i>
              Last updated: January 1, 2026
            </div>
            <div className="meta-item" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.82rem'
            }}>
              <i className="fas fa-map-marker-alt" style={{ color: '#1A1A1A', fontSize: '0.85rem' }}></i>
              Applies to: ismora.shop
            </div>
            <div className="meta-item" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.82rem'
            }}>
              <i className="fas fa-globe" style={{ color: '#1A1A1A', fontSize: '0.85rem' }}></i>
              Jurisdiction: UAE
            </div>
          </div>
        </div>
      </section>

      <div className="content-wrap" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '64px 24px',
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '48px',
        alignItems: 'start'
      }}>

        <aside className="toc-sidebar" style={{ position: 'sticky', top: '90px' }}>
          <div className="toc-card" style={{
            background: 'white',
            border: '1px solid #EAEAEA',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <p className="toc-title" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#6B6B6B',
              marginBottom: '16px'
            }}>Contents</p>
            <ul className="toc-list" style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              padding: 0
            }}>
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={activeSection === section.id ? 'active' : ''}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '9px',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: activeSection === section.id ? '#1A1A1A' : '#6B6B6B',
                      background: activeSection === section.id ? '#FAFAFA' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      border: 'none',
                      width: '100%',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      textAlign: 'left'
                    }}
                  >
                    <span className="toc-num" style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: activeSection === section.id ? '#1A1A1A' : '#EAEAEA',
                      color: activeSection === section.id ? 'white' : '#6B6B6B',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>{section.num}</span>
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
            <div className="toc-contact" style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #EAEAEA'
            }}>
              <p style={{
                fontSize: '0.8rem',
                color: '#6B6B6B',
                marginBottom: '12px',
                lineHeight: 1.5
              }}>Questions about our privacy practices? We're here to help.</p>
              <Link to="/contact-us" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#1A1A1A',
                textDecoration: 'none'
              }}>
                <i className="fas fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
                Contact Support
              </Link>
            </div>
          </div>
        </aside>

        <article className="policy-body" style={{ minWidth: 0 }}>
          <div className="policy-highlight">
            <p>
              <i className="fas fa-info-circle" style={{ color: '#1A1A1A', marginRight: '8px' }}></i>
              This Privacy Policy explains what data we collect when you visit <strong>ismora.shop</strong>, how we use it, and your rights regarding that data. By using our website, you agree to the practices described here.
            </p>
          </div>

          <section className="policy-section" id="information-we-collect" style={{
            marginBottom: '56px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 01</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Information We Collect</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>When you interact with Ismora — whether browsing, placing an order, or contacting us — we collect certain information to provide and improve our services.</p>

            <div className="info-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              margin: '20px 0'
            }}>
              <div className="info-card" style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '18px',
                transition: 'border-color 0.2s'
              }}>
                <div className="info-card-icon" style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <i className="fas fa-user" style={{ color: '#1A1A1A', fontSize: '0.9rem' }}></i>
                </div>
                <div className="info-card-title" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '6px'
                }}>Personal Information</div>
                <div className="info-card-text" style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B',
                  lineHeight: 1.55
                }}>Name, email address, phone number, and billing/shipping address provided during checkout.</div>
              </div>
              <div className="info-card" style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '18px',
                transition: 'border-color 0.2s'
              }}>
                <div className="info-card-icon" style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <i className="fas fa-credit-card" style={{ color: '#1A1A1A', fontSize: '0.9rem' }}></i>
                </div>
                <div className="info-card-title" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '6px'
                }}>Payment Details</div>
                <div className="info-card-text" style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B',
                  lineHeight: 1.55
                }}>Order amounts and payment method type. Full card numbers are never stored on our servers.</div>
              </div>
              <div className="info-card" style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '18px',
                transition: 'border-color 0.2s'
              }}>
                <div className="info-card-icon" style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <i className="fas fa-desktop" style={{ color: '#1A1A1A', fontSize: '0.9rem' }}></i>
                </div>
                <div className="info-card-title" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '6px'
                }}>Device & Usage Data</div>
                <div className="info-card-text" style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B',
                  lineHeight: 1.55
                }}>IP address, browser type, pages visited, time spent, and referring URLs via analytics.</div>
              </div>
              <div className="info-card" style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '18px',
                transition: 'border-color 0.2s'
              }}>
                <div className="info-card-icon" style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <i className="fas fa-comments" style={{ color: '#1A1A1A', fontSize: '0.9rem' }}></i>
                </div>
                <div className="info-card-title" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '6px'
                }}>Communications</div>
                <div className="info-card-text" style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B',
                  lineHeight: 1.55
                }}>Messages you send us via contact forms, emails, or customer support channels.</div>
              </div>
            </div>
          </section>

          <section className="policy-section" id="how-we-use" style={{
            marginBottom: '56px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 02</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>How We Use Your Information</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>We use the information we collect solely to operate and improve Ismora. We do not sell your personal data to third parties.</p>
            <ul className="policy-list" style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              margin: '16px 0',
              padding: 0
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                Process and fulfill your orders, and send order confirmation and shipping updates
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                Respond to your inquiries and provide customer support
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                Send promotional emails and offers — only if you have opted in
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                Analyze website traffic to improve product offerings and user experience
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                Detect and prevent fraud, unauthorized transactions, and abuse
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                Comply with legal obligations applicable under UAE law
              </li>
            </ul>
          </section>

          <section className="policy-section" id="sharing" style={{
            marginBottom: '56px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 03</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Sharing Your Information</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>Ismora is a dropshipping store. To fulfill your orders, we share limited information with trusted third-party partners.</p>
            <ul className="policy-list" style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              margin: '16px 0',
              padding: 0
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Suppliers & Fulfillment Partners:</strong> Your shipping name and address are shared with our product suppliers to dispatch your order.
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Delivery Services:</strong> Courier companies receive your contact details and address for delivery coordination.
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Payment Processors:</strong> Payment gateways process your transaction data under their own privacy policies.
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Analytics Providers:</strong> Aggregated, anonymized usage data may be shared with Google Analytics to understand site performance.
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights.
              </li>
            </ul>
            <div className="policy-highlight">
              <p style={{
                fontSize: '0.9rem',
                color: '#1A1A1A',
                lineHeight: 1.65,
                fontWeight: 500,
                margin: 0
              }}>We never sell, rent, or trade your personal information to marketing companies or unrelated third parties.</p>
            </div>
          </section>

          <section className="policy-section" id="cookies" style={{
            marginBottom: '56px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 04</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Cookies & Tracking</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>Ismora uses cookies and similar tracking technologies to enhance your browsing experience, remember your cart, and analyze site traffic.</p>
            <ul className="policy-list" style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              margin: '16px 0',
              padding: 0
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Essential Cookies:</strong> Required for the website to function — including cart storage and session management.
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Analytics Cookies:</strong> Google Analytics cookies help us understand how visitors interact with our site.
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Advertising Cookies:</strong> Google AdSense may use cookies to serve relevant ads based on your browsing history.
              </li>
            </ul>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>You can disable cookies through your browser settings. Note that disabling essential cookies may affect certain website features like the shopping cart.</p>
          </section>

          <section className="policy-section" id="security" style={{
            marginBottom: '56px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 05</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Data Security</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>We take reasonable measures to protect your personal information from unauthorized access, disclosure, or destruction.</p>
            <ul className="policy-list" style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              margin: '16px 0',
              padding: 0
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                Our website uses HTTPS encryption for all data transmitted between your browser and our servers
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                Access to customer data is restricted to authorized team members only
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                We use Firebase (Google) infrastructure, which maintains industry-standard security practices
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                Payment transactions are handled by trusted, PCI-compliant payment processors
              </li>
            </ul>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>While we strive to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but commit to prompt notification if a breach occurs.</p>
          </section>

          <section className="policy-section" id="your-rights" style={{
            marginBottom: '56px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 06</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Your Rights</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>You have full control over your personal data. You may exercise the following rights at any time by contacting us:</p>
            <ul className="policy-list" style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              margin: '16px 0',
              padding: 0
            }}>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Access:</strong> Request a copy of the personal data we hold about you
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Correction:</strong> Ask us to update or correct inaccurate information
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Deletion:</strong> Request that we delete your personal data (subject to legal retention requirements)
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Opt-Out:</strong> Unsubscribe from marketing emails at any time using the link in our emails
              </li>
              <li style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.93rem',
                color: '#6B6B6B',
                lineHeight: 1.6
              }}>
                <span style={{
                  content: '""',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  flexShrink: 0,
                  marginTop: '8px'
                }}></span>
                <strong style={{ color: '#1A1A1A' }}>Portability:</strong> Request your data in a portable, machine-readable format
              </li>
            </ul>
          </section>

          <section className="policy-section" id="third-party" style={{
            marginBottom: '56px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 07</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Third-Party Links</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>Our website may contain links to external websites. These sites have their own privacy policies, and we are not responsible for their content or practices. We encourage you to review the privacy policy of any website you visit via a link from Ismora.</p>
          </section>

          <section className="policy-section" id="children" style={{
            marginBottom: '56px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 08</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Children's Privacy</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>Ismora is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will delete such information.</p>
          </section>

          <section className="policy-section" id="changes" style={{
            marginBottom: '56px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 09</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Changes to This Policy</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make material changes, we will update the "Last updated" date at the top of this page.</p>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>We encourage you to review this policy periodically. Continued use of our website after changes are posted constitutes your acceptance of the updated policy.</p>
          </section>

          <section className="policy-section" id="contact" style={{
            marginBottom: '0px',
            scrollMarginTop: '90px'
          }}>
            <p className="section-num" style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1A1A1A',
              marginBottom: '8px'
            }}>Section 10</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Contact Us</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please reach out to us:</p>
            <div className="info-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              margin: '20px 0'
            }}>
              <div className="info-card" style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '18px',
                transition: 'border-color 0.2s'
              }}>
                <div className="info-card-icon" style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <i className="fas fa-envelope" style={{ color: '#1A1A1A', fontSize: '0.9rem' }}></i>
                </div>
                <div className="info-card-title" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '6px'
                }}>Email Us</div>
                <div className="info-card-text" style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B',
                  lineHeight: 1.55
                }}>
                  ismora.ae@gmail.com<br />
                  We respond within 24 hours.
                </div>
              </div>
              <div className="info-card" style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '18px',
                transition: 'border-color 0.2s'
              }}>
                <div className="info-card-icon" style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <i className="fas fa-headset" style={{ color: '#1A1A1A', fontSize: '0.9rem' }}></i>
                </div>
                <div className="info-card-title" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '6px'
                }}>Contact Page</div>
                <div className="info-card-text" style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B',
                  lineHeight: 1.55
                }}>
                  <Link to="/contact-us" style={{ color: '#1A1A1A', fontWeight: 600, textDecoration: 'none' }}>Visit our Contact Page</Link>
                  <br />to send us a message.
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>

      <Footer />
    </>
  );
}

export default PrivacyPolicy;