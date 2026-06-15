import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  // Estados para controlar o método e a quantidade de parcelas
  const [metodo, setMetodo] = useState("Dinheiro");
  const [parcelas, setParcelas] = useState("1x 25,50");

  // Controlam a abertura dos menus de opções
  const [showMetodos, setShowMetodos] = useState(false);
  const [showParcelas, setShowParcelas] = useState(false);

  // Mapeamento de ícones para cada método
  const getIcone = (tipo) => {
    if (tipo === "Dinheiro") return "💵";
    if (tipo === "Crédito") return "💳";
    return "⚡";
  };

  return (
    <View style={styles.tudo}>
      <View style={styles.botaocima}>
        <TouchableOpacity style={styles.click}>
          <Text style={styles.voltar}>X</Text>
        </TouchableOpacity>
      </View>

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
            <Text style={styles.iconeMetodo}>{getIcone(metodo)}</Text>
            <Text style={styles.textoValor}>{metodo}</Text>
          </View>
          <Text style={styles.setaDireita}>&gt;</Text>
        </TouchableOpacity>

        {showMetodos && (
          <View style={styles.menuOpcoes}>
            {["Dinheiro", "Crédito", "Pix"].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcaoItem}
                onPress={() => {
                  setMetodo(item);
                  setShowMetodos(false);
                }}
              >
                <Text
                  style={[
                    styles.textoOpcao,
                    metodo === item && styles.opcaoSelecionada,
                  ]}
                >
                  {getIcone(item)} {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.inputSeletorBaixo}
          onPress={() => {
            setShowParcelas(!showParcelas);
            setShowMetodos(false);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.textoValor}>{parcelas}</Text>
          <Text style={styles.setaDireita}>&gt;</Text>
        </TouchableOpacity>

        {showParcelas && (
          <View style={styles.menuOpcoes}>
            {["1x 25,50", "2x 12,75", "3x 8,50"].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.opcaoItem}
                onPress={() => {
                  setParcelas(item);
                  setShowParcelas(false);
                }}
              >
                <Text
                  style={[
                    styles.textoOpcao,
                    parcelas === item && styles.opcaoSelecionada,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.lista}>
        <Text style={styles.itens}>Itens</Text>

        <View style={styles.card}>
          <Text style={styles.produto}>Coxinha de Carne</Text>
          <Text style={styles.deleta}>lixo</Text>
          <Text style={styles.qntd}>3</Text>
          <Text style={styles.adiciona}>+</Text>
        </View>
        <Text style={styles.preco}>R$8,50</Text>
      </View>

      <View style={styles.linha}></View>

      <View style={styles.nota}>
        <Text style={styles.resumo}>Resumo</Text>

        <View style={styles.bloco}>
          <Text style={styles.item}>Total</Text>
          <Text style={styles.valor}>R$25,50</Text>
        </View>

        <View style={styles.bloco}>
          <Text style={styles.item}>Pagamento</Text>
          <Text style={styles.valor}>R$50,00</Text>
        </View>

        <View style={styles.bloco}>
          <Text style={styles.item}>Troco</Text>
          <Text style={styles.valor}>R$24,50</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.botao}>
        <Text style={styles.continua}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tudo: {
    flex: 1,
    backgroundColor: "#F4F4F6",
  },
  botaocima: {
    maxHeight: 60,
    marginTop: 12,
    marginLeft: 10,
  },
  voltar: {
    fontSize: 30,
    color: "#053225",
  },

  caixaMaior: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 12,
    marginVertical: 15,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tituloCaixa: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 14,
  },
  inputSeletorCima: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EAEAEB",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 4,
  },
  inputSeletorBaixo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EAEAEB",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  metodoEsquerda: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconeMetodo: {
    fontSize: 15,
    marginRight: 10,
  },
  textoValor: {
    fontSize: 16,
    color: "#000000",
  },
  setaDireita: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
  },
  menuOpcoes: {
    backgroundColor: "#F4F4F6",
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    overflow: "hidden",
  },
  opcaoItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  textoOpcao: {
    fontSize: 16,
    color: "#333333",
  },
  opcaoSelecionada: {
    color: "#3EC300",
    fontWeight: "bold",
  },
  lista: {
    flex: 2,
    marginLeft: 10,
  },
  itens: {
    fontSize: 18,
    color: "#053225",
  },
  card: {
    flexDirection: "row",
    marginTop: 10,
  },
  produto: {
    fontWeight: "bold",
    marginRight: 100,
  },
  deleta: {
    marginRight: 20,
  },
  qntd: {
    marginRight: 20,
  },
  adiciona: {
    marginRight: 20,
  },
  preco: {
    fontSize: 16,
  },
  linha: {
    borderTopWidth: 1,
    marginHorizontal: 20,
  },
  botao: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  continua: {
    borderRadius: 10,
    paddingHorizontal: 100,
    paddingVertical: 10,
    backgroundColor: "#3EC300",
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
  },
  nota: {
    marginLeft: 10,
    marginTop: 25,
  },
  resumo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bloco: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  item: {
    color: "#053225",
  },
  valor: {
    color: "#053225",
    marginRight: 10,
  },
});
