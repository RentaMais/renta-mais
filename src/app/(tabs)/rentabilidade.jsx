import { View, Text, FlatList } from "react-native";
import { useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { TelaCustomer } from "@/components/TelaCustomer";
import { CardCustomer } from "@/components/CardCustomer";
import { CabecalhoPrincipal } from "@/components/CabecalhoPrincipal";
import { formatarPercentual } from "@/utils/formatarPercentual";
import rentabilidadeDados from "@/mocks/rentabilidade.json";
import { cores } from "@/cores";

const series = [
  { chave: "carteira", nome: "Carteira", cor: "bg-primaria" },
  { chave: "cdi", nome: "CDI", cor: "bg-texto" },
  { chave: "ibovespa", nome: "Ibovespa", cor: "bg-positivo" },
];

function GraficoRentabilidade({ meses }) {
  const [largura, setLargura] = useState(0);

  function medirLargura(e) {
    const largura = e.nativeEvent.layout.width;
    setLargura(largura);
  }

  const larguraColuna = largura / meses.length;
  const folga = larguraColuna - 32;

  const dadosBarras = [];

  for (let i = 0; i < meses.length; i++) {
    const mes = meses[i];
    dadosBarras.push({
      value: mes.carteira,
      spacing: 4,
      frontColor: cores.primaria,
    });
    dadosBarras.push({
      value: mes.cdi,
      spacing: 4,
      frontColor: cores.texto,
    });
    dadosBarras.push({
      value: mes.ibovespa,
      spacing: i === meses.length - 1 ? folga / 2 : folga,
      frontColor: cores.placeholder,
    });
  }

  return (
    <View className="gap-4">
      <View onLayout={medirLargura}>
        {largura > 0 && (
          <View>
            <BarChart
              data={dadosBarras}
              width={largura}
              height={110}
              barWidth={8}
              initialSpacing={folga / 4}
              endSpacing={0}
              yAxisLabelWidth={0}
              barBorderRadius={2}
              maxValue={3}
              mostNegativeValue={-2}
              noOfSections={3}
              noOfSectionsBelowXAxis={2}
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={0}
              disableScroll
            />
            <View className="flex-row">
              {meses.map((mes) => (
                <Text
                  key={mes.mes}
                  style={{ width: larguraColuna }}
                  className="text-center font-titulo text-sm text-inativo"
                >
                  {mes.mes}
                </Text>
              ))}
            </View>
          </View>
        )}
      </View>

      <View className="flex-row justify-center gap-5">
        {series.map((serie) => (
          <View key={serie.chave} className="flex-row items-center gap-2">
            <View className={"h-3 w-3 rounded-full " + serie.cor} />
            <Text className="font-titulo text-sm text-texto">{serie.nome}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function RentabilidadeScreen() {
  const tabela = rentabilidadeDados.meses.slice(-6).reverse();

  return (
    <TelaCustomer>
      <CabecalhoPrincipal
        subtitulo="Comparativo de performance"
        titulo="Rentabilidade"
        descricao={`Rendeu ${rentabilidadeDados.rendimento12Meses}% em 12 meses`}
        className={`h-3 w-3 rounded-full ${series.cor}`}
      />
      <CardCustomer>
        <GraficoRentabilidade meses={rentabilidadeDados.meses} />
      </CardCustomer>
      <CardCustomer>
        <View className="flex-row border-b border-texto/10 pb-1.5 mb-2.5">
          <Text className="w-24 font-titulo-regular text-sm text-inativo">
            Mês
          </Text>
          <Text className="flex-1 text-center font-titulo-regular text-sm text-inativo">
            Carteira
          </Text>
          <Text className="flex-1 text-center font-titulo-regular text-sm text-inativo">
            CDI
          </Text>
          <Text className="flex-1 text-center font-titulo-regular text-sm text-inativo">
            Ibovespa
          </Text>
        </View>
        <FlatList
          data={tabela}
          keyExtractor={(item) => item.mes}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] bg-texto/10 my-2.5" />
          )}
          renderItem={({ item }) => (
            <View className="flex-row items-center">
              <Text className="w-24 font-titulo text-base text-subtexto">
                {item.nome}
              </Text>
              <Text
                className={`flex-1 text-center font-corpo-medium text-base ${
                  item.carteira >= 0 ? "text-positivo" : "text-negativo"
                }`}
              >
                {formatarPercentual(item.carteira)}
              </Text>
              <Text className="flex-1 text-center font-corpo-medium text-base text-texto">
                {formatarPercentual(item.cdi)}
              </Text>
              <Text
                className={
                  item.ibovespa >= 0
                    ? "flex-1 text-center font-corpo-medium text-base text-positivo"
                    : "flex-1 text-center font-corpo-medium text-base text-negativo"
                }
              >
                {formatarPercentual(item.ibovespa)}
              </Text>
            </View>
          )}
        />
      </CardCustomer>
    </TelaCustomer>
  );
}
