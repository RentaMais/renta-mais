// jest.config.js
/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  testMatch: ["**/*.test.js", "**/*.test.jsx"],
  // Ignora artefatos de build e dependências.
  testPathIgnorePatterns: ["/node_modules/", "/.expo/", "/dist/"],
  // Cobre apenas o código-fonte.
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/app/**"],
};