import { formatarPercentual } from "@/utils/formatadores";

export const TAXA_IBOVESPA = 18.5;
export const TAXA_INFLACAO = 0.04;

// Calcula o patrimônio acumulado com juros compostos mensais e ajuste opcional de inflação
export function calcularPatrimonio(
  vi,
  vm,
  taxaAnualPct,
  anos,
  inflacaoAtiva,
  taxaInflacao = TAXA_INFLACAO,
) {
  const viNum = Number(vi) || 0;
  const vmNum = Number(vm) || 0;

  let taxa = taxaAnualPct / 100;
  if (inflacaoAtiva) {
    taxa = (1 + taxa) / (1 + taxaInflacao) - 1;
  }

  const iMensal = Math.pow(1 + taxa, 1 / 12) - 1;
  const tMeses = anos * 12;

  if (iMensal === 0) return viNum + vmNum * tMeses;

  const parteVi = viNum * Math.pow(1 + iMensal, tMeses);
  const parteVm = vmNum * ((Math.pow(1 + iMensal, tMeses) - 1) / iMensal);

  return parteVi + parteVm;
}

// Abrevia valores grandes (mil, mi, bi, tri) para exibição no eixo Y do gráfico
export function formatarEixoSimulador(valor, comPrefixo = false) {
  const n = Number(valor) || 0;
  const prefixo = comPrefixo ? "R$ " : "";

  if (n >= 1e12) {
    return `${prefixo}${(n / 1e12).toFixed(1).replace(".", ",").replace(/,0$/, "")} tri`;
  }
  if (n >= 1e9) {
    return `${prefixo}${(n / 1e9).toFixed(1).replace(".", ",").replace(/,0$/, "")} bi`;
  }
  if (n >= 1e6) {
    return `${prefixo}${(n / 1e6).toFixed(1).replace(".", ",").replace(/,0$/, "")} mi`;
  }
  if (n >= 1e3) {
    return `${prefixo}${(n / 1e3).toFixed(1).replace(".", ",")} mil`;
  }
  return `${prefixo}${Math.round(n)}`;
}

// Gera os resultados finais por perfil e os pontos da curva de evolução patrimonial
export function gerarProjecaoSimulador({
  aporteInicial,
  aporteMensal,
  rentabilidade,
  tempoSelecionado,
  descontarInflacao,
  taxaIbovespa = TAXA_IBOVESPA,
  taxaInflacao = TAXA_INFLACAO,
}) {
  const taxaRfNum = Number(String(rentabilidade).replace(",", ".")) || 0;
  const taxaArrojado = 0.7 * taxaIbovespa + 0.3 * taxaRfNum;
  const taxaModerado = 0.5 * taxaIbovespa + 0.5 * taxaRfNum;
  const taxaConservador = taxaRfNum;

  const pctIbovespa = formatarPercentual(taxaIbovespa);
  const pctArrojado = formatarPercentual(taxaArrojado);
  const pctModerado = formatarPercentual(taxaModerado);
  const pctConservador = formatarPercentual(taxaConservador);

  const perfis = [
    {
      id: "arrojado",
      nome: "Arrojado",
      descricao: `70% Ibovespa (${pctIbovespa}) + 30% Renda Fixa (${pctConservador}), resultante: (${pctArrojado})`,
      valor: calcularPatrimonio(
        aporteInicial,
        aporteMensal,
        taxaArrojado,
        tempoSelecionado,
        descontarInflacao,
        taxaInflacao,
      ),
    },
    {
      id: "moderado",
      nome: "Moderado",
      descricao: `50% Ibovespa (${pctIbovespa}) + 50% Renda Fixa (${pctConservador}), resultante: (${pctModerado})`,
      valor: calcularPatrimonio(
        aporteInicial,
        aporteMensal,
        taxaModerado,
        tempoSelecionado,
        descontarInflacao,
        taxaInflacao,
      ),
    },
    {
      id: "conservador",
      nome: "Conservador",
      descricao: `100% de renda fixa (${pctConservador})`,
      valor: calcularPatrimonio(
        aporteInicial,
        aporteMensal,
        taxaConservador,
        tempoSelecionado,
        descontarInflacao,
        taxaInflacao,
      ),
    },
  ];

  const passos = 5;
  const labels = [];
  const arrojado = [];
  const moderado = [];
  const conservador = [];

  for (let i = 0; i <= passos; i++) {
    const anoAtual = Math.round((tempoSelecionado / passos) * i);
    labels.push(anoAtual === 0 ? "0" : `${anoAtual}a`);

    if (anoAtual === 0) {
      const viNum = Number(aporteInicial) || 0;
      arrojado.push(viNum);
      moderado.push(viNum);
      conservador.push(viNum);
    } else {
      arrojado.push(
        calcularPatrimonio(
          aporteInicial,
          aporteMensal,
          taxaArrojado,
          anoAtual,
          descontarInflacao,
          taxaInflacao,
        ),
      );
      moderado.push(
        calcularPatrimonio(
          aporteInicial,
          aporteMensal,
          taxaModerado,
          anoAtual,
          descontarInflacao,
          taxaInflacao,
        ),
      );
      conservador.push(
        calcularPatrimonio(
          aporteInicial,
          aporteMensal,
          taxaConservador,
          anoAtual,
          descontarInflacao,
          taxaInflacao,
        ),
      );
    }
  }

  return {
    perfis,
    grafico: {
      labels,
      series: { arrojado, moderado, conservador },
    },
  };
}
