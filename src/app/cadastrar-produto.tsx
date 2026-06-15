import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { PALETA } from "../constants/theme";

export default function CadastrarProdutoScreen() {
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  // Estoque agora é uma string para permitir digitação livre no TextInput
  const [estoqueStr, setEstoqueStr] = useState("0");
  const [descricao, setDescricao] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    string[]
  >([]);

  const [modalCategoriaVisivel, setModalCategoriaVisivel] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");

  const { width } = useWindowDimensions();
  const larguraBase = Math.min(width, 412);
  const escala = larguraBase / 412;

  const styles = criarStyles(escala, larguraBase);

  function limparCampos() {
    setNome("");
    setPreco("");
    setEstoqueStr("0");
    setDescricao("");
    setCategoriasSelecionadas([]);
  }

  function aumentarEstoque() {
    setEstoqueStr((prev) => (parseInt(prev || "0", 10) + 1).toString());
  }

  function diminuirEstoque() {
    setEstoqueStr((prev) => {
      const val = parseInt(prev || "0", 10);
      return val > 0 ? (val - 1).toString() : "0";
    });
  }

  // Permite apenas números na digitação do estoque
  function handleEstoqueChange(text: string) {
    setEstoqueStr(text.replace(/[^0-9]/g, ""));
  }

  async function salvarProduto() {
    if (!nome || !preco) {
      Alert.alert(
        "Aviso",
        "Preencha ao menos o Nome e o Preço para continuar.",
      );
      return;
    }

    if (categoriasSelecionadas.length === 0) {
      Alert.alert("Aviso", "Informe ao menos uma categoria.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      const payload = {
        nome,
        preco: parseFloat(preco.replace(",", ".")),
        custoProducao: 0, // Campo obrigatório na API, mas oculto no design
        estoque: parseInt(estoqueStr || "0", 10),
        descricao,
        categorias: categoriasSelecionadas,
      };

      await axios.post("https://ergane-api.onrender.com/produtos", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Sucesso", "Produto cadastrado com sucesso.");
      limparCampos();
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    } finally {
      setLoading(false);
    }
  }

  async function criarCategoria() {
    if (!novaCategoria.trim()) {
      Alert.alert("Aviso", "Digite o nome da categoria.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      await axios.post(
        "https://ergane-api.onrender.com/categorias",
        { nome: novaCategoria },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setCategoriasSelecionadas((prev) => [...prev, novaCategoria]);
      setNovaCategoria("");
      setModalCategoriaVisivel(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a categoria.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {/* Cabeçalho com X e Check */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={salvarProduto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={PALETA.branco} />
            ) : (
              <Text style={styles.checkIcon}>✓</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TextInput
            style={styles.nomeInput}
            placeholder="Nome"
            placeholderTextColor={PALETA.cinzaApagado}
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.precoInput}
            placeholder="R$0,00"
            placeholderTextColor={PALETA.cinzaApagado}
            keyboardType="numeric"
            value={preco}
            onChangeText={setPreco}
          />

          <Text style={styles.estoqueLabel}>Estoque</Text>

          <View style={styles.estoqueArea}>
            <TouchableOpacity
              style={styles.estoqueButton}
              onPress={aumentarEstoque}
            >
              <Text style={styles.estoqueButtonText}>+</Text>
            </TouchableOpacity>

            {/* Transformado em TextInput para digitação livre */}
            <TextInput
              style={styles.estoqueInput}
              keyboardType="numeric"
              value={estoqueStr}
              onChangeText={handleEstoqueChange}
              selectTextOnFocus
            />

            <TouchableOpacity
              style={styles.estoqueButton}
              onPress={diminuirEstoque}
            >
              <Text style={styles.menosText}>−</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linhaCategoria}>
            <View>
              <Text style={styles.label}>Categorias</Text>
              <TouchableOpacity
                style={styles.selecionarArea}
                onPress={() =>
                  Alert.alert(
                    "Aviso",
                    "Seleção de categorias em desenvolvimento",
                  )
                }
              >
                <Text style={styles.selecionarTexto}>
                  {categoriasSelecionadas.length > 0
                    ? categoriasSelecionadas[0]
                    : "Selecionar"}
                </Text>
                <Text style={styles.maisCategoria}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.criarButton}
              onPress={() => setModalCategoriaVisivel(true)}
            >
              <Text style={styles.criarTexto}>Criar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linhaVariacoes}>
            <Text style={styles.label}>Variações</Text>
            <TouchableOpacity
              style={styles.criarButton}
              onPress={() => Alert.alert("Aviso", "Em desenvolvimento")}
            >
              <Text style={styles.criarTexto}>Criar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.descricaoLabel}>Descrição</Text>

          <TextInput
            style={styles.descricaoInput}
            placeholder="Escreva algo..."
            placeholderTextColor={PALETA.cinzaApagado}
            multiline
            textAlignVertical="top"
            value={descricao}
            onChangeText={setDescricao}
          />
        </ScrollView>
      </View>

      {/* Modal de Categoria */}
      <Modal
        visible={modalCategoriaVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCategoriaVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCategoria}>
            <Text style={styles.modalTitulo}>Nova Categoria</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite o nome da categoria"
              placeholderTextColor={PALETA.cinzaApagado}
              value={novaCategoria}
              onChangeText={setNovaCategoria}
            />
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.modalBotaoCancelar}
                onPress={() => setModalCategoriaVisivel(false)}
              >
                <Text style={styles.modalTextoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBotaoCriar}
                onPress={criarCategoria}
              >
                <Text style={styles.modalTextoCriar}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function criarStyles(escala: number, larguraBase: number) {
  const s = (valor: number) => valor * escala;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: PALETA.roxoEscuro, // Fundo roxo do design
      alignItems: "center",
    },
    container: {
      flex: 1,
      width: larguraBase,
      backgroundColor: PALETA.roxoEscuro,
      paddingHorizontal: s(26),
    },
    header: {
      height: s(80),
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingTop: s(18),
      borderBottomWidth: 1, // Linha de divisão que aparece no Figma
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    headerButton: {
      width: s(55),
      height: s(55),
      alignItems: "center",
      justifyContent: "center",
    },
    closeIcon: {
      fontFamily: "Inter_400Regular",
      fontSize: s(32),
      color: PALETA.branco,
    },
    checkIcon: {
      fontFamily: "Inter_400Regular",
      fontSize: s(32),
      color: PALETA.branco,
    },
    scrollContent: {
      paddingBottom: s(40),
    },
    nomeInput: {
      width: "100%",
      marginTop: s(34),
      fontFamily: "Inter_700Bold",
      fontSize: s(28),
      color: PALETA.branco, // Ajustado para branco conforme o Figma
      padding: 0,
    },
    precoInput: {
      width: "100%",
      marginTop: s(12),
      fontFamily: "Inter_700Bold",
      fontSize: s(28),
      color: PALETA.cinzaApagado,
      padding: 0,
    },
    estoqueLabel: {
      marginTop: s(32),
      fontFamily: "Inter_400Regular",
      fontSize: s(14),
      color: PALETA.branco,
    },
    estoqueArea: {
      marginTop: s(15),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    estoqueButton: {
      width: s(40),
      height: s(40),
      borderRadius: s(20),
      backgroundColor: PALETA.cinzaApagado,
      alignItems: "center",
      justifyContent: "center",
    },
    estoqueButtonText: {
      fontFamily: "Inter_700Bold",
      fontSize: s(24),
      color: PALETA.roxoEscuro,
    },
    menosText: {
      fontFamily: "Inter_700Bold",
      fontSize: s(24),
      color: PALETA.roxoEscuro,
      marginTop: s(-2),
    },
    estoqueInput: {
      width: s(60),
      marginHorizontal: s(20),
      fontFamily: "Inter_700Bold",
      fontSize: s(28),
      textAlign: "center",
      color: PALETA.cinzaApagado,
    },
    linhaCategoria: {
      marginTop: s(52),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    label: {
      fontFamily: "Inter_400Regular",
      fontSize: s(14),
      color: PALETA.branco,
    },
    selecionarArea: {
      marginTop: s(8),
      flexDirection: "row",
      alignItems: "center",
    },
    selecionarTexto: {
      fontFamily: "Inter_700Bold",
      fontSize: s(16),
      color: PALETA.cinzaApagado,
    },
    maisCategoria: {
      marginLeft: s(10),
      fontFamily: "Inter_700Bold",
      fontSize: s(16),
      color: PALETA.branco,
    },
    criarButton: {
      paddingHorizontal: s(16),
      paddingVertical: s(6),
      borderRadius: s(16),
      backgroundColor: PALETA.cinzaApagado,
      alignItems: "center",
      justifyContent: "center",
    },
    criarTexto: {
      fontFamily: "Inter_400Regular",
      fontSize: s(14),
      color: PALETA.preto,
    },
    linhaVariacoes: {
      marginTop: s(38),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    descricaoLabel: {
      marginTop: s(38),
      fontFamily: "Inter_400Regular",
      fontSize: s(14),
      color: PALETA.branco,
    },
    descricaoInput: {
      width: "100%",
      height: s(94),
      marginTop: s(12),
      fontFamily: "Inter_400Regular",
      fontSize: s(14),
      color: PALETA.cinzaApagado,
      padding: 0,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      alignItems: "center",
      justifyContent: "center",
    },
    modalCategoria: {
      width: s(320),
      borderRadius: s(20),
      backgroundColor: PALETA.branco,
      padding: s(22),
    },
    modalTitulo: {
      fontFamily: "Inter_700Bold",
      fontSize: s(20),
      color: PALETA.roxoEscuro,
      marginBottom: s(18),
    },
    modalInput: {
      height: s(46),
      borderWidth: 1,
      borderColor: PALETA.cinzaApagado,
      borderRadius: s(12),
      paddingHorizontal: s(12),
      fontFamily: "Inter_400Regular",
      fontSize: s(16),
      color: PALETA.preto,
    },
    modalBotoes: {
      marginTop: s(20),
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    modalBotaoCancelar: {
      paddingHorizontal: s(14),
      paddingVertical: s(8),
      marginRight: s(12),
    },
    modalTextoCancelar: {
      fontFamily: "Inter_400Regular",
      fontSize: s(16),
      color: PALETA.roxoEscuro,
    },
    modalBotaoCriar: {
      paddingHorizontal: s(18),
      paddingVertical: s(8),
      borderRadius: s(12),
      backgroundColor: PALETA.roxoEscuro,
    },
    modalTextoCriar: {
      fontFamily: "Inter_700Bold",
      fontSize: s(16),
      color: PALETA.branco,
    },
  });
}
