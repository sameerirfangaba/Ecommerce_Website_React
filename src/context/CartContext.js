import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
        updateCartStats(parsed);
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  const updateCartStats = (items) => {
    const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    setCartCount(count);
    setCartTotal(total);
  };

  const addToCart = (product, quantity = 1, variant = null) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => {
        if (variant) {
          return item.id === product.id && item.variantKey === variant.key;
        }
        return item.id === product.id && !item.variantKey;
      });

      let newCart;
      if (existingIndex !== -1) {
        newCart = [...prevItems];
        newCart[existingIndex].quantity += quantity;
      } else {
        const newItem = {
          id: product.id,
          cartKey: `${product.id}-${Date.now()}`,
          quantity: quantity,
          price: variant ? variant.price : product.price,
          name: product.name,
          image: variant ? variant.image : product.image,
          variantKey: variant ? variant.key : null,
          variantAttrs: variant ? variant.attrs : null,
          stock: variant ? variant.stock : product.stock,
          customText: product.customText || null,
          customTextLabel: product.customTextLabel || null
        };
        newCart = [...prevItems, newItem];
      }

      localStorage.setItem('cart', JSON.stringify(newCart));
      updateCartStats(newCart);
      setIsCartOpen(true);
      window.dispatchEvent(new Event('cartUpdated'));
      return newCart;
    });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const removeFromCart = (cartKey) => {
    setCartItems(prevItems => {
      const newCart = prevItems.filter(item => (item.cartKey || item.id) !== cartKey);
      localStorage.setItem('cart', JSON.stringify(newCart));
      updateCartStats(newCart);
      window.dispatchEvent(new Event('cartUpdated'));
      return newCart;
    });
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartKey);
      return;
    }

    setCartItems(prevItems => {
      const newCart = prevItems.map(item => {
        if ((item.cartKey || item.id) === cartKey) {
          return { ...item, quantity };
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(newCart));
      updateCartStats(newCart);
      window.dispatchEvent(new Event('cartUpdated'));
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    setCartCount(0);
    setCartTotal(0);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};