import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatPrice = (price) => {
    return `AED ${Number(price).toFixed(2)}`;
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#f8f8fc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <i className="fas fa-shopping-bag" style={{ fontSize: '2rem', color: '#ccc' }}></i>
          </div>
          <h2 style={{ fontWeight: '700', marginBottom: '8px' }}>Your cart is empty</h2>
          <Link to="/shop" style={{ color: '#FF6B35', textDecoration: 'none', fontWeight: '600' }}>Continue Shopping →</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: '700', marginBottom: '32px' }}>Shopping Cart</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
          <div>
            {cartItems.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                gap: '16px',
                padding: '16px 0',
                borderBottom: '1px solid #e8e8f0'
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1px solid #e8e8f0'
                  }}
                  onError={(e) => e.target.src = 'https://placehold.co/100x100/f0f0f0/aaa?text=IMG'}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>{item.name}</h3>
                  <p style={{ color: '#4a4a68', fontSize: '0.9rem', marginBottom: '8px' }}>{formatPrice(item.price)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid #e8e8f0',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          color: '#4a4a68',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >−</button>
                      <span style={{
                        width: '36px',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        borderLeft: '1.5px solid #e8e8f0',
                        borderRight: '1.5px solid #e8e8f0'
                      }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '30px',
                          height: '30px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          color: '#4a4a68',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ccc',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        padding: '4px'
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
            
            <button
              onClick={clearCart}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #ef4444',
                background: 'transparent',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              Clear Cart
            </button>
          </div>

          <div style={{
            background: '#f8f8fc',
            padding: '24px',
            borderRadius: '16px',
            height: 'fit-content',
            position: 'sticky',
            top: '80px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Order Summary</h3>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #e8e8f0'
            }}>
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #e8e8f0'
            }}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px 0',
              fontSize: '1.2rem',
              fontWeight: '700'
            }}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" style={{
              display: 'block',
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              background: '#FF6B35',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;