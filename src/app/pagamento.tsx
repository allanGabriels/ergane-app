import { AntDesign, Ionicons } from "@expo/vector-icons";
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

export default function Pagamento() {
  const router = useRouter();
  const { dados } = useLocalSearchParams();

  const [vendaInput, setVendaInput] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Estados de controle
  const [metodo, setMetodo] = useState<"Dinheiro" | "Crédito" | "Pix">(
    "Dinheiro",
  );
  const [parcelas, setParcelas] = useState(1);
  const [valorRecebidoStr, setValorRecebidoStr] = useState("0,00");

  const [showMetodos, setShowMetodos] = useState(false);
  const [showParcelas, setShowParcelas] = useState(false);

  useEffect(() => {
    if (dados) {
      try {
        const parsed = JSON.parse(dados as string);
        setVendaInput(parsed);
        // Sugere o valor exato no dinheiro inicialmente
        setValorRecebidoStr(parsed.valorTotal.toFixed(2).replace(".", ","));
      } catch (e) {
        Alert.alert("Erro", "Falha ao carregar dados da venda.");
      }
    }
  }, [dados]);

  const total = vendaInput?.valorTotal || 0;

  // Trata a entrada do usuário para o valor em dinheiro
  const handleValorRecebido = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (!numericText) {
      setValorRecebidoStr("0,00");
      return;
    }
    const valorFloat = parseInt(numericText, 10) / 100;
    setValorRecebidoStr(valorFloat.toFixed(2).replace(".", ","));
  };

  const valorRecebido = parseFloat(valorRecebidoStr.replace(",", "."));
  const troco = valorRecebido > total ? valorRecebido - total : 0;

  const opcoesParcelas = [1, 2, 3, 4, 5, 6];

  const getIcone = (tipo: string) => {
    if (tipo === "Dinheiro")
      return <Ionicons name="cash-outline" size={18} color="#3EC300" />;
    if (tipo === "Crédito")
      return <Ionicons name="card-outline" size={18} color="#3EC300" />;
    return <Ionicons name="apps-outline" size={18} color="#3EC300" />;
  };

  const mapMetodoApi = (m: string) => {
    if (m === "Crédito") return "CARTAO_CREDITO";
    if (m === "Pix") return "PIX";
    return "DINHEIRO";
  };

  const handleVender = async () => {
    if (metodo === "Dinheiro" && valorRecebido < total) {
      Alert.alert("Atenção", "O valor recebido é menor que o total da venda.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      const payload = {
        nomeCliente: vendaInput?.nomeCliente,
        cpfCliente: vendaInput?.cpfCliente,
        metodoPagamento: mapMetodoApi(metodo),
        valorTotal: total,
        valorRecebido: metodo === "Dinheiro" ? valorRecebido : total,
        troco: metodo === "Dinheiro" ? troco : 0.0,
        itens: vendaInput?.itens || [],
      };

      await axios.post("https://ergane-api.onrender.com/vendas", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Sucesso", "Venda registrada com sucesso!");
      router.replace("/(tabs)"); // Volta para a home atualizando o dashboard
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível registrar a venda.");
    } finally {
      setLoading(false);
    }
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
        {/* Caixa Seletora Principal */}
        <View style={styles.caixaMaior}>
          <Text style={styles.tituloCaixa}>Selecionar Método</Text>

          <TouchableOpacity
            style={styles.inputSeletorCima}
            onPress={() => {
              setShowMetodos(!showMetodos);
              setShowParcelas(false);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.metodoEsquerda}>
              <View style={styles.iconeWrapper}>{getIcone(metodo)}</View>
              <Text style={styles.textoValor}>{metodo}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#54605C" />
          </TouchableOpacity>

          {showMetodos && (
            <View style={styles.menuOpcoes}>
              {(["Dinheiro", "Crédito", "Pix"] as const).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.opcaoItem}
                  onPress={() => {
                    setMetodo(item);
                    if (item !== "Crédito") setParcelas(1);
                    setShowMetodos(false);
                  }}
                >
                  <View style={styles.opcaoConteudo}>
                    {getIcone(item)}
                    <Text
                      style={[
                        styles.textoOpcao,
                        metodo === item && styles.opcaoSelecionada,
                      ]}
                    >
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Sub-seletor dependente do método */}
          <TouchableOpacity
            style={styles.inputSeletorBaixo}
            onPress={() =>
              metodo === "Crédito" && setShowParcelas(!showParcelas)
            }
            activeOpacity={metodo === "Crédito" ? 0.8 : 1}
          >
            <Text style={styles.textoValorParc}>
              {metodo === "Crédito"
                ? `${parcelas}x ${(total / parcelas).toFixed(2).replace(".", ",")}`
                : metodo === "Dinheiro"
                  ? `1x ${total.toFixed(2).replace(".", ",")}`
                  : `R$${total.toFixed(2).replace(".", ",")}`}
            </Text>
            {metodo === "Crédito" && (
              <Ionicons name="chevron-forward" size={14} color="#54605C" />
            )}
          </TouchableOpacity>

          {showParcelas && metodo === "Crédito" && (
            <View style={styles.menuOpcoes}>
              {opcoesParcelas.map((parc) => (
                <TouchableOpacity
                  key={parc}
                  style={styles.opcaoItem}
                  onPress={() => {
                    setParcelas(parc);
                    setShowParcelas(false);
                  }}
                >
                  <Text
                    style={[
                      styles.textoOpcao,
                      parcelas === parc && styles.opcaoSelecionada,
                    ]}
                  >
                    {parc}x {(total / parc).toFixed(2).replace(".", ",")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Lista visual dos itens da venda */}
        <View style={styles.lista}>
          <Text style={styles.itensTitle}>Itens</Text>
          {vendaInput?.itens?.map((item: any, idx: number) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemRowEsquerda}>
                <Text style={styles.produtoNome}>{item.nome || "Produto"}</Text>
                <Text style={styles.produtoPreco}>
                  R${item.precoUnitario.toFixed(2).replace(".", ",")}
                </Text>
              </View>
              <View style={styles.controlesDireita}>
                <AntDesign name="delete" size={18} color="#FF3B30" />
                <Text style={styles.qntdText}>{item.quantidade}</Text>
                <AntDesign name="plus" size={14} color="#FF3B30" />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.linha} />

        {/* Bloco de Resumo */}
        <View style={styles.nota}>
          <Text style={styles.resumo}>Resumo</Text>

          <View style={styles.bloco}>
            <Text style={styles.itemLabel}>Total</Text>
            <Text style={styles.valorLabel}>
              R${total.toFixed(2).replace(".", ",")}
            </Text>
          </View>

          {metodo === "Dinheiro" && (
            <>
              <View style={styles.bloco}>
                <Text style={styles.itemLabel}>Pagamento</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.moedaText}>R$</Text>
                  <TextInput
                    style={styles.inputPagamentoDinheiro}
                    value={valorRecebidoStr}
                    onChangeText={handleValorRecebido}
                    keyboardType="numeric"
                    selectTextOnFocus
                  />
                </View>
              </View>
              <View style={styles.bloco}>
                <Text style={styles.itemLabel}>Troco</Text>
                <Text style={styles.valorLabel}>
                  R${troco.toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </>
          )}

          {metodo === "Crédito" && (
            <View style={styles.bloco}>
              <Text style={styles.itemLabel}>Pagamento</Text>
              <Text style={styles.valorLabel}>
                {parcelas}x R${(total / parcelas).toFixed(2).replace(".", ",")}
              </Text>
            </View>
          )}

          {metodo === "Pix" && (
            <View style={styles.bloco}>
              <Text style={styles.itemLabel}>Pagamento</Text>
              <Text style={styles.valorLabel}>
                R${total.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão Fixo */}
      <View style={styles.containerBotao}>
        <TouchableOpacity
          style={styles.botao}
          onPress={handleVender}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continua}>Vender</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tudo: {
    flex: 1,
    backgroundColor: "#EAEAEF",
  },
  botaocima: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 180, 180, 0.4)",
  },
  click: {
    alignSelf: "flex-start",
  },
  scrollBody: {
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  caixaMaior: {
    backgroundColor: "#F1F1F5",
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    borderRadius: 18,
  },
  tituloCaixa: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#053225",
    marginBottom: 12,
  },
  inputSeletorCima: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E2E2E8",
    paddingHorizontal: 14,
    height: 38,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D6",
  },
  inputSeletorBaixo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E2E2E8",
    paddingHorizontal: 14,
    height: 38,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  metodoEsquerda: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconeWrapper: {
    marginRight: 8,
  },
  textoValor: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#1A1A1A",
  },
  textoValorParc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#54605C",
  },
  menuOpcoes: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginVertical: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  opcaoItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  opcaoConteudo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textoOpcao: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#1A1A1A",
  },
  opcaoSelecionada: {
    color: "#3EC300",
    fontFamily: "Inter_700Bold",
  },
  lista: {
    marginBottom: 8,
  },
  itensTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    color: "#053225",
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  itemRowEsquerda: {
    flex: 1,
  },
  produtoNome: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#053225",
  },
  produtoPreco: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#053225",
    marginTop: 2,
  },
  controlesDireita: {
    flexDirection: "row",
    alignItems: "center",
  },
  qntdText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#000000",
    marginHorizontal: 14,
  },
  linha: {
    borderTopWidth: 1,
    borderColor: "#A0AAB5",
    marginVertical: 16,
  },
  nota: {
    marginTop: 8,
  },
  resumo: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#053225",
    marginBottom: 16,
  },
  bloco: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 36,
  },
  itemLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#54605C",
  },
  valorLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#053225",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moedaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#053225",
  },
  inputPagamentoDinheiro: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "#053225",
    textAlign: "right",
    minWidth: 50,
    padding: 0,
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
    backgroundColor: "#3EC300",
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
