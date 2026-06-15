import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logoSource = require("../../assets/images/logo-glow.png");

  async function handleLogin() {
    if (!cpf || !senha) {
      Alert.alert("Atenção", "Preencha o CPF e a Senha para continuar.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://ergane-api.onrender.com/login",
        {
          cpf,
          senha,
        },
      );

      const token = response.data.token || response.data;

      // SALVANDO O TOKEN NA WEB/ANDROID/IOS COM ASYNCSTORAGE
      await AsyncStorage.setItem("userToken", token);

      router.replace("/(tabs)");
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert("Acesso Negado", "CPF ou senha incorretos.");
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoSource} style={styles.logo} />
        <Text style={styles.nome}>Ergane</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#7A8B85"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#7A8B85"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={[styles.botao, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.entrar}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#053225",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: { alignItems: "center", marginBottom: 50 },
  logo: { width: 180, height: 180, resizeMode: "contain", marginBottom: -20 },
  nome: { color: "#FFFFFF", fontSize: 48, fontWeight: "600", letterSpacing: 1 },
  formContainer: { width: "100%", maxWidth: 340 },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    fontSize: 16,
    color: "#053225",
  },
  botao: {
    backgroundColor: "#0C7858",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  entrar: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
