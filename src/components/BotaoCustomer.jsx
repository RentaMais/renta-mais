import { Text, Pressable } from "react-native";

export function BotaoCustomer({ titulo, onPress, className = "" }) {
    return (
        <Pressable
            onPress={onPress}
            className={`h-12 w-full items-center justify-center rounded-xl bg-texto active:opacity-80 ${className}`}
        >
            <Text className="font-titulo text-lg text-fundo">{titulo}</Text>
        </Pressable>
    );
}