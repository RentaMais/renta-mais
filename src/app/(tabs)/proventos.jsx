import { useState} from "react";
import { Text, View, ScrollView,FlatList} from "react-native";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { UserButtonCustomer } from "@/components/UserButtonCustomer";
import {proventosMock} from "@/mocks/assets/proventosMock"
import { BarChart } from "react-native-chart-kit";
import { cores } from "@/cores";



const QTD_MESES =6;
const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const valores = [300.55, 450.21, 670.00, 630.00, 530.00, 710.13];
const MAX = Math.max(...valores);

const corDaBarra = (v) => {
  const p = v / MAX;
  return p >= 0.75 ? cores.primaria : p >= 0.45 ? `${cores.primaria}B3` : `${cores.primaria}66`;
};

const gerarUltimosMeses = (qtd) => {
  const hoje = new Date();
  return Array.from({ length: qtd }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - (qtd - 1 - i), 1);
    const nomeMes = MESES[d.getMonth()];
    const anoDoisDigitos = String(d.getFullYear()).slice(-2);
    return `${nomeMes}/${anoDoisDigitos}`
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
      className="w-full "
      onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
    >
      {largura > 0 && (
        <BarChart
          data={dados}
          width={largura}
          height={190}
          fromZero
          showValuesOnTopOfBars={true}
          withCustomBarColorFromData
          flatColor
          yAxisLabel="R$ "
          chartConfig={{
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            color: () => cores.primaria,
            labelColor: () => cores.subtexto,
            barPercentage: 0.5,
            decimalPlaces:2,
            propsForLabels: { fontSize: 9 },
            propsForBackgroundLines: { stroke: "transparent" },
          }}
          style={{ paddingRight: 60}}
        />
      )}
    </View>
  );
}

export default function ProventosScreen() {
  


  return (
    <ScrollView className="flex-1 bg-fundo" contentContainerStyle={{ paddingVertical: 24, alignItems: "center" }}>
      <View className="w-[85vw] gap-5">
        
        {/* Cabeçalho */}
        <View className="w-full flex-row items-center justify-between">
          <View className="flex-1">
            <CabecalhoTela titulo="Proventos" />
          </View>
          <UserButtonCustomer onPress={() => {}} />
        </View>

    
        <View className="w-full bg-texto rounded-2xl flex-row p-5 justify-between">
          <View className="flex-1 border-r border-container/20 pr-3 items-center">
            <Text className="text-container/60 text-xs mb-1 font-corpo-bold ">Total recebido</Text>
            <Text className="text-container text-xl font-bold">R$ 7.460</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-container/60 text-xs mb-1 font-corpo-bold">DY médio</Text>
            <Text className="text-container text-xl font-bold">7,4%</Text>
          </View>
        </View>

        <View className="w-full bg-white rounded-2xl p-5 gap-4">
          <Text className="text-texto/70 text-base font-semibold mb-2">Últimos {QTD_MESES} meses</Text>
          <GraficoProventos/>
        </View>

        
        <View className="w-full bg-white rounded-2xl p-5 gap-6">
          <Text className="text-texto/70 text-base font-semibold mb-4">Próximos pagamentos</Text>

          <FlatList
          data={proventosMock}
          keyExtractor={(item)=>item.id}
          scrollEnabled={false}
          ListEmptyComponent={()=>(
            <View className="py-8 items-center justify-center">
              <Text className="text-texto/40 text-sm font-corpo text-center">
                Nenhum provento disponivel no momento.
              </Text>
            </View>
          )}
          renderItem={({item})=>{
            return(
            <View className="w-full flex-row justify-between  border-b border-texto/20 pb-3 ">
              <View className="gap-2 mt-3">
                <Text className="text-texto font-bold text-base">{item.ticker}</Text>
                <Text className="text-texto/50 text-sm mt-1">{item.data}</Text>
              </View>
              <View className="items-end gap-2 mt-3 ">
                <Text className="text-texto font-bold text-sm">{item.dividendo}</Text>
                <View className={`px-2 py-1 rounded-full mt-1 ${item.status === 'Pago'? 'bg-positivo/20':'bg-provisionado/20'}`}>
                  <Text className={` text-xs font-medium ${item.status === 'Pago'? 'text-positivo': 'text-provisionado'}`}>{item.status}</Text>
                </View>
              </View>
            </View>
            )
          }}
          />
        </View>

      </View>
    </ScrollView>
  );
}
