function OrderModal({ order, formatPrice, onClose }) {
  const date = order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString() : 'N/A';
  const items = order.items || [];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '16px'
    }}
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
    >
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Order Details</h2>
          <button
            onClick={onClose}
            style={{
              fontSize: '2rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Order Info</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '6px' }}>
              <span style={{ color: '#6b7280' }}>ID:</span> #{order.id}
            </p>
            <p style={{ fontSize: '0.875rem', marginBottom: '6px' }}>
              <span style={{ color: '#6b7280' }}>Date:</span> {date}
            </p>
            <p style={{ fontSize: '0.875rem', marginBottom: '6px' }}>
              <span style={{ color: '#6b7280' }}>Status:</span> {order.status || 'Pending'}
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              <span style={{ color: '#6b7280' }}>Payment:</span> {order.paymentMethod || 'COD'}
            </p>
          </div>
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Customer</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '6px' }}>
              <span style={{ color: '#6b7280' }}>Name:</span> {order.customerName || 'N/A'}
            </p>
            <p style={{ fontSize: '0.875rem', marginBottom: '6px' }}>
              <span style={{ color: '#6b7280' }}>Email:</span> {order.email || 'N/A'}
            </p>
            <p style={{ fontSize: '0.875rem', marginBottom: '6px' }}>
              <span style={{ color: '#6b7280' }}>Phone:</span> {order.phone || 'N/A'}
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              <span style={{ color: '#6b7280' }}>Address:</span> {order.address || 'N/A'}
            </p>
          </div>
        </div>

        <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Items</h3>
          <table style={{ width: '100%', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '8px 0' }}>Product</th>
                <th style={{ textAlign: 'center', padding: '8px' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '8px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            flexShrink: 0
                          }}
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        {item.variantAttrs && (
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {Object.entries(item.variantAttrs).map(([key, val]) => (
                              <span key={key} style={{
                                background: '#eef2ff',
                                color: '#4f46e5',
                                borderRadius: '4px',
                                padding: '1px 6px',
                                fontSize: '0.65rem',
                                fontWeight: 600
                              }}>
                                {key}: {val}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.customText && (
                          <div style={{
                            fontSize: '0.7rem',
                            color: '#b45309',
                            background: '#fef3c7',
                            borderRadius: '4px',
                            padding: '1px 6px',
                            display: 'inline-block',
                            marginTop: '2px'
                          }}>
                            <i className="fas fa-pen" style={{ fontSize: '0.6rem', marginRight: '2px' }}></i>
                            {item.customText}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>{formatPrice(item.price)}</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Summary</h3>
          <div style={{ fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Subtotal</span>
              <span>{formatPrice(order.subtotal || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Tax</span>
              <span>{formatPrice(order.tax || 0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>Delivery</span>
              <span>{formatPrice(order.deliveryFee || 0)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '2px solid #1a1a2e',
              paddingTop: '8px',
              marginTop: '8px',
              fontWeight: 700,
              color: '#FF6B35'
            }}>
              <span>Total</span>
              <span>{formatPrice(order.total || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;