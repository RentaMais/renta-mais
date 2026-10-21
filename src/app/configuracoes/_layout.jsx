import { Stack } from "expo-router";

export default function ConfiguracoesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="editar-perfil" />
      <Stack.Screen name="alterar-senha" />
      <Stack.Screen name="central" />
      <Stack.Screen name="excluir-conta" />
    </Stack>
  );
}
