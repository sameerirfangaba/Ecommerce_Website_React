import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, collection, addDoc, writeBatch, serverTimestamp, increment } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

function Checkout() {
  const { cartItems, clearCart, getTotalPrice } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  
  const [settings, setSettings] = useState({
    currency: 'AED',
    currencyPosition: 'left-space',
    baseDeliveryFee: 0,
    freeShippingThreshold: 0,
    taxRate: 0,
    paymentMethods: [],
    checkoutFields: [],
    formFields: []
  });
  
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format price
  const formatPrice = (price) => {
    const sym = settings.currency || 'AED';
    const pos = settings.currencyPosition || 'left-space';
    const f = Number(price).toFixed(2);
    switch(pos) {
      case 'left': return `${sym}${f}`;
      case 'right': return `${f}${sym}`;
      case 'left-space': return `${sym} ${f}`;
      case 'right-space': return `${f} ${sym}`;
      default: return `${sym} ${f}`;
    }
  };

  // Load settings and products
  useEffect(() => {
    const loadData = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'checkout'));
        let settingsData = {};
        if (settingsDoc.exists()) {
          settingsData = settingsDoc.data();
          setSettings(settingsData);
          
          const methods = (settingsData.paymentMethods || []).filter(m => m.enabled !== false);
          if (methods.length === 0) {
            methods.push({
              id: 'cod',
              label: 'Cash on Delivery',
              desc: 'Pay when your order arrives',
              icon: 'fas fa-money-bill-wave'
            });
          }
          setPaymentMethods(methods);
          if (methods.length > 0) {
            setSelectedPayment(methods[0].id || '0');
          }
        }

        const cached = localStorage.getItem('cached_products');
        const cachedTime = localStorage.getItem('cached_products_time');
        const now = Date.now();
        
        let productsData;
        if (cached && cachedTime && now - parseInt(cachedTime) < 300000) {
          productsData = JSON.parse(cached);
        } else {
          const snapshot = await db.collection('products').get();
          productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          localStorage.setItem('cached_products', JSON.stringify(productsData));
          localStorage.setItem('cached_products_time', now.toString());
        }
        setProducts(productsData);

        const fields = settingsData.checkoutFields || settingsData.formFields || [
          { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true },
          { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
          { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+971 50 000 0000', required: true },
          { id: 'address', label: 'Delivery Address', type: 'textarea', placeholder: 'Street address, city, postal code', required: true }
        ];
        
        const initialForm = {};
        fields.forEach(f => { initialForm[f.id] = ''; });
        setFormData(initialForm);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate totals
  useEffect(() => {
    if (cartItems.length === 0) return;

    const sub = getTotalPrice();
    setSubtotal(sub);

    const del = (settings.freeShippingThreshold > 0 && sub >= settings.freeShippingThreshold) ? 0 : (settings.baseDeliveryFee || 0);
    setDeliveryFee(del);

    const taxRate = settings.taxRate || 0;
    const taxAmount = taxRate > 0 ? ((sub + del) * (taxRate / 100)) : 0;
    setTax(taxAmount);

    const totalAmount = sub + del + taxAmount;
    setTotal(totalAmount);
  }, [cartItems, settings, getTotalPrice]);

  // Handle form field change
  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (formErrors[fieldId]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const fields = settings.checkoutFields || settings.formFields || [
      { id: 'name', required: true, label: 'Full Name' },
      { id: 'email', required: true, label: 'Email' },
      { id: 'phone', required: true, label: 'Phone' },
      { id: 'address', required: true, label: 'Address' }
    ];

    const errors = {};
    fields.forEach(f => {
      if (f.required && !formData[f.id]?.trim()) {
        errors[f.id] = `${f.label || f.id} is required`;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Place order
  const placeOrder = async () => {
    if (!validateForm()) {
      const firstError = document.querySelector('.form-input.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    setPlacingOrder(true);

    try {
      const orderItems = cartItems.map(item => {
        const prod = products.find(p => p.id === item.id);
        return {
          id: item.id,
          name: prod?.name || 'Unknown',
          price: item.price || (prod?.price || 0),
          quantity: item.quantity,
          productImage: item.image || prod?.image || '',
          variantKey: item.variantKey || null,
          variantAttrs: item.variantAttrs || null,
          customText: item.customText || null,
        };
      });

      const orderData = {
        ...formData,
        customerName: formData.name || formData.fullName || 'Customer',
        items: orderItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        total: total,
        paymentMethod: selectedPayment,
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      const orderRefDoc = await addDoc(collection(db, 'orders'), orderData);
      setOrderRef(orderRefDoc.id);

      const batch = writeBatch(db);
      for (const item of orderItems) {
        const productRef = doc(db, 'products', item.id);
        batch.update(productRef, { stock: increment(-item.quantity) });
      }
      await batch.commit();

      clearCart();
      localStorage.removeItem('cached_products');
      localStorage.removeItem('cached_products_time');

      setPlacingOrder(false);
      setOrderPlaced(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Error placing order:', error);
      setPlacingOrder(false);
      setIsSubmitting(false);
      alert('Error placing order. Please try again.');
    }
  };

  // Get fields
  const getFields = () => {
    return settings.checkoutFields || settings.formFields || [
      { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true },
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+971 50 000 0000', required: true },
      { id: 'address', label: 'Delivery Address', type: 'textarea', placeholder: 'Street address, city, postal code', required: true }
    ];
  };

  // Render form field
  const renderField = (field, index, fields) => {
    const error = formErrors[field.id];

    const inputProps = {
      id: `f-${field.id}`,
      className: `form-input ${error ? 'error' : ''}`,
      placeholder: field.placeholder || '',
      value: formData[field.id] || '',
      onChange: (e) => handleFieldChange(field.id, e.target.value),
      required: field.required
    };

    let input;
    if (field.type === 'textarea') {
      input = <textarea {...inputProps} rows="3" />;
    } else if (field.type === 'select' && field.options) {
      input = (
        <select {...inputProps}>
          <option value="">Select...</option>
          {(field.options || []).map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    } else {
      input = <input type={field.type || 'text'} {...inputProps} />;
    }

    return (
      <div key={field.id} className="form-group" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '4px'
      }}>
        <label className="form-label" style={{
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {field.label || field.id}
          {field.required && <span className="req" style={{ color: '#FF6B35', fontSize: '1rem' }}>*</span>}
        </label>
        {input}
        {error && (
          <span className="field-error" style={{
            fontSize: '0.75rem',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '4px'
          }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '0.7rem' }}></i>
            <span>{error}</span>
          </span>
        )}
      </div>
    );
  };

  // Render form rows
  const renderFormRows = () => {
    const fields = getFields();
    const rows = [];
    let i = 0;
    while (i < fields.length) {
      const f = fields[i];
      const isWide = f.type === 'textarea' || f.type === 'select';
      
      if (isWide || i === fields.length - 1) {
        rows.push(
          <div key={`row-${i}`} className="form-row full" style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '12px',
            marginBottom: '12px'
          }}>
            {renderField(f, i, fields)}
          </div>
        );
        i++;
      } else {
        const f2 = fields[i + 1];
        rows.push(
          <div key={`row-${i}`} className="form-row" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '12px'
          }}>
            {renderField(f, i, fields)}
            {f2 && renderField(f2, i + 1, fields)}
          </div>
        );
        i += 2;
      }
    }
    return rows;
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center'
        }}>
          <div className="spinner" style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e8e8f0',
            borderTopColor: '#1a1a2e',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#4a4a68' }}>Loading checkout...</p>
        </div>
        <Footer />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </>
    );
  }

  // Success screen
  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px'
        }}>
          <div style={{
            background: 'white',
            border: '1px solid #e8e8f0',
            borderRadius: '24px',
            padding: '48px',
            maxWidth: '560px',
            width: '100%',
            textAlign: 'center',
            margin: '0 auto'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '2rem',
              color: '#22c55e'
            }}>
              <i className="fas fa-check"></i>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#1a1a2e',
              marginBottom: '10px'
            }}>Order Confirmed!</h1>
            <p style={{
              color: '#4a4a68',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '28px'
            }}>Thank you for your purchase. We'll begin processing it right away.</p>
            <div style={{
              background: '#f8f8fc',
              border: '1px solid #e8e8f0',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '28px'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#4a4a68',
                marginBottom: '4px'
              }}>Order Reference</div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: '800',
                color: '#1a1a2e'
              }}>#ISM-{orderRef.substring(0, 6).toUpperCase()}</div>
            </div>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link to="/shop" className="btn bp" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '10px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s',
                textDecoration: 'none',
                background: '#1a1a2e',
                color: 'white'
              }}>
                <i className="fas fa-store"></i> Continue Shopping
              </Link>
              <Link to="/" className="btn bo" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px 22px',
                borderRadius: '10px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1.5px solid #1a1a2e',
                transition: 'all 0.2s',
                textDecoration: 'none',
                background: 'transparent',
                color: '#1a1a2e'
              }}>
                <i className="fas fa-home"></i> Go Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center'
        }}>
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
          <p style={{ color: '#4a4a68', marginBottom: '24px' }}>Add some products to your cart before checking out.</p>
          <Link to="/shop" style={{
            display: 'inline-block',
            padding: '12px 32px',
            borderRadius: '10px',
            background: '#FF6B35',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600'
          }}>
            <i className="fas fa-store"></i> Continue Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* PM Card Styles */
        .pm-card {
          border: 2px solid #e8e8f0;
          border-radius: 12px;
          padding: 14px 18px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .pm-card:hover {
          border-color: rgba(26,26,46,0.3);
        }
        .pm-card.selected {
          border-color: #FF6B35;
          background: rgba(255,107,53,0.04);
        }
        .pm-radio {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pm-card.selected .pm-radio {
          border-color: #FF6B35;
          background: #FF6B35;
        }
        .pm-card.selected .pm-radio::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
          display: block;
        }
        
        /* Form Styles */
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e8e8f0;
          border-radius: 10px;
          font-family: "'DM Sans', sans-serif";
          font-size: 0.9rem;
          color: #1a1a2e;
          background: white;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255,107,53,0.08);
        }
        .form-input.error {
          border-color: #ef4444;
        }
        .form-input::placeholder {
          color: #b0b0b0;
        }
        textarea.form-input {
          resize: vertical;
          min-height: 80px;
        }
        select.form-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234a4a68'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 16px;
          padding-right: 40px;
        }
        
        /* Steps */
        .step-line {
          flex: 1;
          height: 2px;
          background: #e8e8f0;
          margin: 0 10px;
          max-width: 40px;
        }
        
        /* Responsive */
        @media (max-width: 900px) {
          .checkout-wrap { grid-template-columns: 1fr !important; }
          .summary-card { position: static !important; }
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr !important; }
          .steps { gap: 4px !important; }
          .step-line { max-width: 20px !important; margin: 0 4px !important; }
          .card { padding: 20px !important; }
        }
      `}</style>

      {/* Loading Overlay */}
      {placingOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e8e8f0',
            borderTopColor: '#1a1a2e',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1a1a2e' }}>Placing your order...</p>
        </div>
      )}

      {/* Checkout Content */}
      <div className="checkout-wrap" style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Left Column */}
        <div>
          {/* Steps */}
          <div className="steps" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            marginBottom: '32px'
          }}>
            <div className="step active" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: '600'
            }}>
              <div className="step-num" style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
                flexShrink: 0,
                background: '#FF6B35',
                color: 'white'
              }}>1</div>
              <span className="step-label" style={{ color: '#1a1a2e', fontWeight: '600' }}>Information</span>
            </div>
            <div className="step-line"></div>
            <div className="step inactive" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: '500'
            }}>
              <div className="step-num" style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
                flexShrink: 0,
                background: '#e8e8f0',
                color: '#4a4a68'
              }}>2</div>
              <span className="step-label" style={{ color: '#4a4a68' }}>Payment</span>
            </div>
            <div className="step-line"></div>
            <div className="step inactive" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: '500'
            }}>
              <div className="step-num" style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
                flexShrink: 0,
                background: '#e8e8f0',
                color: '#4a4a68'
              }}>3</div>
              <span className="step-label" style={{ color: '#4a4a68' }}>Confirmation</span>
            </div>
          </div>

          {/* Contact Information - Clean Design */}
          <div className="card" style={{
            background: 'white',
            border: '1px solid #e8e8f0',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div className="card-title" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1a1a2e',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255,107,53,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-user" style={{ color: '#FF6B35', fontSize: '0.95rem' }}></i>
              </div>
              Contact Information
            </div>
            {renderFormRows()}
          </div>

          {/* Payment Methods - Clean Design */}
          <div className="card" style={{
            background: 'white',
            border: '1px solid #e8e8f0',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div className="card-title" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1a1a2e',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(255,107,53,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-credit-card" style={{ color: '#FF6B35', fontSize: '0.95rem' }}></i>
              </div>
              Payment Method
            </div>
            <div className="pm-grid" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {paymentMethods.map((method, idx) => (
                <div
                  key={method.id || idx}
                  className={`pm-card ${selectedPayment === (method.id || '0') ? 'selected' : ''}`}
                  onClick={() => setSelectedPayment(method.id || '0')}
                  style={{
                    border: `2px solid ${selectedPayment === (method.id || '0') ? '#FF6B35' : '#e8e8f0'}`,
                    borderRadius: '12px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    background: selectedPayment === (method.id || '0') ? 'rgba(255,107,53,0.04)' : 'white'
                  }}
                >
                  <div className="pm-radio" style={{
                    width: '18px',
                    height: '18px',
                    border: `2px solid ${selectedPayment === (method.id || '0') ? '#FF6B35' : '#d1d5db'}`,
                    borderRadius: '50%',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: selectedPayment === (method.id || '0') ? '#FF6B35' : 'transparent'
                  }}>
                    {selectedPayment === (method.id || '0') && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'white'
                      }}></div>
                    )}
                  </div>
                  <div className="pm-icon" style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9px',
                    background: '#f8f8fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    color: '#4a4a68',
                    flexShrink: 0
                  }}>
                    <i className={method.icon || 'fas fa-credit-card'}></i>
                  </div>
                  <div className="pm-info" style={{ flex: 1 }}>
                    <div className="pm-name" style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#1a1a2e',
                      marginBottom: '2px'
                    }}>{method.label || method.name || 'Payment'}</div>
                    <div className="pm-desc" style={{
                      fontSize: '0.78rem',
                      color: '#4a4a68'
                    }}>{method.desc || ''}</div>
                  </div>
                </div>
              ))}
            </div>
            <div id="pm-details-wrap">
              {paymentMethods.find(m => (m.id || '0') === selectedPayment)?.details && (
                <div className="pm-details" style={{
                  marginTop: '14px',
                  padding: '16px',
                  background: '#f8f8fc',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: '#4a4a68',
                  lineHeight: '1.8'
                }}
                dangerouslySetInnerHTML={{
                  __html: paymentMethods.find(m => (m.id || '0') === selectedPayment)?.details?.replace(/\n/g, '<br>') || ''
                }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="summary-card" style={{
            background: 'white',
            border: '1px solid #e8e8f0',
            borderRadius: '16px',
            padding: '24px',
            position: 'sticky',
            top: '84px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div className="summary-title" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1a1a2e',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255,107,53,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fas fa-receipt" style={{ color: '#FF6B35', fontSize: '0.8rem' }}></i>
              </div>
              Order Summary
            </div>
            
            <div id="sum-items">
              {cartItems.map((item, idx) => {
                const prod = products.find(p => p.id === item.id);
                return (
                  <div key={idx} className="sum-item" style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div className="sum-img-wrap" style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        className="sum-img"
                        src={item.image || prod?.image}
                        alt={item.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          border: '1px solid #e8e8f0'
                        }}
                        onError={(e) => e.target.src = 'https://placehold.co/60x60/f0f0f0/aaa?text=IMG'}
                      />
                      <span className="sum-qty" style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        minWidth: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#FF6B35',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white',
                        padding: '0 4px'
                      }}>{item.quantity}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="sum-name" style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#1a1a2e',
                        marginBottom: '3px',
                        lineHeight: '1.3'
                      }}>{item.name}</div>
                      {item.variantAttrs && (
                        <div className="sum-variant" style={{
                          fontSize: '0.7rem',
                          color: '#4a4a68'
                        }}>
                          {Object.entries(item.variantAttrs).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                        </div>
                      )}
                      {item.customText && (
                        <div className="sum-custom" style={{
                          fontSize: '0.65rem',
                          color: '#b45309',
                          background: '#fef3c7',
                          borderRadius: '4px',
                          padding: '1px 6px',
                          display: 'inline-block',
                          marginTop: '3px'
                        }}>
                          <i className="fas fa-pen" style={{ fontSize: '0.5rem', marginRight: '2px' }}></i>
                          {item.customText}
                        </div>
                      )}
                    </div>
                    <div className="sum-price" style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: '#1a1a2e',
                      flexShrink: 0
                    }}>{formatPrice((item.price || 0) * item.quantity)}</div>
                  </div>
                );
              })}
            </div>

            <div className="sum-divider" style={{
              height: '1px',
              background: '#e8e8f0',
              margin: '16px 0'
            }}></div>

            <div className="sum-row" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '0.875rem'
            }}>
              <span className="lbl" style={{ color: '#4a4a68' }}>Subtotal</span>
              <span className="val" style={{ fontWeight: '600', color: '#1a1a2e' }}>{formatPrice(subtotal)}</span>
            </div>

            <div className="sum-row" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '0.875rem'
            }}>
              <span className="lbl" style={{ color: '#4a4a68' }}>Delivery</span>
              <span className="val" style={{ fontWeight: '600', color: '#1a1a2e' }}>
                {deliveryFee === 0 && settings.freeShippingThreshold > 0 ? (
                  <span className="free" style={{ color: '#22c55e', fontWeight: '700' }}>
                    <i className="fas fa-check" style={{ fontSize: '0.65rem', marginRight: '3px' }}></i>FREE
                  </span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>

            {settings.taxRate > 0 && (
              <div className="sum-row" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                fontSize: '0.875rem'
              }}>
                <span className="lbl" style={{ color: '#4a4a68' }}>Tax</span>
                <span className="val" style={{ fontWeight: '600', color: '#1a1a2e' }}>
                  {formatPrice(tax)} ({settings.taxRate}%)
                </span>
              </div>
            )}

            <div className="sum-total" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '14px',
              borderTop: '2px solid #FF6B35',
              marginTop: '8px'
            }}>
              <span className="lbl" style={{ fontSize: '1rem', fontWeight: '700', color: '#1a1a2e' }}>Total</span>
              <span className="val" style={{ fontSize: '1.3rem', fontWeight: '800', color: '#FF6B35' }}>{formatPrice(total)}</span>
            </div>

            <button
              className="place-btn"
              onClick={placeOrder}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: '#FF6B35',
                color: 'white',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1rem',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '16px',
                opacity: isSubmitting ? 0.6 : 1,
                boxShadow: '0 4px 14px rgba(255,107,53,0.35)'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#e55a25';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,107,53,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#FF6B35';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(255,107,53,0.35)';
                }
              }}
            >
              <i className="fas fa-lock" style={{ fontSize: '0.85rem' }}></i>
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>

            <div className="secure-note" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '14px',
              fontSize: '0.75rem',
              color: '#4a4a68'
            }}>
              <i className="fas fa-shield-alt" style={{ color: '#22c55e' }}></i>
              Your information is secure & encrypted
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Checkout;