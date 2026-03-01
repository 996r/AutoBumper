import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { userApi } from "../api/categoryApi"; 
import { useUser } from "../context/UserContext";

export default function ProfileScreen() {
  const { user } = useUser(); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    carMake: "",
    carModel: "",
    carYear: "",
  });

  useEffect(() => {
    if (user?.id) {
      loadProfileData();
      
    }
  }, [user?.id]);

  const loadProfileData = async () => {
    try {
      const response = await userApi.getProfileByUserId(user.id);
     
      if (response.data && response.data.length > 0) {
        setProfile(response.data[0]); 
      }
    } catch (error) {
      console.error("Error fetching profile from db.json:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
  
  if (!user?.id) {
    Alert.alert("Error", "You must be logged in to save a profile.");
    return;
  }

  setSaving(true);
  try {
    const profileData = { 
      ...profile, 
      userId: user.id 
    };

    if (profile.id) {
      
      await userApi.updateProfile(profile.id, profileData);
      Alert.alert("Success", "Profile updated!");
    } else {
      
      const res = await userApi.createProfile(profileData);
      
      setProfile(res.data); 
      Alert.alert("Success", "Profile created!");
    }
  } catch (error) {
    console.log("Server error details:", error.response?.data);
    Alert.alert("Error", "Server failed to process the request.");
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Лична Информация</Text>
        
        <Text style={styles.label}>Име</Text>
        <TextInput
          style={styles.input}
          value={profile.firstName}
          onChangeText={(t) => setProfile({ ...profile, firstName: t })}
          placeholder="Георги"
        />

        <Text style={styles.label}>Фамилия</Text>
        <TextInput
          style={styles.input}
          value={profile.lastName}
          onChangeText={(t) => setProfile({ ...profile, lastName: t })}
          placeholder="Иванов"
        />

        <Text style={styles.label}>Телефон</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={profile.phone}
          onChangeText={(t) => setProfile({ ...profile, phone: t })}
          placeholder="0888 000 000"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Данни за Колата</Text>
        
        <Text style={styles.label}>Марка</Text>
        <TextInput
          style={styles.input}
          value={profile.carMake}
          onChangeText={(t) => setProfile({ ...profile, carMake: t })}
          placeholder="напр. Audi"
        />

        <Text style={styles.label}>Модел</Text>
        <TextInput
          style={styles.input}
          value={profile.carModel}
          onChangeText={(t) => setProfile({ ...profile, carModel: t })}
          placeholder="напр. A4"
        />

        <Text style={styles.label}>Година</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={profile.carYear}
          onChangeText={(t) => setProfile({ ...profile, carYear: t })}
          placeholder="2020"
        />
      </View>

      <TouchableOpacity 
        style={[styles.saveBtn, saving && { backgroundColor: '#ccc' }]} 
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>
          {saving ? "ЗАПАЗВАНЕ..." : "ЗАПАЗИ ПРОФИЛА"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  section: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#007AFF", marginBottom: 15 },
  label: { fontSize: 12, color: "#8E8E93", textTransform: 'uppercase', marginBottom: 4 },
  input: { borderBottomWidth: 1, borderBottomColor: "#E5E5EA", paddingVertical: 8, marginBottom: 15, fontSize: 16 },
  saveBtn: { backgroundColor: "#007AFF", padding: 16, borderRadius: 10, alignItems: "center", marginBottom: 40 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});