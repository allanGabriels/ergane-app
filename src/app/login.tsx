import React, { useState } from 'react';
import {StyleSheet, Text, View, Image, ImageBackground, TextInput, TouchableOpacity, Alert, ActivityIndicator,} from 'react-native';

import axios from 'axios';

export default function App() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const imagemFundo = { uri: 'https://lh5.googleusercontent.com/proxy/eEiMG7Hv11WwI8whsyj5KqjpJF2NnrlJm6IZ4_Y7TgRxEJkT3w_-UnVy1YvLJzUCAGUs-h7_QjONRHUEKYP3wOoJ3A4PloFNz8QCJSPhdL174KEuQM0t2V0' };
  const imagemLogo = { uri: 'https://images.seeklogo.com/logo-png/59/1/atacadao-logo-png_seeklogo-593562.png' };

  async function handleLogin() {
    if (!cpf || !senha) {
      Alert.alert(
        'Erro',
        'Preencha o CPF e a Senha para continuar.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        'https://sua-api.com/login',
        {
          cpf,
          senha,
        }
      );

      Alert.alert(
        'Sucesso',
        'Login realizado com sucesso!'
      );

      console.log(response.data);

    } catch (error) {

      if (error.response?.status === 401) {
        Alert.alert(
          'Erro',
          'CPF ou senha incorretos.'
        );
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível conectar ao servidor.'
        );
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source = {imagemFundo}
      style = {styles.imagemFundo}
    >
      <View style = {styles.degrade}/>
      <View style = {styles.tudo}>

        <View style = {styles.cabecalho}>
          <Image source = {imagemLogo} style = {styles.logo}/>
          <Text style = {styles.nome}>Ergane</Text>
        </View>

        <View style={styles.login}>
          <TextInput
            style={styles.input}
            placeholder = 'CPF'
            placeholderTextColor = '#053225A1'
            value = {cpf}
            onChangeText = {setCpf}
            keyboardType = "numeric"
          />
          <TextInput
            style={styles.input}
            placeholder = 'Senha'
            placeholderTextColor = '#053225A1'
            value = {senha}
            onChangeText = {setSenha}
            secureTextEntry = {true}
          />
          <TouchableOpacity style = {[styles.botao,loading]}
            onPress = {handleLogin}
            disabled = {loading}
          >
            {loading ? (
              <ActivityIndicator color = '#FFFFFF'/>
            ) : (
              <Text style = {styles.entrar}>
                Entrar
              </Text>
            )}
          </TouchableOpacity>
        </View>

      </View> 
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imagemFundo: {
    flex: 1,
  },
  degrade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 50, 37, 0.75)',
  },
  tudo: {
    flex: 1,
  },
  cabecalho: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    margin: 20
  },
  nome: {
    color: '#FFFFFF',
    fontSize: 40,
  },
  login: {
    flex: 1,
    justifyContent: 'center'
  },
  input: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingLeft: 20,
    marginHorizontal: 50,
    marginBottom: 15,
    backgroundColor: '#D9D9D9'
  },
  botao: {
    borderRadius: 18,
    paddingVertical: 12,
    marginHorizontal: 50,
    marginBottom: 15,
    backgroundColor: '#0C7858',
    alignItems: 'center'
  },
  entrar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});