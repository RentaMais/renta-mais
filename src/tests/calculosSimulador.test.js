import { describe, expect, test } from "@jest/globals";
import {
  calcularPatrimonio,
  formatarEixoSimulador,
  gerarProjecaoSimulador,
} from "@/utils/calculosSimulador";

describe("calcularPatrimonio", () => {
  test("com taxa zero, apenas soma aporte inicial e aportes mensais", () => {
    expect(calcularPatrimonio(1000, 100, 0, 1, false)).toBe(2200);
  });

  test("calcula rendimento composto anual sem inflação", () => {
    expect(calcularPatrimonio(1000, 0, 10, 1, false)).toBeCloseTo(1100);
  });

  test("desconta a inflação quando ativada", () => {
    expect(calcularPatrimonio(1040, 0, 10, 1, true, 0.04)).toBeCloseTo(1100);
  });

  test("considera aportes mensais no cálculo composto", () => {
    expect(calcularPatrimonio(1000, 100, 10, 1, false)).toBeCloseTo(2354.05, 2);
  });
});

describe("formatarEixoSimulador", () => {
  test("mantém valores abaixo de mil arredondados", () => {
    expect(formatarEixoSimulador(500)).toBe("500");
    expect(formatarEixoSimulador(500, true)).toBe("R$ 500");
  });

  test("abrevia valores em mil, milhões, bilhões e trilhões", () => {
    expect(formatarEixoSimulador(1500)).toBe("1,5 mil");
    expect(formatarEixoSimulador(2000000)).toBe("2 mi");
    expect(formatarEixoSimulador(3000000000)).toBe("3 bi");
    expect(formatarEixoSimulador(1500000000000)).toBe("1,5 tri");
  });
});

describe("gerarProjecaoSimulador", () => {
  test("calcula os três perfis e gera 6 pontos para o gráfico", () => {
    const resultado = gerarProjecaoSimulador({
      aporteInicial: "1000",
      aporteMensal: "0",
      rentabilidade: "10",
      tempoSelecionado: 10,
      descontarInflacao: false,
      taxaIbovespa: 20,
    });

    expect(resultado.perfis).toHaveLength(3);
    expect(resultado.perfis[0].id).toBe("arrojado");
    expect(resultado.perfis[0].descricao).toBe(
      "70% Ibovespa (20,0%) + 30% Renda Fixa (10,0%), resultante: (17,0%)",
    );
    expect(resultado.perfis[2].valor).toBeCloseTo(2593.74, 2);

    expect(resultado.grafico.labels).toEqual([
      "0",
      "2a",
      "4a",
      "6a",
      "8a",
      "10a",
    ]);
    expect(resultado.grafico.series.conservador).toHaveLength(6);
    expect(resultado.grafico.series.conservador[0]).toBe(1000);
    expect(resultado.grafico.series.conservador[5]).toBeCloseTo(2593.74, 2);
  });
});
