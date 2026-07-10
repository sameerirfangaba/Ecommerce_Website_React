import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    checkoutFields: [],
    paymentMethods: [],
    currency: 'AED',
    currencyPosition: 'left-space',
    taxRate: 0,
    baseDeliveryFee: 0,
    freeShippingThreshold: 150
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'checkout');
      const docSnap = await getDoc(docRef);
      
      const defaultSettings = {
        checkoutFields: [
          { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true, order: 0 },
          { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true, order: 1 },
          { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+92 300 0000000', required: true, order: 2 },
          { id: 'address', label: 'Delivery Address', type: 'textarea', placeholder: 'Street, City, Postal Code', required: true, order: 3 }
        ],
        paymentMethods: [
          { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when order arrives', icon: 'fas fa-money-bill-wave', enabled: true },
          { id: 'bank', label: 'Bank Transfer', desc: 'Transfer to bank account', icon: 'fas fa-university', enabled: true, details: 'Bank: HBL\nAccount: 0123-456-789\nTitle: Ismora' }
        ],
        currency: 'AED',
        currencyPosition: 'left-space',
        taxRate: 0,
        baseDeliveryFee: 0,
        freeShippingThreshold: 150
      };

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          ...defaultSettings,
          ...data,
          checkoutFields: data.checkoutFields || defaultSettings.checkoutFields,
          paymentMethods: data.paymentMethods || defaultSettings.paymentMethods
        });
      } else {
        setSettings(defaultSettings);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'checkout'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Error saving settings', 'error');
    }
    setSaving(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const addField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      placeholder: '',
      required: false,
      order: settings.checkoutFields.length
    };
    setSettings({
      ...settings,
      checkoutFields: [...settings.checkoutFields, newField]
    });
  };

  const removeField = (index) => {
    const fields = [...settings.checkoutFields];
    fields.splice(index, 1);
    setSettings({ ...settings, checkoutFields: fields });
  };

  const updateField = (index, key, value) => {
    const fields = [...settings.checkoutFields];
    fields[index] = { ...fields[index], [key]: value };
    setSettings({ ...settings, checkoutFields: fields });
  };

  const addPaymentMethod = () => {
    const newMethod = {
      id: `method_${Date.now()}`,
      label: 'New Method',
      desc: '',
      icon: 'fas fa-credit-card',
      enabled: true,
      details: ''
    };
    setSettings({
      ...settings,
      paymentMethods: [...settings.paymentMethods, newMethod]
    });
  };

  const removePaymentMethod = (index) => {
    const methods = [...settings.paymentMethods];
    methods.splice(index, 1);
    setSettings({ ...settings, paymentMethods: methods });
  };

  const updatePaymentMethod = (index, key, value) => {
    const methods = [...settings.paymentMethods];
    methods[index] = { ...methods[index], [key]: value };
    setSettings({ ...settings, paymentMethods: methods });
  };

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #f0f0f0',
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}></i>
        Loading settings...
      </div>
    );
  }

  return (
    <>
      <style>{`
        .settings-info-box {
          background: #FAFAFA;
          border: 1px solid #EAEAEA;
          border-left: 3px solid #1A1A1A;
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 20px;
          font-size: 0.82rem;
          color: #1A1A1A;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .field-item {
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #e5e7eb;
          flex-wrap: wrap;
        }
        .drag-handle {
          cursor: move;
          color: #9ca3af;
        }
      `}</style>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #f0f0f0'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
          <i className="fas fa-cog" style={{ color: '#1A1A1A', marginRight: '8px' }}></i>
          Store Configuration
        </h2>

        <div className="settings-info-box">
          <i className="fas fa-info-circle"></i>
          <div>
            <strong>Save karne ke baad changes immediately apply ho jaate hain.</strong> Checkout page aur customer-facing pages automatically naye settings use karte hain.
          </div>
        </div>

        {/* Checkout Form Fields */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Checkout Form Fields</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
            Ye woh fields hain jo customer checkout par dekhta hai.
          </p>

          <div id="form-fields-container">
            {settings.checkoutFields.map((field, index) => (
              <div key={index} className="field-item">
                <i className="fas fa-grip-vertical drag-handle"></i>
                <input
                  type="text"
                  value={field.id}
                  onChange={(e) => updateField(index, 'id', e.target.value)}
                  placeholder="field_id"
                  style={{
                    width: '100px',
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                />
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(index, 'label', e.target.value)}
                  placeholder="Label"
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    minWidth: '120px'
                  }}
                />
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                  placeholder="Placeholder"
                  style={{
                    width: '160px',
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, 'type', e.target.value)}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="textarea">Textarea</option>
                  <option value="number">Number</option>
                  <option value="select">Dropdown</option>
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  <input
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) => updateField(index, 'required', e.target.checked)}
                  /> Required
                </label>
                <button
                  onClick={() => removeField(index)}
                  style={{
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addField}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#eff6ff',
              color: '#1d4ed8',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fas fa-plus"></i> Add New Field
          </button>
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Payment Methods</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
            Checkout par jo payment options dikhenge.
          </p>

          <div id="payment-methods-container">
            {settings.paymentMethods.map((method, index) => (
              <div key={index} className="field-item">
                <i className="fas fa-grip-vertical drag-handle"></i>
                <input
                  type="text"
                  value={method.id}
                  onChange={(e) => updatePaymentMethod(index, 'id', e.target.value)}
                  placeholder="id"
                  style={{
                    width: '80px',
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                />
                <input
                  type="text"
                  value={method.label}
                  onChange={(e) => updatePaymentMethod(index, 'label', e.target.value)}
                  placeholder="Display Name"
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    minWidth: '100px'
                  }}
                />
                <input
                  type="text"
                  value={method.desc || ''}
                  onChange={(e) => updatePaymentMethod(index, 'desc', e.target.value)}
                  placeholder="Description"
                  style={{
                    width: '180px',
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                />
                <select
                  value={method.icon || 'fas fa-credit-card'}
                  onChange={(e) => updatePaymentMethod(index, 'icon', e.target.value)}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="fas fa-money-bill-wave">Cash</option>
                  <option value="fab fa-cc-visa">Visa</option>
                  <option value="fab fa-cc-mastercard">Mastercard</option>
                  <option value="fab fa-cc-paypal">PayPal</option>
                  <option value="fas fa-university">Bank</option>
                  <option value="fas fa-credit-card">Card</option>
                </select>
                <textarea
                  value={method.details || ''}
                  onChange={(e) => updatePaymentMethod(index, 'details', e.target.value)}
                  placeholder="Bank details (optional)"
                  style={{
                    width: '200px',
                    height: '60px',
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  <input
                    type="checkbox"
                    checked={method.enabled !== false}
                    onChange={(e) => updatePaymentMethod(index, 'enabled', e.target.checked)}
                  /> Enabled
                </label>
                <button
                  onClick={() => removePaymentMethod(index)}
                  style={{
                    color: '#ef4444',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addPaymentMethod}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#eff6ff',
              color: '#1d4ed8',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fas fa-plus"></i> Add Payment Method
          </button>
        </div>

        {/* Currency Settings */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Currency Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
                Store Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="USD">🇺🇸 USD ($)</option>
                <option value="PKR">🇵🇰 PKR (Rs)</option>
                <option value="INR">🇮🇳 INR (₹)</option>
                <option value="GBP">🇬🇧 GBP (£)</option>
                <option value="EUR">🇪🇺 EUR (€)</option>
                <option value="AED">🇦🇪 AED</option>
                <option value="SAR">🇸🇦 SAR</option>
                <option value="CAD">🇨🇦 CAD (C$)</option>
                <option value="AUD">🇦🇺 AUD (A$)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>
                Symbol Position
              </label>
              <select
                value={settings.currencyPosition}
                onChange={(e) => setSettings({ ...settings, currencyPosition: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              >
                <option value="left">Left ($100)</option>
                <option value="right">Right (100€)</option>
                <option value="left-space">Left with space (Rs 100)</option>
                <option value="right-space">Right with space (100 ₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tax & Delivery */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>
              Tax Rate (%)
            </label>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px' }}>
              0 matlab no tax. 10 matlab 10%.
            </p>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 10"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>
              Delivery Fee
            </label>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px' }}>
              Flat delivery charge.
            </p>
            <input
              type="number"
              step="0.01"
              min="0"
              value={settings.baseDeliveryFee}
              onChange={(e) => setSettings({ ...settings, baseDeliveryFee: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 15"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>
              Free Shipping Threshold
            </label>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px' }}>
              Is amount se zyada order par free delivery.
            </p>
            <input
              type="number"
              step="0.01"
              min="0"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 150"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: '#1A1A1A',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            if (!saving) e.currentTarget.style.background = '#000000';
          }}
          onMouseLeave={(e) => {
            if (!saving) e.currentTarget.style.background = '#1A1A1A';
          }}
        >
          <i className="fas fa-save"></i>
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: toast.type === 'success' ? '#111827' : '#ef4444',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Settings;