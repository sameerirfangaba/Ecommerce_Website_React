import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ShippingPolicy() {
  const [activeSection, setActiveSection] = useState('how-it-works');

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
    { id: 'how-it-works', num: '1', title: 'How It Works' },
    { id: 'delivery-times', num: '2', title: 'Delivery Times' },
    { id: 'shipping-rates', num: '3', title: 'Shipping Rates' },
    { id: 'tracking', num: '4', title: 'Order Tracking' },
    { id: 'coverage', num: '5', title: 'Coverage Areas' },
    { id: 'lost-orders', num: '6', title: 'Lost / Delayed Orders' },
    { id: 'contact', num: '7', title: 'Contact Us' }
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
          background-image: radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.07) 0%, transparent 40%);
        }
        .page-hero-grid {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .highlight-card:hover {
          border-color: #1A1A1A;
          transform: translateY(-2px);
        }
        .highlight-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }
        .highlight-icon i {
          color: #1A1A1A;
          font-size: 1.1rem;
        }
        .toc-list a.active {
          background: #FAFAFA;
          color: #1A1A1A;
        }
        .toc-list a.active .toc-num {
          background: #1A1A1A;
          color: white;
        }
        .policy-highlight {
          background: #FAFAFA;
          border-left: 3px solid #1A1A1A;
          border-radius: 0 10px 10px 0;
          padding: 16px 20px;
          margin: 20px 0;
        }
        .tl-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 19px;
          top: 44px;
          bottom: -8px;
          width: 2px;
          background: #EAEAEA;
        }
        .tl-dot {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 24px;
        }
        .tl-dot i {
          color: #1A1A1A;
          font-size: 0.85rem;
        }
        .ship-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #EAEAEA;
          margin: 20px 0;
        }
        .ship-table th {
          background: #1A1A1A;
          color: white;
          padding: 13px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-align: left;
        }
        .ship-table td {
          padding: 13px 16px;
          font-size: 0.875rem;
          color: #6B6B6B;
          border-bottom: 1px solid #EAEAEA;
        }
        .ship-table tr:last-child td {
          border-bottom: none;
        }
        .ship-table tr:nth-child(even) td {
          background: #FAFAFA;
        }
        .free-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(34,197,94,0.1);
          color: #22c55e;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
        }
        @media (max-width: 1024px) {
          .content-wrap { grid-template-columns: 1fr !important; }
          .toc-sidebar { position: static !important; }
          .highlights-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .page-hero { padding: 48px 0 40px; }
          .highlights-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ship-table { font-size: 0.75rem; }
          .ship-table th, .ship-table td { padding: 10px 12px; }
        }
        @media (max-width: 480px) {
          .highlights-grid { grid-template-columns: 1fr !important; }
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
              textDecoration: 'none'
            }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>›</span>
            <span className="current" style={{
              color: '#1A1A1A',
              fontSize: '0.82rem',
              fontWeight: 500
            }}>Shipping Policy</span>
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
            <i className="fas fa-shipping-fast"></i> &nbsp;Shipping
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
            Shipping <em style={{ fontStyle: 'italic', color: '#1A1A1A' }}>Policy</em>
          </h1>
          <p className="page-hero-sub" style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '560px'
          }}>Everything you need to know about how we get your orders to your doorstep, fast and safely.</p>
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
              Shipping within UAE
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <div className="highlights-wrap" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        marginTop: '-32px',
        position: 'relative',
        zIndex: 2
      }}>
        <div className="highlights-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          <div className="highlight-card" style={{
            background: 'white',
            border: '1px solid #EAEAEA',
            borderRadius: '16px',
            padding: '22px 20px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}>
            <div className="highlight-icon">
              <i className="fas fa-truck"></i>
            </div>
            <div className="highlight-title" style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#1A1A1A',
              marginBottom: '4px'
            }}>3–7 Business Days</div>
            <div className="highlight-sub" style={{
              fontSize: '0.78rem',
              color: '#6B6B6B'
            }}>Standard delivery timeframe</div>
          </div>

          <div className="highlight-card" style={{
            background: 'white',
            border: '1px solid #EAEAEA',
            borderRadius: '16px',
            padding: '22px 20px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}>
            <div className="highlight-icon">
              <i className="fas fa-gift"></i>
            </div>
            <div className="highlight-title" style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#1A1A1A',
              marginBottom: '4px'
            }}>Free Shipping</div>
            <div className="highlight-sub" style={{
              fontSize: '0.78rem',
              color: '#6B6B6B'
            }}>On qualifying orders</div>
          </div>

          <div className="highlight-card" style={{
            background: 'white',
            border: '1px solid #EAEAEA',
            borderRadius: '16px',
            padding: '22px 20px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}>
            <div className="highlight-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="highlight-title" style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#1A1A1A',
              marginBottom: '4px'
            }}>Order Tracking</div>
            <div className="highlight-sub" style={{
              fontSize: '0.78rem',
              color: '#6B6B6B'
            }}>Track via email or WhatsApp</div>
          </div>

          <div className="highlight-card" style={{
            background: 'white',
            border: '1px solid #EAEAEA',
            borderRadius: '16px',
            padding: '22px 20px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
            transition: 'border-color 0.2s, transform 0.2s'
          }}>
            <div className="highlight-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="highlight-title" style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#1A1A1A',
              marginBottom: '4px'
            }}>Safe Packaging</div>
            <div className="highlight-sub" style={{
              fontSize: '0.78rem',
              color: '#6B6B6B'
            }}>Orders packed securely</div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content-wrap" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '64px 24px 80px',
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: '48px',
        alignItems: 'start'
      }}>

        {/* TOC */}
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
              }}>Shipping question? We're happy to help.</p>
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
              Ismora is a dropshipping store. Products are shipped directly from our verified suppliers to your doorstep. All shipping timelines below reflect standard processing and courier transit times.
            </p>
          </div>

          {/* SECTION 1 - How It Works */}
          <section className="policy-section" id="how-it-works" style={{
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
            }}>How It Works</h2>
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
            }}>Once you place your order on Ismora, here's exactly what happens:</p>

            <div className="timeline" style={{
              margin: '24px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0'
            }}>
              <div className="tl-item" style={{
                display: 'flex',
                gap: '20px',
                position: 'relative'
              }}>
                <div className="tl-dot">
                  <i className="fas fa-check"></i>
                </div>
                <div className="tl-content" style={{ paddingBottom: '28px' }}>
                  <div className="tl-title" style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Order Confirmed</div>
                  <div className="tl-desc" style={{
                    fontSize: '0.85rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}>Your order is received and you get a confirmation with your order reference number.</div>
                </div>
              </div>

              <div className="tl-item" style={{
                display: 'flex',
                gap: '20px',
                position: 'relative'
              }}>
                <div className="tl-dot">
                  <i className="fas fa-box"></i>
                </div>
                <div className="tl-content" style={{ paddingBottom: '28px' }}>
                  <div className="tl-title" style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Processing (1–2 days)</div>
                  <div className="tl-desc" style={{
                    fontSize: '0.85rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}>We forward your order to the supplier who picks, packs, and prepares your item for dispatch.</div>
                </div>
              </div>

              <div className="tl-item" style={{
                display: 'flex',
                gap: '20px',
                position: 'relative'
              }}>
                <div className="tl-dot">
                  <i className="fas fa-shipping-fast"></i>
                </div>
                <div className="tl-content" style={{ paddingBottom: '28px' }}>
                  <div className="tl-title" style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Dispatched</div>
                  <div className="tl-desc" style={{
                    fontSize: '0.85rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}>Your order is handed to a courier partner. You receive tracking information via email or WhatsApp.</div>
                </div>
              </div>

              <div className="tl-item" style={{
                display: 'flex',
                gap: '20px',
                position: 'relative'
              }}>
                <div className="tl-dot">
                  <i className="fas fa-home"></i>
                </div>
                <div className="tl-content" style={{ paddingBottom: '0' }}>
                  <div className="tl-title" style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Delivered to You</div>
                  <div className="tl-desc" style={{
                    fontSize: '0.85rem',
                    color: '#6B6B6B',
                    lineHeight: 1.6
                  }}>Your package arrives at your specified delivery address. Enjoy your order!</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2 - Delivery Times */}
          <section className="policy-section" id="delivery-times" style={{
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
            }}>Delivery Times</h2>
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
            }}>Delivery times depend on your location within UAE and supplier availability. The estimates below are from the date of dispatch:</p>

            <table className="ship-table">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Estimated Delivery</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Major Cities</strong> (Dubai, Abu Dhabi, Sharjah)</td>
                  <td>3–5 Business Days</td>
                  <td>Fastest delivery zones</td>
                </tr>
                <tr>
                  <td><strong>Other Cities</strong> (Ras Al Khaimah, Ajman, etc.)</td>
                  <td>4–6 Business Days</td>
                  <td>Standard timeline</td>
                </tr>
                <tr>
                  <td><strong>Remote / Rural Areas</strong></td>
                  <td>5–7 Business Days</td>
                  <td>May vary by courier reach</td>
                </tr>
              </tbody>
            </table>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>These timelines are estimates and may be affected by public holidays, weather conditions, or high-volume periods (e.g. Eid, sale events).</p>
          </section>

          {/* SECTION 3 - Shipping Rates */}
          <section className="policy-section" id="shipping-rates" style={{
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
            }}>Shipping Rates</h2>
            <div className="section-divider" style={{
              width: '40px',
              height: '3px',
              background: '#1A1A1A',
              borderRadius: '2px',
              marginBottom: '20px'
            }}></div>

            <table className="ship-table">
              <thead>
                <tr>
                  <th>Order Value</th>
                  <th>Shipping Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Below free shipping threshold</td>
                  <td>Standard delivery fee (shown at checkout)</td>
                </tr>
                <tr>
                  <td>Above free shipping threshold</td>
                  <td>
                    <span className="free-tag">
                      <i className="fas fa-check"></i> FREE
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="policy-highlight">
              <p>
                <i className="fas fa-tag" style={{ color: '#1A1A1A', marginRight: '8px' }}></i>
                The exact free shipping threshold and delivery fee are displayed clearly on the checkout page before you confirm your order. No surprises!
              </p>
            </div>
          </section>

          {/* SECTION 4 - Tracking */}
          <section className="policy-section" id="tracking" style={{
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
            }}>Order Tracking</h2>
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
            }}>Once your order is dispatched, we will send tracking information through:</p>
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
                <strong style={{ color: '#1A1A1A' }}>Email:</strong> A tracking number and courier name will be sent to the email address provided at checkout.
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
                <strong style={{ color: '#1A1A1A' }}>WhatsApp:</strong> If you provided a WhatsApp number, we may send tracking updates directly to you.
              </li>
            </ul>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>You can use the tracking number on the courier's website to monitor your delivery in real time. If you haven't received tracking information within <strong>3 business days</strong> of placing your order, please contact our support team.</p>
          </section>

          {/* SECTION 5 - Coverage */}
          <section className="policy-section" id="coverage" style={{
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
            }}>Coverage Areas</h2>
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
            }}>We currently ship across <strong>UAE</strong> including all major cities and most towns and villages. Our courier partners cover a wide network across the country.</p>
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
                Dubai, Abu Dhabi, Sharjah, Ras Al Khaimah, Ajman, Fujairah, Umm Al Quwain
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
                Remote areas may have slightly longer delivery windows
              </li>
            </ul>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>For <strong>international shipping</strong>, please <Link to="/contact-us" style={{ color: '#1A1A1A', fontWeight: 600 }}>contact us</Link> to check availability for your specific location.</p>
          </section>

          {/* SECTION 6 - Lost Orders */}
          <section className="policy-section" id="lost-orders" style={{
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
            }}>Lost or Delayed Orders</h2>
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
            }}>While rare, delivery issues can occasionally occur. Here's how we handle them:</p>
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
                If your order hasn't arrived within the estimated delivery window, first check your tracking link for updates.
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
                If tracking shows no movement for more than <strong>3 business days</strong>, contact us immediately.
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
                Report a potentially lost order within <strong>14 days</strong> of the estimated delivery date.
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
                We will open an investigation with the courier on your behalf.
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
                In the case of a confirmed lost shipment, we will arrange a <strong>replacement or full refund</strong>.
              </li>
            </ul>
            <div className="policy-highlight">
              <p style={{
                fontSize: '0.9rem',
                color: '#1A1A1A',
                lineHeight: 1.65,
                fontWeight: 500,
                margin: 0
              }}>We are not responsible for delays caused by courier services, customs, natural disasters, or events outside our control. However, we will always do our best to resolve any issue quickly.</p>
            </div>
          </section>

          {/* SECTION 7 - Contact */}
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
            }}>Section 07</p>
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
            }}>Have a question about your shipment? Our support team is ready to help.</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginTop: '16px'
            }}>
              <div style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <i className="fas fa-envelope" style={{ color: '#1A1A1A' }}></i>
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '4px'
                }}>Email Us</div>
                <div style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B'
                }}>
                  ismora.ae@gmail.com<br />
                  Response within 24 hours
                </div>
              </div>
              <div style={{
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <i className="fas fa-headset" style={{ color: '#1A1A1A' }}></i>
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1A1A1A',
                  marginBottom: '4px'
                }}>Contact Page</div>
                <div style={{
                  fontSize: '0.82rem',
                  color: '#6B6B6B'
                }}>
                  <Link to="/contact-us" style={{ color: '#1A1A1A', fontWeight: 600, textDecoration: 'none' }}>Visit Contact Page</Link>
                  <br />Send us a message directly
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

export default ShippingPolicy;