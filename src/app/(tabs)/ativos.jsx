import {useState} from "react";
import {useNavigation} from "expo-router"
import {View,Text,ScrollView,Pressable} from "react-native";
import {CaretUpIcon,CaretDownIcon,CaretRightIcon,PlusIcon} from "phosphor-react-native"
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { cores } from "@/cores";
import ativosDados from "@/mocks/ativos.json";
import { BotaoPerfil } from "@/components/BotaoPerfil";

export default function AtivoScreen(){
  const [variavelAberto,setVariavelAberto] = useState(true);
  const [fixaAberto,setFixaAberto] = useState(false);
  const navigation = useNavigation();
  return(
    <View className="flex-1 items-center bg-fundo">
      <View className="w-[85vw] flex-1">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{
            paddingTop:48,
            paddingBottom:40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-1">
              <CabecalhoTela
                subtitulo="Carteira completa"
                titulo="Meus ativos"
                descricao={"Total investido: "+ ativosDados.totalInvestido}
            />
            </View>
            <BotaoPerfil />
          </View>
          <View className="bg-card rounded-2xl p-5 mb-6">
            <Pressable
              onPress={()=>setVariavelAberto(!variavelAberto)}
              className="flex-row items-center justify-between pb-3"
            >
              <Text className="font-titulo text-lg text-primaria">Renda variável</Text>
              {variavelAberto ? (
                <CaretUpIcon size={20} weight="bold" color={cores.primaria}/>
              ) : (
                <CaretDownIcon size={20} weight="bold" color={cores.primaria}/>
              )}
            </Pressable>
            {variavelAberto && ativosDados.rendaVariavel.map((ativo)=>(
              <Pressable
                key={ativo.id}
                onPress={()=>navigation.navigate("ativo/[id]",{id:ativo.id})}
                className="flex-row items-center border-t border-texto/10 py-3"
              >
                <View className="h-9 w-9 rounded-lg bg-texto/10"/>
                <View className="ml-3 flex-1">
                  <Text className="font-corpo-bold text-base text-texto">{ativo.ticker}</Text>
                  <Text className="font-corpo text-xs text-inativo">{ativo.detalhe}</Text>
                </View>

                <View className="mr-2 items-end">
                  <Text className="font-corpo-bold text-base text-texto">{ativo.valor}</Text>
                  <View className="flex-row items-center gap-1">
                    <CaretUpIcon size={10} weight="fill" color={cores.positivo}/>
                    <Text className="font-corpo-medium text-xs text-positivo">{ativo.variacao}%</Text>
                  </View>
                </View>
                <CaretRightIcon size={18} weight="bold" color={cores.primaria}/>
              </Pressable>
            ))}
          </View>
          <View className="bg-card rounded-2xl p-5 mb-6">
            <Pressable
              onPress={()=>setFixaAberto(!fixaAberto)}
              className="flex-row items-center justify-between pb-3"
            >
              <Text className="font-titulo text-lg text-primaria">Renda fixa</Text>
              {fixaAberto ? (
                <CaretUpIcon size={20} weight="bold" color={cores.primaria}/>
              ) : (
                <CaretDownIcon size={20} weight="bold" color={cores.primaria}/>
              )}
            </Pressable>
            {fixaAberto && ativosDados.rendaFixa.map((ativo)=>(
              <Pressable
                key={ativo.id}
                onPress={()=>navigation.navigate("ativo/[id]",{id:ativo.id})}
                className="flex-row items-center border-t border-texto/10 py-3"
              >
                <View className="flex-1">
                  <Text className="font-corpo-bold text-base text-texto">{ativo.nome}</Text>
                  <Text className="font-corpo text-xs text-inativo">{ativo.detalhe}</Text>
                </View>

                <View className="mr-2 items-end">
                  <Text className="font-corpo-bold text-base text-texto">{ativo.valor}</Text>
                  <Text className="font-corpo text-xs text-inativo">investido</Text>
                </View>
                <CaretRightIcon size={18} weight="bold" color={cores.primaria}/>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    <Pressable
      onPress={()=>navigation.navigate("ativo/novo")}
      className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primaria"
    >
      <PlusIcon size={28} weight="bold" color={cores.container}/>
    </Pressable>
  </View>
  );
}