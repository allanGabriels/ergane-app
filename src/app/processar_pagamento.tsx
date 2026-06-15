// Tela de processamento de pagamento (Pix / Cartão).
// Registra a venda na API enquanto mostra "aguardando pagamento" e, ao concluir,
// exibe "Venda Concluída!" e volta para a home.
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProcessarPagamento() {
  const router = useRouter();
  const { dados } = useLocalSearchParams();
  const [statusVenda, setStatusVenda] = useState<"processando" | "concluida">(
    "processando",
  );

  // Registra a venda enquanto exibe "aguardando pagamento".
  useEffect(() => {
    let cancelado = false;

    async function registrarVenda() {
      try {
        const payload = JSON.parse(dados as string);
        const token = await AsyncStorage.getItem("userToken");

        await axios.post("https://ergane-api.onrender.com/vendas", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelado) setStatusVenda("concluida");
      } catch (error: any) {
        if (cancelado) return;
        const msg =
          error?.response?.data?.erro ?? "Não foi possível registrar a venda.";
        Alert.alert("Erro", msg);
        router.back();
      }
    }

    registrarVenda();
    return () => {
      cancelado = true;
    };
  }, [dados]);

  // Depois de concluída, volta para a home (atualizando o dashboard).
  useEffect(() => {
    if (statusVenda !== "concluida") return;

    const timerHome = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2000);

    return () => clearTimeout(timerHome);
  }, [statusVenda]);

  if (statusVenda === "processando") {
    return (
      <View style={styles.fundo}>
        <View style={styles.centro}>
          <Text style={styles.texto}>aguardando pagamento</Text>
          <Image
            source={require("../../assets/images/aa12985c.png")}
            style={styles.imagem}
          />
          <TouchableOpacity style={styles.botao} onPress={() => router.back()}>
            <Text style={styles.textoBotao}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fundo}>
      <View style={styles.centro}>
        <Text style={styles.textoSucesso}>Venda Concluída!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: "#3ec300",
    justifyContent: "center",
    alignItems: "center",
  },
  centro: {
    width: "80%",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    color: "#F4F4F6",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  imagem: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    resizeMode: "contain",
  },
  textoSucesso: {
    color: "#F4F4F6",
    fontSize: 22,
    fontWeight: "bold",
  },
  botao: {
    backgroundColor: "#053225",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  textoBotao: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
