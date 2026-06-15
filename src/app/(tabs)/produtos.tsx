import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Tipagem baseada no seu ProdutoResponse do Spring Boot
type Produto = {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
};

export default function ProdutosScreen() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para os filtros
  const [pesquisa, setPesquisa] = useState("");
  const [filtroEstoque, setFiltroEstoque] = useState<
    "TODOS" | "EM_ESTOQUE" | "ESGOTADO"
  >("TODOS");

  // Carrega os dados toda vez que a aba de Produtos for acessada
  useFocusEffect(
    useCallback(() => {
      buscarProdutos();
    }, []),
  );

  async function buscarProdutos() {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Erro", "Sessão expirada.");
        return;
      }

      const response = await axios.get(
        "https://ergane-api.onrender.com/produtos",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setProdutos(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar seus produtos.");
    } finally {
      setLoading(false);
    }
  }

  // Lógica que cruza a barra de pesquisa com os botões de filtro de estoque
  const produtosFiltrados = produtos.filter((p) => {
    const matchBusca = p.nome.toLowerCase().includes(pesquisa.toLowerCase());
    const matchEstoque =
      filtroEstoque === "EM_ESTOQUE"
        ? p.estoque > 0
        : filtroEstoque === "ESGOTADO"
          ? p.estoque === 0
          : true;

    return matchBusca && matchEstoque;
  });

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <Text style={styles.title}>Gerencie seus{"\n"}produtos</Text>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#1A1A1A"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          placeholderTextColor="#7A8B85"
          value={pesquisa}
          onChangeText={setPesquisa}
        />
      </View>

      {/* Filtros em formato de Pills */}
      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={styles.filterIconButton}
          onPress={() => setFiltroEstoque("TODOS")}
        >
          <Ionicons name="filter" size={18} color="#1A1A1A" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            filtroEstoque === "EM_ESTOQUE" && styles.filterPillActive,
          ]}
          onPress={() => setFiltroEstoque("EM_ESTOQUE")}
        >
          <Text style={styles.filterPillText}>Em estoque</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterPill,
            filtroEstoque === "ESGOTADO" && styles.filterPillActive,
          ]}
          onPress={() => setFiltroEstoque("ESGOTADO")}
        >
          <Text style={styles.filterPillText}>Esgotado</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Produtos */}
      {loading ? (
        <ActivityIndicator size="large" color="#053225" style={styles.loader} />
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/visao-especifica-produto",
                  params: { id: item.id },
                })
              }
            >
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardPrice}>
                R${item.preco.toFixed(2).replace(".", ",")}
              </Text>
              <Text style={styles.cardStock}>{item.estoque} em estoque</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F7", // Fundo super claro igual ao figma
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  loader: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    color: "#111111",
    fontWeight: "500",
    lineHeight: 34,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E2E2E2",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  filtersRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  filterIconButton: {
    backgroundColor: "#E2E2E2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  filterPill: {
    backgroundColor: "#E2E2E2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  filterPillActive: {
    backgroundColor: "#D0D0D0", // Fica levemente mais escuro se estiver selecionado
  },
  filterPillText: {
    color: "#1A1A1A",
    fontSize: 14,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 100, // Espaçamento extra para não ficar escondido pelo footer menu
  },
  card: {
    backgroundColor: "#053225", // Verde Escuro característico do Ergane
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  cardPrice: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 2,
  },
  cardStock: {
    color: "#8CA399", // Tom de verde/cinza claro para o estoque
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
  },
});
