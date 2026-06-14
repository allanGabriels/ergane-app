import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
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

const FONTE = "Inter, Arial, sans-serif";

export default function CadastrarProdutoScreen() {
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);

  const [modalCategoriaVisivel, setModalCategoriaVisivel] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");

  const { width } = useWindowDimensions();
  const larguraBase = Math.min(width, 412);
  const escala = larguraBase / 412;

  const styles = criarStyles(escala, larguraBase);

  function limparCampos() {
    setNome("");
    setPreco("");
    setEstoque(0);
    setDescricao("");
    setCategoriasSelecionadas([]);
  }

  function aumentarEstoque() {
    setEstoque((valorAtual) => valorAtual + 1);
  }

  function diminuirEstoque() {
    setEstoque((valorAtual) => (valorAtual > 0 ? valorAtual - 1 : 0));
  }

  async function salvarProduto() {
    if (!nome || !preco) {
      Alert.alert("Aviso", "Preencha ao menos o Nome e o Preço para continuar.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        nome,
        preco: parseFloat(preco.replace(",", ".")),
        estoque,
        descricao,
        categorias: categoriasSelecionadas,
      };

      await axios.post("/produtos", payload);

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

      await axios.post("/categorias", {
        nome: novaCategoria,
      });

      setCategoriasSelecionadas((categoriasAtuais) => [
        ...categoriasAtuais,
        novaCategoria,
      ]);

      Alert.alert("Sucesso", `Categoria "${novaCategoria}" criada.`);
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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Text style={styles.closeIcon}>×</Text>
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

            <Text style={styles.estoqueValor}>{estoque}</Text>

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
                  Alert.alert("Aviso", "Seleção de categorias em desenvolvimento")
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
              onPress={() =>
                Alert.alert("Aviso", "Criação de variações em desenvolvimento")
              }
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
      backgroundColor: PALETA.roxoEscuro,
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
    },

    headerButton: {
      width: s(55),
      height: s(55),
      alignItems: "center",
      justifyContent: "center",
    },

    closeIcon: {
      fontFamily: FONTE,
      fontSize: s(38),
      fontWeight: "300",
      lineHeight: s(38),
      color: PALETA.branco,
    },

    checkIcon: {
      fontFamily: FONTE,
      fontSize: s(36),
      fontWeight: "300",
      lineHeight: s(36),
      color: PALETA.branco,
    },

    scrollContent: {
      paddingBottom: s(40),
    },

    nomeInput: {
      width: s(364),
      height: s(51),
      marginTop: s(34),
      fontFamily: FONTE,
      fontSize: s(32),
      fontWeight: "700",
      lineHeight: s(32),
      color: PALETA.cinzaApagado,
      padding: 0,
    },

    precoInput: {
      width: s(364),
      height: s(51),
      marginTop: s(12),
      fontFamily: FONTE,
      fontSize: s(32),
      fontWeight: "700",
      lineHeight: s(32),
      color: PALETA.cinzaApagado,
      padding: 0,
    },

    estoqueLabel: {
      width: s(73),
      height: s(18),
      marginTop: s(22),
      fontFamily: FONTE,
      fontSize: s(16),
      fontWeight: "400",
      lineHeight: s(16),
      color: PALETA.branco,
    },

    estoqueArea: {
      height: s(47),
      marginTop: s(15),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    estoqueButton: {
      width: s(47),
      height: s(47),
      borderRadius: s(24),
      backgroundColor: PALETA.cinzaApagado,
      alignItems: "center",
      justifyContent: "center",
    },

    estoqueButtonText: {
      fontFamily: FONTE,
      fontSize: s(32),
      fontWeight: "700",
      lineHeight: s(32),
      color: PALETA.roxoEscuro,
    },

    menosText: {
      fontFamily: FONTE,
      fontSize: s(38),
      fontWeight: "700",
      lineHeight: s(38),
      color: PALETA.roxoEscuro,
      marginTop: s(-4),
    },

    estoqueValor: {
      width: s(53),
      height: s(42),
      marginHorizontal: s(35),
      fontFamily: FONTE,
      fontSize: s(40),
      fontWeight: "700",
      lineHeight: s(40),
      textAlign: "center",
      color: PALETA.cinzaApagado,
    },

    linhaCategoria: {
      marginTop: s(52),
      height: s(66),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    label: {
      width: s(98),
      height: s(18),
      fontFamily: FONTE,
      fontSize: s(18),
      fontWeight: "400",
      lineHeight: s(18),
      color: PALETA.branco,
    },

    selecionarArea: {
      marginTop: s(15),
      flexDirection: "row",
      alignItems: "center",
    },

    selecionarTexto: {
      minWidth: s(107),
      height: s(18),
      fontFamily: FONTE,
      fontSize: s(20),
      fontWeight: "700",
      lineHeight: s(20),
      color: PALETA.cinzaApagado,
    },

    maisCategoria: {
      marginLeft: s(10),
      fontFamily: FONTE,
      fontSize: s(20),
      fontWeight: "700",
      lineHeight: s(20),
      color: PALETA.branco,
    },

    criarButton: {
      width: s(76),
      height: s(32),
      borderRadius: s(16),
      backgroundColor: PALETA.cinzaApagado,
      alignItems: "center",
      justifyContent: "center",
    },

    criarTexto: {
      fontFamily: FONTE,
      fontSize: s(16),
      fontWeight: "400",
      lineHeight: s(16),
      textAlign: "center",
      color: PALETA.preto,
    },

    linhaVariacoes: {
      marginTop: s(38),
      height: s(38),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    descricaoLabel: {
      width: s(98),
      height: s(18),
      marginTop: s(58),
      fontFamily: FONTE,
      fontSize: s(18),
      fontWeight: "400",
      lineHeight: s(18),
      color: PALETA.branco,
    },

    descricaoInput: {
      width: s(362),
      height: s(94),
      marginTop: s(20),
      fontFamily: FONTE,
      fontSize: s(18),
      fontWeight: "400",
      lineHeight: s(18),
      color: PALETA.branco,
      padding: 0,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      alignItems: "center",
      justifyContent: "center",
    },

    modalCategoria: {
      width: s(340),
      borderRadius: s(20),
      backgroundColor: PALETA.branco,
      padding: s(22),
    },

    modalTitulo: {
      fontFamily: FONTE,
      fontSize: s(22),
      fontWeight: "700",
      color: PALETA.roxoEscuro,
      marginBottom: s(18),
    },

    modalInput: {
      height: s(46),
      borderWidth: 1,
      borderColor: PALETA.cinzaApagado,
      borderRadius: s(12),
      paddingHorizontal: s(12),
      fontFamily: FONTE,
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
      fontFamily: FONTE,
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
      fontFamily: FONTE,
      fontSize: s(16),
      fontWeight: "700",
      color: PALETA.branco,
    },
  });
}