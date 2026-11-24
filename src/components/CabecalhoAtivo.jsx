import { View, Text } from "react-native";
import { VariacaoCustomer } from "./VariacaoCustomer";
import { LogoAtivo } from "./LogoAtivo";

export function CabecalhoAtivo({ ativo }) {
  if (!ativo) return null;

  const ehVariavel = ativo.tipo === "renda_variavel";

  if (ehVariavel) {
    return (
      <View className="flex-row items-center gap-4">
        <LogoAtivo url={ativo.imagem} tamanho={72} />
        <View className="flex-1 gap-0.5">
          <Text className="font-titulo text-3xl text-texto">
            {ativo.ticker}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="font-corpo-bold text-xl text-texto">
              {ativo.valor}
            </Text>
            <View className="flex-row items-center gap-0.5">
              <VariacaoCustomer valor={ativo.variacao} />
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
    </View>
  );
}
