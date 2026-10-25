import {View,Text} from "react-native";
import {CaretUpIcon} from "phosphor-react-native";
import {cores} from "@/cores";

export function CabecalhoAtivo({ativo}){
    if(ativo.tipo==="renda_variavel"){
        return(
            <View className="flex-row items-center gap-4">
                <View className="flex-1 gap-1">
                    <Text className="font-titulo text-3xl text-texto">
                        {ativo.ticker}
                    </Text>
                    <View className="flex-row items-center gap-2">
                       <Text className="font-corpo-bold text-xl text-texto">
                            {ativo.valor}
                        </Text>
                        <CaretUpIcon size={10} weight="fill" color={cores.positivo} />
                        <Text className="font-corpo-medium text-xs text-positivo">
                            {ativo.variacao}%
                        </Text>
                    </View>
                    <Text className="font-corpo text-xs text-inativo">
                        {ativo.detalhe}
                    </Text>    
                </View>
            </View>
        );
    }
    return(
        <View className="gap-1">
            <Text className="font-titulo text-3xl text-texto">
                {ativo.nome}
            </Text>
            <Text className="font-corpo-bold text-xl text-texto">
                {ativo.valor}
            </Text>
            <View className="flex-row items-center justify-between">
                <Text className="font-corpo text-xs text-inativo">
                    {ativo.taxa}
                </Text>
                <Text className="font-corpo text-xs text-inativo">
                    {"Data de vencimento: " + ativo.vencimento}
                </Text>
            </View>
        </View>
    )
}