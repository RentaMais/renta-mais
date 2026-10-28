// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    rules: {
      // Desativa o erro de caminhos não resolvidos no ESLint.
      // O Metro (Expo) já resolve o @/cores nativamente, então isso é seguro.
      "import/no-unresolved": "off"
    }
  }
]);