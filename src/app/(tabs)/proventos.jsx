import { useState } from "react";
import { Text, View, FlatList } from "react-native";
import { BarChart } from "react-native-chart-kit";

import { TelaCustomer } from "@/components/TelaCustomer";
import { CardCustomer } from "@/components/CardCustomer";
import { CabecalhoPrincipal } from "@/components/CabecalhoPrincipal";
import { TituloCardCustomer } from "@/components/TituloCardCustomer";

import { cores } from "@/cores";
import proventosMock from "@/mocks/proventos.json";
import valores from "@/mocks/historicoProventos.json";

const QTD_MESES = 12;
const MESES = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const MAX = Math.max(...valores);

const corDaBarra = (v) => {
  const p = v / MAX;
  return p >= 0.75
    ? cores.primaria
    : p >= 0.45
      ? `${cores.primaria}B3`
      : `${cores.primaria}66`;
};

const gerarUltimosMeses = (qtd) => {
  const hoje = new Date();
  return Array.from({ length: qtd }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - (qtd - 1 - i), 1);
    return MESES[d.getMonth()];
  });
};

function GraficoProventos() {
  const [largura, setLargura] = useState(0);

  const dados = {
    labels: gerarUltimosMeses(QTD_MESES),
    datasets: [
      {
        data: valores,
        colors: valores.map((v) => () => corDaBarra(v)),
      },
    ],
  };

  return (
    <View
      className="w-full"
      onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
    >
      {largura > 0 && (
        <BarChart
          data={dados}
          width={largura}
          height={180}
          segments={4}
          fromZero
          showValuesOnTopOfBars={true}
          showBarTops={false}
          withCustomBarColorFromData
          flatColor
          yAxisLabel="R$ "
          chartConfig={{
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            color: () => cores.primaria,
            labelColor: () => cores.subtexto,
            barPercentage: 0.5,
            decimalPlaces: 0,
            propsForTopLabels: { fontSize: 9, dy: -6 },
            propsForLabels: { fontSize: 8.5 },
            propsForBackgroundLines: { stroke: "transparent" },
          }}
          style={{ paddingRight: 45 }}
        />
      )}
    </View>
  );
}

export default function ProventosScreen() {
  return (
    <TelaCustomer>
      <CabecalhoPrincipal
        subtitulo="Renda passiva"
        titulo="Proventos"
        descricao="Acompanhe seus dividendos e rendimentos"
      />

      {/* Resumo visual */}
      <View className="flex-row justify-between rounded-2xl bg-texto p-4">
        <View className="flex-1 items-center border-r border-container/20 pr-3">
          <Text className="mb-1 font-corpo-bold text-xs text-container/60">
            Total recebido
          </Text>
          <Text className="font-titulo text-xl text-container">R$ 7.460</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="mb-1 font-corpo-bold text-xs text-container/60">
            DY médio
          </Text>
          <Text className="font-titulo text-xl text-container">7,4%</Text>
        </View>
      </View>

      {/* Gráfico */}
      <CardCustomer className="gap-4">
        <TituloCardCustomer titulo={`Últimos ${QTD_MESES} meses`} />
        <GraficoProventos />
      </CardCustomer>

      {/* Próximos Pagamentos */}
      <CardCustomer>
        <TituloCardCustomer titulo="Próximos pagamentos" className="mb-4" />

        <FlatList
          data={proventosMock}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] my-3 bg-texto/10" />
          )}
          ListEmptyComponent={() => (
            <View className="items-center justify-center py-8">
              <Text className="text-center font-corpo text-sm text-texto/40">
                Nenhum provento disponível no momento.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View className="flex-row justify-between">
              <View className="gap-1">
                <Text className="font-corpo-bold text-base text-texto">
                  {item.ticker}
                </Text>
                <Text className="font-corpo text-sm text-subtexto">
                  {item.data}
                </Text>
              </View>
              <View className="items-end gap-1">
                <Text className="font-corpo-bold text-sm text-texto">
                  {item.dividendo}
                </Text>
                <View
                  className={`rounded-full px-2 py-0.5 ${
                    item.status === "Pago"
                      ? "bg-positivo/20"
                      : "bg-provisionado/20"
                  }`}
                >
                  <Text
                    className={`font-corpo-medium text-xs ${
                      item.status === "Pago"
                        ? "text-positivo"
                        : "text-provisionado"
                    }`}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </CardCustomer>
    </TelaCustomer>
  );
}
