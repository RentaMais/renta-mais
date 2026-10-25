import { Text } from "react-native";

export function TituloCardCustomer({ titulo, className = "" }) {
  return (
    <Text className={`font-titulo text-lg text-primaria ${className}`}>
      {titulo}
    </Text>
  );
}
