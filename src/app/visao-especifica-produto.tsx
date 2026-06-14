// ⚠️ AVISO DE ÍCONES: Os ícones devem ser importados exclusivamente do ficheiro `src/theme/icons.js`.
// ⚠️ AVISO FIGMA: Não adivinhem tamanhos de letra ou margens. Olhem sempre a aba 'Tipografia' ou 'Inspect' no Figma.
// Este é o ecrã Pagamento.
// View funciona como uma caixa/estrutura para organizar elementos.
// Text mostra texto na tela.
// StyleSheet serve para criar estilos parecidos com CSS.
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';

type Props = {
  visible: boolean;
  produtoId: string | number;
  onClose: () => void;
  onRefreshList: () => void;
};

export default function VisaoEspecificaProduto({
  visible,
  produtoId,
  onClose,
  onRefreshList,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState(0);
  const [estoque, setEstoque] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);

  // uso com a API
  /*
  useEffect(() => {
    if (visible && produtoId) {
      async function loadProdutoDetalhes(){
        try {
          setLoading(true);
          // const response = await api.get(`/produtos/${produtoId}`);
          // Exemplo de preenchimento dos estados com o retorno da API:
          // setNome(response.data.nome);
          // setPreco(response.data.preco);
          // setEstoque(response.data.estoque);
          // setDescricao(response.data.descricao);
          // setCategorias(response.data.categorias);

          // MOCK para testes locais igual à imagem:
          setNome('Coxinha de Carne');
          setPreco(8.50);
          setEstoque(12);
          setDescricao('Coxinha de carne feita com... carne.');
          setCategorias(['Frito', 'Carne']);
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível carregar os detalhes do produto.');
        } finally {
          setLoading(false);
        }
      }
      loadProdutoDetalhes();
    }
  }, [visible, produtoId]);
  */
 
  // apenas para uso visual
  useEffect(() => {
    setNome('Coxinha de Carne');
    setPreco(8.5);
    setEstoque(12);
    setDescricao('Coxinha de carne feita com carne');
    setCategorias(['Frito', 'Carne']);
  }, []);

  const handleSalvarAlteracoes = async () => {
    try {
      setLoading(true);

      const payload = {
        nome,
        preco,
        estoque,
        descricao,
        categorias,
      };

      Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      onRefreshList();
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar as alterações do produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerIcon}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSalvarAlteracoes}>
            <Text style={styles.headerIcon}>✓</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFF" style={{ flex: 1 }} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}>

            <Text style={styles.productName}>{nome}</Text>
            <Text style={styles.productPrice}>
              R$ {preco.toFixed(2).replace('.', ',')}
            </Text>

            <Text style={styles.sectionTitle}>Estoque</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setEstoque(estoque > 0 ? estoque - 1 : 0)}>
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.counterValue}>{estoque}</Text>

              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setEstoque(estoque + 1)}>
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Categorias</Text>
              <TouchableOpacity style={styles.criarButton}>
                <Text style={styles.criarButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tagsRow}>
              {categorias.map((cat, index) => (
                <Text key={index} style={styles.tagText}>
                  {cat}
                </Text>
              ))}
              <Text style={styles.tagText}>+</Text>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Variações</Text>
              <TouchableOpacity style={styles.criarButton}>
                <Text style={styles.criarButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Descrição</Text>
            <TextInput
              style={styles.descriptionInput}
              multiline
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Escreva algo..."
              placeholderTextColor="#AFAEAE"
            />
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#053225', padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  headerIcon: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  productName: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  sectionTitle: { color: '#FFF', fontSize: 16, marginVertical: 10 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#AFAEAE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: { color: '#053225', fontSize: 24, fontWeight: 'bold' },
  counterValue: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginHorizontal: 25,
  },
  criarButton: {
    backgroundColor: '#AFAEAE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  criarButtonText: { color: '#053225', fontWeight: 'bold', fontSize: 14 },
  tagsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  tagText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginRight: 15 },
  descriptionInput: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
});