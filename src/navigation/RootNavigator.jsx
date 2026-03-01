import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator, View } from "react-native";


import HomeScreen from "../screens/HomeScreen";
import LiabilityDetailScreen from "../screens/LiabilityDetailScreen";
import CascoDetailScreen from "../screens/CascoDetailScreen";
import AutoAssistanceScreen from "../screens/AutoAssistnaceScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";


import { useUser } from "../context/UserContext";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, logout, loading } = useUser();

  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
  
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: true,
              headerTitle: () => <Text style={styles.brand}>AutoBumper</Text>,
              headerRight: () => (
                <TouchableOpacity onPress={logout} style={styles.brand}>
                  <Text style={styles.brand}>Logout</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen name="Liability" component={LiabilityDetailScreen} options={{ title: "Insurance Offers" }} />
          <Stack.Screen name="Casco" component={CascoDetailScreen} options={{ title: "Full CASCO" }} />
          <Stack.Screen name="Assistance" component={AutoAssistanceScreen} options={{ title: "Auto Assistance" }} />
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