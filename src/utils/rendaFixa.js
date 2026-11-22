export function calcularRendimento(valorInicial, cdiAnual, dias) {
    const valorFinal = valorInicial * Math.pow(1 + cdiAnual / 100, dias / 365);
    return valorFinal - valorInicial;
}

export function diasEntre(inicio, fim) {
    const umDia = 24 * 60 * 60 * 1000;
    return Math.round((fim - inicio) / umDia);
}