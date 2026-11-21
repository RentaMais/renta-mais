import { describe, expect, test } from "@jest/globals";
import {
  avaliarRequisitosSenha,
  validarConfirmacaoSenha,
  validarEmail,
  validarSenhaForte,
} from "@/utils/validacoesAuth";

describe("avaliarRequisitosSenha", () => {
  test("retorna força fraca e nenhum requisito atendido para senha vazia", () => {
    const resultado = avaliarRequisitosSenha("");
    expect(resultado.valida).toBe(false);
    expect(resultado.atendidos).toBe(0);
    expect(resultado.forca).toBe("fraca");
  });

  test("identifica força média quando parte dos requisitos é atendida", () => {
    const resultado = avaliarRequisitosSenha("Senha123");
    expect(resultado.valida).toBe(false);
    expect(resultado.atendidos).toBe(4);
    expect(resultado.forca).toBe("media");
  });

  test("identifica força forte quando todos os requisitos OWASP são atendidos", () => {
    const resultado = avaliarRequisitosSenha("Senha@123");
    expect(resultado.valida).toBe(true);
    expect(resultado.atendidos).toBe(5);
    expect(resultado.forca).toBe("forte");
  });
});

describe("validarSenhaForte", () => {
  test("rejeita senhas sem caractere especial", () => {
    const resultado = validarSenhaForte("Senha1234");
    expect(resultado.valida).toBe(false);
    expect(resultado.erro).toContain("caractere especial");
  });

  test("rejeita senhas acima de 64 caracteres", () => {
    const senhaLonga = "Aa1@" + "a".repeat(61);
    const resultado = validarSenhaForte(senhaLonga);
    expect(resultado.valida).toBe(false);
    expect(resultado.erro).toContain("64 caracteres");
  });

  test("aprova senha dentro dos padrões OWASP", () => {
    const resultado = validarSenhaForte("RentaMais#2026");
    expect(resultado.valida).toBe(true);
    expect(resultado.erro).toBe("");
  });
});

describe("validarConfirmacaoSenha", () => {
  test("rejeita confirmação vazia ou divergente", () => {
    expect(validarConfirmacaoSenha("Senha@123", "").valida).toBe(false);
    expect(validarConfirmacaoSenha("Senha@123", "Senha@124").valida).toBe(
      false,
    );
  });

  test("aprova quando ambas as senhas coincidem", () => {
    const resultado = validarConfirmacaoSenha("Senha@123", "Senha@123");
    expect(resultado.valida).toBe(true);
    expect(resultado.erro).toBe("");
  });
});

describe("validarEmail", () => {
  test("rejeita e-mails vazios ou mal formatados", () => {
    expect(validarEmail("").valido).toBe(false);
    expect(validarEmail("usuario@").valido).toBe(false);
    expect(validarEmail("usuario@dominio").valido).toBe(false);
    expect(validarEmail("usuario dominio@gmail.com").valido).toBe(false);
  });

  test("aprova e-mails válidos", () => {
    const resultado = validarEmail("joao.pedro@gmail.com");
    expect(resultado.valido).toBe(true);
    expect(resultado.erro).toBe("");
  });
});
