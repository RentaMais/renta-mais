import { View, Image, Platform } from "react-native";
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

  const ehSvg = url.split("?")[0].toLowerCase().endsWith(".svg");

  if (ehSvg && Platform.OS !== "web") {
    return (
      <View
        style={{ width: tamanho, height: tamanho }}
        className="items-center justify-center overflow-hidden rounded-md"
      >
        <SvgUri
          uri={url}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: url }}
      style={{ width: tamanho, height: tamanho }}
      className="rounded-md"
      resizeMode="contain"
    />
  );
}
