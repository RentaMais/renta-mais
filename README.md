# RentaMais

Aplicativo mobile que reúne, em um só lugar, os investimentos mantidos em diferentes corretoras. Substitui planilhas e anotações dispersas por uma visão clara do patrimônio, da rentabilidade e dos proventos recebidos.

Projeto da disciplina **Programação para Dispositivos Móveis** (Engenharia de Computação, CEFET-MG, Unidade Leopoldina).

## Funcionalidades

- **Início:** patrimônio total, divisão da carteira e evolução no tempo.
- **Ativos:** cadastro de renda variável e renda fixa, com venda e resgate.
- **Rentabilidade:** desempenho da carteira comparado ao CDI e ao Ibovespa.
- **Proventos:** dividendos recebidos e provisionados.
- **Simulador:** projeção de aportes mensais em 10, 20, 30 ou 40 anos.
- **Conta:** cadastro, login, recuperação de senha e configurações.

## Tecnologias

- React Native com Expo e TypeScript
- Tailwind CSS (NativeWind)
- Supabase (banco de dados e autenticação)
- brapi.dev (cotações da bolsa)

## Execução

Requisitos: Node.js 22 (mínimo 22.13), aplicativo Expo Go no celular e conta gratuita no Expo.

```bash
git clone https://github.com/<organizacao>/renta-plus
cd renta-plus
npm install
cp .env.example .env
code .env
npm start
```

As chaves do `.env` são fornecidas pela equipe. Após `npm start`, basta escanear o QR code com o Expo Go.

## Documentação

Instalação detalhada, organização do código, comandos e fluxo de trabalho estão em [DESENVOLVIMENTO.md](./DESENVOLVIMENTO.md).

## Equipe

- Filipe Duarte Jordão
- Gabriel Vieira Bordoni
- Ian Ribeiro de Oliveira

Orientação: Galba Falce de Almeida.

## Licença

MIT. Ver [LICENSE](./LICENSE).
