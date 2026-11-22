import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { obterUsuarioAtual } from "@/services/authService";
import { obterComCache, periodoMensal } from "@/services/cacheService";

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Evita deslocamento de 1 dia por UTC ao ler datas "YYYY-MM-DD"
function parseDataLocal(dataStr) {
  const texto = String(dataStr || "").trim();
  const matchISO = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (matchISO) {
    return new Date(
      Number(matchISO[1]),
      Number(matchISO[2]) - 1,
      Number(matchISO[3]),
      12,
      0,
      0,
    );
  }
  return new Date(texto);
}

// Retorna null em caso de falha para que o resultado não seja cacheado
async function buscarCDIBancoCentral() {
  try {
    const url =
      "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados/ultimos/8?formato=json";
    const response = await fetch(url);
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data.map((c) => ({ date: c.data, value: c.valor }));
  } catch (error) {
    console.error("Erro ao buscar CDI do Banco Central:", error);
    return null;
  }
}

// Retorna null em caso de falha para que o resultado não seja cacheado
async function buscarIbovespaYahoo() {
  const urlYahoo =
    "https://query1.finance.yahoo.com/v8/finance/chart/%5EBVSP?interval=1mo&range=8mo";

  const urlsTentativa = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(urlYahoo)}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(urlYahoo)}`,
  ];

  for (let i = 0; i < urlsTentativa.length; i++) {
    try {
      const response = await fetch(urlsTentativa[i]);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const jsonBruto = await response.json();
      const data =
        typeof jsonBruto.contents === "string"
          ? JSON.parse(jsonBruto.contents)
          : jsonBruto;

      const result = data.chart?.result?.[0];
      if (!result) continue;

      const timestamps = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];
      const historicoIbov = [];

      for (let j = 1; j < timestamps.length; j++) {
        const precoAnterior = closes[j - 1];
        const precoAtual = closes[j];

        if (precoAnterior && precoAtual) {
          const variacaoPercentual =
            ((precoAtual - precoAnterior) / precoAnterior) * 100;
          const dataObj = new Date(timestamps[j] * 1000);

          historicoIbov.push({
            year: dataObj.getFullYear(),
            monthIndex: dataObj.getMonth(),
            change: Number(variacaoPercentual.toFixed(2)),
          });
        }
      }

      const mapaPorMes = new Map();
      historicoIbov.forEach((item) => {
        const chaveMes = `${item.year}-${item.monthIndex}`;
        mapaPorMes.set(chaveMes, item);
      });

      const historicoUnicoPorMes = Array.from(mapaPorMes.values());

      if (historicoUnicoPorMes.length > 0) {
        return historicoUnicoPorMes;
      }
    } catch (error) {
      if (i < urlsTentativa.length - 1) {
        await esperar(500);
      } else {
        console.warn(
          "Aviso: Não foi possível carregar o Ibovespa da API.",
          error,
        );
      }
    }
  }

  return null;
}

async function obterCDI() {
  const dados = await obterComCache(
    "cdi",
    periodoMensal(),
    buscarCDIBancoCentral,
  );
  return (dados ?? []).map((c) => ({ data: c.date, valor: c.value }));
}

async function obterIbovespa() {
  const dados = await obterComCache(
    "ibovespa",
    periodoMensal(),
    buscarIbovespaYahoo,
  );
  return (dados ?? []).map((i) => ({
    ano: i.year,
    mesIndex: i.monthIndex,
    variacao: i.change,
  }));
}

export async function buscarDadosRentabilidade() {
  const user = obterUsuarioAtual();
  if (!user) {
    throw new Error("Utilizador não autenticado.");
  }

  const assetsRef = collection(db, "users", user.uid, "assets");

  const [snapshotAtivos, dadosCDI, dadosIbov] = await Promise.all([
    getDocs(assetsRef),
    obterCDI(),
    obterIbovespa(),
  ]);

  if (snapshotAtivos.empty) {
    return {
      textoDescritivo: "Sem ativos registados",
      meses: [],
    };
  }

  const ativos = snapshotAtivos.docs.map((doc) => doc.data());

  // Encontra a data mais antiga
  let primeiraDataAporte = null;

  ativos.forEach((ativo) => {
    if (Array.isArray(ativo.aportes)) {
      ativo.aportes.forEach((aporte) => {
        const dataStr = aporte.purchaseDate || aporte.date;
        if (dataStr) {
          const dataAporte = parseDataLocal(dataStr);
          if (!Number.isNaN(dataAporte.getTime())) {
            if (!primeiraDataAporte || dataAporte < primeiraDataAporte) {
              primeiraDataAporte = dataAporte;
            }
          }
        }
      });
    }
  });

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

  const agora = new Date();
  const anoAtual = agora.getFullYear();
  const mesAtual = agora.getMonth();

  // Remove o mês atual
  const ibovMesesFechados = dadosIbov.filter(
    (item) => !(item.ano === anoAtual && item.mesIndex === mesAtual),
  );

  // Mantém apenas meses fechados a partir do mês do primeiro aporte
  const mesesAposPrimeiroAporte = primeiraDataAporte
    ? ibovMesesFechados.filter((item) => {
        const dataFimDoMes = new Date(
          item.ano,
          item.mesIndex + 1,
          0,
          23,
          59,
          59,
        );
        const inicioMesPrimeiroAporte = new Date(
          primeiraDataAporte.getFullYear(),
          primeiraDataAporte.getMonth(),
          1,
          0,
          0,
          0,
        );
        return dataFimDoMes >= inicioMesPrimeiroAporte;
      })
    : ibovMesesFechados;

  const periodoAvaliado = mesesAposPrimeiroAporte.slice(-6).map((ibovItem) => {
    const nomeMes = mesesAbrev[ibovItem.mesIndex];
    const nomeFormatado = `${nomeMes} ${ibovItem.ano}`;

    const dataFimDoMes = new Date(
      ibovItem.ano,
      ibovItem.mesIndex + 1,
      0,
      23,
      59,
      59,
    );

    let capitalFixaAteMes = 0;
    let capitalVariavelAteMes = 0;

    ativos.forEach((ativo) => {
      const tipoAtivo = ativo.type || ativo.tipo;
      const isFixed = tipoAtivo === "fixed" || tipoAtivo === "renda_fixa";

      if (ativo.aportes && Array.isArray(ativo.aportes)) {
        ativo.aportes.forEach((aporte) => {
          const dataStr = aporte.purchaseDate || aporte.date;
          if (dataStr) {
            const dataAporte = parseDataLocal(dataStr);
            if (
              !Number.isNaN(dataAporte.getTime()) &&
              dataAporte <= dataFimDoMes
            ) {
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
        comPosicao: false,
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

    // Rentabilidade percentual ponderada pelo capital alocado até o mês
    const rentabilidadeCarteira =
      (capitalFixaAteMes * taxaCdiMes + capitalVariavelAteMes * taxaIbovMes) /
      patrimonioTotalMes;

    return {
      mes: nomeMes,
      nome: nomeFormatado,
      carteira: Number(rentabilidadeCarteira.toFixed(2)),
      cdi: Number(taxaCdiMes.toFixed(1)),
      ibovespa: Number(taxaIbovMes.toFixed(1)),
      comPosicao: true,
    };
  });

  // Composição mensal acumulada no período
  const fatorAcumulado = periodoAvaliado.reduce(
    (fator, m) => fator * (1 + m.carteira / 100),
    1,
  );
  const rendimentoAcumulado = (fatorAcumulado - 1) * 100;
  const mesesComPosicao = periodoAvaliado.filter((m) => m.comPosicao).length;

  let textoDescritivo = "";
  if (mesesComPosicao === 0 || mesesComPosicao === periodoAvaliado.length) {
    textoDescritivo = `Rendeu ${rendimentoAcumulado.toFixed(2).replace(".", ",")}% no período`;
  } else if (mesesComPosicao === 1) {
    textoDescritivo = `Rendeu ${rendimentoAcumulado.toFixed(2).replace(".", ",")}% em 1 mês`;
  } else {
    textoDescritivo = `Rendeu ${rendimentoAcumulado.toFixed(2).replace(".", ",")}% em ${mesesComPosicao} meses`;
  }

  return {
    textoDescritivo,
    meses: periodoAvaliado,
  };
}
