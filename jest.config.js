// ============================================
// jest.config.js
// Configuración de Jest para TypeScript
// ============================================

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // ts-jest transforma archivos .ts a JS antes de que Jest los ejecute
  // Sin esto, Jest no entiende TypeScript
  preset: 'ts-jest',

  // Entorno de ejecución: Node.js (no browser)
  // Usamos 'node' porque no tenemos DOM (no hay HTML/CSS en este entrenamiento)
  testEnvironment: 'node',

  // Dónde buscar archivos de test
  // <rootDir> = carpeta raíz del proyecto
  roots: ['<rootDir>/src'],

  // Patrón para encontrar archivos de test
  // Busca: cualquier archivo que termine en .test.ts dentro de src/
  testMatch: ['**/*.test.ts'],

  // Extensiones que Jest puede resolver
  moduleFileExtensions: ['ts', 'js', 'json'],

  // Limpia mocks automáticamente entre tests
  // Cada test empieza "limpio" sin estado residual del anterior
  clearMocks: true,
};
