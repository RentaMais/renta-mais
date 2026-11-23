import { Text, View, Pressable, TextInput, Dimensions } from "react-native";
import { Dot } from "phosphor-react-native";
import { LineChart } from "react-native-chart-kit";
import { CabecalhoPrincipal } from "@/components/CabecalhoPrincipal";
import { TelaCustomer } from "@/components/TelaCustomer";
import { CardCustomer } from "@/components/CardCustomer";
import { SwitchCustomer } from "@/components/SwitchCustomer";
import { TituloCardCustomer } from "@/components/TituloCardCustomer";
import { useSimulador } from "@/hooks/useSimulador";
import { formatarEixoSimulador } from "@/utils/calculosSimulador";
import { formatarMoeda } from "@/utils/formatadores";
import { cores } from "@/cores";

const CORES_PERFIL = {
  arrojado: cores.texto,
  moderado: cores.primaria,
  conservador: cores.positivo,
};

const larguraTela = Dimensions.get("window").width * 0.85 - 32;

export default function SimuladorScreen() {
  const {
    aporteInicial,
    alterarAporteInicial,
    aporteMensal,
    alterarAporteMensal,
    rentabilidade,
    alterarRentabilidade,
    opcoesAnos,
    tempoSelecionado,
    setTempoSelecionado,
    descontarInflacao,
    setDescontarInflacao,
    perfis,
    grafico,
  } = useSimulador();

  const campos = [
    {
      id: "aporte-inicial",
      titulo: "Aporte inicial",
      placeholder: "R$ 10.000",
      value: aporteInicial,
      onChangeText: alterarAporteInicial,
    },
    {
      id: "aporte-mensal",
      titulo: "Aporte mensal",
      placeholder: "R$ 1.000",
      value: aporteMensal,
      onChangeText: alterarAporteMensal,
    },
    {
      id: "rentabilidade",
      titulo: "Rentabilidade da renda fixa (a.a.)",
      placeholder: "11,5%",
      value: rentabilidade,
      onChangeText: alterarRentabilidade,
    },
  ];

  const dadosGrafico = {
    labels: grafico.labels,
    datasets: [
      {
        data: grafico.series.arrojado,
        color: () => CORES_PERFIL.arrojado,
        strokeWidth: 3,
      },
      {
        data: grafico.series.moderado,
        color: () => CORES_PERFIL.moderado,
        strokeWidth: 3,
      },
      {
        data: grafico.series.conservador,
        color: () => CORES_PERFIL.conservador,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <TelaCustomer>
      <CabecalhoPrincipal
        subtitulo="Planejamento futuro"
        titulo="Simule décadas"
        descricao="Projeção de patrimônio em até 40 anos"
      />

      <CardCustomer className="gap-5">
        {campos.map((campo) => (
          <View key={campo.id} className="w-full gap-1">
            <Text className="font-corpo-bold text-base text-texto">
              {campo.titulo}
            </Text>
            <View className="border-b border-dashed border-primaria/50 pb-1">
              <TextInput
                placeholder={campo.placeholder}
                placeholderTextColor={cores.placeholder}
                value={campo.value}
                onChangeText={campo.onChangeText}
                keyboardType="numeric"
                style={{ outlineStyle: "none" }}
                className="font-corpo text-lg text-primaria"
              />
            </View>
          </View>
        ))}

        <View className="w-full gap-2">
          <Text className="font-corpo-bold text-base text-texto">
            Tempo de investimento
          </Text>
          <View className="flex-row justify-between gap-2">
            {opcoesAnos.map((anos) => (
              <Pressable
                key={anos}
                onPress={() => setTempoSelecionado(anos)}
                className={`flex-1 h-11 items-center justify-center rounded-xl border ${
                  tempoSelecionado === anos
                    ? "bg-texto border-texto"
                    : "bg-container border-texto/30"
                }`}
              >
                <Text
                  className={`font-corpo-bold text-sm ${
                    tempoSelecionado === anos ? "text-fundo" : "text-texto"
                  }`}
                >
                  {anos} anos
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </CardCustomer>

      <CardCustomer className="flex-row items-center justify-between">
        <View className="flex-1 pr-4 gap-1">
          <TituloCardCustomer titulo="Descontar inflação" />

          <Text className="font-corpo text-sm text-texto">
            Mostra os valores em poder de compra de hoje (IPCA projetado de 4%
            a.a.)
          </Text>
        </View>
        <SwitchCustomer
          value={descontarInflacao}
          onValueChange={setDescontarInflacao}
        />
      </CardCustomer>

      <CardCustomer className="gap-5">
        <TituloCardCustomer titulo="Patrimônio projetado" />

        <View className="items-center -ml-4">
          <LineChart
            data={dadosGrafico}
            width={larguraTela + 20}
            height={180}
            formatYLabel={(v) => formatarEixoSimulador(v)}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "transparent",
              backgroundGradientTo: "transparent",
              decimalPlaces: 0,
              color: () => cores.texto,
              labelColor: () => cores.subtexto,
            }}
            withDots={false}
            withShadow={false}
          />
        </View>

        <View className="divide-y divide-texto/10">
          {perfis.map((perfil) => (
            <View key={perfil.id} className="py-3 gap-1">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Dot
                    size={24}
                    color={CORES_PERFIL[perfil.id]}
                    weight="fill"
                  />
                  <Text className="font-corpo-bold text-base text-texto">
                    {perfil.nome}
                  </Text>
                </View>
                <Text className="font-corpo-bold text-sm text-texto">
                  {formatarMoeda(perfil.valor)}
                </Text>
              </View>
              <Text className="font-corpo text-xs text-subtexto pl-8">
                {perfil.descricao}
              </Text>
            </View>
          ))}
        </View>
      </CardCustomer>

      {descontarInflacao && (
        <Text className="font-corpo text-xs text-subtexto text-center">
          Valores acima já descontam a inflação projetada. Desative a opção para
          ver os valores nominais.
        </Text>
      )}
    </TelaCustomer>
  );
}
