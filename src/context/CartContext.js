import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      loadUserCart(user.id);
    } else {
      setCartItems([]);
    }
  }, [user]); 

  const loadUserCart = async (userId) => {
    if (!userId) return;
    try {
      const savedCart = await AsyncStorage.getItem(`cart_${userId}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
      setCartItems([]);
    }
  };

  const addToCart = async (item, userId) => {
    const newCart = [...cartItems, item];
    setCartItems(newCart);
    
    if (userId) {
      try {
        await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      } catch (e) {
        console.error("Failed to save cart to storage:", e);
      }
    }
  };

  const removeFromCart = async (cartId, userId) => {
    const newCart = cartItems.filter(item => item.cartId !== cartId);
    setCartItems(newCart);
    
    if (userId) {
      try {
        await AsyncStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      } catch (e) {
        console.error("Failed to update storage after removal:", e);
      }
    }
  };

  const clearCart = async (userId) => {
    setCartItems([]);
    if (userId) {
      try {
        await AsyncStorage.removeItem(`cart_${userId}`);
      } catch (e) {
        console.error("Failed to delete cart from storage:", e);
      }
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      loadUserCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);