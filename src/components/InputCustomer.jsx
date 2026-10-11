import { View, Text, TextInput } from "react-native";
import { cores } from "@/cores";

export function InputCustomer({
  titulo,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  className = "",
}) {
  return (
    <View className={`w-full gap-1 ${className}`}>
      {titulo && (
        <Text className="font-corpo-bold pl-1 text-base text-texto">
          {titulo}
        </Text>
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={cores.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        className="h-12 rounded-xl border border-texto/20 bg-white px-4 font-corpo text-sm text-texto"
      />
    </View>
  );
}
