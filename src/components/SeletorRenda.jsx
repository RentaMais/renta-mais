import { View, Text, Pressable } from "react-native";

export default function SeletorRenda({ value, onChange }) {
  return (
    <View className="w-full flex-row rounded-3xl bg-texto/5 p-2">
      <Pressable
        onPress={() => onChange("Renda fixa")}
        className={
          value === "Renda fixa"
            ? "flex-1 items-center rounded-2xl bg-white py-2.5"
            : "flex-1 items-center rounded-2xl py-2.5"
        }
      >
        <Text
          className={
            value === "Renda fixa"
              ? "text-lg text-texto"
              : "text-lg text-inativo"
          }
        >
          Renda fixa
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange("Renda variável")}
        className={
          value === "Renda variável"
            ? "flex-1 items-center rounded-2xl bg-white py-2.5"
            : "flex-1 items-center rounded-2xl py-2.5"
        }
      >
        <Text
          className={
            value === "Renda variável"
              ? "text-lg text-texto"
              : "text-lg text-inativo"
          }
        >
          Renda variável
        </Text>
      </Pressable>
    </View>
  );
}