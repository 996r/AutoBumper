import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('@user_cart');
        if (savedCart !== null) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (e) {
        console.error("Failed to load cart", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  
  useEffect(() => {
    const saveCart = async () => {
      if (isLoaded) { 
        try {
          await AsyncStorage.setItem('@user_cart', JSON.stringify(cartItems));
        } catch (e) {
          console.error("Failed to save cart", e);
        }
      }
    };
    saveCart();
  }, [cartItems, isLoaded]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, { ...item, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = async () => {
    setCartItems([]);
    await AsyncStorage.removeItem('@user_cart');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);