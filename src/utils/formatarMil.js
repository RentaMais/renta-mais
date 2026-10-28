export function formatarMil(valor) {
  const numero = Number(valor) || 0;
  if (Math.abs(numero) < 1000) {
    return numero.toString().replace(".", ",");
  }

  const emMilhares = numero / 1000;
  // Formata com no máximo 1 casa decimal e usa a vírgula do pt-BR
  const formatado = emMilhares.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return `${formatado}K`;
}
