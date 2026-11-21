import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  alterarEmail,
  alterarNome,
  alterarSenha,
  excluirConta,
  obterUsuarioAtual,
  sairDaConta,
} from "@/services/authService";
import {
  validarConfirmacaoSenha,
  validarEmail,
  validarSenhaForte,
} from "@/utils/validacoesAuth";

export function useConfiguracoes({ onSair }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useFocusEffect(
    useCallback(() => {
      const usuario = obterUsuarioAtual();
      setNome(usuario?.displayName || "Usuário");
      setEmail(usuario?.email || "");
    }, []),
  );

  async function handleSairDaConta() {
    await sairDaConta();
    onSair?.();
  }

  return {
    nome,
    email,
    handleSairDaConta,
  };
}

export function useEditarPerfil({ onSucesso }) {
  const usuario = obterUsuarioAtual();

  const [nome, setNome] = useState(usuario?.displayName ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaAtualIncorreta, setSenhaAtualIncorreta] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const emailOriginal = (usuario?.email ?? "").toLowerCase();
  const emailAlterado = email.trim().toLowerCase() !== emailOriginal;

  const checkEmail = validarEmail(email);
  const estadoEmail = !checkEmail.valido
    ? "erro"
    : emailAlterado
      ? "sucesso"
      : "padrao";

  const estadoSenhaAtual =
    (tentouEnviar && emailAlterado && !senhaAtual) || senhaAtualIncorreta
      ? "erro"
      : "padrao";

  function alterarCampoEmail(texto) {
    setEmail(texto);
    if (texto.trim().toLowerCase() === emailOriginal) {
      setSenhaAtual("");
      setSenhaAtualIncorreta(false);
    }
  }

  function alterarCampoSenhaAtual(texto) {
    setSenhaAtual(texto);
    setSenhaAtualIncorreta(false);
  }

  async function handleSalvarAlteracoes() {
    setErro("");
    setSucesso("");
    setSenhaAtualIncorreta(false);
    setTentouEnviar(true);

    if (!nome.trim()) {
      setErro("Informe seu nome.");
      return;
    }
    if (!checkEmail.valido) {
      setErro(checkEmail.erro);
      return;
    }
    if (emailAlterado && !senhaAtual) {
      setErro("Digite sua senha atual para confirmar a alteração de e-mail.");
      return;
    }

    try {
      setCarregando(true);

      if (emailAlterado) {
        await alterarEmail({ novoEmail: email, senhaAtual });
        setSenhaAtual("");
      }

      if (nome.trim() !== (usuario?.displayName ?? "")) {
        await alterarNome(nome);
      }

      setSucesso("Perfil atualizado com sucesso.");
      setTimeout(() => onSucesso?.(), 1000);
    } catch (e) {
      if (emailAlterado && e.message.includes("incorreta")) {
        setSenhaAtualIncorreta(true);
      }
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return {
    nome,
    setNome,
    email,
    alterarCampoEmail,
    emailAlterado,
    estadoEmail,
    senhaAtual,
    alterarCampoSenhaAtual,
    estadoSenhaAtual,
    erro,
    sucesso,
    carregando,
    handleSalvarAlteracoes,
  };
}

export function useAlterarSenha({ onSucesso }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaAtualIncorreta, setSenhaAtualIncorreta] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const checkNovaSenha = validarSenhaForte(novaSenha);
  const checkConfirmar = validarConfirmacaoSenha(novaSenha, confirmarNovaSenha);

  const estadoSenhaAtual =
    (tentouEnviar && !senhaAtual) || senhaAtualIncorreta ? "erro" : "padrao";

  const estadoNovaSenha =
    (novaSenha.length > 0 || tentouEnviar) && !checkNovaSenha.valida
      ? "erro"
      : checkNovaSenha.valida
        ? "sucesso"
        : "padrao";

  const estadoConfirmarSenha =
    (confirmarNovaSenha.length > 0 || tentouEnviar) && !checkConfirmar.valida
      ? "erro"
      : checkConfirmar.valida
        ? "sucesso"
        : "padrao";

  const senhasDiferentes =
    confirmarNovaSenha.length > 0 && novaSenha !== confirmarNovaSenha;

  function alterarCampoSenhaAtual(texto) {
    setSenhaAtual(texto);
    setSenhaAtualIncorreta(false);
  }

  async function handleAlterarSenha() {
    setErro("");
    setSucesso("");
    setSenhaAtualIncorreta(false);
    setTentouEnviar(true);

    if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (!checkNovaSenha.valida) {
      setErro(checkNovaSenha.erro);
      return;
    }
    if (!checkConfirmar.valida) {
      setErro("As novas senhas não coincidem.");
      return;
    }
    if (senhaAtual === novaSenha) {
      setErro("A nova senha deve ser diferente da senha atual.");
      return;
    }

    try {
      setCarregando(true);
      await alterarSenha({ senhaAtual, novaSenha });
      setSucesso("Senha alterada com sucesso.");
      setTimeout(() => onSucesso?.(), 1000);
    } catch (e) {
      if (e.message.includes("incorreta")) {
        setSenhaAtualIncorreta(true);
      }
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return {
    senhaAtual,
    alterarCampoSenhaAtual,
    estadoSenhaAtual,
    novaSenha,
    setNovaSenha,
    estadoNovaSenha,
    confirmarNovaSenha,
    setConfirmarNovaSenha,
    estadoConfirmarSenha,
    senhasDiferentes,
    erro,
    sucesso,
    carregando,
    handleAlterarSenha,
  };
}

export function useExcluirConta({ onSucesso }) {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaIncorreta, setSenhaIncorreta] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const checkConfirmar = validarConfirmacaoSenha(senha, confirmarSenha);

  const estadoSenha =
    (tentouEnviar && !senha) || senhaIncorreta ? "erro" : "padrao";

  const estadoConfirmar =
    (confirmarSenha.length > 0 || tentouEnviar) && !checkConfirmar.valida
      ? "erro"
      : checkConfirmar.valida
        ? "sucesso"
        : "padrao";

  const senhasDiferentes =
    confirmarSenha.length > 0 && senha !== confirmarSenha;

  function alterarCampoSenha(texto) {
    setSenha(texto);
    setSenhaIncorreta(false);
  }

  async function handleExcluirConta() {
    setErro("");
    setSenhaIncorreta(false);
    setTentouEnviar(true);

    if (!senha || !confirmarSenha) {
      setErro("Digite e confirme sua senha.");
      return;
    }
    if (!checkConfirmar.valida) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);
      await excluirConta(senha);
      onSucesso?.();
    } catch (e) {
      if (e.message.includes("incorreta")) {
        setSenhaIncorreta(true);
      }
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return {
    senha,
    alterarCampoSenha,
    estadoSenha,
    confirmarSenha,
    setConfirmarSenha,
    estadoConfirmar,
    senhasDiferentes,
    erro,
    carregando,
    handleExcluirConta,
  };
}
