import { View } from "react-native";
import { cores } from "@/cores";

export function IconeContainer({
  icone: IconeComponente,
  tamanho = 56,
  tipo = "regular",
  className = "",
  ...resto
}) {
  return (
    <View
      style={{ width: tamanho, height: tamanho }}
      className={`aspect-square items-center justify-center rounded-xl bg-primaria/10 ${className}`}
      {...resto}
    >
      {IconeComponente && (
        <IconeComponente
          size={tamanho * 0.5}
          color={cores.primaria}
          weight={tipo}
        />
      )}
    </View>
  );
}
