export function formatarPercentual(valor) {
    const numero = Number(valor) || 0;
    const texto = numero.toLocaleString("pt-BR",{
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });
    return (numero> 0 ? "+":"") + texto + "%";
}