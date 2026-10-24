import {View, Text, Pressable, FlatList} from "react-native";
import {useNavigation, useLocalSearchParams} from "expo-router";
import {ArrowLeftIcon}  from "phosphor-react-native";
import {CabecalhoAtivo} from "@/components/CabecalhoAtivo";
import {buscarAtivo} from "@/services/ativosService";
import {cores} from "@/cores";

export default function DetalheAtivo(){
  const navigation = useNavigation();
  const {id} = useLocalSearchParams();
  const ativo = buscarAtivo(id);

  function reais(numero){
        return (
            "R$ " +
            numero.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    }

  const ehVariavel = ativo.tipo === "renda_variavel";

  const informacoes = ehVariavel ?
    [
      {rotulo: "Quantidade", valor: ativo.quantidade + "un"},
      {rotulo: "Preço médio", valor: reais(ativo.precoMedio)},
      {rotulo: "Valor investido", valor: reais(ativo.quantidade*ativo.precoMedio)},
      {rotulo: "Valor atual", valor: ativo.valor},
    ] :
    [
      {rotulo: "Taxa", valor: ativo.taxa},
      {rotulo: "Vencimento", valor: ativo.vencimento},
      {rotulo: "Valor investido", valor: reais(ativo.valorInicial)},
    ];
    return(
      <View className="flex-1 items-center bg-fundo">
        <View className="w-[85vw] flex-1 justify-between pb-10 pt-12">
          <View>
            <Pressable
              onPress={()=>navigation.goBack()}
              className="mb-6 flex-row items-center gap-2 self-start"
            >
              <ArrowLeftIcon size={16} weight="bold" color={cores.primaria} />
              <Text className="font-corpo-bold text-sm text-primaria">
                Voltar
              </Text>
            </Pressable>
            <View className="mb-8">
              <CabecalhoAtivo ativo={ativo} />
            </View>
            <View className="rounded-2xl bg-card p-5">
              <Text className="pb-3 font-titulo text-lg text-primaria">
                Informações
              </Text>
              <FlatList
                data={informacoes}
                keyExtractor={(item)=>item.rotulo}
                scrollEnabled={false}
                renderItem={({item})=>(
                  <View className="flex-row items-center justify-between border-t border-texto/10 py-3">
                    <Text className="font-corpo text-base text-subtexto">
                      {item.rotulo}
                    </Text>
                    <Text className="font-corpo-bold text-base text-texto">
                      {item.valor}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
          <Pressable
            onPress={()=>navigation.navigate("ativo/operacao",{id:ativo.id})}
            className="h-14 items-center justify-center rounded-2xl bg-texto"
          >
            <Text className="font-titulo text-xl text-container">
                {ehVariavel ? "Vender ativo":"Resgatar ativo"}
            </Text>
          </Pressable>
        </View>
      </View>
    )

}