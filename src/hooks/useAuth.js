import { useState } from "react";
import {
  cadastrarUsuario,
  entrarComEmailESenha,
  enviarEmailRecuperacaoSenha,
} from "@/services/authService";
import {
  validarConfirmacaoSenha,
  validarEmail,
  validarSenhaForte,
} from "@/utils/validacoesAuth";

export function useLogin({ onSucesso }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      setCarregando(true);
      await entrarComEmailESenha({ email, password: senha });
      onSucesso?.();
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return {
    email,
    setEmail,
    senha,
    setSenha,
    erro,
    carregando,
    handleLogin,
  };
}

export function useCadastro({ onSucesso }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const checkEmail = validarEmail(email);
  const estadoEmail =
    (email.length > 0 || tentouEnviar) && !checkEmail.valido
      ? "erro"
      : checkEmail.valido
        ? "sucesso"
        : "padrao";

  const checkSenha = validarSenhaForte(senha);
  const estadoSenha =
    (senha.length > 0 || tentouEnviar) && !checkSenha.valida
      ? "erro"
      : checkSenha.valida
        ? "sucesso"
        : "padrao";

  const checkConfirmar = validarConfirmacaoSenha(senha, confirmarSenha);
  const estadoConfirmar =
    (confirmarSenha.length > 0 || tentouEnviar) && !checkConfirmar.valida
      ? "erro"
      : checkConfirmar.valida
        ? "sucesso"
        : "padrao";

  const senhasDiferentes =
    confirmarSenha.length > 0 && senha !== confirmarSenha;

  async function validarCadastro() {
    setErro("");
    setTentouEnviar(true);

    if (!nome.trim()) {
      setErro("Informe como você gostaria de ser chamado.");
      return;
    }
    if (!checkEmail.valido) {
      setErro(checkEmail.erro);
      return;
    }
    if (!checkSenha.valida) {
      setErro(checkSenha.erro);
      return;
    }
    if (!checkConfirmar.valida) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);
      await cadastrarUsuario({ name: nome, email, password: senha });
      onSucesso?.();
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return {
    nome,
    setNome,
    email,
    setEmail,
    senha,
    setSenha,
    confirmarSenha,
    setConfirmarSenha,
    estadoEmail,
    estadoSenha,
    estadoConfirmar,
    senhasDiferentes,
    erro,
    carregando,
    validarCadastro,
  };
}

export function useEsqueciSenha() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function alterarEmail(texto) {
    setEmail(texto);
    setEnviado(false);
  }

  async function handleRecuperarSenha() {
    setErro("");
    setEnviado(false);

    const checkEmail = validarEmail(email);
    if (!checkEmail.valido) {
      setErro(checkEmail.erro);
      return;
    }

    try {
      setCarregando(true);
      await enviarEmailRecuperacaoSenha(email);
      setEnviado(true);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return {
    email,
    alterarEmail,
    enviado,
    erro,
    carregando,
    handleRecuperarSenha,
  };
}
