import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const cached = localStorage.getItem('cached_products');
        const cachedTime = localStorage.getItem('cached_products_time');
        const now = Date.now();

        if (cached && cachedTime && now - parseInt(cachedTime) < 300000) {
          setAllProducts(JSON.parse(cached));
          return;
        }

        const snapshot = await getDocs(collection(db, 'products'));
        const products = [];
        snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
        setAllProducts(products);
        localStorage.setItem('cached_products', JSON.stringify(products));
        localStorage.setItem('cached_products_time', now.toString());
      } catch (error) {
        console.error('Error loading products for search:', error);
      }
    };
    loadProducts();
  }, []);

  const searchProducts = (query) => {
    setSearchQuery(query);
    setLoading(true);

    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const results = allProducts.filter(product => {
      const nameMatch = (product.name || '').toLowerCase().includes(lowerQuery);
      const categoryMatch = (product.category || '').toLowerCase().includes(lowerQuery);
      const descMatch = (product.shortDesc || '').toLowerCase().includes(lowerQuery);
      return nameMatch || categoryMatch || descMatch;
    });

    setSearchResults(results.slice(0, 8));
    setShowDropdown(true);
    setLoading(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const value = {
    searchQuery,
    searchResults,
    allProducts,
    loading,
    showDropdown,
    searchProducts,
    clearSearch,
    setShowDropdown
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};