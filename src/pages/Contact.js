import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const contacts = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      contacts.push({
        ...formData,
        date: new Date().toISOString()
      });
      localStorage.setItem('contact_messages', JSON.stringify(contacts));
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
      
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 300;
        display: flex; align-items: center; gap: 12px;
        background: #1A1A1A; color: white; padding: 14px 18px;
        border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.2);
        font-size: 0.875rem; font-weight: 500;
        transform: translateX(120%); opacity: 0;
        transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
        min-width: 240px; max-width: 340px;
      `;
      toast.innerHTML = `
        <div style="width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0;background:rgba(34,197,94,0.2);color:#22c55e;">
          <i class="fas fa-check"></i>
        </div>
        <span>Thank you! We'll get back to you soon.</span>
      `;
      document.body.appendChild(toast);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          toast.style.transform = 'translateX(0)';
          toast.style.opacity = '1';
        });
      });
      setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
      }, 3000);
    }, 800);
  };

  return (
    <>
      <Navbar />

      <style>{`
        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .form-input:focus {
          border-color: #1A1A1A;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) {
          .contact-card { padding: 24px !important; }
        }
      `}</style>

      <section className="hero-contact" style={{
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
          }}>Let's Talk</h1>
          <p className="hero-sub" style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>Have questions? We'd love to hear from you. Reach out and we'll get back to you within 24 hours.</p>
        </div>
      </section>

      <section className="section" style={{ padding: '80px 0' }}>
        <div className="section-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          <div className="grid md:grid-cols-3 gap-6 mb-16" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '64px'
          }}>
            <div className="contact-card" style={{
              background: 'white',
              border: '1px solid #EAEAEA',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div className="contact-icon" style={{
                width: '70px',
                height: '70px',
                background: '#FAFAFA',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#1A1A1A'
              }}>
                <i className="fas fa-envelope"></i>
              </div>
              <h3 style={{
                fontWeight: '600',
                fontSize: '1.125rem',
                marginBottom: '8px',
                color: '#1A1A1A'
              }}>Email Us</h3>
              <p style={{
                color: '#6B6B6B',
                fontSize: '0.875rem',
                marginBottom: '12px'
              }}>For inquiries, support, or feedback</p>
              <a href="mailto:ismora.ae@gmail.com" style={{
                color: '#1A1A1A',
                fontWeight: '600',
                textDecoration: 'none'
              }}>ismora.ae@gmail.com</a>
            </div>

            <div className="contact-card" style={{
              background: 'white',
              border: '1px solid #EAEAEA',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div className="contact-icon" style={{
                width: '70px',
                height: '70px',
                background: '#FAFAFA',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#1A1A1A'
              }}>
                <i className="fab fa-instagram"></i>
              </div>
              <h3 style={{
                fontWeight: '600',
                fontSize: '1.125rem',
                marginBottom: '8px',
                color: '#1A1A1A'
              }}>DM on Instagram</h3>
              <p style={{
                color: '#6B6B6B',
                fontSize: '0.875rem',
                marginBottom: '12px'
              }}>Follow and message us</p>
              <a href="https://instagram.com/shopismora" target="_blank" rel="noopener noreferrer" style={{
                color: '#1A1A1A',
                fontWeight: '600',
                textDecoration: 'none'
              }}>@shopismora</a>
            </div>

            <div className="contact-card" style={{
              background: 'white',
              border: '1px solid #EAEAEA',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'center',
              transition: 'all 0.3s'
            }}>
              <div className="contact-icon" style={{
                width: '70px',
                height: '70px',
                background: '#FAFAFA',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#1A1A1A'
              }}>
                <i className="fas fa-clock"></i>
              </div>
              <h3 style={{
                fontWeight: '600',
                fontSize: '1.125rem',
                marginBottom: '8px',
                color: '#1A1A1A'
              }}>Response Time</h3>
              <p style={{
                color: '#6B6B6B',
                fontSize: '0.875rem',
                marginBottom: '12px'
              }}>We reply within 24 hours</p>
              <span style={{
                color: '#1A1A1A',
                fontWeight: '500'
              }}>Mon-Fri, 9am-6pm</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '48px'
          }}>
            <div>
              <h2 style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#1A1A1A'
              }}>Send Us a Message</h2>
              <p style={{
                color: '#6B6B6B',
                marginBottom: '24px',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>Whether you have a question about your order, need product recommendations, or just want to say hello — we're here for you.</p>
              
              {submitSuccess && (
                <div style={{
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <i className="fas fa-check-circle"></i>
                  <span>Thank you! We'll get back to you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Name *"
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '1.5px solid #EAEAEA',
                      borderRadius: '12px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="email"
                    id="email"
                    placeholder="Email Address *"
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '1.5px solid #EAEAEA',
                      borderRadius: '12px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    id="subject"
                    placeholder="Subject"
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '1.5px solid #EAEAEA',
                      borderRadius: '12px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <textarea
                    id="message"
                    placeholder="Your Message *"
                    className="form-input"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '1.5px solid #EAEAEA',
                      borderRadius: '12px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '120px'
                    }}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-accent"
                  style={{
                    width: '100%',
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
                    color: 'white',
                    opacity: isSubmitting ? 0.7 : 1,
                    pointerEvents: isSubmitting ? 'none' : 'auto'
                  }}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-paper-plane"></i>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="faq-box" style={{
              background: '#FAFAFA',
              borderRadius: '20px',
              padding: '32px'
            }}>
              <h2 style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#1A1A1A'
              }}>Frequently Asked</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>How long does shipping take?</h3>
                  <p style={{
                    color: '#6B6B6B',
                    fontSize: '0.875rem',
                    marginTop: '4px'
                  }}>Standard delivery takes 3-5 business days. Express shipping available at checkout.</p>
                </div>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Can I return an item?</h3>
                  <p style={{
                    color: '#6B6B6B',
                    fontSize: '0.875rem',
                    marginTop: '4px'
                  }}>Yes, we offer 30-day easy returns. Items must be unused and in original packaging.</p>
                </div>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>Do you ship internationally?</h3>
                  <p style={{
                    color: '#6B6B6B',
                    fontSize: '0.875rem',
                    marginTop: '4px'
                  }}>Currently shipping within UAE. International shipping coming soon!</p>
                </div>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>How can I track my order?</h3>
                  <p style={{
                    color: '#6B6B6B',
                    fontSize: '0.875rem',
                    marginTop: '4px'
                  }}>You'll receive a tracking link via email once your order ships.</p>
                </div>
                <div>
                  <h3 style={{
                    fontWeight: '600',
                    color: '#1A1A1A',
                    marginBottom: '4px'
                  }}>What payment methods do you accept?</h3>
                  <p style={{
                    color: '#6B6B6B',
                    fontSize: '0.875rem',
                    marginTop: '4px'
                  }}>We accept Visa, Mastercard, and Cash on Delivery (COD).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Contact;