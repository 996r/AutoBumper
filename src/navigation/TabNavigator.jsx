import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStackNavigator from './HomeStackNavigator';
import CartScreen from '../screens/CartScreen';
import { useCart } from '../context/CartContext';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { cartItems } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = route.name === 'Home' ? 'home' : 'cart';
          if (!focused) iconName += '-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{ headerShown: false, title:'Начало' }} 
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ 
          title: 'Моята Количка',
          tabBarBadge: cartItems.length > 0 ? cartItems.length : null 
        }} 
      />
    </Tab.Navigator>
  );
}