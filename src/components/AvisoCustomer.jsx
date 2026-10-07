import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function AvisoCustomer({ mensagem, className = "" }) {
    return (
        <View
            className={`flex-row items-center gap-3 rounded-2xl border border-primaria/40 bg-primaria/20 p-4 ${className}`}
        >
            <Ionicons name="information-circle-outline" size={22} color="#A8763E" />
            <Text className="flex-1 font-corpo-bold text-sm text-primaria">
                {mensagem}
            </Text>
        </View>
    );
}