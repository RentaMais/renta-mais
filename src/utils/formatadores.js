// Formata um número como moeda brasileira (ex: R$ 1.250,00)
export function formatarMoeda(valor) {
  const numero = Number(valor) || 0;

  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numero);
}

// Abrevia valores a partir de mil usando o sufixo "K" (ex: 1,5K)
export function formatarMil(valor) {
  const numero = Number(valor) || 0;
  if (Math.abs(numero) >= 1000) {
    const emMilhares = (numero / 1000).toFixed(1).replace(/\.0$/, "");
    return `${emMilhares.replace(".", ",")}K`;
  }
  return String(Math.round(numero));
}

const ESCALAS_ABREVIACAO = [
  { limite: 1e12, sufixo: "tri" },
  { limite: 1e9, sufixo: "bi" },
  { limite: 1e6, sufixo: "mi" },
  { limite: 1e3, sufixo: "mil" },
];

// Abrevia valores grandes em mil, mi, bi e tri, com prefixo "R$ " opcional
export function formatarValorAbreviado(valor, comPrefixo = false) {
  const numero = Number(valor) || 0;
  const prefixo = comPrefixo ? "R$ " : "";

  for (const escala of ESCALAS_ABREVIACAO) {
    if (Math.abs(numero) >= escala.limite) {
      const abreviado = (numero / escala.limite)
        .toFixed(1)
        .replace(".", ",")
        .replace(/,0$/, "");
      return `${prefixo}${abreviado} ${escala.sufixo}`;
    }
  }

  return `${prefixo}${Math.round(numero)}`;
}

// Formata um número como percentual em pt-BR
export function formatarPercentual(valor, casas = 1) {
  const numero = Number(valor) || 0;
  return `${numero.toFixed(casas).replace(".", ",")}%`;
}

// Recebe data no formato brasileiro (DD/MM/YYYY)
// e reotrna no formato YYYY-MM-DD para o Firebase
export function dataParaBanco(texto) {
  const partes = texto.split("/");
  return partes[2] + "-" + partes[1] + "-" + partes[0];
}

// Recebe o campo data do Firebase (YYYY-MM-DD)
// e retorna no formato DD/MM/YYYY
export function dataParaBR(dataBanco) {
  const partes = dataBanco.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// Converte uma string "dd/mm/aaaa"
// em objeto Date ou retorna null se inválida
export function textoParaData(texto) {
  if (typeof texto !== "string" || texto.length !== 10) {
    return null;
  }
  const partes = texto.split("/");
  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);

  const data = new Date(ano, mes - 1, dia);
  if (
    data.getDate() !== dia ||
    data.getMonth() !== mes - 1 ||
    data.getFullYear() !== ano
  ) {
    return null;
  }
  return data;
}

// Evita deslocamento de 1 dia por UTC ao ler
// datas "YYYY-MM-DD" (tratar valores da API)
export function parseDataLocal(dataStr) {
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

// Busca formatacao em YYYY-MM-DD
export function extrairDataYYYYMMDD(valor) {
  if (!valor) return null;

  // Retorna formato funcao do banco timestamp do firestore
  if (typeof valor?.toDate === "function") {
    return valor.toDate().toISOString().split("T")[0];
  }
  // Valor do tipo Date
  if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
    return valor.toISOString().split("T")[0];
  }

  const texto = String(valor).trim();
  const matchISO = texto.match(/^(\d{4}-\d{2}-\d{2})/);
  if (matchISO) {
    return matchISO[1];
  }

  return null;
}
