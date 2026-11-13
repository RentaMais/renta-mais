# Guia de Desenvolvimento

Este documento descreve a configuração do ambiente, a organização do código e o fluxo de trabalho da equipe. Assume-se que os integrantes não tenham experiência prévia com Git, React Native, Expo ou Tailwind. As etapas devem ser seguidas na ordem apresentada. Se houver algum bloqueio, consulte a equipe antes de adotar soluções alternativas.

## 1. Ferramentas

Instalar, na ordem:

1. **Git:** [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. **Node.js 22** (mínimo 22.13), com o instalador oficial em [https://nodejs.org/en/download](https://nodejs.org/en/download). Selecione a versão 22.x, para que toda a equipe use a mesma versão principal. O npm vem junto com o Node.js.
3. **Editor de código.** Recomendamos o VS Code: [https://code.visualstudio.com/](https://code.visualstudio.com/)
4. **Expo Go** no celular (Android/iOS). É o aplicativo que executa o RentaMais durante o desenvolvimento, sem necessidade de compilação.
5. **Conta gratuita no Expo** ([https://expo.dev/signup](https://expo.dev/signup)). O Expo Go exige login na mesma conta tanto no aplicativo quanto no terminal para abrir projetos em desenvolvimento (seção 2.5).

Depois de instalar o Node.js, feche e reabra o terminal. No Windows, recomendamos usar o PowerShell.

Extensões recomendadas do VS Code:

* ESLint (`dbaeumer.vscode-eslint`)
* Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
* Expo Tools (`expo.vscode-expo-tools`)

## 2. Configuração do ambiente local

### 2.1 Clonagem

Depois de aceitar o convite recebido por e-mail:

```bash
git clone https://github.com/RentaMais/renta-mais
cd renta-mais
```

### 2.2 Verificação do Node

```bash
node -v   # deve exibir v22.13 ou superior
npm -v
```

O projeto bloqueia a instalação de dependências em versões incompatíveis do Node (`engine-strict`). Se a versão for inferior a 22.13, reinstale conforme a seção 1.

### 2.3 Dependências

```bash
npm install
```

A primeira execução pode levar alguns minutos.

> **Versões do Expo e Firebase.** O Expo SDK, o React Native, o React e o Firebase (`v11`) não devem ser atualizados sem alinhamento com a equipe (a versão 12+ do Firebase exige Node 24). Para adicionar bibliotecas, use `npx expo install <pacote>`, que seleciona a versão compatível com o SDK. Se aparecerem erros inesperados depois do `npm install`, execute `npx expo install --check` e aceite os ajustes sugeridos.

### 2.4 Variáveis de ambiente

```bash
cp .env.example .env
code .env   # ou abra no editor
```

Preencha com os valores do projeto compartilhado pela equipe no Firebase Console (**Configurações do projeto > Seus apps > app Web**). A variável `EXPO_PUBLIC_BRAPI_TOKEN` é opcional: sem ela, o aplicativo usa cotações simuladas.

Regras:

* O `.env` nunca deve ser versionado.
* Variáveis iniciadas por `EXPO_PUBLIC_` ficam embutidas no aplicativo e apenas identificam o projeto no Firebase; quem protege os dados são as regras de segurança (`firestore.rules`). Arquivos de conta de serviço (`*.json` do Admin SDK) nunca devem ser versionados nem compartilhados.

Depois de alterar o `.env`, reinicie o servidor com `npx expo start -c`.

### 2.5 Execução

```bash
npm start
```

Na primeira execução, autentique o terminal na conta do Expo:

```bash
npx expo login
```

No Expo Go, entre com a mesma conta (aba Home, ícone do perfil no canto superior direito). O aplicativo avisa quando falta o login em um dos lados.

O QR code exibido deve ser lido pelo Expo Go (Android: dentro do próprio aplicativo; iOS: pela câmera nativa). O celular e o computador precisam estar na mesma rede Wi-Fi. Para executar no navegador: `npm run web`.

## 3. Comandos do projeto

Os comandos são definidos na seção `scripts` do `package.json`. O próprio npm faz o papel de executor de tarefas, sem ferramentas adicionais.

| Comando | Função |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento (Expo) |
| `npm run android` | Executa no emulador/dispositivo Android |
| `npm run ios` | Executa no emulador/dispositivo iOS |
| `npm run web` | Executa no navegador |
| `npm run lint` | Análise estática de erros no código (ESLint) |
| `npm run format` | Padroniza a formatação do código-fonte (`src/`) com Prettier |
| `npm test` | Testes automatizados (Jest). O `jest.config.js` fica na raiz |
| `npm run check` | Executa `lint` e `test` em sequência (ideal antes de um commit) |

## 4. Organização do código

### 4.1 Princípio

Cada parte do código tem uma única responsabilidade, e a informação flui em uma única direção:

```text
Tela  →  Service  →  Firebase / brapi
```

| Camada | Local | Responsabilidade | Não deve |
| --- | --- | --- | --- |
| **Tela** | `src/app/` | Layout (JSX + Tailwind) e chamada de services via React Query | Acessar o Firebase diretamente sem passar por um service |
| **Service** | `src/services/` | Funções que acessam o Firebase (Auth/Firestore) ou a brapi | Conter layout |
| **Utils** | `src/utils/` | Cálculos puros (preço médio, rentabilidade, simulador) | Acessar rede ou banco de dados |

Motivo: cálculos misturados ao layout não podem ser testados nem reutilizados. Isolados, tornam-se funções simples de entrada e saída.

### 4.2 Estrutura de pastas

```text
renta-mais/
├── src/
│   ├── app/                       # Apenas rotas (Expo Router)
│   │   ├── _layout.jsx            # providers e proteção de rotas
│   │   ├── (auth)/                # login, cadastro, esqueci-senha
│   │   ├── (tabs)/                # index, ativos, rentabilidade, proventos, simulador
│   │   ├── ativos/                # novo.jsx, [id].jsx, operacao.jsx
│   │   └── configuracoes/         # index, editar-perfil, alterar-senha, excluir-conta, central
│   ├── components/                # Componentes compartilhados (Button, Input, Card, Screen)
│   ├── services/                  # firebase.js, brapi.js e funções de acesso
│   ├── utils/                     # Funções de cálculo e utilidades puras
│   └── fontes.js                  # Fontes carregadas no app (Lora e Manrope)
├── firestore.rules                # Regras de segurança do Firestore
├── jest.config.js                 # Configuração do Jest
├── .env.example
└── .github/workflows/ci.yml
```

As pastas devem ser criadas conforme a necessidade, quando a primeira tela que as utilize for implementada.

### 4.3 Regras da equipe

1. `src/app/` contém as telas.
2. Telas nunca importam `firebase.js` diretamente; apenas os services o fazem.
3. Cálculos ficam em `utils/` e recebem todos os dados por parâmetro.
4. Testes ficam ao lado do arquivo testado, com sufixo `.test.js` (`precoMedio.js` → `precoMedio.test.js`). Somente testes que atravessam o projeto inteiro vão para uma pasta `tests/` na raiz (ver seção 4.5).

### 4.4 Correspondência entre casos de uso e código

| Casos de uso | Telas |
| --- | --- |
| UC01, 02, 03, 15 | `(auth)/*`, saída da conta |
| UC04 | `(tabs)/index` |
| UC05, 06, 07, 16, 17 | `(tabs)/ativos`, `ativos/novo`, `ativos/[id]`, `ativos/operacao` |
| UC08 | `(tabs)/rentabilidade` |
| UC09 | `(tabs)/proventos` |
| UC10 | `(tabs)/simulador` |
| UC11, 12, 13, 14, 18 | `configuracoes/*` |

### 4.5 Testes

O projeto usa **Jest** com o preset **jest-expo**, já configurado em `jest.config.js` na raiz. Não é preciso editar esse arquivo no dia a dia — apenas rodar os testes.

#### Onde colocar os testes

**Colocalizados**, ao lado do arquivo testado, com sufixo `.test.js`:

```text
src/
└── utils/
    ├── precoMedio.js
    ├── precoMedio.test.js
    ├── rentabilidade.js
    └── rentabilidade.test.js
```

Motivos: encontrar o teste do arquivo é imediato; ao renomear ou mover o arquivo, o teste vai junto (evita arquivos órfãos); é o padrão da comunidade React Native. **Somente testes que atravessam o projeto inteiro** (integração, e2e) vão para uma pasta `tests/` na raiz — e ainda não temos nenhum caso desses.

#### O que testar

Foco em `src/utils/`. São funções puras: recebem dados por parâmetro e devolvem um valor, sem rede nem banco de dados. Exemplos:

- `calcularPrecoMedio(compras)` — preço médio ponderado.
- `calcularRentabilidade(valorInicial, valorFinal)` — variação percentual.
- `simularAportes(aporteMensal, anos, taxaAnual)` — projeção do simulador.
- Validações de formulário em `src/utils/validacoes.js`.

**Não** testamos nesta fase: telas em `src/app/`, componentes puramente visuais, chamadas ao Firebase. Isso fica para quando o projeto tiver testes de integração.

#### Como escrever o primeiro teste

Exemplo concreto para `src/utils/precoMedio.js`:

```js
// src/utils/precoMedio.js
// Calcula o preço médio a partir de uma lista de compras.
// Cada compra: { quantidade: number, precoUnitario: number }
export function calcularPrecoMedio(compras) {
  if (!compras?.length) return 0;
  const totalCusto = compras.reduce(
    (soma, c) => soma + c.quantidade * c.precoUnitario,
    0,
  );
  const totalQuantidade = compras.reduce((soma, c) => soma + c.quantidade, 0);
  return totalQuantidade === 0 ? 0 : totalCusto / totalQuantidade;
}
```

Teste correspondente, ao lado do arquivo:

```js
// src/utils/precoMedio.test.js
import { calcularPrecoMedio } from "./precoMedio";

describe("calcularPrecoMedio", () => {
  test("retorna 0 para lista vazia ou indefinida", () => {
    expect(calcularPrecoMedio([])).toBe(0);
    expect(calcularPrecoMedio(undefined)).toBe(0);
  });

  test("calcula a média ponderada por quantidade", () => {
    const compras = [
      { quantidade: 100, precoUnitario: 10 },
      { quantidade: 100, precoUnitario: 20 },
    ];
    expect(calcularPrecoMedio(compras)).toBe(15);
  });

  test("pondera corretamente quando as quantidades são diferentes", () => {
    const compras = [
      { quantidade: 50, precoUnitario: 10 },
      { quantidade: 150, precoUnitario: 20 },
    ];
    // (50*10 + 150*20) / 200 = 17.5
    expect(calcularPrecoMedio(compras)).toBe(17.5);
  });
});
```

Para rodar apenas esse arquivo durante o desenvolvimento:

```bash
npx jest src/utils/precoMedio.test.js
```

#### Convenções

- Um arquivo de teste por arquivo testado, ao lado dele.
- `describe("nomeDaFuncao", ...)` agrupando os casos.
- Um `test("frase curta descrevendo o cenário", ...)` por caso.
- Cobrir o caminho feliz **e** os cenários alternativos (entrada vazia, valor nulo, zero).
- Nomes em português, no imperativo, como o resto do código.

## 5. Implementação de uma funcionalidade

Exemplo: listagem de ativos (UC05), utilizável como modelo para as demais. Os nomes das subcoleções seguem a estrutura definida na seção 6.1.

**Passo 1. Service** (`src/services/ativosService.js`)

```js
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/services/firebase";

export async function listarAtivos() {
  const usuario = auth.currentUser;
  if (!usuario) throw new Error("Usuário não autenticado.");

  const ref = collection(db, "usuarios", usuario.uid, "ativos");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
```

**Passo 2. Tela** (`src/app/(tabs)/ativos.jsx`)

```jsx
import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { listarAtivos } from "@/services/ativosService";

export default function AtivosScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ativos"],
    queryFn: listarAtivos,
  });

  if (isLoading) return <Text>Carregando...</Text>;
  if (error) return <Text>Não foi possível carregar os ativos.</Text>;
  if (!data?.length) return <Text>Nenhum ativo encontrado.</Text>;

  return (
    <View className="flex-1 bg-fundo p-4">
      {data.map((ativo) => (
        <Text className="text-texto" key={ativo.id}>
          {ativo.ticker}
        </Text>
      ))}
    </View>
  );
}
```

Quando o mesmo acesso a dados for usado em mais de uma tela, extraia a chamada para um `useXxx` em `src/services/` ou em uma pasta `src/hooks/` criada sob demanda (não é obrigatório começar com ela).

A tela cobre os cenários do caso de uso: carregamento, erro e lista vazia (cenário alternativo do UC05).

**Checklist para qualquer funcionalidade**

1. Ler o caso de uso e listar os cenários típico e alternativos.
2. Verificar se há necessidade de nova subcoleção ou campo no Firestore; se houver, alinhar com a equipe e atualizar `firestore.rules` caso necessário (seção 6).
3. Implementar o service e a tela.
4. Em formulários, escrever as validações dos cenários alternativos.
5. Se houver cálculo puro, extrair para `src/utils/` e escrever um teste ao lado (seção 4.5).
6. Testar no Expo Go o caminho feliz e cada cenário alternativo.
7. Executar `npm run check`.

## 6. Banco de dados e autenticação (Firebase)

O projeto utiliza um único projeto Firebase, compartilhado por toda a equipe, no plano gratuito (Spark). Os dados podem ser apagados sem aviso durante os testes.

* **Authentication:** login com e-mail e senha.
* **Firestore:** banco de documentos (NoSQL) com os dados de cada usuário.

O cliente é criado em `src/services/firebase.js`, que exporta `auth` e `db`. Telas não importam esse arquivo diretamente; apenas os services o fazem.

### 6.1 Estrutura dos dados

Todos os dados ficam dentro do documento do usuário, identificado pelo `uid` do Authentication:

```text
usuarios/{uid}                nome, email, criadoEm
├── ativos/{id}               tipo, ticker, nome, indexador, taxa, vencimento
├── transacoes/{id}           ativoId, tipo (compra | venda | resgate), quantidade, preco, data
└── proventos/{id}            ativoId, valor, data, status (pago | provisionado)
```

O Firestore não possui migrations: coleções e campos passam a existir quando o primeiro documento é gravado. Mudanças na estrutura devem ser combinadas com a equipe e registradas nesta seção. Documentos antigos não são atualizados automaticamente.

### 6.2 Segurança (`firestore.rules`)

As regras ficam em `firestore.rules` na raiz do projeto: cada usuário lê e grava somente em `usuarios/{seu uid}` e nas subcoleções. Para publicar uma alteração:

1. Abrir **Firebase Console > Firestore Database > Regras**.
2. Colar o conteúdo de `firestore.rules` e selecionar **Publicar**.

Alterações nas regras entram no mesmo Pull Request do código que as exige.

Sintoma típico de regra bloqueando o acesso: `FirebaseError: Missing or insufficient permissions`. Verifique se há usuário autenticado e se o caminho começa em `usuarios/{uid}` com o `uid` do usuário logado.

### 6.3 Valores calculados

Preço médio e lucro realizado devem ser **calculados** a partir de `transacoes` (função em `src/utils/`), e não armazenados em campos. Dados duplicados tendem a ficar dessincronizados. As funções que os calculam ganham teste em `src/utils/*.test.js` (seção 4.5).

### 6.4 Casos de uso que dependem do Authentication

* **Recuperar senha (UC02):** `sendPasswordResetEmail`. O link do e-mail abre uma página do Firebase para definir a nova senha; o aplicativo não precisa de tela de redefinição.
* **Alterar senha (UC13):** `reauthenticateWithCredential` seguido de `updatePassword`.
* **Excluir conta (UC18):** `deleteUser` exige login recente, portanto a senha deve ser confirmada (`reauthenticateWithCredential`) antes. As subcoleções de `usuarios/{uid}` não são removidas automaticamente com o documento: devem ser apagadas pelo aplicativo antes de excluir o usuário.

## 7. Cotações (brapi)

* A brapi fornece a cotação de um ticker e valida sua existência (cenário alternativo "ticker inválido" do UC06).
* O cliente fica em `src/services/brapi.js`; as funções que o utilizam ficam em `src/services/`.
* O token é lido de `EXPO_PUBLIC_BRAPI_TOKEN`. Na ausência dele, devem ser usados dados simulados (modo demo), para que o desenvolvimento não seja bloqueado.
* Como o token fica embutido no app, não use token de plano pago nem associado a dados sensíveis. Para um trabalho acadêmico, o risco é aceitável.
* As consultas devem ocorrer apenas quando necessárias (registro de ativo, abertura da carteira), nunca em loop. O React Query faz cache; recomendamos configurar `staleTime` de alguns minutos.

## 8. Fluxo de trabalho com Git

Commits diretos em `main` ou `dev` são proibidos; ambas são protegidas.

### 8.1 Branches

* `main`: produção. Recebe merge apenas de `dev`, quando há versão pronta.
* `dev`: integração. Todo o trabalho parte dela.
* `feature/nome-da-tarefa`: uma por tarefa, criada a partir de `dev`. Correções de bug usam `fix/nome`.

### 8.2 Procedimento para uma tarefa

1. Atualize a `dev`:

```bash
git checkout dev
git pull
```

2. Crie a branch de trabalho:

```bash
git checkout -b feature/tela-ativos
```

3. Trabalhe e registre commits pequenos e frequentes:

```bash
git add .
git commit -m "feat: adiciona listagem de ativos"
```

Mensagens em português, no imperativo, com prefixo indicando o tipo: `feat:` (funcionalidade), `fix:` (correção), `docs:` (documentação), `refactor:` (reestruturação sem mudança de comportamento), `chore:` (configuração e manutenção).

4. Envie a branch para o GitHub:

```bash
git push -u origin feature/tela-ativos
```

5. Abra um **Pull Request** da branch para `dev`. A descrição deve informar o caso de uso implementado (ex.: "UC05") e como testar.
6. Peça revisão de pelo menos um integrante. O revisor deve executar o código localmente, e não apenas ler.
7. Depois do merge, exclua a branch (botão disponível no próprio Pull Request) e volte ao passo 1.

### 8.3 Atualização da branch

Se a `dev` avançou durante o trabalho:

```bash
git checkout dev
git pull
git checkout feature/tela-ativos
git merge dev
```

### 8.4 Conflitos

Em caso de conflito, a primeira resolução deve ser feita em conjunto com outro integrante. Para reduzir a ocorrência:

* Cada pessoa atua em uma área distinta.
* Pull Requests pequenos e frequentes (menos de um dia de trabalho).
* Arquivos compartilhados (`package.json`, `_layout.jsx`, `tailwind.config.js`, `components/`) são alterados em Pull Request separado, com aviso prévio à equipe.

### 8.5 Definição de pronto

Antes de abrir o Pull Request:

* [ ] `npm run check` sem erros (lint e testes)
* [ ] Se mexeu em `src/utils/`, rodou `npx jest src/utils/<arquivo>.test.js` localmente e o teste passa
* [ ] Testado no Expo Go: caminho feliz e cenários alternativos
* [ ] Ausência de `console.log`, `.env` ou chaves secretas no diff
* [ ] Alterações nas regras do Firestore acompanhadas de atualização em `firestore.rules`

Pull Requests com CI falhando não devem ser mergeados.

### 8.6 Revisão de Pull Request

A revisão segue esta ordem: (1) funciona no celular; (2) cobre os cenários do caso de uso; (3) respeita as regras da seção 4.3; (4) nomes claros. O revisor deve registrar sugestões em comentários, sem reescrever o código do autor.

## 9. Divisão de trabalho sugerida

**Etapa 0, base** (em conjunto ou por uma pessoa, em Pull Requests pequenos):
`queryClient.js`, `brapi.js`, componentes básicos de `components/` (Button, Input, Card, Screen), proteção de rotas no `_layout.jsx` (usuário sem sessão é direcionado para o login) e publicação inicial do `firestore.rules`.

**Etapa 1, em paralelo:**

| Integrante | Área / Foco | Casos de uso |
| --- | --- | --- |
| A | Autenticação e Configurações | UC01, 02, 03, 11, 12, 13, 14, 15, 18 |
| B | Ativos e Integração Brapi | UC05, 06, 07, 16, 17 |
| C | Simulador e Telas de Leitura | UC10, depois UC04, 08, 09 |

O simulador (UC10) não depende do banco de dados, portanto pode ser iniciado imediatamente. As telas UC04, UC08 e UC09 dependem dos ativos registrados: devem começar com dados de exemplo e migrar para dados reais quando os ativos estiverem na `dev`.

**Etapa 2:** integração, cenários alternativos pendentes, ajustes visuais e documentação final.

## 10. Convenções de código

* **Indentação:** 2 espaços; tabs não são permitidos.
* **JavaScript:** usar `const`/`let` (nunca `var`), operador `===` e async/await. Não é TypeScript.
* **Componentes:** um por arquivo, nome em PascalCase (`AssetCard.jsx`).
* **Estilização:** classes do Tailwind (NativeWind); evitar `StyleSheet.create` e estilos inline. Use as cores do tema (tabela abaixo) em vez de hexadecimais soltos.
* **Rotas:** toda tela nova entra em `src/app/`.
* **Imports:** usar o alias `@/` em vez de caminhos relativos longos.

```js
import { Button } from "@/components/Button";
```

* **Nomenclatura:** arquivos e identificadores de domínio em português, em coerência com os casos de uso.
* **Testes:** arquivos `*.test.js` ao lado do arquivo testado (seção 4.5).

### Cores do tema

Definidas em `tailwind.config.js`. Cada nome representa um papel na interface; nomes diferentes podem apontar para a mesma cor, o que permite alterar um papel sem afetar os demais.

| Classe (`bg-`, `text-`, `border-`) | Cor | Uso | Alias |
| --- | --- | --- | --- |
| `primaria` | `#A8763E` | Botões, destaques e identidade | `marca` |
| `fundo` | `#F6F2E3` | Fundo das telas |  |
| `container` | `#F6F2E3` | Containers, cards e inputs |  |
| `texto` | `#404E40` | Texto principal | `secundaria` |
| `subtexto` | `#404E40` a 80% | Subtítulos e textos secundários | `subtitulo` |
| `positivo` | `#7CB518` | Valorização e ganhos | `sucesso` |
| `negativo` | `#EF3054` | Desvalorização e perdas | `erro` |

Em código novo, prefira o nome da primeira coluna; `sucesso` e `erro` são indicados para mensagens de feedback em formulários. Exemplo:
`<Text className="text-positivo">+4,2%</Text>`.

> **Atenção:** as classes antigas `bg-brand-light`, `text-brand-dark`, `bg-brand`, `text-gain` e `text-loss` **não existem mais**. Foram substituídas pelas da tabela acima. Use `bg-fundo`, `text-texto`, `bg-primaria`, `text-positivo`, `text-negativo`.

### Fontes

Fonte principal: **Lora** (títulos). Fonte secundária: **Manrope** (interface). Ambas vêm do Google Fonts e são carregadas em `src/fontes.js`.

No React Native, cada peso é uma fonte distinta: `font-bold` não altera o peso de uma fonte personalizada. Por isso, o peso é escolhido pela classe de fonte:

| Classe | Fonte | Uso |
| --- | --- | --- |
| `font-titulo` | Lora Bold | Títulos |
| `font-titulo-regular` | Lora Regular | Destaques e valores grandes |
| `font-corpo` | Manrope Regular | Texto da interface |
| `font-corpo-medium` | Manrope Medium | Rótulos e botões |
| `font-corpo-bold` | Manrope Bold | Ênfase em textos da interface |

Todo `<Text>` deve declarar uma dessas classes; sem ela, o aplicativo usa a fonte do sistema. Exemplo:
`<Text className="font-titulo text-texto text-2xl">Patrimônio</Text>`.

## 11. Problemas comuns

| Sintoma | Ação |
| --- | --- |
| QR code não conecta | Confirme a mesma rede Wi-Fi; se a rede bloquear, `npx expo start --tunnel` |
| `.env` alterado sem efeito | `npx expo start -c` (limpa o cache e reinicia) |
| Classes do Tailwind não aplicadas | Verifique se `global.css` é importado em `src/app/_layout.jsx` e se o arquivo está coberto por `content` em `tailwind.config.js`; reinicie com `-c` |
| `FirebaseError: Missing or insufficient permissions` | Regras do Firestore (`firestore.rules`): usuário não autenticado, regras não publicadas ou caminho fora de `usuarios/{uid}` |
| `Firebase: Error (auth/invalid-api-key)` | Variáveis `EXPO_PUBLIC_FIREBASE_*` incorretas ou não preenchidas no `.env`; reinicie com `-c` |
| Erros estranhos depois do `npm install` | `npx expo install --check`; se persistir, remova `node_modules` e reinstale |
| `npm install` falha com `EBADENGINE` | Node abaixo de 22.13: reinstale o Node 22.x e reabra o terminal |
| Expo Go pede login ou não abre o projeto | Execute `npx expo login` e entre na mesma conta no Expo Go |
| QR code conecta em casa, mas não no Windows | Permita o Node.js em redes privadas quando o Firewall do Windows pedir |
| Git recusa o push | Verifique a autenticação (`gh auth login` ou token) e se o push não é direto em `main`/`dev` |
| Import `@/...` não resolve | Verifique `jsconfig.json` na raiz e reinicie o servidor com `npx expo start -c` |
| `npm test` falha com "No tests found" | Confirme que o script no `package.json` tem `--passWithNoTests` (já configurado). Se o erro persistir, verifique se o arquivo de teste segue o padrão `*.test.js` e está em `src/` |
| `npm test` não encontra o `jest.config.js` | O arquivo deve ficar na raiz do projeto, ao lado do `package.json`. Confirme também que `jest-expo` está em `devDependencies` |
| Teste importa JSX e quebra | O `jest.config.js` já usa o preset `jest-expo`, que transforma JSX. Se quebrar, confirme que o arquivo está em `src/` (fora de `src/app/`) e que o import usa `@/` ou caminho relativo correto |
