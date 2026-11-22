import { calcularRendimento, diasEntre } from "@/utils/rendaFixa";

describe("calcularRendimento", () => {
  test("sem dias, não rende", () => {
    expect(calcularRendimento(1000, 10, 0)).toBe(0);
  });

  test("CDI de 10% ao ano rende 100 em um ano", () => {
    expect(calcularRendimento(1000, 10, 365)).toBeCloseTo(100);
  });
});

describe("diasEntre", () => {
  test("conta os dias entre duas datas", () => {
    expect(diasEntre(new Date(2026, 0, 1), new Date(2026, 0, 11))).toBe(10);
  });
});
