import { useState } from "react";
import { Text, View, Pressable, TextInput, Dimensions } from "react-native";
import { Dot } from "phosphor-react-native";

import { cores } from "@/cores";
import { LineChart } from "react-native-chart-kit";
import { CabecalhoInicio } from "@/components/CabecalhoInicio";
import { TelaCustomer } from "@/components/TelaCustomer";
import { CardCustomer } from "@/components/CardCustomer";
import { SwitchCustomer } from "@/components/SwitchCustomer";
import { TituloCardCustomer } from "@/components/TituloCardCustomer";
import { formatarReais } from "@/utils/formatarReais";

import simuladorDados from "@/mocks/simulador.json";

export default function SimuladorScreen() {
  const [aporteInicial, setAporteInicial] = useState("");
  const [aporteMensal, setAporteMensal] = useState("");
  const [rentabilidade, setRentabilidade] = useState("");

  const [tempoSelecionado, setTempoSelecionado] = useState(10);
  const [descontarInflacao, setDescontarInflacao] = useState(true);

  const tratarAporte = (texto, setValor, limite) => {
    const apenasNums = texto.replace(/\D/g, "");
    const valor = Number(apenasNums) || 0;
    if (valor > limite) {
      setValor(String(limite));
      return;
    }
    setValor(apenasNums);
  };

  const tratarRentabilidade = (texto) => {
    const formatado = texto.replace(",", ".");
    const valor = Number(formatado) || 0;
    if (valor > simuladorDados.limiteRentabilidade) {
      setRentabilidade(String(simuladorDados.limiteRentabilidade));
      return;
    }
    setRentabilidade(formatado);
  };

  const acoesCampos = {
    "aporte-inicial": {
      value: aporteInicial,
      onChangeText: (t) =>
        tratarAporte(t, setAporteInicial, simuladorDados.limiteAporteInicial),
    },
    "aporte-mensal": {
      value: aporteMensal,
      onChangeText: (t) =>
        tratarAporte(t, setAporteMensal, simuladorDados.limiteAporteMensal),
    },
    rentabilidade: {
      value: rentabilidade,
      onChangeText: tratarRentabilidade,
    },
  };

  function calcularPatrimonio(vi, vm, taxaAnualPct, anos, inflacaoAtiva) {
    const viNum = Number(vi) || 0;
    const vmNum = Number(vm) || 0;

    let taxa = taxaAnualPct / 100;

    if (inflacaoAtiva) {
      taxa = (1 + taxa) / (1 + simuladorDados.taxaInflacao) - 1;
    }

    const iMensal = Math.pow(1 + taxa, 1 / 12) - 1;
    const tMeses = anos * 12;

    if (iMensal === 0) return viNum + vmNum * tMeses;

    const parteVi = viNum * Math.pow(1 + iMensal, tMeses);
    const parteVm = vmNum * ((Math.pow(1 + iMensal, tMeses) - 1) / iMensal);

    return parteVi + parteVm;
  }

  function formatarValor(valor, comPrefixo = false) {
    const n = Number(valor) || 0;
    const prefixo = comPrefixo ? "R$ " : "";

    if (n >= 1000000) {
      return `${prefixo}${(n / 1000000).toFixed(1).replace(".", ",").replace(/,0$/, "")} mi`;
    }
    if (n >= 1000) {
      return `${prefixo}${Math.round(n / 1000)} mil`;
    }
    return `${prefixo}${Math.round(n)}`;
  }

  const taxaRfNum = Number(rentabilidade.replace(",", ".")) || 0;
  const taxaIbovespa = simuladorDados.taxaIbovespa;
  const taxaArrojado = 0.7 * taxaIbovespa + 0.3 * taxaRfNum;
  const taxaModerado = 0.5 * taxaIbovespa + 0.5 * taxaRfNum;
  const taxaConservador = taxaRfNum;

  const perfisInvestimento = [
    {
      id: "arrojado",
      nome: "Arrojado",
      cor: cores.texto,
      descricao: `70% Ibovespa (${taxaIbovespa.toFixed(1)}%) + 30% Renda Fixa (${taxaConservador.toFixed(1)}%), resultante: (${taxaArrojado.toFixed(1)}%)`,
      valor: calcularPatrimonio(
        aporteInicial,
        aporteMensal,
        taxaArrojado,
        tempoSelecionado,
        descontarInflacao,
      ),
    },
    {
      id: "moderado",
      nome: "Moderado",
      cor: cores.primaria,
      descricao: `50% Ibovespa (${taxaIbovespa.toFixed(1)}%) + 50% Renda Fixa (${taxaConservador.toFixed(1)}%), resultante: (${taxaModerado.toFixed(1)}%)`,
      valor: calcularPatrimonio(
        aporteInicial,
        aporteMensal,
        taxaModerado,
        tempoSelecionado,
        descontarInflacao,
      ),
    },
    {
      id: "conservador",
      nome: "Conservador",
      cor: cores.positivo,
      descricao: `100% de renda fixa (${taxaConservador.toFixed(1)}%)`,
      valor: calcularPatrimonio(
        aporteInicial,
        aporteMensal,
        taxaConservador,
        tempoSelecionado,
        descontarInflacao,
      ),
    },
  ];

  const gerarDadosGrafico = () => {
    const passos = 5;
    const labels = [];
    const dadosArrojado = [];
    const dadosModerado = [];
    const dadosConservador = [];

    for (let i = 0; i <= passos; i++) {
      const anoAtual = Math.round((tempoSelecionado / passos) * i);
      labels.push(anoAtual === 0 ? "0" : `${anoAtual}a`);

      if (anoAtual === 0) {
        const viNum = Number(aporteInicial) || 0;
        dadosArrojado.push(viNum);
        dadosModerado.push(viNum);
        dadosConservador.push(viNum);
      } else {
        dadosArrojado.push(
          calcularPatrimonio(
            aporteInicial,
            aporteMensal,
            taxaArrojado,
            anoAtual,
            descontarInflacao,
          ),
        );
        dadosModerado.push(
          calcularPatrimonio(
            aporteInicial,
            aporteMensal,
            taxaModerado,
            anoAtual,
            descontarInflacao,
          ),
        );
        dadosConservador.push(
          calcularPatrimonio(
            aporteInicial,
            aporteMensal,
            taxaConservador,
            anoAtual,
            descontarInflacao,
          ),
        );
      }
    }

    return {
      labels,
      datasets: [
        {
          data: dadosArrojado.length > 0 ? dadosArrojado : [0],
          color: () => cores.texto,
          strokeWidth: 3,
        },
        {
          data: dadosModerado.length > 0 ? dadosModerado : [0],
          color: () => cores.primaria,
          strokeWidth: 3,
        },
        {
          data: dadosConservador.length > 0 ? dadosConservador : [0],
          color: () => cores.positivo,
          strokeWidth: 3,
        },
      ],
    };
  };

  const larguraTela = Dimensions.get("window").width * 0.85 - 32;

  return (
    <TelaCustomer>
      <CabecalhoInicio
        subtitulo={simuladorDados.subtitulo}
        titulo={simuladorDados.titulo}
        descricao={simuladorDados.descricao}
      />

      <CardCustomer className="gap-5">
        {simuladorDados.campos.map((campo) => {
          const acao = acoesCampos[campo.id];
          return (
            <View key={campo.id} className="w-full gap-1">
              <Text className="font-corpo-bold text-base text-texto">
                {campo.titulo}
              </Text>
              <View className="border-b border-dashed border-primaria/50 pb-1">
                <TextInput
                  placeholder={campo.placeholder}
                  placeholderTextColor={cores.placeholder}
                  value={acao?.value}
                  onChangeText={acao?.onChangeText}
                  keyboardType="numeric"
                  style={{ outlineStyle: "none" }}
                  className="font-corpo text-lg text-primaria"
                />
              </View>
            </View>
          );
        })}

        <View className="w-full gap-2">
          <Text className="font-corpo-bold text-base text-texto">
            Tempo de investimento
          </Text>
          <View className="flex-row justify-between gap-2">
            {simuladorDados.anosOpcoes.map((anos) => (
              <Pressable
                key={anos}
                onPress={() => setTempoSelecionado(anos)}
                className={`flex-1 h-11 items-center justify-center rounded-xl border ${
                  tempoSelecionado === anos
                    ? "bg-texto border-texto"
                    : "bg-container border-texto/30"
                }`}
              >
                <Text
                  className={`font-corpo-bold text-sm ${
                    tempoSelecionado === anos ? "text-fundo" : "text-texto"
                  }`}
                >
                  {anos} anos
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </CardCustomer>

      <CardCustomer className="flex-row items-center justify-between">
        <View className="flex-1 pr-4 gap-1">
          <TituloCardCustomer titulo="Descontar inflação" />

          <Text className="font-corpo text-sm text-texto">
            Mostra os valores em poder de compra de hoje (IPCA projetado de 4%
            a.a.)
          </Text>
        </View>
        <SwitchCustomer
          value={descontarInflacao}
          onValueChange={setDescontarInflacao}
        />
      </CardCustomer>

      <CardCustomer className="gap-5">
        <TituloCardCustomer titulo="Patrimônio projetado" />

        <View className="items-center -ml-4">
          <LineChart
            data={gerarDadosGrafico()}
            width={larguraTela + 20}
            height={180}
            formatYLabel={(v) => formatarValor(v)}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "transparent",
              backgroundGradientTo: "transparent",
              decimalPlaces: 0,
              color: () => cores.texto,
              labelColor: () => cores.subtexto,
            }}
            withDots={false}
            withShadow={false}
          />
        </View>

        <View className="divide-y divide-texto/10">
          {perfisInvestimento.map((perfil) => (
            <View key={perfil.id} className="py-3 gap-1">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Dot size={24} color={perfil.cor} weight="fill" />
                  <Text className="font-corpo-bold text-base text-texto">
                    {perfil.nome}
                  </Text>
                </View>
                <Text className="font-corpo-bold text-base text-texto">
                  {formatarReais(perfil.valor)}
                </Text>
              </View>
              <Text className="font-corpo text-xs text-subtexto pl-8">
                {perfil.descricao}
              </Text>
            </View>
          ))}
        </View>
      </CardCustomer>

      {descontarInflacao && (
        <Text className="font-corpo text-xs text-subtexto text-center">
          Valores acima já descontam a inflação projetada. Desative a opção para
          ver os valores nominais.
        </Text>
      )}
    </TelaCustomer>
  );
}
