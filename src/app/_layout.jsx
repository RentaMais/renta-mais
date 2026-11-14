import "../../global.css";

import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { fontes } from "@/fontes";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { observarEstadoAuth } from "@/services/authService";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontes);
  const [usuario, setUsuario] = useState(undefined);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const cancelarObservador = observarEstadoAuth((user) => {
      setUsuario(user);
    });
    return cancelarObservador;
  }, []);

  useEffect(() => {
    if (fontsLoaded && usuario !== undefined) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, usuario]);

  useEffect(() => {
    if (!fontsLoaded || usuario === undefined) return;

    const telaAuth = segments[0] === "(auth)";

    if (!usuario && !telaAuth) {
      router.replace("/(auth)/login");
    } else if (usuario && telaAuth) {
      router.replace("/(tabs)");
    }
  }, [usuario, fontsLoaded, segments, router]);

  if (!fontsLoaded || usuario === undefined) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="ativos/novo"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
