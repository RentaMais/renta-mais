import "../../global.css";


import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="adicionar-ativo"
        options={{
          presentation: "modal",
          headerShown: false,
          title: "Adicionar ativo",
        }}
      />
    </Stack>
  );
}
