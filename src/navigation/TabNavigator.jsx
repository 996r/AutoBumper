import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStackNavigator from './HomeStackNavigator';
import CartScreen from '../screens/CartScreen';
import { useCart } from '../context/CartContext';
import ProfileScreen from '../screens/ProfileScreen';


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { cartItems } = useCart();

  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
      else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
      else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    headerShown: true, 
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
      <Tab.Screen name="Profile" 
      component={ProfileScreen}
       options={{ title: 'Моят Профил' }} 
       />
    </Tab.Navigator>
  );
}