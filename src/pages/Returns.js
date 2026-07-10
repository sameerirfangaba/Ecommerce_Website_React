import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Returns() {
  const [activeSection, setActiveSection] = useState('eligibility');

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
    { id: 'eligibility', num: '1', title: 'Return Eligibility' },
    { id: 'how-to-return', num: '2', title: 'How to Return' },
    { id: 'refunds', num: '3', title: 'Refunds' },
    { id: 'exchanges', num: '4', title: 'Exchanges' },
    { id: 'damaged', num: '5', title: 'Damaged Items' },
    { id: 'non-returnable', num: '6', title: 'Non-Returnable Items' },
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
          background-image: radial-gradient(circle at 60% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 10% 20%, rgba(255,255,255,0.07) 0%, transparent 40%);
        }
        .page-hero-grid {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .stat-card {
          background: white;
          border: 1px solid #EAEAEA;
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.07);
        }
        .stat-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #1A1A1A;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 0.82rem;
          font-weight: 500;
          color: #6B6B6B;
        }
        .toc-list a.active {
          background: #FAFAFA;
          color: #1A1A1A;
        }
        .toc-list a.active .toc-num {
          background: #1A1A1A;
          color: white;
        }
        .elig-card.yes {
          background: rgba(34,197,94,0.06);
          border: 1px solid rgba(34,197,94,0.2);
        }
        .elig-card.no {
          background: rgba(239,68,68,0.05);
          border: 1px solid rgba(239,68,68,0.15);
        }
        .elig-card.yes .elig-icon {
          background: rgba(34,197,94,0.15);
          color: #22c55e;
        }
        .elig-card.no .elig-icon {
          background: rgba(239,68,68,0.12);
          color: #ef4444;
        }
        .elig-card.yes .elig-title {
          color: #22c55e;
        }
        .elig-card.no .elig-title {
          color: #ef4444;
        }
        .step-card:hover {
          border-color: rgba(255,255,255,0.3);
        }
        .step-num-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #1A1A1A;
          color: white;
          font-size: 0.82rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
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
        .policy-highlight {
          background: #FAFAFA;
          border-left: 3px solid #1A1A1A;
          border-radius: 0 10px 10px 0;
          padding: 16px 20px;
          margin: 20px 0;
        }
        .contact-cta {
          background: #1A1A1A;
          border-radius: 20px;
          padding: 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin-top: 16px;
        }
        .contact-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15), transparent 60%), radial-gradient(circle at 70% 50%, rgba(255,255,255,0.08), transparent 60%);
        }
        .contact-cta-content {
          position: relative;
          z-index: 1;
        }
        @media (max-width: 1024px) {
          .content-wrap { grid-template-columns: 1fr !important; }
          .toc-sidebar { position: static !important; }
          .eligibility-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .page-hero { padding: 48px 0 40px; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .contact-cta { padding: 32px 24px !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
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
            }}>Returns & Refunds</span>
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
            <i className="fas fa-undo-alt"></i> &nbsp;Returns
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
            Returns & <em style={{ fontStyle: 'italic', color: '#1A1A1A' }}>Refunds</em>
          </h1>
          <p className="page-hero-sub" style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '560px'
          }}>We stand behind every product we sell. If something isn't right, we'll make it right — quickly and hassle-free.</p>
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
              <i className="fas fa-clock" style={{ color: '#1A1A1A', fontSize: '0.85rem' }}></i>
              7-day return window
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-wrap" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        marginTop: '-32px',
        position: 'relative',
        zIndex: 2
      }}>
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px'
        }}>
          <div className="stat-card">
            <div className="stat-num">7</div>
            <div className="stat-label">Days to request a return</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">5–10</div>
            <div className="stat-label">Business days for refund processing</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">24h</div>
            <div className="stat-label">Support response time</div>
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
              }}>Want to start a return? Contact us first.</p>
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
              <i className="fas fa-heart" style={{ color: '#1A1A1A', marginRight: '8px' }}></i>
              Your satisfaction is our priority. We accept returns for defective, damaged, or incorrect items within <strong>7 days</strong> of delivery. Please read this policy carefully before initiating a return.
            </p>
          </div>

          {/* SECTION 1 - Eligibility */}
          <section className="policy-section" id="eligibility" style={{
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
            }}>Return Eligibility</h2>
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
            }}>Not all situations qualify for a return. Here's a clear breakdown of what we do and don't accept:</p>

            <div className="eligibility-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              margin: '20px 0'
            }}>
              <div className="elig-card yes" style={{
                borderRadius: '14px',
                padding: '20px',
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)'
              }}>
                <div className="elig-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '14px'
                }}>
                  <div className="elig-icon" style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    background: 'rgba(34,197,94,0.15)',
                    color: '#22c55e'
                  }}>
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="elig-title" style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#22c55e'
                  }}>✅ Eligible for Return</div>
                </div>
                <ul className="elig-list" style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: 0
                }}>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '0.72rem', color: '#22c55e', flexShrink: 0, marginTop: '4px' }}></i>
                    Item arrived defective or broken
                  </li>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '0.72rem', color: '#22c55e', flexShrink: 0, marginTop: '4px' }}></i>
                    Wrong item received (not what you ordered)
                  </li>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '0.72rem', color: '#22c55e', flexShrink: 0, marginTop: '4px' }}></i>
                    Item damaged during shipping
                  </li>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '0.72rem', color: '#22c55e', flexShrink: 0, marginTop: '4px' }}></i>
                    Item significantly different from description
                  </li>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '0.72rem', color: '#22c55e', flexShrink: 0, marginTop: '4px' }}></i>
                    Missing parts or accessories
                  </li>
                </ul>
              </div>

              <div className="elig-card no" style={{
                borderRadius: '14px',
                padding: '20px',
                background: 'rgba(239,68,68,0.05)',
                border: '1px solid rgba(239,68,68,0.15)'
              }}>
                <div className="elig-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '14px'
                }}>
                  <div className="elig-icon" style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    background: 'rgba(239,68,68,0.12)',
                    color: '#ef4444'
                  }}>
                    <i className="fas fa-times"></i>
                  </div>
                  <div className="elig-title" style={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#ef4444'
                  }}>❌ Not Eligible</div>
                </div>
                <ul className="elig-list" style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: 0
                }}>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-times-circle" style={{ fontSize: '0.72rem', color: '#ef4444', flexShrink: 0, marginTop: '4px' }}></i>
                    Change of mind
                  </li>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-times-circle" style={{ fontSize: '0.72rem', color: '#ef4444', flexShrink: 0, marginTop: '4px' }}></i>
                    Wrong size or color ordered
                  </li>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-times-circle" style={{ fontSize: '0.72rem', color: '#ef4444', flexShrink: 0, marginTop: '4px' }}></i>
                    Item used or opened (unless defective)
                  </li>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-times-circle" style={{ fontSize: '0.72rem', color: '#ef4444', flexShrink: 0, marginTop: '4px' }}></i>
                    Request made after 7 days of delivery
                  </li>
                  <li style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    lineHeight: 1.5
                  }}>
                    <i className="fas fa-times-circle" style={{ fontSize: '0.72rem', color: '#ef4444', flexShrink: 0, marginTop: '4px' }}></i>
                    Sale or clearance items
                  </li>
                </ul>
              </div>
            </div>
            <p className="policy-text" style={{
              color: '#6B6B6B',
              fontSize: '0.93rem',
              lineHeight: 1.75,
              marginBottom: '14px'
            }}>Items must be in their original condition, unused, and in original packaging to qualify for a return.</p>
          </section>

          {/* SECTION 2 - How to Return */}
          <section className="policy-section" id="how-to-return" style={{
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
            }}>How to Return an Item</h2>
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
            }}>Starting a return is simple. Follow these steps:</p>

            <div className="steps-grid" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              margin: '20px 0'
            }}>
              <div className="step-card" style={{
                display: 'flex',
                gap: '16px',
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '14px',
                padding: '18px 20px',
                transition: 'border-color 0.2s'
              }}>
                <div className="step-num-badge">1</div>
                <div className="step-info">
                  <div className="step-info-title" style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Contact Our Support Team</div>
                  <div className="step-info-desc" style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    lineHeight: 1.55
                  }}>
                    Within 7 days of receiving your order, <Link to="/contact-us" style={{ color: '#1A1A1A', fontWeight: 600 }}>contact us</Link> via our contact page or email at ismora.ae@gmail.com.
                  </div>
                </div>
              </div>

              <div className="step-card" style={{
                display: 'flex',
                gap: '16px',
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '14px',
                padding: '18px 20px',
                transition: 'border-color 0.2s'
              }}>
                <div className="step-num-badge">2</div>
                <div className="step-info">
                  <div className="step-info-title" style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Provide Order Details</div>
                  <div className="step-info-desc" style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    lineHeight: 1.55
                  }}>Share your order reference number (e.g. #ISM-XXXXXX), a description of the issue, and clear photos of the item and its condition.</div>
                </div>
              </div>

              <div className="step-card" style={{
                display: 'flex',
                gap: '16px',
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '14px',
                padding: '18px 20px',
                transition: 'border-color 0.2s'
              }}>
                <div className="step-num-badge">3</div>
                <div className="step-info">
                  <div className="step-info-title" style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>We Review Your Request</div>
                  <div className="step-info-desc" style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    lineHeight: 1.55
                  }}>Our team will review your case within 24–48 hours and confirm whether your return is approved.</div>
                </div>
              </div>

              <div className="step-card" style={{
                display: 'flex',
                gap: '16px',
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '14px',
                padding: '18px 20px',
                transition: 'border-color 0.2s'
              }}>
                <div className="step-num-badge">4</div>
                <div className="step-info">
                  <div className="step-info-title" style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Ship the Item Back</div>
                  <div className="step-info-desc" style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    lineHeight: 1.55
                  }}>If approved, we'll provide return instructions. For eligible defective/wrong item cases, we cover return shipping costs.</div>
                </div>
              </div>

              <div className="step-card" style={{
                display: 'flex',
                gap: '16px',
                background: 'white',
                border: '1px solid #EAEAEA',
                borderRadius: '14px',
                padding: '18px 20px',
                transition: 'border-color 0.2s'
              }}>
                <div className="step-num-badge">5</div>
                <div className="step-info">
                  <div className="step-info-title" style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Refund or Replacement Issued</div>
                  <div className="step-info-desc" style={{
                    fontSize: '0.83rem',
                    color: '#6B6B6B',
                    lineHeight: 1.55
                  }}>Once we receive and inspect the returned item, we process your refund or send a replacement within 5–10 business days.</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3 - Refunds */}
          <section className="policy-section" id="refunds" style={{
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
            }}>Refunds</h2>
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
            }}>Once your return is received and inspected, we will notify you of the approval or rejection of your refund.</p>
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
                Approved refunds are processed within <strong style={{ color: '#1A1A1A' }}>5–10 business days</strong> of receiving the returned item.
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
                Refunds are issued to your <strong style={{ color: '#1A1A1A' }}>original payment method</strong> where possible.
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
                For Cash on Delivery orders, refunds are issued via <strong style={{ color: '#1A1A1A' }}>bank transfer</strong> — please provide your bank details when contacting us.
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
                Original shipping fees (if any) are non-refundable unless the return is due to our error.
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
                Partial refunds may be issued in cases where only part of an order is returned.
              </li>
            </ul>
            <div className="policy-highlight" style={{
              background: '#FAFAFA',
              borderLeft: '3px solid #1A1A1A',
              borderRadius: '0 10px 10px 0',
              padding: '16px 20px',
              margin: '20px 0'
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: '#1A1A1A',
                lineHeight: 1.65,
                fontWeight: 500,
                margin: 0
              }}>If you haven't received your refund within 10 business days of approval, please first check your bank account, then contact your bank. If the issue persists, <Link to="/contact-us" style={{ color: '#1A1A1A' }}>contact our support team</Link>.</p>
            </div>
          </section>

          {/* SECTION 4 - Exchanges */}
          <section className="policy-section" id="exchanges" style={{
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
            }}>Exchanges</h2>
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
            }}>We offer exchanges for defective or incorrect items. If you received the wrong product or a damaged item and would prefer an exchange over a refund, simply let us know when you contact support.</p>
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
                Exchanges are subject to product availability at the time of the request.
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
                If the exact same item is unavailable, we will issue a full refund instead.
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
                Exchanges for size or color preferences are <strong style={{ color: '#1A1A1A' }}>not available</strong> — please choose carefully before ordering.
              </li>
            </ul>
          </section>

          {/* SECTION 5 - Damaged Items */}
          <section className="policy-section" id="damaged" style={{
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
            }}>Damaged or Defective Items</h2>
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
            }}>If you receive an item that is damaged, defective, or not as described, we sincerely apologize and will make it right immediately.</p>

            <div className="warning-box" style={{
              background: '#fff7ed',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '12px',
              padding: '16px 20px',
              margin: '20px 0',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              <i className="fas fa-camera" style={{ color: '#1A1A1A', fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }}></i>
              <p style={{
                fontSize: '0.88rem',
                color: '#7c3a10',
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 500
              }}>Please take clear photos of the damaged item and its packaging before contacting us. This helps us process your claim quickly and file a report with our supplier or courier.</p>
            </div>

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
                Contact us within 7 days of delivery with photos and your order reference.
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
                We cover all return shipping costs for damaged or defective items.
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
                You can choose between a full refund or a replacement at no extra cost.
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
                Claims reported after 7 days may not be eligible for a free replacement.
              </li>
            </ul>
          </section>

          {/* SECTION 6 - Non-Returnable */}
          <section className="policy-section" id="non-returnable" style={{
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
            }}>Non-Returnable Items</h2>
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
            }}>The following items cannot be returned or refunded under any circumstances:</p>
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
                Items purchased during <strong style={{ color: '#1A1A1A' }}>sale, clearance, or promotional events</strong> (unless defective)
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
                Items that have been <strong style={{ color: '#1A1A1A' }}>used, washed, or altered</strong> from their original state
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
                Items without <strong style={{ color: '#1A1A1A' }}>original packaging</strong>
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
                Items returned after the <strong style={{ color: '#1A1A1A' }}>7-day window</strong> without prior approval
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
                Custom or personalized items (unless defective)
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
                Perishable goods or hygiene-related products
              </li>
            </ul>
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
            }}>Ready to start a return or have a question about your order? We're here to help.</p>

            <div className="contact-cta">
              <div className="contact-cta-content">
                <h3 style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '10px'
                }}>Need to return something?</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.93rem',
                  marginBottom: '28px'
                }}>Our support team responds within 24 hours. Have your order reference number and photos ready to speed up the process.</p>
                <div className="contact-cta-btns" style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <Link to="/contact-us" className="btn btn-accent btn-lg" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '15px 32px',
                    borderRadius: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    background: '#1A1A1A',
                    color: 'white'
                  }}>
                    <i className="fas fa-envelope"></i> Start a Return
                  </Link>
                  <Link to="/faq" className="btn btn-lg" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '15px 32px',
                    borderRadius: '12px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}>
                    <i className="fas fa-question-circle"></i> View FAQ
                  </Link>
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

export default Returns;