import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="rentabilidade" options={{ title: "Rentabilidade" }} />
      <Tabs.Screen name="proventos" options={{ title: "Proventos" }} />
      <Tabs.Screen name="simulador" options={{ title: "Simulador" }} />
    </Tabs>
  );
}
