import { Tabs, router, usePathname } from "expo-router";
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

  const homeSelecionado = pathname === "/";
  const produtosSelecionado = pathname.includes("produtos");

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
        onPress={() => router.push("/")}
      >
        <HomeIcon
          size={36 * escala}
          color={homeSelecionado ? PALETA.roxo : PALETA.preto}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => router.push("/produtos")}
      >
        <BagIcon
          size={36 * escala}
          color={produtosSelecionado ? PALETA.roxo : PALETA.preto}
        />
      </TouchableOpacity>

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
        onPress={() => router.push("/cadastrar-produto")}
      >
        <PlusIcon size={38 * escala} color={PALETA.branco} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() =>
          Alert.alert("Aviso", "Funcionalidade ainda em desenvolvimento")
        }
      >
        <ChartIcon size={36 * escala} color={PALETA.preto} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabButton}
        onPress={() =>
          Alert.alert("Aviso", "Funcionalidade ainda em desenvolvimento")
        }
      >
        <SettingsIcon size={36 * escala} color={PALETA.preto} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabsLayout() {
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
  },

  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },

  plusButton: {
    backgroundColor: PALETA.verdeFolha,
    alignItems: "center",
    justifyContent: "center",
  },
});