const TOKEN = process.env.EXPO_PUBLIC_BRAPI_TOKEN;
const BASE_URL = "https://brapi.dev/api/quote";

function montarUrlQuote(tickersParam) {
  const base = `${BASE_URL}/${encodeURIComponent(tickersParam)}`;
  return TOKEN ? `${base}?token=${encodeURIComponent(TOKEN)}` : base;
}

export async function buscarInfoTicker(ticker) {
  const tickerLimpo = String(ticker ?? "")
    .trim()
    .toUpperCase();
  if (!tickerLimpo) return null;

  const resposta = await fetch(montarUrlQuote(tickerLimpo));
  if (!resposta.ok) {
    return null;
  }

  const dados = await resposta.json();
  const item = dados?.results?.[0];
  if (!item) return null;

  return {
    preco: item.regularMarketPrice,
    logo: item.logourl || "",
    nome: item.shortName || tickerLimpo,
  };
}

export async function buscarCotacoesAtuais(tickers = []) {
  const limpos = [
    ...new Set(tickers.filter(Boolean).map((t) => t.trim().toUpperCase())),
  ];

  if (limpos.length === 0) {
    return {};
  }

  const resposta = await fetch(montarUrlQuote(limpos.join(",")));
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
