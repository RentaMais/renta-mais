import { listarAtivos } from "@/services/ativosService";
import { buscarCotacoesAtuais } from "@/services/cotacoesService";
import { buscarDadosRentabilidade } from "@/services/rentabilidadeService";

export async function buscarDadosInicio() {
  const [ativos, dadosRentabilidade] = await Promise.all([
    listarAtivos(),
    buscarDadosRentabilidade().catch(() => ({ meses: [] })),
  ]);

  const variaveis = ativos.filter(
    (ativo) => ativo.tipo === "renda_variavel" && ativo.ticker,
  );
  const fixos = ativos.filter((ativo) => ativo.tipo !== "renda_variavel");

  let cotacoes = {};
  if (variaveis.length > 0) {
    try {
      cotacoes = await buscarCotacoesAtuais(variaveis.map((a) => a.ticker));
    } catch (_e) {
      // Mantém precoAtual salvo no ativo caso a consulta falhe
    }
  }

  const totalRendaFixa = fixos.reduce(
    (acc, ativo) => acc + Number(ativo.valorInicial || 0),
    0,
  );

  const totalRendaVariavel = variaveis.reduce((acc, ativo) => {
    const ticker = ativo.ticker.toUpperCase();
    const preco = cotacoes[ticker] ?? ativo.precoAtual ?? ativo.precoMedio ?? 0;
    return acc + Number(ativo.quantidade || 0) * Number(preco);
  }, 0);

  const patrimonioTotal = Number(
    (totalRendaFixa + totalRendaVariavel).toFixed(2),
  );

  let percentualFixa = 0;
  let percentualVariavel = 0;

  if (patrimonioTotal > 0) {
    percentualFixa = Math.round((totalRendaFixa / patrimonioTotal) * 100);
    percentualVariavel = 100 - percentualFixa;
  }

  let labelsGrafico = ["Atual"];
  let dataGrafico = [patrimonioTotal];
  let variacaoDinamica = 0;

  const meses = dadosRentabilidade.meses || [];

  if (meses.length > 0) {
    const ultimoMes = meses[meses.length - 1];
    variacaoDinamica = ultimoMes ? Number(ultimoMes.carteira) || 0 : 0;
    labelsGrafico = meses.map((m) => m.mes);

    const valoresReconstruidos = [];
    let valorCorrente = totalRendaVariavel;

    for (let i = meses.length - 1; i >= 0; i--) {
      valoresReconstruidos.unshift(
        Number((valorCorrente + totalRendaFixa).toFixed(2)),
      );
      const fator = 1 + (Number(meses[i].carteira) || 0) / 100;
      valorCorrente = fator > 0 ? valorCorrente / fator : 0;
    }

    dataGrafico = valoresReconstruidos;
  }

  if (dataGrafico.length === 1) {
    labelsGrafico = ["", "", "", "", "", "Atual"];
    dataGrafico = Array(6).fill(dataGrafico[0]);
  }

  return {
    patrimonioTotal,
    variacao: variacaoDinamica,
    temHistorico: meses.length > 0,
    divisao: [
      { name: "Renda variável", valor: percentualVariavel },
      { name: "Renda fixa", valor: percentualFixa },
    ],
    evolucao: {
      labels: labelsGrafico,
      datasets: [{ data: dataGrafico }],
    },
  };
}
