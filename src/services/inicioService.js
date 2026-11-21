import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import { obterUsuarioAtual } from "@/services/authService";
import { buscarCotacoesAtuais } from "@/services/cotacoesService";
import { buscarDadosRentabilidade } from "@/services/rentabilidadeService";

function obterQuantidadeVariavel(ativo) {
  let quantidade = Number(ativo.quantity || 0);
  if (quantidade === 0 && Array.isArray(ativo.aportes)) {
    quantidade = ativo.aportes.reduce(
      (acc, ap) => acc + Number(ap.quantity || 0),
      0,
    );
  }
  return quantidade;
}

function obterValorRendaFixa(ativo) {
  let valor = Number(ativo.totalInvested || 0);
  if (valor === 0 && Array.isArray(ativo.aportes)) {
    valor = ativo.aportes.reduce(
      (acc, ap) =>
        acc +
        Number(
          ap.invested ?? Number(ap.quantity || 0) * Number(ap.unitPrice || 0),
        ),
      0,
    );
  }
  return valor;
}

export function calcularResumoInicio(
  ativos = [],
  mesesRentabilidade = [],
  cotacoesAtuais = {},
) {
  let totalRendaFixa = 0;
  let totalRendaVariavel = 0;
  let totalInvestidoCarteira = 0;

  ativos.forEach((ativo) => {
    if (ativo.type === "fixed") {
      const valorFixa = obterValorRendaFixa(ativo);
      totalRendaFixa += valorFixa;
      totalInvestidoCarteira += valorFixa;
      return;
    }

    const quantidade = obterQuantidadeVariavel(ativo);
    const ticker = String(ativo.ticker || "")
      .trim()
      .toUpperCase();
    const cotacao =
      cotacoesAtuais[ticker] ??
      (Number(ativo.currentPrice) || Number(ativo.averagePrice) || 0);

    totalRendaVariavel += quantidade * cotacao;

    const custoVariavel =
      Number(ativo.totalInvested || 0) ||
      quantidade * Number(ativo.averagePrice || 0);
    totalInvestidoCarteira += custoVariavel;
  });

  const patrimonioTotal = Number(
    (totalRendaFixa + totalRendaVariavel).toFixed(2),
  );

  let percentualFixa = 0;
  let percentualVariavel = 0;

  if (patrimonioTotal > 0) {
    percentualFixa = Math.round((totalRendaFixa / patrimonioTotal) * 100);
    percentualVariavel = 100 - percentualFixa;
  }

  let labelsGrafico = [];
  let dataGrafico = [];
  let variacaoDinamica = 0;

  if (mesesRentabilidade.length > 0) {
    const ultimoMes = mesesRentabilidade[mesesRentabilidade.length - 1];
    variacaoDinamica = ultimoMes ? Number(ultimoMes.carteira) || 0 : 0;

    labelsGrafico = mesesRentabilidade.map((m) => m.mes);

    const valoresReconstruidos = [];
    let valorCorrente = patrimonioTotal;

    for (let i = mesesRentabilidade.length - 1; i >= 0; i--) {
      valoresReconstruidos.unshift(Number(valorCorrente.toFixed(2)));
      const taxaMes = (Number(mesesRentabilidade[i].carteira) || 0) / 100;
      const fator = 1 + taxaMes;
      valorCorrente = fator > 0 ? valorCorrente / fator : 0;
    }

    dataGrafico = valoresReconstruidos;
  } else {
    labelsGrafico = ["Atual"];
    dataGrafico = [patrimonioTotal];
    variacaoDinamica =
      totalInvestidoCarteira > 0
        ? Number(
            (
              ((patrimonioTotal - totalInvestidoCarteira) /
                totalInvestidoCarteira) *
              100
            ).toFixed(1),
          )
        : 0;
  }

  return {
    patrimonioTotal,
    totalRendaFixa: Number(totalRendaFixa.toFixed(2)),
    totalRendaVariavel: Number(totalRendaVariavel.toFixed(2)),
    variacao: variacaoDinamica,
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

export async function buscarDadosInicio() {
  const user = obterUsuarioAtual();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const [assetsSnapshot, dadosRentabilidade] = await Promise.all([
    getDocs(collection(db, "users", user.uid, "assets")),
    buscarDadosRentabilidade().catch(() => ({ meses: [] })),
  ]);

  const ativos = assetsSnapshot.docs.map((doc) => doc.data());

  const tickersVariaveis = ativos
    .filter((ativo) => ativo.type === "variable" && ativo.ticker)
    .map((ativo) => ativo.ticker);

  const cotacoesAtuais = await buscarCotacoesAtuais(tickersVariaveis).catch(
    () => ({}),
  );

  return calcularResumoInicio(
    ativos,
    dadosRentabilidade.meses || [],
    cotacoesAtuais,
  );
}
