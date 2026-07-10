import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import CartDrawer from './CartDrawer';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [marqueeVisible, setMarqueeVisible] = useState(true);
  const { cartCount, isCartOpen, toggleCart, closeCart } = useCart();
  const { searchQuery, searchResults, loading, showDropdown, searchProducts, clearSearch, setShowDropdown } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, closeCart]);

  const isActive = (path) => location.pathname === path;

  const handleSearchInput = (value) => {
    setInputValue(value);
    searchProducts(value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      const query = inputValue.trim();
      if (query) {
        setShowDropdown(false);
        navigate(`/shop?search=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleResultClick = (productId) => {
    setShowDropdown(false);
    clearSearch();
    navigate(`/product/${productId}`);
  };

  const handleViewAllResults = () => {
    const query = inputValue.trim();
    if (query) {
      setShowDropdown(false);
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    }
  };

  const formatPrice = (price) => {
    return `AED ${Number(price).toFixed(2)}`;
  };

  return (
    <>
      {/* ANNOUNCEMENT BAR */}
      {marqueeVisible && (
        <div className="marquee-announce" style={{
          background: '#1A1A1A',
          color: 'rgba(255,255,255,0.85)',
          position: 'relative',
          zIndex: 101
        }}>
          <div className="marquee-text" style={{
            textAlign: 'center',
            padding: '11px 48px',
            fontSize: '0.78rem',
            fontWeight: '400',
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            <span>Complimentary Shipping Across the UAE</span>
            <span className="marquee-secondary">&nbsp;·&nbsp;Custom Jewelry Made to Order</span>
          </div>
          <button
            className="close-marquee"
            onClick={() => setMarqueeVisible(false)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
              zIndex: 102,
              fontFamily: "'DM Sans', sans-serif"
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            ✕
          </button>
        </div>
      )}

      {/* NAVBAR */}
      <header className="navbar" style={{
        background: 'white',
        borderBottom: '1px solid #EAEAEA',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none'
      }}>
        <div className="nav-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '76px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Left: Hamburger + Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifySelf: 'start', gridColumn: 1 }}>
            <button className="hamburger" onClick={() => setMobileMenu(true)} style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px'
            }}>
              <span style={{ width: '22px', height: '1.5px', background: '#1A1A1A', display: 'block' }}></span>
              <span style={{ width: '22px', height: '1.5px', background: '#1A1A1A', display: 'block' }}></span>
              <span style={{ width: '22px', height: '1.5px', background: '#1A1A1A', display: 'block' }}></span>
            </button>

            <Link to="/" className="nav-logo" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0
            }}>
              <img src="/icon.png" alt="Ismora" style={{ height: '28px', width: 'auto', display: 'block' }} />
              {/* <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#1A1A1A',
                letterSpacing: '0.02em'
              }}>ISMORA</span> */}
            </Link>
          </div>

          {/* Nav Links */}
          <ul className="nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            justifySelf: 'center',
            gridColumn: 2
          }}>
            <li>
              <Link to="/" style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
                color: '#1A1A1A',
                textDecoration: 'none',
                borderBottom: isActive('/') ? '1.5px solid #1A1A1A' : '1.5px solid transparent',
                transition: 'all 0.2s'
              }}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
                color: '#1A1A1A',
                textDecoration: 'none',
                borderBottom: isActive('/shop') ? '1.5px solid #1A1A1A' : '1.5px solid transparent',
                transition: 'all 0.2s'
              }}>
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about-us" style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
                color: '#1A1A1A',
                textDecoration: 'none',
                borderBottom: isActive('/about-us') ? '1.5px solid #1A1A1A' : '1.5px solid transparent',
                transition: 'all 0.2s'
              }}>
                About
              </Link>
            </li>
            <li>
              <Link to="/blog" style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
                color: '#1A1A1A',
                textDecoration: 'none',
                borderBottom: isActive('/blog') ? '1.5px solid #1A1A1A' : '1.5px solid transparent',
                transition: 'all 0.2s'
              }}>
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact-us" style={{
                padding: '8px 16px',
                fontSize: '0.78rem',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: "'DM Sans', sans-serif",
                color: '#1A1A1A',
                textDecoration: 'none',
                borderBottom: isActive('/contact-us') ? '1.5px solid #1A1A1A' : '1.5px solid transparent',
                transition: 'all 0.2s'
              }}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Right: Search + Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', justifySelf: 'end', gridColumn: 3 }}>
          <div className="nav-search" style={{
            width: '200px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }} ref={searchRef}>
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '2px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6B6B6B',
              fontSize: '0.78rem',
              pointerEvents: 'none'
            }}></i>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={(e) => {
                if (inputValue.trim()) {
                  setShowDropdown(true);
                }
                e.currentTarget.style.borderBottomColor = '#1A1A1A';
              }}
              style={{
                width: '100%',
                padding: '8px 8px 8px 22px',
                border: 'none',
                borderBottom: '1px solid #EAEAEA',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.82rem',
                fontWeight: '400',
                background: 'transparent',
                color: '#1A1A1A',
                transition: 'border-color 0.3s',
                outline: 'none'
              }}
              onBlur={(e) => e.currentTarget.style.borderBottomColor = '#EAEAEA'}
            />

            {/* Search Dropdown */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '360px',
                maxWidth: '90vw',
                background: 'white',
                borderRadius: '2px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                border: '1px solid #EAEAEA',
                overflow: 'hidden',
                zIndex: 999,
                maxHeight: '460px',
                overflowY: 'auto'
              }}>
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                    Searching...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div style={{ padding: '30px 16px', textAlign: 'center', color: '#9ca3af' }}>
                    <i className="fas fa-search" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px', opacity: 0.3 }}></i>
                    <p>No results for "<strong>{inputValue}</strong>"</p>
                  </div>
                ) : (
                  <>
                    <div style={{
                      padding: '10px 14px 6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#9ca3af',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      Products
                    </div>
                    {searchResults.map((product) => {
                      const hasDiscount = product.comparePrice && product.comparePrice > product.price;
                      const discount = hasDiscount ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
                      return (
                        <div
                          key={product.id}
                          onClick={() => handleResultClick(product.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 14px',
                            cursor: 'pointer',
                            transition: 'background 0.15s',
                            borderBottom: '1px solid #f9fafb'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid #f0f0f0',
                              flexShrink: 0
                            }}
                            onError={(e) => e.target.src = 'https://placehold.co/48x48/f0f0f0/aaa?text=IMG'}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: '#1A1A1A',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {product.name}
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginTop: '3px',
                              flexWrap: 'nowrap'
                            }}>
                              <span style={{
                                fontSize: '0.68rem',
                                color: '#9ca3af',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                minWidth: 0
                              }}>
                                {product.category || 'General'}
                              </span>
                              <span style={{
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: '#1A1A1A',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                marginLeft: 'auto'
                              }}>
                                {formatPrice(product.price)}
                              </span>
                              {hasDiscount && (
                                <span style={{
                                  fontSize: '0.65rem',
                                  color: 'white',
                                  background: '#1A1A1A',
                                  borderRadius: '2px',
                                  padding: '1px 5px',
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0
                                }}>
                                  -{discount}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div
                      onClick={handleViewAllResults}
                      style={{
                        padding: '10px 14px',
                        borderTop: '1px solid #f3f4f6',
                        background: '#fafafa',
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        transition: 'color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#1A1A1A'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                    >
                      <i className="fas fa-search" style={{ color: '#1A1A1A' }}></i>
                      See all results for "{inputValue}"
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="nav-actions" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <button
              className="nav-icon-btn"
              onClick={toggleCart}
              title="Cart"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1A1A1A',
                fontSize: '1.05rem',
                transition: 'opacity 0.2s',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <i className="fas fa-shopping-bag"></i>
              {cartCount > 0 && (
                <span className="cart-badge" style={{
                  position: 'absolute',
                  top: '-7px',
                  right: '-9px',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#1A1A1A',
                  color: 'white',
                  fontSize: '0.6rem',
                  fontWeight: '700',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px'
                }}>{cartCount}</span>
              )}
            </button>
          </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenu ? 'open' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: mobileMenu ? '0' : '-100%',
        width: '300px',
        height: '100vh',
        background: 'white',
        zIndex: 200,
        padding: '24px',
        boxShadow: '4px 0 32px rgba(0,0,0,0.15)',
        transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1)',
        overflowY: 'auto'
      }}>
        <div className="drawer-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div className="nav-logo" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none'
          }}>
            <img src="/icon.png" alt="Ismora" style={{ height: '24px', width: 'auto', display: 'block' }} />
            {/* <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#1A1A1A',
              letterSpacing: '0.02em'
            }}>ISMORA</span> */}
          </div>
          <button className="drawer-close" onClick={() => setMobileMenu(false)} style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6B6B6B',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'background 0.2s',
            fontFamily: "'DM Sans', sans-serif"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ✕
          </button>
        </div>
        <nav className="drawer-nav" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <Link to="/" onClick={() => setMobileMenu(false)} style={{
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: "'Bebas Neue', sans-serif",
            color: isActive('/') ? '#1A1A1A' : '#6B6B6B',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/') ? '#FAFAFA' : 'transparent'
          }}>
            <i className="fas fa-home" style={{ width: '20px', textAlign: 'center', color: '#1A1A1A' }}></i>Home
          </Link>
          <Link to="/shop" onClick={() => setMobileMenu(false)} style={{
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: "'Bebas Neue', sans-serif",
            color: isActive('/shop') ? '#1A1A1A' : '#6B6B6B',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/shop') ? '#FAFAFA' : 'transparent'
          }}>
            <i className="fas fa-store" style={{ width: '20px', textAlign: 'center', color: '#1A1A1A' }}></i>Shop
          </Link>
          <Link to="/about-us" onClick={() => setMobileMenu(false)} style={{
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: "'Bebas Neue', sans-serif",
            color: isActive('/about-us') ? '#1A1A1A' : '#6B6B6B',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/about-us') ? '#FAFAFA' : 'transparent'
          }}>
            <i className="fas fa-info-circle" style={{ width: '20px', textAlign: 'center', color: '#1A1A1A' }}></i>About
          </Link>
          <Link to="/blog" onClick={() => setMobileMenu(false)} style={{
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: "'Bebas Neue', sans-serif",
            color: isActive('/blog') ? '#1A1A1A' : '#6B6B6B',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/blog') ? '#FAFAFA' : 'transparent'
          }}>
            <i className="fas fa-newspaper" style={{ width: '20px', textAlign: 'center', color: '#1A1A1A' }}></i>Blog
          </Link>
          <Link to="/contact-us" onClick={() => setMobileMenu(false)} style={{
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: "'Bebas Neue', sans-serif",
            color: isActive('/contact-us') ? '#1A1A1A' : '#6B6B6B',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/contact-us') ? '#FAFAFA' : 'transparent'
          }}>
            <i className="fas fa-envelope" style={{ width: '20px', textAlign: 'center', color: '#1A1A1A' }}></i>Contact
          </Link>
        </nav>
      </div>

      {/* Overlay */}
      {mobileMenu && (
        <div onClick={() => setMobileMenu(false)} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 150,
          opacity: 1,
          visibility: 'visible',
          transition: 'all 0.3s'
        }}></div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @media (max-width: 768px) {
          .hamburger {
            display: flex !important;
          }
          .nav-links {
            display: none !important;
          }
          .nav-search {
            display: none !important;
          }
          .nav-inner {
            height: 62px !important;
            padding: 0 16px !important;
          }
          .nav-inner .nav-logo {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            max-width: 130px !important;
            z-index: 1 !important;
          }
          .nav-inner .nav-logo img {
            max-width: 100% !important;
            height: 22px !important;
            width: auto !important;
          }
          .nav-actions {
            position: relative !important;
            z-index: 2 !important;
          }
          .marquee-text {
            padding: 10px 32px !important;
            font-size: 0.68rem !important;
            letter-spacing: 0.04em !important;
          }
          .marquee-secondary {
            display: none !important;
          }
          .close-marquee {
            right: 8px !important;
          }
        }

        .nav-links a:hover {
          border-bottom-color: #1A1A1A !important;
        }
      `}</style>
    </>
  );
}

export default Navbar;