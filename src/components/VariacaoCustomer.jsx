import { View, Text } from "react-native";
import { CaretUpIcon, CaretDownIcon } from "phosphor-react-native";
import { cores } from "@/cores";

export function VariacaoCustomer({ valor, grande = false }) {
  const ehPositivo = !String(valor).startsWith("-");
  const corIcone = ehPositivo ? cores.positivo : cores.negativo;
  const corTexto = ehPositivo ? "text-positivo" : "text-negativo";

  return (
    <View
      className={
        grande ? "flex-row items-center gap-3" : "flex-row items-center gap-1"
      }
    >
      {ehPositivo ? (
        <CaretUpIcon size={grande ? 32 : 10} weight="fill" color={corIcone} />
      ) : (
        <CaretDownIcon size={grande ? 32 : 10} weight="fill" color={corIcone} />
      )}

      <Text
        className={
          grande
            ? `font-corpo text-4xl ${corTexto}`
            : `font-corpo-medium text-xs ${corTexto}`
        }
      >
        {valor}%
      </Text>
    </View>
  );
}
