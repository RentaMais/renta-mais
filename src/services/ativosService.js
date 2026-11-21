import { db } from "@/services/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { obterUsuarioAtual } from "@/services/authService";
import { dataParaBanco } from "@/utils/formatarData";
import { converterAtivo } from "@/utils/converterAtivo";
import { buscarCotacoesAtuais } from "@/services/cotacoesService";

function colecaoAtivos() {
  const user = obterUsuarioAtual();
  if (!user) {
    throw new Error("Usuário não autenticado.");
  }
  return collection(db, "users", user.uid, "assets");
}

export async function buscarInfoTicker(ticker) {
  const token = process.env.EXPO_PUBLIC_BRAPI_TOKEN;
  let url = "https://brapi.dev/api/quote/" + ticker;
  if (token) {
    url = url + "?token=" + token;
  }
  const resposta = await fetch(url);
  const dados = await resposta.json();
  const item = dados.results && dados.results[0];
  if (!item) {
    return null;
  }
  return {
    preco: item.regularMarketPrice,
    logo: item.logourl || "",
    nome: item.shortName || ticker,
  };
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

  await addDoc(colecaoAtivos(), {
    type: "fixed",
    name: dados.nome,
    category: dados.indexador,
    rate: dados.taxa,
    dueDate: dataParaBanco(dados.vencimento),
    totalInvested: Number(dados.valor),
    aportes: [{ purchaseDate: hoje, invested: Number(dados.valor) }],
  });
}

export async function criarRendaVariavel(dados) {
  const ticker = dados.ticker.trim().toUpperCase();
  const quantidadeNova = Number(dados.quantidade);
  const precoNovo = Number(dados.precoMedio);
  const valorCompra = quantidadeNova * precoNovo;
  let precoAtual = precoNovo;
  let logoUrl = "";
  try {
    const info = await buscarInfoTicker(ticker);
    if (info) {
      precoAtual = Number(info.preco) || precoNovo;
      logoUrl = info.logo;
    }
  } catch (e) {
    console.warn("Não foi possível consultar a brapi: ", e);
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
      logoUrl: logoUrl,
      aportes: [...aportesAntigos, aporte],
    });
  } else {
    await addDoc(colecaoAtivos(), {
      type: "variable",
      name: ticker,
      ticker: ticker,
      quantity: quantidadeNova,
      averagePrice: precoNovo,
      currentPrice: precoAtual,
      totalInvested: valorCompra,
      logoUrl: logoUrl,
      aportes: [aporte],
    });
  }
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

export async function venderAtivo(id, quantidade, dataVenda) {
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
    unitPrice: precoVenda,
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
