import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router, Tabs, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { PALETA } from "../../constants/theme";
import {
  BagIcon,
  ChartIcon,
  HomeIcon,
  PlusIcon,
  SettingsIcon,
} from "../../theme/icons";

function FooterMenu() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  const larguraBase = Math.min(width, 412);
  const escala = larguraBase / 412;

  const homeSelecionado = pathname === "/(tabs)"; // Ajustado para o nome da pasta tabs
  const produtosSelecionado = pathname.includes("produtos");

  // Lógica Dinâmica: O '+' muda de comportamento conforme a tela
  const handlePlusPress = () => {
    if (pathname === "/(tabs)") {
      router.push("/iniciar-venda");
    } else if (pathname.includes("produtos")) {
      router.push("/cadastrar-produto");
    } else {
      router.push("/iniciar-venda");
    }
  };

  return (
    <View
      style={[
        styles.footer,
        {
          width: larguraBase,
          height: 88 * escala,
          alignSelf: "center",
          paddingHorizontal: 28 * escala,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push("/(tabs)")}
      >
        <HomeIcon
          size={36 * escala}
          color={homeSelecionado ? PALETA.roxo : PALETA.preto}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push("/(tabs)/produtos")}
      >
        <BagIcon
          size={36 * escala}
          color={produtosSelecionado ? PALETA.roxo : PALETA.preto}
        />
      </TouchableOpacity>

      {/* Botão Central Dinâmico */}
      <TouchableOpacity
        style={[
          styles.plusButton,
          {
            width: 56 * escala,
            height: 56 * escala,
            borderRadius: 28 * escala,
            marginBottom: 26 * escala,
          },
        ]}
        onPress={handlePlusPress}
      >
        <PlusIcon size={38 * escala} color={PALETA.branco} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() =>
          Alert.alert("Aviso", "Funcionalidade em desenvolvimento")
        }
      >
        <ChartIcon size={36 * escala} color={PALETA.preto} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() =>
          Alert.alert("Aviso", "Funcionalidade em desenvolvimento")
        }
      >
        <SettingsIcon size={36 * escala} color={PALETA.preto} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabsLayout() {
  // Guarda de autenticação: sem token salvo, redireciona para o login em vez
  // de renderizar a home (que dispara chamadas protegidas e quebra com 401).
  const [auth, setAuth] = useState<"loading" | "authed" | "guest">("loading");

  useEffect(() => {
    AsyncStorage.getItem("userToken").then((token) =>
      setAuth(token ? "authed" : "guest"),
    );
  }, []);

  if (auth === "loading") return null;
  if (auth === "guest") return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={() => <FooterMenu />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="produtos" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: PALETA.branco,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  plusButton: {
    backgroundColor: PALETA.verdeFolha,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
