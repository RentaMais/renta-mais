import { View, Text, Image } from "react-native";
import { CaretUpIcon, CaretDownIcon } from "phosphor-react-native";
import { cores } from "@/cores";

// Import das imagens
import itauImg from "@/mocks/assets/itau.jpg";
import petrobrasImg from "@/mocks/assets/petrobras.jpg";
import valeImg from "@/mocks/assets/vale.jpg";

const imagensAtivos = {
  "itau.jpg": itauImg,
  "petrobras.jpg": petrobrasImg,
  "vale.jpg": valeImg,
};

export function CabecalhoAtivo({ ativo }) {
  if (!ativo) return null;

  const ehVariavel = ativo.tipo === "renda_variavel";

  if (ehVariavel) {
    const ehPositivo = !ativo.variacao?.startsWith("-");

    return (
      <View className="flex-row items-center gap-4">
        {ativo.imagem && imagensAtivos[ativo.imagem] && (
          <Image
            source={imagensAtivos[ativo.imagem]}
            style={{
              width: 72,
              height: 72,
            }}
            className="rounded-lg border border-texto/10 bg-card"
            resizeMode="cover"
          />
        )}
        <View className="flex-1 gap-0.5">
          <Text className="font-titulo text-3xl text-texto">
            {ativo.ticker}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="font-corpo-bold text-xl text-texto">
              {ativo.valor}
            </Text>
            <View className="flex-row items-center gap-0.5">
              {ehPositivo ? (
                <CaretUpIcon size={12} weight="fill" color={cores.positivo} />
              ) : (
                <CaretDownIcon size={12} weight="fill" color={cores.negativo} />
              )}
              <Text
                className={`font-corpo-medium text-xs ${
                  ehPositivo ? "text-positivo" : "text-negativo"
                }`}
              >
                {ativo.variacao}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-1">
      <Text className="font-titulo text-3xl text-texto">{ativo.nome}</Text>
      <Text className="font-corpo-bold text-xl text-texto">{ativo.valor}</Text>
      <View className="flex-row items-center justify-between mt-1">
        <Text className="font-corpo text-xs text-inativo">{ativo.taxa}</Text>
        <Text className="font-corpo text-xs text-inativo">
          {"Data de vencimento: " + ativo.vencimento}
        </Text>
      </View>
    </View>
  );
}
