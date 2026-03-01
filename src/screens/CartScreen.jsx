import React from 'react-native';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
   } from 'react-native';
import { useCart } from '../context/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { orderService } from '../api/categoryApi';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useUser();

  
const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
const totalDueToday = cartItems.reduce((sum, item) => sum + (item.firstPayment || 0), 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const payload = {
        userId: user.id,
        items: cartItems,
        totalOrderValue: totalAmount,
        dueToday: totalDueToday,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      await orderService.submitOrder(payload, user.token);
      clearCart();
      
      Alert.alert(
        "Заявката е изпратена!", 
        "Наш консултант ще се свърже с Вас за потвърждение.",
        [{ text: "Към Начало", onPress: () => navigation.navigate("Home") }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Грешка", "Възникна проблем при изпращането.");
    }
  };

  const renderItem = ({ item }) => {
    const isOneTime = item.plan === '1 вноска';
    const isTwoInstallments = item.plan === '2 вноски';
    const isFourInstallments = item.plan === '4 вноски';

    
    let mathString = "";
    if (isTwoInstallments) {
      const remaining = item.price - item.firstPayment;
      mathString = `${item.firstPayment.toFixed(2)} + (1 × ${remaining.toFixed(2)})`;
    } else if (isFourInstallments) {
      const remainingTotal = item.price - item.firstPayment;
      const otherAmount = remainingTotal / 3;
      mathString = `${item.firstPayment.toFixed(2)} + (3 × ${otherAmount.toFixed(2)})`;
    }

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          <Text style={styles.companyName}>{item.company}</Text>
          <Text style={styles.planBadge}>{item.plan}</Text>
          <Text style={styles.clientName}>{item.firstName} {item.lastName}</Text>
          
          {!isOneTime && (
            <View style={styles.mathContainer}>
              <Text style={styles.mathLabel}>Разбивка на вноските:</Text>
              <Text style={styles.mathValue}>{mathString} лв.</Text>
            </View>
          )}
        </View>
        
        <View style={styles.itemRight}>
          <Text style={styles.priceLabel}>Общо</Text>
          <Text style={styles.priceText}>{item.price.toFixed(2)} лв.</Text>
          
          <TouchableOpacity 
            onPress={() => removeFromCart(item.cartId)}
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
    <SafeAreaView style={styles.container}>
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
            keyExtractor={item => item.cartId.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.footerLabel}>Дължими днес:</Text>
              <Text style={styles.footerAmountToday}>{totalDueToday.toFixed(2)} лв.</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.footerLabelSmall}>Обща стойност на полиците:</Text>
              <Text style={styles.footerAmountTotal}>{totalAmount.toFixed(2)} лв.</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>ЗАВЪРШИ ПОРЪЧКАТА</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, color: '#8E8E93', marginTop: 10, marginBottom: 20 },
  browseBtn: { backgroundColor: '#007AFF', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  browseText: { color: '#fff', fontWeight: 'bold' },
  
  itemCard: { 
    backgroundColor: '#fff', 
    marginHorizontal: 16, 
    marginTop: 12, 
    padding: 16, 
    borderRadius: 15, 
    flexDirection: 'row',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 
  },
  itemInfo: { flex: 1 },
  companyName: { fontSize: 18, fontWeight: 'bold', color: '#1C1C1E' },
  planBadge: { color: '#007AFF', fontWeight: '600', fontSize: 13, marginVertical: 4 },
  clientName: { color: '#8E8E93', fontSize: 12 },
  
  mathContainer: { 
    marginTop: 10, 
    padding: 8, 
    backgroundColor: '#F2F2F7', 
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF'
  },
  mathLabel: { fontSize: 10, color: '#8E8E93', textTransform: 'uppercase', marginBottom: 2 },
  mathValue: { fontSize: 12, fontWeight: '600', color: '#1C1C1E' },

  itemRight: { alignItems: 'flex-end', justifyContent: 'center', minWidth: 100 },
  priceLabel: { fontSize: 10, color: '#8E8E93', textTransform: 'uppercase' },
  priceText: { fontSize: 18, fontWeight: '800', color: '#1C1C1E' },
  
  removeBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF5F5', 
    paddingVertical: 5, 
    paddingHorizontal: 8, 
    borderRadius: 6, 
    marginTop: 10 
  },
  removeBtnText: { color: '#FF3B30', fontSize: 11, fontWeight: 'bold', marginLeft: 4 },

  footer: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderTopWidth: 1, 
    borderColor: '#E5E5EA',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 10
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  footerLabel: { fontSize: 16, color: '#1C1C1E', fontWeight: '600' },
  footerAmountToday: { fontSize: 20, fontWeight: '800', color: '#007AFF' },
  footerLabelSmall: { fontSize: 13, color: '#8E8E93' },
  footerAmountTotal: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
  
  checkoutBtn: { 
    backgroundColor: '#007AFF', 
    padding: 18, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 15 
  },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});