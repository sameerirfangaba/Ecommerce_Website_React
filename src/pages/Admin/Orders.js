import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, orderBy, query, updateDoc, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import OrderModal from './components/OrderModal';

function Orders({ formatPrice }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setOrders(data);
      setLoading(false);
    }, (error) => {
      console.error('Error loading orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    try {
      await deleteDoc(doc(db, 'orders', orderToDelete));
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      case 'Shipped': return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
      case 'Delivered': return { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' };
      case 'Cancelled': return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return 'fa-clock';
      case 'Shipped': return 'fa-truck';
      case 'Delivered': return 'fa-check-circle';
      case 'Cancelled': return 'fa-times-circle';
      default: return 'fa-circle';
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filter !== 'all' && order.status !== filter) return false;
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const customerName = (order.customerName || '').toLowerCase();
      const orderId = order.id.toLowerCase();
      const email = (order.email || '').toLowerCase();
      return customerName.includes(term) || orderId.includes(term) || email.includes(term);
    }
    
    return true;
  });

  const statusOptions = ['all', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}></i>
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '12px'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            <i className="fas fa-shopping-cart" style={{ color: '#1A1A1A', marginRight: '8px' }}></i>
            All Orders
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: '#6b7280',
              marginLeft: '8px'
            }}>
              ({filteredOrders.length} orders)
            </span>
          </h2>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <i className="fas fa-search" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '0.85rem'
              }}></i>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  width: '200px',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1A1A1A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '8px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.875rem',
                outline: 'none',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <i className="fas fa-inbox" style={{ fontSize: '3rem', display: 'block', marginBottom: '16px', opacity: 0.3 }}></i>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
              {searchTerm || filter !== 'all' ? 'No matching orders' : 'No orders yet'}
            </h3>
            <p style={{ fontSize: '0.875rem' }}>
              {searchTerm || filter !== 'all' ? 'Try adjusting your filters' : 'Orders will appear here once customers start ordering'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
              minWidth: '700px'
            }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Order ID</th>
                  <th style={{ textAlign: 'left', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Date</th>
                  <th style={{ textAlign: 'center', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Items</th>
                  <th style={{ textAlign: 'right', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Total</th>
                  <th style={{ textAlign: 'center', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Payment</th>
                  <th style={{ textAlign: 'center', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Status</th>
                  <th style={{ textAlign: 'center', padding: '12px 10px', color: '#6b7280', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusColors = getStatusColor(order.status);
                  const statusIcon = getStatusIcon(order.status);
                  const date = order.createdAt ? new Date(order.createdAt.toDate()).toLocaleString() : 'N/A';
                  const itemsCount = (order.items || []).length;
                  
                  return (
                    <tr key={order.id} style={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 10px', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600 }}>
                        #{order.id.slice(-8)}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.customerName || 'Guest'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{order.email || ''}</div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{order.phone || ''}</div>
                      </td>
                      <td style={{ padding: '12px 10px', fontSize: '0.75rem', whiteSpace: 'nowrap', color: '#6b7280' }}>
                        {date}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f3f4f6',
                          borderRadius: '20px',
                          padding: '2px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#4b5563'
                        }}>
                          {itemsCount}
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#1A1A1A', fontSize: '0.95rem' }}>
                        {formatPrice(order.total || 0)}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: '#f3f4f6',
                          color: '#4b5563'
                        }}>
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: statusColors.bg,
                          color: statusColors.text,
                          border: `1px solid ${statusColors.border}`
                        }}>
                          <i className={`fas ${statusIcon}`} style={{ fontSize: '0.6rem' }}></i>
                          {order.status || 'Pending'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            style={{
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '4px 6px',
                              fontSize: '0.7rem',
                              background: 'white',
                              cursor: 'pointer',
                              outline: 'none'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => viewOrderDetails(order)}
                            style={{
                              color: '#1A1A1A',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#EEF2FF'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(order.id)}
                            style={{
                              color: '#ef4444',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            title="Delete Order"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer with order count */}
        {filteredOrders.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '16px',
            marginTop: '16px',
            borderTop: '1px solid #f3f4f6',
            fontSize: '0.8rem',
            color: '#6b7280'
          }}>
            <span>
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
            <span>
              <i className="fas fa-sync-alt" style={{ marginRight: '4px', fontSize: '0.7rem' }}></i>
              Auto-refresh
            </span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleDeleteCancel();
        }}
        >
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#ef4444' }}></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Delete Order?</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '24px' }}>
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleDeleteCancel}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <i className="fas fa-trash" style={{ marginRight: '6px' }}></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          formatPrice={formatPrice}
          onClose={() => setShowOrderModal(false)}
          onStatusUpdate={updateOrderStatus}
        />
      )}
    </>
  );
}

export default Orders;