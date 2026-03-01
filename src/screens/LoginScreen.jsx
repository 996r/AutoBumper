import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { useUser } from '../context/UserContext';
import { authApi } from '../api/categoryApi';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  
  const { login } = useUser();

  const handleLogin = async () => {
  
    if (!email || !password) {
      Alert.alert("Грешка", "Моля, попълнете всички полета");
      return;
    }

    setLoading(true);

    try {
  
      const response = await authApi.login({ email, password });
      const { accessToken, user } = response.data;


      await login({ 
        email: user.email, 
        token: accessToken,
        id: user.id 
      });


      navigation.replace("Home"); 
    } catch (error) {
      console.log("Login Error Detail:", error.response?.data || error.message);
      
      let errorMsg = "Невалиден имейл или парола";
      if (error.message === "Network Error") {
        errorMsg = "Няма връзка със сървъра. Проверете IP адреса.";
      }
      
      Alert.alert("Грешка", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        
        <Image 
          source={require('../../assets/AutoBumperLogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Имейл" 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#a1a1a1"
          />
          
          <TextInput 
            placeholder="Парола" 
            style={styles.input} 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword}
            placeholderTextColor="#a1a1a1"
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>ВЛЕЗ</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate("Register")}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>
            Нямате профил? <Text style={styles.linkTextBold}>Регистрирайте се</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: '100%',      
    height: 200,        
    alignSelf: 'center',
    marginBottom: 20,   
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    color: '#1c1c1e',
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: { 
    backgroundColor: '#f2f2f7', 
    padding: 18, 
    borderRadius: 12, 
    marginBottom: 16,
    fontSize: 16,
    color: '#000'
  },
  button: { 
    backgroundColor: '#007aff', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#a2cbff',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  linkContainer: {
    marginTop: 25,
  },
  linkText: { 
    color: '#8e8e93', 
    textAlign: 'center', 
    fontSize: 15 
  },
  linkTextBold: {
    color: '#007aff',
    fontWeight: '600',
  },
   brand: { fontSize: 22, fontWeight: "bold", color: "#007AFF" },
});

export default LoginScreen;