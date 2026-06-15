import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function IniciarVenda() {
  const router = useRouter();
  const [nomeCliente, setNomeCliente] = useState("");
  const [cpfCliente, setCpfCliente] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<any[]>([]);
  const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);

  // 1. Busca produtos na API ao carregar a tela
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await axios.get(
          "https://ergane-api.onrender.com/produtos",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setProdutosDisponiveis(response.data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os produtos.");
      }
    }
    carregarProdutos();
  }, []);

  // 2. Filtra produtos conforme digita
  const produtosFiltrados = produtosDisponiveis.filter((p) =>
    p.nome.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  const adicionarAoCarrinho = (produto: any) => {
    const existe = itensCarrinho.find((i) => i.produtoId === produto.id);
    if (existe) {
      setItensCarrinho((prev) =>
        prev.map((i) =>
          i.produtoId === produto.id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i,
        ),
      );
    } else {
      setItensCarrinho((prev) => [
        ...prev,
        {
          produtoId: produto.id,
          nome: produto.nome,
          quantidade: 1,
          precoUnitario: produto.preco,
        },
      ]);
    }
    setPesquisa(""); // Limpa a busca ao adicionar para esconder a lista
  };

  const removerItem = (id: string) =>
    setItensCarrinho((prev) => prev.filter((i) => i.produtoId !== id));

  const incrementarQuantidade = (id: string) =>
    setItensCarrinho((prev) =>
      prev.map((i) =>
        i.produtoId === id ? { ...i, quantidade: i.quantidade + 1 } : i,
      ),
    );

  const handleContinuar = () => {
    if (itensCarrinho.length === 0) {
      Alert.alert("Aviso", "O carrinho não pode estar vazio.");
      return;
    }

    const valorTotal = itensCarrinho.reduce(
      (acc, item) => acc + item.quantidade * item.precoUnitario,
      0,
    );
    const dadosVenda = {
      nomeCliente,
      cpfCliente,
      valorTotal,
      itens: itensCarrinho,
    };

    router.push({
      pathname: "/pagamento",
      params: { dados: JSON.stringify(dadosVenda) },
    });
  };

  return (
    <View style={styles.tudo}>
      <View style={styles.botaocima}>
        <TouchableOpacity onPress={() => router.back()} style={styles.click}>
          <Ionicons name="close" size={36} color="#053225" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cliente}>
          <TextInput
            style={styles.inputClienteNome}
            placeholder="Nome Cliente"
            placeholderTextColor="#5C756A"
            value={nomeCliente}
            onChangeText={setNomeCliente}
          />
          <TextInput
            style={styles.inputClienteCpf}
            placeholder="Cpf (opcional)"
            placeholderTextColor="#5C756A"
            value={cpfCliente}
            onChangeText={setCpfCliente}
            keyboardType="numeric"
          />
        </View>

        {/* Barra de Pesquisa */}
        <View style={styles.pesquisa}>
          <Text style={styles.produtosLabel}>Produtos</Text>
          <View style={styles.barraContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#1A1A1A"
              style={styles.lupaIcon}
            />
            <TextInput
              style={styles.barra}
              placeholder="Pesquisar"
              placeholderTextColor="#1A1A1A"
              value={pesquisa}
              onChangeText={setPesquisa}
            />
          </View>

          {/* Resultados da Busca (Aparece apenas ao digitar) */}
          {pesquisa.length > 0 && (
            <View style={styles.listaBuscaContainer}>
              {produtosFiltrados.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemBusca}
                  onPress={() => adicionarAoCarrinho(item)}
                >
                  <Text style={styles.itemBuscaTexto}>
                    {item.nome}{" "}
                    <Text style={styles.itemBuscaPreco}>
                      - R${item.preco.toFixed(2)}
                    </Text>
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Lista Carrinho */}
        <View style={styles.lista}>
          <Text style={styles.itensLabel}>Itens</Text>
          {itensCarrinho.map((item) => (
            <View key={item.produtoId} style={styles.itemContainer}>
              <View style={styles.itemInfoEsquerda}>
                <Text style={styles.produtoNome}>{item.nome}</Text>
                <Text style={styles.produtoPreco}>
                  R${item.precoUnitario.toFixed(2).replace(".", ",")}
                </Text>
              </View>
              <View style={styles.controlesDireita}>
                <TouchableOpacity
                  onPress={() => removerItem(item.produtoId)}
                  style={styles.actionBotao}
                >
                  <AntDesign name="delete" size={20} color="#FF3B30" />
                </TouchableOpacity>
                <Text style={styles.qntdText}>{item.quantidade}</Text>
                <TouchableOpacity
                  onPress={() => incrementarQuantidade(item.produtoId)}
                  style={styles.actionBotao}
                >
                  <AntDesign name="plus" size={18} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Botão Flutuante */}
      <View style={styles.containerBotao}>
        <TouchableOpacity style={styles.botao} onPress={handleContinuar}>
          <Text style={styles.continua}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tudo: {
    flex: 1,
    backgroundColor: "#EAEAEF", // Fundo do Figma
  },
  botaocima: {
    paddingTop: 50,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 180, 180, 0.4)", // Linha sutil rosa/vermelha como no Figma
    paddingBottom: 8,
    backgroundColor: "#EAEAEF",
  },
  click: {
    alignSelf: "flex-start",
  },
  scrollBody: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  cliente: {
    marginTop: 32,
    marginBottom: 24,
  },
  inputClienteNome: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: "#5C756A", // Cor verde acinzentada do Figma
    marginBottom: 8,
    padding: 0,
  },
  inputClienteCpf: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: "#5C756A",
    padding: 0,
  },
  pesquisa: {
    marginBottom: 32,
  },
  produtosLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#053225",
    marginBottom: 10,
  },
  barraContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Fundo branco na barra de pesquisa
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  lupaIcon: {
    marginRight: 8,
  },
  barra: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#1A1A1A",
  },
  listaBuscaContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginTop: 4,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  itemBusca: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemBuscaTexto: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#053225",
  },
  itemBuscaPreco: {
    fontFamily: "Inter_400Regular",
    color: "#5C756A",
  },
  lista: {
    flex: 1,
  },
  itensLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#053225",
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    // Sem background branco, sem padding agressivo
  },
  itemInfoEsquerda: {
    flex: 1,
  },
  produtoNome: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#053225",
    marginBottom: 2,
  },
  produtoPreco: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#053225", // Mesma cor do título, sem negrito
  },
  controlesDireita: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBotao: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qntdText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#000000",
    marginHorizontal: 14,
  },
  containerBotao: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
  },
  botao: {
    width: "100%",
    height: 54,
    backgroundColor: "#3EC300", // Verde vibrante do Figma
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  continua: {
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    fontSize: 18,
  },
});
