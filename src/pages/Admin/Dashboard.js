import { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Chart from 'chart.js/auto';

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
  const [prevStats, setPrevStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    avgOrder: 0,
    pendingOrders: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState({ Pending: 0, Shipped: 0, Delivered: 0, Cancelled: 0 });
  const chartInstance = useRef(null);
  const donutInstance = useRef(null);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const getRangeDates = (range, offsetPeriods = 0) => {
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    switch (range) {
      case 'today':
        start.setDate(start.getDate() - offsetPeriods);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1 - offsetPeriods);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'last7':
        start.setDate(start.getDate() - 7 - (offsetPeriods * 7));
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() - (offsetPeriods * 7));
        end.setHours(23, 59, 59, 999);
        break;
      case 'last30':
        start.setDate(start.getDate() - 30 - (offsetPeriods * 30));
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() - (offsetPeriods * 30));
        end.setHours(23, 59, 59, 999);
        break;
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth() - offsetPeriods, 1);
        end = offsetPeriods === 0 ? new Date(now) : new Date(now.getFullYear(), now.getMonth() - offsetPeriods + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1 - offsetPeriods, 1);
        end = new Date(now.getFullYear(), now.getMonth() - offsetPeriods, 0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        break;
    }
    return { start, end };
  };

  const fetchOrdersInRange = async (start, end) => {
    const q = query(
      collection(db, 'orders'),
      where('createdAt', '>=', start),
      where('createdAt', '<=', end)
    );
    const snap = await getDocs(q);
    const data = [];
    snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    return data;
  };

  const computeStats = (ordersData) => {
    let totalSales = 0;
    let pendingCount = 0;
    ordersData.forEach(o => {
      totalSales += o.total || 0;
      if ((o.status || 'Pending') === 'Pending') pendingCount++;
    });
    return {
      totalOrders: ordersData.length,
      totalSales,
      avgOrder: ordersData.length ? totalSales / ordersData.length : 0,
      pendingOrders: pendingCount
    };
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { start, end } = getRangeDates(dateRange, 0);
      const { start: prevStart, end: prevEnd } = getRangeDates(dateRange, 1);

      const [ordersData, prevOrdersData] = await Promise.all([
        fetchOrdersInRange(start, end),
        fetchOrdersInRange(prevStart, prevEnd)
      ]);

      setOrders(ordersData);
      setStats(computeStats(ordersData));
      setPrevStats(computeStats(prevOrdersData));

      // Order status breakdown (current period)
      const breakdown = { Pending: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
      ordersData.forEach(o => {
        const s = o.status || 'Pending';
        if (breakdown[s] !== undefined) breakdown[s]++;
      });
      setStatusBreakdown(breakdown);

      // Top selling products (with real images from order items)
      const productMap = {};
      ordersData.forEach(order => {
        if (order.items) {
          order.items.forEach(item => {
            if (!productMap[item.name]) {
              productMap[item.name] = { name: item.name, quantity: 0, revenue: 0, image: item.productImage || item.image || '' };
            }
            productMap[item.name].quantity += item.quantity || 0;
            productMap[item.name].revenue += (item.price || 0) * (item.quantity || 0);
          });
        }
      });
      const top = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
      setTopProducts(top);

      updateChart(ordersData);
      updateDonut(breakdown);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const updateChart = (ordersData) => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const salesByDate = {};
    ordersData.forEach(o => {
      if (o.createdAt) {
        const d = new Date(o.createdAt.toDate()).toLocaleDateString();
        salesByDate[d] = (salesByDate[d] || 0) + (o.total || 0);
      }
    });

    const labels = Object.keys(salesByDate).sort((a, b) => new Date(a) - new Date(b));
    const data = labels.length ? labels.map(d => salesByDate[d]) : [0];

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.length ? labels : ['No Data'],
        datasets: [{
          label: 'Sales',
          data,
          borderColor: '#1A1A1A',
          backgroundColor: 'rgba(26,26,26,0.06)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#1A1A1A',
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
          tooltip: { callbacks: { label: (ctx) => formatPrice(ctx.parsed.y) } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { callback: (v) => formatPrice(v) } },
          x: { grid: { display: false } }
        }
      }
    });
  };

  const updateDonut = (breakdown) => {
    if (donutInstance.current) {
      donutInstance.current.destroy();
      donutInstance.current = null;
    }
    const canvas = document.getElementById('statusDonut');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

    donutInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        datasets: [{
          data: total ? [breakdown.Pending, breakdown.Shipped, breakdown.Delivered, breakdown.Cancelled] : [1, 0, 0, 0],
          backgroundColor: total ? ['#F59E0B', '#3B82F6', '#22C55E', '#EF4444'] : ['#EAEAEA'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: { legend: { display: false }, tooltip: { enabled: !!total } }
      }
    });
  };

  const getTrend = (current, previous) => {
    if (!previous && !current) return null;
    if (!previous) return { pct: 100, up: true };
    const pct = ((current - previous) / previous) * 100;
    return { pct: Math.round(Math.abs(pct)), up: pct >= 0 };
  };

  const StatCard = ({ icon, label, value, trend }) => (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #EAEAEA',
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#FAFAFA',
          border: '1px solid #EAEAEA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className={icon} style={{ color: '#1A1A1A', fontSize: '1rem' }}></i>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1A1A1A' }}>
          {loading ? '...' : value}
        </div>
        {trend && !loading && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: trend.up ? '#16a34a' : '#dc2626',
            marginBottom: '3px'
          }}>
            <i className={`fas ${trend.up ? 'fa-arrow-up' : 'fa-arrow-down'}`} style={{ fontSize: '0.65rem' }}></i>
            {trend.pct}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px' }}>vs previous period</div>
    </div>
  );

  const rangeLabel = (range) => (
    range === 'today' ? 'Today' :
    range === 'yesterday' ? 'Yesterday' :
    range === 'last7' ? 'Last 7 Days' :
    range === 'last30' ? 'Last 30 Days' :
    range === 'thisMonth' ? 'This Month' :
    'Last Month'
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
          background: white;
          color: #4a4a68;
          border: 1px solid #EAEAEA;
        }
        .filter-btn:hover {
          border-color: #1A1A1A;
          color: #1A1A1A;
        }
        .filter-btn.active {
          background: #1A1A1A;
          color: white;
          border-color: #1A1A1A;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .chart-container {
          position: relative;
          height: 260px;
          width: 100%;
        }
        .chart-container canvas {
          width: 100% !important;
          height: 100% !important;
        }
        .donut-container {
          position: relative;
          height: 140px;
          width: 140px;
          margin: 0 auto;
        }
        .top-products-row {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .top-products-row::-webkit-scrollbar { display: none; }
        @media (max-width: 1024px) {
          .dashboard-split { grid-template-columns: 1fr !important; }
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
        border: '1px solid #EAEAEA',
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
              {rangeLabel(range)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280' }}>
          <i className="fas fa-calendar-alt" style={{ color: '#1A1A1A' }}></i>
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
          label="Total Orders"
          value={loading ? '...' : stats.totalOrders}
          trend={getTrend(stats.totalOrders, prevStats.totalOrders)}
        />
        <StatCard
          icon="fas fa-dollar-sign"
          label="Total Sales"
          value={loading ? '...' : formatPrice(stats.totalSales)}
          trend={getTrend(stats.totalSales, prevStats.totalSales)}
        />
        <StatCard
          icon="fas fa-chart-line"
          label="Avg. Order Value"
          value={loading ? '...' : formatPrice(stats.avgOrder)}
          trend={getTrend(stats.avgOrder, prevStats.avgOrder)}
        />
        <StatCard
          icon="fas fa-clock"
          label="Pending Orders"
          value={loading ? '...' : stats.pendingOrders}
          trend={getTrend(stats.pendingOrders, prevStats.pendingOrders)}
        />
      </div>

      {/* Chart and Order Status */}
      <div className="dashboard-split" style={{
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
          border: '1px solid #EAEAEA'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1A1A1A' }}>Sales Overview</h3>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              <i className="fas fa-calendar-alt" style={{ marginRight: '4px', color: '#1A1A1A' }}></i>
              {rangeLabel(dateRange)}
            </span>
          </div>
          <div className="chart-container">
            <canvas id="salesChart"></canvas>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #EAEAEA',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1A1A1A', marginBottom: '20px' }}>Order Status</h3>
          <div className="donut-container">
            <canvas id="statusDonut"></canvas>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1A1A1A' }}>{loading ? '...' : stats.totalOrders}</div>
              <div style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Orders</div>
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Pending', color: '#F59E0B', count: statusBreakdown.Pending },
              { label: 'Shipped', color: '#3B82F6', count: statusBreakdown.Shipped },
              { label: 'Delivered', color: '#22C55E', count: statusBreakdown.Delivered },
              { label: 'Cancelled', color: '#EF4444', count: statusBreakdown.Cancelled }
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: row.color, display: 'inline-block' }}></span>
                  <span style={{ color: '#4B5563' }}>{row.label}</span>
                </div>
                <span style={{ fontWeight: 600, color: '#1A1A1A' }}>{loading ? '...' : row.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #EAEAEA'
      }}>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1A1A1A', marginBottom: '16px' }}>
          <i className="fas fa-trophy" style={{ color: '#1A1A1A', marginRight: '8px' }}></i>
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
          <div className="top-products-row">
            {topProducts.map((product, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '14px',
                border: '1px solid #EAEAEA',
                overflow: 'hidden',
                width: '160px',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ position: 'relative', aspectRatio: '1', background: '#FAFAFA' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => e.target.src = 'https://placehold.co/160x160/f0f0f0/aaa?text=IMG'}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#1A1A1A',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {index + 1}
                  </div>
                </div>
                <div style={{ padding: '10px' }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: '#1A1A1A',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '2px'
                  }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{product.quantity} sold</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1A1A1A', marginTop: '4px' }}>
                    {formatPrice(product.revenue)}
                  </div>
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
