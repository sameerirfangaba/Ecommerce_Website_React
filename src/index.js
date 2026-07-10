import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { ToastProvider } from './context/ToastContext';
import AdSense from './components/AdSense'; // ✅ IMPORT

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
      <SearchProvider>
        <ToastProvider>
          <AdSense /> {/* ✅ ADD THIS */}
          <App />
        </ToastProvider>
      </SearchProvider>
    </CartProvider>
  </React.StrictMode>
);