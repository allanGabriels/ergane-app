// ⚠️ AVISO DE ÍCONES: Os ícones devem ser importados exclusivamente do ficheiro `src/theme/icons.js`.
// ⚠️ AVISO FIGMA: Não adivinhem tamanhos de letra ou margens. Olhem sempre a aba 'Tipografia' ou 'Inspect' no Figma.
// Este é um ecrã modal que abre por cima dos outros.
// View funciona como uma caixa/estrutura para organizar elementos.
// Text mostra texto na tela.
// StyleSheet serve para criar estilos parecidos com CSS.
import { StyleSheet, Text, View } from "react-native";

// VisaoEspecificaProdutoScreen é um componente funcional simples.
export default function VisaoEspecificaProdutoScreen() {
  // A View centraliza o conteúdo do ecrã.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visão Específica de Produto</Text>
    </View>
  );
}

// styles guarda os estilos deste ecrã.
const styles = StyleSheet.create({
  // container centraliza tudo na horizontal e vertical.
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // title define o aspeto do texto do ecrã.
  title: {
    fontSize: 24,
  },
});
