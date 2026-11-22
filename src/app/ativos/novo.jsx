import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { CaretDownIcon, CaretUpIcon } from "phosphor-react-native";

import { VoltarCustomer } from "@/components/VoltarCustomer";
import { CabecalhoTela } from "@/components/CabecalhoTela";
import { InputCustomer } from "@/components/InputCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { AvisoCustomer } from "@/components/AvisoCustomer";
import { SeletorRenda } from "@/components/SeletorRenda";
import { BotaoCustomer } from "@/components/BotaoCustomer";
import { useNovoAtivo } from "@/hooks/useAtivos";
import { formatarMoeda } from "@/utils/formatarMoeda";
import { cores } from "@/cores";

const OPCOES_INDEXADOR = ["Selic", "CDI", "IPCA", "Prefixado"];

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
        />
        {dados.alertaValor ? (
          <Text className="text-erro font-corpo text-xs mt-1.5">
            {dados.alertaValor}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-start gap-3">
        <View className="flex-1 gap-1">
          <Text className="font-corpo-bold text-base text-texto">
            Indexador
          </Text>
          <Pressable
            onPress={() => dados.setIndexadorAberto(!dados.indexadorAberto)}
            className="h-12 flex-row items-center justify-between rounded-2xl border border-texto/20 bg-white px-4"
          >
            <Text className="font-corpo text-base text-texto">
              {dados.indexador}
            </Text>
            {dados.indexadorAberto ? (
              <CaretUpIcon size={18} color={cores.texto} />
            ) : (
              <CaretDownIcon size={18} color={cores.texto} />
            )}
          </Pressable>
          {dados.indexadorAberto &&
            OPCOES_INDEXADOR.map((opcao) => (
              <Pressable
                key={opcao}
                onPress={() => {
                  dados.setIndexador(opcao);
                  dados.setIndexadorAberto(false);
                }}
                className="rounded-2xl border-texto/10 bg-container px-4 py-3"
              >
                <Text
                  className={
                    opcao === dados.indexador
                      ? "font-corpo-bold text-base text-texto"
                      : "font-corpo text-base text-texto"
                  }
                >
                  {opcao}
                </Text>
              </Pressable>
            ))}
        </View>
        <View className="flex-1">
          <InputCustomer
            titulo="Taxa"
            placeholder="100 %"
            value={dados.taxa}
            onChangeText={dados.setTaxa}
            estado={dados.estadoTaxa}
          />
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
