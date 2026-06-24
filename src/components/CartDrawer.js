import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const formatPrice = (price) => {
    return `AED ${Number(price).toFixed(2)}`;
  };

  const total = getTotalPrice();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          opacity: 1,
          visibility: 'visible',
          transition: 'all 0.3s'
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '420px',
          maxWidth: '100vw',
          height: '100vh',
          background: 'white',
          zIndex: 201,
          boxShadow: '-4px 0 32px rgba(0,0,0,0.12)',
          transition: 'right 0.35s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.35s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e8e8f0',
            flexShrink: 0
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: cartItems.length > 0 ? '8px' : '0'
          }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1a1a2e'
              }}
            >
              Your Cart
              {itemCount > 0 && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#6b7280',
                    marginLeft: '8px'
                  }}
                >
                  ({itemCount} items)
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f8fc',
                border: '1px solid #e8e8f0',
                cursor: 'pointer',
                color: '#4a4a68',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8e8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f8fc';
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {cartItems.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#dcfce7',
                color: '#166534',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 500,
                animation: 'fadeInUp 0.3s ease-out'
              }}
            >
              <i className="fas fa-check-circle" style={{ color: '#22c55e' }}></i>
              <span>Item added to cart!</span>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px'
          }}
        >
          {cartItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 0'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  background: '#f8f8fc',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <i
                  className="fas fa-shopping-bag"
                  style={{ fontSize: '1.5rem', color: '#ccc' }}
                ></i>
              </div>
              <p
                style={{
                  color: '#4a4a68',
                  fontWeight: 500,
                  marginBottom: '6px',
                  fontSize: '1rem'
                }}
              >
                Your cart is empty
              </p>
              <Link
                to="/shop"
                onClick={onClose}
                style={{
                  color: '#FF6B35',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Continue Shopping →
              </Link>
            </div>
          ) : (
            <>
              {cartItems.map((item) => {
                const hasVariant = item.variantAttrs && Object.keys(item.variantAttrs).length > 0;
                return (
                  <div
                    key={item.cartKey || item.id}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      padding: '14px 0',
                      borderBottom: '1px solid #e8e8f0'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '76px',
                        height: '76px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        border: '1px solid #e8e8f0',
                        flexShrink: 0
                      }}
                      onError={(e) => e.target.src = 'https://placehold.co/76x76/f0f0f0/aaa?text=IMG'}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#1a1a2e',
                          marginBottom: '4px'
                        }}
                      >
                        {item.name}
                      </div>
                      {hasVariant && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#4a4a68',
                            marginBottom: '6px'
                          }}
                        >
                          {Object.entries(item.variantAttrs)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(' · ')}
                        </div>
                      )}
                      {item.customText && (
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: '#b45309',
                            background: '#fef3c7',
                            borderRadius: '4px',
                            padding: '1px 6px',
                            display: 'inline-block',
                            marginBottom: '4px'
                          }}
                        >
                          <i
                            className="fas fa-pen"
                            style={{ fontSize: '0.6rem', marginRight: '2px' }}
                          ></i>
                          "{item.customText}"
                        </div>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          marginTop: '4px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1.5px solid #e8e8f0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            width: 'fit-content'
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.cartKey || item.id, item.quantity - 1)}
                            style={{
                              width: '30px',
                              height: '28px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              color: '#4a4a68',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8fc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            −
                          </button>
                          <span
                            style={{
                              width: '32px',
                              textAlign: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              borderLeft: '1.5px solid #e8e8f0',
                              borderRight: '1.5px solid #e8e8f0',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartKey || item.id, item.quantity + 1)}
                            style={{
                              width: '30px',
                              height: '28px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              color: '#4a4a68',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8fc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartKey || item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ccc',
                            fontSize: '0.82rem',
                            padding: '4px',
                            borderRadius: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.background = '#fee2e2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#ccc';
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#1a1a2e',
                          marginTop: '4px'
                        }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {cartItems.length > 1 && (
                <button
                  onClick={clearCart}
                  style={{
                    marginTop: '8px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #ef4444',
                    background: 'transparent',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                >
                  <i className="fas fa-trash" style={{ marginRight: '4px' }}></i>
                  Clear Cart
                </button>
              )}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid #e8e8f0',
              flexShrink: 0,
              background: 'white'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1a1a2e'
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#FF6B35'
                }}
              >
                {formatPrice(total)}
              </span>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              style={{
                display: 'block',
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                background: '#1a1a2e',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600,
                textAlign: 'center',
                transition: 'all 0.2s',
                marginBottom: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2d2d4e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1a1a2e';
              }}
            >
              <i className="fas fa-lock" style={{ fontSize: '0.85rem', marginRight: '6px' }}></i>
              Checkout Securely
            </Link>

            <Link
              to="/cart"
              onClick={onClose}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: '#f8f8fc',
                color: '#1a1a2e',
                textDecoration: 'none',
                fontWeight: 600,
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e8e8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f8fc';
              }}
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;