import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { PALETA } from "../../constants/theme";

type Venda = {
  id: string;
  nomeCliente: string;
  dataHora: string;
  valorTotal: number;
};

type DashboardData = {
  totalVendidoMes: number;
  assistente: {
    titulo: string;
    mensagem: string;
  };
};

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState("Empreendedor");
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [vendasRecentes, setVendasRecentes] = useState<Venda[]>([]);
  const router = useRouter();

  const { width } = useWindowDimensions();
  const larguraBase = Math.min(width, 412);
  const escala = larguraBase / 412;
  const styles = criarStyles(escala, larguraBase);

  useFocusEffect(
    useCallback(() => {
      carregarDashboard();
    }, []),
  );

  async function carregarDashboard() {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      const nomeSalvo = await AsyncStorage.getItem("userName");
      if (nomeSalvo) setNomeUsuario(nomeSalvo);

      const [dashRes, vendasRes] = await Promise.all([
        axios.get("https://ergane-api.onrender.com/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://ergane-api.onrender.com/vendas/recentes", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setDados(dashRes.data);
      setVendasRecentes(vendasRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function formatarData(dataString: string) {
    if (!dataString) return "";
    const data = new Date(dataString);
    const meses = [
      "JAN",
      "FEV",
      "MAR",
      "ABR",
      "MAI",
      "JUN",
      "JUL",
      "AGO",
      "SET",
      "OUT",
      "NOV",
      "DEZ",
    ];
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");

    return `${dia} ${mes} ${ano} ${horas}:${minutos}`;
  }

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
              {nomeUsuario}
            </Text>

            <TouchableOpacity
              style={styles.avatar}
              onPress={() =>
                Alert.alert("Aviso", "Funcionalidade ainda em desenvolvimento")
              }
            />
          </View>

          <Text style={styles.totalLabel}>Total vendido esse mês</Text>

          <TouchableOpacity style={styles.totalCard}>
            <Text style={styles.totalValor}>
              R${" "}
              {dados?.totalVendidoMes?.toFixed(2).replace(".", ",") || "0,00"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.assistenteTitulo}>Assistente</Text>

          <TouchableOpacity style={styles.assistenteCard}>
            <Text style={styles.assistenteTexto}>
              <Text style={styles.assistenteNome}>
                {dados?.assistente?.titulo}
                {"\n"}
              </Text>
              {dados?.assistente?.mensagem}
            </Text>
          </TouchableOpacity>

          <View style={styles.vendasHeader}>
            <Text style={styles.vendasTitulo}>Vendas recentes</Text>
            <TouchableOpacity
              style={styles.verTodasButton}
              onPress={() => router.push("/(tabs)/produtos")}
            >
              <Text style={styles.verTodasTexto}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listaVendas}>
            {vendasRecentes.map((venda) => (
              <TouchableOpacity
                key={venda.id}
                style={styles.vendaCard}
                onPress={() =>
                  // Abre a tela sobreposta de detalhes passando o ID da venda
                  router.push({
                    pathname: "/detalhes-venda",
                    params: { id: venda.id },
                  })
                }
              >
                <Text style={styles.nomeCliente}>{venda.nomeCliente}</Text>
                <Text style={styles.dataVenda}>
                  {formatarData(venda.dataHora)}
                </Text>
                <Text style={styles.valorVenda}>
                  R$ {venda.valorTotal?.toFixed(2).replace(".", ",")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
      paddingTop: s(40),
      paddingHorizontal: s(24),
      paddingBottom: s(120),
    },
    header: {
      height: s(75),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    saudacao: {
      marginTop: s(11),
      fontFamily: "Inter_400Regular",
      fontSize: s(28),
      lineHeight: s(32),
      color: PALETA.preto,
    },
    avatar: {
      width: s(45),
      height: s(45),
      borderRadius: s(24),
      backgroundColor: PALETA.verdeEscuro,
    },
    totalLabel: {
      marginTop: s(16),
      fontFamily: "Inter_700Bold",
      fontSize: s(12),
      color: PALETA.verdeEscuro,
    },
    totalCard: {
      width: "100%",
      height: s(105),
      borderRadius: s(16),
      backgroundColor: PALETA.verdeEscuro,
      justifyContent: "center",
      paddingLeft: s(16),
      marginTop: s(8),
    },
    totalValor: {
      fontFamily: "Inter_700Bold",
      fontSize: s(40),
      color: PALETA.branco,
    },
    assistenteTitulo: {
      marginTop: s(26),
      fontFamily: "Inter_400Regular",
      fontSize: s(20),
      color: PALETA.preto,
    },
    assistenteCard: {
      width: "100%",
      marginTop: s(8),
      borderRadius: s(16),
      backgroundColor: PALETA.verdeFolha,
      padding: s(16),
    },
    assistenteTexto: {
      fontFamily: "Inter_400Regular",
      fontSize: s(16),
      lineHeight: s(22),
      color: PALETA.branco,
    },
    assistenteNome: {
      fontFamily: "Inter_700Bold",
      fontSize: s(16),
      color: PALETA.branco,
    },
    vendasHeader: {
      marginTop: s(40),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    vendasTitulo: {
      fontFamily: "Inter_400Regular",
      fontSize: s(20),
      color: PALETA.preto,
    },
    verTodasButton: {
      paddingHorizontal: s(12),
      paddingVertical: s(6),
      borderRadius: s(16),
      backgroundColor: PALETA.verdeEscuro,
      alignItems: "center",
      justifyContent: "center",
    },
    verTodasTexto: {
      fontFamily: "Inter_400Regular",
      fontSize: s(12),
      color: PALETA.branco,
    },
    listaVendas: {
      marginTop: s(20),
    },
    vendaCard: {
      width: "100%",
      height: s(94),
      borderRadius: s(16),
      backgroundColor: PALETA.branco,
      marginBottom: s(14),
      position: "relative",
    },
    nomeCliente: {
      position: "absolute",
      left: s(16),
      top: s(20),
      fontFamily: "Inter_400Regular",
      fontSize: s(16),
      color: PALETA.preto,
    },
    dataVenda: {
      position: "absolute",
      left: s(16),
      top: s(54),
      fontFamily: "Inter_400Regular",
      fontSize: s(12),
      color: PALETA.preto,
    },
    valorVenda: {
      position: "absolute",
      right: s(16),
      top: s(36),
      fontFamily: "Inter_400Regular",
      fontSize: s(20),
      color: PALETA.preto,
    },
  });
}
