import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { obterUsuarioAtual } from "@/services/authService";
import {
  buscarCotacoesAtuais,
  buscarInfoTicker,
} from "@/services/cotacoesService";
import { dataParaBanco } from "@/utils/formatarData";
import { converterAtivo } from "@/utils/converterAtivo";

function colecaoAtivos() {
  const user = obterUsuarioAtual();
  if (!user) {
    throw new Error("Usuário não autenticado.");
  }
  return collection(db, "users", user.uid, "assets");
}

export async function listarAtivos() {
  const snapshot = await getDocs(colecaoAtivos());
  const lista = snapshot.docs.map((item) =>
    converterAtivo(item.id, item.data()),
  );
  return lista.filter((ativo) =>
    ativo.tipo === "renda_variavel"
      ? ativo.quantidade > 0
      : ativo.valorInicial > 0,
  );
}

export async function buscarAtivo(id) {
  const documento = await getDoc(doc(colecaoAtivos(), id));
  if (!documento.exists()) {
    return null;
  }
  return converterAtivo(documento.id, documento.data());
}

export async function criarRendaFixa(dados) {
  const hoje = dataParaBanco(new Date().toLocaleDateString("pt-BR"));
  const valor = Number(dados.valor);

  if (!Number.isFinite(valor) || valor <= 0) {
    throw new Error("O valor investido deve ser maior que zero.");
  }

  await addDoc(colecaoAtivos(), {
    type: "fixed",
    name: dados.nome.trim(),
    category: dados.indexador,
    rate: dados.taxa.trim(),
    dueDate: dataParaBanco(dados.vencimento),
    estimatedYield: dados.rendimentoEstimado || 0,
    totalInvested: valor,
    aportes: [{ purchaseDate: hoje, invested: valor }],
  });
}

export async function criarRendaVariavel(dados) {
  const ticker = dados.ticker.trim().toUpperCase();
  const quantidadeNova = Number(dados.quantidade);
  const precoNovo = Number(dados.precoMedio);

  if (quantidadeNova <= 0 || precoNovo <= 0) {
    throw new Error("Quantidade e preço médio devem ser maiores que zero.");
  }

  const valorCompra = quantidadeNova * precoNovo;
  let precoAtual = Number(dados.precoAtual) || precoNovo;
  let logoUrl = dados.logoUrl ?? "";

  if (dados.precoAtual === undefined || dados.logoUrl === undefined) {
    try {
      const info = await buscarInfoTicker(ticker);
      if (info) {
        precoAtual = Number(info.preco) || precoNovo;
        logoUrl = info.logo;
      }
    } catch (_e) {
      // Mantém preço de compra e logo vazia caso a consulta externa falhe
    }
  }

  const aporte = {
    purchaseDate: dataParaBanco(dados.dataCompra),
    invested: valorCompra,
    quantity: quantidadeNova,
    unitPrice: precoNovo,
  };

  const snapshot = await getDocs(colecaoAtivos());
  const existente = snapshot.docs.find((item) => item.data().ticker === ticker);

  if (existente) {
    const atual = existente.data();
    const aportesAntigos = Array.isArray(atual.aportes) ? atual.aportes : [];
    const novaQuantidade = Number(atual.quantity) + quantidadeNova;
    const novoTotal = Number(atual.totalInvested) + valorCompra;

    await updateDoc(existente.ref, {
      quantity: novaQuantidade,
      totalInvested: novoTotal,
      averagePrice: novoTotal / novaQuantidade,
      currentPrice: precoAtual,
      logoUrl: logoUrl || atual.logoUrl || "",
      aportes: [...aportesAntigos, aporte],
    });
  } else {
    await addDoc(colecaoAtivos(), {
      type: "variable",
      name: ticker,
      ticker,
      quantity: quantidadeNova,
      averagePrice: precoNovo,
      currentPrice: precoAtual,
      totalInvested: valorCompra,
      logoUrl,
      aportes: [aporte],
    });
  }
}

export async function cadastrarRendaVariavel(dados) {
  const ticker = dados.ticker.trim().toUpperCase();
  const info = await buscarInfoTicker(ticker);
  if (!info) {
    throw new Error("Ticker não encontrado.");
  }

  await criarRendaVariavel({
    ...dados,
    ticker,
    precoAtual: info.preco,
    logoUrl: info.logo,
  });
}

export async function atualizarCotacoesCarteira(listaAtivos) {
  const variaveis = listaAtivos.filter(
    (ativo) => ativo.tipo === "renda_variavel" && ativo.ticker,
  );
  if (variaveis.length === 0) return;

  const cotacoes = await buscarCotacoesAtuais(
    variaveis.map((ativo) => ativo.ticker),
  );

  await Promise.all(
    variaveis.map(async (ativo) => {
      const preco = cotacoes[ativo.ticker.toUpperCase()];
      if (typeof preco === "number" && preco !== ativo.precoAtual) {
        await updateDoc(doc(colecaoAtivos(), ativo.id), {
          currentPrice: preco,
        });
      }
    }),
  );
}

export async function venderAtivo(id, quantidade, precoVenda, dataVenda) {
  if (quantidade <= 0) {
    throw new Error("A quantidade deve ser maior que zero.");
  }
  if (precoVenda <= 0) {
    throw new Error("O preço de venda deve ser maior que zero.");
  }

  const referencia = doc(colecaoAtivos(), id);
  const documento = await getDoc(referencia);
  if (!documento.exists()) {
    throw new Error("Ativo não encontrado.");
  }

  const ativo = documento.data();
  const quantidadeAtual = Number(ativo.quantity);
  if (quantidade > quantidadeAtual) {
    throw new Error("Quantidade maior do que a possuída.");
  }

  if (quantidade === quantidadeAtual) {
    await deleteDoc(referencia);
    return;
  }

  const custoBaixado = quantidade * Number(ativo.averagePrice);
  const aportesAntigos = Array.isArray(ativo.aportes) ? ativo.aportes : [];

  const venda = {
    purchaseDate: dataParaBanco(dataVenda),
    invested: -custoBaixado,
    quantity: -quantidade,
    unitPrice: Number(precoVenda),
  };

  await updateDoc(referencia, {
    quantity: quantidadeAtual - quantidade,
    totalInvested: Number(ativo.totalInvested) - custoBaixado,
    aportes: [...aportesAntigos, venda],
  });
}

export async function resgatarAtivo(id) {
  await deleteDoc(doc(colecaoAtivos(), id));
}

export async function registrarOperacaoAtivo(ativo, dados) {
  if (ativo.tipo === "renda_variavel") {
    await venderAtivo(
      ativo.id,
      dados.quantidade,
      dados.precoVenda,
      dados.dataVenda,
    );
    return;
  }

  await resgatarAtivo(ativo.id);
}
