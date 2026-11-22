import { describe, expect, test } from "@jest/globals";
import {
  calcularResumoVenda,
  formatarNumeroInput,
  parseNumeroBR,
  validarDataBR,
  validarQuantidadeVenda,
  validarValorPositivo,
} from "@/utils/validacoesAtivos";

describe("parseNumeroBR e formatarNumeroInput", () => {
  test("converte números com vírgula e ponto corretamente", () => {
    expect(parseNumeroBR("34,80")).toBe(34.8);
    expect(parseNumeroBR("1.250,50")).toBe(1250.5);
    expect(parseNumeroBR("0")).toBe(0);
    expect(parseNumeroBR("-5")).toBe(-5);
    expect(parseNumeroBR("")).toBeNaN();
    expect(parseNumeroBR("abc")).toBeNaN();
  });

  test("formata número para placeholder no padrão brasileiro", () => {
    expect(formatarNumeroInput(34.8)).toBe("34,80");
    expect(formatarNumeroInput(15000)).toBe("15000,00");
  });
});

describe("validarQuantidadeVenda", () => {
  test("rejeita quantidade menor ou igual a zero", () => {
    expect(validarQuantidadeVenda("0", 100).valido).toBe(false);
    expect(validarQuantidadeVenda("-2", 100).valido).toBe(false);
    expect(validarQuantidadeVenda("0", 100).erro).toContain("maior que zero");
  });

  test("rejeita quantidade maior do que a possuída", () => {
    const resultado = validarQuantidadeVenda("101", 100);
    expect(resultado.valido).toBe(false);
    expect(resultado.erro).toContain("100");
  });

  test("aprova quantidade entre 1 e o máximo disponível", () => {
    const resultado = validarQuantidadeVenda("50", 100);
    expect(resultado.valido).toBe(true);
    expect(resultado.valor).toBe(50);
  });
});

describe("validarValorPositivo", () => {
  test("rejeita valores menores ou iguais a zero", () => {
    expect(validarValorPositivo("0", "preço de venda").valido).toBe(false);
    expect(validarValorPositivo("-10,50", "valor").valido).toBe(false);
  });

  test("aprova valores maiores que zero", () => {
    const resultado = validarValorPositivo("46,80", "preço de venda");
    expect(resultado.valido).toBe(true);
    expect(resultado.valor).toBe(46.8);
  });
});

describe("validarDataBR", () => {
  test("valida formato e existência da data no calendário", () => {
    expect(validarDataBR("21/11/2026").valido).toBe(true);
    expect(validarDataBR("31/02/2026").valido).toBe(false);
    expect(validarDataBR("21/11/26").valido).toBe(false);
  });
});

describe("cálculos de operação", () => {
  test("calcula valor total e lucro da venda", () => {
    const res = calcularResumoVenda({
      quantidade: 10,
      precoVenda: 40,
      precoMedio: 35,
    });
    expect(res).toEqual({ valorVenda: 400, lucro: 50 });
  });

});
