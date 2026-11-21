import { Text, View } from "react-native";
import { CheckCircleIcon, CircleIcon } from "phosphor-react-native";
import { avaliarRequisitosSenha } from "@/utils/validacoesAuth";
import { cores } from "@/cores";

const CONFIG_FORCA = {
  fraca: {
    rotulo: "Fraca",
    corTexto: "text-negativo",
    corBarra: "bg-negativo",
    nivel: 1,
  },
  media: {
    rotulo: "Média",
    corTexto: "text-primaria",
    corBarra: "bg-primaria",
    nivel: 2,
  },
  forte: {
    rotulo: "Forte",
    corTexto: "text-positivo",
    corBarra: "bg-positivo",
    nivel: 3,
  },
};

export function RequisitosSenha({ senha = "" }) {
  const { itens, forca } = avaliarRequisitosSenha(senha);
  const config = CONFIG_FORCA[forca];

  return (
    <View className="mt-3 rounded-xl border border-texto/10 bg-container p-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-corpo-medium text-xs text-subtexto">
          Força da senha
        </Text>
        <Text className={`font-corpo-bold text-xs ${config.corTexto}`}>
          {senha.length > 0 ? config.rotulo : "Não informada"}
        </Text>
      </View>

      <View className="flex-row gap-1.5 mb-3">
        {[1, 2, 3].map((passo) => {
          const ativo = senha.length > 0 && passo <= config.nivel;
          return (
            <View
              key={passo}
              className={`h-1.5 flex-1 rounded-full ${
                ativo ? config.corBarra : "bg-texto/15"
              }`}
            />
          );
        })}
      </View>

      <View className="flex-row flex-wrap gap-y-1.5">
        {itens.map((item) => (
          <View
            key={item.id}
            className="w-1/2 min-w-[140px] flex-row items-center gap-1.5 pr-2"
          >
            {item.atendido ? (
              <CheckCircleIcon size={15} color={cores.positivo} weight="fill" />
            ) : (
              <CircleIcon size={15} color={cores.subtexto} />
            )}
            <Text
              className={`font-corpo text-xs flex-shrink ${
                item.atendido
                  ? "text-positivo font-corpo-medium"
                  : "text-subtexto"
              }`}
            >
              {item.texto}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
