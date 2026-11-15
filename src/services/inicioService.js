import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { obterUsuarioAtual } from "@/services/authService";
import { buscarDadosRentabilidade } from "@/services/rentabilidadeService"; 

export async function buscarDadosInicio() {
  const user = obterUsuarioAtual();
  
  if (!user) {
    throw new Error("Utilizador não autenticado.");
  }

  const [assetsSnapshot, dadosRentabilidade] = await Promise.all([
    getDocs(collection(db, "users", user.uid, "assets")),
    buscarDadosRentabilidade().catch(() => ({ meses: [] }))
  ]);

  const ativos = assetsSnapshot.docs.map(doc => doc.data());

  let patrimonioTotal = 0;
  let totalRendaFixa = 0;
  let totalRendaVariavel = 0;

  ativos.forEach(ativo => {
    let valorAtivo = Number(ativo.totalInvested || 0);
    
    if (valorAtivo === 0 && ativo.aportes && Array.isArray(ativo.aportes)) {
      valorAtivo = ativo.aportes.reduce((acc, ap) => acc + Number(ap.invested || (ap.quantity * ap.unitPrice) || 0), 0);
    }

    patrimonioTotal += valorAtivo;

    const tipoAtivo = ativo.type || ativo.tipo;
    if (tipoAtivo === "fixed" || tipoAtivo === "renda_fixa") {
      totalRendaFixa += valorAtivo;
    } else {
      totalRendaVariavel += valorAtivo;
    }
  });

  let percentualFixa = 0;
  let percentualVariavel = 0;

  if (patrimonioTotal > 0) {
    percentualFixa = Math.round((totalRendaFixa / patrimonioTotal) * 100);
    percentualVariavel = 100 - percentualFixa; 
  }

  let labelsGrafico = [];
  let dataGrafico = [];
  let variacaoDinamica = 0;

  const meses = dadosRentabilidade.meses || [];

  if (meses.length > 0) {
    const ultimoMes = meses[meses.length - 1];
    variacaoDinamica = ultimoMes ? ultimoMes.carteira : 0;

    labelsGrafico = meses.map(m => m.mes);

    let valoresReconstruidos = [];
    let valorCorrente = patrimonioTotal;

    for (let i = meses.length - 1; i >= 0; i--) {
      valoresReconstruidos.unshift(Number(valorCorrente.toFixed(2)));
      const taxaMes = meses[i].carteira / 100;
      valorCorrente = valorCorrente / (1 + taxaMes);
    }
    dataGrafico = valoresReconstruidos;
  } else {
    labelsGrafico = ["Atual"];
    dataGrafico = [patrimonioTotal];
    variacaoDinamica = 0;
  }

  return {
    patrimonioTotal,
    variacao: variacaoDinamica,
    divisao: [
      { name: "Renda variável", valor: percentualVariavel },
      { name: "Renda fixa", valor: percentualFixa }
    ],
    evolucao: {
      labels: labelsGrafico,
      datasets: [{ data: dataGrafico }]
    }
  };
}