const FORMATADOR_MOEDA = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarMoeda(valor) {
  const numero = Number(valor) || 0;
  return FORMATADOR_MOEDA.format(numero);
}

export function formatarMil(valor) {
  const numero = Number(valor) || 0;
  if (Math.abs(numero) >= 1000) {
    const emMilhares = (numero / 1000).toFixed(1).replace(/\.0$/, "");
    return `${emMilhares.replace(".", ",")}K`;
  }
  return String(Math.round(numero));
}

export function formatarPercentual(
  valor,
  casas = 1,
  { comSinal = false } = {},
) {
  const numero = Number(valor) || 0;
  const prefixo = comSinal && numero > 0 ? "+" : "";
  return `${prefixo}${numero.toFixed(casas).replace(".", ",")}%`;
}

export function textoParaData(texto) {
  if (typeof texto !== "string" || texto.length !== 10) {
    return null;
  }
  const [dia, mes, ano] = texto.split("/").map(Number);
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

export function dataParaBanco(dataBR) {
  const partes = String(dataBR || "")
    .trim()
    .split("/");
  if (partes.length !== 3) return dataBR;
  const [dia, mes, ano] = partes;
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

export function dataParaBR(dataISO) {
  const texto = String(dataISO || "")
    .trim()
    .split("T")[0];
  const partes = texto.split("-");
  if (partes.length !== 3) return dataISO;
  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
}
