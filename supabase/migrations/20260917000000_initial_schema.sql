-- Renta+ schema inicial
-- Tabelas: profiles, assets, earnings
-- Row Level Security habilitada em todas: cada usuario so acessa seus proprios dados.

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  criado_em timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles: usuario le o proprio perfil"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: usuario atualiza o proprio perfil"
  on profiles for update
  using (auth.uid() = id);


create type tipo_ativo as enum ('renda_fixa', 'renda_variavel');

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ticker_nome text not null,
  tipo tipo_ativo not null,
  quantidade numeric not null,
  preco_medio numeric not null,
  data_compra date not null,
  criado_em timestamptz not null default now()
);

create index if not exists assets_user_id_idx on assets (user_id);

alter table assets enable row level security;

create policy "assets: usuario gerencia os proprios ativos"
  on assets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


create type tipo_provento as enum ('dividendo', 'jcp');
create type status_provento as enum ('pago', 'provisionado');

create table if not exists earnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  asset_id uuid not null references assets (id) on delete cascade,
  tipo tipo_provento not null,
  valor_por_acao numeric not null,
  valor_total numeric not null,
  data_pagamento date not null,
  status status_provento not null default 'provisionado',
  criado_em timestamptz not null default now()
);

create index if not exists earnings_user_id_idx on earnings (user_id);
create index if not exists earnings_asset_id_idx on earnings (asset_id);

alter table earnings enable row level security;

create policy "earnings: usuario gerencia os proprios proventos"
  on earnings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
