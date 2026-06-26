import { useState, useEffect } from 'react';

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: {
      bg: '#dcfce7',
      border: '#22c55e',
      icon: '#22c55e',
      text: '#166534'
    },
    error: {
      bg: '#fee2e2',
      border: '#ef4444',
      icon: '#ef4444',
      text: '#991b1b'
    },
    warning: {
      bg: '#fef3c7',
      border: '#f59e0b',
      icon: '#f59e0b',
      text: '#92400e'
    },
    info: {
      bg: '#dbeafe',
      border: '#3b82f6',
      icon: '#3b82f6',
      text: '#1e40af'
    }
  };

  const style = colors[type] || colors.success;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      animation: 'slideInRight 0.4s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        background: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: `1px solid ${style.border}`,
        minWidth: '320px',
        maxWidth: '480px',
        position: 'relative'
      }}>
        {/* Icon */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: style.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <i className={`fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`} 
             style={{ color: style.icon, fontSize: '1.2rem' }}></i>
        </div>

        {/* Message */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 600,
            color: style.text,
            fontSize: '0.95rem',
            marginBottom: '2px'
          }}>
            {type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : type === 'warning' ? 'Warning!' : 'Info'}
          </div>
          <div style={{
            color: '#4a4a68',
            fontSize: '0.85rem',
            lineHeight: '1.4'
          }}>
            {message}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) setTimeout(onClose, 300);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '1.1rem',
            padding: '4px',
            transition: 'color 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#6b7280'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Progress Bar */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '3px',
          background: style.border,
          borderRadius: '0 0 12px 12px',
          animation: `shrink ${duration}ms linear forwards`
        }}></div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export default Toast;