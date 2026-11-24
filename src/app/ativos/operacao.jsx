import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { InfoIcon } from "phosphor-react-native";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { CabecalhoAtivo } from "@/components/CabecalhoAtivo";
import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { useOperacaoAtivo } from "@/hooks/useAtivos";
import { formatarMoeda } from "@/utils/formatadores";
import { cores } from "@/cores";

function FormularioResgate({ dados }) {
  return (
    <View className="gap-4">
      <View>
        <InputCustomer
          titulo="Data do resgate"
          placeholder="dd/mm/aaaa"
          value={dados.dataResgate}
          onChangeText={dados.setDataResgate}
          estado={dados.estadoData}
        />
        {dados.alertaData ? (
          <Text className="mt-1.5 font-corpo text-xs text-erro">
            {dados.alertaData}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-start gap-3 rounded-2xl border border-primaria/40 bg-primaria/20 p-4">
        <InfoIcon size={22} color={cores.primaria} />
        <View className="flex-1 gap-1">
          <Text className="font-corpo-medium text-sm text-primaria">
            {"Valor do resgate: " + formatarMoeda(dados.valorResgate)}
          </Text>
          <Text
            className={
              dados.rendimento > 0
                ? "font-corpo-medium text-sm text-positivo"
                : "font-corpo-medium text-sm text-primaria"
            }
          >
            {"Rendimento: " +
              (dados.rendimento > 0 ? "+ " : "") +
              formatarMoeda(dados.rendimento)}
          </Text>
          <Text className="font-corpo-medium text-sm text-primaria">
            {"Valor inicial: " + formatarMoeda(dados.valorInicial)}
          </Text>

          {dados.antecipado ? (
            <Text className="mt-1 font-corpo-bold text-xs text-negativo">
              {"Resgate antes do vencimento (" +
                dados.vencimento +
                "): o título não rende."}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function FormularioVenda({ dados }) {
  return (
    <View className="gap-4">
      <View>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <InputCustomer
              titulo="Quantidade a vender"
              placeholder={dados.placeholderQuantidade}
              value={dados.quantidadeVenda}
              onChangeText={dados.setQuantidadeVenda}
              keyboardType="decimal-pad"
              estado={dados.estadoQuantidade}
            />
          </View>
          <View className="flex-1">
            <InputCustomer
              titulo="Preço de venda"
              placeholder={dados.placeholderPreco || "25,00"}
              value={dados.precoVenda}
              onChangeText={dados.setPrecoVenda}
              keyboardType="decimal-pad"
              estado={dados.estadoPreco}
            />
          </View>
        </View>

        {dados.alertaQuantidade ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            {dados.alertaQuantidade}
          </Text>
        ) : null}

        {dados.alertaPreco ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            {dados.alertaPreco}
          </Text>
        ) : null}
      </View>

      <View>
        <InputCustomer
          titulo="Data da venda"
          placeholder="dd/mm/aaaa"
          value={dados.dataVenda}
          onChangeText={dados.setDataVenda}
          estado={dados.estadoData}
        />
        {dados.alertaData ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            {dados.alertaData}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-start gap-3 rounded-2xl border border-primaria/40 bg-primaria/20 p-4">
        <InfoIcon size={22} color={cores.primaria} />
        <View className="flex-1 gap-1">
          <Text className="font-corpo-medium text-sm text-primaria">
            {"Valor da venda: " + formatarMoeda(dados.valorVenda)}
          </Text>
          <Text
            className={
              dados.lucro >= 0
                ? "font-corpo-medium text-sm text-positivo"
                : "font-corpo-medium text-sm text-negativo"
            }
          >
            {"Lucro obtido: " +
              (dados.lucro >= 0 ? "+ " : "- ") +
              formatarMoeda(Math.abs(dados.lucro))}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function OperacaoAtivoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    ativo,
    ehVariavel,
    carregando,
    salvando,
    erro,
    confirmar,
    venda,
    resgate,
  } = useOperacaoAtivo(id, {
    onSucesso: () => router.replace("/(tabs)/ativos"),
  });

  if (carregando) {
    return (
      <TelaCustomer>
        <Text className="font-corpo text-base text-texto">Carregando...</Text>
      </TelaCustomer>
    );
  }

  if (!ativo) {
    return (
      <TelaCustomer>
        <VoltarCustomer />
        <Text className="mt-4 font-corpo text-base text-texto">
          Ativo não encontrado.
        </Text>
      </TelaCustomer>
    );
  }

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[120]">
        <VoltarCustomer texto="Cancelar" />

        <View className="mb-6">
          <CabecalhoAtivo ativo={ativo} />
        </View>

        {ehVariavel ? (
          <FormularioVenda dados={venda} />
        ) : (
          <FormularioResgate dados={resgate} />
        )}

        {erro !== "" && (
          <Text className="mt-4 font-corpo-medium text-sm text-erro">
            {erro}
          </Text>
        )}
      </View>

      <BotaoCustomer
        titulo={
          salvando
            ? "Confirmando..."
            : ehVariavel
              ? "Confirmar venda"
              : "Confirmar resgate"
        }
        onPress={confirmar}
        disabled={salvando}
      />
    </TelaCustomer>
  );
}
