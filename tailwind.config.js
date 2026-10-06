/** @type {import('tailwindcss').Config} */

// Paleta base (nomes do design). Cada hexadecimal é definido uma única vez.
const paleta = {
  marca: "#A8763E",
  fundo: "#F6F2E3",
  container: "#FFFFFF",
  texto: "#404E40",
  postivo: "#7CB518",
  negativo: "#EF3054",
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Papéis na interface. Usar estes nomes nas telas e componentes.
        primaria: paleta.marca, // botões, destaques e identidade
        fundo: paleta.fundo, // fundo das telas
        container: paleta.fundo, // containers, cards e inputs
        texto: paleta.texto, // texto principal
        subtexto: `${paleta.texto}cc`, // subtítulos e textos secundários
        positivo: paleta.postivo, // valorização, ganhos
        negativo: paleta.negativo, // desvalorização, perdas

        // Aliases/Apelidos
        marca: paleta.marca,
        sucesso: paleta.postivo, // feedback de ação concluída
        erro: paleta.negativo, // feedback de erro em formulários
        secundaria: paleta.texto,
        subtitulo: `${paleta.texto}cc`,
      },
      // Fontes. As chaves devem ser iguais aos nomes exportados em src/lib/fontes.ts.
      // No React Native cada peso é uma fonte separada: `font-bold` não troca o peso.
      fontFamily: {
        titulo: ["Lora_700Bold"], // títulos (fonte principal)
        "titulo-regular": ["Lora_400Regular"], // destaques e valores grandes
        corpo: ["Manrope_400Regular"], // texto da interface (fonte secundária)
        "corpo-medium": ["Manrope_500Medium"],
        "corpo-bold": ["Manrope_700Bold"],
      },
    },
  },
  plugins: [],
};
