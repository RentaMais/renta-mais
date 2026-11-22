import { formatarMoeda } from "@/utils/formatarMoeda";
import { dataParaBR } from "@/utils/formatarData";

export function converterAtivo(id, dados) {
  if (dados.type === "variable") {
    const precoAtual = dados.currentPrice || dados.averagePrice;
    const valorAtual = dados.quantity * precoAtual;
    const variacao =
      ((precoAtual - dados.averagePrice) / dados.averagePrice) * 100;

    return {
      id: id,
      tipo: "renda_variavel",
      ticker: dados.ticker,
      quantidade: dados.quantity,
      precoMedio: dados.averagePrice,
      precoAtual: precoAtual,
      valor: formatarMoeda(valorAtual),
      valorAtual: valorAtual,
      variacao: variacao.toFixed(1).replace(".", ","),
      imagem: dados.logoUrl,
      totalInvestido: dados.totalInvested,
    };
  }
  return {
    id: id,
    tipo: "renda_fixa",
    nome: dados.name,
    taxa: "100% do CDI",
    vencimento: dataParaBR(dados.dueDate),
    dataAplicacao: dados.aportes[0].purchaseDate,
    valorInicial: dados.totalInvested,
    valor: formatarMoeda(dados.totalInvested),
    totalInvestido: dados.totalInvested,
  };
}

export function resumirCarteira(ativos) {
  const variaveis = ativos.filter((ativo) => ativo.tipo === "renda_variavel");
  const fixos = ativos.filter((ativo) => ativo.tipo === "renda_fixa");
  let totalInvestido = 0;
  let totalAtual = 0;

  for (let i = 0; i < ativos.length; i++) {
    const ativo = ativos[i];
    totalInvestido = totalInvestido + ativo.totalInvestido;
    if (ativo.tipo === "renda_variavel") {
      totalAtual = totalAtual + ativo.valorAtual;
    } else {
      totalAtual = totalAtual + ativo.valorInicial;
    }
  }
  return { variaveis, fixos, totalInvestido, totalAtual };
}

export function montarDetalhesAtivo(ativo) {
  if (!ativo) {
    return [];
  }
  if (ativo.tipo === "renda_variavel") {
    return [
      { rotulo: "Quantidade", valor: ativo.quantidade + " un" },
      { rotulo: "Preço médio", valor: formatarMoeda(ativo.precoMedio) },
      { rotulo: "Valor investido", valor: formatarMoeda(ativo.totalInvestido) },
      { rotulo: "Valor atual", valor: ativo.valor },
    ];
  }
  return [
    { rotulo: "Taxa", valor: ativo.taxa },
    { rotulo: "Vencimento", valor: ativo.vencimento },
    { rotulo: "Valor investido", valor: formatarMoeda(ativo.valorInicial) },
  ];
}
