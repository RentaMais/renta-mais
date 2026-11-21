import { View, Image } from "react-native";
import { SvgUri } from "react-native-svg";

export function LogoAtivo({ url, tamanho = 42 }) {
  if (!url) {
    return (
      <View
        style={{ width: tamanho, height: tamanho }}
        className="rounded-md bg-texto/10"
      />
    );
  }

  if (url.endsWith(".svg")) {
    return (
      <View
        style={{ width: tamanho, height: tamanho }}
        className="overflow-hidden rounded-md"
      >
        <SvgUri uri={url} width={tamanho} height={tamanho} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: url }}
      style={{ width: tamanho, height: tamanho }}
      className="rounded-md"
    />
  );
}
