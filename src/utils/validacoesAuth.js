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

// Verifica quais critérios a senha atende e classifica sua força
export function avaliarRequisitosSenha(senha = "") {
  const requisitos = REQUISITOS_SENHA.map((req) => ({
    id: req.id,
    texto: req.texto,
    foiAtendido: req.testar(senha),
  }));

  const qtdAtendidos = requisitos.filter((item) => item.foiAtendido).length;
  const total = requisitos.length;
  const tamanhoMaximoOk = senha.length <= 64;
  const valida = qtdAtendidos === total && tamanhoMaximoOk;

  let forca = "fraca";
  if (valida) {
    forca = "forte";
  } else if (qtdAtendidos >= 3 && senha.length >= 8) {
    forca = "media";
  }

  return { requisitos, qtdAtendidos, total, valida, forca };
}

// Valida se a senha respeita o limite de 64 caracteres e todos os requisitos
export function validarSenhaForte(senha = "") {
  if (senha.length > 64) {
    return {
      valida: false,
      erro: "A senha deve ter no máximo 64 caracteres.",
    };
  }

  const resultado = avaliarRequisitosSenha(senha);
  if (!resultado.valida) {
    const requisitoPendente = resultado.requisitos.find(
      (item) => !item.foiAtendido,
    );
    return {
      valida: false,
      erro: requisitoPendente
        ? `A senha deve conter: ${requisitoPendente.texto.toLowerCase()}.`
        : "A senha não atende aos requisitos de segurança.",
    };
  }

  return { valida: true, erro: "" };
}

// Verifica se a confirmação foi preenchida e bate com a senha digitada
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

// Valida se o e-mail foi informado e possui formato válido
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
