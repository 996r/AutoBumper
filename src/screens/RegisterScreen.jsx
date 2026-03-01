import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/categoryApi';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Грешка", "Моля попълнете всички полета");
      return;
    }

    try {
      const response = await authApi.register({ email, password });
      const { accessToken } = response.data;

      await AsyncStorage.setItem('userToken', accessToken);
      
      Alert.alert("Успех", "Регистрацията е успешна!");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Грешка", "Потребителят вече съществува или сървърът е офлайн");
    }
  };

  return (
    <View style={styles.container}>
       <Image 
                  source={require('../../assets/AutoBumperLogo.png')} 
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
  input: { backgroundColor: '#f2f2f7', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#34c759', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
   logo: {
    width: '100%',      
    height: 200,        
    alignSelf: 'center',
    marginBottom: 20,   
  },
});

export default RegisterScreen;