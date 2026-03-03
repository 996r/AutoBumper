import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LiabilityDetailScreen from "../screens/LiabilityDetailScreen";
import OfferFormScreen from "../screens/OfferFormScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AutoAssistanceScreen from "../screens/AutoAssistnaceScreen";
import CascoDetailScreen from "../screens/CascoDetailScreen";
import CartScreen from "../screens/CartScreen";
import { useUser } from "../context/UserContext"; 
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator, View } from "react-native";
import ProfileScreen from "../screens/ProfileScreen";


const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  const { user, logout } = useUser();
    
  return (
    <Stack.Navigator
    
      screenOptions={{
        headerTitleAlign: 'center',
        headerRight: () => (
          user ? (
            <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
              <Text style={styles.brand}>Logout</Text>
            </TouchableOpacity>
          ) : null
        ),
      }}
    >
      {user ? (
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              
              headerTitle: () => <Text style={styles.brand}>AutoBumper</Text>,
            }}
          />
          <Stack.Screen name="Liability" component={LiabilityDetailScreen} options={{ title: "Liability Offers" }} />
          <Stack.Screen name="Casco" component={CascoDetailScreen} options={{ title: "Full CASCO" }} />
          <Stack.Screen name="Assistance" component={AutoAssistanceScreen} options={{ title: "Auto Assistance" }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ title: "Cart" }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
          <Stack.Screen 
            name="OfferForm" 
            component={OfferFormScreen} 
            options={{ title: "Данни за полица" }} 
          />
        </Stack.Group>
      ) : (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: true, title: "Създай профил" }} 
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  brand: { fontSize: 22, fontWeight: "bold", color: "#007AFF" },
  
});