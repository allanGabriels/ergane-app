import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type MetodoPagamento = 'PIX' | 'DINHEIRO' | 'CARTAO';

type Item = {
  nome: string;
  quantidade: number;
  precoUnitario: string;
  precoTotal: string;
};

type Venda = {
  nomeCliente: string;
  valorTotal: string;
  dataHora: string;
  itens: Item[];
  metodo: MetodoPagamento;
  valorRecebido?: string;
  troco?: string;
  modalidadeCartao?: string;
  valorParcela?: string;
};

type Props = {
  venda?: Venda;
  onClose: () => void;
};

const METODOS: MetodoPagamento[] = ['PIX', 'DINHEIRO', 'CARTAO'];

const LABELS: Record<MetodoPagamento, string> = {
  PIX: 'PIX',
  DINHEIRO: 'Dinheiro',
  CARTAO: 'Cartão',
};

const vendaMock: Venda = {
  nomeCliente: 'João Choma',
  valorTotal: '27,50',
  dataHora: '19 MAI 2026 14:52',
  itens: [
    { nome: 'Coxinha de Carne', quantidade: 3, precoUnitario: '8,50', precoTotal: '25,50' },
    { nome: 'Coquinha', quantidade: 1, precoUnitario: '2,00', precoTotal: '2,00' },
  ],
  metodo: 'PIX',
  valorRecebido: '50,00',
  troco: '24,50',
  modalidadeCartao: 'Parcelado em 2X',
  valorParcela: '13,75',
};

export default function DetalhesVenda({ venda = vendaMock, onClose }: Props) {
  const [metodoAtivo, setMetodoAtivo] = useState<MetodoPagamento>(venda.metodo);

  const renderMetodoPagamento = () => {
    switch (metodoAtivo) {
      case 'DINHEIRO':
        return (
          <View style={styles.metodoInfo}>
            <Text style={styles.metodoTitulo}>Dinheiro</Text>
            <View style={styles.metodoRow}>
              <Text style={styles.metodoDetalhe}>Recebido: R$ {venda.valorRecebido}</Text>
              <Text style={styles.metodoDetalhe}>Devolvido: R$ {venda.troco}</Text>
            </View>
          </View>
        );
      case 'CARTAO':
        return (
          <View style={styles.metodoInfo}>
            <Text style={styles.metodoTitulo}>Cartão</Text>
            <View style={styles.metodoRow}>
              <Text style={styles.metodoDetalhe}>{venda.modalidadeCartao}</Text>
              <Text style={styles.metodoDetalhe}>R$ {venda.valorParcela}</Text>
            </View>
          </View>
        );
      case 'PIX':
      default:
        return (
          <View style={styles.metodoInfo}>
            <Text style={styles.metodoTitulo}>PIX</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.headerSection}>
          <Text style={styles.title}>{venda.nomeCliente}</Text>
          <Text style={styles.title}>R$ {venda.valorTotal}</Text>
          <Text style={styles.date}>{venda.dataHora}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Itens</Text>
          {venda.itens.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemQtd}> - {item.quantidade}X</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemPrecoUnit}>R${item.precoUnitario}</Text>
                <Text style={styles.itemPrecoTotal}>R${item.precoTotal}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Método</Text>

          <View style={styles.toggleContainer}>
            {METODOS.map((metodo) => (
              <TouchableOpacity
                key={metodo}
                style={[
                  styles.toggleButton,
                  metodoAtivo === metodo && styles.toggleButtonAtivo,
                ]}
                onPress={() => setMetodoAtivo(metodo)}
              >
                <Text
                  style={[
                    styles.toggleLabel,
                    metodoAtivo === metodo && styles.toggleLabelAtivo,
                  ]}
                >
                  {LABELS[metodo]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderMetodoPagamento()}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const VERDE = '#053225';
const BG = '#F4F4F6';
const CINZA = '#9999A1';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    paddingBottom: 40,
  },
  closeButton: {
    padding: 20,
    alignSelf: 'flex-start',
  },
  closeIcon: {
    fontSize: 26,
    color: VERDE,
    fontWeight: '500',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: VERDE,
    lineHeight: 34,
  },
  date: {
    fontSize: 13,
    color: CINZA,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E6',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: CINZA,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemNome: {
    fontSize: 15,
    fontWeight: '700',
    color: VERDE,
  },
  itemQtd: {
    fontSize: 15,
    color: VERDE,
  },
  itemRight: {
    flexDirection: 'row',
    gap: 12,
  },
  itemPrecoUnit: {
    fontSize: 13,
    color: CINZA,
    minWidth: 48,
    textAlign: 'right',
  },
  itemPrecoTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: VERDE,
    minWidth: 48,
    textAlign: 'right',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E4E4EA',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonAtivo: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleLabel: {
    fontSize: 13,
    color: CINZA,
    fontWeight: '500',
  },
  toggleLabelAtivo: {
    color: VERDE,
    fontWeight: '700',
  },
  metodoInfo: {
    minHeight: 40,
  },
  metodoTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: VERDE,
  },
  metodoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metodoDetalhe: {
    fontSize: 14,
    color: VERDE,
    fontWeight: '500',
  },
});