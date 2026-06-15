import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Mantém o ecrã de splash visível enquanto as fontes carregam de forma assíncrona
SplashScreen.preventAutoHideAsync();

/**
 * Este é o Root Layout (Layout Principal) da nossa aplicação Ergane.
 * Imaginem que o <Stack> é um baralho de cartas. Cada ecrã que abrimos
 * é uma carta nova colocada no topo do baralho.
 */
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Logout automático: qualquer 401 (token ausente/expirado/segredo trocado)
  // limpa a sessão e volta para o login. Ignora o próprio /login, que trata
  // o 401 de credenciais inválidas na própria tela.
  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      async (err) => {
        const url = err.config?.url ?? "";
        if (err.response?.status === 401 && !url.includes("/login")) {
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("userName");
          router.replace("/login");
        }
        return Promise.reject(err);
      },
    );
    return () => axios.interceptors.response.eject(interceptorId);
  }, []);

  // Se as fontes ainda não carregaram e não há erro, não renderiza a árvore
  // para evitar o efeito visual de texto a piscar ou a mudar de tamanho repentinamente.
  if (!loaded && !error) {
    return null;
  }

  return (
    // 'headerShown: false' remove aquela barra de título feia padrão do telemóvel
    // em todos os ecrãs, para podermos fazer o nosso próprio cabeçalho no Figma.
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. PORTA DE ENTRADA */}
      {/* O ecrã de login é uma carta normal na nossa pilha */}
      <Stack.Screen name="login" />

      {/* 2. ÁREA PRINCIPAL COM RODAPÉ */}
      {/* O grupo "(tabs)" carrega os ecrãs de Home e Produtos, que dividem o mesmo Footer. */}
      <Stack.Screen name="(tabs)" />

      {/* 3. FLUXO DE VENDAS (Ecrãs Inteiros) */}
      <Stack.Screen name="iniciar-venda" />
      <Stack.Screen name="pagamento" />

      {/* 4. MODAIS (Ecrãs Sobrepostos) */}
      {/* A propriedade "presentation: 'modal'" faz a mágica! 
          Em vez de empurrar o ecrã para o lado, ele desliza de baixo para cima,
          ficando por cima da listagem de produtos ou do painel, como no nosso design. */}
      <Stack.Screen
        name="cadastrar-produto"
        options={{ presentation: "modal" }}
      />

      <Stack.Screen
        name="visao-especifica-produto"
        options={{ presentation: "modal" }}
      />

      <Stack.Screen name="detalhes-venda" options={{ presentation: "modal" }} />
    </Stack>
  );
}
