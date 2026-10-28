import { View, Text, Dimensions, Pressable } from "react-native";
import { useState } from "react";
import { Eye, EyeSlash } from "phosphor-react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle } from "react-native-svg";
import { cores } from "@/cores";

import { TelaCustomer } from "@/components/TelaCustomer";
import { CardCustomer } from "@/components/CardCustomer";
import { TituloCardCustomer } from "@/components/TituloCardCustomer";
import { CabecalhoPrincipal } from "@/components/CabecalhoPrincipal";
import { VariacaoCustomer } from "@/components/VariacaoCustomer";

import { formatarMil } from "@/utils/formatarMil";
import { formatarReais } from "@/utils/formatarReais";
import inicioData from "@/mocks/inicio.json";

const larguraTela = Dimensions.get("window").width;
const larguraGrafico = larguraTela * 0.85;

const TAMANHO_ROSCA = 140;
const ESPESSURA_ROSCA = 28;
const RAIO_ROSCA = (TAMANHO_ROSCA - ESPESSURA_ROSCA) / 2;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO_ROSCA;

function Rosca({ dados }) {
  const total = dados.reduce((soma, item) => soma + item.valor, 0);
  const centro = TAMANHO_ROSCA / 2;

  return (
    <Svg width={TAMANHO_ROSCA} height={TAMANHO_ROSCA}>
      {dados.map((item, index) => {
        const anteriores = dados
          .slice(0, index)
          .reduce((soma, anterior) => soma + anterior.valor, 0);
        const tamanho = (item.valor / total) * CIRCUNFERENCIA;
        const deslocamento = -(anteriores / total) * CIRCUNFERENCIA;

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
    </Svg>
  );
}

export default function HomeScreen() {
  const [esconder, setEsconder] = useState(false);

  const coresDivisao = [cores.texto, cores.primaria];

  const dadosDivisaoFormatados = inicioData.divisao.map((item, index) => ({
    ...item,
    color: coresDivisao[index],
  }));

  return (
    <TelaCustomer>
      <CabecalhoPrincipal
        subtitulo={inicioData.saudacao}
        titulo="Sua carteira"
      />

      {/* Patrimônio total */}
      <View className="bg-texto rounded-2xl p-6 flex-row items-center justify-between">
        <View className="flex-1 gap-2">
          <Text className="font-titulo text-base text-fundo">
            Patrimônio total
          </Text>

          <Text className="font-titulo text-4xl text-container">
            {esconder
              ? "R$ ••••••••"
              : formatarReais(Number(inicioData.patrimonioTotal))}
          </Text>

          <View className="flex-row items-center gap-2">
            <VariacaoCustomer valor={inicioData.variacao} />
            <Text className="font-corpo text-sm text-fundo">
              nos últimos 30 dias
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

      {/* Divisão da Carteira */}
      <CardCustomer>
        <TituloCardCustomer titulo="Divisão da carteira" className="mb-4" />

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
      </CardCustomer>

      {/* Evolução Patrimonial */}
      <CardCustomer className="px-0 py-5">
        <TituloCardCustomer
          titulo="Evolução Patrimonial"
          className="px-5 mb-4"
        />

        <LineChart
          data={inicioData.evolucao}
          width={larguraGrafico}
          height={180}
          segments={3}
          withInnerLines={true}
          withOuterLines={true}
          withDots={false}
          formatYLabel={(valor) => formatarMil(valor)}
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
          }}
          style={{ paddingRight: 50, marginRight: 12, overflow: "hidden" }}
        />
      </CardCustomer>
    </TelaCustomer>
  );
}
