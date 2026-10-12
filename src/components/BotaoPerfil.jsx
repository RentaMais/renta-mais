import { Pressable } from "react-native";
import { User } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { cores } from "@/cores";

export function BotaoPerfil({ tamanho = 42, className = "" }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/configuracoes")}
      style={{ width: tamanho, height: tamanho }}
      className={`items-center justify-center rounded-full bg-texto active:opacity-80 ${className}`}
    >
      <User size={tamanho * 0.55} color={cores.fundo} weight="bold" />
    </Pressable>
  );
}
