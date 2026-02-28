import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { categoryApi } from "../api";

export default function CascoDetailScreen() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // You'll need to add getCasco() to your api.js later
    // For now, it's a placeholder
    const fetchCasco = async () => {
      try {
        const response = await categoryApi.getCasco(); 
        setOffers(response.data);
      } catch (e) { console.error(e); }
    };
    fetchCasco();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comprehensive CASCO Offers</Text>
      {/* Render your Casco list here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' }
});