// ⚠️ AVISO: Esta tela tem botões provisórios apenas para testar a navegação!

import { router } from "expo-router"; // Importação mágica que faz a navegação funcionar
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Tela Home (Testes)</Text>
      <Text style={styles.subtitle}>
        Clique nos botões abaixo para testar as rotas:
      </Text>

      {/* Testa ir para uma tela normal fora das abas */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Ir para Login</Text>
      </TouchableOpacity>

      {/* Testa o fluxo de venda */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/iniciar-venda")}
      >
        <Text style={styles.buttonText}>Ir para Iniciar Venda</Text>
      </TouchableOpacity>

      {/* Testa se o Modal está subindo certinho de baixo para cima */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#9448BC" }]}
        onPress={() => router.push("/cadastrar-produto")}
      >
        <Text style={styles.buttonText}>Abrir Modal: Cadastrar Produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#053225",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#9999A1",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#053225",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
