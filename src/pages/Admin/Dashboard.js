import { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import Chart from 'chart.js/auto';  // ← ADD THIS LINE


function Dashboard({ formatPrice }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    avgOrder: 0,
    pendingOrders: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let start = new Date(now);
      let end = new Date(now);

      switch(dateRange) {
        case 'today':
          start.setHours(0,0,0,0);
          end.setHours(23,59,59,999);
          break;
        case 'yesterday':
          start.setDate(start.getDate() - 1);
          start.setHours(0,0,0,0);
          end = new Date(start);
          end.setHours(23,59,59,999);
          break;
        case 'last7':
          start.setDate(start.getDate() - 7);
          start.setHours(0,0,0,0);
          end.setHours(23,59,59,999);
          break;
        case 'last30':
          start.setDate(start.getDate() - 30);
          start.setHours(0,0,0,0);
          end.setHours(23,59,59,999);
          break;
        case 'thisMonth':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end.setHours(23,59,59,999);
          break;
        case 'lastMonth':
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          end = new Date(now.getFullYear(), now.getMonth(), 0);
          end.setHours(23,59,59,999);
          break;
        default:
          break;
      }

      const q = query(
        collection(db, 'orders'),
        where('createdAt', '>=', start),
        where('createdAt', '<=', end)
      );
      const snap = await getDocs(q);
      const ordersData = [];
      let totalSales = 0;
      let pendingCount = 0;

      snap.forEach(doc => {
        const data = doc.data();
        ordersData.push({ id: doc.id, ...data });
        totalSales += data.total || 0;
        if ((data.status || 'Pending') === 'Pending') pendingCount++;
      });

      setOrders(ordersData);
      setStats({
        totalOrders: ordersData.length,
        totalSales: totalSales,
        avgOrder: ordersData.length ? totalSales / ordersData.length : 0,
        pendingOrders: pendingCount
      });

      // Calculate top products
      const productMap = {};
      ordersData.forEach(order => {
        if (order.items) {
          order.items.forEach(item => {
            if (!productMap[item.name]) {
              productMap[item.name] = { name: item.name, quantity: 0, revenue: 0 };
            }
            productMap[item.name].quantity += item.quantity || 0;
            productMap[item.name].revenue += (item.price || 0) * (item.quantity || 0);
          });
        }
      });
      const top = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      setTopProducts(top);

      // Update chart
      updateChart(ordersData);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const updateChart = (ordersData) => {
    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const canvas = document.getElementById('salesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Group sales by date
    const salesByDate = {};
    ordersData.forEach(o => {
      if (o.createdAt) {
        const d = new Date(o.createdAt.toDate()).toLocaleDateString();
        salesByDate[d] = (salesByDate[d] || 0) + (o.total || 0);
      }
    });

    const labels = Object.keys(salesByDate).sort((a, b) => new Date(a) - new Date(b));
    const data = labels.map(d => salesByDate[d]);

    if (labels.length === 0) {
      // No data - show empty chart
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['No Data'],
          datasets: [{
            label: 'Sales',
            data: [0],
            borderColor: '#FF6B35',
            backgroundColor: 'rgba(255,107,53,0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => formatPrice(ctx.parsed.y)
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (v) => formatPrice(v)
              }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
      return;
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sales',
          data: data,
          borderColor: '#FF6B35',
          backgroundColor: 'rgba(255,107,53,0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#FF6B35',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => formatPrice(ctx.parsed.y)
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => formatPrice(v)
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return { bg: '#fef3c7', text: '#b45309' };
      case 'Shipped': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Delivered': return { bg: '#d1fae5', text: '#065f46' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const StatCard = ({ icon, iconBg, iconColor, label, value, subtext }) => (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #f0f0f0',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.06)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>{label}</span>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: iconBg || '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className={icon} style={{ color: iconColor || '#6b7280', fontSize: '1.1rem' }}></i>
        </div>
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e' }}>
        {loading ? '...' : value}
      </div>
      {subtext && (
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>{subtext}</div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        .filter-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: white;
          color: #4a4a68;
          border: 1px solid #e8e8f0;
        }
        .filter-btn:hover {
          border-color: #FF6B35;
          color: #FF6B35;
        }
        .filter-btn.active {
          background: #FF6B35;
          color: white;
          border-color: #FF6B35;
          box-shadow: 0 4px 12px rgba(255,107,53,0.3);
        }
        .chart-container {
          position: relative;
          height: 280px;
          width: 100%;
        }
        .chart-container canvas {
          width: 100% !important;
          height: 100% !important;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Date Filter */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '24px',
        border: '1px solid #f0f0f0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {['today', 'yesterday', 'last7', 'last30', 'thisMonth', 'lastMonth'].map((range) => (
            <button
              key={range}
              className={`filter-btn ${dateRange === range ? 'active' : ''}`}
              onClick={() => setDateRange(range)}
            >
              {range === 'today' ? 'Today' :
               range === 'yesterday' ? 'Yesterday' :
               range === 'last7' ? 'Last 7 Days' :
               range === 'last30' ? 'Last 30 Days' :
               range === 'thisMonth' ? 'This Month' :
               'Last Month'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280' }}>
          <i className="fas fa-calendar-alt" style={{ color: '#FF6B35' }}></i>
          <span>{loading ? 'Loading...' : `${stats.totalOrders} orders`}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <StatCard
          icon="fas fa-shopping-bag"
          iconBg="#eef2ff"
          iconColor="#1a1a2e"
          label="Total Orders"
          value={loading ? '...' : stats.totalOrders}
        />
        <StatCard
          icon="fas fa-dollar-sign"
          iconBg="#dcfce7"
          iconColor="#16a34a"
          label="Total Sales"
          value={loading ? '...' : formatPrice(stats.totalSales)}
        />
        <StatCard
          icon="fas fa-chart-line"
          iconBg="#fef3c7"
          iconColor="#d97706"
          label="Avg. Order Value"
          value={loading ? '...' : formatPrice(stats.avgOrder)}
          subtext="per order"
        />
        <StatCard
          icon="fas fa-clock"
          iconBg="#fee2e2"
          iconColor="#dc2626"
          label="Pending Orders"
          value={loading ? '...' : stats.pendingOrders}
          subtext="need attention"
        />
      </div>

      {/* Chart and Recent Orders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Chart */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Sales Overview</h3>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              <i className="fas fa-calendar-alt" style={{ marginRight: '4px', color: '#FF6B35' }}></i>
              {dateRange === 'today' ? 'Today' :
               dateRange === 'yesterday' ? 'Yesterday' :
               dateRange === 'last7' ? 'Last 7 Days' :
               dateRange === 'last30' ? 'Last 30 Days' :
               dateRange === 'thisMonth' ? 'This Month' :
               'Last Month'}
            </span>
          </div>
          <div className="chart-container">
            <canvas id="salesChart"></canvas>
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Recent Orders</h3>
            <button
              onClick={() => {
                document.querySelector('[data-tab="orders"]')?.click();
              }}
              style={{
                color: '#FF6B35',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500
              }}
            >
              View all →
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#6b7280' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}></i>
              Loading...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#6b7280' }}>
              <i className="fas fa-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px', opacity: 0.3 }}></i>
              No orders this period
            </div>
          ) : (
            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {orders.slice(0, 8).map((order) => {
                const statusColors = getStatusColor(order.status);
                return (
                  <div key={order.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        #{order.id.slice(-6)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {order.customerName || 'Guest'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FF6B35' }}>
                        {formatPrice(order.total || 0)}
                      </div>
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: statusColors.bg,
                        color: statusColors.text,
                        fontWeight: 600
                      }}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #f0f0f0'
      }}>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '16px' }}>
          <i className="fas fa-trophy" style={{ color: '#FF6B35', marginRight: '8px' }}></i>
          Top Selling Products
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}></i>
            Loading...
          </div>
        ) : topProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#6b7280' }}>
            <i className="fas fa-chart-bar" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px', opacity: 0.3 }}></i>
            No product sales data available
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            {topProducts.map((product, index) => (
              <div key={index} style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid #f0f0f0',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF6B35';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: index === 0 ? '#fef3c7' : index === 1 ? '#e5e7eb' : index === 2 ? '#fef3c7' : '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: index === 0 ? '#d97706' : index === 1 ? '#6b7280' : index === 2 ? '#92400e' : '#4b5563'
                }}>
                  {index + 1}
                </div>
                <div style={{
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                  {product.quantity} sold
                </div>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#FF6B35',
                  marginTop: '4px'
                }}>
                  {formatPrice(product.revenue)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;