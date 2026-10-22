import { View, Text, ScrollView, Dimensions, Pressable } from "react-native";
import { useState } from "react";
import { Eye, EyeSlash, CaretUp } from "phosphor-react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle, G } from "react-native-svg";

import { CabecalhoTela } from "@/components/CabecalhoTela";
import { BotaoPerfil } from "@/components/BotaoPerfil";
import { cores } from "@/cores";

import { formatarMil } from "@/utils/formatarMil";
import inicioData from "@/mocks/inicio.json";

const larguraTela = Dimensions.get("window").width;
const larguraGrafico = larguraTela * 0.85;

const TAMANHO_ROSCA = 140;
const ESPESSURA_ROSCA = 28;
const RAIO_ROSCA = (TAMANHO_ROSCA - ESPESSURA_ROSCA) / 2;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO_ROSCA;

// react-native-chart-kit não desenha gráfico de rosca, então usamos SVG direto
function Rosca({ dados }) {
  const total = dados.reduce((soma, item) => soma + item.valor, 0);
  const centro = TAMANHO_ROSCA / 2;
  let acumulado = 0;

  return (
    <Svg width={TAMANHO_ROSCA} height={TAMANHO_ROSCA}>
      <G rotation={-90} origin={`${centro}, ${centro}`}>
        {dados.map((item) => {
          const tamanho = (item.valor / total) * CIRCUNFERENCIA;
          const deslocamento = -acumulado;
          acumulado += tamanho;

          return (
            <Circle
              key={item.name}
              cx={centro}
              cy={centro}
              r={RAIO_ROSCA}
              fill="none"
              stroke={item.color}
              strokeWidth={ESPESSURA_ROSCA}
              strokeDasharray={`${tamanho} ${CIRCUNFERENCIA - tamanho}`}
              strokeDashoffset={deslocamento}
            />
          );
        })}
      </G>
    </Svg>
  );
}

export default function HomeScreen() {
  const [esconder, setEsconder] = useState(false);
  const [selecionado, setSelecionado] = useState(2);

  // Mapeamento das cores da divisão da carteira direto pelo index
  const coresDivisao = [cores.texto, cores.primaria];

  const dadosDivisaoFormatados = inicioData.divisao.map((item, index) => ({
    ...item,
    color: coresDivisao[index],
  }));

  return (
    <ScrollView
      className="flex-1 bg-fundo"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1">
          <CabecalhoTela
            subtitulo={inicioData.saudacao}
            titulo="Sua carteira"
          />
        </View>
        <BotaoPerfil />
      </View>

      {/* 1: Patrimônio total */}
      <View className="bg-texto rounded-2xl p-6 mb-6 flex-row items-center justify-between">
        <View className="flex-1 gap-2">
          <Text className="font-titulo text-base text-fundo">
            Patrimônio total
          </Text>

          <Text className="font-titulo text-4xl text-container">
            {esconder ? "R$ ••••••••" : inicioData.patrimonioTotal}
          </Text>

          <View className="flex-row items-center gap-2">
            <CaretUp size={14} weight="fill" color={cores.positivo} />
            <Text className="font-corpo text-sm text-fundo">
              <Text className="text-positivo">{inicioData.variacao}</Text> nos
              últimos 30 dias
            </Text>
          </View>
        </View>

        <Pressable onPress={() => setEsconder(!esconder)}>
          {esconder ? (
            <Eye size={28} color={cores.container} />
          ) : (
            <EyeSlash size={28} color={cores.container} />
          )}
        </Pressable>
      </View>

      {/* 2: Divisão da Carteira */}
      <View className="bg-card rounded-2xl p-5 mb-6">
        <Text className="font-titulo text-lg text-texto mb-3">
          Divisão da carteira
        </Text>

        <View className="flex-row items-center justify-between">
          <Rosca dados={dadosDivisaoFormatados} />

          <View className="flex-1 pl-4 gap-3">
            {dadosDivisaoFormatados.map((item) => (
              <View
                key={item.name}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-2">
                  <View
                    style={{ backgroundColor: item.color }}
                    className="w-3 h-3 rounded-full"
                  />
                  <Text className="font-corpo text-sm text-texto">
                    {item.name}
                  </Text>
                </View>

                <Text className="font-corpo text-sm text-texto">
                  {item.valor}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 3: Evolução Patrimonial */}
      <View className="bg-card rounded-2xl py-5">
        <Text className="font-titulo px-5 text-lg text-texto mb-4">
          Evolução Patrimonial
        </Text>

        <LineChart
          data={inicioData.evolucao}
          width={larguraGrafico}
          height={180}
          segments={3}
          withInnerLines={true}
          withOuterLines={true}
          
          formatYLabel={(valor) => formatarMil(Number(valor))}
          chartConfig={{
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            decimalPlaces: 0,
            color: () => cores.primaria,
            labelColor: () => cores.primaria,
            fillShadowGradientFrom: cores.primaria,
            fillShadowGradientFromOpacity: 0.35,
            fillShadowGradientTo: cores.primaria,
            fillShadowGradientToOpacity: 0.02,
            propsForLabels: { fontFamily: "Manrope_400Regular", fontSize: 10 },
            propsForDots: { r: "3", strokeWidth: "1", stroke: cores.primaria },
          }}
          style={{ paddingRight: 50, marginRight: 12, overflow: "hidden" }}
        />
      </View>
    </ScrollView>
  );
}
