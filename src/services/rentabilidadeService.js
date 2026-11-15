import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { obterUsuarioAtual } from "@/services/authService";

async function buscarCDIBancoCentral() {
  try {
    const url =
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/6?formato=json";
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar CDI do Banco Central:", error);
    return [];
  }
}

async function buscarIbovespaYahoo() {
  try {
    const urlYahoo =
      "https://query1.finance.yahoo.com/v8/finance/chart/^BVSP?interval=1mo&range=7m";

    //evitar erro de requisicao utilizando um servidor intermediario
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlYahoo)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (!result) return [];

    const timestamps = result.timestamp || [];
    const closes = result.indicators.quote[0].close || [];
    const historicoIbov = [];

    for (let i = 1; i < timestamps.length; i++) {
      const precoAnterior = closes[i - 1];
      const precoAtual = closes[i];

      if (precoAnterior && precoAtual) {
        const variacaoPercentual =
          ((precoAtual - precoAnterior) / precoAnterior) * 100;
        const dataObj = new Date(timestamps[i] * 1000);

        historicoIbov.push({
          ano: dataObj.getFullYear(),
          mesIndex: dataObj.getMonth(),
          variacao: Number(variacaoPercentual.toFixed(2)),
          dataOriginal: dataObj,
        });
      }
    }

    return historicoIbov;
  } catch (error) {
    console.warn("Aviso: Não foi possível carregar o Ibovespa da API.", error);
    return [];
  }
}

export async function buscarDadosRentabilidade() {
  const user = obterUsuarioAtual();
  if (!user) {
    throw new Error("Utilizador não autenticado.");
  }

  const assetsRef = collection(db, "users", user.uid, "assets");

  const [snapshotAtivos, dadosCDI, dadosIbov] = await Promise.all([
    getDocs(assetsRef),
    buscarCDIBancoCentral(),
    buscarIbovespaYahoo(),
  ]);

  if (snapshotAtivos.empty) {
    return {
      textoDescritivo: "Sem ativos registados",
      meses: [],
    };
  }

  const ativos = snapshotAtivos.docs.map((doc) => doc.data());

  const mesesAbrev = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const periodoAvaliado = dadosIbov.slice(-6).map((ibovItem) => {
    const nomeMes = mesesAbrev[ibovItem.mesIndex];
    const nomeFormatado = `${nomeMes} ${ibovItem.ano}`;

    const dataFimDoMes = new Date(ibovItem.ano, ibovItem.mesIndex + 1, 0);

    let capitalFixaAteMes = 0;
    let capitalVariavelAteMes = 0;

    ativos.forEach((ativo) => {
      const tipoAtivo = ativo.type || ativo.tipo;
      const isFixed = tipoAtivo === "fixed" || tipoAtivo === "renda_fixa";

      if (ativo.aportes && Array.isArray(ativo.aportes)) {
        ativo.aportes.forEach((aporte) => {
          const dataStr = aporte.purchaseDate || aporte.date;
          if (dataStr) {
            const dataAporte = new Date(dataStr);
            if (!isNaN(dataAporte) && dataAporte <= dataFimDoMes) {
              const valorAporte = Number(
                aporte.invested || aporte.quantity * aporte.unitPrice || 0,
              );
              if (isFixed) {
                capitalFixaAteMes += valorAporte;
              } else {
                capitalVariavelAteMes += valorAporte;
              }
            }
          }
        });
      }
    });

    const patrimonioTotalMes = capitalFixaAteMes + capitalVariavelAteMes;

    if (patrimonioTotalMes === 0) {
      return {
        mes: nomeMes,
        nome: nomeFormatado,
        carteira: 0,
        cdi: 0,
        ibovespa: 0,
      };
    }

    const cdiEncontrado = dadosCDI.find((c) => {
      if (!c.data) return false;
      const partesData = c.data.split("/");
      const mesNum = parseInt(partesData[1], 10) - 1;
      const anoStr = partesData[2];
      return mesNum === ibovItem.mesIndex && anoStr === String(ibovItem.ano);
    });

    const taxaCdiMes = cdiEncontrado ? Number(cdiEncontrado.valor) : 0;
    const taxaIbovMes = ibovItem.variacao;

    const pesoFixa = capitalFixaAteMes / patrimonioTotalMes;
    const pesoVariavel = capitalVariavelAteMes / patrimonioTotalMes;

    const rentabilidadePonderada =
      pesoFixa * taxaCdiMes + pesoVariavel * taxaIbovMes;

    return {
      mes: nomeMes,
      nome: nomeFormatado,
      carteira: Number(rentabilidadePonderada.toFixed(2)),
      cdi: Number(taxaCdiMes.toFixed(1)),
      ibovespa: Number(taxaIbovMes.toFixed(1)),
    };
  });

  const rendimentoAcumulado = periodoAvaliado.reduce(
    (acumulado, m) => acumulado + m.carteira,
    0,
  );
  const totalMeses = periodoAvaliado.length;

  let textoDescritivo = "";
  if (totalMeses === 1) {
    textoDescritivo = `Rendeu ${rendimentoAcumulado.toFixed(2).replace(".", ",")}% no último mês`;
  } else if (totalMeses < 6) {
    textoDescritivo = `Rendeu ${rendimentoAcumulado.toFixed(2).replace(".", ",")}% em ${totalMeses} meses`;
  } else {
    textoDescritivo = `Rendeu ${rendimentoAcumulado.toFixed(2).replace(".", ",")}% no período`;
  }

  return {
    textoDescritivo,
    meses: periodoAvaliado,
  };
}
