import { obterComCache, periodoDiario } from "@/services/cacheService";
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { obterUsuarioAtual } from "@/services/authService";
import { formatarMoeda, extrairDataYYYYMMDD } from "@/utils/formatadores";

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


function obterDataCompraMaisAntiga(dataAsset) {
  if (!dataAsset) return null;

  const datas = [];

  if (Array.isArray(dataAsset.aportes)) {
    dataAsset.aportes.forEach((ap) => {
      const dataAp = extrairDataYYYYMMDD(ap?.purchaseDate);
      if (dataAp) {
        datas.push(dataAp);
      }
    });
  }

  const dataDoc = extrairDataYYYYMMDD(dataAsset.purchaseDate);
  if (dataDoc) {
    datas.push(dataDoc);
  }

  if (datas.length === 0) return null;

  datas.sort();
  return datas[0]; // Data mais antiga
}

function obterQuantidadeAtivo(assetDoc) {
  if (!assetDoc) return 1;
  const dataAsset = assetDoc.data();
  let qtd = Number(dataAsset.quantity || 0);

  if (qtd === 0 && Array.isArray(dataAsset.aportes)) {
    qtd = dataAsset.aportes.reduce(
      (acc, ap) => acc + Number(ap.quantity || 0),
      0,
    );
  }

  return qtd > 0 ? qtd : 1;
}

async function baixarProventosYahoo(tickerSemSa) {
  const urlYahoo = `https://query1.finance.yahoo.com/v8/finance/chart/${tickerSemSa}.SA?interval=1mo&range=2y&events=div`;
  const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlYahoo)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  const data = await response.json();
  const dividendsObj = data.chart?.result?.[0]?.events?.dividends;
  if (!dividendsObj) return [];

  const agora = Date.now();
  return Object.values(dividendsObj)
    .filter((div) => Number(div.date) * 1000 <= agora)
    .map((div) => ({
      ticker: tickerSemSa,
      date: new Date(Number(div.date) * 1000).toISOString().split("T")[0],
      amount: Number(div.amount || 0),
    }));
}

async function buscarProventosYahoo(ticker, tentativa = 1) {
  const tickerSemSa = String(ticker || "")
    .trim()
    .toUpperCase()
    .replace(/\.SA$/i, "");
  if (!tickerSemSa) return [];

  try {
    const dividendos = await obterComCache(
      `dividends_${tickerSemSa}`,
      periodoDiario(),
      () => baixarProventosYahoo(tickerSemSa),
    );
    return dividendos.map((d) => ({
      ticker: d.ticker,
      data: d.date,
      dividendo: d.amount,
      status: "Pago",
    }));
  } catch (error) {
    if (tentativa < 2) {
      await esperar(600);
      return buscarProventosYahoo(tickerSemSa, tentativa + 1);
    }

    console.warn(`Erro ao buscar proventos para ${tickerSemSa}:`, error);
    return [];
  }
}

export async function buscarDadosProventos() {
  const user = obterUsuarioAtual();
  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const assetsRef = collection(db, "users", user.uid, "assets");
  const assetsSnapshot = await getDocs(assetsRef);

  if (assetsSnapshot.empty) {
    return {
      totalRecebido: 0,
      dyMedio: 0,
      valoresMensais: Array(12).fill(0),
      listaProventos: [],
    };
  }

  let patrimonioVariavel = 0;
  const tickersVariaveis = [];

  assetsSnapshot.docs.forEach((doc) => {
    const asset = doc.data();
    const tipoAtivo = asset.type || asset.tipo;

    if (
      (tipoAtivo === "variable" || tipoAtivo === "renda_variavel") &&
      asset.ticker
    ) {
      const tickerNormalizado = String(asset.ticker)
        .trim()
        .toUpperCase()
        .replace(/\.SA$/i, "");

      if (!tickersVariaveis.includes(tickerNormalizado)) {
        tickersVariaveis.push(tickerNormalizado);
      }

      const qtdAtual = obterQuantidadeAtivo(doc);
      const precoMedio = Number(asset.averagePrice || 0);

      const valorAtivo = Number(
        (qtdAtual > 0 && precoMedio > 0 ? qtdAtual * precoMedio : null) ||
          asset.totalInvested ||
          0,
      );

      patrimonioVariavel += valorAtivo;
    }
  });

  const resultadosPorAtivo = [];
  for (let i = 0; i < tickersVariaveis.length; i++) {
    const dadosAtivo = await buscarProventosYahoo(tickersVariaveis[i]);
    resultadosPorAtivo.push(dadosAtivo);

    if (i < tickersVariaveis.length - 1) {
      await esperar(350);
    }
  }

  const encontrarAssetDoc = (tickerAlvo) =>
    assetsSnapshot.docs.find(
      (doc) =>
        String(doc.data().ticker || "")
          .trim()
          .toUpperCase()
          .replace(/\.SA$/i, "") === tickerAlvo,
    );

  const hoje = new Date();
  const doisAnosAtras = new Date(
    hoje.getFullYear() - 2,
    hoje.getMonth(),
    hoje.getDate(),
  );
  const dataLimite2Anos = doisAnosAtras.toISOString().split("T")[0];

  const proventosDocs = resultadosPorAtivo.flat().filter((item) => {
    if (!item.data) return false;

    const assetDoc = encontrarAssetDoc(item.ticker);
    const dataMaisAntiga = obterDataCompraMaisAntiga(assetDoc?.data());

    const dataMinima =
      dataMaisAntiga && dataMaisAntiga > dataLimite2Anos
        ? dataMaisAntiga
        : dataLimite2Anos;

    return item.data >= dataMinima;
  });

  let totalRecebido = 0;
  const listaProventosFormatada = proventosDocs
    .map((item) => {
      const assetDoc = encontrarAssetDoc(item.ticker);
      const quantidade = obterQuantidadeAtivo(assetDoc);
      const valorTotalProvento = item.dividendo * quantidade;

      totalRecebido += valorTotalProvento;

      return {
        id: `${item.ticker}-${item.data}`,
        ticker: item.ticker,
        data: item.data,
        dividendo: formatarMoeda(valorTotalProvento),
        status: "Pago",
        rawValor: valorTotalProvento,
      };
    })
    .sort((a, b) => b.data.localeCompare(a.data));

  let dyMedio = 0;
  if (patrimonioVariavel > 0) {
    dyMedio = (totalRecebido / patrimonioVariavel) * 100;
  }

  const ultimos12MesesChaves = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    ultimos12MesesChaves.push(`${ano}-${mes}`);
  }

  const valoresMensais = ultimos12MesesChaves.map((mesChave) => {
    return proventosDocs
      .filter((item) => item.data && item.data.substring(0, 7) === mesChave)
      .reduce((soma, item) => {
        const assetDoc = encontrarAssetDoc(item.ticker);
        const qtd = obterQuantidadeAtivo(assetDoc);
        return soma + item.dividendo * qtd;
      }, 0);
  });

  return {
    totalRecebido,
    dyMedio,
    valoresMensais,
    listaProventos: listaProventosFormatada,
  };
}
