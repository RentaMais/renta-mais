import { Tabs } from "expo-router";
import {
  BankIcon,
  ChartLineUpIcon,
  CurrencyCircleDollarIcon,
  HouseIcon,
  MoneyIcon,
} from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cores } from "@/cores";

const abas = [
  { name: "index", titulo: "Início", Icone: HouseIcon },
  { name: "ativos", titulo: "Ativos", Icone: BankIcon },
  { name: "rentabilidade", titulo: "Renda", Icone: MoneyIcon },
  { name: "proventos", titulo: "Proventos", Icone: CurrencyCircleDollarIcon },
  { name: "simulador", titulo: "Simular", Icone: ChartLineUpIcon },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.texto,
        tabBarInactiveTintColor: cores.inativo,
        tabBarStyle: {
          backgroundColor: cores.container,
          borderTopWidth: 0,
          height: 72 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      {abas.map(({ name, titulo, Icone }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: titulo,
            tabBarLabelStyle: { fontSize: 12, fontFamily: "Lora_400Regular" },
            tabBarIcon: ({ focused, color }) => (
              <Icone
                size={26}
                color={color}
                weight={focused ? "fill" : "regular"}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
