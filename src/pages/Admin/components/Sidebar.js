function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'products', label: 'Products', icon: 'fa-box' },
    { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart' },
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
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: '#FF6B35',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
          }}>
            <i className="fas fa-store" style={{ color: 'white', fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'white',
              display: 'block',
              lineHeight: 1.2
            }}>Ismora</span>
            <span style={{
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>Admin Panel</span>
          </div>
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
          color: 'rgba(255,255,255,0.3)',
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
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '0.8rem 1rem',
                marginBottom: '4px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: isActive ? '#FF6B35' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                boxShadow: isActive ? '0 4px 16px rgba(255,107,53,0.3)' : 'none',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                }
              }}
            >
              <i className={`fas ${item.icon}`} style={{
                width: '20px',
                fontSize: '1.1rem',
                textAlign: 'center'
              }}></i>
              <span style={{
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem'
              }}>{item.label}</span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  right: '8px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'white',
                  opacity: 0.5
                }}></div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0.6rem 0.8rem',
          borderRadius: '10px',
          background: 'rgba(255,255,255,0.04)'
        }}>
          <i className="fas fa-shield-alt" style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.85rem'
          }}></i>
          <span style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.3)'
          }}>v2.0 • Secure</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;