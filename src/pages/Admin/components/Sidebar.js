function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'products', label: 'Products', icon: 'fa-box' },
    { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart' },
    { id: 'blog', label: 'Blog', icon: 'fa-newspaper' },
    { id: 'settings', label: 'Settings', icon: 'fa-cog' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '0 0 20px 0'
    }}>
      {/* Logo */}
      <div style={{
        padding: '2rem 1.5rem',
        borderBottom: '1px solid #EAEAEA',
        flexShrink: 0
      }}>
        <div>
          <img src="/icon.png" alt="Ismora" style={{ height: '25px', width: 'auto', display: 'block', marginBottom: '6px' }} />
          <span style={{
            fontSize: '0.65rem',
            color: '#9CA3AF',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '1.5rem 1rem',
        overflowY: 'auto'
      }}>
        <p style={{
          fontSize: '0.65rem',
          color: '#9CA3AF',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0 0.75rem',
          marginBottom: '1rem'
        }}>Main Menu</p>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              data-tab={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '0.8rem 1rem',
                marginBottom: '4px',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isActive ? '#1A1A1A' : 'transparent',
                color: isActive ? 'white' : '#6B7280',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#FAFAFA';
                  e.currentTarget.style.color = '#1A1A1A';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6B7280';
                }
              }}
            >
              <i className={`fas ${item.icon}`} style={{
                width: '20px',
                fontSize: '1.05rem',
                textAlign: 'center'
              }}></i>
              <span style={{
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                flex: 1
              }}>{item.label}</span>
              {isActive && (
                <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem', opacity: 0.6 }}></i>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid #EAEAEA',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0.6rem 0.8rem',
          borderRadius: '10px',
          background: '#FAFAFA'
        }}>
          <i className="fas fa-shield-alt" style={{
            color: '#9CA3AF',
            fontSize: '0.85rem'
          }}></i>
          <span style={{
            fontSize: '0.7rem',
            color: '#9CA3AF'
          }}>v2.0 • Secure</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
