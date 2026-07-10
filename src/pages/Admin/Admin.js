import { useState, useEffect } from 'react';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, getDoc, doc } from '../../firebase/config';
import AdminLogin from './AdminLogin';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './Dashboard';
import Products from './Products';
import Orders from './Orders';
import Settings from './Settings';
import BlogManagement from './BlogManagement';

const ADMIN_EMAIL = 'sameerirfangaba@gmail.com';

function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currency, setCurrency] = useState('AED');
  const [currencySymbol, setCurrencySymbol] = useState('AED');
  const [currencyPosition, setCurrencyPosition] = useState('left-space');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const loadCurrency = async () => {
    try {
      const docRef = doc(db, 'settings', 'checkout');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrency(data.currency || 'AED');
        setCurrencyPosition(data.currencyPosition || 'left-space');
        const symbols = { 'USD':'$', 'PKR':'Rs', 'INR':'₹', 'GBP':'£', 'EUR':'€', 'AED':'AED', 'SAR':'SAR', 'CAD':'C$', 'AUD':'A$' };
        setCurrencySymbol(symbols[data.currency || 'AED'] || 'AED');
      }
    } catch (error) {
      console.error('Error loading currency:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadCurrency();
    }
  }, [user]);

  const formatPrice = (price) => {
    const f = Number(price || 0).toFixed(2);
    switch(currencyPosition) {
      case 'left': return `${currencySymbol}${f}`;
      case 'right': return `${f}${currencySymbol}`;
      case 'left-space': return `${currencySymbol} ${f}`;
      case 'right-space': return `${f} ${currencySymbol}`;
      default: return `${currencySymbol}${f}`;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#F9FAFB'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid #E5E7EB',
          borderTopColor: '#1A1A1A',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard formatPrice={formatPrice} />;
      case 'products':
        return <Products formatPrice={formatPrice} />;
      case 'orders':
        return <Orders formatPrice={formatPrice} />;
      case 'blog':
        return <BlogManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard formatPrice={formatPrice} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#F9FAFB',
      position: 'relative'
    }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: '280px',
        background: 'white',
        borderRight: '1px solid #EAEAEA',
        zIndex: 50,
        overflowY: 'auto',
        transition: 'all 0.3s ease'
      }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '280px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <TopNav 
          activeTab={activeTab} 
          userEmail={user?.email} 
          onLogout={handleLogout} 
        />
        <div style={{ 
          padding: '2rem',
          flex: 1
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Admin;