import { Ionicons } from "@expo/vector-icons"; // Ícones nativos do Expo
import { Tabs, usePathname, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname(); // Isso descobre em qual aba estamos!

  // Lógica inteligente do botão +
  const handleAddPress = () => {
    if (pathname === "/produtos") {
      router.push("/cadastrar-produto"); // Abre a tela de criar produto
    } else {
      router.push("/iniciar-venda"); // Na Home (ou outras), abre nova venda
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Esconde aquele cabeçalho feio padrão
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#7A8B85",
        tabBarShowLabel: false, // Deixa só os ícones para ficar mais minimalista
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          ),
        }}
      />

      {/* O nosso Botão Mágico (+) no centro */}
      <Tabs.Screen
        name="add" // Esse nome não importa porque vamos sobrescrever o botão
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddPress}
              style={styles.fabContainer}
            >
              <View style={styles.fab}>
                <Ionicons name="add" size={32} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="produtos"
        options={{
          title: "Produtos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cube-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#053225", // O verde escuro do seu design
    borderTopWidth: 0,
    elevation: 10,
    height: 70,
    paddingBottom: 10,
  },
  fabContainer: {
    top: -20, // Faz o botão "subir" e sair um pouco da barra
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0C7858", // Verde mais claro
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
