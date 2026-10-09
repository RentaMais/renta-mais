/** @type {import('tailwindcss').Config} */
const { cores } = require("./src/cores");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: cores,
    },
    // Fontes. As chaves devem ser iguais aos nomes exportados em src/fontes.ts.
    // No React Native cada peso é uma fonte separada: `font-bold` não troca o peso.
    fontFamily: {
      titulo: ["Lora_700Bold"], // títulos (fonte principal)
      "titulo-regular": ["Lora_400Regular"], // destaques e valores grandes
      corpo: ["Manrope_400Regular"], // texto da interface (fonte secundária)
      "corpo-medium": ["Manrope_500Medium"],
      "corpo-bold": ["Manrope_700Bold"],
    },
  },
  plugins: [],
};
