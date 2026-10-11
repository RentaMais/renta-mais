import { View, Text } from "react-native";

export function CabecalhoTela({ subtitulo, titulo, descricao }){
  return (
    <View className="w-full gap-1">
        {subtitulo && (
            <Text className="font-corpo-medium text-xl text-primaria">
                {subtitulo}
            </Text>
        )}
        <Text className="font-titulo text-4xl text-texto"> 
            {titulo} 
        </Text>
        {descricao && (
            <Text className="font-corpo text-xl text-subtexto"> 
                {descricao} 
            </Text>
        )}
    </View>
  );
}
