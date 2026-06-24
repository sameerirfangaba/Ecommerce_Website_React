function TopNav({ activeTab, userEmail, onLogout }) {
  const tabNames = {
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    settings: 'Settings'
  };

  return (
    <div style={{
      background: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      borderBottom: '1px solid #f0f0f0',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#1a1a2e',
          letterSpacing: '-0.02em'
        }}>
          {tabNames[activeTab] || 'Dashboard'}
        </h1>
        <span style={{
          fontSize: '0.65rem',
          padding: '2px 10px',
          borderRadius: '20px',
          background: '#f3f4f6',
          color: '#6b7280',
          fontWeight: 500
        }}>
          {activeTab}
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0.4rem 1rem',
          borderRadius: '10px',
          background: '#f8f8fc',
          border: '1px solid #f0f0f0'
        }}>
          <i className="fas fa-user-circle" style={{ color: '#6b7280', fontSize: '1.1rem' }}></i>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: '#1a1a2e'
          }}>{userEmail || 'Admin'}</span>
        </div>

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.5rem 1.2rem',
            borderRadius: '10px',
            border: 'none',
            background: '#1a1a2e',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.85rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2d2d4e';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1a1a2e';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </div>
  );
}

export default TopNav;