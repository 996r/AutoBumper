import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const token = await AsyncStorage.getItem('userToken');
        
        if (storedEmail && token) {
          setUser({ email: storedEmail, token });
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
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userEmail');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);