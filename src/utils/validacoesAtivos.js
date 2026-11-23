import { textoParaData } from "@/utils/formatadores";

const REGEX_NUMERO_BR = /^-?\d+([.,]\d*)?$/;
const REGEX_DATA_BR = /^(\d{2})\/(\d{2})\/(\d{4})$/;

// Retorna a data atual com horário zerado para comparações apenas por dia
function hojeSemHora() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return hoje;
}

// Valida se a data está no formato dd/mm/aaaa e não é anterior a hoje
export function validarDataNaoPassada(texto, rotulo) {
  const data = textoParaData(texto);
  if (!data) {
    return { valido: false, erro: rotulo + " inválida. Use dd/mm/aaaa" };
  }
  if (data < hojeSemHora()) {
    return { valido: false, erro: rotulo + " não pode estar no passado" };
  }
  return { valido: true, erro: "" };
}

// Valida se a data está no formato dd/mm/aaaa e não é posterior a hoje
export function validarDataNaoFutura(texto, rotulo) {
  const data = textoParaData(texto);
  if (!data) {
    return { valido: false, erro: rotulo + " inválida. Use dd/mm/aaaa" };
  }
  if (data > hojeSemHora()) {
    return { valido: false, erro: rotulo + " não pode ser no futuro" };
  }
  return { valido: true, erro: "" };
}

// Converte texto numérico com vírgula ou ponto decimal em Number (ou NaN)
export function parseNumeroBR(texto = "") {
  const limpo = String(texto ?? "").trim();
  if (!limpo) return NaN;

  const normalizado =
    limpo.includes(",") && limpo.includes(".")
      ? limpo.replace(/\./g, "").replace(",", ".")
      : limpo.replace(",", ".");

  if (!REGEX_NUMERO_BR.test(normalizado)) return NaN;
  return Number(normalizado);
}

// Formata um número para exibir nos inputs com vírgula decimal
export function formatarNumeroInput(numero, casasDecimais = 2) {
  if (typeof numero !== "number" || !Number.isFinite(numero)) return "";
  return numero.toFixed(casasDecimais).replace(".", ",");
}

// Valida se a quantidade informada para venda
// é positiva e não é maior que a quantidade total
export function validarQuantidadeVenda(
  valorTexto = "",
  quantidadeDisponivel = 0,
) {
  const texto = String(valorTexto ?? "").trim();
  if (!texto) {
    return {
      valido: false,
      erro: "Informe a quantidade a vender.",
      valor: NaN,
    };
  }

  const quantidade = parseNumeroBR(texto);
  if (Number.isNaN(quantidade) || quantidade <= 0) {
    return {
      valido: false,
      erro: "A quantidade deve ser maior que zero.",
      valor: quantidade,
    };
  }

  if (quantidade > quantidadeDisponivel) {
    return {
      valido: false,
      erro: `Quantidade máxima disponível: ${quantidadeDisponivel}.`,
      valor: quantidade,
    };
  }

  return { valido: true, erro: "", valor: quantidade };
}

// Valida se o texto representa é um número maior que 0
export function validarValorPositivo(valorTexto = "", rotulo = "valor") {
  const texto = String(valorTexto ?? "").trim();
  if (!texto) {
    return { valido: false, erro: `Informe o ${rotulo}.`, valor: NaN };
  }

  const valor = parseNumeroBR(texto);
  if (Number.isNaN(valor) || valor <= 0) {
    return {
      valido: false,
      erro: `O ${rotulo} deve ser maior que zero.`,
      valor: valor,
    };
  }
  return { valido: true, erro: "", valor };
}

// Verifica se o texto é uma data existente no formato dd/mm/aaaa
export function validarDataBR(dataTexto = "") {
  const texto = String(dataTexto ?? "").trim();
  const match = REGEX_DATA_BR.exec(texto);
  if (!match) {
    return { valido: false, erro: "Use a data no formato dd/mm/aaaa." };
  }

  const dia = Number(match[1]);
  const mes = Number(match[2]);
  const ano = Number(match[3]);
  const data = new Date(ano, mes - 1, dia);

  const dataValida =
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia;

  if (!dataValida) {
    return { valido: false, erro: "Informe uma data válida." };
  }
  return { valido: true, erro: "" };
}

// Calcula o valor total e o lucro ou prejuízo estimado de uma operação de venda
export function calcularResumoVenda({ quantidade, precoVenda, precoMedio }) {
  const qtdValida =
    Number.isFinite(quantidade) && quantidade > 0 ? quantidade : 0;
  const precoValido =
    Number.isFinite(precoVenda) && precoVenda > 0 ? precoVenda : 0;
  const valorVenda = qtdValida * precoValido;
  const lucro =
    qtdValida > 0 && precoValido > 0
      ? qtdValida * (precoValido - precoMedio)
      : 0;

  return { valorVenda, lucro };
}
