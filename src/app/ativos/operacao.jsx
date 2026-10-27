import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { InfoIcon } from "phosphor-react-native";

import { VoltarCustomer } from "@/components/VoltarCustomer";
import { TelaCustomer } from "@/components/TelaCustomer";
import { CabecalhoAtivo } from "@/components/CabecalhoAtivo";
import { InputCustomer } from "@/components/InputCustomer";
import { BotaoCustomer } from "@/components/BotaoCustomer";

import { buscarAtivo } from "@/services/ativosService";
import { cores } from "@/cores";

function reais(numero) {
  return (
    "R$ " +
    numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Renda Fixa
function FormularioResgate({
  valorResgate,
  setValorResgate,
  dataResgate,
  setDataResgate,
  valorResgateNumero,
  rendimento,
  valorInicial,
}) {
  return (
    <View className="gap-4">
      <View className="w-1/2">
        <InputCustomer
          titulo="Valor a resgatar"
          placeholder="16850,00"
          value={valorResgate}
          onChangeText={setValorResgate}
        />
      </View>
      <InputCustomer
        titulo="Data do resgate"
        placeholder="dd/mm/aaaa"
        value={dataResgate}
        onChangeText={setDataResgate}
      />
      <View className="flex-row items-start gap-3 rounded-2xl border border-primaria/40 bg-primaria/20 p-4">
        <InfoIcon size={22} color={cores.primaria} />
        <View className="flex-1 gap-1">
          <Text className="font-corpo-medium text-sm text-primaria">
            {"Valor do resgate: " + reais(valorResgateNumero)}
          </Text>
          <Text
            className={
              rendimento >= 0
                ? "font-corpo-medium text-sm text-positivo"
                : "font-corpo-medium text-sm text-negativo"
            }
          >
            {"Rendimento: " +
              (rendimento >= 0 ? "+ " : "- ") +
              reais(rendimento)}
          </Text>
          <Text className="font-corpo-medium text-sm text-primaria">
            {"Valor inicial: " + reais(valorInicial)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Renda Variável
function FormularioVenda({
  quantidadeVenda,
  setQuantidadeVenda,
  precoVenda,
  setPrecoVenda,
  dataVenda,
  setDataVenda,
  valorVenda,
  lucro,
}) {
  return (
    <View className="gap-4">
      <View className="flex-row gap-3">
        <View className="flex-1">
          <InputCustomer
            titulo="Quantidade a vender"
            placeholder="120"
            value={quantidadeVenda}
            onChangeText={setQuantidadeVenda}
          />
        </View>
        <View className="flex-1">
          <InputCustomer
            titulo="Preço de venda"
            placeholder="46,80"
            value={precoVenda}
            onChangeText={setPrecoVenda}
          />
        </View>
      </View>
      <InputCustomer
        titulo="Data da venda"
        placeholder="dd/mm/aaaa"
        value={dataVenda}
        onChangeText={setDataVenda}
      />
      <View className="flex-row items-start gap-3 rounded-2xl border border-primaria/40 bg-primaria/20 p-4">
        <InfoIcon size={22} color={cores.primaria} />
        <View className="flex-1 gap-1">
          <Text className="font-corpo-medium text-sm text-primaria">
            {"Valor da venda: " + reais(valorVenda)}
          </Text>
          <Text
            className={
              lucro >= 0
                ? "font-corpo-medium text-sm text-positivo"
                : "font-corpo-medium text-sm text-negativo"
            }
          >
            {"Lucro obtido: " + (lucro >= 0 ? "+ " : "- ") + reais(lucro)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function OperacaoAtivoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const ativo = buscarAtivo(id);

  const hoje = new Date().toLocaleDateString("pt-BR");
  const [erro, setErro] = useState("");

  const [quantidadeVenda, setQuantidadeVenda] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [dataVenda, setDataVenda] = useState(hoje);

  const [valorResgate, setValorResgate] = useState("");
  const [dataResgate, setDataResgate] = useState(hoje);

  const ehVariavel = ativo.tipo === "renda_variavel";
  const quantidadeNumero = Number(quantidadeVenda.replace(",", ".")) || 0;
  const precoNumero = Number(precoVenda.replace(",", ".")) || 0;
  const valorResgateNumero = Number(valorResgate.replace(",", ".")) || 0;

  const valorVenda = quantidadeNumero * precoNumero;

  let lucro = 0;
  if (ehVariavel && precoNumero > 0) {
    lucro = quantidadeNumero * (precoNumero - ativo.precoMedio);
  }

  let rendimento = 0;
  if (!ehVariavel && valorResgateNumero > 0) {
    rendimento = valorResgateNumero - ativo.valorInicial;
  }

  function confirmar() {
    if (ehVariavel) {
      if (!quantidadeVenda.trim() || !precoVenda.trim() || !dataVenda.trim()) {
        setErro("Preencha todos os campos");
        return;
      }
      if (quantidadeNumero <= 0 || precoNumero <= 0) {
        setErro("Quantidade e preço de venda devem ser maiores que 0");
        return;
      }
      if (quantidadeNumero > ativo.quantidade) {
        setErro(`Você possui apenas ${ativo.quantidade} unidades deste ativo`);
        return;
      }
    } else {
      if (!valorResgate.trim() || !dataResgate.trim()) {
        setErro("Preencha todos os campos");
        return;
      }
      if (valorResgateNumero <= 0) {
        setErro("O valor deve ser maior que zero");
        return;
      }
    }
    setErro("");
    router.replace("/(tabs)");
  }

  return (
    <TelaCustomer className="justify-between">
      <View className="mt-[120]">
        <VoltarCustomer texto="Cancelar" />

        <View className="mb-6">
          <CabecalhoAtivo ativo={ativo} />
        </View>

        {ehVariavel ? (
          <FormularioVenda
            quantidadeVenda={quantidadeVenda}
            setQuantidadeVenda={setQuantidadeVenda}
            precoVenda={precoVenda}
            setPrecoVenda={setPrecoVenda}
            dataVenda={dataVenda}
            setDataVenda={setDataVenda}
            valorVenda={valorVenda}
            lucro={lucro}
          />
        ) : (
          <FormularioResgate
            valorResgate={valorResgate}
            setValorResgate={setValorResgate}
            dataResgate={dataResgate}
            setDataResgate={setDataResgate}
            valorResgateNumero={valorResgateNumero}
            rendimento={rendimento}
            valorInicial={ativo.valorInicial}
          />
        )}

        {erro !== "" && (
          <Text className="mt-4 font-corpo-medium text-sm text-erro">
            {erro}
          </Text>
        )}
      </View>

      <BotaoCustomer
        titulo={ehVariavel ? "Confirmar venda" : "Confirmar resgate"}
        onPress={confirmar}
      />
    </TelaCustomer>
  );
}
