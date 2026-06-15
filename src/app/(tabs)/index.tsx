import { Ionicons } from "@expo/vector-icons";
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
  View,
} from "react-native";

export default function HomeScreen() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Recarrega os dados do banco sempre que o usuário voltar para a Home
  useFocusEffect(
    useCallback(() => {
      carregarDadosHome();
    }, []),
  );

  async function carregarDadosHome() {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
        router.replace("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Busca o faturamento e as vendas recentes em paralelo da API no Render
      const [dashResponse, salesResponse] = await Promise.all([
        axios.get("https://ergane-api.onrender.com/vendas/dashboard", config),
        axios
          .get("https://ergane-api.onrender.com/vendas/recent-sales", config)
          .catch(() => ({ data: [] })),
      ]);

      setDashboardData(dashResponse.data);
      setRecentSales(salesResponse.data || []);
    } catch (error) {
      console.error("Erro ao buscar dados da Home:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatarData(dataString: string) {
    if (!dataString) return "";
    const data = new Date(dataString);
    return (
      data.toLocaleDateString("pt-BR") +
      " às " +
      data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centro]}>
        <ActivityIndicator size="large" color="#0C7858" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Topo Verde Escuro idêntico ao padrão do Ergane */}
        <View style={styles.cabecalho}>
          <Text style={styles.saudacao}>Olá, Empreendedor!</Text>
          <Text style={styles.subtitulo}>
            Acompanhe o resumo do seu negócio
          </Text>
        </View>

        {/* Card de Faturamento que sobrepõe o cabeçalho */}
        <View style={styles.cardTotal}>
          <Text style={styles.cardTotalTitulo}>Total Vendido (Mês)</Text>
          <Text style={styles.cardTotalValor}>
            R$ {dashboardData?.totalVendidoMes?.toFixed(2) || "0,00"}
          </Text>
        </View>

        {/* Balão do Assistente Virtual Thiago */}
        {dashboardData?.assistente && (
          <View style={styles.cardAssistente}>
            <View style={styles.assistenteHeader}>
              <Ionicons name="sparkles" size={16} color="#0C7858" />
              <Text style={styles.assistenteTitulo}>
                {" "}
                {dashboardData.assistente.titulo}
              </Text>
            </View>
            <Text style={styles.assistenteMensagem}>
              {dashboardData.assistente.mensagem}
            </Text>
          </View>
        )}

        {/* Seção de Vendas Recentes */}
        <View style={styles.secaoVendas}>
          <Text style={styles.secaoTitulo}>Vendas Recentes</Text>

          {recentSales.length === 0 ? (
            <Text style={styles.semVendas}>
              Nenhuma venda realizada recentemente.
            </Text>
          ) : (
            recentSales.map((venda: any) => (
              <TouchableOpacity
                key={venda.id}
                style={styles.cardVenda}
                activeOpacity={0.7}
                // Redireciona para o arquivo de detalhes passando o ID por parâmetro
                onPress={() =>
                  router.push({
                    pathname: "/detalhes-venda",
                    params: { id: venda.id },
                  })
                }
              >
                <View style={styles.vendaEsquerda}>
                  <View style={styles.iconeContainer}>
                    <Ionicons
                      name="receipt-outline"
                      size={20}
                      color="#0C7858"
                    />
                  </View>
                  <View>
                    <Text style={styles.vendaClienteName}>
                      {venda.nomeCliente || "Cliente Casual"}
                    </Text>
                    <Text style={styles.vendaDataText}>
                      {formatarData(venda.dataHora)}
                    </Text>
                  </View>
                </View>
                <View style={styles.vendaDireita}>
                  <Text style={styles.vendaValorText}>
                    R$ {venda.valorTotal?.toFixed(2)}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#7A8B85" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  centro: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  cabecalho: {
    backgroundColor: "#053225",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  saudacao: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitulo: {
    color: "#7A8B85",
    fontSize: 14,
    marginTop: 4,
  },
  cardTotal: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    marginTop: -25,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardTotalTitulo: {
    color: "#7A8B85",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  cardTotalValor: {
    color: "#053225",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 6,
  },
  cardAssistente: {
    backgroundColor: "#EFFFFB",
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#0C7858",
  },
  assistenteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  assistenteTitulo: {
    color: "#053225",
    fontWeight: "bold",
    fontSize: 15,
  },
  assistenteMensagem: {
    color: "#4A5A54",
    fontSize: 13,
    lineHeight: 18,
  },
  secaoVendas: {
    marginHorizontal: 24,
    marginTop: 24,
    paddingBottom: 40,
  },
  secaoTitulo: {
    color: "#053225",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  semVendas: {
    color: "#7A8B85",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  cardVenda: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  vendaEsquerda: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFFFFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  vendaClienteName: {
    color: "#053225",
    fontSize: 15,
    fontWeight: "600",
  },
  vendaDataText: {
    color: "#7A8B85",
    fontSize: 12,
    marginTop: 2,
  },
  vendaDireita: {
    flexDirection: "row",
    alignItems: "center",
  },
  vendaValorText: {
    color: "#053225",
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 6,
  },
});
