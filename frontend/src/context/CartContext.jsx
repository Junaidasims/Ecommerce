import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        // Limit checkout amount by product stock limit
        const newQty = Math.min(existingItem.quantity + quantity, product.stock);
        return prevItems.map((item) => 
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      
      return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) => 
      prevItems.map((item) => {
        if (item.product.id === productId) {
          const maxQty = Math.min(newQuantity, item.product.stock);
          return { ...item, quantity: maxQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartCount, 
      getCartTotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
