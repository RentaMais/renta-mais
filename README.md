# Renta+

Aplicativo mobile de consolidação de carteira de investimentos, rastreamento
de proventos e simulação de rentabilidade multimercado.

## Visão Geral

- Público: investidores iniciantes e experientes que gerenciam ativos de
  renda fixa e renda variável manualmente.
- Funções principais: consolidação de patrimônio, rentabilidade mensal
  comparada a CDI e Ibovespa, fluxo de caixa de dividendos e JCP, simulador de
  aportes por décadas.
- Plataforma: mobile (iOS e Android).

## Stack Técnica

- Frontend: React Native com Expo (Expo Router), TypeScript
- Estilização: Tailwind CSS via NativeWind
- Gráficos: React Native Chart Kit
- Banco de dados e autenticação: Supabase (PostgreSQL + Supabase Auth)
- Cotações: API brapi.dev (modo demo com dados simulados quando não
  configurada)

| Dependência   | Versão   |
| ------------- | -------- |
| Node.js       | 20.19.0  |
| Expo SDK      | 57       |
| React Native  | 0.86.3   |
| React         | 19.2.3   |
| TypeScript    | ~5.9     |

Versões fixas em `.nvmrc` e `package.json`. Não atualizar Expo SDK, React
Native ou React sem alinhar com o time antes, mudança de major costuma quebrar
dependências nativas.

## Arquitetura do Projeto

Repositório único (monorepo), sem separação entre frontend e backend. O
"backend" do projeto é o próprio Supabase: não há servidor de aplicação
próprio.

### Estrutura de pastas

```bash
renta-mais/
├── src/
│   ├── app/              # rotas (Expo Router, file-based)
│   │   ├── (auth)/       # login, cadastro, recuperação de senha
│   │   ├── (tabs)/       # dashboard, rentabilidade, proventos, simulador
│   │   └── adicionar-ativo.tsx
│   ├── components/       # componentes de UI reutilizáveis
│   ├── hooks/            # hooks compartilhados
│   ├── lib/              # clientes de serviço (ex.: supabase.ts)
│   ├── services/         # chamadas a Supabase e à API de cotações
│   └── types/            # tipos compartilhados do domínio
├── supabase/
│   ├── config.toml
│   └── migrations/       # schema SQL versionado
├── .env.example          # modelo de variáveis de ambiente
└── .github/workflows/    # CI
```

Esta é a estrutura padrão gerada pelo Expo SDK 57 ao usar Expo Router com
diretório `src/`. Novas telas entram em `src/app/`, seguindo o roteamento por
arquivo; lógica de domínio e chamadas a serviços ficam fora de `src/app/`.

### Telas

[Protótipo](www.figma.com) desenvolvido no Figa, as telas da aplicação cconsistem em:

1. Dashboard: patrimônio total, divisão da carteira, evolução patrimonial
2. Adicionar Ativo: formulário para renda fixa e renda variável
3. Rentabilidade Mensal: carteira vs. CDI e Ibovespa
4. Proventos: total recebido, DY médio, histórico mensal, proventos
   provisionados vs. pagos
5. Login (com recuperação de senha)
6. Cadastro
7. Simulador de Décadas: projeção de aportes em 3 cenários de risco

### Banco de dados

Três tabelas principais, todas com Row Level Security habilitada e filtradas
por `user_id`:

- `profiles`: dados do usuário autenticado
- `assets`: ativos da carteira (renda fixa ou variável)
- `earnings`: proventos (dividendos e JCP) associados a um ativo

Schema completo e versionado em `supabase/migrations/`.

### Ambiente de banco de dados

O projeto usa exclusivamente Supabase Cloud (não há Postgres local via
Docker neste momento). Há um projeto Supabase para desenvolvimento e outro
para produção; instruções de acesso estão no `DESENVOLVIMENTO.md`.

### Variáveis de ambiente

O arquivo `.env.example` na raiz do repositório lista todas as variáveis
necessárias para rodar o projeto (URL e chave pública do Supabase, token
opcional da brapi.dev). Copie-o para `.env` e preencha os valores antes de
rodar o app, mais detalhes no `DESENVOLVIMENTO.md`.

## Desenvolvimento

Instruções de setup, fluxo de Git e convenções do time estão em
[DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md).

## Licença

MIT. Veja [LICENSE](./LICENSE).
