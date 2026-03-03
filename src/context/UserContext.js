import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setCartItems} from './CartContext'


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  
useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const token = await AsyncStorage.getItem('userToken');
        const storedId = await AsyncStorage.getItem('userId'); 
        
        if (storedEmail && token && storedId) {
          
          setUser({ 
            email: storedEmail, 
            token: token, 
            id: Number(storedId) 
          });
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    
    await AsyncStorage.setItem('userToken', userData.token);
    await AsyncStorage.setItem('userEmail', userData.email);
    await AsyncStorage.setItem('userId', String(userData.id)); 
  };

  const updateUser = async (newData) => {
    setUser(newData);
    await AsyncStorage.setItem('@user_data', JSON.stringify(newData));
  };

  const logout = async () => {
    setUser(null);
    
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userId');
    navigation.navigate("Login");
  
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser ,loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);