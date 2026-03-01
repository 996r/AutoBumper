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


const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {

    const { user, logout, loading } = useUser();
    
  return (
    <Stack.Navigator>
      { user ? (
  
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: true,
              headerTitle: () => <Text style={styles.brand}>AutoBumper</Text>,
           
              headerTitleAlign: 'center',
              headerRight: () => (
                <TouchableOpacity onPress={logout} style={styles.brand}>
                  <Text style={styles.brand}>Logout</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen name="Liability" component={LiabilityDetailScreen} options={{ title: "Liability Offers" }} />
          <Stack.Screen name="Casco" component={CascoDetailScreen} options={{ title: "Full CASCO" }} />
          <Stack.Screen name="Assistance" component={AutoAssistanceScreen} options={{ title: "Auto Assistance" }} />
          <Stack.Screen name= "Cart" component={CartScreen} options={{title:"Cart"}} />
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  brand: { fontSize: 22, fontWeight: "bold", color: "#007AFF" },
 
});