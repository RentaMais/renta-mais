import { useState } from "react";
import { gerarProjecaoSimulador } from "@/utils/calculosSimulador";

const LIMITE_APORTE_INICIAL = 10000000;
const LIMITE_APORTE_MENSAL = 100000;
const LIMITE_RENTABILIDADE = 50;
const OPCOES_ANOS = [10, 20, 30, 40];

// Gerencia os campos, limites e projeções da tela de simulação
export function useSimulador() {
  const [aporteInicial, setAporteInicial] = useState("");
  const [aporteMensal, setAporteMensal] = useState("");
  const [rentabilidade, setRentabilidade] = useState("");
  const [tempoSelecionado, setTempoSelecionado] = useState(10);
  const [descontarInflacao, setDescontarInflacao] = useState(true);

  function tratarAporte(texto, setValor, limite) {
    const apenasNums = texto.replace(/\D/g, "");
    const valor = Number(apenasNums) || 0;
    if (valor > limite) {
      setValor(String(limite));
      return;
    }
    setValor(apenasNums);
  }

  function alterarAporteInicial(texto) {
    tratarAporte(texto, setAporteInicial, LIMITE_APORTE_INICIAL);
  }

  function alterarAporteMensal(texto) {
    tratarAporte(texto, setAporteMensal, LIMITE_APORTE_MENSAL);
  }

  function alterarRentabilidade(texto) {
    const formatado = texto.replace(",", ".");
    const valor = Number(formatado) || 0;
    if (valor < 0) {
      setRentabilidade("0");
      return;
    }
    if (valor > LIMITE_RENTABILIDADE) {
      setRentabilidade(String(LIMITE_RENTABILIDADE));
      return;
    }
    setRentabilidade(formatado);
  }

  const { perfis, grafico } = gerarProjecaoSimulador({
    aporteInicial,
    aporteMensal,
    rentabilidade,
    tempoSelecionado,
    descontarInflacao,
  });

  return {
    aporteInicial,
    alterarAporteInicial,
    aporteMensal,
    alterarAporteMensal,
    rentabilidade,
    alterarRentabilidade,
    opcoesAnos: OPCOES_ANOS,
    tempoSelecionado,
    setTempoSelecionado,
    descontarInflacao,
    setDescontarInflacao,
    perfis,
    grafico,
  };
}
