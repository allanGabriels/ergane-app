// ⚠️ AVISO DE ÍCONES: Os ícones devem ser importados exclusivamente do ficheiro `src/theme/icons.js`.
// ⚠️ AVISO FIGMA: Não adivinhem tamanhos de letra ou margens. Olhem sempre a aba 'Tipografia' ou 'Inspect' no Figma.
// Este ficheiro guarda as rotas que partilham o rodapé.
// Tabs vem do Expo Router e cria a navegação por separadores.
import { Tabs } from "expo-router";

// TabsLayout é o layout das páginas que vivem no rodapé.
export default function TabsLayout() {
  // Tabs mostra as rotas do grupo `(tabs)`.
  return <Tabs />;
}
