export const REQUISITOS_SENHA = [
  {
    id: "tamanho",
    texto: "Mínimo de 8 caracteres",
    testar: (senha) => senha.length >= 8,
  },
  {
    id: "maiuscula",
    texto: "Letra maiúscula (A-Z)",
    testar: (senha) => /[A-Z]/.test(senha),
  },
  {
    id: "minuscula",
    texto: "Letra minúscula (a-z)",
    testar: (senha) => /[a-z]/.test(senha),
  },
  {
    id: "numero",
    texto: "Número (0-9)",
    testar: (senha) => /[0-9]/.test(senha),
  },
  {
    id: "especial",
    texto: "Caractere especial (!@#$%...)",
    testar: (senha) => /[^A-Za-z0-9\s]/.test(senha),
  },
];

export function avaliarRequisitosSenha(senha = "") {
  const itens = REQUISITOS_SENHA.map((req) => ({
    id: req.id,
    texto: req.texto,
    atendido: req.testar(senha),
  }));

  const atendidos = itens.filter((item) => item.atendido).length;
  const total = itens.length;
  const tamanhoMaximoOk = senha.length <= 64;
  const valida = atendidos === total && tamanhoMaximoOk;

  let forca = "fraca";
  if (valida) {
    forca = "forte";
  } else if (atendidos >= 3 && senha.length >= 8) {
    forca = "media";
  }

  return { itens, atendidos, total, valida, forca };
}

export function validarSenhaForte(senha = "") {
  if (senha.length > 64) {
    return {
      valida: false,
      erro: "A senha deve ter no máximo 64 caracteres.",
    };
  }

  const avaliacao = avaliarRequisitosSenha(senha);
  if (!avaliacao.valida) {
    const pendente = avaliacao.itens.find((item) => !item.atendido);
    return {
      valida: false,
      erro: `A senha deve conter: ${pendente.texto.toLowerCase()}.`,
    };
  }

  return { valida: true, erro: "" };
}

export function validarConfirmacaoSenha(senha = "", confirmarSenha = "") {
  if (!confirmarSenha) {
    return { valida: false, erro: "Confirme sua senha." };
  }
  if (senha !== confirmarSenha) {
    return { valida: false, erro: "As senhas não coincidem." };
  }
  return { valida: true, erro: "" };
}

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarEmail(email = "") {
  const emailLimpo = email.trim();
  if (!emailLimpo) {
    return { valido: false, erro: "Informe um e-mail." };
  }
  if (!REGEX_EMAIL.test(emailLimpo)) {
    return { valido: false, erro: "Informe um e-mail válido." };
  }
  return { valido: true, erro: "" };
}
