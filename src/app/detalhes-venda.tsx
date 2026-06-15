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

  // Função auxiliar para formatar os itens da venda conforme a API e a imagem
  const renderItem = (item: any, index: number) => {
    // Calcula o preço total do item (quantidade * preço unitário)
    const precoTotalItem = item.quantidade * item.precoUnitario;

    return (
      <View key={index} style={styles.itemRow}>
        <Text style={styles.itemTextoLeft}>
          {item.nome} - {item.quantidade}X
        </Text>
        <View style={styles.itemTextoRightContainer}>
          <Text style={styles.itemTextoRight}>
            R$ {item.precoUnitario.toFixed(2)}
          </Text>
          <Text style={styles.itemTextoRight}>
            R$ {precoTotalItem.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  if (loading)
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#0C7858" />
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={32} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {venda && (
          <>
            {/* Cliente e Valor Total */}
            <View style={styles.mainInfo}>
              <Text style={styles.vendaNome}>
                {venda.nomeCliente || "Cliente"}
              </Text>
              <Text style={styles.vendaValor}>
                R$ {venda.valorTotal.toFixed(2)}
              </Text>
            </View>

            {/* Data */}
            <Text style={styles.dataTexto}>
              {new Date(venda.dataHora).toLocaleString()}
            </Text>

            {/* Seção Itens */}
            <Text style={styles.secaoTitulo}>Itens</Text>
            {venda.itens?.map((item: any, index: number) =>
              renderItem(item, index),
            )}

            {/* Seção Método de Pagamento */}
            <Text style={styles.secaoTitulo}>Método</Text>
            <Text style={styles.valorMetodo}>
              {venda.metodoPagamento || "Não informado"}
            </Text>

            {/* Seção Localização (Placeholder, conforme a imagem) */}
            <Text style={styles.secaoTitulo}>Localização</Text>
            <View style={styles.mapaPlaceholder}>
              {/* O componente de mapa real deve ser integrado aqui.
                  Abaixo está apenas uma representação visual baseada na imagem fornecida. */}
              <Ionicons
                name="airplane"
                size={24}
                color="#000000"
                style={styles.mapIcon}
              />
              <Text style={styles.mapText}>Aeroporto de Maringá</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  loader: { flex: 1, justifyContent: "center" },
  header: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "red", // Linha de margem visual da imagem original
  },
  body: { paddingHorizontal: 24, paddingBottom: 24 },
  mainInfo: { marginBottom: 12 },
  vendaNome: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
  },
  vendaValor: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
  },
  dataTexto: {
    color: "#000000",
    fontSize: 14,
    marginBottom: 40,
  },
  secaoTitulo: {
    fontSize: 16,
    color: "#54605C",
    marginTop: 20,
    marginBottom: 10,
    textTransform: "capitalize",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemTextoLeft: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
    flex: 1,
  },
  itemTextoRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  itemTextoRight: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  valorMetodo: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  mapaPlaceholder: {
    backgroundColor: "#D3F9E1",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  mapIcon: {
    marginRight: 10,
  },
  mapText: {
    fontSize: 14,
    color: "#000000",
  },
});
