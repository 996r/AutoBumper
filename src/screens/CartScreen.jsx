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
      Alert.alert("Успех", "Заявката е изпратена успешно!", [
        { text: "ОК", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (error) {
      Alert.alert("Грешка", "Проблем при изпращането на поръчката.");
    }
  };

  const renderItem = ({ item }) => {
    const isCasco = item.type === "Casco";
    const isAssistance = item.type === "Assistance";
    const currency = isCasco ? "€" : "лв.";

    let badgeTitle = "ГРАЖДАНСКА";
    let badgeStyle = styles.liabilityBadge;
    let cardBorderStyle = null;

    if (isCasco) {
      badgeTitle = "АВТОКАСКО";
      badgeStyle = styles.cascoBadge;
      cardBorderStyle = styles.cascoBorder;
    } else if (isAssistance) {
      badgeTitle = "АВТОАСИСТАНС";
      badgeStyle = styles.assistanceBadge;
      cardBorderStyle = styles.assistanceBorder;
    }

    let mathString = "";
    const isOneTime = item.plan === "1 вноска";

    if (item.plan === "2 вноски" && item.firstPayment) {
      const remaining = item.price - item.firstPayment;
      mathString = `${item.firstPayment.toFixed(2)} + (1 × ${remaining.toFixed(2)})`;
    } else if (item.plan === "4 вноски" && item.firstPayment) {
      const remainingTotal = item.price - item.firstPayment;
      const otherAmount = remainingTotal / 3;
      mathString = `${item.firstPayment.toFixed(2)} + (3 × ${otherAmount.toFixed(2)})`;
    }

    const secondaryPrice = isCasco
      ? (item.price * BGN_TO_EUR).toFixed(2)
      : (item.price / BGN_TO_EUR).toFixed(2);
    const secondaryCurrency = isCasco ? "лв." : "€";

    return (
      <View style={[styles.itemCard, cardBorderStyle]}>
        <View style={styles.itemInfo}>
          <View style={[styles.typeBadge, badgeStyle]}>
            <Text style={styles.typeBadgeText}>{badgeTitle}</Text>
          </View>

          <Text style={styles.companyName}>{item.company}</Text>
          <Text style={styles.planBadge}>{item.plan}</Text>

          <Text style={styles.clientName}>
            <Ionicons name="person-outline" size={12} /> {item.firstName}{" "}
            {item.lastName}
          </Text>

          {isAssistance && item.periodLabel && (
            <Text style={styles.paramsText}>
              {item.ageLabel} | {item.periodLabel}
            </Text>
          )}

          {!isOneTime && mathString !== "" && (
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
            onPress={() => removeFromCart(item.cartId, user.id)}
            style={styles.removeBtn}
          >
            <Ionicons name="trash-outline" size={14} color="#FF3B30" />
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
            <Text style={styles.browseText}>РАЗГЛЕДАЙ ОФЕРТИ</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.cartId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
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
  emptyText: {
    fontSize: 18,
    color: "#8E8E93",
    marginVertical: 15,
    fontWeight: "500",
  },
  browseBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 35,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  browseText: { color: "#fff", fontWeight: "900", letterSpacing: 0.5 },

  itemCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cascoBorder: { borderLeftWidth: 6, borderLeftColor: "#5856D6" },
  assistanceBorder: { borderLeftWidth: 6, borderLeftColor: "#FF9500" },

  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  liabilityBadge: { backgroundColor: "#34C759" },
  cascoBadge: { backgroundColor: "#5856D6" },
  assistanceBadge: { backgroundColor: "#FF9500" },
  typeBadgeText: { color: "#fff", fontSize: 10, fontWeight: "900" },

  itemInfo: { flex: 1 },
  companyName: { fontSize: 19, fontWeight: "800", color: "#1C1C1E" },
  planBadge: {
    color: "#007AFF",
    fontWeight: "700",
    fontSize: 13,
    marginVertical: 4,
  },
  clientName: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  paramsText: {
    fontSize: 11,
    color: "#8E8E93",
    fontStyle: "italic",
    marginBottom: 5,
  },

  mathContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  mathLabel: {
    fontSize: 9,
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 3,
    fontWeight: "700",
  },
  mathValue: { fontSize: 12, fontWeight: "800", color: "#1C1C1E" },

  itemRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 120,
  },
  priceLabel: {
    fontSize: 10,
    color: "#8E8E93",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  priceText: { fontSize: 20, fontWeight: "900", color: "#1C1C1E" },
  secondaryPriceText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "600",
    marginTop: 2,
  },

  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  removeBtnText: {
    color: "#FF3B30",
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 4,
  },

  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#E5E5EA",
    paddingBottom: Platform.OS === "ios" ? 40 : 25,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  footerLabel: { fontSize: 17, color: "#1C1C1E", fontWeight: "800" },
  footerAmountBGN: { fontSize: 28, fontWeight: "900", color: "#1C1C1E" },
  footerAmountEUR: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
    marginTop: 2,
  },

  checkoutBtn: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
