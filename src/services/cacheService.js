import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const pad = (n) => String(n).padStart(2, "0");

export function periodoMensal(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function periodoDiario(d = new Date()) {
  return `${periodoMensal(d)}-${pad(d.getDate())}`;
}

export async function lerCache(chave, periodo) {
  try {
    const snap = await getDoc(doc(db, "cache", chave));
    if (snap.exists() && snap.data().period === periodo) {
      return snap.data().data;
    }
  } catch (_e) {
    // Se falhar cache, busca na fonte
  }
  return null;
}

export async function salvarCache(chave, periodo, dados) {
  try {
    await setDoc(doc(db, "cache", chave), { period: periodo, data: dados });
  } catch (_e) {
    // Falha ao gravar não deve quebrar a tela
  }
}

// Só grava no cache quando a busca retorna algo diferente de null/undefined.
export async function obterComCache(chave, periodo, buscar) {
  const cacheado = await lerCache(chave, periodo);
  if (cacheado != null) return cacheado;

  const dados = await buscar();
  if (dados != null) {
    await salvarCache(chave, periodo, dados);
  }
  return dados;
}
