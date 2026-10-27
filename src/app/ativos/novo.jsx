import { useState } from "react";
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

import { cores } from "@/cores";

//Formulário de Renda Fixa
function FormularioRendaFixa({
  nome,
  setNome,
  valor,
  setValor,
  indexador,
  setIndexador,
  indexadorAberto,
  setIndexadorAberto,
  opcoesIndexador,
  taxa,
  setTaxa,
  vencimento,
  setVencimento,
}) {
  return (
    <View className="gap-4">
      <InputCustomer
        titulo="Nome do título"
        placeholder="Ex: Tesouro Selic 2029"
        value={nome}
        onChangeText={setNome}
      />
      <InputCustomer
        titulo="Valor"
        placeholder="R$ 15.000,00"
        value={valor}
        onChangeText={setValor}
      />
      <View className="flex-row items-start gap-3">
        <View className="flex-1 gap-1">
          <Text className="font-corpo-bold text-base text-texto">
            Indexador
          </Text>
          <Pressable
            onPress={() => setIndexadorAberto(!indexadorAberto)}
            className="h-12 flex-row items-center justify-between rounded-2xl border border-texto/20 bg-white px-4"
          >
            <Text className="font-corpo text-base text-texto">{indexador}</Text>
            {indexadorAberto ? (
              <CaretUpIcon size={18} color={cores.texto} />
            ) : (
              <CaretDownIcon size={18} color={cores.texto} />
            )}
          </Pressable>
          {indexadorAberto &&
            opcoesIndexador.map((opcao) => (
              <Pressable
                key={opcao}
                onPress={() => {
                  setIndexador(opcao);
                  setIndexadorAberto(false);
                }}
                className="rounded-2xl border-texto/10 bg-container px-4 py-3"
              >
                <Text
                  className={
                    opcao === indexador
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
            value={taxa}
            onChangeText={setTaxa}
          />
        </View>
      </View>
      <InputCustomer
        titulo="Data de vencimento"
        placeholder="dd/mm/aaaa"
        value={vencimento}
        onChangeText={setVencimento}
      />
    </View>
  );
}

//Formulário de Renda Variável
function FormularioRendaVariavel({
  ticker,
  setTicker,
  quantidade,
  setQuantidade,
  precoMedio,
  setPrecoMedio,
  dataCompra,
  setDataCompra,
  valorInvestido,
}) {
  return (
    <View className="gap-4">
      <InputCustomer
        titulo="Ticker"
        placeholder="Ex: PETR4"
        value={ticker}
        onChangeText={setTicker}
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <InputCustomer
            titulo="Quantidade"
            placeholder="120"
            value={quantidade}
            onChangeText={setQuantidade}
          />
        </View>
        <View className="flex-1">
          <InputCustomer
            titulo="Preço médio"
            placeholder="34,80"
            value={precoMedio}
            onChangeText={setPrecoMedio}
          />
        </View>
      </View>
      <InputCustomer
        titulo="Data da compra"
        placeholder="dd/mm/aaaa"
        value={dataCompra}
        onChangeText={setDataCompra}
      />
      <AvisoCustomer
        mensagem={
          "Valor investido estimado: " + formatarMoeda(valorInvestido)
        }
      />
    </View>
  );
}

export default function AdicionarAtivoScreen() {
  const router = useRouter();
  const [tipoRenda, setTipoRenda] = useState("Renda fixa");
  const [erro, setErro] = useState("");

  // Renda Fixa
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [indexador, setIndexador] = useState("Selic");
  const [indexadorAberto, setIndexadorAberto] = useState(false);
  const [taxa, setTaxa] = useState("");
  const [vencimento, setVencimento] = useState("");

  // Renda Variável
  const [ticker, setTicker] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoMedio, setPrecoMedio] = useState("");
  const [dataCompra, setDataCompra] = useState("");

  const opcoesIndexador = ["Selic", "CDI", "IPCA", "Prefixado"];
  const valorNumero = Number(valor.replace(",", ".")) || 0;
  const quantidadeNumero = Number(quantidade.replace(",", ".")) || 0;
  const precoNumero = Number(precoMedio.replace(",", ".")) || 0;
  const valorInvestido = quantidadeNumero * precoNumero;

  function salvar() {
    if (tipoRenda === "Renda fixa") {
      if (!nome.trim() || !valor.trim() || !taxa.trim() || !vencimento.trim()) {
        setErro("Preencha todos os campos");
        return;
      }
      if (valorNumero <= 0) {
        setErro("O valor deve ser maior que zero");
        return;
      }
    } else {
      if (!ticker.trim() || !quantidade.trim() || !precoMedio.trim() || !dataCompra.trim()) {
        setErro("Preencha todos os campos");
        return;
      }
      if (quantidadeNumero <= 0 || precoNumero <= 0) {
        setErro("Quantidade e preço médio devem ser maiores que 0");
        return;
      }
    }
    setErro("");
    router.back();
  }

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[80]">
        <VoltarCustomer texto="Cancelar" />

        <View className="mb-6">
          <CabecalhoTela titulo="Novo ativo" />
        </View>

        <View className="mb-6">
          <SeletorRenda
            value={tipoRenda}
            onChange={(tipo) => {
              setTipoRenda(tipo);
              setErro("");
            }}
          />
        </View>

        {tipoRenda === "Renda fixa" ? (
          <FormularioRendaFixa
            nome={nome}
            setNome={setNome}
            valor={valor}
            setValor={setValor}
            indexador={indexador}
            setIndexador={setIndexador}
            indexadorAberto={indexadorAberto}
            setIndexadorAberto={setIndexadorAberto}
            opcoesIndexador={opcoesIndexador}
            taxa={taxa}
            setTaxa={setTaxa}
            vencimento={vencimento}
            setVencimento={setVencimento}
          />
        ) : (
          <FormularioRendaVariavel
            ticker={ticker}
            setTicker={setTicker}
            quantidade={quantidade}
            setQuantidade={setQuantidade}
            precoMedio={precoMedio}
            setPrecoMedio={setPrecoMedio}
            dataCompra={dataCompra}
            setDataCompra={setDataCompra}
            valorInvestido={valorInvestido}
          />
        )}

        {erro !== "" && (
          <Text className="mt-4 font-corpo-medium text-sm text-erro">
            {erro}
          </Text>
        )}
      </View>

      <View className="mt-6">
        <BotaoCustomer titulo="Salvar ativo" onPress={salvar} />
      </View>
    </TelaCustomer>
  );
}
