import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetSending, setResetSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setError('');
    setResetMessage('');
    if (!email.trim()) {
      setError('Enter your email address above first, then click "Forgot password?"');
      return;
    }
    setResetSending(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetMessage(`Password reset link sent to ${email.trim()}`);
    } catch (err) {
      setError(err.message || 'Could not send reset email. Please try again.');
    }
    setResetSending(false);
  };

  return (
    <div className="admin-login-wrap" style={{
      minHeight: '100vh',
      display: 'flex'
    }}>
      <style>{`
        .admin-login-wrap { }
        .login-brand-panel {
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 860px) {
          .login-brand-panel { display: none !important; }
          .login-form-panel { flex: 1 1 100% !important; }
        }
        .input-group {
          position: relative;
        }
        .input-group .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          transition: color 0.2s;
          z-index: 2;
          font-size: 0.95rem;
        }
        .input-group:focus-within .input-icon {
          color: #1A1A1A;
        }
        .input-group input {
          width: 100%;
          padding: 14px 16px 14px 46px;
          border: 1.5px solid #EAEAEA;
          border-radius: 2px;
          font-size: 0.92rem;
          outline: none;
          transition: all 0.2s;
          background: white;
          color: #1A1A1A;
          font-family: 'DM Sans', sans-serif;
        }
        .input-group input:focus {
          border-color: #1A1A1A;
        }
        .input-group input::placeholder {
          color: #b0b0b0;
        }
        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          z-index: 2;
          font-size: 0.95rem;
          padding: 4px;
        }
        .password-toggle:hover {
          color: #1A1A1A;
        }
        .login-btn {
          width: 100%;
          padding: 15px;
          border-radius: 2px;
          border: none;
          background: #1A1A1A;
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .login-btn:hover:not(:disabled) {
          background: #000000;
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .forgot-link {
          font-size: 0.78rem;
          color: #6B7280;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 500;
          text-decoration: underline;
        }
        .forgot-link:hover {
          color: #1A1A1A;
        }
        .forgot-link:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error-box {
          background: #FEF2F2;
          border-left: 3px solid #ef4444;
          padding: 12px 16px;
          border-radius: 2px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .error-box i { color: #ef4444; font-size: 1rem; margin-top: 1px; }
        .error-box span { color: #991b1b; font-size: 0.82rem; font-weight: 500; }
        .success-box {
          background: #FAFAFA;
          border-left: 3px solid #1A1A1A;
          padding: 12px 16px;
          border-radius: 2px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .success-box i { color: #1A1A1A; font-size: 1rem; margin-top: 1px; }
        .success-box span { color: #1A1A1A; font-size: 0.82rem; font-weight: 500; }
      `}</style>

      {/* Left: Brand panel */}
      <div className="login-brand-panel">
        <img
          src="https://i.ibb.co/rGSQPRLy/ismora-banner.jpg"
          alt="Ismora"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=1400&fit=crop'}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.75) 100%)'
        }}></div>

        <div style={{ position: 'absolute', top: '48px', left: '48px' }}>
          <img src="/icon-white.png" alt="Ismora" style={{ height: '22px', width: 'auto', display: 'block' }} />
        </div>

        <div style={{ position: 'absolute', bottom: '56px', left: '48px', right: '48px' }}>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>Admin Dashboard</p>
          <h1 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 500,
            color: 'white',
            lineHeight: 1.25,
            maxWidth: '420px'
          }}>
            Manage your store, orders and products in one place.
          </h1>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="login-form-panel" style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
        padding: '40px 24px'
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.7rem',
            fontWeight: 700,
            color: '#1A1A1A',
            marginBottom: '6px'
          }}>Sign In</h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '32px' }}>
            Sign in to manage your store
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#1A1A1A',
                marginBottom: '6px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>Email Address</label>
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

            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <label style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>Password</label>
                <button
                  type="button"
                  className="forgot-link"
                  onClick={handleForgotPassword}
                  disabled={resetSending}
                >
                  {resetSending ? 'Sending...' : 'Forgot password?'}
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

            {resetMessage && (
              <div className="success-box" style={{ marginBottom: '16px' }}>
                <i className="fas fa-check-circle"></i>
                <span>{resetMessage}</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="login-btn">
              <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-arrow-right'}`}></i>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '28px',
            fontSize: '0.72rem',
            color: '#9ca3af'
          }}>
            <i className="fas fa-shield-alt"></i>
            <span>Secure encrypted connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
