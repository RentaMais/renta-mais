import { View } from "react-native";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { BotaoPerfil } from "@/components/BotaoPerfil";

export function CabecalhoPrincipal({ subtitulo, titulo, descricao }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <CabecalhoTela
          subtitulo={subtitulo}
          titulo={titulo}
          descricao={descricao}
        />
      </View>
      <BotaoPerfil />
    </View>
  );
}
