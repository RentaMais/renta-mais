import { Switch } from "react-native";
import { cores } from "@/cores";

export function SwitchCustomer({ value, onValueChange }) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: cores.trilho, true: cores.primaria }}
      thumbColor={value ? cores.container : cores.fundo}
      ios_backgroundColor={cores.trilho}
    />
  );
}
