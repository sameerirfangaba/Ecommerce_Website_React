import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Terms() {
  const [activeSection, setActiveSection] = useState('acceptance');

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
    { id: 'acceptance', num: '1', title: 'Acceptance of Terms' },
    { id: 'about-us', num: '2', title: 'About Ismora' },
    { id: 'orders', num: '3', title: 'Orders & Payments' },
    { id: 'shipping', num: '4', title: 'Shipping & Delivery' },
    { id: 'returns', num: '5', title: 'Returns & Refunds' },
    { id: 'products', num: '6', title: 'Products & Pricing' },
    { id: 'use', num: '7', title: 'Use of Website' },
    { id: 'ip', num: '8', title: 'Intellectual Property' },
    { id: 'liability', num: '9', title: 'Limitation of Liability' },
    { id: 'governing', num: '10', title: 'Governing Law' },
    { id: 'contact', num: '11', title: 'Contact Us' }
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
          background-image: radial-gradient(circle at 85% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 15% 20%, rgba(255,255,255,0.07) 0%, transparent 40%);
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
        .warning-box {
          background: #fff7ed;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 12px;
          padding: 16px 20px;
          margin: 20px 0;
          display: flex;
          gap: 14px;
          align-items: flex-start;
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

      {/* PAGE HERO */}
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
            }}>Terms & Conditions</span>
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
            <i className="fas fa-file-contract"></i> &nbsp;Legal
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
            Terms & <em style={{ fontStyle: 'italic', color: '#1A1A1A' }}>Conditions</em>
          </h1>
          <p className="page-hero-sub" style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '560px'
          }}>Please read these terms carefully before using Ismora. By shopping with us, you agree to be bound by these terms and conditions.</p>
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

      {/* CONTENT */}
      <div className="content-wrap" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '64px 24px',
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '48px',
        alignItems: 'start'
      }}>

        {/* SIDEBAR TOC */}
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
              }}>Questions about our terms? We're happy to clarify.</p>
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

        {/* MAIN CONTENT */}
        <article className="policy-body" style={{ minWidth: 0 }}>
          <div className="policy-highlight">
            <p>
              <i className="fas fa-info-circle" style={{ color: '#1A1A1A', marginRight: '8px' }}></i>
              These Terms & Conditions govern your use of <strong>ismora.shop</strong> and any purchase made through our platform. By accessing our website or placing an order, you agree to these terms in full.
            </p>
          </div>

          {/* SECTION 1 - Acceptance */}
          <section className="policy-section" id="acceptance" style={{
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
            }}>Acceptance of Terms</h2>
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
            }}>By accessing or using ismora.shop, browsing products, or placing an order, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions.</p>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>If you do not agree with any part of these terms, you must not use our website or services. We reserve the right to update these terms at any time, and continued use of the website constitutes acceptance of those changes.</p>
          </section>

          {/* SECTION 2 - About Us */}
          <section className="policy-section" id="about-us" style={{
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
            }}>About Ismora</h2>
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
            }}>Ismora is an online dropshipping store operated from the United Arab Emirates. We source products from third-party suppliers and fulfill orders through our supplier network. Ismora acts as the merchant of record for all transactions processed on our platform.</p>
            <div className="warning-box">
              <i className="fas fa-info-circle" style={{ color: '#1A1A1A', fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}></i>
              <p style={{
                fontSize: '0.88rem',
                color: '#7c3a10',
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 500
              }}>As a dropshipping business, physical products are shipped directly from our suppliers to you. Delivery timelines and product specifications are subject to supplier availability.</p>
            </div>
          </section>

          {/* SECTION 3 - Orders & Payments */}
          <section className="policy-section" id="orders" style={{
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
            }}>Orders & Payments</h2>
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
            }}>When you place an order on Ismora, you are making an offer to purchase the selected products at the listed price. We reserve the right to accept or decline any order.</p>
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
                All prices are displayed in the currency shown at checkout and are inclusive of applicable taxes.
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
                Orders are confirmed only after successful payment processing.
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
                We reserve the right to cancel orders that appear fraudulent or that we cannot fulfill.
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
                You will receive an order confirmation email after successful placement.
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
                Payment must be made in full at the time of purchase via the available payment methods.
              </li>
            </ul>
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
                  <i className="fas fa-check-circle" style={{ color: '#1A1A1A', fontSize: '0.9rem' }}></i>
                </div>
                <div className="info-card-title" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '6px'
                }}>Order Confirmation</div>
                <div className="info-card-text" style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B',
                  lineHeight: 1.55
                }}>You'll receive a confirmation email after we accept your order.</div>
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
                  <i className="fas fa-times-circle" style={{ color: '#1A1A1A', fontSize: '0.9rem' }}></i>
                </div>
                <div className="info-card-title" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '6px'
                }}>Order Cancellations</div>
                <div className="info-card-text" style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B',
                  lineHeight: 1.55
                }}>Cancel within 12 hours of placing your order by contacting support.</div>
              </div>
            </div>
          </section>

          {/* SECTION 4 - Shipping */}
          <section className="policy-section" id="shipping" style={{
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
            }}>Shipping & Delivery</h2>
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
            }}>Ismora ships orders via trusted courier partners. Delivery times are estimates and may vary based on your location and product availability.</p>
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
                Standard delivery within UAE typically takes 3–7 business days.
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
                Free shipping is available on qualifying orders as indicated on the website.
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
                We are not responsible for delays caused by courier services, natural disasters, or other events outside our control.
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
                Tracking information will be shared via email once your order is dispatched.
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
                If a package is lost in transit, please contact us within 14 days and we will investigate.
              </li>
            </ul>
          </section>

          {/* SECTION 5 - Returns */}
          <section className="policy-section" id="returns" style={{
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
            }}>Returns & Refunds</h2>
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
            }}>We want you to be happy with every purchase. If you receive a defective, damaged, or incorrect item, we will gladly arrange a return or replacement.</p>
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
                Return requests must be raised within <strong style={{ color: '#1A1A1A' }}>7 days</strong> of receiving your order.
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
                Items must be unused, in original packaging, and in the same condition as received.
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
                For defective or wrong items, we cover return shipping costs.
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
                Refunds are processed within 5–10 business days after we receive and inspect the returned item.
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
                Sale and clearance items are final sale and are not eligible for returns unless defective.
              </li>
            </ul>
            <div className="warning-box">
              <i className="fas fa-exclamation-triangle" style={{ color: '#1A1A1A', fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}></i>
              <p style={{
                fontSize: '0.88rem',
                color: '#7c3a10',
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 500
              }}>Returns are not accepted for change of mind or incorrect size/color selection. Please review product details carefully before placing an order.</p>
            </div>
          </section>

          {/* SECTION 6 - Products & Pricing */}
          <section className="policy-section" id="products" style={{
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
            }}>Products & Pricing</h2>
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
            }}>We take care to accurately display product descriptions, images, and pricing. However, errors may occasionally occur.</p>
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
                Product images are for illustrative purposes. Minor variations in color or appearance may exist due to monitor settings.
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
                We reserve the right to correct pricing errors and may cancel orders placed at incorrect prices.
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
                Product availability is subject to change without notice.
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
                Prices may be updated at any time; the price at the time of your order will apply.
              </li>
            </ul>
          </section>

          {/* SECTION 7 - Use of Website */}
          <section className="policy-section" id="use" style={{
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
            }}>Use of Website</h2>
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
            }}>By using ismora.shop, you agree to use the website only for lawful purposes and in a manner that does not infringe the rights of others.</p>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>You must not:</p>
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
                Use the website to conduct fraudulent transactions or impersonate another person
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
                Attempt to gain unauthorized access to any part of the website or its systems
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
                Use automated tools (bots, scrapers) to extract data from our website
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
                Post or transmit any harmful, offensive, or illegal content
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
                Interfere with the security or performance of the website
              </li>
            </ul>
          </section>

          {/* SECTION 8 - Intellectual Property */}
          <section className="policy-section" id="ip" style={{
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
            }}>Intellectual Property</h2>
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
            }}>All content on ismora.shop — including but not limited to the logo, brand name, text, images, design, and code — is the intellectual property of Ismora or its licensors.</p>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>You may not reproduce, distribute, or use any content from this website without prior written permission from Ismora. Unauthorized use may result in legal action.</p>
          </section>

          {/* SECTION 9 - Limitation of Liability */}
          <section className="policy-section" id="liability" style={{
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
            }}>Limitation of Liability</h2>
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
            }}>To the fullest extent permitted by applicable law, Ismora shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products.</p>
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
                Our total liability to you for any claim arising out of a transaction shall not exceed the amount paid for the relevant order.
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
                We are not responsible for third-party supplier errors, courier delays, or circumstances beyond our control.
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
                We do not warrant that the website will be uninterrupted, error-free, or free from viruses.
              </li>
            </ul>
            <div className="policy-highlight">
              <p style={{
                fontSize: '0.9rem',
                color: '#1A1A1A',
                lineHeight: 1.65,
                fontWeight: 500,
                margin: 0
              }}>Nothing in these terms limits our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.</p>
            </div>
          </section>

          {/* SECTION 10 - Governing Law */}
          <section className="policy-section" id="governing" style={{
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
            }}>Section 10</p>
            <h2 className="section-heading" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>Governing Law</h2>
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
            }}>These Terms & Conditions are governed by and construed in accordance with the laws of UAE. Any disputes arising from these terms or your use of Ismora shall be subject to the exclusive jurisdiction of the courts of UAE.</p>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
          </section>

          {/* SECTION 11 - Contact */}
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
            }}>Section 11</p>
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
            }}>If you have any questions about these Terms & Conditions, please get in touch with us and we'll be happy to assist.</p>
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

export default Terms;