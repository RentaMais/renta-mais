import { Pressable, Text } from "react-native";
import { useNavigation } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import { cores } from "@/cores";

export default function VoltarCustomer() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      className="flex-row items-center gap-2 self-start"
    >
      <ArrowLeftIcon size={24} weight="bold" color={cores.primaria}/>
      <Text className="font-corpo-bold text-2xl text-primaria">Voltar</Text>
    </Pressable>
  );
}