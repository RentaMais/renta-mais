// Única fonte de verdade das cores. Usada pelo tailwind.config.js e pelo código JS.
// Não escrever hexadecimal em nenhum outro arquivo.
const paleta = {
  marca: "#A8763E",
  fundo: "#F6F2E3",
  container: "#FFFFFF",
  texto: "#404E40",
  positivo: "#7CB518",
  negativo: "#EF3054",
};

// Papéis na interface. Usar estes nomes nas telas e componentes.
const cores = {
  primaria: paleta.marca, // botões, destaques e identidade
  fundo: paleta.fundo, // fundo das telas
  container: paleta.container, // containers, cards e inputs
  texto: paleta.texto, // texto principal
  subtexto: `${paleta.texto}cc`, // 80% opocidade, subtítulos e textos secundários
  inativo: `${paleta.texto}66`, // 40% opocidade, itens desativados (ex.: aba inativa)
  placeholder: `${paleta.texto}99`, // texto de placeholder em inputs
  trilho: `${paleta.texto}33`, // trilho desligado do Switch
  positivo: paleta.positivo, // valorização, ganhos
  negativo: paleta.negativo, // desvalorização, perdas

  // Aliases/Apelidos
  marca: paleta.marca,
  card: paleta.container,
  sucesso: paleta.positivo, // feedback de ação concluída
  erro: paleta.negativo, // feedback de erro em formulários
  secundaria: paleta.texto,
  subtitulo: `${paleta.texto}cc`,
};

module.exports = { cores };
