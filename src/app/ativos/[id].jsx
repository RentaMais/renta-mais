import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { VoltarCustomer } from "@/components/VoltarCustomer";
import { CabecalhoAtivo } from "@/components/CabecalhoAtivo";
import { BotaoCustomer } from "@/components/BotaoCustomer";

import { buscarAtivo } from "@/services/ativosService";
import { formatarMoeda } from "@/utils/formatarMoeda";
import { TelaCustomer } from "@/components/TelaCustomer";

function ItemInformacao({ rotulo, valor }) {
  return (
    <View className="flex-row items-center justify-between border-t border-texto/10 py-3">
      <Text className="font-corpo text-base text-subtexto">{rotulo}</Text>
      <Text className="font-corpo-bold text-base text-texto">{valor}</Text>
    </View>
  );
}

function SecaoInformacoes({ informacoes }) {
  return (
    <View className="rounded-2xl bg-card p-5">
      <Text className="pb-3 font-titulo text-lg text-primaria">
        Informações
      </Text>
      {informacoes.map((item) => (
        <ItemInformacao
          key={item.rotulo}
          rotulo={item.rotulo}
          valor={item.valor}
        />
      ))}
    </View>
  );
}

export default function DetalheAtivoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const ativo = buscarAtivo(id);

  const ehVariavel = ativo?.tipo === "renda_variavel";

  const informacoes = ehVariavel
    ? [
        { rotulo: "Quantidade", valor: `${ativo.quantidade} un` },
        { rotulo: "Preço médio", valor: formatarMoeda(ativo.precoMedio) },
        {
          rotulo: "Valor investido",
          valor: formatarMoeda(ativo.quantidade * ativo.precoMedio),
        },
        { rotulo: "Valor atual", valor: ativo.valor },
      ]
    : [
        { rotulo: "Taxa", valor: ativo.taxa },
        { rotulo: "Vencimento", valor: ativo.vencimento },
        { rotulo: "Valor investido", valor: formatarMoeda(ativo.valorInicial) },
      ];

  return (
    <TelaCustomer className="justify-between">
      <View className="gap-4">
        <VoltarCustomer />
        <CabecalhoAtivo ativo={ativo} />
        <SecaoInformacoes informacoes={informacoes} />
      </View>

      <BotaoCustomer
        titulo={ehVariavel ? "Vender ativo" : "Resgatar ativo"}
        onPress={() =>
          router.push({
            pathname: "/ativos/operacao",
            params: { id: ativo.id },
          })
        }
      />
    </TelaCustomer>
  );
}
