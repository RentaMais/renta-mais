import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { obterUsuarioAtual } from "@/services/authService";
import { buscarDadosInicio } from "@/services/inicioService";

const DADOS_INICIAIS = {
  patrimonioTotal: 0,
  variacao: 0,
  temHistorico: false,
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
      let ativo = true;

      async function carregarDadosTela() {
        try {
          const usuario = obterUsuarioAtual();
          if (ativo) {
            setNomeUsuario(usuario?.displayName || "");
          }

          const dadosDoBanco = await buscarDadosInicio();
          if (ativo) {
            setDadosInicio(dadosDoBanco);
            setErro("");
          }
        } catch (_e) {
          if (ativo) {
            setErro("Não foi possível carregar os dados da carteira.");
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarDadosTela();

      return () => {
        ativo = false;
      };
    }, []),
  );

  return {
    nomeUsuario,
    dadosInicio,
    carregando,
    erro,
  };
}
