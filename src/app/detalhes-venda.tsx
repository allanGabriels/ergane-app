import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DetalhesVenda() {
  const { id } = useLocalSearchParams(); // Captura o ID da venda que veio da Home
  const [venda, setVenda] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (id) buscarDetalhesDaVenda();
    }, [id]),
  );

  async function buscarDetalhesDaVenda() {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      // Chamada à rota: GET /vendas/{id}
      const response = await axios.get(
        `https://ergane-api.onrender.com/vendas/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setVenda(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes desta venda.");
      router.back();
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#0C7858" />
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Detalhes da Venda</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.valor}>
            {venda?.nomeCliente || "Não informado"}
          </Text>

          <Text style={styles.label}>Data</Text>
          <Text style={styles.valor}>
            {new Date(venda?.dataHora).toLocaleString()}
          </Text>

          <Text style={styles.label}>Pagamento</Text>
          <Text style={styles.valor}>{venda?.metodoPagamento}</Text>
        </View>

        <Text style={styles.secaoTitulo}>Itens</Text>
        {venda?.itens?.map((item: any, index: number) => (
          <View key={index} style={styles.itemCard}>
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemQtd}>
              {item.quantidade}x R$ {item.precoUnitario.toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>
            R$ {venda?.valorTotal.toFixed(2)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  loader: { flex: 1 },
  header: {
    backgroundColor: "#053225",
    padding: 24,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  body: { padding: 24 },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
  },
  label: { color: "#7A8B85", fontSize: 12, textTransform: "uppercase" },
  valor: {
    color: "#053225",
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "500",
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#053225",
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemNome: { fontSize: 14, color: "#053225" },
  itemQtd: { fontSize: 14, color: "#0C7858", fontWeight: "bold" },
  totalContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#053225",
    borderRadius: 18,
  },
  totalLabel: { color: "#FFFFFF", fontSize: 18 },
  totalValor: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
});
