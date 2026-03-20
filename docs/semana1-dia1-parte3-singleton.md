# Semana 1 - Día 1 - Parte 3: Singleton Pattern

## ⏱️ TIEMPO ESTIMADO: 2 horas

---

## 🎯 OBJETIVO

Entender qué problema resuelve Singleton, cuándo usarlo (y cuándo NO), e implementar uno completo con TDD.

---

## ¿QUÉ PROBLEMA RESUELVE SINGLETON?

**El problema:**

Imaginá que tenés una aplicación con 15 módulos diferentes. Todos necesitan acceder a la configuración de la app (puerto del servidor, URL de la base de datos, modo debug, etc.).

```
SIN Singleton:

  Módulo A → new Config()  → { port: 3000, debug: true }
  Módulo B → new Config()  → { port: 3000, debug: true }   ← COPIA SEPARADA
  Módulo C → new Config()  → { port: 3000, debug: true }   ← OTRA COPIA

  Módulo A cambia debug a false...
  Módulo B sigue con debug: true  ← INCONSISTENCIA
  Módulo C sigue con debug: true  ← INCONSISTENCIA

  Problema: 3 instancias = 3 estados diferentes = CAOS
```

```
CON Singleton:

  Módulo A → Config.getInstance()  → { port: 3000, debug: true }
  Módulo B → Config.getInstance()  → MISMA instancia ← apunta al mismo objeto
  Módulo C → Config.getInstance()  → MISMA instancia ← apunta al mismo objeto

  Módulo A cambia debug a false...
  Módulo B ve debug: false  ← CONSISTENTE
  Módulo C ve debug: false  ← CONSISTENTE

  Solución: 1 sola instancia = 1 solo estado = CONSISTENCIA
```

**Singleton garantiza que una clase tenga UNA SOLA instancia en toda la aplicación, y provee un punto de acceso global a ella.**

---

## ANALOGÍA: El Presidente de un País

```
- Un país tiene UN SOLO presidente a la vez
- No podés crear "otro presidente" independiente
- Todos los ciudadanos acceden al MISMO presidente
- Si el presidente cambia de opinión, TODOS lo ven

Presidente.getInstance() → siempre el mismo
new Presidente()          → PROHIBIDO (constructor privado)
```

---

## DIAGRAMA DE ESTRUCTURA

```
┌─────────────────────────────────────────────┐
│              Singleton                       │
├─────────────────────────────────────────────┤
│ - instance: Singleton    ← única instancia  │
│                            (private static) │
│ - datos: cualquier tipo  ← estado interno   │
├─────────────────────────────────────────────┤
│ - constructor()          ← PRIVADO          │
│   (nadie puede llamar new)                  │
│                                             │
│ + getInstance(): Singleton  ← PÚBLICO       │
│   (único punto de acceso)                   │
│                                             │
│ + métodosDeNegocio()     ← lógica normal    │
├─────────────────────────────────────────────┤
│                                             │
│  FLUJO:                                     │
│                                             │
│  getInstance() {                            │
│    if (no existe instancia) {               │
│      crear instancia                        │
│    }                                        │
│    return instancia                         │
│  }                                          │
│                                             │
└─────────────────────────────────────────────┘

Clientes:

  Módulo A ──→ getInstance() ──┐
  Módulo B ──→ getInstance() ──┼──→ MISMA instancia
  Módulo C ──→ getInstance() ──┘
```

---

## CUÁNDO USAR SINGLETON

```
✅ USAR cuando:
  - Necesitás UNA SOLA instancia compartida (config, logger, cache)
  - El estado debe ser consistente en toda la app
  - Recurso costoso que no querés duplicar (conexión a DB)
  - Punto de acceso global controlado

❌ NO USAR cuando:
  - Cada módulo necesita su propia instancia
  - No hay estado compartido
  - Solo querés "comodidad" de acceso global (usá inyección de dependencias)
  - Hace que el testing sea difícil (por eso agregamos resetInstance)
```

---

## EJEMPLO RESUELTO: ConfigManager

Estudiá este código línea por línea. Es la referencia completa del patrón.

### config-manager.ts

```typescript
// ============================================
// EJEMPLO RESUELTO: ConfigManager Singleton
// Maneja la configuración global de una aplicación
// ============================================

// Interfaz que define la estructura de configuración
// Todas las propiedades son opcionales porque se pueden cargar parcialmente
interface AppConfig {
  port: number;
  dbUrl: string;
  debug: boolean;
  maxConnections: number;
}

export class ConfigManager {
  // ============================================
  // LA CLAVE DEL SINGLETON: instancia privada estática
  // ============================================

  // "private" → nadie fuera de la clase puede acceder
  // "static"  → pertenece a la CLASE, no a una instancia
  //             (existe aunque no haya ninguna instancia creada)
  // Es el "lugar" donde se guarda la única instancia
  private static instance: ConfigManager | null = null;

  // Estado interno: la configuración de la app
  // Es private porque solo se accede via get/set
  private config: AppConfig;

  // ============================================
  // CONSTRUCTOR PRIVADO
  // ============================================
  // "private" → nadie puede hacer "new ConfigManager()"
  // Solo la propia clase puede crear instancias (dentro de getInstance)
  private constructor() {
    // Valores por defecto
    this.config = {
      port: 3000,
      dbUrl: 'localhost:5432',
      debug: false,
      maxConnections: 10,
    };
  }

  // ============================================
  // PUNTO DE ACCESO GLOBAL
  // ============================================
  // "static" → se llama en la CLASE: ConfigManager.getInstance()
  //            NO en una instancia: config.getInstance()
  //
  // Flujo:
  //   1. ¿Ya existe instancia? → retornarla
  //   2. ¿No existe? → crearla, guardarla, retornarla
  //   3. Próxima vez → ya existe, retorna la misma
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // ============================================
  // RESET PARA TESTING
  // ============================================
  // En tests necesitamos empezar "limpio" (sin instancia previa)
  // Sin esto, un test podría contaminar al siguiente
  // En producción NUNCA se usa, solo en tests
  static resetInstance(): void {
    ConfigManager.instance = null;
  }

  // ============================================
  // MÉTODOS DE NEGOCIO (la funcionalidad real)
  // ============================================

  // Obtener un valor de configuración
  // Usa keyof AppConfig → solo acepta keys válidas de AppConfig
  // Retorna el tipo correcto según la key (number, string, boolean)
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  // Establecer un valor de configuración
  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
  }

  // Cargar múltiples configuraciones de golpe
  // Partial<AppConfig> → todas las props son opcionales
  // Solo sobreescribe las que recibe, mantiene las demás
  load(config: Partial<AppConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Obtener toda la configuración (copia, no referencia)
  // Spread (...) crea copia para evitar modificación directa desde afuera
  getAll(): AppConfig {
    return { ...this.config };
  }
}
```

### config-manager.test.ts

```typescript
// ============================================
// TESTS: ConfigManager Singleton
// Demuestran el comportamiento completo del patrón
// ============================================

import { ConfigManager } from './config-manager';

describe('ConfigManager Singleton', () => {
  // CRÍTICO: resetear antes de CADA test
  // Sin esto, la instancia de un test "contamina" al siguiente
  beforeEach(() => {
    ConfigManager.resetInstance();
  });

  // -------------------------------------------
  // Tests del patrón Singleton
  // -------------------------------------------
  describe('Singleton behavior', () => {
    it('should return the same instance', () => {
      // Arrange & Act
      const instance1 = ConfigManager.getInstance();
      const instance2 = ConfigManager.getInstance();

      // Assert - toBe compara por REFERENCIA (===)
      // Si son la misma referencia → son el mismo objeto en memoria
      expect(instance1).toBe(instance2);
    });

    it('should share state between references', () => {
      // Arrange
      const instance1 = ConfigManager.getInstance();
      const instance2 = ConfigManager.getInstance();

      // Act - modificar desde instance1
      instance1.set('debug', true);

      // Assert - instance2 ve el cambio (porque es el MISMO objeto)
      expect(instance2.get('debug')).toBe(true);
    });

    it('should create fresh instance after reset', () => {
      // Arrange
      const instance1 = ConfigManager.getInstance();
      instance1.set('port', 9999);

      // Act
      ConfigManager.resetInstance();
      const instance2 = ConfigManager.getInstance();

      // Assert - instance2 es NUEVA (valores por defecto)
      expect(instance2.get('port')).toBe(3000);
      // Y ya no es el mismo objeto que instance1
      expect(instance1).not.toBe(instance2);
    });
  });

  // -------------------------------------------
  // Tests de funcionalidad (métodos de negocio)
  // -------------------------------------------
  describe('Configuration management', () => {
    let config: ConfigManager;

    beforeEach(() => {
      config = ConfigManager.getInstance();
    });

    it('should have default values', () => {
      expect(config.get('port')).toBe(3000);
      expect(config.get('dbUrl')).toBe('localhost:5432');
      expect(config.get('debug')).toBe(false);
      expect(config.get('maxConnections')).toBe(10);
    });

    it('should set and get values', () => {
      config.set('port', 8080);
      expect(config.get('port')).toBe(8080);
    });

    it('should load partial config without losing existing values', () => {
      // Act - solo cambiar port y debug
      config.load({ port: 8080, debug: true });

      // Assert - port y debug cambiaron, el resto sigue igual
      expect(config.get('port')).toBe(8080);
      expect(config.get('debug')).toBe(true);
      expect(config.get('dbUrl')).toBe('localhost:5432');      // no cambió
      expect(config.get('maxConnections')).toBe(10);            // no cambió
    });

    it('should return a copy of config (not reference)', () => {
      const allConfig = config.getAll();

      // Modificar la copia no debería afectar al original
      allConfig.port = 9999;

      // El original sigue intacto
      expect(config.get('port')).toBe(3000);
    });
  });
});
```

---

## ¿QUÉ OBSERVAR DEL EJEMPLO?

```
1. CONSTRUCTOR PRIVADO
   → "new ConfigManager()" es imposible desde afuera
   → Solo getInstance() puede crear la instancia

2. INSTANCIA ESTÁTICA PRIVADA
   → La instancia vive en la CLASE, no en un objeto
   → Persiste durante toda la vida de la aplicación

3. getInstance() ES LAZY
   → No crea la instancia cuando la clase se carga
   → La crea la PRIMERA vez que alguien llama getInstance()
   → "Lazy initialization" = crear solo cuando se necesita

4. resetInstance() ES SOLO PARA TESTS
   → En producción, la instancia NUNCA se resetea
   → En tests, necesitás empezar limpio

5. toBe vs toEqual
   → toBe compara REFERENCIA (¿es el mismo objeto en memoria?)
   → toEqual compara CONTENIDO (¿tienen los mismos valores?)
   → Para verificar Singleton usamos toBe (debe ser la MISMA referencia)
```

---

## FLUJO VISUAL

```
Primera llamada: ConfigManager.getInstance()
  │
  ├─ instance === null?  → SÍ
  │   └─ new ConfigManager() → guarda en instance
  │   └─ return instance
  │
Segunda llamada: ConfigManager.getInstance()
  │
  ├─ instance === null?  → NO (ya existe)
  │   └─ return instance (la misma de antes)
  │
Módulo A: ConfigManager.getInstance() → referencia al objeto
Módulo B: ConfigManager.getInstance() → MISMA referencia
Módulo A cambia debug → Módulo B ve el cambio (mismo objeto)
```

---

---

# 🎯 EJERCICIO TDD: DatabaseConnection Singleton

## ⏱️ TIEMPO LÍMITE: 45 min

---

## CONSIGNA

Implementá un Singleton `DatabaseConnection` que simule una conexión a base de datos.

**Archivos a crear:**

```
src/1-creational/singleton/database-connection.ts       ← tu código
src/1-creational/singleton/database-connection.test.ts  ← tests (se dan listos)
```

---

## TESTS (copiá este archivo tal cual)

```typescript
// ============================================
// database-connection.test.ts
// Tests para DatabaseConnection Singleton
// TU OBJETIVO: hacer que TODOS estos tests pasen
// ============================================

import { DatabaseConnection } from './database-connection';

describe('DatabaseConnection Singleton', () => {
  // Reset antes de cada test para empezar limpio
  beforeEach(() => {
    DatabaseConnection.resetInstance();
  });

  // =========================================
  // SINGLETON BEHAVIOR
  // =========================================
  describe('Singleton behavior', () => {
    it('should return the same instance on multiple calls', () => {
      const db1 = DatabaseConnection.getInstance();
      const db2 = DatabaseConnection.getInstance();
      expect(db1).toBe(db2);
    });

    it('should create a new instance after reset', () => {
      const db1 = DatabaseConnection.getInstance();
      DatabaseConnection.resetInstance();
      const db2 = DatabaseConnection.getInstance();
      expect(db1).not.toBe(db2);
    });
  });

  // =========================================
  // CONNECTION MANAGEMENT
  // =========================================
  describe('Connection management', () => {
    let db: DatabaseConnection;

    beforeEach(() => {
      db = DatabaseConnection.getInstance();
    });

    it('should start disconnected', () => {
      expect(db.isConnected()).toBe(false);
    });

    it('should connect successfully', () => {
      db.connect('localhost:5432/mydb');
      expect(db.isConnected()).toBe(true);
    });

    it('should store the connection URL', () => {
      db.connect('localhost:5432/mydb');
      expect(db.getConnectionUrl()).toBe('localhost:5432/mydb');
    });

    it('should throw if connecting when already connected', () => {
      db.connect('localhost:5432/mydb');
      expect(() => db.connect('other-url')).toThrow('Already connected');
    });

    it('should disconnect successfully', () => {
      db.connect('localhost:5432/mydb');
      db.disconnect();
      expect(db.isConnected()).toBe(false);
    });

    it('should throw if disconnecting when not connected', () => {
      expect(() => db.disconnect()).toThrow('Not connected');
    });

    it('should allow reconnecting after disconnect', () => {
      db.connect('localhost:5432/mydb');
      db.disconnect();
      db.connect('localhost:3306/other');
      expect(db.isConnected()).toBe(true);
      expect(db.getConnectionUrl()).toBe('localhost:3306/other');
    });
  });

  // =========================================
  // QUERY EXECUTION
  // =========================================
  describe('Query execution', () => {
    let db: DatabaseConnection;

    beforeEach(() => {
      db = DatabaseConnection.getInstance();
    });

    it('should throw if querying when not connected', () => {
      expect(() => db.query('SELECT * FROM users')).toThrow('Not connected');
    });

    it('should execute a query and return result', () => {
      db.connect('localhost:5432/mydb');
      const result = db.query('SELECT * FROM users');

      // El resultado es un objeto con la query ejecutada y un timestamp
      expect(result).toHaveProperty('query', 'SELECT * FROM users');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('number');
    });

    it('should keep a history of executed queries', () => {
      db.connect('localhost:5432/mydb');
      db.query('SELECT * FROM users');
      db.query('INSERT INTO users VALUES (1)');
      db.query('DELETE FROM users WHERE id = 1');

      const history = db.getQueryHistory();
      expect(history).toHaveLength(3);
      expect(history[0]).toBe('SELECT * FROM users');
      expect(history[1]).toBe('INSERT INTO users VALUES (1)');
      expect(history[2]).toBe('DELETE FROM users WHERE id = 1');
    });

    it('should clear history on disconnect', () => {
      db.connect('localhost:5432/mydb');
      db.query('SELECT * FROM users');
      db.disconnect();

      expect(db.getQueryHistory()).toHaveLength(0);
    });
  });

  // =========================================
  // SHARED STATE
  // =========================================
  describe('Shared state across references', () => {
    it('should share connection state between references', () => {
      const db1 = DatabaseConnection.getInstance();
      const db2 = DatabaseConnection.getInstance();

      db1.connect('localhost:5432/mydb');

      // db2 ve la conexión porque es el MISMO objeto
      expect(db2.isConnected()).toBe(true);
      expect(db2.getConnectionUrl()).toBe('localhost:5432/mydb');
    });

    it('should share query history between references', () => {
      const db1 = DatabaseConnection.getInstance();
      const db2 = DatabaseConnection.getInstance();

      db1.connect('localhost:5432/mydb');
      db1.query('SELECT 1');

      // db2 ve el historial de db1
      expect(db2.getQueryHistory()).toHaveLength(1);
      expect(db2.getQueryHistory()[0]).toBe('SELECT 1');
    });
  });
});
```

---

## TEMPLATE (tu punto de partida)

```typescript
// ============================================
// database-connection.ts
// Singleton que simula una conexión a base de datos
// ============================================

// Interfaz para el resultado de una query
interface QueryResult {
  query: string;
  timestamp: number;
}

export class DatabaseConnection {
  // ============================================
  // SINGLETON INFRASTRUCTURE
  // ============================================

  /**
   * Instancia única de DatabaseConnection
   *
   * TODO: Declarar la propiedad estática privada
   *       Tipo: DatabaseConnection | null
   *       Valor inicial: null
   */

  // ============================================
  // ESTADO INTERNO
  // ============================================

  /**
   * TODO: Declarar propiedades privadas para:
   *   - connected: boolean (¿está conectado?)
   *   - url: string (URL de conexión)
   *   - queryHistory: string[] (historial de queries)
   */

  // ============================================
  // CONSTRUCTOR PRIVADO
  // ============================================

  /**
   * TODO: Implementar constructor privado
   *
   * DEBE:
   * - Ser private (nadie puede hacer new DatabaseConnection())
   * - Inicializar connected en false
   * - Inicializar url en string vacío
   * - Inicializar queryHistory como array vacío
   */

  // ============================================
  // SINGLETON METHODS
  // ============================================

  /**
   * Retorna la única instancia de DatabaseConnection
   *
   * TODO: Implementar getInstance()
   *
   * DEBE:
   * - Ser static y public
   * - Si no existe instancia → crear una nueva
   * - Si ya existe → retornar la existente
   * - Retornar tipo DatabaseConnection
   */

  /**
   * Resetea la instancia (solo para testing)
   *
   * TODO: Implementar resetInstance()
   *
   * DEBE:
   * - Ser static y public
   * - Poner la instancia en null
   * - No retornar nada (void)
   */

  // ============================================
  // CONNECTION METHODS
  // ============================================

  /**
   * Conecta a la base de datos
   *
   * TODO: Implementar connect(url)
   *
   * DEBE:
   * - Recibir url: string
   * - Si ya está conectado → throw Error('Already connected')
   * - Si no → guardar url, poner connected en true
   */

  /**
   * Desconecta de la base de datos
   *
   * TODO: Implementar disconnect()
   *
   * DEBE:
   * - Si no está conectado → throw Error('Not connected')
   * - Si sí → poner connected en false, limpiar url, limpiar historial
   */

  /**
   * Retorna si está conectado
   *
   * TODO: Implementar isConnected()
   *
   * DEBE:
   * - Retornar boolean
   */

  /**
   * Retorna la URL de conexión actual
   *
   * TODO: Implementar getConnectionUrl()
   *
   * DEBE:
   * - Retornar string (la url guardada)
   */

  // ============================================
  // QUERY METHODS
  // ============================================

  /**
   * Ejecuta una query
   *
   * TODO: Implementar query(sql)
   *
   * DEBE:
   * - Recibir sql: string
   * - Si no está conectado → throw Error('Not connected')
   * - Agregar la query al historial
   * - Retornar objeto QueryResult con:
   *   - query: la sql recibida
   *   - timestamp: Date.now()
   */

  /**
   * Retorna el historial de queries ejecutadas
   *
   * TODO: Implementar getQueryHistory()
   *
   * DEBE:
   * - Retornar copia del array de historial (spread [...])
   * - No retornar la referencia directa (para evitar modificación externa)
   */
}
```

---

## 💡 HINTS (solo si te trabás >15 min)

**Hint 1:** El patrón de Singleton tiene 3 piezas clave: propiedad `private static`, constructor `private`, y método `static getInstance()`. Mirá el ejemplo de ConfigManager como referencia directa.

**Hint 2:** Para `query()`, el objeto que retornás tiene que matchear la interface `QueryResult`. Pensá en `{ query: sql, timestamp: Date.now() }`.

**Hint 3:** `getQueryHistory()` debe retornar una copia, no la referencia directa. Usá spread: `return [...this.queryHistory]`. Esto evita que alguien haga `history.push('hack')` y modifique el estado interno.

---

## ✅ CHECKLIST PARTE 3

- [ ] Leíste y entendés el ejemplo de ConfigManager completo
- [ ] Entendés constructor privado + getInstance() + resetInstance()
- [ ] Implementaste DatabaseConnection con TDD
- [ ] Los 14 tests pasan (todos verdes)
- [ ] Entendés por qué toBe verifica que es la MISMA instancia
- [ ] Entendés por qué resetInstance es necesario para testing

**Cuando los 14 tests estén en verde → avisame y cerramos el Día 1 con un resumen + commit.**
