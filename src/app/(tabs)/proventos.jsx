import { useState, useCallback } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { BarChart } from "react-native-chart-kit";

import { TelaCustomer } from "@/components/TelaCustomer";
import { CardCustomer } from "@/components/CardCustomer";
import { CabecalhoPrincipal } from "@/components/CabecalhoPrincipal";
import { TituloCardCustomer } from "@/components/TituloCardCustomer";

import { cores } from "@/cores";
import { buscarDadosProventos } from "@/services/proventosService";

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

const gerarUltimosMeses = (qtd) => {
  const hoje = new Date();
  const mesesGerados = [];

  for (let i = 0; i < qtd; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - (qtd - 1 - i), 1);
    mesesGerados.push(MESES[d.getMonth()]);
  }

  return mesesGerados;
};

function GraficoProventos({ valores }) {
  const [largura, setLargura] = useState(0);

  const dadosValores =
    Array.isArray(valores) && valores.length === QTD_MESES
      ? valores.map((v) => Number((Number(v) || 0).toFixed(2)))
      : Array(QTD_MESES).fill(0);

  const maxVal = Math.max(...dadosValores, 0);
  const escalaMax = maxVal > 0 ? maxVal : 1;

  const corDaBarra = (v) => {
    const p = v / escalaMax;
    return p >= 0.75
      ? cores.primaria
      : p >= 0.45
        ? `${cores.primaria}B3`
        : `${cores.primaria}66`;
  };

  const dados = {
    labels: gerarUltimosMeses(QTD_MESES),
    datasets: [
      {
        data: dadosValores,
        colors: dadosValores.map((v) => () => corDaBarra(v)),
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
          segments={maxVal > 0 ? 4 : 1}
          fromZero
          showValuesOnTopOfBars={true}
          showBarTops={false}
          withCustomBarColorFromData
          flatColor
          yAxisLabel="R$ "
          formatYLabel={(val) => {
            const num = Number(val);
            if (!Number.isFinite(num) || maxVal === 0) {
              return num <= 0 ? "0" : "";
            }
            return `${Math.round(num)}`;
          }}
          chartConfig={{
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            color: () => cores.primaria,
            labelColor: () => cores.subtexto,
            barPercentage: 0.5,
            decimalPlaces: 2,
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
  const [loading, setLoading] = useState(true);
  const [totalRecebido, setTotalRecebido] = useState(0);
  const [dyMedio, setDyMedio] = useState(0);
  const [valoresMensais, setValoresMensais] = useState(Array(12).fill(0));
  const [listaProventos, setListaProventos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function carregarDados() {
        try {
          setLoading(true);
          const dados = await buscarDadosProventos();

          if (isMounted) {
            setTotalRecebido(dados.totalRecebido);
            setDyMedio(dados.dyMedio);
            setValoresMensais(dados.valoresMensais);
            setListaProventos(dados.listaProventos);
          }
        } catch (error) {
          console.error("Erro ao carregar dados de proventos:", error);
        } finally {
          if (isMounted) setLoading(false);
        }
      }

      carregarDados();

      return () => {
        isMounted = false;
      };
    }, []),
  );

  return (
    <TelaCustomer>
      <CabecalhoPrincipal
        subtitulo="Renda passiva"
        titulo="Proventos"
        descricao="Acompanhe seus dividendos"
      />

      {/* Resumo visual */}
      <View className="flex-row justify-between rounded-2xl bg-texto p-4">
        <View className="flex-1 items-center border-r border-container/20 pr-3">
          <Text className="mb-1 font-corpo-bold text-xs text-container/60">
            Total recebido
          </Text>
          <Text className="font-titulo text-xl text-container">
            {loading
              ? "..."
              : `R$ ${totalRecebido.toFixed(2).replace(".", ",")}`}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="mb-1 font-corpo-bold text-xs text-container/60">
            DY médio
          </Text>
          <Text className="font-titulo text-xl text-container">
            {loading ? "..." : `${dyMedio.toFixed(1).replace(".", ",")}%`}
          </Text>
        </View>
      </View>

      {/* Gráfico */}
      <CardCustomer className="gap-4">
        <TituloCardCustomer titulo={`Últimos ${QTD_MESES} meses`} />
        {loading ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="small" color={cores.primaria} />
          </View>
        ) : (
          <GraficoProventos valores={valoresMensais} />
        )}
      </CardCustomer>

      {/* Próximos Pagamentos */}
      <CardCustomer>
        <TituloCardCustomer titulo="Histórico de dividendos" className="mb-4" />

        <FlatList
          data={listaProventos}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] my-3 bg-texto/10" />
          )}
          ListEmptyComponent={() => (
            <View className="items-center justify-center py-8">
              {loading ? (
                <ActivityIndicator size="small" color={cores.primaria} />
              ) : (
                <Text className="text-center font-corpo text-sm text-texto/40">
                  Nenhum provento disponível no momento.
                </Text>
              )}
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
