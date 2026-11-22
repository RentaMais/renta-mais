import {
  lerCache,
  obterComCache,
  periodoDiario,
} from "@/services/cacheService";

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

  const info = await obterComCache(
    `quote_${tickerLimpo}`,
    periodoDiario(),
    async () => {
      const resposta = await fetch(montarUrlQuote(tickerLimpo));
      if (!resposta.ok) {
        return null;
      }

      const dados = await resposta.json();
      const item = dados?.results?.[0];
      if (!item) return null;

      return {
        price: item.regularMarketPrice ?? null,
        logoUrl: item.logourl || "",
        name: item.shortName || tickerLimpo,
      };
    },
  );

  if (!info) return null;
  return { preco: info.price, logo: info.logoUrl, nome: info.name };
}

export async function buscarCotacoesAtuais(tickers = []) {
  const limpos = [
    ...new Set(tickers.filter(Boolean).map((t) => t.trim().toUpperCase())),
  ];

  if (limpos.length === 0) {
    return {};
  }

  const periodo = periodoDiario();
  const mapaCotacoes = {};
  const faltando = [];

  await Promise.all(
    limpos.map(async (t) => {
      const info = await lerCache(`quote_${t}`, periodo);
      if (info && typeof info.price === "number") {
        mapaCotacoes[t] = info.price;
      } else {
        faltando.push(t);
      }
    }),
  );

  for (const t of faltando) {
    try {
      const info = await buscarInfoTicker(t);
      if (typeof info?.preco === "number") {
        mapaCotacoes[t] = info.preco;
      }
    } catch (_e) {
      // Ticker com falha mantém o último preço salvo no ativo
    }
  }
  return mapaCotacoes;
}
