import { useState } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import { cores } from "@/cores";

export function InputCustomer({
  titulo,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  erro = false,
  estado = "padrao",
  className = "",
  onFocus,
  onBlur,
  ...props
}) {
  const [focado, setFocado] = useState(false);

  const estadoAtual = erro ? "erro" : estado;

  let classeBorda = focado
    ? "border-2 border-primaria"
    : "border border-texto/20";
  let corCursor = cores.primaria;

  if (estadoAtual === "erro") {
    classeBorda = focado
      ? "border-2 border-negativo"
      : "border border-negativo";
    corCursor = cores.negativo;
  } else if (estadoAtual === "sucesso") {
    classeBorda = focado
      ? "border-2 border-positivo"
      : "border border-positivo";
    corCursor = cores.positivo;
  }

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
        selectionColor={corCursor}
        onFocus={(e) => {
          setFocado(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          onBlur?.(e);
        }}
        style={Platform.OS === "web" ? { outlineStyle: "none" } : undefined}
        className={`h-12 rounded-xl bg-container px-4 font-corpo text-sm text-texto ${classeBorda}`}
        {...props}
      />
    </View>
  );
}
