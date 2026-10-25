import { View } from "react-native";

export function CardCustomer({ children, className = "", ...props }) {
  return (
    <View
      className={`rounded-2xl bg-card p-5 border border-texto/10 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
