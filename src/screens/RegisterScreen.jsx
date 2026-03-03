import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../api/categoryApi";
import { useUser } from "../context/UserContext";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Грешка", "Моля попълнете всички полета");
      return;
    }

    try {
      const response = await authApi.register({ email, password });
      const { accessToken, user } = response.data;

      if (!user || !user.id) {
        throw new Error("User ID is missing from server response");
      }

      await AsyncStorage.setItem("userToken", accessToken);
      await AsyncStorage.setItem("userId", user.id.toString());

      setUser({
        id: user.id,
        email: user.email,
        token: accessToken,
      });

      Alert.alert("Успех", "Регистрацията е успешна!");
    } catch (error) {
      console.error("Register Error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Потребителят вече съществува или сървърът е офлайн";
      Alert.alert("Грешка", errorMsg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../../assets/AutoBumperLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Регистрация</Text>

          <TextInput
            placeholder="Имейл"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Парола"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>СЪЗДАЙ ПРОФИЛ</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 40 },
  input: {
    backgroundColor: "#f2f2f7",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#34c759",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  logo: {
    width: "100%",
    height: 180,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default RegisterScreen;
