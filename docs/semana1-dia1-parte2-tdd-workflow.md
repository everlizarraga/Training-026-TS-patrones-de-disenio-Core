# Semana 1 - Día 1 - Parte 2: TDD Workflow (Red/Green/Refactor)

## ⏱️ TIEMPO ESTIMADO: 30 minutos

---

## 🎯 OBJETIVO

Internalizar el ciclo TDD escribiendo tests ANTES del código. Al terminar esta parte, el workflow Red → Green → Refactor tiene que ser automático.

---

## ¿QUÉ ES TDD?

**Test-Driven Development** = Escribir el test PRIMERO, código DESPUÉS.

```
Desarrollo tradicional:
  Escribir código → Rezar que funcione → Testear (si sobra tiempo)

TDD:
  Escribir test → Ver que falla (RED) → Código mínimo (GREEN) → Mejorar (REFACTOR)
```

**Analogía: El Arquitecto y el Inspector**

Imaginá que construís una casa:

```
SIN TDD (desarrollo tradicional):
  1. Construís la casa entera
  2. Llamás al inspector
  3. Inspector: "La puerta no abre, el agua no sale, el techo tiene goteras"
  4. Tenés que romper paredes para arreglar
  5. Dolor, frustración, tiempo perdido

CON TDD:
  1. Inspector dice: "La puerta tiene que abrir hacia afuera" (escribís el test)
  2. Construís SOLO la puerta (código mínimo)
  3. Inspector verifica: "Aprobado ✅" (test pasa)
  4. Inspector dice: "El agua tiene que salir a 20°C" (siguiente test)
  5. Construís SOLO la cañería necesaria
  6. Inspector verifica: "Aprobado ✅"
  7. Repetís...

Resultado: Cada pieza funciona ANTES de construir la siguiente
```

---

## EL CICLO: RED → GREEN → REFACTOR

```
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │   ┌───────┐     ┌───────┐     ┌──────────┐     │
    └──→│  RED  │────→│ GREEN │────→│ REFACTOR │─────┘
        └───────┘     └───────┘     └──────────┘
        Escribir       Código        Mejorar
        test que       mínimo        código sin
        FALLA          para que      cambiar
                       PASE          comportamiento
```

### Paso 1: RED (Test que falla)

```
- Escribís un test que describe UNA cosa que querés que pase
- Lo ejecutás
- FALLA → Esto es BUENO, significa que el test funciona
- Si no falla → el test está mal escrito (no testea nada nuevo)
```

### Paso 2: GREEN (Código mínimo)

```
- Escribís el código MÁS SIMPLE que haga pasar el test
- No te preocupás por elegancia, patterns, ni optimización
- Solo que pase
- Lo ejecutás → PASA → Verde
```

### Paso 3: REFACTOR (Mejorar)

```
- Ahora que funciona, mejorás el código
- Eliminás duplicación, mejorás nombres, limpiás estructura
- Después de cada cambio → ejecutás tests
- Si siguen en verde → no rompiste nada
- Si alguno falla → deshacés el cambio y corregís
```

---

## REGLAS ESTRICTAS DE TDD

```
REGLA 1: NUNCA escribir código de producción sin un test que falle primero
         → Si no hay test rojo, no hay motivo para escribir código

REGLA 2: Escribir SOLO lo suficiente de un test para que falle
         → Un test a la vez, no diez

REGLA 3: Escribir SOLO el código mínimo para que el test pase
         → Nada de "ya que estoy, agrego esto"

REGLA 4: Refactorizar SOLO cuando los tests están en verde
         → Nunca refactorizar sobre rojo
```

---

## EJEMPLO GUIADO PASO A PASO: Calculator

Vamos a construir una Calculator usando TDD puro. Seguí cada paso exactamente.

---

### Creá los archivos:

```
src/creational/singleton/examples/calculator.ts        ← código
src/creational/singleton/examples/calculator.test.ts   ← tests
```

> Usamos la carpeta examples/ de singleton porque es el día 1.
> El archivo es temporal para practicar TDD, no tiene que ver con Singleton.

---

### CICLO 1: La calculadora existe

#### 🔴 RED - Escribir test que falla

```typescript
// ============================================
// calculator.test.ts
// TDD Paso a paso - Calculator
// ============================================

import { Calculator } from './calculator';

describe('Calculator', () => {
  // -------------------------------------------
  // CICLO 1: La calculadora se puede crear
  // -------------------------------------------
  it('should create a calculator instance', () => {
    const calc = new Calculator();
    expect(calc).toBeInstanceOf(Calculator);
  });
});
```

Ejecutá: `npm test`

**Resultado esperado: 🔴 FALLA**
```
Cannot find module './calculator'
```

Falla porque `calculator.ts` no existe o está vacío. **Esto es correcto.** Tenés tu primer RED.

---

#### 🟢 GREEN - Código mínimo para que pase

```typescript
// ============================================
// calculator.ts
// Código MÍNIMO - solo lo que el test pide
// ============================================

export class Calculator {
  // Vacía por ahora - el test solo pide que exista
}
```

Ejecutá: `npm test`

**Resultado esperado: 🟢 PASA**
```
✓ should create a calculator instance
```

**¿Por qué no agregamos métodos todavía?** Porque ningún test los pide. En TDD, el código SOLO existe si hay un test que lo necesita.

---

#### 🔄 REFACTOR

Nada que refactorizar todavía. La clase tiene una línea. Seguimos.

---

### CICLO 2: Suma

#### 🔴 RED

Agregá este test DEBAJO del anterior (dentro del mismo `describe`):

```typescript
  // -------------------------------------------
  // CICLO 2: Puede sumar dos números
  // -------------------------------------------
  it('should add two numbers', () => {
    const calc = new Calculator();
    const result = calc.add(2, 3);
    expect(result).toBe(5);
  });
```

Ejecutá: `npm test`

**Resultado esperado: 🔴 FALLA**
```
TypeError: calc.add is not a function
```

El método `add` no existe. **RED correcto.**

---

#### 🟢 GREEN

Agregá el método en `calculator.ts`:

```typescript
export class Calculator {
  // ---- Suma ----
  // Retorna la suma de dos números
  add(a: number, b: number): number {
    return a + b;
  }
}
```

Ejecutá: `npm test`

**Resultado esperado: 🟢 PASA**
```
✓ should create a calculator instance
✓ should add two numbers
```

---

#### 🔄 REFACTOR

El código es simple y limpio. Nada que refactorizar.

---

### CICLO 3: Resta

#### 🔴 RED

```typescript
  // -------------------------------------------
  // CICLO 3: Puede restar dos números
  // -------------------------------------------
  it('should subtract two numbers', () => {
    const calc = new Calculator();
    const result = calc.subtract(10, 4);
    expect(result).toBe(6);
  });
```

Ejecutá: `npm test` → 🔴 `calc.subtract is not a function`

---

#### 🟢 GREEN

```typescript
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  // ---- Resta ----
  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

Ejecutá: `npm test` → 🟢 3 tests pasan

---

### CICLO 4: División (acá se pone interesante)

#### 🔴 RED - Caso normal

```typescript
  // -------------------------------------------
  // CICLO 4: Puede dividir dos números
  // -------------------------------------------
  it('should divide two numbers', () => {
    const calc = new Calculator();
    const result = calc.divide(10, 2);
    expect(result).toBe(5);
  });
```

Ejecutá: `npm test` → 🔴 `calc.divide is not a function`

---

#### 🟢 GREEN

```typescript
  // ---- División ----
  divide(a: number, b: number): number {
    return a / b;
  }
```

Ejecutá: `npm test` → 🟢 4 tests pasan

---

#### 🔴 RED - Caso edge: división por cero

**Acá está el poder del TDD.** Pensás en el caso edge ANTES de que sea un bug en producción:

```typescript
  // -------------------------------------------
  // CICLO 4b: División por cero lanza error
  // -------------------------------------------
  it('should throw error when dividing by zero', () => {
    const calc = new Calculator();

    // expect().toThrow() necesita una función, no un valor
    // Por eso envolvemos la llamada en una arrow function
    expect(() => calc.divide(10, 0)).toThrow('Cannot divide by zero');
  });
```

Ejecutá: `npm test` → 🔴 FALLA

**¿Por qué falla?** Porque `10 / 0` en JavaScript retorna `Infinity` en vez de lanzar error. El test espera un error, pero no recibe uno.

---

#### 🟢 GREEN - Agregar validación

Modificá el método `divide`:

```typescript
  // ---- División ----
  // Valida que no se divida por cero
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
```

Ejecutá: `npm test` → 🟢 5 tests pasan

**¿Ves el poder?** Sin TDD, ese `if (b === 0)` probablemente no existiría hasta que alguien divida por cero en producción. Con TDD, pensaste en el caso edge ANTES de escribir el código.

---

### CICLO 5: Refactor real - Eliminar duplicación

Mirá los tests. Hay duplicación: `new Calculator()` se repite en TODOS.

#### 🔄 REFACTOR

```typescript
// ============================================
// calculator.test.ts - VERSIÓN REFACTORIZADA
// ============================================

import { Calculator } from './calculator';

describe('Calculator', () => {
  // ---- Setup ----
  // beforeEach se ejecuta ANTES de cada test
  // Cada test recibe una instancia LIMPIA (sin estado residual)
  let calc: Calculator;

  beforeEach(() => {
    calc = new Calculator();
  });

  it('should create a calculator instance', () => {
    expect(calc).toBeInstanceOf(Calculator);
  });

  it('should add two numbers', () => {
    expect(calc.add(2, 3)).toBe(5);
  });

  it('should subtract two numbers', () => {
    expect(calc.subtract(10, 4)).toBe(6);
  });

  it('should divide two numbers', () => {
    expect(calc.divide(10, 2)).toBe(5);
  });

  it('should throw error when dividing by zero', () => {
    expect(() => calc.divide(10, 0)).toThrow('Cannot divide by zero');
  });
});
```

Ejecutá: `npm test` → 🟢 5 tests siguen pasando

**¿Qué hicimos?** Refactorizamos sin cambiar comportamiento. Los tests PRUEBAN que no rompimos nada.

---

### Código final: calculator.ts

```typescript
// ============================================
// calculator.ts - VERSIÓN FINAL
// ============================================

export class Calculator {
  // ---- Suma ----
  add(a: number, b: number): number {
    return a + b;
  }

  // ---- Resta ----
  subtract(a: number, b: number): number {
    return a - b;
  }

  // ---- División ----
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
}
```

---

## JEST MATCHERS AVANZADOS QUE VAS A USAR

En los ejercicios de patterns vas a necesitar estos matchers. Referencia rápida:

```typescript
// ============================================
// MATCHERS BÁSICOS
// ============================================

expect(valor).toBe(5);                    // Igualdad exacta (===)
expect(valor).toEqual({ a: 1 });          // Igualdad profunda (objetos/arrays)
expect(valor).not.toBe(5);                // Negación (cualquier matcher)
expect(valor).toBeNull();                 // Es null
expect(valor).toBeUndefined();            // Es undefined
expect(valor).toBeDefined();              // NO es undefined
expect(valor).toBeTruthy();               // Es "truthy" (no falsy)
expect(valor).toBeFalsy();                // Es "falsy" (0, '', null, undefined, false)

// ============================================
// NÚMEROS
// ============================================

expect(valor).toBeGreaterThan(3);         // > 3
expect(valor).toBeGreaterThanOrEqual(3);  // >= 3
expect(valor).toBeLessThan(5);            // < 5
expect(valor).toBeCloseTo(0.3);           // Para floats (0.1 + 0.2 ≈ 0.3)

// ============================================
// STRINGS
// ============================================

expect(texto).toMatch(/regex/);            // Match con regex
expect(texto).toContain('substring');      // Contiene substring

// ============================================
// ARRAYS
// ============================================

expect(array).toContain(item);             // Array contiene item
expect(array).toHaveLength(3);             // Array tiene N elementos

// ============================================
// OBJETOS
// ============================================

expect(obj).toHaveProperty('key');         // Objeto tiene la propiedad
expect(obj).toHaveProperty('key', 'val');  // Propiedad con valor específico
expect(obj).toMatchObject({ a: 1 });       // Objeto contiene al menos estas props

// ============================================
// EXCEPCIONES (crítico para patterns)
// ============================================

// toThrow necesita envolver la llamada en una función
expect(() => miFuncion()).toThrow();                    // Lanza cualquier error
expect(() => miFuncion()).toThrow('mensaje exacto');    // Lanza error con mensaje
expect(() => miFuncion()).toThrow(TypeError);           // Lanza tipo específico

// ============================================
// INSTANCIAS (crítico para patterns)
// ============================================

expect(obj).toBeInstanceOf(MiClase);       // obj es instancia de MiClase

// ============================================
// MOCKS Y SPIES (los vas a usar mucho)
// ============================================

// jest.fn() crea una función "espía" que registra sus llamadas
const mockFn = jest.fn();
mockFn('hola');

expect(mockFn).toHaveBeenCalled();              // Fue llamada al menos 1 vez
expect(mockFn).toHaveBeenCalledTimes(1);        // Fue llamada N veces
expect(mockFn).toHaveBeenCalledWith('hola');     // Fue llamada con estos args

// Mock que retorna valor
const mockFn2 = jest.fn().mockReturnValue(42);
expect(mockFn2()).toBe(42);

// ============================================
// ESTRUCTURA DE TESTS
// ============================================

describe('Grupo de tests', () => {
  // Variables compartidas
  let instancia: MiClase;

  // Se ejecuta ANTES de cada test (instancia fresca)
  beforeEach(() => {
    instancia = new MiClase();
  });

  // Se ejecuta DESPUÉS de cada test (limpieza)
  afterEach(() => {
    // Limpiar si es necesario
  });

  it('should do something', () => {
    // Test individual
  });

  // Sub-grupo (para organizar tests relacionados)
  describe('método específico', () => {
    it('should handle case A', () => { /* ... */ });
    it('should handle case B', () => { /* ... */ });
  });
});
```

---

## RESUMEN: ¿POR QUÉ TDD?

```
SIN TDD:
  1. Escribís 200 líneas de código
  2. Ejecutás → 5 bugs
  3. Debuggeás 2 horas
  4. Arreglás 3 bugs → creás 2 nuevos
  5. Fin del día: frustración

CON TDD:
  1. Escribís 1 test (5 líneas)
  2. Escribís código mínimo (5 líneas)
  3. Pasa → siguiente test
  4. Repetís 20 veces
  5. Fin del día: 200 líneas de código + 20 tests que prueban que funciona
  6. Bonus: podés refactorizar SIN MIEDO (los tests atrapan errores)
```

**Para tu cerebro específicamente, TDD es ideal porque:**
- Tu detector de inconsistencias tiene EVIDENCIA de que todo funciona (tests verdes)
- Tu iterador obsesivo tiene LÍMITES claros (el test dice cuándo parar)
- Tu pensamiento sistémico ve el DISEÑO emergente (cada test revela la API)

---

## ✅ CHECKLIST PARTE 2

- [ ] Entendés el ciclo Red → Green → Refactor
- [ ] Hiciste el ejemplo de Calculator paso a paso
- [ ] Entendés `beforeEach` (instancia limpia por test)
- [ ] Entendés `toThrow` (envolver en función)
- [ ] Entendés `jest.fn()` (mocks/spies)
- [ ] Entendés las 4 reglas estrictas de TDD
- [ ] 5 tests de Calculator pasan

**Si todo está verde → avisame y arrancamos con Parte 3: Singleton Pattern.**
