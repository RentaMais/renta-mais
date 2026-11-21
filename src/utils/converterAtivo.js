import { formatarMoeda } from "@/utils/formatarMoeda";
import { dataParaBR } from "@/utils/formatarData";

export function converterAtivo(id, dados) {
  if (dados.type === "variable") {
    let quantidade = Number(dados.quantity || 0);
    if (quantidade === 0 && Array.isArray(dados.aportes)) {
      quantidade = dados.aportes.reduce(
        (acc, ap) => acc + Number(ap.quantity || 0),
        0,
      );
    }

    const precoMedio = Number(dados.averagePrice || 0);
    const precoAtual = Number(dados.currentPrice) || precoMedio;
    const valorAtual = quantidade * precoAtual;
    const totalInvestido =
      Number(dados.totalInvested) || quantidade * precoMedio;

    const variacaoPercentual =
      precoMedio > 0 ? ((precoAtual - precoMedio) / precoMedio) * 100 : 0;

    return {
      id,
      tipo: "renda_variavel",
      ticker: dados.ticker,
      quantidade,
      precoMedio,
      precoAtual,
      valor: formatarMoeda(valorAtual),
      valorAtual,
      variacao: variacaoPercentual.toFixed(1).replace(".", ","),
      imagem: dados.logoUrl || "",
      totalInvestido,
    };
  }

  const taxaTexto = dados.category
    ? `${dados.rate} ${dados.category}`
    : `${dados.rate}`;

  return {
    id,
    tipo: "renda_fixa",
    nome: dados.name,
    taxa: taxaTexto,
    vencimento:
      typeof dados.dueDate === "string" ? dataParaBR(dados.dueDate) : "",
    valorInicial: Number(dados.totalInvested) || 0,
    valor: formatarMoeda(dados.totalInvested),
    totalInvestido: Number(dados.totalInvested) || 0,
  };
}

export function resumirCarteira(ativos = []) {
  const variaveis = ativos.filter((ativo) => ativo.tipo === "renda_variavel");
  const fixos = ativos.filter((ativo) => ativo.tipo === "renda_fixa");

  const totalInvestido = ativos.reduce(
    (acumulado, ativo) => acumulado + (Number(ativo.totalInvestido) || 0),
    0,
  );

  const totalAtual = ativos.reduce(
    (acumulado, ativo) =>
      acumulado +
      (ativo.tipo === "renda_variavel"
        ? Number(ativo.valorAtual) || 0
        : Number(ativo.valorInicial) || 0),
    0,
  );

  return { variaveis, fixos, totalInvestido, totalAtual };
}

export function montarDetalhesAtivo(ativo) {
  if (!ativo) return [];

  if (ativo.tipo === "renda_variavel") {
    return [
      { rotulo: "Quantidade", valor: `${ativo.quantidade} un` },
      { rotulo: "Preço médio", valor: formatarMoeda(ativo.precoMedio) },
      {
        rotulo: "Valor investido",
        valor: formatarMoeda(ativo.totalInvestido),
      },
      { rotulo: "Valor atual", valor: ativo.valor },
    ];
  }

  return [
    { rotulo: "Taxa", valor: ativo.taxa },
    { rotulo: "Vencimento", valor: ativo.vencimento },
    { rotulo: "Valor investido", valor: formatarMoeda(ativo.valorInicial) },
  ];
}
