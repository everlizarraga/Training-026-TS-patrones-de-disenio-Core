# Semana 1 - Día 1 - Parte 1: Setup del Proyecto

## ⏱️ TIEMPO ESTIMADO: 30 minutos

---

## 🎯 OBJETIVO

Crear el repo `design-patterns-ts` con toda la estructura de carpetas y configuración lista para trabajar con TypeScript + Jest + TDD durante las 4 semanas.

---

## PASO 1: Crear el Repo

```bash
# Crear carpeta del proyecto
mkdir design-patterns-ts
cd design-patterns-ts

# Inicializar Git
git init

# Inicializar npm (acepta defaults con -y)
npm init -y
```

---

## PASO 2: Instalar Dependencias

```bash
# ============================================
# DEPENDENCIAS DE DESARROLLO
# ============================================

# TypeScript: compilador de TS → JS
# ts-jest: permite que Jest entienda archivos .ts directamente
# jest: framework de testing (el que ya conocés)
# @types/jest: tipos de TypeScript para Jest (autocompletado de expect, describe, etc.)
npm install --save-dev typescript ts-jest jest @types/jest

# ============================================
# DEPENDENCIAS DE PRODUCCIÓN
# ============================================

# uuid: genera IDs únicos (lo vamos a usar en varios patterns)
# @types/uuid: tipos de TypeScript para uuid
npm install uuid
npm install --save-dev @types/uuid
```

**¿Por qué uuid?**
Muchos patterns necesitan identificar objetos únicamente (tasks, orders, commands). En vez de inventar IDs caseros, usamos `uuid` que genera IDs universalmente únicos tipo `"550e8400-e29b-41d4-a716-446655440000"`.

---

## PASO 3: Configurar TypeScript (tsconfig.json)

```jsonc
// ============================================
// tsconfig.json
// Configuración del compilador TypeScript
// ============================================
{
  "compilerOptions": {
    // ---- Salida ----
    "target": "ES2020",           // Compilar a ES2020 (soporta opcionales, nullish, etc.)
    "module": "commonjs",         // Formato de módulos (Node.js usa CommonJS)
    "outDir": "./dist",           // Carpeta donde va el JS compilado
    "rootDir": "./src",           // Carpeta raíz del código fuente

    // ---- Tipado estricto ----
    "strict": true,               // Activa TODAS las verificaciones estrictas
    "esModuleInterop": true,      // Permite import de módulos CommonJS con sintaxis ES6
    "forceConsistentCasingInFileNames": true,  // Evita errores por mayúsculas/minúsculas en imports

    // ---- Resolución de módulos ----
    "resolveJsonModule": true,    // Permite importar archivos .json
    "declaration": true,          // Genera archivos .d.ts (tipos exportados)

    // ---- Extras útiles ----
    "skipLibCheck": true,         // Salta verificación de tipos en node_modules (más rápido)
    "sourceMap": true             // Genera source maps (debug más fácil)
  },
  "include": ["src/**/*"],        // Solo compilar archivos dentro de src/
  "exclude": [
    "node_modules",               // Nunca compilar dependencias
    "dist",                       // Nunca compilar salida anterior
    "**/*.test.ts"                // No compilar tests (Jest los maneja aparte)
  ]
}
```

---

## PASO 4: Configurar Jest (jest.config.js)

```javascript
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
```

---

## PASO 5: Scripts en package.json

Abrí `package.json` y reemplazá la sección `"scripts"` con:

```jsonc
{
  "scripts": {
    // Ejecutar TODOS los tests una vez
    "test": "jest",

    // Ejecutar tests en modo watch (re-ejecuta al guardar)
    // CLAVE PARA TDD: dejás esto corriendo y ves Red → Green en tiempo real
    "test:watch": "jest --watch",

    // Tests con reporte de cobertura (qué % del código está testeado)
    "test:coverage": "jest --coverage",

    // Compilar TypeScript a JavaScript (genera carpeta dist/)
    "build": "tsc",

    // Compilar en modo watch (re-compila al guardar)
    "build:watch": "tsc --watch"
  }
}
```

**El script más importante para TDD:** `npm run test:watch`
Lo dejás corriendo en una terminal. Cada vez que guardás un archivo, Jest re-ejecuta los tests afectados. Vas a ver en tiempo real si tu test pasa (verde) o falla (rojo).

---

## PASO 6: Crear Estructura de Carpetas

```bash
# ============================================
# ESTRUCTURA COMPLETA DEL PROYECTO
# ============================================

# Carpetas de patrones creacionales (Semana 1)
mkdir -p src/creational/singleton/examples
mkdir -p src/creational/factory/examples
mkdir -p src/creational/builder/examples

# Carpetas de patrones estructurales (Semana 2)
mkdir -p src/structural/adapter/examples
mkdir -p src/structural/decorator/examples
mkdir -p src/structural/facade/examples
mkdir -p src/structural/proxy/examples

# Carpetas de patrones de comportamiento (Semana 3)
mkdir -p src/behavioral/strategy/examples
mkdir -p src/behavioral/observer/examples
mkdir -p src/behavioral/command/examples
mkdir -p src/behavioral/state/examples
mkdir -p src/behavioral/template-method/examples

# Carpetas de proyectos integradores (Semana 4)
mkdir -p src/integrators/project-1-task-automation
mkdir -p src/integrators/project-2-ecommerce-checkout
mkdir -p src/integrators/project-3-document-workflow

# Carpeta para las guías .md del entrenamiento
mkdir -p docs
```

**Resultado visual:**

```
design-patterns-ts/
├── src/
│   ├── creational/
│   │   ├── singleton/
│   │   │   └── examples/
│   │   ├── factory/
│   │   │   └── examples/
│   │   └── builder/
│   │       └── examples/
│   │
│   ├── structural/
│   │   ├── adapter/
│   │   │   └── examples/
│   │   ├── decorator/
│   │   │   └── examples/
│   │   ├── facade/
│   │   │   └── examples/
│   │   └── proxy/
│   │       └── examples/
│   │
│   ├── behavioral/
│   │   ├── strategy/
│   │   │   └── examples/
│   │   ├── observer/
│   │   │   └── examples/
│   │   ├── command/
│   │   │   └── examples/
│   │   ├── state/
│   │   │   └── examples/
│   │   └── template-method/
│   │       └── examples/
│   │
│   └── integrators/
│       ├── project-1-task-automation/
│       ├── project-2-ecommerce-checkout/
│       └── project-3-document-workflow/
│
├── docs/                    ← Acá van los .md del entrenamiento
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## PASO 7: Crear .gitignore

```gitignore
# Dependencias
node_modules/

# Salida compilada
dist/

# Cobertura de tests
coverage/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

---

## PASO 8: Verificar que Todo Funciona

Creá un archivo de prueba rápida para confirmar que TypeScript + Jest están configurados correctamente:

```bash
# Crear archivo de test de verificación
touch src/creational/singleton/singleton.test.ts
```

Contenido de `src/creational/singleton/singleton.test.ts`:

```typescript
// ============================================
// TEST DE VERIFICACIÓN
// Solo para confirmar que Jest + TypeScript funcionan
// Este archivo se reemplaza en la Parte 3 (Singleton)
// ============================================

describe('Setup Verification', () => {
  it('should run TypeScript tests correctly', () => {
    // Arrange
    const a: number = 2;
    const b: number = 3;

    // Act
    const result: number = a + b;

    // Assert
    expect(result).toBe(5);
  });

  it('should support TypeScript features', () => {
    // Verificar que interfaces funcionan
    interface Testable {
      name: string;
      value: number;
    }

    const obj: Testable = { name: 'test', value: 42 };

    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });
});
```

Ahora ejecutá:

```bash
# Ejecutar tests
npm test
```

**Resultado esperado:**

```
 PASS  src/creational/singleton/singleton.test.ts
  Setup Verification
    ✓ should run TypeScript tests correctly
    ✓ should support TypeScript features

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

Si ves eso → **setup completo, todo funciona.**

---

## PASO 9: Primer Commit

```bash
git add .
git commit -m "chore: initial setup - TypeScript + Jest + TDD ready"
```

---

## ✅ CHECKLIST SETUP

- [ ] Repo inicializado con Git
- [ ] Dependencias instaladas (typescript, jest, ts-jest, uuid)
- [ ] tsconfig.json configurado
- [ ] jest.config.js configurado
- [ ] Scripts en package.json (test, test:watch, build)
- [ ] Estructura de carpetas completa (12 patterns + 3 integradores)
- [ ] .gitignore creado
- [ ] Test de verificación pasa (npm test → 2 tests verdes)
- [ ] Primer commit hecho

**Si todo está verde → avisame y arrancamos con Parte 2: TDD Workflow.**
