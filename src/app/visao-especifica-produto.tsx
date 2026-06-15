// Tela de detalhe/edição de um produto.
// Carrega o produto via GET /produtos/{id} e salva via PUT /produtos/{id}.
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const API_URL = "https://ergane-api.onrender.com";

export default function VisaoEspecificaProduto() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // ID do produto vindo da lista de produtos

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState(0);
  // custoProducao é exigido pela API no PUT, então preservamos o valor atual.
  const [custoProducao, setCustoProducao] = useState(0);
  const [estoque, setEstoque] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    if (id) buscarProduto();
  }, [id]);

  async function buscarProduto() {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      const { data } = await axios.get(`${API_URL}/produtos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNome(data.nome ?? "");
      setPreco(data.preco ?? 0);
      setCustoProducao(data.custoProducao ?? 0);
      setEstoque(data.estoque ?? 0);
      setDescricao(data.descricao ?? "");
      setCategorias(data.categorias ?? []);
    } catch (error: any) {
      const msg =
        error?.response?.data?.erro ?? "Não foi possível carregar o produto.";
      Alert.alert("Erro", msg);
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvarAlteracoes() {
    // Espelha as validações da API para evitar 400 com mensagem genérica.
    if (!descricao.trim()) {
      Alert.alert("Aviso", "A descrição é obrigatória.");
      return;
    }
    if (categorias.length === 0) {
      Alert.alert("Aviso", "Informe ao menos uma categoria.");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("userToken");

      const payload = {
        nome,
        preco,
        custoProducao,
        estoque,
        descricao,
        categorias,
      };

      await axios.put(`${API_URL}/produtos/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      router.back();
    } catch (error: any) {
      const msg =
        error?.response?.data?.erro ??
        "Falha ao salvar as alterações do produto.";
      Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={saving}>
          <Text style={styles.headerIcon}>✕</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSalvarAlteracoes} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.headerIcon}>✓</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text style={styles.productName}>{nome}</Text>
          <Text style={styles.productPrice}>
            R$ {preco.toFixed(2).replace(".", ",")}
          </Text>

          <Text style={styles.sectionTitle}>Estoque</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setEstoque(estoque > 0 ? estoque - 1 : 0)}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.counterValue}>{estoque}</Text>

            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setEstoque(estoque + 1)}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <TouchableOpacity style={styles.criarButton}>
              <Text style={styles.criarButtonText}>Criar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagsRow}>
            {categorias.map((cat, index) => (
              <Text key={index} style={styles.tagText}>
                {cat}
              </Text>
            ))}
            <Text style={styles.tagText}>+</Text>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Variações</Text>
            <TouchableOpacity style={styles.criarButton}>
              <Text style={styles.criarButtonText}>Criar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Descrição</Text>
          <TextInput
            style={styles.descriptionInput}
            multiline
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Escreva algo..."
            placeholderTextColor="#AFAEAE"
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#053225", padding: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    marginTop: 10,
  },
  headerIcon: { color: "#FFF", fontSize: 28, fontWeight: "bold" },
  productName: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  sectionTitle: { color: "#FFF", fontSize: 16, marginVertical: 10 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#AFAEAE",
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonText: { color: "#053225", fontSize: 24, fontWeight: "bold" },
  counterValue: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "bold",
    marginHorizontal: 25,
  },
  criarButton: {
    backgroundColor: "#AFAEAE",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  criarButtonText: { color: "#053225", fontWeight: "bold", fontSize: 14 },
  tagsRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  tagText: { color: "#FFF", fontSize: 18, fontWeight: "bold", marginRight: 15 },
  descriptionInput: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
    textAlignVertical: "top",
  },
});
