import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { PALETA } from "../../constants/theme";

type Venda = {
  id: number;
  cliente: string;
  dataHora: string;
  valor: string;
};

type DashboardData = {
  nomeUsuario: string;
  totalVendidoMes: string;
  mensagemAssistente: string;
  vendasRecentes: Venda[];
};

const dadosMock: DashboardData = {
  nomeUsuario: "Allan",
  totalVendidoMes: "R$ 27,50",
  mensagemAssistente:
    "Na ultima quinta, na Unicesumar, você vendeu mais bombons de maracujá.",
  vendasRecentes: [
    {
      id: 1,
      cliente: "João Choma",
      dataHora: "19 MAI 2026 14:52",
      valor: "R$ 27,50",
    },
    {
      id: 2,
      cliente: "João Choma",
      dataHora: "19 MAI 2026 14:52",
      valor: "R$ 27,50",
    },
    {
      id: 3,
      cliente: "João Choma",
      dataHora: "19 MAI 2026 14:52",
      valor: "R$ 27,50",
    },
  ],
};

const FONTE = "Inter, Arial, sans-serif";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null);

  const { width } = useWindowDimensions();
  const larguraBase = Math.min(width, 412);
  const escala = larguraBase / 412;

  const styles = criarStyles(escala, larguraBase);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const response = await axios.get("/dashboard");
        setDados(response.data);
      } catch (error) {
        setDados(dadosMock);
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={PALETA.verdeEscuro} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.saudacao}>
              Olá,{"\n"}
              {dados?.nomeUsuario}
            </Text>

            <TouchableOpacity
              style={styles.avatar}
              onPress={() =>
                Alert.alert("Aviso", "Funcionalidade ainda em desenvolvimento")
              }
            />
          </View>

          <Text style={styles.totalLabel}>Total vendido esse mês</Text>

          <TouchableOpacity
            style={styles.totalCard}
            onPress={() =>
              Alert.alert("Aviso", "Funcionalidade ainda em desenvolvimento")
            }
          >
            <Text style={styles.totalValor}>{dados?.totalVendidoMes}</Text>
          </TouchableOpacity>

          <Text style={styles.assistenteTitulo}>Assistente</Text>

          <TouchableOpacity
            style={styles.assistenteCard}
            onPress={() =>
              Alert.alert("Aviso", "Funcionalidade ainda em desenvolvimento")
            }
          >
            <Text style={styles.assistenteTexto}>
              <Text style={styles.assistenteNome}>Thiago:{"\n"}</Text>
              {dados?.mensagemAssistente}
            </Text>
          </TouchableOpacity>

          <View style={styles.vendasHeader}>
            <Text style={styles.vendasTitulo}>Vendas recentes</Text>

            <TouchableOpacity style={styles.verTodasButton}>
              <Text style={styles.verTodasTexto}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listaVendas}>
            {dados?.vendasRecentes.map((venda) => (
              <TouchableOpacity
                key={venda.id}
                style={styles.vendaCard}
                onPress={() => setVendaSelecionada(venda)}
              >
                <Text style={styles.nomeCliente}>{venda.cliente}</Text>
                <Text style={styles.dataVenda}>{venda.dataHora}</Text>
                <Text style={styles.valorVenda}>{venda.valor}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Modal
          visible={vendaSelecionada !== null}
          transparent
          animationType="slide"
          onRequestClose={() => setVendaSelecionada(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Detalhes Venda</Text>

              <Text style={styles.modalText}>
                Cliente: {vendaSelecionada?.cliente}
              </Text>

              <Text style={styles.modalText}>
                Data: {vendaSelecionada?.dataHora}
              </Text>

              <Text style={styles.modalText}>
                Valor: {vendaSelecionada?.valor}
              </Text>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setVendaSelecionada(null)}
              >
                <Text style={styles.modalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

function criarStyles(escala: number, larguraBase: number) {
  const s = (valor: number) => valor * escala;

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: PALETA.offWhite,
      alignItems: "center",
    },

    container: {
      flex: 1,
      width: larguraBase,
      backgroundColor: PALETA.offWhite,
    },

    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
    },

    scrollContent: {
      paddingTop: s(34),
      paddingHorizontal: s(24),
      paddingBottom: s(24),
    },

    header: {
      height: s(75),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    saudacao: {
      marginTop: s(11),
      width: s(158),
      height: s(64),
      fontFamily: FONTE,
      fontSize: s(32),
      fontWeight: "400",
      lineHeight: s(32),
      color: PALETA.preto,
    },

    avatar: {
      width: s(45),
      height: s(43),
      borderRadius: s(24),
      backgroundColor: PALETA.verdeEscuro,
    },

    totalLabel: {
      width: s(216),
      height: s(27),
      marginTop: s(9),
      fontFamily: FONTE,
      fontSize: s(12),
      fontWeight: "700",
      lineHeight: s(12),
      color: PALETA.verdeEscuro,
    },

    totalCard: {
      width: s(365),
      height: s(105),
      borderRadius: s(16),
      backgroundColor: PALETA.verdeEscuro,
      justifyContent: "center",
      paddingLeft: s(12),
    },

    totalValor: {
      width: s(206),
      height: s(51),
      fontFamily: FONTE,
      fontSize: s(40),
      fontWeight: "700",
      lineHeight: s(40),
      color: PALETA.branco,
    },

    assistenteTitulo: {
      width: s(220),
      height: s(24),
      marginTop: s(26),
      fontFamily: FONTE,
      fontSize: s(24),
      fontWeight: "400",
      lineHeight: s(24),
      color: PALETA.preto,
    },

    assistenteCard: {
      width: s(365),
      height: s(157),
      marginTop: s(8),
      borderRadius: s(16),
      backgroundColor: PALETA.verdeFolha,
      paddingTop: s(22),
      paddingHorizontal: s(13),
    },

    assistenteTexto: {
      width: s(327),
      fontFamily: FONTE,
      fontSize: s(24),
      fontWeight: "400",
      lineHeight: s(24),
      color: PALETA.branco,
    },

    assistenteNome: {
      fontFamily: FONTE,
      fontSize: s(24),
      fontWeight: "700",
      lineHeight: s(24),
      color: PALETA.branco,
    },

    vendasHeader: {
      marginTop: s(55),
      height: s(24),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    vendasTitulo: {
      width: s(220),
      height: s(24),
      fontFamily: FONTE,
      fontSize: s(24),
      fontWeight: "400",
      lineHeight: s(24),
      color: PALETA.preto,
    },

    verTodasButton: {
      width: s(90),
      height: s(21),
      borderRadius: s(16),
      backgroundColor: PALETA.verdeEscuro,
      alignItems: "center",
      justifyContent: "center",
    },

    verTodasTexto: {
      width: s(75),
      height: s(14),
      fontFamily: FONTE,
      fontSize: s(14),
      fontWeight: "400",
      lineHeight: s(14),
      textAlign: "center",
      color: PALETA.branco,
    },

    listaVendas: {
      marginTop: s(29),
    },

    vendaCard: {
      width: s(365),
      height: s(94),
      borderRadius: s(16),
      backgroundColor: PALETA.branco,
      marginBottom: s(18),
      position: "relative",
    },

    nomeCliente: {
      position: "absolute",
      left: s(14),
      top: s(19),
      width: s(206),
      height: s(23),
      fontFamily: FONTE,
      fontSize: s(20),
      fontWeight: "400",
      lineHeight: s(20),
      color: PALETA.preto,
    },

    dataVenda: {
      position: "absolute",
      left: s(14),
      top: s(60),
      width: s(206),
      height: s(18),
      fontFamily: FONTE,
      fontSize: s(16),
      fontWeight: "400",
      lineHeight: s(16),
      color: PALETA.preto,
    },

    valorVenda: {
      position: "absolute",
      right: s(14),
      top: s(51),
      width: s(141),
      height: s(30),
      fontFamily: FONTE,
      fontSize: s(24),
      fontWeight: "400",
      lineHeight: s(24),
      textAlign: "right",
      color: PALETA.preto,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.35)",
      justifyContent: "flex-end",
    },

    modalCard: {
      backgroundColor: PALETA.branco,
      borderTopLeftRadius: s(24),
      borderTopRightRadius: s(24),
      padding: s(24),
    },

    modalTitle: {
      fontFamily: FONTE,
      fontSize: s(24),
      fontWeight: "700",
      color: PALETA.verdeEscuro,
      marginBottom: s(16),
    },

    modalText: {
      fontFamily: FONTE,
      fontSize: s(18),
      fontWeight: "400",
      color: PALETA.preto,
      marginBottom: s(8),
    },

    modalButton: {
      marginTop: s(16),
      height: s(48),
      borderRadius: s(16),
      backgroundColor: PALETA.verdeEscuro,
      alignItems: "center",
      justifyContent: "center",
    },

    modalButtonText: {
      fontFamily: FONTE,
      fontSize: s(18),
      fontWeight: "700",
      color: PALETA.branco,
    },
  });
}