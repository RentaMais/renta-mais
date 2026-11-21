import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { obterUsuarioAtual } from "@/services/authService";
import { buscarDadosInicio } from "@/services/inicioService";

const DADOS_INICIAIS = {
  patrimonioTotal: 0,
  variacao: 0,
  divisao: [],
  evolucao: { labels: [], datasets: [{ data: [] }] },
};

export function useInicio() {
  const [nomeUsuario, setNomeUsuario] = useState(
    () => obterUsuarioAtual()?.displayName || "",
  );
  const [dadosInicio, setDadosInicio] = useState(DADOS_INICIAIS);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useFocusEffect(
    useCallback(() => {
      async function carregarDadosTela() {
        try {
          const usuario = obterUsuarioAtual();
          setNomeUsuario(usuario?.displayName || "");

          const dadosDoBanco = await buscarDadosInicio();
          setDadosInicio(dadosDoBanco);
          setErro("");
        } catch (_e) {
          setErro("Não foi possível carregar os dados da carteira.");
        } finally {
          setCarregando(false);
        }
      }

      carregarDadosTela();
    }, []),
  );

  return {
    nomeUsuario,
    dadosInicio,
    carregando,
    erro,
  };
}
