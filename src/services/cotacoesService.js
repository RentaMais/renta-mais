import {
  lerCache,
  obterComCache,
  periodoDiario,
  salvarCache,
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

  if (faltando.length > 0) {
    try {
      const resposta = await fetch(montarUrlQuote(faltando.join(",")));
      if (resposta.ok) {
        const dados = await resposta.json();
        for (const item of dados?.results ?? []) {
          const symbol = String(item?.symbol ?? "")
            .trim()
            .toUpperCase();
          if (symbol && typeof item.regularMarketPrice === "number") {
            mapaCotacoes[symbol] = item.regularMarketPrice;
            await salvarCache(`quote_${symbol}`, periodo, {
              price: item.regularMarketPrice,
              logoUrl: item.logourl || "",
              name: item.shortName || symbol,
            });
          }
        }
      }
    } catch (_e) {}
  }
  return mapaCotacoes;
}

export async function buscarCdiAnual() {
  const valor = await obterComCache("cdi_anual", periodoDiario(), async () => {
    const url =
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4389/dados/ultimos/1?formato=json";
    const resposta = await fetch(url);
    if (!resposta.ok) return null;
    const dados = await resposta.json();
    const numero = Number(dados?.[0]?.valor);
    return Number.isFinite(numero) ? numero : null;
  });
  return valor ?? 0;
}
