import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { categoryApi } from "../api/categoryApi";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CascoDetailScreen() {
  
  const [carValue, setCarValue] = useState("");
  const [rates, setRates] = useState([]); 
  const [ageGroups, setAgeGroups] = useState([]);
  const [selectedAge, setSelectedAge] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
  
        const [configRes, ageRes] = await Promise.all([
          categoryApi.getCasco(),
          categoryApi.getAgeGroups()
        ]);

  
        const ratesData = configRes.data || [];
        const agesData = ageRes.data || [];

        setRates(ratesData);
        setAgeGroups(agesData);
        
  
        if (agesData.length > 0) {
          setSelectedAge(agesData[0]);
        }
      } catch (error) {
        console.error("Error loading Casco configuration:", error);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  
  useEffect(() => {
    const value = parseFloat(carValue);

  
    if (!rates || !Array.isArray(rates) || rates.length === 0 || isNaN(value) || value < 1000) {
      setOffers([]);
      return;
    }

    const calculatedResults = rates.map((item) => {
  
      const multiplier = selectedAge ? selectedAge.multiplier : 1.0;
      const basePremium = value * item.rate * multiplier;
      
  
      const finalPremium = Math.max(basePremium, item.min_premium);

      return {
        ...item,
        totalPrice: finalPremium,
        serviceType: selectedAge ? selectedAge.service : "Стандартен",
        installments_4: (finalPremium * 1.05) / 4 
      };
    });

    setOffers(calculatedResults);
  }, [carValue, selectedAge, rates]);

  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Зареждане на тарифи...</Text>
      </View>
    );
  }

  
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        
  
        <View style={styles.headerCard}>
          <Text style={styles.label}>Стойност на автомобила (EUR)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="напр. 15000"
            placeholderTextColor="#C7C7CC"
            value={carValue}
            onChangeText={setCarValue}
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Възраст на автомобила</Text>
          <View style={styles.agePicker}>
            {ageGroups.map((group) => (
              <TouchableOpacity 
                key={group.label}
                style={[
                  styles.ageOption, 
                  selectedAge?.label === group.label && styles.activeAge
                ]}
                onPress={() => setSelectedAge(group)}
              >
                <Text style={[
                  styles.ageText, 
                  selectedAge?.label === group.label && styles.activeAgeText
                ]}>
                  {group.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

  
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
          ListEmptyComponent={
            carValue.length > 0 && parseFloat(carValue) < 1000 ? (
              <Text style={styles.emptyText}>Минималната сума за Каско е 1,000 EUR</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.companyName}>{item.company}</Text>
                  <Text style={styles.serviceTag}>🛠 {item.serviceType}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.priceText}>{item.totalPrice.toFixed(2)} €</Text>
                  <Text style={styles.yearText}>за 1 година</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.cardFooter}>
                <Text style={styles.installmentText}>
                  Вноски: <Text style={{fontWeight: '700'}}>4 x {item.installments_4.toFixed(2)} €</Text>
                </Text>
                <TouchableOpacity style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>Избери</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#8E8E93' },
  headerCard: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderBottomLeftRadius: 24, 
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10
  },
  label: { fontSize: 13, fontWeight: '700', color: '#8E8E93', marginBottom: 8, textTransform: 'uppercase' },
  input: { 
    backgroundColor: '#F2F2F7', 
    padding: 16, 
    borderRadius: 14, 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#007AFF' 
  },
  agePicker: { flexDirection: 'row', backgroundColor: '#F2F2F7', borderRadius: 12, padding: 4 },
  ageOption: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeAge: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  ageText: { fontSize: 12, color: '#8E8E93', fontWeight: '600' },
  activeAgeText: { color: '#007AFF', fontWeight: 'bold' },
  resultCard: { backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  companyName: { fontSize: 18, fontWeight: '800', color: '#1C1C1E' },
  serviceTag: { fontSize: 12, color: '#007AFF', marginTop: 4, fontWeight: '600' },
  priceText: { fontSize: 24, fontWeight: '900', color: '#1C1C1E' },
  yearText: { fontSize: 11, color: '#8E8E93' },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginVertical: 15 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  installmentText: { fontSize: 13, color: '#3A3A3C' },
  buyButton: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  buyButtonText: { color: '#fff', fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#FF3B30', fontWeight: '600' }
});