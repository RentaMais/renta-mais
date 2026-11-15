import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { obterUsuarioAtual } from "@/services/authService";

async function buscarProventosYahoo(ticker) {
  try {
    const tickerFormatado = ticker.endsWith(".SA") ? ticker : `${ticker}.SA`;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${tickerFormatado}?interval=1mo&range=1y&events=div`;

    const response = await fetch(url);
    const data = await response.json();

    const result = data.chart?.result?.[0];
    if (!result || !result.events || !result.events.dividends) {
      return [];
    }

    const dividendsObj = result.events.dividends;

    return Object.values(dividendsObj).map((div) => {
      const dataDividendo = new Date(div.date * 1000);
      const hoje = new Date();

      const statusAtual = dataDividendo > hoje ? "Provisionado" : "Pago";

      return {
        ticker: ticker.toUpperCase(),
        data: dataDividendo.toISOString().split("T")[0],
        dividendo: div.amount,
        status: statusAtual,
      };
    });
  } catch (error) {
    console.error(`Erro ao buscar proventos para ${ticker}:`, error);
    return [];
  }
}

export async function buscarDadosProventos() {
  const user = obterUsuarioAtual();
  if (!user) {
    throw new Error("Utilizador não autenticado.");
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
      tickersVariaveis.push(asset.ticker);

      let qtdAtual = Number(asset.quantity || 0);
      if (qtdAtual === 0 && asset.aportes && Array.isArray(asset.aportes)) {
        qtdAtual = asset.aportes.reduce(
          (acc, ap) => acc + Number(ap.quantity || 0),
          0,
        );
      }

      const precoMedio = Number(asset.averagePrice || 0);

      const valorAtivo = Number(
        (qtdAtual > 0 && precoMedio > 0 ? qtdAtual * precoMedio : null) ||
          asset.totalInvested ||
          0,
      );

      patrimonioVariavel += valorAtivo;
    }
  });

  const promessasProventos = tickersVariaveis.map((ticker) =>
    buscarProventosYahoo(ticker),
  );
  const resultadosPorAtivo = await Promise.all(promessasProventos);

  const proventosDocs = resultadosPorAtivo.flat();

  let totalRecebido = 0;
  const listaProventosFormatada = proventosDocs.map((item) => {
    const assetDoc = assetsSnapshot.docs.find(
      (doc) => doc.data().ticker?.toUpperCase() === item.ticker,
    );

    let quantidade = 1;
    if (assetDoc) {
      const dataAsset = assetDoc.data();
      quantidade = Number(dataAsset.quantity || 0);
      if (
        quantidade === 0 &&
        dataAsset.aportes &&
        Array.isArray(dataAsset.aportes)
      ) {
        quantidade = dataAsset.aportes.reduce(
          (acc, ap) => acc + Number(ap.quantity || 0),
          0,
        );
      }
      if (quantidade <= 0) quantidade = 1;
    }

    const valorTotalProvento = item.dividendo * quantidade;
    totalRecebido += valorTotalProvento;

    return {
      id: `${item.ticker}-${item.data}`,
      ticker: item.ticker,
      data: item.data,
      dividendo: `R$ ${valorTotalProvento.toFixed(2).replace(".", ",")}`,
      status: item.status,
      rawValor: valorTotalProvento,
    };
  });

  let dyMedio = 0;
  if (patrimonioVariavel > 0) {
    dyMedio = (totalRecebido / patrimonioVariavel) * 100;
  }

  const ultimos12MesesChaves = [];
  const hoje = new Date();

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
        const assetDoc = assetsSnapshot.docs.find(
          (doc) => doc.data().ticker?.toUpperCase() === item.ticker,
        );

        let qtd = 1;
        if (assetDoc) {
          const dataAsset = assetDoc.data();
          qtd = Number(dataAsset.quantity || 0);
          if (
            qtd === 0 &&
            dataAsset.aportes &&
            Array.isArray(dataAsset.aportes)
          ) {
            qtd = dataAsset.aportes.reduce(
              (acc, ap) => acc + Number(ap.quantity || 0),
              0,
            );
          }
          if (qtd <= 0) qtd = 1;
        }

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
