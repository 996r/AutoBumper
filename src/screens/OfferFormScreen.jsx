import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { userApi } from "../api/categoryApi";

export default function OfferFormScreen({ route, navigation }) {
  const { selectedOffer } = route.params;
  const { addToCart } = useCart();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const response = await userApi.getProfileByUserId(user.id);
          if (response.data && response.data.length > 0) {
            const profile = response.data[0];
            setFormData({
              firstName: profile.firstName || "",
              lastName: profile.lastName || "",
              phone: profile.phone || "",
            });
          }
        }
      } catch (error) {
        console.error("Error auto-filling form:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleAddToCart = () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.phone.trim()
    ) {
      Alert.alert("Грешка", "Моля, попълнете всички полета.");
      return;
    }

    const cartItem = {
      cartId: Date.now(),
      userId: user?.id,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim(),
      company: selectedOffer.company,
      price: selectedOffer.price,
      firstPayment: selectedOffer.firstPayment,
      plan: selectedOffer.planLabel,
      type: selectedOffer.type || "Liability",
      carValue: selectedOffer.carValue || null,
      ageLabel: selectedOffer.ageLabel || null,
      periodLabel: selectedOffer.periodLabel || null,
    };

    addToCart(cartItem, user?.id);

    let typeLabel = "Офертата";
    if (cartItem.type === "Casco") typeLabel = "Каското";
    if (cartItem.type === "Assistance") typeLabel = "Асистансът";

    Alert.alert("Успех", `${typeLabel} е добавена в количката.`, [
      { text: "Още застраховки", onPress: () => navigation.navigate("Home") },
      { text: "Към количката", onPress: () => navigation.navigate("Cart") },
    ]);
  };

  const getProductInfo = () => {
    switch (selectedOffer.type) {
      case "Casco":
        return { label: "АВТОКАСКО", color: "#5856D6", currency: "€" };
      case "Assistance":
        return { label: "АВТОАСИСТАНС", color: "#FF9500", currency: "лв." };
      default:
        return {
          label: "ГРАЖДАНСКА ОТГОВОРНОСТ",
          color: "#34C759",
          currency: "лв.",
        };
    }
  };

  const productInfo = getProductInfo();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.summaryCard}>
          <View style={[styles.badge, { backgroundColor: productInfo.color }]}>
            <Text style={styles.badgeText}>{productInfo.label}</Text>
          </View>

          <Text style={styles.summaryCompany}>{selectedOffer.company}</Text>

          <Text style={styles.summaryPrice}>
            {(selectedOffer.price || 0).toFixed(2)} {productInfo.currency}
          </Text>

          <Text style={styles.summaryTitle}>
            План: {selectedOffer.planLabel}
          </Text>

          {selectedOffer.type === "Assistance" && (
            <Text style={styles.summaryTitle}>
              {selectedOffer.ageLabel} | {selectedOffer.periodLabel}
            </Text>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.formSectionTitle}>Данни за собственика</Text>

          <Text style={styles.label}>Име</Text>
          <TextInput
            style={styles.input}
            placeholder="Въведете име"
            value={formData.firstName}
            onChangeText={(val) => setFormData({ ...formData, firstName: val })}
          />

          <Text style={styles.label}>Фамилия</Text>
          <TextInput
            style={styles.input}
            placeholder="Въведете фамилия"
            value={formData.lastName}
            onChangeText={(val) => setFormData({ ...formData, lastName: val })}
          />

          <Text style={styles.label}>Телефон</Text>
          <TextInput
            style={styles.input}
            placeholder="08XXXXXXXX"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(val) => setFormData({ ...formData, phone: val })}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  summaryCard: {
    backgroundColor: "#F2F2F7",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },
  badge: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginBottom: 10,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  summaryTitle: { fontSize: 13, color: "#8E8E93", marginTop: 5 },
  summaryCompany: { fontSize: 24, fontWeight: "bold", color: "#1C1C1E" },
  summaryPrice: {
    fontSize: 20,
    color: "#007AFF",
    fontWeight: "700",
    marginTop: 5,
  },
  form: { marginTop: 10 },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1C1C1E",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  btn: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
