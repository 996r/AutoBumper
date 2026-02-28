import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { categoryApi } from "../api/categoryApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';

export default function LiabilityDetailScreen() {
  const route = useRoute();
  const { id } = route.params || {};
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
   const [selectedTab, setSelectedTab] = useState('one_time'); 

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await categoryApi.getCategoryDetails(id);
      
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching liability offers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [id]);

  const renderOffer = ({ item }) => {
    const paymentPlan = item[selectedTab];

    return (
      <View style={styles.offerCard}>
        <View style={styles.leftContent}>
          <Text style={styles.companyName}>{item.company}</Text>
          
          {paymentPlan ? (
            <View>
              <Text style={styles.priceText}>
                {/* Check if it's one_time (bgn) or installment (total_bgn) */}
                {selectedTab === 'one_time' ? paymentPlan.bgn.toFixed(2) : paymentPlan.total_bgn.toFixed(2)} лв.
              </Text>
              {selectedTab !== 'one_time' && (
                <Text style={styles.subText}>1-ва вноска: {paymentPlan.first_bgn.toFixed(2)} лв.</Text>
              )}
            </View>
          ) : (
            <Text style={styles.unavailableText}>Не се предлага</Text>
          )}
        </View>

        <TouchableOpacity style={[styles.selectButton, !paymentPlan && { backgroundColor: '#ccc' }]} disabled={!paymentPlan}>
          <Text style={styles.buttonText}>Избери</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007AFF" />;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      
      <View style={styles.tabContainer}>
        {[
          { id: 'one_time', label: '1 вноска' },
          { id: 'installments_2', label: '2 вноски' },
          { id: 'installments_4', label: '4 вноски' },
        ].map((tab) => (
          <TouchableOpacity 
            key={tab.id} 
            style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[styles.tabLabel, selectedTab === tab.id && styles.activeTabLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.company}
        renderItem={renderOffer}
        contentContainerStyle={{ padding: 15 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E5EA' },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#E5E5EA' },
  activeTab: { backgroundColor: '#007AFF' },
  tabLabel: { fontSize: 13, color: '#3A3A3C' },
  activeTabLabel: { color: '#fff', fontWeight: 'bold' },
  offerCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", elevation: 2 },
  leftContent: { flex: 1 },
  companyName: { fontSize: 17, fontWeight: "700", color: "#1C1C1E", marginBottom: 5 },
  priceText: { fontSize: 20, fontWeight: "800", color: "#007AFF" },
  subText: { fontSize: 12, color: "#8E8E93", marginTop: 2 },
  unavailableText: { fontSize: 14, color: "#8E8E93", fontStyle: "italic" },
  selectButton: { backgroundColor: "#007AFF", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "700" },
});