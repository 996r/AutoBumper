import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from "react-native";
import { categoryApi } from "../api/categoryApi";
import { SafeAreaView } from "react-native-safe-area-context";

const AutoAssistanceScreen = () => {
  const [loading, setLoading] = useState(true);
  const [assistanceData, setAssistanceData] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getAssistanceEurope();
        // Guard for data format
        const data = response.data || [];
        setAssistanceData(data);
        
        // Default to the first age group (0-5 years)
        if (data.length > 0) {
          setSelectedAgeGroup(data[0]);
        }
      } catch (error) {
        console.error("API Error:", error);
        Alert.alert("Грешка", "Неуспешно зареждане на данните.");
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Автоасистанс Европа</Text>
        <Text style={styles.headerSubtitle}>Изберете параметри за вашата застраховка</Text>

        {/* 1. Age Group Selection */}
        <Text style={styles.sectionLabel}>Възраст на МПС</Text>
        <View style={styles.ageToggleContainer}>
          {assistanceData.map((group) => (
            <TouchableOpacity
              key={group.age_label}
              style={[
                styles.ageButton,
                selectedAgeGroup?.age_label === group.age_label && styles.activeAgeButton
              ]}
              onPress={() => {
                setSelectedAgeGroup(group);
                setSelectedPeriod(null); // Reset period choice when age changes
              }}
            >
              <Text style={[
                styles.ageButtonText,
                selectedAgeGroup?.age_label === group.age_label && styles.activeAgeText
              ]}>
                {group.age_label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 2. Period Selection List */}
        <Text style={styles.sectionLabel}>Период на валидност</Text>
        <View style={styles.periodContainer}>
          {selectedAgeGroup?.periods.map((period) => (
            <TouchableOpacity
              key={period.label}
              style={[
                styles.periodCard,
                selectedPeriod?.label === period.label && styles.activePeriodCard
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <View style={styles.periodInfo}>
                <Text style={styles.periodLabel}>{period.label}</Text>
                <View style={styles.priceColumn}>
                  <Text style={styles.bgnPrice}>{period.bgn.toFixed(2)} лв.</Text>
                  <Text style={styles.eurPrice}>{period.eur.toFixed(2)} €</Text>
                </View>
              </View>
              {selectedPeriod?.label === period.label && (
                <View style={styles.checkCircle}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Final Order Card */}
        {selectedPeriod && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Общо за плащане:</Text>
              <Text style={styles.summaryTotal}>{selectedPeriod.bgn.toFixed(2)} лв.</Text>
            </View>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => Alert.alert("Успех", "Заявката е приета!")}
            >
              <Text style={styles.ctaButtonText}>ПРОДЪЛЖИ</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#1C1C1E' },
  headerSubtitle: { fontSize: 14, color: '#8E8E93', marginBottom: 20 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#8E8E93', marginBottom: 10, textTransform: 'uppercase' },
  ageToggleContainer: { flexDirection: 'row', backgroundColor: '#E5E5EA', borderRadius: 12, padding: 2, marginBottom: 25 },
  ageButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeAgeButton: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  ageButtonText: { fontSize: 12, fontWeight: '600', color: '#8E8E93' },
  activeAgeText: { color: '#007AFF' },
  periodContainer: { gap: 12 },
  periodCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  activePeriodCard: { borderColor: '#007AFF' },
  periodInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  periodLabel: { fontSize: 15, fontWeight: '600', color: '#1C1C1E', flex: 1, paddingRight: 10 },
  priceColumn: { alignItems: 'flex-end' },
  bgnPrice: { fontSize: 17, fontWeight: '800', color: '#007AFF' },
  eurPrice: { fontSize: 13, color: '#8E8E93' },
  checkCircle: { marginLeft: 10, width: 20, height: 20, borderRadius: 10, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  checkMark: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  summaryCard: { marginTop: 30, backgroundColor: '#FFF', padding: 20, borderRadius: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  summaryText: { fontSize: 16, color: '#1C1C1E' },
  summaryTotal: { fontSize: 24, fontWeight: '900', color: '#007AFF' },
  ctaButton: { backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  ctaButtonText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});

export default AutoAssistanceScreen;