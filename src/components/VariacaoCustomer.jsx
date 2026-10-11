import { View, Text } from "react-native";
import { CaretUpIcon } from "phosphor-react-native";
import { cores } from "@/cores";

export function VariacaoCustomer({valor}) {
  return (
    <View className="flex-row items-center gap-3">
        <CaretUpIcon size={32} weight="fill" color={cores.positivo} />
            <Text className="font-corpo text-4xl text-positivo">
                {valor}%
            </Text>
    </View>
  );
}
