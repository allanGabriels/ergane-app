import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  return (
    <View style={styles.tudo}>
      <View style={styles.botaocima}>
        <TouchableOpacity style={styles.click}>
          <Text style={styles.voltar}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cliente}>
        <Text style={styles.nome}>Nome Cliente</Text>
        <Text style={styles.cpf}>Cpf (opcional)</Text>
      </View>

      <View style={styles.pesquisa}>
        <Text style={styles.produtos}>Produtos</Text>
        <TextInput style={styles.barra} placeholder="Pesquisar" />
        <FlatList />
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
    flex: 1,
    marginTop: 12,
    marginLeft: 10,
  },
  voltar: {
    fontSize: 30,
    color: "#053225",
  },
  cliente: {
    flex: 1,
    marginLeft: 10,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0532259C",
  },
  cpf: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0532259C",
  },
  pesquisa: {
    flex: 1,
    marginLeft: 10,
  },
  produtos: {
    marginBottom: 12,
    marginLeft: 2,
  },
  barra: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
  },
  lista: {
    flex: 1,
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
  botao: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
