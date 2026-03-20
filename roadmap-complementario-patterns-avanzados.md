# ROADMAP COMPLEMENTARIO: Design Patterns Avanzados

## 📊 METADATA

**Objetivo:** Dominar los 7 patrones adicionales no cubiertos en el roadmap principal

**Prerequisitos:**
- ✅ Los 12 patrones del roadmap principal completados
- ✅ TDD dominado
- ✅ TypeScript avanzado

**Horas diarias disponibles:** 3-4 horas

**Duración estimada total:** 2 semanas (10 días, ~40 horas)

**Fecha de inicio:** Al completar el roadmap principal

**Enfoque determinado:** Mismo que el principal (TDD + Código puro + Casos reales)

**Número de semanas:** 2 semanas

**Justificación:**
- **Semana 5:** Creacionales + Estructural pendientes (3 patterns)
- **Semana 6:** Arquitecturales + Proyecto integrador (4 patterns)

Total: 7 patrones complementarios

---

## 🗺️ ESTRUCTURA COMPLETA

---

### SEMANA 5: Patrones Pendientes (Creacionales + Estructural)
**Duración:** 5 días (20 horas)
**Objetivo:** Completar los patrones clásicos del GoF que no se cubrieron

#### Día 1: Abstract Factory Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: crear FAMILIAS de objetos relacionados sin especificar clases concretas
- Diferencia con Factory Method: Factory crea UN tipo, Abstract Factory crea FAMILIAS
- Cuándo usar: themes de UI (cada theme = familia de botones + inputs + modals), cross-platform (cada OS = familia de componentes)
- Diagrama: AbstractFactory → ConcreteFactory1, ConcreteFactory2. Cada una crea ProductA + ProductB
- Ejemplo resuelto: UIComponentFactory (LightTheme y DarkTheme, cada uno crea Button + Input + Modal con su estilo)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: DatabaseFactory
  - AbstractFactory con métodos: createConnection, createQueryBuilder, createMigrator
  - PostgresFactory (crea PostgresConnection, PostgresQueryBuilder, PostgresMigrator)
  - MySQLFactory (crea MySQLConnection, MySQLQueryBuilder, MySQLMigrator)
  - Cada producto implementa su interface común
  - Tests: cada factory crea familia completa y consistente

**Checklist Día 1:**
- [ ] Entendés Abstract Factory vs Factory Method
- [ ] Implementaste DatabaseFactory con TDD
- [ ] Entendés concepto de "familias de objetos"
- [ ] Tests pasan

---

#### Día 2: Prototype Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: crear objetos clonando uno existente (evitar costo de creación desde cero)
- Cuándo usar: objetos costosos de crear, configuraciones base que se clonan y modifican, undo snapshots
- Concepto clave: deep clone vs shallow clone
- Diagrama: Prototype interface (clone()) ← ConcretePrototypes
- Ejemplo resuelto: DocumentTemplate (clonar templates predefinidos y modificarlos)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: GameCharacterPrototype
  - Interface Cloneable<T> con método clone(): T
  - Character con stats complejos (health, attack, defense, inventory, skills)
  - CharacterRegistry que almacena prototipos base (Warrior, Mage, Rogue)
  - Clonar prototipo + customizar sin afectar el original
  - Tests: clonación profunda, independencia entre clon y original, registry

**Parte 3: Caso real (30 min)**
- Caso: ConfigPresets (clonar configuraciones base y modificar para cada ambiente)

**Checklist Día 2:**
- [ ] Entendés Prototype y deep clone
- [ ] Implementaste GameCharacterPrototype con TDD
- [ ] Entendés cuándo Prototype vs Builder vs Factory
- [ ] Tests pasan

---

#### Día 3: Composite Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: tratar objetos individuales y composiciones de objetos de la misma forma
- Cuándo usar: estructuras de árbol (filesystem, menús, organigramas, UI components)
- Diagrama: Component interface ← Leaf + Composite (contiene children de tipo Component)
- Analogía: carpetas y archivos, ambos son "items" del filesystem
- Ejemplo resuelto: FileSystem (File y Directory, ambos implementan FileSystemItem)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: MenuSystem
  - Interface MenuItem con métodos: getName, getPrice, print, isComposite
  - SimpleItem (Leaf): un plato individual con nombre y precio
  - MenuCategory (Composite): contiene items y/o subcategorías
  - Métodos en Composite: add, remove, getChild, getTotalPrice (recursivo)
  - Tests: items simples, categorías, anidamiento, precio total recursivo

**Parte 3: Caso real (30 min)**
- Caso: OrganizationChart (Employee y Department, calcular salario total recursivo)

**Checklist Día 3:**
- [ ] Entendés Composite y estructuras de árbol
- [ ] Implementaste MenuSystem con TDD
- [ ] Entendés Leaf vs Composite y recursión
- [ ] Tests pasan

---

#### Día 4: Chain of Responsibility Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: request debe pasar por múltiples handlers en secuencia
- Cuándo usar: middleware (Express.js), validación en cadena, pipelines de procesamiento
- Diagrama: Handler interface (setNext, handle) → Handler1 → Handler2 → Handler3
- Conexión con industria: Express middleware es EXACTAMENTE este patrón
- Ejemplo resuelto: AuthenticationChain (ValidateToken → CheckPermissions → RateLimit)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: ValidationPipeline
  - Interface Handler<T> con setNext y handle
  - Abstract BaseHandler<T> con lógica de cadena
  - Validators: RequiredFieldsValidator, EmailFormatValidator, PasswordStrengthValidator, AgeRangeValidator
  - Cada validator verifica su parte y pasa al siguiente o retorna error
  - Tests: cada validator individual, cadena completa, orden importa

**Parte 3: Caso real (30 min)**
- Caso: LoggingPipeline (Debug → Info → Warning → Error, cada nivel decide si procesa o pasa)

**Checklist Día 4:**
- [ ] Entendés Chain of Responsibility
- [ ] Implementaste ValidationPipeline con TDD
- [ ] Conectás con middleware de Express
- [ ] Tests pasan

---

#### Día 5: Mini-proyecto integrador

**Duración:** 3-4 horas

**Proyecto: Content Management System**
- Combina Abstract Factory + Prototype + Composite + Chain of Responsibility
- ContentFactory (AbstractFactory) crea familias de contenido (Blog, News, cada una con Article + Media + Comment)
- ContentTemplate (Prototype) para clonar templates predefinidos
- ContentTree (Composite) para organizar contenido en categorías anidadas
- PublishingPipeline (Chain) para validar → formatear → aprobar → publicar
- Tests completos

**Checklist Semana 5:**
- [ ] Abstract Factory: familias de objetos relacionados
- [ ] Prototype: clonación de objetos complejos
- [ ] Composite: estructuras de árbol uniformes
- [ ] Chain of Responsibility: pipelines de procesamiento
- [ ] Mini-proyecto integrador completo
- [ ] Commit pusheado

---

### SEMANA 6: Patrones Arquitecturales + Proyecto Final
**Duración:** 5 días (20 horas)
**Objetivo:** Dominar patrones de arquitectura de software

#### Día 6: Repository Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: desacoplar la lógica de negocio de la capa de datos
- Cuándo usar: cualquier app con persistencia (DB, API, archivo, memoria)
- Diagrama: BusinessLogic → Repository interface ← InMemoryRepo, DatabaseRepo, APIRepo
- Conexión con TypeScript Essentials: ya hiciste Repository<T>, ahora lo formalizás
- Ejemplo resuelto: UserRepository con interface + InMemoryImplementation + filtros avanzados

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: Multi-storage ProductRepository
  - Interface Repository<T> con CRUD + findBy + query
  - InMemoryRepository<T> (implementación con Map)
  - LocalStorageRepository<T> (simulada, usa objeto como storage)
  - Ambas implementan la misma interface
  - Poder cambiar implementación sin cambiar código de negocio
  - Tests: mismos tests pasan con ambas implementaciones

**Checklist Día 6:**
- [ ] Entendés Repository como abstracción de datos
- [ ] Implementaste multi-storage Repository con TDD
- [ ] Entendés cómo desacopla negocio de persistencia
- [ ] Tests pasan

---

#### Día 7: Dependency Injection (DI)

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: clases crean sus propias dependencias (acoplamiento alto, difícil de testear)
- Cuándo usar: SIEMPRE en código profesional (es principio, no solo patrón)
- Sin DI vs con DI: comparación directa con código
- Tipos: constructor injection, method injection, property injection
- Ejemplo resuelto: UserService que recibe Repository y Logger por constructor (en vez de crearlos internamente)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: ServiceContainer
  - Container que registra y resuelve dependencias
  - register<T>(token, factory) y resolve<T>(token)
  - Soporte para singletons (registerSingleton)
  - OrderService que depende de Repository + PaymentService + NotificationService
  - Tests: registrar, resolver, singleton vs transient, inyectar en servicios

**Parte 3: Caso real (30 min)**
- Caso: Testing con mocks (inyectar mock de Repository en vez del real)

**Checklist Día 7:**
- [ ] Entendés DI y por qué es fundamental
- [ ] Implementaste ServiceContainer con TDD
- [ ] Entendés constructor injection
- [ ] Sabés usar DI para facilitar testing con mocks
- [ ] Tests pasan

---

#### Día 8: Unit of Work Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: múltiples operaciones de datos que deben ser atómicas (todas o ninguna)
- Cuándo usar: transacciones, batch operations, operaciones que deben ser consistentes
- Diagrama: UnitOfWork registra cambios → commit() aplica todos o rollback() revierte todos
- Analogía: carrito de compras (agregás items, y al final confirmás o cancelás TODO)
- Ejemplo resuelto: UnitOfWork con registerNew, registerDirty, registerDeleted, commit, rollback

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: TransactionalUnitOfWork
  - Interface UnitOfWork con registerNew, registerDirty, registerDeleted, commit, rollback
  - InMemoryUnitOfWork que trackea cambios pendientes
  - Integración con Repository (al commit, aplica cambios al repo)
  - Si algo falla en commit, rollback automático
  - Tests: register + commit, register + rollback, error durante commit

**Checklist Día 8:**
- [ ] Entendés Unit of Work y transacciones
- [ ] Implementaste TransactionalUnitOfWork con TDD
- [ ] Entendés commit/rollback
- [ ] Tests pasan

---

#### Día 9-10: Proyecto Integrador Final

**Duración:** 2 días (6-8 horas)

**Proyecto: Inventory Management System**
- Combina Repository + DI + Unit of Work + patrones del roadmap principal
- ProductRepository y OrderRepository (Repository pattern)
- ServiceContainer para inyectar dependencias (DI)
- OrderTransaction con Unit of Work (crear orden + actualizar stock + registrar pago de forma atómica)
- Factory para crear diferentes tipos de productos
- Observer para notificar cambios de stock
- Strategy para diferentes políticas de pricing

**Features MVP:**
- Día 9: Repositories + ServiceContainer + DI wiring + tests
- Día 10: UnitOfWork en OrderTransaction + Observer stock + Strategy pricing + integración + tests

**Checklist Semana 6:**
- [ ] Repository: abstracción de capa de datos
- [ ] DI: inversión de dependencias
- [ ] Unit of Work: operaciones atómicas
- [ ] Proyecto integrador final completo
- [ ] Commit pusheado

---

## ⏱️ TIMELINE GLOBAL

```
SEMANA 5 (Días 1-5): Creacionales + Estructural pendientes
├── Día 1:   Abstract Factory
├── Día 2:   Prototype
├── Día 3:   Composite
├── Día 4:   Chain of Responsibility
├── Día 5:   Mini-proyecto integrador

SEMANA 6 (Días 6-10): Arquitecturales + Proyecto Final
├── Día 6:   Repository
├── Día 7:   Dependency Injection
├── Día 8:   Unit of Work
├── Día 9-10: Proyecto integrador final
```

**Total estimado:** 2 semanas (~40 horas)

---

## 🎯 RESUMEN DE PATRONES

### Semana 5 - Pendientes:
| Patrón | Categoría | Problema que resuelve |
|--------|-----------|----------------------|
| Abstract Factory | Creacional | Familias de objetos relacionados |
| Prototype | Creacional | Clonar objetos costosos |
| Composite | Estructural | Tratar árboles uniformemente |
| Chain of Responsibility | Comportamiento | Pipelines de handlers |

### Semana 6 - Arquitecturales:
| Patrón | Categoría | Problema que resuelve |
|--------|-----------|----------------------|
| Repository | Arquitectural | Desacoplar datos de negocio |
| Dependency Injection | Arquitectural | Invertir dependencias |
| Unit of Work | Arquitectural | Operaciones atómicas |

---

## ✅ CHECKLIST FINAL (AL COMPLETAR)

**Patrones adicionales dominados (7):**
- [ ] Abstract Factory
- [ ] Prototype
- [ ] Composite
- [ ] Chain of Responsibility
- [ ] Repository
- [ ] Dependency Injection
- [ ] Unit of Work

**Total combinado con roadmap principal: 19 patrones**

**Listo para:**
- [ ] ✅ Arquitectura de microservicios
- [ ] ✅ Backend profesional (Node.js + Express)
- [ ] ✅ ORMs y bases de datos (Repository + UoW)
- [ ] ✅ Testing avanzado con DI y mocks
- [ ] ✅ Cualquier framework o lenguaje (patrones son universales)

---

**FIN DEL ROADMAP COMPLEMENTARIO**

**Duración total:** 2 semanas (~40 horas)
**Prerequisito:** Roadmap principal de 12 patrones completado
**Nivel de salida:** Senior+ en arquitectura de software
**Total acumulado:** 6 semanas, 19 patrones, ~120 horas
