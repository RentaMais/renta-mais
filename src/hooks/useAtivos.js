import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  atualizarCotacoesCarteira,
  buscarAtivo,
  cadastrarRendaVariavel,
  criarRendaFixa,
  listarAtivos,
  registrarOperacaoAtivo,
} from "@/services/ativosService";
import { montarDetalhesAtivo, resumirCarteira } from "@/utils/converterAtivo";
import {
  calcularResumoResgate,
  calcularResumoVenda,
  formatarNumeroInput,
  validarDataBR,
  validarDataNaoFutura,
  validarDataNaoPassada,
  validarQuantidadeVenda,
  validarValorPositivo,
} from "@/utils/validacoesAtivos";
import { textoParaData } from "@/utils/formatarData";

function resolverEstadoCampo(ativoValidacao, check) {
  return ativoValidacao && !check.valido ? "erro" : "padrao";
}

export function useCarteiraAtivos() {
  const [ativos, setAtivos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        try {
          const listaInicial = await listarAtivos();
          if (ativo) {
            setAtivos(listaInicial);
            setErro("");
            setCarregando(false);
          }

          await atualizarCotacoesCarteira(listaInicial);
          const listaAtualizada = await listarAtivos();
          if (ativo) {
            setAtivos(listaAtualizada);
          }
        } catch (_e) {
          if (ativo) {
            setErro("Não foi possível carregar os ativos.");
            setCarregando(false);
          }
        }
      }

      carregar();

      return () => {
        ativo = false;
      };
    }, []),
  );

  const { variaveis, fixos, totalInvestido, totalAtual } =
    resumirCarteira(ativos);

  return {
    variaveis,
    fixos,
    totalInvestido,
    totalAtual,
    carregando,
    erro,
  };
}

export function useDetalheAtivo(id) {
  const [ativo, setAtivo] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const dados = await buscarAtivo(id);
          setAtivo(dados);
        } catch (_e) {
          setAtivo(null);
        } finally {
          setCarregando(false);
        }
      }
      carregar();
    }, [id]),
  );

  const ehVariavel = ativo?.tipo === "renda_variavel";
  const informacoes = montarDetalhesAtivo(ativo);

  return {
    ativo,
    ehVariavel,
    informacoes,
    carregando,
  };
}

export function useNovoAtivo({ onSucesso }) {
  const [tipoRenda, setTipoRenda] = useState("Renda fixa");
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Renda Fixa
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [indexador, setIndexador] = useState("Selic");
  const [indexadorAberto, setIndexadorAberto] = useState(false);
  const [taxa, setTaxa] = useState("");
  const [vencimento, setVencimento] = useState("");

  // Renda Variável
  const [ticker, setTicker] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoMedio, setPrecoMedio] = useState("");
  const [dataCompra, setDataCompra] = useState("");

  const checkValorFixa = validarValorPositivo(valor, "valor");
  const mostrarErroValorFixa =
    (valor.length > 0 || tentouEnviar) && !checkValorFixa.valido;

  const checkVencimento = validarDataNaoPassada(
    vencimento,
    "Data de vencimento",
  );
  const mostrarErroVencimento =
    (vencimento.length > 0 || tentouEnviar) && !checkVencimento.valido;

  const checkQuantidade = validarValorPositivo(quantidade, "quantidade");
  const mostrarErroQuantidade =
    (quantidade.length > 0 || tentouEnviar) && !checkQuantidade.valido;

  const checkPrecoMedio = validarValorPositivo(precoMedio, "preço médio");
  const mostrarErroPrecoMedio =
    (precoMedio.length > 0 || tentouEnviar) && !checkPrecoMedio.valido;

  const checkDataCompra = validarDataNaoFutura(dataCompra, "Data da compra");
  const mostrarErroDataCompra =
    (dataCompra.length > 0 || tentouEnviar) && !checkDataCompra.valido;

  const valorInvestido =
    (checkQuantidade.valido ? checkQuantidade.valor : 0) *
    (checkPrecoMedio.valido ? checkPrecoMedio.valor : 0);

  function trocarTipoRenda(tipo) {
    setTipoRenda(tipo);
    setTentouEnviar(false);
    setErro("");
  }

  async function salvar() {
    setErro("");
    setTentouEnviar(true);

    if (tipoRenda === "Renda fixa") {
      if (!nome.trim()) {
        setErro("Informe o nome do título.");
        return;
      }
      if (!checkValorFixa.valido) {
        return;
      }
      if (!taxa.trim()) {
        setErro("Informe a taxa de rentabilidade.");
        return;
      }
      if (!checkVencimento.valido) {
        return;
      }
    } else {
      if (!ticker.trim()) {
        setErro("Informe o ticker do ativo.");
        return;
      }
      if (!checkQuantidade.valido) {
        return;
      }
      if (!checkPrecoMedio.valido) {
        return;
      }
      if (!checkDataCompra.valido) {
        return;
      }
    }

    try {
      setSalvando(true);
      if (tipoRenda === "Renda fixa") {
        await criarRendaFixa({
          nome,
          valor: checkValorFixa.valor,
          indexador,
          taxa,
          vencimento,
        });
      } else {
        await cadastrarRendaVariavel({
          ticker,
          quantidade: checkQuantidade.valor,
          precoMedio: checkPrecoMedio.valor,
          dataCompra,
        });
      }
      onSucesso?.();
    } catch (e) {
      setErro(e?.message || "Não foi possível salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return {
    tipoRenda,
    trocarTipoRenda,
    salvando,
    erro,
    salvar,
    rendaFixa: {
      nome,
      setNome,
      estadoNome: tentouEnviar && !nome.trim() ? "erro" : "padrao",
      valor,
      setValor,
      estadoValor: resolverEstadoCampo(
        valor.length > 0 || tentouEnviar,
        checkValorFixa,
      ),
      alertaValor: mostrarErroValorFixa ? checkValorFixa.erro : "",
      indexador,
      setIndexador,
      indexadorAberto,
      setIndexadorAberto,
      taxa,
      setTaxa,
      estadoTaxa: tentouEnviar && !taxa.trim() ? "erro" : "padrao",
      vencimento,
      setVencimento,
      estadoVencimento: resolverEstadoCampo(
        vencimento.length > 0 || tentouEnviar,
        checkVencimento,
      ),
      alertaVencimento: mostrarErroVencimento ? checkVencimento.erro : "",
    },
    rendaVariavel: {
      ticker,
      setTicker,
      estadoTicker: tentouEnviar && !ticker.trim() ? "erro" : "padrao",
      quantidade,
      setQuantidade,
      estadoQuantidade: resolverEstadoCampo(
        quantidade.length > 0 || tentouEnviar,
        checkQuantidade,
      ),
      alertaQuantidade: mostrarErroQuantidade ? checkQuantidade.erro : "",
      precoMedio,
      setPrecoMedio,
      estadoPreco: resolverEstadoCampo(
        precoMedio.length > 0 || tentouEnviar,
        checkPrecoMedio,
      ),
      alertaPreco: mostrarErroPrecoMedio ? checkPrecoMedio.erro : "",
      dataCompra,
      setDataCompra,
      estadoData: resolverEstadoCampo(
        dataCompra.length > 0 || tentouEnviar,
        checkDataCompra,
      ),
      alertaData: mostrarErroDataCompra ? checkDataCompra.erro : "",
      valorInvestido,
    },
  };
}

export function useOperacaoAtivo(id, { onSucesso }) {
  const [ativo, setAtivo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erro, setErro] = useState("");

  const hoje = new Date().toLocaleDateString("pt-BR");
  const [quantidadeVenda, setQuantidadeVenda] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [dataVenda, setDataVenda] = useState(hoje);
  const [valorResgate, setValorResgate] = useState("");
  const [dataResgate, setDataResgate] = useState(hoje);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const dados = await buscarAtivo(id);
          setAtivo(dados);
        } catch (_e) {
          setAtivo(null);
        } finally {
          setCarregando(false);
        }
      }
      carregar();
    }, [id]),
  );

  const ehVariavel = ativo?.tipo === "renda_variavel";

  const checkQuantidade = validarQuantidadeVenda(
    quantidadeVenda,
    ativo?.quantidade ?? 0,
  );
  const mostrarErroQuantidade =
    (quantidadeVenda.length > 0 || tentouEnviar) && !checkQuantidade.valido;

  const checkPreco = validarValorPositivo(precoVenda, "preço de venda");
  const mostrarErroPreco =
    (precoVenda.length > 0 || tentouEnviar) && !checkPreco.valido;

  const checkDataVenda = validarDataNaoFutura(dataVenda, "Data da venda");
  const mostrarErroDataVenda =
    (dataVenda.length > 0 || tentouEnviar) && !checkDataVenda.valido;

  const checkValorResgate = validarValorPositivo(
    valorResgate,
    "valor de resgate",
  );
  const mostrarErroValorResgate =
    (valorResgate.length > 0 || tentouEnviar) && !checkValorResgate.valido;

  const checkDataResgate = validarDataBR(dataResgate);
  const mostrarErroDataResgate =
    (dataResgate.length > 0 || tentouEnviar) && !checkDataResgate.valido;

  const { valorVenda, lucro } = calcularResumoVenda({
    quantidade: checkQuantidade.valor,
    precoVenda: checkPreco.valor,
    precoMedio: ativo?.precoMedio ?? 0,
  });

  const { valorResgate: valorResgateNumero, rendimento } =
    calcularResumoResgate({
      valorResgate: checkValorResgate.valor,
      valorInicial: ativo?.valorInicial ?? 0,
    });

  async function confirmar() {
    if (!ativo) return;
    setErro("");
    setTentouEnviar(true);

    if (ehVariavel) {
      if (!checkQuantidade.valido) {
        setErro(checkQuantidade.erro);
        return;
      }
      if (!checkPreco.valido) {
        setErro(checkPreco.erro);
        return;
      }
      if (!checkDataVenda.valido) {
        setErro(checkDataVenda.erro);
        return;
      }
    } else {
      if (!checkValorResgate.valido) {
        setErro(checkValorResgate.erro);
        return;
      }
      if (!checkDataResgate.valido) {
        setErro(checkDataResgate.erro);
        return;
      }
    }

    try {
      setSalvando(true);
      await registrarOperacaoAtivo(ativo, {
        quantidade: checkQuantidade.valor,
        precoVenda: checkPreco.valor,
        dataVenda,
      });
      onSucesso?.();
    } catch (e) {
      setErro(e?.message || "Não foi possível concluir. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return {
    ativo,
    ehVariavel,
    carregando,
    salvando,
    erro,
    confirmar,
    venda: {
      quantidadeVenda,
      setQuantidadeVenda,
      placeholderQuantidade: String(ativo?.quantidade ?? ""),
      estadoQuantidade: resolverEstadoCampo(
        quantidadeVenda.length > 0 || tentouEnviar,
        checkQuantidade,
      ),
      alertaQuantidade: mostrarErroQuantidade ? checkQuantidade.erro : "",
      precoVenda,
      setPrecoVenda,
      placeholderPreco: formatarNumeroInput(ativo?.precoMedio),
      estadoPreco: resolverEstadoCampo(
        precoVenda.length > 0 || tentouEnviar,
        checkPreco,
      ),
      alertaPreco: mostrarErroPreco ? checkPreco.erro : "",
      dataVenda,
      setDataVenda,
      estadoData: resolverEstadoCampo(
        dataVenda.length > 0 || tentouEnviar,
        checkDataVenda,
      ),
      alertaData: mostrarErroDataVenda ? checkDataVenda.erro : "",
      valorVenda,
      lucro,
    },
    resgate: {
      valorResgate,
      setValorResgate,
      placeholderValor: formatarNumeroInput(ativo?.valorInicial),
      estadoValor: resolverEstadoCampo(
        valorResgate.length > 0 || tentouEnviar,
        checkValorResgate,
      ),
      alertaValor: mostrarErroValorResgate ? checkValorResgate.erro : "",
      dataResgate,
      setDataResgate,
      estadoData: resolverEstadoCampo(
        dataResgate.length > 0 || tentouEnviar,
        checkDataResgate,
      ),
      alertaData: mostrarErroDataResgate ? checkDataResgate.erro : "",
      valorResgateNumero,
      rendimento,
      valorInicial: ativo?.valorInicial ?? 0,
    },
  };
}
