import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { categoryApi } from "../api/categoryApi"; 
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCard from "../components/CategoryCard";

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAll();
    
      setCategories(response.data); 
    } catch (error) {
      console.error("AutoBumper API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const handlePress = (item) => {
    if (item.id === 1) {
      navigation.navigate("Liability"); 
    } else if (item.id === 2) {
      navigation.navigate("Casco");     
    } else if(item.id === 3) {
      navigation.navigate("Assistance")
    } 
    else {
      console.log("No screen defined for this category yet");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading AutoBumper...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>AutoBumper</Text>
        <Text style={styles.subtitle}>Hit the bumper. Got insurance?</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard
            title={item.name}
            
            onPress={() => handlePress(item)} 
          />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { padding: 20, backgroundColor: "#f8f9fa" },
  brand: { fontSize: 28, fontWeight: "bold", color: "#007AFF" },
  subtitle: { fontSize: 16, color: "#666" },
  list: { padding: 15 },
});