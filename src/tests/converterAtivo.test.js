import { describe, expect, test } from "@jest/globals";
import {
  converterAtivo,
  montarDetalhesAtivo,
  resumirCarteira,
} from "@/utils/converterAtivo";

describe("converterAtivo", () => {
  test("converte ativo de renda variável e calcula variação", () => {
    const ativo = converterAtivo("1", {
      type: "variable",
      ticker: "PETR4",
      quantity: 10,
      averagePrice: 30,
      currentPrice: 33,
      totalInvested: 300,
      logoUrl: "https://brapi.dev/petr4.svg",
    });

    expect(ativo.tipo).toBe("renda_variavel");
    expect(ativo.valorAtual).toBe(330);
    expect(ativo.variacao).toBe("10,0");
    expect(ativo.imagem).toBe("https://brapi.dev/petr4.svg");
  });

  test("converte ativo de renda fixa formatando data e taxa", () => {
    const ativo = converterAtivo("2", {
      type: "fixed",
      name: "Tesouro Selic 2029",
      category: "Selic",
      rate: "100%",
      dueDate: "2029-03-01",
      totalInvested: 5000,
    });

    expect(ativo.tipo).toBe("renda_fixa");
    expect(ativo.taxa).toBe("100% Selic");
    expect(ativo.vencimento).toBe("01/03/2029");
    expect(ativo.totalInvestido).toBe(5000);
  });
});

describe("resumirCarteira e montarDetalhesAtivo", () => {
  test("separa variáveis e fixos e soma total investido", () => {
    const resumo = resumirCarteira([
      { id: "1", tipo: "renda_variavel", totalInvestido: 1200 },
      { id: "2", tipo: "renda_fixa", totalInvestido: 3800 },
    ]);

    expect(resumo.variaveis).toHaveLength(1);
    expect(resumo.fixos).toHaveLength(1);
    expect(resumo.totalInvestido).toBe(5000);
  });

  test("gera linhas de detalhe conforme o tipo do ativo", () => {
    const detalhesFixa = montarDetalhesAtivo({
      tipo: "renda_fixa",
      taxa: "110% CDI",
      vencimento: "10/10/2028",
      valorInicial: 2000,
    });

    expect(detalhesFixa).toHaveLength(3);
    expect(detalhesFixa[0]).toEqual({ rotulo: "Taxa", valor: "110% CDI" });
  });
});
