import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import CartDrawer from './CartDrawer';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
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
      {/* MARQUEE */}
      <div className="marquee-announce" style={{
        background: '#FF6B35',
        color: 'white',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 101
      }}>
        <div className="marquee-track" style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          padding: '10px 0'
        }}>
          <div className="marquee-content" style={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            animation: 'marqueeScroll 25s linear infinite',
            fontSize: '0.875rem',
            fontWeight: '500',
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.3px'
          }}>
            🚚 Ismora is a Dropshipping Store  ✦  Free shipping on orders over 150 AED  ✦  Premium quality guaranteed  ✦  Easy 30-day returns  ✦  24/7 customer support  ✦  
            🚚 Ismora is a Dropshipping Store  ✦  Free shipping on orders over 150 AED  ✦  Premium quality guaranteed  ✦  Easy 30-day returns  ✦  24/7 customer support  ✦  
            🚚 Ismora is a Dropshipping Store  ✦  Free shipping on orders over 150 AED  ✦  Premium quality guaranteed  ✦  Easy 30-day returns  ✦  24/7 customer support  ✦  
          </div>
        </div>
        <button className="close-marquee" style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
          zIndex: 102,
          fontFamily: "'DM Sans', sans-serif"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          ✕
        </button>
      </div>

      {/* NAVBAR */}
      <header className="navbar" style={{
        background: '#1a1a2e',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none'
      }}>
        <div className="nav-inner" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobileMenu(true)} style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <span style={{ width: '24px', height: '2.5px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', display: 'block' }}></span>
            <span style={{ width: '24px', height: '2.5px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', display: 'block' }}></span>
            <span style={{ width: '24px', height: '2.5px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', display: 'block' }}></span>
          </button>

          {/* Logo */}
          <Link to="/" className="nav-logo" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              background: '#FF6B35',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-store" style={{ color: 'white', fontSize: '1rem' }}></i>
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.02em'
            }}>Ismora</span>
          </Link>

          {/* Nav Links */}
          <ul className="nav-links" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            <li>
              <Link to="/" style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                fontFamily: "'DM Sans', sans-serif",
                color: isActive('/') ? '#FF6B35' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive('/') ? 'rgba(255,107,53,0.1)' : 'transparent'
              }}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                fontFamily: "'DM Sans', sans-serif",
                color: isActive('/shop') ? '#FF6B35' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive('/shop') ? 'rgba(255,107,53,0.1)' : 'transparent'
              }}>
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about-us" style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                fontFamily: "'DM Sans', sans-serif",
                color: isActive('/about-us') ? '#FF6B35' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive('/about-us') ? 'rgba(255,107,53,0.1)' : 'transparent'
              }}>
                About
              </Link>
            </li>
            <li>
              <Link to="/blog" style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                fontFamily: "'DM Sans', sans-serif",
                color: isActive('/blog') ? '#FF6B35' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive('/blog') ? 'rgba(255,107,53,0.1)' : 'transparent'
              }}>
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact-us" style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                fontFamily: "'DM Sans', sans-serif",
                color: isActive('/contact-us') ? '#FF6B35' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'all 0.2s',
                background: isActive('/contact-us') ? 'rgba(255,107,53,0.1)' : 'transparent'
              }}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Search */}
          <div className="nav-search" style={{
            flex: '1',
            maxWidth: '280px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }} ref={searchRef}>
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.85rem',
              pointerEvents: 'none'
            }}></i>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={inputValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => {
                if (inputValue.trim()) {
                  setShowDropdown(true);
                }
              }}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1.5px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                fontWeight: '400',
                background: 'rgba(255,255,255,0.07)',
                color: 'white',
                transition: 'all 0.3s',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#FF6B35'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            />

            {/* Search Dropdown */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: 0,
                width: '100%',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                border: '1px solid rgba(0,0,0,0.07)',
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
                              color: '#1a1a2e',
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
                              marginTop: '2px'
                            }}>
                              <span style={{
                                fontSize: '0.7rem',
                                color: '#9ca3af',
                                background: '#f3f4f6',
                                padding: '1px 6px',
                                borderRadius: '4px'
                              }}>
                                {product.category || 'General'}
                              </span>
                              <span style={{
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                color: '#FF6B35'
                              }}>
                                {formatPrice(product.price)}
                              </span>
                              {hasDiscount && (
                                <span style={{
                                  fontSize: '0.65rem',
                                  color: 'white',
                                  background: '#ef4444',
                                  borderRadius: '4px',
                                  padding: '1px 5px',
                                  fontWeight: 700
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
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B35'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                    >
                      <i className="fas fa-search" style={{ color: '#FF6B35' }}></i>
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
            gap: '8px'
          }}>
            <button className="nav-icon-btn" title="Wishlist" style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1rem',
              transition: 'all 0.25s',
              position: 'relative',
              fontFamily: "'DM Sans', sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FF6B35';
              e.currentTarget.style.borderColor = '#FF6B35';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
            }}
            >
              <i className="far fa-heart"></i>
            </button>
            
            <button 
              className="nav-icon-btn" 
              onClick={toggleCart}
              title="Cart"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '1rem',
                transition: 'all 0.25s',
                position: 'relative',
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FF6B35';
                e.currentTarget.style.borderColor = '#FF6B35';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
              }}
            >
              <i className="fas fa-shopping-bag"></i>
              {cartCount > 0 && (
                <span className="cart-badge" style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#FF6B35',
                  color: 'white',
                  fontSize: '0.6rem',
                  fontWeight: '700',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #1a1a2e',
                  padding: '0 5px'
                }}>{cartCount}</span>
              )}
            </button>
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
            gap: '10px',
            textDecoration: 'none'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              background: '#FF6B35',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-store" style={{ color: 'white', fontSize: '0.9rem' }}></i>
            </div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#1a1a2e'
            }}>Ismora</span>
          </div>
          <button className="drawer-close" onClick={() => setMobileMenu(false)} style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#4a4a68',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'background 0.2s',
            fontFamily: "'DM Sans', sans-serif"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8fc'}
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
            fontFamily: "'DM Sans', sans-serif",
            color: isActive('/') ? '#1a1a2e' : '#4a4a68',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/') ? '#f8f8fc' : 'transparent'
          }}>
            <i className="fas fa-home" style={{ width: '20px', textAlign: 'center', color: '#FF6B35' }}></i>Home
          </Link>
          <Link to="/shop" onClick={() => setMobileMenu(false)} style={{
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: "'DM Sans', sans-serif",
            color: isActive('/shop') ? '#1a1a2e' : '#4a4a68',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/shop') ? '#f8f8fc' : 'transparent'
          }}>
            <i className="fas fa-store" style={{ width: '20px', textAlign: 'center', color: '#FF6B35' }}></i>Shop
          </Link>
          <Link to="/about-us" onClick={() => setMobileMenu(false)} style={{
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: "'DM Sans', sans-serif",
            color: isActive('/about-us') ? '#1a1a2e' : '#4a4a68',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/about-us') ? '#f8f8fc' : 'transparent'
          }}>
            <i className="fas fa-info-circle" style={{ width: '20px', textAlign: 'center', color: '#FF6B35' }}></i>About
          </Link>
          <Link to="/blog" onClick={() => setMobileMenu(false)} style={{
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: "'DM Sans', sans-serif",
            color: isActive('/blog') ? '#1a1a2e' : '#4a4a68',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/blog') ? '#f8f8fc' : 'transparent'
          }}>
            <i className="fas fa-newspaper" style={{ width: '20px', textAlign: 'center', color: '#FF6B35' }}></i>Blog
          </Link>
          <Link to="/contact-us" onClick={() => setMobileMenu(false)} style={{
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: "'DM Sans', sans-serif",
            color: isActive('/contact-us') ? '#1a1a2e' : '#4a4a68',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            background: isActive('/contact-us') ? '#f8f8fc' : 'transparent'
          }}>
            <i className="fas fa-envelope" style={{ width: '20px', textAlign: 'center', color: '#FF6B35' }}></i>Contact
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
        }
        
        .nav-links a:hover {
          color: white !important;
          background: rgba(255,255,255,0.08) !important;
        }
        
        .nav-icon-btn:hover {
          background: #FF6B35 !important;
          border-color: #FF6B35 !important;
          color: white !important;
        }
      `}</style>
    </>
  );
}

export default Navbar;