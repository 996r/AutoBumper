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
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userApi } from "../api/categoryApi";
import { useUser } from "../context/UserContext";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    carMake: "",
    carModel: "",
    carYear: "",
  });

  useEffect(() => {
    if (user && user.id) {
      loadProfileData();
      loadStoredImage();
    } else {
      setProfile({
        firstName: "",
        lastName: "",
        phone: "",
        carMake: "",
        carModel: "",
        carYear: "",
      });
      setProfileImage(null);
    }
  }, [user]);

  const loadStoredImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem(`profile_pic_${user.id}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (e) {
      console.log("Error loading image", e);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Грешка", "Трябва да разрешите достъп до камерата.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);

      await AsyncStorage.setItem(`profile_pic_${user.id}`, uri);
    }
  };

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await userApi.getProfileByUserId(user.id);
      if (response.data && response.data.length > 0) {
        setProfile(response.data[0]);
      } else {
        setProfile((prev) => ({ ...prev, userId: user.id }));
      }
    } catch (error) {
      console.error("Profile Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const profileData = { ...profile, userId: user.id };
      if (profile.id) {
        await userApi.updateProfile(profile.id, profileData);
      } else {
        const res = await userApi.createProfile(profileData);
        setProfile(res.data);
      }
      Alert.alert("Успех", "Профилът е обновен успешно!");
    } catch (error) {
      Alert.alert("Грешка", "Неуспешно записване на данните.");
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
      <View style={styles.imageSection}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color="#8E8E93" />
            </View>
          )}
          <View style={styles.editIconBadge}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.imageHint}>Снимай за профилна снимка</Text>
      </View>

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
        style={[styles.saveBtn, saving && { backgroundColor: "#ccc" }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>
          {saving ? "ЗАПАЗВАНЕ..." : "ЗАПАЗИ ПРОФИЛА"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageSection: { alignItems: "center", marginBottom: 25, marginTop: 10 },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 4,
    borderColor: "#fff",
    elevation: 5,
  },
  profileImage: { width: 112, height: 112, borderRadius: 56 },
  imagePlaceholder: { alignItems: "center" },
  imageHint: {
    marginTop: 10,
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "500",
  },
  editIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#007AFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#007AFF",
    marginBottom: 15,
  },
  label: {
    fontSize: 11,
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 4,
    fontWeight: "700",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
    color: "#1C1C1E",
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
