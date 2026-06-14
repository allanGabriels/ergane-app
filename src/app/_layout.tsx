// ⚠️ AVISO DE ÍCONES: Os ícones devem ser importados exclusivamente do ficheiro `src/theme/icons.js`.
// ⚠️ AVISO FIGMA: Não adivinhem tamanhos de letra ou margens. Olhem sempre a aba 'Tipografia' ou 'Inspect' no Figma.

import { Stack } from "expo-router";

/**
 * Este é o Root Layout (Layout Principal) da nossa aplicação Ergane.
 * Imaginem que o <Stack> é um baralho de cartas. Cada ecrã que abrimos
 * é uma carta nova colocada no topo do baralho.
 */
export default function RootLayout() {
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
