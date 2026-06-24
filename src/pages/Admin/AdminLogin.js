import { useState } from 'react';

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Animated Background Shapes */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,107,53,0.08)',
        top: '-100px',
        right: '-100px',
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255,107,53,0.06)',
        bottom: '-80px',
        left: '-80px',
        animation: 'float 10s ease-in-out infinite reverse'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255,107,53,0.04)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.6; }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .login-card {
          animation: slideUp 0.6s ease-out;
        }
        .input-group {
          position: relative;
          transition: all 0.3s;
        }
        .input-group:focus-within {
          transform: translateY(-2px);
        }
        .input-group .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          transition: all 0.3s;
          z-index: 2;
          font-size: 1rem;
        }
        .input-group:focus-within .input-icon {
          color: #FF6B35;
        }
        .input-group input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s;
          background: white;
          color: #1a1a2e;
        }
        .input-group input:focus {
          border-color: #FF6B35;
          box-shadow: 0 0 0 4px rgba(255,107,53,0.1);
        }
        .input-group input::placeholder {
          color: #b0b0b0;
        }
        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 2;
          font-size: 1rem;
          padding: 4px;
        }
        .password-toggle:hover {
          color: #FF6B35;
        }
        .login-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #FF6B35, #e55a25);
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255,107,53,0.4);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-btn .btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .error-box {
          background: linear-gradient(135deg, #fef2f2, #fee2e2);
          border-left: 4px solid #ef4444;
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .error-box i {
          color: #ef4444;
          font-size: 1.1rem;
        }
        .error-box span {
          color: #991b1b;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .brand-icon {
          background: linear-gradient(135deg, #FF6B35, #e55a25);
          width: 80px;
          height: 80px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 10px 30px rgba(255,107,53,0.3);
          transition: all 0.3s;
        }
        .brand-icon:hover {
          transform: scale(1.05) rotate(-5deg);
          box-shadow: 0 15px 40px rgba(255,107,53,0.4);
        }
        .brand-icon i {
          color: white;
          font-size: 2.5rem;
        }
        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 20px 0;
        }
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
        }
        .divider span {
          color: #9ca3af;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,107,53,0.1);
          border: 1px solid rgba(255,107,53,0.2);
          color: #FF6B35;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          margin-top: 8px;
        }
      `}</style>

      <div className="login-card" style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        padding: '40px',
        borderRadius: '28px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 32px 64px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="brand-icon">
            <i className="fas fa-store"></i>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1a1a2e',
            marginTop: '8px'
          }}>
            Ismora <span style={{ color: '#FF6B35' }}>Admin</span>
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            marginTop: '4px'
          }}>Sign in to manage your store</p>
          <div className="admin-badge">
            <i className="fas fa-shield-alt"></i>
            Admin Access
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#1a1a2e',
              marginBottom: '6px'
            }}>
              <i className="fas fa-envelope" style={{ marginRight: '6px', color: '#FF6B35', fontSize: '0.8rem' }}></i>
              Email Address
            </label>
            <div className="input-group">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px'
            }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1a1a2e'
              }}>
                <i className="fas fa-lock" style={{ marginRight: '6px', color: '#FF6B35', fontSize: '0.8rem' }}></i>
                Password
              </label>
              <button
                type="button"
                style={{
                  fontSize: '0.75rem',
                  color: '#FF6B35',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Forgot password?
              </button>
            </div>
            <div className="input-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="error-box" style={{ marginBottom: '16px' }}>
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            <div className="btn-shimmer"></div>
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sign-in-alt'}`}></i>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="divider">
            <span>Secure Access</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '0.75rem',
            color: '#9ca3af'
          }}>
            <i className="fas fa-shield-alt" style={{ color: '#22c55e' }}></i>
            <span>256-bit encrypted connection</span>
          </div>
        </form>
      </div>

      {/* Footer Branding */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.2)',
        fontSize: '0.75rem',
        textAlign: 'center',
        zIndex: 1
      }}>
        <i className="fas fa-store" style={{ marginRight: '4px' }}></i>
        Ismora Admin Panel v2.0
      </div>
    </div>
  );
}

export default AdminLogin;