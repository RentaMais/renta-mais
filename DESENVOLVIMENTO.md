# Guia de Desenvolvimento

Este documento assume que você nunca usou Git, TypeScript, Expo ou Tailwind
antes. Siga na ordem. Se travar em algum passo, pare e pergunte no grupo antes
de tentar contornar.

## 1. Instalar as ferramentas

Instale, nessa ordem:

1. **Git**: https://git-scm.com/downloads
2. **Node.js via nvm** (gerenciador de versões do Node, evita conflito de
   versão entre máquinas):
   - Linux/macOS: https://github.com/nvm-sh/nvm
   - Windows: use o **nvm-windows** — https://github.com/coreybutler/nvm-windows
3. **VS Code** (editor recomendado): https://code.visualstudio.com/
4. **Expo Go** no seu celular (Android/iOS), pela loja de aplicativos. É o
   app que abre o + durante o desenvolvimento, sem precisar compilar nada.

Depois de instalar o nvm, feche e reabra o terminal antes de continuar.

## 2. Criar ou clonar o repositório

Você vai receber um convite da organização no GitHub por email. Aceite o
convite antes de continuar.

### Se o repositório ainda não existe (primeira pessoa a configurar)

1. No site do GitHub, dentro da organização, clique em **New repository**.
2. Nome: `renta-mais`. Visibilidade: a critério do time.
3. **Não** marque para adicionar README, `.gitignore` ou LICENSE — o projeto
   já traz esses arquivos prontos, marcar geraria conflito no primeiro push.
4. Extraia os arquivos do projeto numa pasta local e rode:

   ```bash
   cd renta-mais
   git init
   git branch -M main
   git add .
   git commit -m "estrutura inicial do projeto"
   git remote add origin https://github.com/RentaMais/renta-mais.git
   git push -u origin main
   ```

5. Crie a branch `dev` a partir da `main` recém-enviada:

   ```bash
   git checkout -b dev
   git push -u origin dev
   ```

6. No GitHub, em **Settings > Branches** do repositório, adicione regra de
   proteção para `main` e `dev` exigindo Pull Request antes de merge.

### Se o repositório já existe (as próximas pessoas)

```bash
git clone https://github.com/RentaMais/renta-mais
cd renta-mais
```

### Autenticação com o GitHub

O GitHub não aceita mais senha direta ao fazer `git push` por HTTPS. Duas
opções:

- **Mais simples:** instale o **GitHub CLI** (`gh`) e rode `gh auth login`
  uma vez; depois `git push` funciona sozinho.
- **Alternativa:** gere um **Personal Access Token** em
  `Settings > Developer settings > Personal access tokens` e use esse token
  no lugar da senha quando o Git pedir.

## 3. Instalar a versão correta do Node

Dentro da pasta do projeto:

```bash
nvm install
nvm use
```

Isso lê o arquivo `.nvmrc` e instala/usa exatamente a versão de Node que o
projeto espera. Confirme com:

```bash
node -v
```

Deve mostrar `v20.19.0`.

## 4. Instalar as dependências do projeto

```bash
npm install
```

Isso baixa tudo que está listado no `package.json`. Pode demorar alguns
minutos na primeira vez.

## 5. Configurar as variáveis de ambiente

O arquivo `.env.example`, na raiz do repositório, lista todas as variáveis
que o projeto precisa. Copie-o para `.env`:

```bash
cp .env.example .env
```

Abra o `.env` e preencha `EXPO_PUBLIC_SUPABASE_URL` e
`EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com os valores do projeto Supabase de
**desenvolvimento** (não o de produção). Esses valores serão compartilhados no
grupo do time — nunca peça a chave `service_role`, apenas a `publishable`.
`EXPO_PUBLIC_BRAPI_TOKEN` é opcional: sem ele, o app usa cotações simuladas.

O arquivo `.env` nunca deve ser commitado. Ele já está no `.gitignore`.

## 6. Rodar o projeto

```bash
npm start
```

Vai abrir um QR code no terminal. Abra o app **Expo Go** no celular e escaneie
o QR code (Android: opção de escanear dentro do próprio app; iOS: pela câmera
nativa). O celular precisa estar na mesma rede Wi-Fi que o computador.

Para rodar no navegador em vez do celular:

```bash
npm run web
```

## 7. Editor: extensões recomendadas (VS Code)

Instale estas extensões para ter autocomplete e formatação corretos:

- **ESLint** (dbaeumer.vscode-eslint)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **Expo Tools** (expo.vscode-expo-tools)

## Fluxo de Git

Nunca commite direto nas branches `main` ou `dev`. Ambas são protegidas.

### Branches

- `main`: reflete produção. Só recebe merge vindo de `dev`, quando uma versão
  está pronta para publicar.
- `dev`: branch de integração. Todo mundo trabalha a partir dela.
- `feature/nome-da-tarefa`: uma branch por tarefa, criada a partir de `dev`.

### Passo a passo para uma nova tarefa

1. Atualize sua `dev` local:

   ```bash
   git checkout dev
   git pull
   ```

2. Crie sua branch de trabalho:

   ```bash
   git checkout -b feature/tela-adicionar-ativo
   ```

   Use nomes descritivos: `feature/...` para funcionalidade nova,
   `fix/...` para correção de bug.

3. Trabalhe e commite em pedaços pequenos e frequentes:

   ```bash
   git add .
   git commit -m "adiciona formulário de renda fixa"
   ```

   Mensagens de commit em português, no imperativo, descrevendo o que foi
   feito.

4. Envie sua branch para o GitHub:

   ```bash
   git push -u origin feature/tela-adicionar-ativo
   ```

5. Abra um Pull Request no GitHub, da sua branch para `dev`. Peça para pelo
   menos uma outra pessoa do time revisar antes de aprovar o merge.

6. Depois do merge, apague a branch (o GitHub oferece um botão para isso na
   própria tela do Pull Request).

### Se der conflito

Se o Git avisar de conflito ao atualizar sua branch, não tente resolver
sozinho na primeira vez. Chame alguém do time para resolver junto.

## Convenções de código

- **Indentação**: 2 espaços, nunca tabs.
- **TypeScript**: evite `any`. Se não souber o tipo de algo, pergunte antes de
  usar `any` para "resolver rápido".
- **Componentes**: um componente por arquivo, nome do arquivo em
  PascalCase (`AssetCard.tsx`).
- **Estilização**: sempre via classes do Tailwind (NativeWind), nunca
  `StyleSheet.create` ou estilos inline, para manter consistência visual.
- **Rotas**: toda tela nova entra em `src/app/`, seguindo o padrão de pastas
  do Expo Router (arquivo = rota). Não criar telas fora dessa pasta.
- **Alias de import**: use `@/` para importar de dentro de `src/`, em vez de
  caminhos relativos longos (`../../../components/...`).

  ```ts
  import { AssetCard } from "@/components/AssetCard";
  ```

## Banco de dados (Supabase)

O projeto usa dois projetos Supabase separados:

- **Desenvolvimento**: todo o time usa o mesmo projeto de dev durante os
  testes. Dados podem ser apagados ou resetados sem aviso.
- **Produção**: usado apenas na versão publicada do app. Ninguém edita o
  schema de produção diretamente pelo dashboard.

### Alterando o schema (criando ou mudando uma tabela)

Alterações de schema são feitas por SQL versionado em
`supabase/migrations/`, nunca direto no dashboard do projeto de
desenvolvimento em caráter permanente (testes pontuais no SQL Editor são
aceitáveis, mas a alteração final precisa virar um arquivo de migration no
repositório, para que o time inteiro e a produção fiquem sincronizados).

1. Crie um novo arquivo em `supabase/migrations/`, seguindo o padrão de nome
   `AAAAMMDDHHMMSS_descricao.sql` (data e hora do momento da criação).
2. Escreva o SQL da alteração.
3. Rode contra o projeto de desenvolvimento (a CLI vai pedir para conectar ao
   projeto na primeira vez, com `npx supabase login` e
   `npx supabase link`):

   ```bash
   npm run db:push
   ```

4. Suba a migration junto com o resto do seu Pull Request.

Produção só recebe as migrations depois que a `dev` for mergeada em `main`.

## CI (verificação automática)

Todo Pull Request roda automaticamente lint e checagem de tipos do
TypeScript (veja `.github/workflows/ci.yml`). Um PR com CI vermelho não deve
ser mergeado antes de corrigir o problema apontado.
