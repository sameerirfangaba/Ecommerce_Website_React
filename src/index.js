import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { BlogProvider } from './context/BlogContext';
import { ToastProvider } from './context/ToastContext';
import AdSense from './components/AdSense'; // ✅ IMPORT

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
      <SearchProvider>
        <BlogProvider>
          <ToastProvider>
            <AdSense /> {/* ✅ ADD THIS */}
            <App />
          </ToastProvider>
        </BlogProvider>
      </SearchProvider>
    </CartProvider>
  </React.StrictMode>
);