export type TipoAtivo = "renda_fixa" | "renda_variavel";

export type Asset = {
  id: string;
  user_id: string;
  ticker_nome: string;
  tipo: TipoAtivo;
  quantidade: number;
  preco_medio: number;
  data_compra: string;
};

export type TipoProvento = "dividendo" | "jcp";
export type StatusProvento = "pago" | "provisionado";

export type Earning = {
  id: string;
  user_id: string;
  asset_id: string;
  tipo: TipoProvento;
  valor_por_acao: number;
  valor_total: number;
  data_pagamento: string;
  status: StatusProvento;
};
