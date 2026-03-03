import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider, useUser } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import TabNavigator from "./navigation/TabNavigator";

function AppContent() {
  const { user } = useUser();

  return (
    <CartProvider user={user}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
