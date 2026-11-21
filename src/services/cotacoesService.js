const TOKEN = process.env.EXPO_PUBLIC_BRAPI_TOKEN;
const BASE_URL = "https://brapi.dev/api/quote";

export async function buscarCotacoesAtuais(tickers = []) {
  const limpos = [
    ...new Set(tickers.filter(Boolean).map((t) => t.trim().toUpperCase())),
  ];

  if (limpos.length === 0) {
    return {};
  }

  const queryTickers = limpos.join(",");
  const url = TOKEN
    ? `${BASE_URL}/${encodeURIComponent(queryTickers)}?token=${encodeURIComponent(TOKEN)}`
    : `${BASE_URL}/${encodeURIComponent(queryTickers)}`;

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Falha na brapi.dev (HTTP ${resposta.status})`);
  }

  const dados = await resposta.json();
  const resultados = Array.isArray(dados?.results) ? dados.results : [];

  const mapaCotacoes = {};
  for (const item of resultados) {
    if (item?.symbol && typeof item?.regularMarketPrice === "number") {
      mapaCotacoes[item.symbol.toUpperCase()] = item.regularMarketPrice;
    }
  }
  return mapaCotacoes;
}
