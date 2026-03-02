import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useCart } from "../context/CartContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";
import { orderService } from "../api/categoryApi";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useUser();

  const BGN_TO_EUR = 1.95583;

  const totalAmountBGN = cartItems.reduce((sum, item) => {
    const priceInBGN =
      item.type === "Casco" ? item.price * BGN_TO_EUR : item.price;
    return sum + (priceInBGN || 0);
  }, 0);

  const totalAmountEUR = totalAmountBGN / BGN_TO_EUR;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      const payload = {
        userId: user.id,
        items: cartItems,
        totalBGN: totalAmountBGN.toFixed(2),
        totalEUR: totalAmountEUR.toFixed(2),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await orderService.submitOrder(payload, user.token);
      clearCart();
      Alert.alert("Успех", "Заявката е изпратена!", [
        { text: "ОК", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      Alert.alert("Грешка", "Проблем при изпращането.");
    }
  };

  const renderItem = ({ item }) => {
    const isCasco = item.type === "Casco";
    const currency = isCasco ? "€" : "лв.";

    // Installment Visualization Logic
    let mathString = "";
    const isOneTime = item.plan === "1 вноска";

    if (item.plan === "2 вноски") {
      const remaining = item.price - item.firstPayment;
      mathString = `${item.firstPayment.toFixed(2)} + (1 × ${remaining.toFixed(2)})`;
    } else if (item.plan === "4 вноски") {
      const remainingTotal = item.price - item.firstPayment;
      const otherAmount = remainingTotal / 3;
      mathString = `${item.firstPayment.toFixed(2)} + (3 × ${otherAmount.toFixed(2)})`;
    }

    const secondaryPrice = isCasco
      ? (item.price * BGN_TO_EUR).toFixed(2)
      : (item.price / BGN_TO_EUR).toFixed(2);
    const secondaryCurrency = isCasco ? "лв." : "€";

    return (
      <View style={[styles.itemCard, isCasco && styles.cascoBorder]}>
        <View style={styles.itemInfo}>
          <View
            style={[
              styles.typeBadge,
              isCasco ? styles.cascoBadge : styles.liabilityBadge,
            ]}
          >
            <Text style={styles.typeBadgeText}>
              {isCasco ? "АВТОКАСКО" : "ГРАЖДАНСКА"}
            </Text>
          </View>

          <Text style={styles.companyName}>{item.company}</Text>
          <Text style={styles.planBadge}>{item.plan}</Text>
          <Text style={styles.clientName}>
            {item.firstName} {item.lastName}
          </Text>

          {/* NEW: Installment Visualization */}
          {!isOneTime && (
            <View style={styles.mathContainer}>
              <Text style={styles.mathLabel}>Разбивка на вноските:</Text>
              <Text style={styles.mathValue}>
                {mathString} {currency}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.itemRight}>
          <Text style={styles.priceLabel}>Общо</Text>
          <Text style={styles.priceText}>
            {item.price.toFixed(2)} {currency}
          </Text>
          <Text style={styles.secondaryPriceText}>
            ({secondaryPrice} {secondaryCurrency})
          </Text>

          <TouchableOpacity
            onPress={() => removeFromCart(item.cartId)}
            style={styles.removeBtn}
          >
            <Ionicons name="trash-outline" size={12} color="#FF3B30" />
            <Text style={styles.removeBtnText}>Премахни</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#C7C7CC" />
          <Text style={styles.emptyText}>Количката е празна</Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.browseText}>Разгледай оферти</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.cartId.toString()}
            renderItem={renderItem}
          />
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.footerLabel}>Обща стойност:</Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.footerAmountBGN}>
                  {totalAmountBGN.toFixed(2)} лв.
                </Text>
                <Text style={styles.footerAmountEUR}>
                  {totalAmountEUR.toFixed(2)} €
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>ЗАВЪРШИ ПОРЪЧКАТА</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#8E8E93", marginVertical: 15 },
  browseBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  browseText: { color: "#fff", fontWeight: "bold" },
  itemCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 15,
    flexDirection: "row",
    elevation: 2,
  },
  cascoBorder: { borderLeftWidth: 5, borderLeftColor: "#5856D6" },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  liabilityBadge: { backgroundColor: "#34C759" },
  cascoBadge: { backgroundColor: "#5856D6" },
  typeBadgeText: { color: "#fff", fontSize: 9, fontWeight: "bold" },
  itemInfo: { flex: 1 },
  companyName: { fontSize: 18, fontWeight: "bold", color: "#1C1C1E" },
  planBadge: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 13,
    marginVertical: 4,
  },
  clientName: { color: "#8E8E93", fontSize: 12 },
  mathContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#007AFF",
  },
  mathLabel: {
    fontSize: 9,
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  mathValue: { fontSize: 11, fontWeight: "700", color: "#1C1C1E" },
  itemRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 110,
  },
  priceLabel: { fontSize: 10, color: "#8E8E93" },
  priceText: { fontSize: 18, fontWeight: "800", color: "#1C1C1E" },
  secondaryPriceText: { fontSize: 11, color: "#8E8E93", fontWeight: "500" },
  removeBtn: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  removeBtnText: {
    color: "#FF3B30",
    fontSize: 11,
    fontWeight: "bold",
    marginLeft: 4,
  },
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#E5E5EA",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: { fontSize: 16, color: "#1C1C1E", fontWeight: "700" },
  footerAmountBGN: { fontSize: 24, fontWeight: "900", color: "#1C1C1E" },
  footerAmountEUR: { fontSize: 16, fontWeight: "600", color: "#007AFF" },
  checkoutBtn: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 15,
  },
  checkoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
