export function formatarReais(valor) {
  if (valor === undefined || valor === null || valor === "") return "R$ 0,00";

  if (typeof valor === "number") {
    return `R$ ${valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  let textoLimpo = String(valor)
    .trim()
    .replace(/[^0-9,-]/g, "");

  textoLimpo = textoLimpo.replace(".", ",");

  return `R$ ${textoLimpo}`;
}
