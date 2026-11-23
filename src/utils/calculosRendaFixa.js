// Calcula o rendimento composto em reais com base no
// CDI anual e nos dias corridos
export function calcularRendimento(valorInicial, cdiAnual, dias) {
  const valorFinal = valorInicial * Math.pow(1 + cdiAnual / 100, dias / 365);
  return valorFinal - valorInicial;
}

// Retorna a diferença aproximada em dias entre duas datas
export function diasEntre(inicio, fim) {
  const umDia = 24 * 60 * 60 * 1000;
  return Math.round((fim - inicio) / umDia);
}
