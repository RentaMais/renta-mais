import { Pressable, Text } from "react-native";
import { useNavigation } from "expo-router";
import { ArrowLeftIcon } from "phosphor-react-native";
import { cores } from "@/cores";

export function VoltarCustomer() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.goBack()}
      className="flex-row items-center gap-2 self-start mb-4"
    >
      <ArrowLeftIcon size={15} weight="bold" color={cores.primaria} />
      <Text className="font-corpo-bold text-s text-primaria">Voltar</Text>
    </Pressable>
  );
}
