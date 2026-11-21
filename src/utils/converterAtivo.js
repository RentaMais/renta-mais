import { formatarMoeda } from "@/utils/formatarMoeda";
import { dataParaBR } from "@/utils/formatarData";

export function converterAtivo(id, dados) {
  if (dados.type === "variable") {
    const quantidade = Number(dados.quantity);
    const precoMedio = Number(dados.averagePrice);
    const precoAtual = Number(dados.currentPrice) || precoMedio;
    const valorAtual = quantidade * precoAtual;

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
      totalInvestido: Number(dados.totalInvested) || 0,
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
    valorInicial: Number(dados.totalInvested),
    valor: formatarMoeda(dados.totalInvested),
    totalInvestido: Number(dados.totalInvested) || 0,
  };
}
