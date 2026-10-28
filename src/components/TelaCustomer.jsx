import { ScrollView, View } from "react-native";

export function TelaCustomer({ children, className = "", ...props }) {
  return (
    <ScrollView
      className="flex-1 bg-fundo"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBlock: 64,
        alignItems: "center",
      }}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      <View className={`w-[90vw] flex-1 gap-4 ${className}`}>{children}</View>
    </ScrollView>
  );
}
