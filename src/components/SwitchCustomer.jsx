import { Switch, Platform } from "react-native";
import { cores } from "@/cores";

export function SwitchCustomer({ value, onValueChange }) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: cores.trilho,
        true: cores.primaria,
      }}
      thumbColor={
        Platform.OS === "ios"
          ? undefined
          : value
            ? cores.container
            : cores.subtexto
      }
      activeThumbColor={Platform.OS === "web" ? cores.container : undefined}
      ios_backgroundColor={cores.trilho}
    />
  );
}
