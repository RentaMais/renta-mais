# Guia de Desenvolvimento

Este documento descreve a configuração do ambiente, a organização do código e o fluxo de trabalho da equipa. Pressupõe-se que os integrantes não tenham experiência prévia com Git, TypeScript, Expo ou Tailwind. As etapas devem ser seguidas na ordem apresentada. Em caso de bloqueio, recomenda-se consultar a equipa antes de adotar soluções alternativas.

## 1. Ferramentas

Instalar, na ordem:

1. **Git:** https://git-scm.com/downloads
2. **Node.js 22** (mínimo 22.13), com o instalador oficial em https://nodejs.org/en/download. Selecionar a versão 22.x, de modo que toda a equipa utilize a mesma versão principal. O npm acompanha o Node.js.
3. **Editor de código.** Recomenda-se o VS Code: https://code.visualstudio.com/
4. **Expo Go** no telemóvel (Android/iOS). Aplicação que executa o RentaMais durante o desenvolvimento, sem necessidade de compilação.
5. **Conta gratuita no Expo** (https://expo.dev/signup). O Expo Go exige login na mesma conta na aplicação e no terminal para abrir projetos em desenvolvimento (secção 2.5).

Após instalar o Node.js, o terminal deve ser fechado e reaberto. No Windows, recomenda-se utilizar o PowerShell.

Extensões recomendadas do VS Code:

- ESLint (`dbaeumer.vscode-eslint`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- Expo Tools (`expo.vscode-expo-tools`)

---

## 2. Configuração do ambiente local

### 2.1 Clonagem

Após aceitar o convite recebido por e-mail:

```bash
git clone [https://github.com/](https://github.com/)<organizacao>/renta-mais
cd renta-mais
```

### 2.2 Verificação do Node

```bash
node -v   # deve exibir v22.13 ou superior
npm -v
```

O projeto bloqueia a instalação de dependências em versões incompatíveis do Node (`engine-strict`). Caso a versão seja inferior a 22.13, reinstalar conforme a secção 1.

### 2.3 Dependências

```bash
npm install
```

A primeira execução pode levar alguns minutos.

> **Versões do Expo.** Expo SDK, React Native e React não devem ser atualizados sem alinhamento com a equipa. Para adicionar bibliotecas, utilizar `npx expo install <pacote>`, que seleciona a versão compatível com o SDK. Se ocorrerem erros inesperados após o `npm install`, executar `npx expo install --check` e aceitar os ajustes sugeridos.

### 2.4 Variáveis de ambiente

```bash
cp .env.example .env
code .env   # ou abrir o ficheiro noutro editor
```

Preencher com os valores do projeto de **dev** partilhados pela equipa. A variável `EXPO_PUBLIC_BRAPI_TOKEN` é opcional: sem ela, a app utiliza cotações simuladas.

Regras:

- O `.env` nunca deve ser versionado.
- Variáveis iniciadas por `EXPO_PUBLIC_` são embutidas na aplicação e podem ser lidas por qualquer pessoa que a possua. Por isso, apenas chaves públicas (`publishable`) são permitidas; `service_role` é proibida.

Após alterar o `.env`, reiniciar o servidor com `npx expo start -c`.

### 2.5 Execução

```bash
npm start
```

Na primeira execução, autenticar o terminal na conta do Expo:

```bash
npx expo login
```

No Expo Go, entrar com a mesma conta (separador Home, ícone do perfil no canto superior direito). A aplicação informa quando falta o login num dos lados.

O código QR exibido deve ser lido pelo Expo Go (Android: dentro da própria aplicação; iOS: pela câmara nativa). O telemóvel e o computador precisam de estar na mesma rede Wi-Fi. Para execução no navegador: `npm run web`.

---

## 3. Comandos do projeto

Os comandos são definidos na secção `scripts` do `package.json`. O próprio npm cumpre o papel de executor de tarefas, sem ferramentas adicionais.

| Comando | Função |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento (Expo) |
| `npm run android` | Executa no emulador/dispositivo Android |
| `npm run ios` | Executa no emulador/dispositivo iOS |
| `npm run web` | Executa no navegador |
| `npm run lint` | Análise estática de erros no código (ESLint) |
| `npm run format` | Padroniza a formatação do código fonte (`src/`) utilizando Prettier |
| `npm run typecheck` | Verificação estrita de tipos (TypeScript) |
| `npm test` | Testes automatizados (Jest) |
| `npm run check` | Executa lint, typecheck e testes em sequência (ideal antes de um commit) |
| `npm run db:push` | Aplica as migrations ao projeto Supabase de dev |
| `npm run db:diff` | Gera uma nova migration baseada nas alterações da base de dados local |
| `npm run db:types` | Regenera `src/types/database.ts` a partir da base de dados (obrigatório após push/diff) |

---

## 4. Organização do código

### 4.1 Princípio

Cada parte do código possui uma única responsabilidade, e o fluxo de informação ocorre num só sentido:

```
Ecrã  →  Hook  →  Service  →  Supabase / brapi
```

| Camada | Local | Responsabilidade | Não deve |
| --- | --- | --- | --- |
| **Ecrã** | `src/app/` | Layout (JSX + Tailwind) | Aceder ao Supabase diretamente |
| **Hook** | `src/features/<x>/hooks/` | Fornecer dados, loading e erro ao ecrã | Conter layout |
| **Service** | `src/features/<x>/services/` | Funções que acedem ao Supabase ou brapi | Depender de React |
| **Utils** | `src/features/<x>/utils/` | Cálculos puros (preço médio, rentabilidade, simulador) | Aceder à rede ou base de dados |

Motivo: cálculos misturados ao layout não podem ser testados nem reutilizados. Isolados, tornam-se funções simples de entrada e saída.

### 4.2 Estrutura de pastas

```
renta-mais/
├── src/
│   ├── app/                       # Apenas rotas (Expo Router: ficheiro = ecrã)
│   │   ├── _layout.tsx            # providers e proteção de rotas
│   │   ├── (auth)/                # login, registo, esqueci-palavra-passe
│   │   ├── (tabs)/                # index, ativos, rentabilidade, proventos, simulador
│   │   ├── ativo/                 # novo.tsx, [id].tsx (detalhe, venda/resgate)
│   │   └── configuracoes/         # index, editar-perfil, alterar-palavra-passe, ajuda
│   ├── components/                # Button, Input, Card, Screen (uso partilhado)
│   ├── lib/
│   │   ├── supabase.ts            # cliente do Supabase
│   │   ├── brapi.ts               # cliente da brapi
│   │   ├── fontes.ts              # fontes carregadas na app (Lora e Manrope)
│   │   └── queryClient.ts         # configuração do React Query
│   ├── constants/                 # textos e valores fixos
│   └── types/
│       └── database.ts            # GERADO pelo Supabase; não editar manualmente
├── supabase/
│   ├── config.toml
│   └── migrations/                # SQL versionado
├── .env.example
└── .github/workflows/ci.yml
```

As pastas devem ser criadas conforme a necessidade, quando o primeiro ecrã que as utilize for implementado.

### 4.3 Regras da equipa

1. `src/app/` contém apenas ecrãs; a lógica pertence a `features/`.
2. Uma feature não importa de outra. Código comum a duas features sobe para `components/` ou `lib/`. A regra reduz acoplamento e conflitos no Git.
3. Ecrãs nunca importam `supabase`; apenas services o fazem.
4. Validações de formulário ficam em `schemas.ts` (zod). Os cenários alternativos dos casos de uso (palavra-passe curta, ticker vazio, vencimento no passado) tornam-se regras desse ficheiro.
5. Cálculos ficam em `utils/` e recebem todos os dados por parâmetro.

### 4.4 Correspondência entre casos de uso e código

| Casos de uso | Ecrãs | Feature |
| --- | --- | --- |
| UC01, 02, 03, 15 | `(auth)/*`, saída da conta | `auth` |
| UC04 | `(tabs)/index` | `ativos` + `proventos` (dados) |
| UC05, 06, 07, 16, 17 | `(tabs)/ativos`, `ativo/novo`, `ativo/[id]` | `ativos` |
| UC08 | `(tabs)/rentabilidade` | `rentabilidade` |
| UC09 | `(tabs)/proventos` | `proventos` |
| UC10 | `(tabs)/simulador` | `simulador` |
| UC11, 12, 13, 14, 18 | `configuracoes/*` | `auth` |

---

## 5. Implementação de uma funcionalidade

Exemplo: listagem de ativos (UC05), utilizável como modelo para as demais. O nome da tabela (`assets`) deve seguir a migration em `supabase/migrations/`.

**Passo 1. Service** (`src/features/ativos/services/ativosService.ts`)

```ts
import { supabase } from "@/lib/supabase";

export async function listarAtivos() {
  const { data, error } = await supabase.from("assets").select("*");
  if (error) throw error;
  return data;
}
```

**Passo 2. Hook** (`src/features/ativos/hooks/useAtivos.ts`)

```ts
import { useQuery } from "@tanstack/react-query";
import { listarAtivos } from "../services/ativosService";

export function useAtivos() {
  return useQuery({ queryKey: ["ativos"], queryFn: listarAtivos });
}
```

**Passo 3. Ecrã** (`src/app/(tabs)/ativos.tsx`)

```tsx
import { Text, View } from "react-native";
import { useAtivos } from "@/features/ativos/hooks/useAtivos";

export default function AtivosScreen() {
  const { data, isLoading, error } = useAtivos();

  if (isLoading) return <Text>A carregar...</Text>;
  if (error) return <Text>Não foi possível carregar os ativos.</Text>;
  if (!data?.length) return <Text>Nenhum ativo encontrado.</Text>;

  return (
    <View className="flex-1 bg-fundo p-4">
      {data.map((ativo) => (
        <Text className="text-texto" key="{ativo.id}">
          {ativo.ticker}
        </Text>
      ))}
    </View>
  );
}
```

O ecrã cobre os cenários do caso de uso: carregamento, erro e lista vazia (cenário alternativo do UC05).

**Checklist para qualquer funcionalidade**

1. Ler o caso de uso e listar os cenários típico e alternativos.
2. Verificar se há necessidade de tabela ou coluna nova; em caso positivo, criar a migration primeiro (secção 6).
3. Implementar service, hook e ecrã, nessa ordem.
4. Em formulários, escrever o `schemas.ts` com as validações dos cenários alternativos.
5. Testar no Expo Go o caminho feliz e cada cenário alternativo.
6. Executar `npm run check`.

---

## 6. Base de dados (Supabase)

Dois projetos independentes:

- **Desenvolvimento:** partilhado por toda a equipa durante os testes. Os dados podem ser apagados sem aviso.
- **Produção:** utilizado apenas pela versão publicada. O schema não é editado diretamente pelo dashboard.

### 6.1 Alteração do schema

Toda a mudança deve virar um ficheiro SQL em `supabase/migrations/`, mantendo a equipa e a produção sincronizadas. Testes pontuais no SQL Editor são aceitáveis, mas o resultado final precisa de ser registado como migration.

1. Criar o ficheiro `supabase/migrations/AAAAMMDDHHMMSS_descricao.sql` (data e hora atuais), por exemplo `supabase/migrations/20260925143000_adiciona_delete_after.sql`.
2. Escrever o SQL da alteração.
3. Na primeira utilização, ligar a CLI ao projeto de dev:

   ```bash
   npx supabase login
   npx supabase link
   ```

4. Aplicar a migration:

   ```bash
   npm run db:push
   ```

5. Regenerar os tipos (obrigatório após qualquer alteração):

   ```bash
   npm run db:types
   ```

6. Incluir a migration e o `database.ts` no mesmo Pull Request.

Antes de criar uma migration, a equipa deve ser avisada para evitar alterações simultâneas na mesma tabela.

### 6.2 Segurança (RLS)

Toda a tabela exige Row Level Security ativada e policy `user_id = auth.uid()`. Sem isso, qualquer utilizador autenticado acede aos dados dos demais.

Sintoma típico de RLS mal configurada: a consulta retorna lista **vazia**, sem erro. Antes de rever o código, verificar se há utilizador autenticado e se a policy existe.

### 6.3 Valores calculados

Preço médio e lucro realizado devem ser **calculados** a partir do histórico de compras e vendas (função em `utils/`), e não armazenados em colunas. Dados duplicados tendem a ficar dessincronizados.

Para viabilizar esse cálculo, o histórico é mantido numa tabela `transactions` (compra, venda, resgate), vinculada a `assets`.

### 6.4 Exclusão de conta (UC18)

O cliente (app) não consegue remover um utilizador do Supabase Auth. A remoção definitiva exige uma **Edge Function** com a chave `service_role`, mantida apenas no servidor do Supabase. Para o âmbito da disciplina, uma alternativa simples é a coluna `delete_after` em `profiles`, registando a exclusão agendada, conforme descrito no caso de uso. A decisão deve ser tomada cedo.

---

## 7. Cotações (brapi)

- A brapi fornece a cotação de um ticker e valida a sua existência (cenário alternativo "ticker inválido" do UC06).
- O cliente fica em `src/lib/brapi.ts`; as funções que o utilizam ficam em `features/ativos/services/`.
- O token é lido de `EXPO_PUBLIC_BRAPI_TOKEN`. Na ausência dele, devem ser usados dados simulados (modo demo), de modo que o desenvolvimento não seja bloqueado.
- Como o token é embutido na app, não deve ser utilizado token de plano pago nem associado a dados sensíveis. Para um trabalho académico, o risco é aceitável.
- As consultas devem ocorrer apenas quando necessárias (registo de ativo, abertura da carteira), nunca em ciclo. O React Query realiza cache; recomenda-se configurar `staleTime` de alguns minutos.

---

## 8. Fluxo de trabalho com Git

Commits diretos em `main` ou `dev` são proibidos; ambas são protegidas.

### 8.1 Branches

- `main`: produção. Recebe merge apenas de `dev`, quando há versão pronta.
- `dev`: integração. Todo o trabalho parte dela.
- `feature/nome-da-tarefa`: uma por tarefa, criada a partir de `dev`. Correções de bug utilizam `fix/nome`.

### 8.2 Procedimento para uma tarefa

1. Atualizar a `dev`:

   ```bash
   git checkout dev
   git pull
   ```

2. Criar a branch de trabalho:

   ```bash
   git checkout -b feature/ecra-ativos
   ```

3. Trabalhar e registar commits pequenos e frequentes:

   ```bash
   git add .
   git commit -m "feat: adiciona listagem de ativos"
   ```

   Mensagens em português, no imperativo, com prefixo a indicar o tipo: `feat:` (funcionalidade), `fix:` (correção), `docs:` (documentação), `refactor:` (reestruturação sem mudança de comportamento), `chore:` (configuração e manutenção).

4. Enviar a branch para o GitHub:

   ```bash
   git push -u origin feature/ecra-ativos
   ```

5. Abrir um **Pull Request** da branch para `dev`. A descrição deve informar o caso de uso implementado (ex.: "UC05") e como testar.
6. Solicitar revisão de pelo menos um integrante. O revisor deve executar o código localmente, e não apenas lê-lo.
7. Após o merge, apagar a branch (botão disponível no próprio Pull Request) e regressar ao passo 1.

### 8.3 Atualização da branch

Se a `dev` avançou durante o trabalho:

```bash
git checkout dev
git pull
git checkout feature/ecra-ativos
git merge dev
```

### 8.4 Conflitos

Em caso de conflito, a primeira resolução deve ser feita em conjunto com outro integrante. Para reduzir a ocorrência:

- Cada pessoa atua numa feature distinta (secção 9).
- Pull Requests pequenos e frequentes (menos de um dia de trabalho).
- Ficheiros partilhados (`package.json`, `_layout.tsx`, `tailwind.config.js`, `components/ui/`) são alterados em Pull Request separado, com aviso prévio à equipa.

### 8.5 Definição de pronto

Antes de abrir o Pull Request:

- [ ] `npm run check` sem erros
- [ ] Testado no Expo Go: caminho feliz e cenários alternativos
- [ ] Ausência de `console.log`, `.env` ou chaves secretas no diff
- [ ] Alterações de base de dados acompanhadas de migration e `database.ts` atualizado

Pull Requests com CI a falhar não devem ser alvo de merge.

### 8.6 Revisão de Pull Request

A revisão segue esta ordem: (1) funciona no telemóvel; (2) cobre os cenários do caso de uso; (3) respeita as regras da secção 4.3; (4) nomes claros. O revisor deve registar sugestões em comentários, sem reescrever o código do autor.

---

## 9. Divisão de trabalho sugerida

Cada integrante é responsável por uma feature, o que minimiza conflitos.

**Etapa 0, base** (em conjunto ou por uma pessoa, em Pull Requests pequenos):
`queryClient.ts`, `brapi.ts`, componentes básicos de `ui/` (Button, Input, Card, Screen), proteção de rotas no `_layout.tsx` (utilizador sem sessão é direcionado para o login) e revisão da migration inicial.

**Etapa 1, em paralelo:**

| Integrante | Feature | Casos de uso |
| --- | --- | --- |
| A | `auth` + `configuracoes` | UC01, 02, 03, 11, 12, 13, 14, 15, 18 |
| B | `ativos` (+ brapi) | UC05, 06, 07, 16, 17 |
| C | `simulador` e ecrãs de leitura (`index`, `rentabilidade`, `proventos`) | UC10, depois UC04, 08, 09 |

O simulador (UC10) não depende da base de dados, portanto pode ser iniciado imediatamente. Os ecrãs UC04, UC08 e UC09 dependem dos ativos registados: devem começar com dados de exemplo e migrar para dados reais quando a feature `ativos` estiver na `dev`.

**Etapa 2:** integração, cenários alternativos pendentes, ajustes visuais e documentação final.

---

## 10. Convenções de código

- **Indentação:** 2 espaços; tabs não são permitidos.
- **TypeScript:** evitar `any`. Em caso de dúvida sobre o tipo, consultar a equipa antes de o utilizar.
- **Componentes:** um por ficheiro, nome em PascalCase (`AssetCard.tsx`).
- **Estilização:** classes do Tailwind (NativeWind); evitar `StyleSheet.create` e estilos inline. Utilizar as cores do tema (tabela abaixo) em vez de hexadecimais avulsos.
- **Rotas:** todo o ecrã novo entra em `src/app/`.
- **Imports:** utilizar o alias `@/` em vez de caminhos relativos longos.

  ```ts
  import { Button } from "@/components/ui/Button";
  ```

- **Nomenclatura:** ficheiros e identificadores de domínio em português (`listarAtivos`, `ativosService`), em coerência com os casos de uso.

### Cores do tema

Definidas em `tailwind.config.js`. Cada nome representa um papel na interface; nomes diferentes podem apontar para a mesma cor, o que permite alterar um papel sem afetar os demais.

| Classe (`bg-`, `text-`, `border-`) | Cor | Uso | Alias |
| --- | --- | --- | --- |
| `primaria` | `#A8763E` | Botões, destaques e identidade | `marca` |
| `fundo` | `#F6F2E3` | Fundo dos ecrãs | |
| `container` | `#F6F2E3` | Contentores, cards e inputs | |
| `texto` | `#404E40` | Texto principal | `secundaria` |
| `subtexto` | `#404E40` a 80% | Subtítulos e textos secundários | `subtitulo` |
| `positivo` | `#7CB518` | Valorização e ganhos | `sucesso` |
| `negativo` | `#EF3054` | Desvalorização e perdas | `erro` |

Em código novo, preferir o nome da primeira coluna; `sucesso` e `erro` são indicados para mensagens de feedback em formulários. Exemplo:
`<Text className="text-positivo">+4,2%</Text>`.

### Fontes

Fonte principal: **Lora** (títulos). Fonte secundária: **Manrope** (interface). Ambas vêm do Google Fonts e são carregadas em `src/lib/fontes.ts`.

No React Native, cada peso é uma fonte distinta: `font-bold` não altera o peso de uma fonte personalizada. Por isso, o peso é escolhido pela classe de fonte:

| Classe | Fonte | Uso |
| --- | --- | --- |
| `font-titulo` | Lora Bold | Títulos |
| `font-titulo-regular` | Lora Regular | Destaques e valores grandes |
| `font-corpo` | Manrope Regular | Texto da interface |
| `font-corpo-medium` | Manrope Medium | Rótulos e botões |
| `font-corpo-bold` | Manrope Bold | Ênfase em textos da interface |

Todo o `<Text>` deve declarar uma destas classes; sem ela, a aplicação usa a fonte do sistema. Exemplo:
`<Text className="font-titulo text-texto text-2xl">Património</Text>`.

---

## 11. Problemas comuns

| Sintoma | Ação |
| --- | --- |
| Código QR não liga | Confirmar a mesma rede Wi-Fi; se a rede bloquear, `npx expo start --tunnel` |
| `.env` alterado sem efeito | `npx expo start -c` (limpa a cache e reinicia) |
| Classes do Tailwind não aplicadas | Verificar se `global.css` é importado em `src/app/_layout.tsx` e se o ficheiro está coberto por `content` em `tailwind.config.js`; reiniciar com `-c` |
| `Network request failed` | URL do Supabase incorreta ou sem `https://`; `.env` não preenchido |
| Lista vazia, sem erro | RLS: utilizador não autenticado ou policy ausente na tabela |
| Erro de tipo em tabela nova | Executar `npm run db:types` |
| Erros estranhos após `npm install` | `npx expo install --check`; persistindo, remover `node_modules` e reinstalar |
| `npm install` falha com `EBADENGINE` | Node abaixo de 22.13: reinstalar o Node 22.x e reabrir o terminal |
| Expo Go pede login ou não abre o projeto | Executar `npx expo login` e entrar na mesma conta no Expo Go |
| Código QR liga em casa, mas não no Windows | Permitir o Node.js em redes privadas quando a Firewall do Windows solicitar |
| Git recusa o push | Verificar autenticação (`gh auth login` ou token) e se o push não é direto em `main`/`dev` |