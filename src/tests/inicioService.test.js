import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { getDocs } from "firebase/firestore";
import { obterUsuarioAtual } from "@/services/authService";
import { buscarCotacoesAtuais } from "@/services/cotacoesService";
import { buscarDadosRentabilidade } from "@/services/rentabilidadeService";
import {
  buscarDadosInicio,
  calcularResumoInicio,
} from "@/services/inicioService";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("@/services/firebase", () => ({
  db: {},
}));

jest.mock("@/services/authService", () => ({
  obterUsuarioAtual: jest.fn(),
}));

jest.mock("@/services/cotacoesService", () => ({
  buscarCotacoesAtuais: jest.fn(),
}));

jest.mock("@/services/rentabilidadeService", () => ({
  buscarDadosRentabilidade: jest.fn(),
}));

describe("calcularResumoInicio", () => {
  test("calcula totalRendaVariavel como quantidade vezes currentPrice", () => {
    const ativos = [
      {
        type: "variable",
        ticker: "PETR3",
        quantity: 3,
        averagePrice: 35,
        currentPrice: 48.63,
        totalInvested: 105,
      },
    ];

    const resumo = calcularResumoInicio(ativos, []);

    expect(resumo.totalRendaVariavel).toBe(145.89);
    expect(resumo.totalRendaFixa).toBe(0);
    expect(resumo.patrimonioTotal).toBe(145.89);
    expect(resumo.variacao).toBe(38.9);
    expect(resumo.divisao).toEqual([
      { name: "Renda variável", valor: 100 },
      { name: "Renda fixa", valor: 0 },
    ]);
  });

  test("prioriza cotação em tempo real quando disponível e combina com renda fixa", () => {
    const ativos = [
      {
        type: "variable",
        ticker: "PETR3",
        quantity: 3,
        averagePrice: 35,
        currentPrice: 48.63,
        totalInvested: 105,
      },
      {
        type: "fixed",
        name: "Tesouro Selic",
        totalInvested: 150,
      },
    ];

    const resumo = calcularResumoInicio(ativos, [], { PETR3: 50 });

    expect(resumo.totalRendaVariavel).toBe(150);
    expect(resumo.totalRendaFixa).toBe(150);
    expect(resumo.patrimonioTotal).toBe(300);
    expect(resumo.divisao).toEqual([
      { name: "Renda variável", valor: 50 },
      { name: "Renda fixa", valor: 50 },
    ]);
  });

  test("soma quantidades dos aportes quando quantity principal estiver zerado", () => {
    const ativos = [
      {
        type: "variable",
        ticker: "VALE3",
        quantity: 0,
        averagePrice: 60,
        currentPrice: 65,
        aportes: [{ quantity: 2 }, { quantity: 3 }],
      },
    ];

    const resumo = calcularResumoInicio(ativos, []);

    expect(resumo.totalRendaVariavel).toBe(325);
    expect(resumo.patrimonioTotal).toBe(325);
  });

  test("reconstrói histórico de evolução patrimonial sem quebrar com retorno -100%", () => {
    const ativos = [
      {
        type: "variable",
        ticker: "ITUB4",
        quantity: 10,
        averagePrice: 20,
        currentPrice: 22,
        totalInvested: 200,
      },
    ];

    const meses = [
      { mes: "Out", carteira: -100 },
      { mes: "Nov", carteira: 10 },
    ];

    const resumo = calcularResumoInicio(ativos, meses);

    expect(resumo.patrimonioTotal).toBe(220);
    expect(resumo.variacao).toBe(10);
    expect(resumo.evolucao.labels).toEqual(["Out", "Nov"]);
    expect(resumo.evolucao.datasets[0].data).toEqual([200, 220]);
  });
});

describe("buscarDadosInicio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lança erro quando não há usuário autenticado", async () => {
    obterUsuarioAtual.mockReturnValue(null);

    await expect(buscarDadosInicio()).rejects.toThrow(
      "Usuário não autenticado.",
    );
  });

  test("integra ativos do Firestore, cotações atuais e rentabilidade", async () => {
    obterUsuarioAtual.mockReturnValue({ uid: "user-123" });
    getDocs.mockResolvedValue({
      docs: [
        {
          data: () => ({
            type: "variable",
            ticker: "PETR3",
            quantity: 3,
            averagePrice: 35,
            currentPrice: 48.63,
            totalInvested: 105,
          }),
        },
        {
          data: () => ({
            type: "fixed",
            name: "Tesouro Selic",
            totalInvested: 154.11,
          }),
        },
      ],
    });
    buscarDadosRentabilidade.mockResolvedValue({
      meses: [{ mes: "Nov", carteira: 5.2 }],
    });
    buscarCotacoesAtuais.mockResolvedValue({ PETR3: 48.63 });

    const resultado = await buscarDadosInicio();

    expect(resultado.patrimonioTotal).toBe(300);
    expect(resultado.totalRendaVariavel).toBe(145.89);
    expect(resultado.totalRendaFixa).toBe(154.11);
    expect(resultado.variacao).toBe(5.2);
  });
});
