import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './context/UserContext';
import RootNavigator from './navigation/RootNavigator';
import { CartProvider } from './context/CartContext';
import TabNavigator from './navigation/TabNavigator';

export default function App() {
  
  
  return (
   <UserProvider>
      <CartProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </CartProvider>
    </UserProvider>
  );
}