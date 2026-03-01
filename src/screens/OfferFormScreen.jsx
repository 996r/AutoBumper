import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useCart } from '../context/CartContext';

export default function OfferFormScreen({ route, navigation }) {
  const { selectedOffer } = route.params;
  const { addToCart } = useCart();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleAddToCart = () => {
    // 1. Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
      Alert.alert("Грешка", "Моля, попълнете всички полета.");
      return;
    }

    // 2. Create the item object - CRITICAL STEP
    const cartItem = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      company: selectedOffer.company,
      price: selectedOffer.price,          // Total Price
      firstPayment: selectedOffer.firstPayment, // Today's Payment (This MUST exist!)
      plan: selectedOffer.planLabel,
    };

    // 3. Add to Cart
    addToCart(cartItem);

    // 4. Success feedback
    Alert.alert(
      "Успех", 
      "Офертата е добавена в количката.",
      [{ text: "Към количката", onPress: () => navigation.navigate("Cart") }]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Избрана оферта</Text>
          <Text style={styles.summaryCompany}>{selectedOffer.company}</Text>
          <Text style={styles.summaryPrice}>
            {/* Safe check for UI display */}
            {(selectedOffer.price || 0).toFixed(2)} лв. ({selectedOffer.planLabel})
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Име</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Въведете име"
            onChangeText={(val) => setFormData({...formData, firstName: val})}
          />

          <Text style={styles.label}>Фамилия</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Въведете фамилия"
            onChangeText={(val) => setFormData({...formData, lastName: val})}
          />

          <Text style={styles.label}>Телефон</Text>
          <TextInput 
            style={styles.input} 
            placeholder="08XXXXXXXX"
            keyboardType="phone-pad"
            onChangeText={(val) => setFormData({...formData, phone: val})}
          />

          <TouchableOpacity style={styles.btn} onPress={handleAddToCart}>
            <Text style={styles.btnText}>ДОБАВИ В КОЛИЧКАТА</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  summaryCard: { backgroundColor: '#F2F2F7', padding: 20, borderRadius: 15, marginBottom: 25 },
  summaryTitle: { fontSize: 12, color: '#8E8E93', marginBottom: 5 },
  summaryCompany: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
  summaryPrice: { fontSize: 18, color: '#007AFF', fontWeight: '600' },
  form: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#E5E5EA', padding: 15, borderRadius: 10, marginBottom: 20 },
  btn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});