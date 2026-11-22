import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { listarAtivos } from "@/services/ativosService";
import { buscarCotacoesAtuais } from "@/services/cotacoesService";
import { buscarDadosRentabilidade } from "@/services/rentabilidadeService";
import { buscarDadosInicio } from "@/services/inicioService";

jest.mock("@/services/ativosService", () => ({
  listarAtivos: jest.fn(),
}));

jest.mock("@/services/cotacoesService", () => ({
  buscarCotacoesAtuais: jest.fn(),
}));

jest.mock("@/services/rentabilidadeService", () => ({
  buscarDadosRentabilidade: jest.fn(),
}));

describe("buscarDadosInicio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calcula patrimônio a mercado, divisão da carteira e evolução", async () => {
    listarAtivos.mockResolvedValue([
      {
        tipo: "renda_variavel",
        ticker: "PETR3",
        quantidade: 3,
        precoMedio: 35,
        precoAtual: 48.63,
      },
      {
        tipo: "renda_fixa",
        nome: "Tesouro Selic",
        valorInicial: 154.11,
      },
    ]);
    buscarCotacoesAtuais.mockResolvedValue({ PETR3: 48.63 });
    buscarDadosRentabilidade.mockResolvedValue({
      meses: [{ mes: "Nov", carteira: 5.2 }],
    });

    const resultado = await buscarDadosInicio();

    expect(resultado.patrimonioTotal).toBe(300);
    expect(resultado.variacao).toBe(5.2);
    expect(resultado.divisao).toEqual([
      { name: "Renda variável", valor: 49 },
      { name: "Renda fixa", valor: 51 },
    ]);
    expect(resultado.evolucao.labels).toEqual(["Nov"]);
    expect(resultado.evolucao.datasets[0].data).toEqual([300]);
  });
});
