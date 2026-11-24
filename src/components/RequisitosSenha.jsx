import { Text, View } from "react-native";
import { CheckCircleIcon, CircleIcon } from "phosphor-react-native";
import { avaliarRequisitosSenha } from "@/utils/validacoesAuth";
import { cores } from "@/cores";

const ESTILO_FORCA = {
  fraca: {
    forcaRotulo: "Fraca",
    corTexto: "text-negativo",
    corBarra: "bg-negativo",
    nivel: 1,
  },
  media: {
    forcaRotulo: "Média",
    corTexto: "text-primaria",
    corBarra: "bg-primaria",
    nivel: 2,
  },
  forte: {
    forcaRotulo: "Forte",
    corTexto: "text-positivo",
    corBarra: "bg-positivo",
    nivel: 3,
  },
};

export function RequisitosSenha({ senha = "" }) {
  const { requisitos, forca } = avaliarRequisitosSenha(senha);
  const estilo = ESTILO_FORCA[forca];

  return (
    <View className="mt-3 rounded-xl border border-texto/10 bg-container p-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-corpo-medium text-xs text-subtexto">
          Força da senha
        </Text>
        <Text
          className={`font-corpo-bold text-xs ${senha.length > 0 ? estilo.corTexto : "text-placeholder"}`}
        >
          {senha.length > 0 ? estilo.forcaRotulo : "Não informada"}
        </Text>
      </View>

      <View className="flex-row gap-1.5 mb-3">
        {[1, 2, 3].map((nivel) => {
          const ativo = senha.length > 0 && nivel <= estilo.nivel;
          return (
            <View
              key={nivel}
              className={`h-1.5 flex-1 rounded-full ${
                ativo ? estilo.corBarra : "bg-texto/15"
              }`}
            />
          );
        })}
      </View>

      <View className="flex-row flex-wrap gap-y-1.5">
        {requisitos.map((req) => (
          <View
            key={req.id}
            className="w-1/2 min-w-[140px] flex-row items-center gap-1.5 pr-2"
          >
            {req.foiAtendido ? (
              <CheckCircleIcon size={15} color={cores.positivo} weight="fill" />
            ) : (
              <CircleIcon size={15} color={cores.subtexto} />
            )}
            <Text
              className={`font-corpo text-xs flex-shrink ${
                req.foiAtendido
                  ? "text-positivo font-corpo-medium"
                  : "text-subtexto"
              }`}
            >
              {req.texto}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
