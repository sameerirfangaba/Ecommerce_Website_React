import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const faqData = {
    orders: {
      title: 'Orders',
      icon: 'fa-shopping-bag',
      questions: [
        {
          q: 'How do I place an order on Ismora?',
          a: 'Simply browse our shop, select your desired product, choose your size/color/variant, and click <strong>Add to Cart</strong>. Once you\'re ready, go to your cart and proceed to <strong>Checkout</strong>. Fill in your delivery details, choose a payment method, and click <strong>Place Order</strong>. You\'ll receive a confirmation with your order reference number.'
        },
        {
          q: 'Can I cancel or modify my order after placing it?',
          a: 'Orders can be cancelled or modified within <strong>12 hours</strong> of placing them. After that, your order may already be in processing or dispatch. Please <a href="/contact-us">contact our support team</a> as soon as possible if you need to make changes.'
        },
        {
          q: 'How will I know my order was confirmed?',
          a: 'After successfully placing your order, you\'ll see a <strong>confirmation screen</strong> with your order reference number (e.g. #ISM-XXXXXX). If you provided an email address, a confirmation email will also be sent to you. Keep your order reference handy for tracking purposes.'
        },
        {
          q: 'Can I order multiple items in one order?',
          a: 'Yes! You can add multiple products to your cart and check out in a single order. This is recommended as it saves on delivery fees and is more convenient for tracking your items.'
        },
        {
          q: 'Is Ismora a dropshipping store?',
          a: 'Yes, Ismora operates as a dropshipping store. This means your products are shipped directly from our trusted suppliers to your doorstep. This allows us to offer a wide range of products at competitive prices. All products listed are curated for quality, and we stand behind every order.'
        }
      ]
    },
    shipping: {
      title: 'Shipping & Delivery',
      icon: 'fa-truck',
      questions: [
        {
          q: 'How long does delivery take?',
          a: 'Standard delivery within UAE typically takes <strong>3–7 business days</strong> after your order is dispatched. Delivery times may vary slightly based on your city and the product supplier. You will receive tracking information once your order ships.'
        },
        {
          q: 'Do you offer free shipping?',
          a: 'Yes! We offer <strong>free shipping</strong> on orders above our free shipping threshold (displayed at checkout). Orders below this threshold have a standard delivery fee which is clearly shown before you complete your purchase.'
        },
        {
          q: 'How can I track my order?',
          a: 'Once your order is dispatched, we will share tracking details via <strong>email or WhatsApp</strong> (if provided). You can use the tracking number with the courier\'s website to monitor your delivery in real-time. If you haven\'t received tracking info within 3 business days, please <a href="/contact-us">contact us</a>.'
        },
        {
          q: 'Do you ship internationally?',
          a: 'Currently, we primarily ship within <strong>UAE</strong>. International shipping may be available for select products — please <a href="/contact-us">contact our support team</a> to enquire about your specific location and we\'ll do our best to accommodate you.'
        },
        {
          q: 'What if my package is lost or delayed?',
          a: 'If your order hasn\'t arrived within the expected timeframe, please <a href="/contact-us">contact us</a> within <strong>14 days</strong> of the estimated delivery date. We\'ll investigate with the courier immediately. In the case of a confirmed lost shipment, we will arrange a replacement or full refund.'
        }
      ]
    },
    returns: {
      title: 'Returns & Refunds',
      icon: 'fa-undo-alt',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We accept returns within <strong>7 days</strong> of receiving your order for items that are defective, damaged, or incorrect. Items must be unused, in original packaging, and in the same condition as received. For full details, visit our <a href="/returns">Returns Policy page</a>.'
        },
        {
          q: 'How do I request a return or refund?',
          a: 'To start a return, <a href="/contact-us">contact our support team</a> within 7 days of delivery. Provide your order reference number and a brief description (plus photos if possible) of the issue. We\'ll guide you through the next steps and arrange a pickup or return label if applicable.'
        },
        {
          q: 'How long does a refund take?',
          a: 'Once we receive and inspect the returned item, refunds are processed within <strong>5–10 business days</strong>. Refunds are issued to your original payment method. If you paid via Cash on Delivery, a bank transfer or store credit will be arranged.'
        },
        {
          q: 'Can I return a product if I just changed my mind?',
          a: 'Unfortunately, we do not accept returns for <strong>change of mind</strong> or incorrect size/color selection — so please review product details carefully before ordering. Returns are only accepted for items that are defective, damaged during shipping, or incorrect. Sale items are final sale.'
        }
      ]
    },
    payment: {
      title: 'Payment',
      icon: 'fa-credit-card',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept <strong>Cash on Delivery (COD)</strong> as our primary payment method across UAE. Additional payment options (bank transfer, online payment) may be available at checkout depending on your region. All payment options are displayed clearly before you confirm your order.'
        },
        {
          q: 'Is it safe to shop on Ismora?',
          a: 'Absolutely. Our website uses <strong>HTTPS encryption</strong> to protect all data transmitted between your browser and our servers. We do not store your full payment card details. Our platform is built on Google Firebase infrastructure which maintains industry-standard security practices.'
        },
        {
          q: 'Will I be charged any hidden fees?',
          a: 'No hidden fees — ever. The total you see at checkout (including any delivery fee and applicable taxes) is exactly what you pay. We believe in full transparency before you confirm your order.'
        }
      ]
    },
    products: {
      title: 'Products',
      icon: 'fa-box',
      questions: [
        {
          q: 'Are the products on Ismora authentic?',
          a: 'Yes. All products listed on Ismora are sourced from verified suppliers. We curate our catalog carefully to ensure quality. Product descriptions and images are provided accurately to the best of our ability. Minor color variations may exist due to screen display settings.'
        },
        {
          q: 'What if a product I want is out of stock?',
          a: 'If a product is out of stock, it will be marked accordingly on the product page. You can <a href="/contact-us">contact us</a> to ask about restock timelines. We update inventory regularly, so check back soon or follow us on social media for restock announcements.'
        },
        {
          q: 'Can I request a product that isn\'t listed?',
          a: 'We love hearing from our customers! If you\'re looking for a specific product, <a href="/contact-us">send us a message</a> and we\'ll see if we can source it for you. We\'re always expanding our catalog based on customer demand.'
        }
      ]
    }
  };

  const categoryKeys = Object.keys(faqData);
  const totalQuestions = categoryKeys.reduce((sum, key) => sum + faqData[key].questions.length, 0);

  const toggleAccordion = (sectionKey, index) => {
    const key = `${sectionKey}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filterCategory = (cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
    setOpenItems({});
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setOpenItems({});
  };

  const clearSearch = () => {
    setSearchQuery('');
    setOpenItems({});
  };

  const getFilteredQuestions = () => {
    let filtered = {};
    
    if (activeCategory === 'all') {
      filtered = { ...faqData };
    } else {
      filtered = { [activeCategory]: faqData[activeCategory] };
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const result = {};
      Object.keys(filtered).forEach(sectionKey => {
        const section = filtered[sectionKey];
        const matchedQuestions = section.questions.filter(item => 
          item.q.toLowerCase().includes(query) || 
          item.a.toLowerCase().includes(query)
        );
        if (matchedQuestions.length > 0) {
          result[sectionKey] = {
            ...section,
            questions: matchedQuestions
          };
        }
      });
      return result;
    }

    return filtered;
  };

  const filteredData = getFilteredQuestions();
  const hasResults = Object.keys(filteredData).length > 0;

  return (
    <>
      <Navbar />

      <style>{`
        .page-hero {
          background: #1a1a2e;
          padding: 72px 0 64px;
          position: relative;
          overflow: hidden;
        }
        .page-hero-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 20% 50%, rgba(255,107,53,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,107,53,0.07) 0%, transparent 40%);
        }
        .page-hero-grid {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .acc-item.open {
          border-color: #FF6B35;
          box-shadow: 0 4px 20px rgba(255,107,53,0.08);
        }
        .acc-item.open .acc-q {
          color: #FF6B35;
        }
        .acc-item.open .acc-icon {
          background: rgba(255,107,53,0.12);
        }
        .acc-item.open .acc-icon i {
          color: #FF6B35;
          transform: rotate(45deg);
        }
        .acc-body.open {
          max-height: 600px;
        }
        .faq-section[data-hidden="true"] {
          display: none;
        }
        .acc-item[data-hidden="true"] {
          display: none;
        }
        .cat-btn.active {
          background: #f8f8fc;
          color: #1a1a2e;
        }
        .cat-btn.active i {
          color: #FF6B35;
        }
        .cat-btn.active .cat-count {
          background: #FF6B35;
          color: white;
        }
        @media (max-width: 1024px) {
          .faq-layout { grid-template-columns: 1fr !important; }
          .faq-cats { position: static !important; }
          .cats-card { display: flex; gap: 8px; flex-wrap: wrap; padding: 14px !important; }
          .cat-btn { width: auto; flex: 0 0 auto; }
        }
        @media (max-width: 768px) {
          .page-hero { padding: 48px 0 40px; }
          .contact-cta { padding: 32px 24px !important; }
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
              textDecoration: 'none'
            }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>›</span>
            <span style={{ color: '#FF6B35', fontSize: '0.82rem', fontWeight: 500 }}>FAQ</span>
          </nav>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,107,53,0.15)',
            border: '1px solid rgba(255,107,53,0.3)',
            color: '#FF6B35',
            borderRadius: '100px',
            padding: '6px 14px',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <i className="fas fa-question-circle"></i> &nbsp;Help Center
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '14px'
          }}>
            Frequently Asked <em style={{ fontStyle: 'italic', color: '#FF6B35' }}>Questions</em>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            maxWidth: '560px'
          }}>Find quick answers to the most common questions about ordering, shipping, returns, and more.</p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.82rem'
            }}>
              <i className="fas fa-list" style={{ color: '#FF6B35', fontSize: '0.85rem' }}></i>
              {totalQuestions}+ Questions Answered
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.82rem'
            }}>
              <i className="fas fa-headset" style={{ color: '#FF6B35', fontSize: '0.85rem' }}></i>
              Still need help? <Link to="/contact-us" style={{ color: '#FF6B35', marginLeft: '4px' }}>Contact Us</Link>
            </div>
          </div>
        </div>
      </section>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        position: 'relative',
        zIndex: 2,
        marginTop: '-28px'
      }}>
        <div style={{
          background: 'white',
          border: '1px solid #e8e8f0',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <i className="fas fa-search" style={{ color: '#4a4a68', fontSize: '1.1rem', flexShrink: 0 }}></i>
          <input
            type="text"
            id="faq-search"
            placeholder="Search questions... e.g. 'delivery time', 'refund', 'payment'"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.95rem',
              color: '#1a1a2e'
            }}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              style={{
                background: '#f8f8fc',
                border: 'none',
                color: '#4a4a68',
                padding: '6px 14px',
                borderRadius: '8px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '56px 24px 80px'
      }}>
        <div className="faq-layout" style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '48px',
          alignItems: 'start'
        }}>

          <aside className="faq-cats" style={{ position: 'sticky', top: '90px' }}>
            <div className="cats-card" style={{
              background: 'white',
              border: '1px solid #e8e8f0',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}>
              <p style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#4a4a68',
                marginBottom: '14px'
              }}>Categories</p>
              
              <button
                className={`cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => filterCategory('all')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeCategory === 'all' ? '#f8f8fc' : 'none',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: activeCategory === 'all' ? '#1a1a2e' : '#4a4a68',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  marginBottom: '2px'
                }}
              >
                <i className="fas fa-th-large" style={{
                  width: '18px',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: activeCategory === 'all' ? '#FF6B35' : '#4a4a68'
                }}></i>
                All Questions
                <span className="cat-count" style={{
                  marginLeft: 'auto',
                  background: activeCategory === 'all' ? '#FF6B35' : '#e8e8f0',
                  color: activeCategory === 'all' ? 'white' : '#4a4a68',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '20px'
                }}>{totalQuestions}</span>
              </button>

              {categoryKeys.map((key) => (
                <button
                  key={key}
                  className={`cat-btn ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => filterCategory(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: activeCategory === key ? '#f8f8fc' : 'none',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: activeCategory === key ? '#1a1a2e' : '#4a4a68',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    marginBottom: '2px'
                  }}
                >
                  <i className={`fas ${faqData[key].icon}`} style={{
                    width: '18px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: activeCategory === key ? '#FF6B35' : '#4a4a68'
                  }}></i>
                  {faqData[key].title}
                  <span className="cat-count" style={{
                    marginLeft: 'auto',
                    background: activeCategory === key ? '#FF6B35' : '#e8e8f0',
                    color: activeCategory === key ? 'white' : '#4a4a68',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '20px'
                  }}>{faqData[key].questions.length}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="faq-body" style={{ minWidth: 0 }}>
            {!hasResults && searchQuery && (
              <div style={{
                textAlign: 'center',
                padding: '64px 24px'
              }}>
                <i className="fas fa-search" style={{ fontSize: '2.5rem', color: '#e8e8f0', display: 'block', marginBottom: '16px' }}></i>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#1a1a2e',
                  marginBottom: '8px'
                }}>No results found</h3>
                <p style={{ color: '#4a4a68', fontSize: '0.9rem' }}>
                  Try different keywords or <Link to="/contact-us" style={{ color: '#FF6B35' }}>contact our support team</Link>.
                </p>
              </div>
            )}

            {Object.keys(filteredData).map((sectionKey) => {
              const section = filteredData[sectionKey];
              return (
                <div
                  key={sectionKey}
                  className="faq-section"
                  style={{
                    marginBottom: '48px'
                  }}
                  data-cat={sectionKey}
                >
                  <div className="faq-section-header" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(255,107,53,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <i className={`fas ${section.icon}`} style={{ color: '#FF6B35', fontSize: '0.95rem' }}></i>
                    </div>
                    <div>
                      <div style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: '#1a1a2e',
                        letterSpacing: '-0.02em'
                      }}>{section.title}</div>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: '#f8f8fc',
                      color: '#4a4a68',
                      padding: '3px 10px',
                      borderRadius: '20px'
                    }}>{section.questions.length} questions</span>
                  </div>

                  <div className="accordion" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {section.questions.map((item, index) => {
                      const key = `${sectionKey}-${index}`;
                      const isOpen = openItems[key] || false;
                      return (
                        <div
                          key={index}
                          className={`acc-item ${isOpen ? 'open' : ''}`}
                          style={{
                            background: 'white',
                            border: `1px solid ${isOpen ? '#FF6B35' : '#e8e8f0'}`,
                            borderRadius: '14px',
                            overflow: 'hidden',
                            transition: 'border-color 0.2s, box-shadow 0.2s'
                          }}
                        >
                          <button
                            className="acc-trigger"
                            onClick={() => toggleAccordion(sectionKey, index)}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '18px 20px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontFamily: "'DM Sans', sans-serif"
                            }}
                          >
                            <span className="acc-q" style={{
                              flex: 1,
                              fontSize: '0.93rem',
                              fontWeight: 600,
                              color: isOpen ? '#FF6B35' : '#1a1a2e',
                              lineHeight: 1.4
                            }}>{item.q}</span>
                            <div className="acc-icon" style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              background: isOpen ? 'rgba(255,107,53,0.12)' : '#f8f8fc',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.25s'
                            }}>
                              <i className="fas fa-plus" style={{
                                fontSize: '0.72rem',
                                color: isOpen ? '#FF6B35' : '#4a4a68',
                                transition: 'transform 0.25s',
                                transform: isOpen ? 'rotate(45deg)' : 'none'
                              }}></i>
                            </div>
                          </button>
                          <div className={`acc-body ${isOpen ? 'open' : ''}`} style={{
                            maxHeight: isOpen ? '600px' : '0',
                            overflow: 'hidden',
                            transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)'
                          }}>
                            <div className="acc-ans" style={{
                              padding: '0 20px 20px 52px',
                              fontSize: '0.9rem',
                              color: '#4a4a68',
                              lineHeight: 1.75
                            }}
                            dangerouslySetInnerHTML={{ __html: item.a }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div className="contact-cta" style={{
              background: '#1a1a2e',
              borderRadius: '20px',
              padding: '48px',
              textAlign: 'center',
              marginTop: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 30% 50%, rgba(255,107,53,0.15), transparent 60%), radial-gradient(circle at 70% 50%, rgba(255,107,53,0.08), transparent 60%)'
              }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '10px'
                }}>Still have questions?</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.93rem',
                  marginBottom: '28px'
                }}>Our support team is here to help. Reach out and we'll get back to you within 24 hours.</p>
                <div style={{
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
                    background: '#FF6B35',
                    color: 'white'
                  }}>
                    <i className="fas fa-envelope"></i> Contact Support
                  </Link>
                  <Link to="/shop" className="btn btn-lg" style={{
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
                    <i className="fas fa-store"></i> Browse Shop
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default FAQ;