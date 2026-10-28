import { View, Text } from "react-native";
import { InfoIcon } from "phosphor-react-native";
import { cores } from "@/cores";

export function AvisoCustomer({ mensagem, className = "" }) {
  return (
    <View
      className={`flex-row items-center gap-3 rounded-2xl border border-primaria/40 bg-primaria/20 p-4 ${className}`}
    >
      <InfoIcon
        name="information-circle-outline"
        size={22}
        color={cores.primaria}
      />
      <Text className="flex-1 font-corpo-bold text-sm text-primaria">
        {mensagem}
      </Text>
    </View>
  );
}
