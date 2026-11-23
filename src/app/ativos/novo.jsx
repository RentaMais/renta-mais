import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { VoltarCustomer } from "@/components/VoltarCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { InputCustomer } from "@/components/InputCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { AvisoCustomer } from "@/components/AvisoCustomer";
import { SeletorRenda } from "@/components/SeletorRenda";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { useNovoAtivo } from "@/hooks/useAtivos";
import { formatarMoeda } from "@/utils/formatadores";

function FormularioRendaFixa({ dados }) {
  return (
    <View className="gap-4">
      <InputCustomer
        titulo="Nome do título"
        placeholder="Ex: Tesouro Selic 2029"
        value={dados.nome}
        onChangeText={dados.setNome}
        estado={dados.estadoNome}
      />

      <View>
        <InputCustomer
          titulo="Valor"
          placeholder="15000,00"
          value={dados.valor}
          onChangeText={dados.setValor}
          keyboardType="decimal-pad"
          estado={dados.estadoValor}
          maxLength={12}
        />
        {dados.alertaValor ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            {dados.alertaValor}
          </Text>
        ) : null}
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-2">
          <Text className="font-corpo-bold text-base text-texto">
            Indexador
          </Text>
          <View className="h-12 justify-center rounded-2xl border border-texto/20 bg-texto/5 px-4">
            <Text className="font-corpo text-base text-texto">CDI</Text>
          </View>
        </View>
        <View className="flex-1 gap-2">
          <Text className="font-corpo-bold text-base text-texto">Taxa</Text>
          <View className="h-12 justify-center rounded-2xl border border-texto/20 bg-texto/5 px-4">
            <Text className="font-corpo text-base text-texto">100 %</Text>
          </View>
        </View>
      </View>

      <View>
        <InputCustomer
          titulo="Data de vencimento"
          placeholder="dd/mm/aaaa"
          value={dados.vencimento}
          onChangeText={dados.setVencimento}
          estado={dados.estadoVencimento}
        />
        {dados.alertaVencimento ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            {dados.alertaVencimento}
          </Text>
        ) : null}
      </View>
      <AvisoCustomer
        mensagem={
          "Rendimento estimado até o vencimento: " +
          formatarMoeda(dados.rendimentoEstimado)
        }
      />
    </View>
  );
}

function FormularioRendaVariavel({ dados }) {
  return (
    <View className="gap-4">
      <InputCustomer
        titulo="Ticker"
        placeholder="Ex: PETR4"
        value={dados.ticker}
        onChangeText={dados.setTicker}
        autoCapitalize="characters"
        estado={dados.estadoTicker}
      />

      <View>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <InputCustomer
              titulo="Quantidade"
              placeholder="120"
              value={dados.quantidade}
              onChangeText={dados.setQuantidade}
              keyboardType="decimal-pad"
              estado={dados.estadoQuantidade}
              maxLength={10}
            />
          </View>
          <View className="flex-1">
            <InputCustomer
              titulo="Preço médio"
              placeholder="34,80"
              value={dados.precoMedio}
              onChangeText={dados.setPrecoMedio}
              keyboardType="decimal-pad"
              estado={dados.estadoPreco}
              maxLength={12}
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
          titulo="Data da compra"
          placeholder="dd/mm/aaaa"
          value={dados.dataCompra}
          onChangeText={dados.setDataCompra}
          estado={dados.estadoData}
        />
        {dados.alertaData ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            {dados.alertaData}
          </Text>
        ) : null}
      </View>

      <AvisoCustomer
        mensagem={`Valor investido estimado: ${formatarMoeda(dados.valorInvestido)}`}
      />
    </View>
  );
}

export default function AdicionarAtivoScreen() {
  const router = useRouter();
  const {
    tipoRenda,
    trocarTipoRenda,
    salvando,
    erro,
    salvar,
    rendaFixa,
    rendaVariavel,
  } = useNovoAtivo({
    onSucesso: () => router.back(),
  });

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[80]">
        <VoltarCustomer texto="Cancelar" />

        <View className="mb-6">
          <CabecalhoTela titulo="Novo ativo" />
        </View>

        <View className="mb-6">
          <SeletorRenda value={tipoRenda} onChange={trocarTipoRenda} />
        </View>

        {tipoRenda === "Renda fixa" ? (
          <FormularioRendaFixa dados={rendaFixa} />
        ) : (
          <FormularioRendaVariavel dados={rendaVariavel} />
        )}

        {erro !== "" && (
          <Text className="mt-4 font-corpo-medium text-sm text-erro">
            {erro}
          </Text>
        )}
      </View>

      <View className="mt-6">
        <BotaoCustomer
          titulo={salvando ? "Salvando..." : "Salvar ativo"}
          onPress={salvar}
          disabled={salvando}
        />
      </View>
    </TelaCustomer>
  );
}
