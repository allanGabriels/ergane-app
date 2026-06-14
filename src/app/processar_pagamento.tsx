import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image } from 'react-native';

// O componente agora inicia direto no status 'processando'
export default function App({ navigation }) {
  const [statusVenda, setStatusVenda] = useState('processando');
  const [text, setText] = useState('');

  useEffect(() => {
    let timerId;

    if (statusVenda === 'processando') {
      timerId = setTimeout(() => {
        setStatusVenda('concluida');
      }, 7000);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [statusVenda]);

  useEffect(() => {
    let timerHome;
    if (statusVenda === 'concluida') {
      timerHome = setTimeout(() => {
       
        if (navigation) {
          navigation.navigate('Home');
        } else {
          setStatusVenda('processando');
        }
      }, 2000);
    }
    
    return () => {
      if (timerHome) clearTimeout(timerHome);
    };
  }, [statusVenda, navigation]);

  const handleCancelar = () => {
    
    setStatusVenda('processando');
  };

 
  if (statusVenda === 'processando') {
    return (
      <View style={styles.fundo}>
        <View style={styles.centro}>
          <Text style={styles.texto}>aguardando pagamento</Text>
          <Image source={require('../../assets/images/aa12985c.png')} style={styles.imagem} />
          <TouchableOpacity style={styles.botao} onPress={handleCancelar}>
            <Text style={styles.textoBotao}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  
  if (statusVenda === 'concluida') {
    return (
      <View style={styles.fundo}>
        <View style={styles.centro}>
          <Text style={styles.textoSucesso}>Venda Concluída!</Text>
         
 
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#3ec300',
    justifyContent: 'center',
    alignItems: 'center',     
  },
  centro: {
    width: '80%',            
    padding: 20,              
    borderRadius: 8,          
   
   
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: '#F4F4F6', 
    fontSize: 18,             
    fontWeight: 'bold',
    marginBottom: 15,       
  },
  imagem: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  textoSucesso: {
    color: '#F4F4F6',
    fontSize: 22,
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#053225', 
    borderRadius: 8,
    paddingVertical: 12,    
    paddingHorizontal: 24,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});