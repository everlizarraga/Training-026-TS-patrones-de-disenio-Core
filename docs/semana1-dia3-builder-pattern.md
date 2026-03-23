# Semana 1 - Día 3: Builder Pattern

## ⏱️ TIEMPO ESTIMADO: 3-4 horas

---

## 🎯 OBJETIVO

Entender cómo Builder simplifica la creación de objetos complejos con muchos parámetros, dominar fluent API (encadenamiento de métodos), e implementar uno completo con TDD.

---

## ¿QUÉ PROBLEMA RESUELVE BUILDER?

**El problema:**

Imaginá que tenés que crear un objeto HttpRequest. Tiene URL, método, headers, body, timeout, query params, autenticación... Algunos son obligatorios, otros opcionales. ¿Cómo lo construís?

```
SIN Builder — Opción A: Constructor gigante

  const request = new HttpRequest(
    'https://api.com/users',    // url
    'POST',                      // method
    { 'Content-Type': 'json' }, // headers
    '{"name": "Juan"}',         // body
    5000,                        // timeout
    { page: '1' },              // queryParams
    'Bearer token123',           // auth
    true,                        // followRedirects
    3,                           // maxRetries
  );

  Problemas:
  - ¿Qué es ese "5000"? ¿Timeout? ¿Puerto? ¿Límite?
  - ¿Qué es ese "3"? ¿Retries? ¿Versión?
  - Si no necesitás body → tenés que pasar null/undefined
  - Agregar un parámetro nuevo = romper TODOS los constructores existentes
  - Imposible de leer
```

```
SIN Builder — Opción B: Objeto de configuración

  const request = new HttpRequest({
    url: 'https://api.com/users',
    method: 'POST',
    headers: { 'Content-Type': 'json' },
    body: '{"name": "Juan"}',
    timeout: 5000,
  });

  Mejor, pero:
  - No hay validación progresiva (todo se valida al final)
  - No hay autocompletado paso a paso
  - Fácil olvidar campos obligatorios
  - No hay guía de "qué puedo configurar"
```

```
CON Builder — Fluent API

  const request = new HttpRequestBuilder()
    .setUrl('https://api.com/users')    // Obligatorio, claro
    .setMethod('POST')                   // Claro qué es
    .addHeader('Content-Type', 'json')   // Se puede llamar N veces
    .setBody('{"name": "Juan"}')         // Opcional, solo si querés
    .setTimeout(5000)                    // Claro que es timeout
    .build();                            // Valida y retorna objeto final

  Ventajas:
  - Cada paso es autoexplicativo (el nombre del método dice qué configurás)
  - Solo llamás lo que necesitás (los opcionales se omiten)
  - Autocompletado del IDE: después del "." te muestra QUÉ podés configurar
  - build() valida todo al final (campos obligatorios, combinaciones inválidas)
  - El objeto final es inmutable (no se puede modificar después de build)
```

**Builder separa la construcción de un objeto complejo de su representación final. Te permite construirlo paso a paso, con una API clara y legible.**

---

## ANALOGÍA: Pedir una Pizza

```
SIN Builder (constructor gigante):
  "Quiero una pizza grande napolitana con mozzarella extra 
   sin anchoas con borde relleno para delivery a las 20:00 
   con servilletas extra y propina incluida"
  → Un solo bloque incomprensible

CON Builder (paso a paso):
  nuevaPizza()
    .tamaño('grande')             ← Primero el tamaño
    .tipo('napolitana')           ← Después el tipo
    .agregarExtra('mozzarella')   ← Extras uno por uno
    .sinIngrediente('anchoas')    ← Quitar algo
    .bordeRelleno(true)           ← Opciones extra
    .delivery('20:00')            ← Entrega
    .build()                      ← "Listo, mandá el pedido"

  → Cada paso es claro
  → Solo agregás lo que querés
  → build() verifica que el pedido tenga sentido
```

---

## DIAGRAMA DE ESTRUCTURA

```
┌─────────────────────────────────────────────────────────┐
│                     BUILDER PATTERN                      │
│                                                         │
│  ┌──────────────────────────────────┐                   │
│  │          Builder                  │                   │
│  ├──────────────────────────────────┤                   │
│  │ - propiedades parciales          │                   │
│  │   (se van llenando paso a paso)  │                   │
│  ├──────────────────────────────────┤                   │
│  │ + setX(value): Builder  ← return this (fluent)       │
│  │ + setY(value): Builder  ← return this (fluent)       │
│  │ + addZ(value): Builder  ← return this (fluent)       │
│  │ + build(): Product      ← valida y crea final        │
│  └──────────────────────────────────┘                   │
│                    │                                     │
│                    │ build()                              │
│                    ▼                                     │
│  ┌──────────────────────────────────┐                   │
│  │          Product                  │                   │
│  ├──────────────────────────────────┤                   │
│  │ - readonly propiedades           │                   │
│  │   (inmutable una vez creado)     │                   │
│  └──────────────────────────────────┘                   │
│                                                         │
│  FLUJO:                                                 │
│                                                         │
│  new Builder()                                          │
│    .setUrl('...')      → return this (mismo builder)     │
│    .setMethod('POST')  → return this (mismo builder)     │
│    .addHeader('k','v') → return this (mismo builder)     │
│    .build()            → return new Product(...)         │
│                                                         │
│  "return this" es la CLAVE de la fluent API              │
│  Cada método retorna el MISMO builder                    │
│  Permitiendo encadenar .metodo().metodo().metodo()       │
└─────────────────────────────────────────────────────────┘
```

---

## CONCEPTO CLAVE: FLUENT API (return this)

```typescript
// ¿Cómo funciona el encadenamiento?

class Builder {
  private valor: string = '';

  // Este método retorna "this" (el mismo objeto builder)
  setValor(v: string): Builder {
    this.valor = v;
    return this;  // ← LA CLAVE: retorna el mismo builder
  }
}

// Sin return this:
const b = new Builder();
b.setValor('hola');     // retorna undefined/void
b.setValor('chau');     // otra llamada separada

// Con return this:
const b = new Builder();
b.setValor('hola')      // retorna el builder
 .setValor('chau');     // puedo llamar otro método encadenado

// ¿Por qué funciona?
// b.setValor('hola') retorna b (el mismo objeto)
// Entonces es como escribir: b.setValor('chau')
// Y ese también retorna b
// Así podés encadenar infinitamente
```

---

## CUÁNDO USAR BUILDER

```
✅ USAR cuando:
  - Objeto tiene 5+ parámetros (especialmente si varios son opcionales)
  - La construcción tiene pasos lógicos
  - Querés validar la combinación de parámetros al final
  - El objeto final debe ser inmutable (readonly)
  - Querés una API legible y autodocumentada

❌ NO USAR cuando:
  - Objeto tiene 2-3 parámetros simples (usá constructor normal)
  - No hay parámetros opcionales
  - No necesitás validación compleja
  - Agregás complejidad sin beneficio real
```

---

---

# EJEMPLO RESUELTO: QueryBuilder

Estudiá este código línea por línea. Construye queries SQL paso a paso.

---

## query-builder.ts

```typescript
// ============================================
// EJEMPLO RESUELTO: QueryBuilder
// Construye queries SQL paso a paso con fluent API
// ============================================

// ============================================
// PRODUCT: El objeto final que el builder crea
// ============================================
// "readonly" en TODAS las propiedades → inmutable una vez creado
// Nadie puede hacer query.table = 'otra' después de build()
export interface Query {
  readonly table: string;
  readonly columns: readonly string[];    // readonly string[] → no se puede push()
  readonly conditions: readonly string[];
  readonly orderBy: readonly string[];
  readonly limit: number | null;
  readonly offset: number | null;
}

// ============================================
// BUILDER: Construye el objeto Query paso a paso
// ============================================
export class QueryBuilder {
  // Estado interno del builder (mutable, se va llenando)
  // Estos son los "ingredientes" que se van agregando
  private table: string = '';
  private columns: string[] = ['*'];       // Default: todas las columnas
  private conditions: string[] = [];
  private orderByColumns: string[] = [];
  private limitValue: number | null = null;
  private offsetValue: number | null = null;

  // ============================================
  // MÉTODOS FLUENT (todos retornan this)
  // ============================================

  // Tabla de la query (obligatoria)
  // "FROM users" → from('users')
  from(table: string): QueryBuilder {
    this.table = table;
    return this;  // ← Retorna el mismo builder para encadenar
  }

  // Columnas a seleccionar
  // "SELECT name, email" → select(['name', 'email'])
  // Si no se llama, default es ['*'] (todas)
  select(columns: string[]): QueryBuilder {
    this.columns = columns;
    return this;
  }

  // Agregar condición WHERE
  // Se puede llamar MÚLTIPLES veces (se acumulan con AND)
  // "WHERE age > 18" → where('age > 18')
  // "WHERE age > 18 AND active = true" → where('age > 18').where('active = true')
  where(condition: string): QueryBuilder {
    this.conditions.push(condition);
    return this;
  }

  // Agregar ORDER BY
  // "ORDER BY name ASC" → orderBy('name ASC')
  orderBy(column: string): QueryBuilder {
    this.orderByColumns.push(column);
    return this;
  }

  // Establecer LIMIT
  // "LIMIT 10" → limit(10)
  setLimit(value: number): QueryBuilder {
    this.limitValue = value;
    return this;
  }

  // Establecer OFFSET
  // "OFFSET 20" → offset(20)
  setOffset(value: number): QueryBuilder {
    this.offsetValue = value;
    return this;
  }

  // ============================================
  // BUILD: Valida y crea el objeto final
  // ============================================
  build(): Query {
    // Validación: table es OBLIGATORIO
    // Si no se llamó from() → error
    if (!this.table) {
      throw new Error('Table is required. Use .from("tableName")');
    }

    // Validación: limit debe ser positivo
    if (this.limitValue !== null && this.limitValue <= 0) {
      throw new Error('Limit must be positive');
    }

    // Validación: offset debe ser no-negativo
    if (this.offsetValue !== null && this.offsetValue < 0) {
      throw new Error('Offset must be non-negative');
    }

    // Retorna objeto inmutable (copias de arrays, no referencias)
    return {
      table: this.table,
      columns: [...this.columns],           // Copia del array
      conditions: [...this.conditions],     // Copia del array
      orderBy: [...this.orderByColumns],    // Copia del array
      limit: this.limitValue,
      offset: this.offsetValue,
    };
  }

  // ============================================
  // BONUS: Generar el SQL como string
  // ============================================
  toSQL(): string {
    const query = this.build();  // Valida primero

    let sql = `SELECT ${query.columns.join(', ')} FROM ${query.table}`;

    if (query.conditions.length > 0) {
      sql += ` WHERE ${query.conditions.join(' AND ')}`;
    }

    if (query.orderBy.length > 0) {
      sql += ` ORDER BY ${query.orderBy.join(', ')}`;
    }

    if (query.limit !== null) {
      sql += ` LIMIT ${query.limit}`;
    }

    if (query.offset !== null) {
      sql += ` OFFSET ${query.offset}`;
    }

    return sql;
  }
}
```

---

## query-builder.test.ts

```typescript
// ============================================
// TESTS: QueryBuilder
// ============================================

import { QueryBuilder } from './query-builder';

describe('QueryBuilder', () => {
  // -------------------------------------------
  // Fluent API (encadenamiento)
  // -------------------------------------------
  describe('Fluent API', () => {
    it('should support method chaining', () => {
      // Cada método retorna el mismo builder → se puede encadenar
      const query = new QueryBuilder()
        .from('users')
        .select(['name', 'email'])
        .where('age > 18')
        .orderBy('name ASC')
        .setLimit(10)
        .build();

      expect(query.table).toBe('users');
      expect(query.columns).toEqual(['name', 'email']);
      expect(query.conditions).toEqual(['age > 18']);
      expect(query.orderBy).toEqual(['name ASC']);
      expect(query.limit).toBe(10);
    });

    it('should allow multiple where conditions', () => {
      const query = new QueryBuilder()
        .from('products')
        .where('price > 100')
        .where('category = "electronics"')
        .where('in_stock = true')
        .build();

      // Múltiples where() se acumulan
      expect(query.conditions).toHaveLength(3);
      expect(query.conditions).toEqual([
        'price > 100',
        'category = "electronics"',
        'in_stock = true',
      ]);
    });
  });

  // -------------------------------------------
  // Defaults
  // -------------------------------------------
  describe('Defaults', () => {
    it('should default to SELECT * when no columns specified', () => {
      const query = new QueryBuilder()
        .from('users')
        .build();

      expect(query.columns).toEqual(['*']);
    });

    it('should default limit and offset to null', () => {
      const query = new QueryBuilder()
        .from('users')
        .build();

      expect(query.limit).toBeNull();
      expect(query.offset).toBeNull();
    });
  });

  // -------------------------------------------
  // Validación
  // -------------------------------------------
  describe('Validation', () => {
    it('should throw if table is not set', () => {
      expect(() =>
        new QueryBuilder().build()
      ).toThrow('Table is required');
    });

    it('should throw if limit is zero or negative', () => {
      expect(() =>
        new QueryBuilder().from('users').setLimit(0).build()
      ).toThrow('Limit must be positive');

      expect(() =>
        new QueryBuilder().from('users').setLimit(-5).build()
      ).toThrow('Limit must be positive');
    });

    it('should throw if offset is negative', () => {
      expect(() =>
        new QueryBuilder().from('users').setOffset(-1).build()
      ).toThrow('Offset must be non-negative');
    });
  });

  // -------------------------------------------
  // Inmutabilidad
  // -------------------------------------------
  describe('Immutability', () => {
    it('should return a new object on each build', () => {
      const builder = new QueryBuilder().from('users');
      const q1 = builder.build();
      const q2 = builder.build();

      // Cada build() retorna un objeto NUEVO
      expect(q1).not.toBe(q2);
      // Pero con los mismos valores
      expect(q1).toEqual(q2);
    });
  });

  // -------------------------------------------
  // SQL generation
  // -------------------------------------------
  describe('toSQL()', () => {
    it('should generate simple SELECT', () => {
      const sql = new QueryBuilder()
        .from('users')
        .toSQL();

      expect(sql).toBe('SELECT * FROM users');
    });

    it('should generate complete query', () => {
      const sql = new QueryBuilder()
        .from('users')
        .select(['name', 'email'])
        .where('age > 18')
        .where('active = true')
        .orderBy('name ASC')
        .setLimit(10)
        .setOffset(20)
        .toSQL();

      expect(sql).toBe(
        'SELECT name, email FROM users WHERE age > 18 AND active = true ORDER BY name ASC LIMIT 10 OFFSET 20'
      );
    });
  });
});
```

---

## ¿QUÉ OBSERVAR DEL EJEMPLO?

```
1. FLUENT API = return this
   → TODOS los métodos (excepto build) retornan "this"
   → Permite .from().select().where().build()
   → Legible, claro, autodocumentado

2. BUILD() VALIDA
   → No valida en cada paso (sería molesto)
   → Valida TODO al final cuando llamás build()
   → Si falta algo obligatorio → error claro

3. PRODUCTO INMUTABLE
   → La interface Query tiene "readonly" en todo
   → Una vez creado, no se puede modificar
   → Arrays copiados con spread (no referencias)

4. MÉTODOS ACUMULATIVOS
   → where() se puede llamar N veces (push al array)
   → orderBy() igual
   → select() REEMPLAZA (solo una lista de columnas)

5. BUILDER REUTILIZABLE
   → Podés llamar build() múltiples veces
   → Cada vez retorna un objeto NUEVO
   → El builder mantiene su estado para crear más
```

---

## FLUJO VISUAL

```
new QueryBuilder()
  │
  │  Estado interno: { table: '', columns: ['*'], conditions: [], ... }
  │
  ├─ .from('users')
  │    table = 'users'          → return this
  │
  ├─ .select(['name', 'email'])
  │    columns = ['name','email'] → return this
  │
  ├─ .where('age > 18')
  │    conditions.push(...)     → return this
  │
  ├─ .where('active = true')
  │    conditions.push(...)     → return this
  │
  ├─ .setLimit(10)
  │    limitValue = 10          → return this
  │
  └─ .build()
       ├─ Valida: table existe? ✅
       ├─ Valida: limit > 0? ✅
       └─ Retorna: {
            table: 'users',
            columns: ['name', 'email'],
            conditions: ['age > 18', 'active = true'],
            limit: 10,
            offset: null
          }
```

---

---

# 🎯 EJERCICIO TDD: HttpRequestBuilder

## ⏱️ TIEMPO LÍMITE: 1.5 horas

---

## CONSIGNA

Implementá un Builder que construya objetos HttpRequest paso a paso con fluent API. Soporta URL, método HTTP, headers, body, timeout, y query params.

**Archivos a crear:**

```
src/1-creational/builder/http-request-builder.ts       ← tu código
src/1-creational/builder/http-request-builder.test.ts  ← tests (se dan listos)
```

---

## TESTS (copiá este archivo tal cual)

```typescript
// ============================================
// http-request-builder.test.ts
// Tests para HttpRequestBuilder
// TU OBJETIVO: hacer que TODOS estos tests pasen
// ============================================

import { HttpRequestBuilder } from './http-request-builder';
import type { HttpRequest } from './http-request-builder';

describe('HttpRequestBuilder', () => {
  // =========================================
  // FLUENT API
  // =========================================
  describe('Fluent API', () => {
    it('should support full method chaining', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com/users')
        .setMethod('POST')
        .addHeader('Content-Type', 'application/json')
        .addHeader('Authorization', 'Bearer token123')
        .setBody('{"name": "Juan"}')
        .setTimeout(5000)
        .addQueryParam('page', '1')
        .addQueryParam('limit', '10')
        .build();

      expect(request.url).toBe('https://api.com/users');
      expect(request.method).toBe('POST');
      expect(request.headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
      });
      expect(request.body).toBe('{"name": "Juan"}');
      expect(request.timeout).toBe(5000);
      expect(request.queryParams).toEqual({
        page: '1',
        limit: '10',
      });
    });

    it('should return the same builder instance on each method call', () => {
      const builder = new HttpRequestBuilder();
      const returned = builder.setUrl('https://api.com');

      // setUrl retorna el MISMO builder (no uno nuevo)
      expect(returned).toBe(builder);
    });
  });

  // =========================================
  // DEFAULTS
  // =========================================
  describe('Defaults', () => {
    it('should default method to GET', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.method).toBe('GET');
    });

    it('should default headers to empty object', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.headers).toEqual({});
    });

    it('should default body to null', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.body).toBeNull();
    });

    it('should default timeout to 30000', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.timeout).toBe(30000);
    });

    it('should default queryParams to empty object', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.queryParams).toEqual({});
    });
  });

  // =========================================
  // VALIDATION
  // =========================================
  describe('Validation', () => {
    it('should throw if URL is not set', () => {
      expect(() =>
        new HttpRequestBuilder().build()
      ).toThrow('URL is required');
    });

    it('should throw if URL is empty string', () => {
      expect(() =>
        new HttpRequestBuilder().setUrl('').build()
      ).toThrow('URL is required');
    });

    it('should throw if method is invalid', () => {
      expect(() =>
        new HttpRequestBuilder()
          .setUrl('https://api.com')
          .setMethod('INVALID' as any)
          .build()
      ).toThrow('Invalid HTTP method: INVALID');
    });

    it('should throw if timeout is zero or negative', () => {
      expect(() =>
        new HttpRequestBuilder()
          .setUrl('https://api.com')
          .setTimeout(0)
          .build()
      ).toThrow('Timeout must be positive');

      expect(() =>
        new HttpRequestBuilder()
          .setUrl('https://api.com')
          .setTimeout(-100)
          .build()
      ).toThrow('Timeout must be positive');
    });

    it('should accept valid HTTP methods', () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

      methods.forEach((method) => {
        const request = new HttpRequestBuilder()
          .setUrl('https://api.com')
          .setMethod(method)
          .build();

        expect(request.method).toBe(method);
      });
    });
  });

  // =========================================
  // HEADERS
  // =========================================
  describe('Headers', () => {
    it('should accumulate multiple headers', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addHeader('Content-Type', 'application/json')
        .addHeader('Accept', 'application/json')
        .addHeader('X-Custom', 'value')
        .build();

      expect(Object.keys(request.headers)).toHaveLength(3);
      expect(request.headers['Content-Type']).toBe('application/json');
      expect(request.headers['Accept']).toBe('application/json');
      expect(request.headers['X-Custom']).toBe('value');
    });

    it('should overwrite header if same key is added twice', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addHeader('Authorization', 'Bearer old')
        .addHeader('Authorization', 'Bearer new')
        .build();

      expect(request.headers['Authorization']).toBe('Bearer new');
    });
  });

  // =========================================
  // QUERY PARAMS
  // =========================================
  describe('Query Params', () => {
    it('should accumulate multiple query params', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addQueryParam('page', '1')
        .addQueryParam('limit', '20')
        .addQueryParam('sort', 'name')
        .build();

      expect(Object.keys(request.queryParams)).toHaveLength(3);
      expect(request.queryParams['page']).toBe('1');
      expect(request.queryParams['limit']).toBe('20');
      expect(request.queryParams['sort']).toBe('name');
    });

    it('should overwrite param if same key is added twice', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addQueryParam('page', '1')
        .addQueryParam('page', '5')
        .build();

      expect(request.queryParams['page']).toBe('5');
    });
  });

  // =========================================
  // IMMUTABILITY
  // =========================================
  describe('Immutability', () => {
    it('should return a new object on each build', () => {
      const builder = new HttpRequestBuilder().setUrl('https://api.com');
      const r1 = builder.build();
      const r2 = builder.build();

      expect(r1).not.toBe(r2);
      expect(r1).toEqual(r2);
    });

    it('should not leak internal references (headers)', () => {
      const builder = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addHeader('Key', 'value');

      const request = builder.build();

      // Modificar el objeto retornado NO debe afectar al builder
      request.headers['Hacked'] = 'yes';

      const request2 = builder.build();
      expect(request2.headers['Hacked']).toBeUndefined();
    });

    it('should not leak internal references (queryParams)', () => {
      const builder = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addQueryParam('key', 'value');

      const request = builder.build();

      request.queryParams['hacked'] = 'yes';

      const request2 = builder.build();
      expect(request2.queryParams['hacked']).toBeUndefined();
    });
  });

  // =========================================
  // BUILDER REUSE
  // =========================================
  describe('Builder reuse', () => {
    it('should allow building multiple different requests from same base', () => {
      const baseBuilder = new HttpRequestBuilder()
        .setUrl('https://api.com/users')
        .addHeader('Authorization', 'Bearer token');

      // Primer request: GET (default)
      const getRequest = baseBuilder.build();

      // Cambiar método para segundo request
      const postRequest = baseBuilder
        .setMethod('POST')
        .setBody('{"name": "Juan"}')
        .build();

      expect(getRequest.method).toBe('GET');
      expect(getRequest.body).toBeNull();

      // NOTA: el builder MUTÓ su estado interno
      // postRequest refleja el estado actual del builder
      expect(postRequest.method).toBe('POST');
      expect(postRequest.body).toBe('{"name": "Juan"}');
    });
  });
});
```

---

## TEMPLATE (tu punto de partida)

```typescript
// ============================================
// http-request-builder.ts
// Builder que construye objetos HttpRequest paso a paso
// ============================================

// ============================================
// TYPES
// ============================================

/**
 * Métodos HTTP válidos
 *
 * TODO: Definir el union type HttpMethod
 *       Valores: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
 */

// ============================================
// PRODUCT (objeto final que el builder crea)
// ============================================

/**
 * TODO: Definir la interface HttpRequest
 *
 * DEBE tener:
 * - url: string
 * - method: HttpMethod
 * - headers: Record<string, string>
 *   (Record<string, string> = objeto donde keys y values son strings)
 *   (ej: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ...' })
 * - body: string | null
 * - timeout: number
 * - queryParams: Record<string, string>
 */

// ============================================
// BUILDER
// ============================================

/**
 * TODO: Implementar HttpRequestBuilder
 *
 * Estado interno (propiedades privadas):
 * - url: string (iniciar vacío '')
 * - method: HttpMethod (iniciar 'GET')
 * - headers: Record<string, string> (iniciar {})
 * - body: string | null (iniciar null)
 * - timeout: number (iniciar 30000)
 * - queryParams: Record<string, string> (iniciar {})
 *
 * Métodos fluent (TODOS retornan this):
 *
 *   setUrl(url: string): HttpRequestBuilder
 *     - Guarda la url
 *
 *   setMethod(method: HttpMethod): HttpRequestBuilder
 *     - Guarda el método
 *
 *   addHeader(key: string, value: string): HttpRequestBuilder
 *     - Agrega header al objeto de headers
 *     - Si la key ya existe, sobreescribe el valor
 *
 *   setBody(body: string): HttpRequestBuilder
 *     - Guarda el body
 *
 *   setTimeout(ms: number): HttpRequestBuilder
 *     - Guarda el timeout en milisegundos
 *
 *   addQueryParam(key: string, value: string): HttpRequestBuilder
 *     - Agrega query param al objeto
 *     - Si la key ya existe, sobreescribe el valor
 *
 *   build(): HttpRequest
 *     - Valida:
 *       - URL no vacía → throw Error('URL is required')
 *       - Method válido (GET|POST|PUT|DELETE|PATCH) → throw Error('Invalid HTTP method: {method}')
 *       - Timeout > 0 → throw Error('Timeout must be positive')
 *     - Retorna objeto HttpRequest con COPIAS de headers y queryParams
 *       (usar spread { ...this.headers } para evitar leak de referencias)
 */
```

---

## 💡 HINTS (solo si te trabás >15 min)

**Hint 1:** Cada método fluent tiene exactamente la misma estructura: guardar el valor + `return this`. No compliques lo simple.

**Hint 2:** Para validar que el método HTTP es válido en `build()`, podés crear un array de métodos válidos y usar `.includes()`. Algo como: `const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']` y verificar si el method está en ese array.

**Hint 3:** Los tests de inmutabilidad verifican que `build()` retorna COPIAS de headers y queryParams, no las referencias directas del builder. Usá spread: `{ ...this.headers }`. Si retornás `this.headers` directamente, modificar el objeto retornado cambiaría el estado interno del builder.

---

## ✅ CHECKLIST DÍA 3

- [ ] Leíste y entendés el ejemplo de QueryBuilder completo
- [ ] Entendés fluent API (return this)
- [ ] Entendés la diferencia entre builder (mutable) y product (inmutable)
- [ ] Implementaste HttpRequestBuilder con TDD
- [ ] Todos los tests pasan (~25 tests)
- [ ] Entendés por qué build() retorna copias y no referencias
- [ ] Commit pusheado

**Cuando todos los tests estén en verde → avisame y avanzamos al Día 4-5: Mini-proyecto integrador creacional.**
