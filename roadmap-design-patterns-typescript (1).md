# ROADMAP: Design Patterns con TypeScript + TDD

## 📊 METADATA

**Objetivo:** Dominar los 12 patrones de diseño más importantes de la industria usando TypeScript y TDD

**Prerequisitos:**
- ✅ JavaScript ES6+ dominado
- ✅ Async JavaScript (Promises, async/await)
- ✅ MVC pattern familiar (ya aplicado en proyectos)
- ✅ TypeScript Essentials completado (types, interfaces, generics, classes, abstract, implements)

**Horas diarias disponibles:** 3-4 horas

**Duración estimada total:** 4 semanas (20 días laborables, ~80 horas)

**Fecha de inicio:** A definir

**Enfoque determinado:** TDD + Código puro + Casos reales de industria

**Justificación del enfoque:**
- TDD (Test-Driven Development): escribir tests ANTES de implementar
- Sin HTML/CSS: solo lógica pura (superpoderes arquitecturales)
- TypeScript: interfaces y contratos explícitos hacen los patrones más claros
- Casos reales de industria: payment processors, loggers, caches, notificaciones
- Cada patrón = teoría + ejemplo resuelto + ejercicio TDD + caso real
- Templates con TODOs (el estudiante programa, no copia)

**Número de semanas:** 4 semanas

**Justificación:**
- **Semana 1:** Patrones Creacionales (3 patterns) + TDD workflow
- **Semana 2:** Patrones Estructurales (4 patterns)
- **Semana 3:** Patrones de Comportamiento (5 patterns)
- **Semana 4:** Proyectos integradores progresivos (combinan múltiples patterns)

Total: 12 patrones core (el 90% que usás en la industria)

---

## 🗺️ ESTRUCTURA COMPLETA DEL ENTRENAMIENTO

---

### SEMANA 1: Patrones Creacionales + TDD Foundations
**Duración:** 5 días (20 horas)
**Objetivo:** Dominar creación de objetos + Establecer workflow TDD

#### Día 1: Setup + TDD Workflow + Singleton Pattern

**Duración:** 3-4 horas

**Parte 1: Setup del proyecto (30 min)**
- Crear nuevo repo: design-patterns-ts
- Estructura de carpetas por categoría (creational/, structural/, behavioral/)
- Subcarpeta por patrón (singleton/, factory/, etc.)
- Reutilizar config de TypeScript Essentials (tsconfig, jest, scripts)
- Dependencias adicionales: uuid (generación de IDs únicos)

**Parte 2: TDD Workflow - Red/Green/Refactor (30 min)**
- Concepto: escribir test que falla → código mínimo para pasar → refactorizar
- Ejemplo guiado paso a paso con Calculator
- Reglas estrictas de TDD
- Jest matchers avanzados (toThrow, toBeInstanceOf, toHaveBeenCalled)

**Parte 3: Singleton Pattern (2 horas)**
- Teoría: qué problema resuelve, cuándo usar, cuándo NO usar
- Diagrama de estructura
- Ejemplo resuelto: ConfigManager (config global de app)
- Ejercicio TDD: DatabaseConnection singleton
  - Constructor privado
  - getInstance() estático
  - Métodos de negocio (connect, disconnect, query)
  - resetInstance() para testing
- Caso real: Logger singleton

**Checklist Día 1:**
- [ ] Proyecto configurado y funcionando
- [ ] Entendés TDD (Red/Green/Refactor)
- [ ] Singleton implementado con TDD
- [ ] Entendés constructor privado + getInstance()
- [ ] Tests pasan

---

#### Día 2: Factory Method Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: crear objetos sin especificar la clase exacta
- Cuándo usar: múltiples tipos de objetos con misma interfaz
- Diagrama: Creator → ConcreteCreator, Product → ConcreteProduct
- Ejemplo resuelto: NotificationFactory (Email, SMS, Push)
- Comparación: sin Factory vs con Factory

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: PaymentProcessorFactory
  - Interface PaymentProcessor (processPayment, refund, getInfo)
  - CreditCardProcessor, PayPalProcessor, CryptoProcessor
  - PaymentFactory con método create(type)
  - Tests completos con TDD

**Parte 3: Caso real (30 min)**
- Caso: DocumentExporter (PDF, CSV, JSON exporters con misma interfaz)

**Checklist Día 2:**
- [ ] Entendés Factory Method y cuándo usarlo
- [ ] Implementaste PaymentProcessorFactory con TDD
- [ ] Entendés la diferencia entre Factory y new directo
- [ ] Tests pasan

---

#### Día 3: Builder Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: objetos complejos con muchos parámetros opcionales
- Cuándo usar: 5+ parámetros, muchos opcionales, fluent API
- Diagrama de estructura
- Concepto clave: fluent API (métodos que retornan this para encadenar)
- Ejemplo resuelto: QueryBuilder (SELECT, FROM, WHERE, ORDER BY, LIMIT)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: HttpRequestBuilder
  - Métodos: setUrl, setMethod, addHeader, setBody, setTimeout, addQueryParam
  - build() retorna objeto HttpRequest inmutable
  - Validaciones (url obligatoria, method por defecto GET)
  - Fluent API completa
  - Tests completos con TDD

**Parte 3: Caso real (30 min)**
- Caso: EmailBuilder (to, from, subject, body, attachments, priority)

**Checklist Día 3:**
- [ ] Entendés Builder y fluent API
- [ ] Implementaste HttpRequestBuilder con TDD
- [ ] Entendés cuándo Builder vs constructor normal
- [ ] Tests pasan

---

#### Día 4-5: Mini-proyecto integrador creacional

**Duración:** 6-8 horas (2 días)

**Proyecto: Configuration & Service System**
- Combina Singleton + Factory + Builder
- ConfigManager (Singleton) que carga configuración
- ServiceFactory que crea servicios según config (Factory)
- RequestBuilder que construye requests para los servicios (Builder)
- Tests completos de todo el sistema
- Scope completo definido al inicio, NO se modifica después

**Features MVP:**
- ConfigManager con load/get/set de configuración
- ServiceFactory que crea EmailService, SmsService, PushService
- Cada servicio tiene interface común (send, getStatus)
- RequestBuilder para construir mensajes a enviar
- Tests: unitarios por clase + integración del sistema

**Cronograma:**
- Día 4: Implementar ConfigManager + ServiceFactory + tests
- Día 5: Implementar RequestBuilder + integración + tests finales

**Checklist Semana 1:**
- [ ] TDD workflow dominado (Red/Green/Refactor)
- [ ] Singleton: constructor privado, getInstance, resetInstance
- [ ] Factory: interfaz común, creación desacoplada
- [ ] Builder: fluent API, objetos complejos paso a paso
- [ ] Mini-proyecto integrador completo con tests
- [ ] Commit pusheado

---

### SEMANA 2: Patrones Estructurales
**Duración:** 5 días (20 horas)
**Objetivo:** Dominar composición y adaptación de objetos

#### Día 6: Adapter Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: dos interfaces incompatibles que deben trabajar juntas
- Cuándo usar: integrar librerías externas, migrar APIs, conectar sistemas legacy
- Diagrama: Client → Target interface ← Adapter → Adaptee
- Analogía: enchufe europeo con adaptador para tomacorriente argentino
- Ejemplo resuelto: PaymentGatewayAdapter (OldAPI → NewAPI)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: WeatherServiceAdapter
  - Interface TemperatureService (getTempCelsius, getHumidity, getDescription)
  - ExternalWeatherAPI (clase existente con interfaz diferente: fetchWeatherData retorna objeto crudo)
  - WeatherAdapter que adapta ExternalWeatherAPI a TemperatureService
  - Tests completos con TDD

**Parte 3: Caso real (30 min)**
- Caso: LoggerAdapter (adaptar console.log, Winston, o cualquier logger a interface común)

**Checklist Día 6:**
- [ ] Entendés Adapter y cuándo usarlo
- [ ] Implementaste WeatherServiceAdapter con TDD
- [ ] Entendés Target, Adapter, Adaptee
- [ ] Tests pasan

---

#### Día 7: Decorator Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: agregar funcionalidad a objetos SIN modificar su código
- Cuándo usar: logging, caching, validación, retry, compression
- Diagrama: Component interface ← ConcreteComponent, BaseDecorator ← ConcreteDecorators
- Concepto clave: decorators se envuelven como capas de cebolla
- Ejemplo resuelto: DataSource con EncryptionDecorator y CompressionDecorator

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: NotificationService con decorators
  - Interface Notifier (send, getHistory)
  - BasicNotifier (implementación base)
  - LoggingDecorator (agrega logging a cada operación)
  - RetryDecorator (reintenta si falla, con máximo de intentos)
  - RateLimitDecorator (limita cantidad de envíos por minuto)
  - Tests: cada decorator individual + combinaciones encadenadas

**Parte 3: Caso real (30 min)**
- Caso: API Client con CacheDecorator + LoggingDecorator

**Checklist Día 7:**
- [ ] Entendés Decorator y encadenamiento de decorators
- [ ] Implementaste NotificationService con 3 decorators
- [ ] Entendés diferencia entre Decorator y herencia
- [ ] Tests pasan

---

#### Día 8: Facade Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: sistema complejo con muchas clases, cliente necesita interfaz simple
- Cuándo usar: simplificar subsistemas, crear API pública limpia
- Diagrama: Client → Facade → Subsystem classes
- Analogía: control remoto del TV (un botón, muchos procesos internos)
- Ejemplo resuelto: VideoConverter facade (codec, audio, video, format internos)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: CheckoutFacade
  - Subsistemas: InventoryService, PaymentService, ShippingService, EmailService
  - CheckoutFacade con método checkout(order) que orquesta todos los subsistemas
  - Cada subsistema tiene su propia lógica (verificar stock, procesar pago, calcular envío, enviar confirmación)
  - Tests: subsistemas individuales + facade completo

**Parte 3: Caso real (30 min)**
- Caso: UserRegistrationFacade (validar, crear usuario, enviar email, crear perfil)

**Checklist Día 8:**
- [ ] Entendés Facade y cuándo usarlo
- [ ] Implementaste CheckoutFacade con TDD
- [ ] Entendés diferencia entre Facade y otros patrones
- [ ] Tests pasan

---

#### Día 9: Proxy Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: controlar acceso a un objeto (lazy loading, caching, access control, logging)
- Cuándo usar: objetos costosos, control de acceso, logging transparente
- Diagrama: Client → Proxy → RealSubject (misma interface)
- Concepto clave: el proxy tiene la MISMA interface que el objeto real
- Ejemplo resuelto: ImageProxy (lazy loading - carga imagen solo cuando se necesita)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: CachingProxy para servicio de datos
  - Interface DataService (fetchData, getData, clearCache)
  - RealDataService (simulación de servicio lento)
  - CachingProxy (cachea resultados, TTL configurable, cache invalidation)
  - AccessControlProxy (verifica permisos antes de acceder)
  - Tests: proxy vs real service, cache hits/misses, TTL expiration

**Parte 3: Caso real (30 min)**
- Caso: LoggingProxy (intercepta llamadas y las loggea transparentemente)

**Checklist Día 9:**
- [ ] Entendés Proxy y sus variantes (cache, access, logging, lazy)
- [ ] Implementaste CachingProxy con TDD
- [ ] Entendés diferencia entre Proxy y Decorator
- [ ] Tests pasan

---

#### Día 10: Mini-proyecto integrador estructural

**Duración:** 3-4 horas

**Proyecto: API Gateway System**
- Combina Adapter + Decorator + Facade + Proxy
- Múltiples APIs externas con interfaces diferentes (Adapter)
- Logging y retry en cada llamada (Decorator)
- Interface unificada para el cliente (Facade)
- Cache de respuestas (Proxy)
- Tests completos

**Features MVP:**
- 2-3 servicios externos simulados con interfaces distintas
- Adapters que los unifican a interface común
- Decorators de logging y retry
- Facade que expone métodos simples al cliente
- CachingProxy en la capa de datos
- Tests unitarios + integración

**Checklist Semana 2:**
- [ ] Adapter: conectar interfaces incompatibles
- [ ] Decorator: agregar funcionalidad sin modificar código
- [ ] Facade: simplificar subsistemas complejos
- [ ] Proxy: controlar acceso con misma interface
- [ ] Mini-proyecto integrador completo
- [ ] Commit pusheado

---

### SEMANA 3: Patrones de Comportamiento
**Duración:** 5 días (20 horas)
**Objetivo:** Dominar comunicación entre objetos y algoritmos intercambiables

#### Día 11: Strategy Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: necesitás intercambiar algoritmos en runtime sin cambiar el código cliente
- Cuándo usar: múltiples formas de hacer lo mismo (ordenar, calcular, validar)
- Diagrama: Context → Strategy interface ← ConcreteStrategies
- Analogía: GPS con opciones de ruta (más rápida, más corta, sin peajes)
- Ejemplo resuelto: ShippingCalculator con estrategias (standard, express, overnight)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: DiscountSystem
  - Interface DiscountStrategy (calculate, getDescription)
  - PercentageDiscount, FixedAmountDiscount, BuyOneGetOneFree, SeasonalDiscount
  - DiscountContext que aplica la estrategia activa
  - Poder cambiar estrategia en runtime
  - Tests: cada estrategia + cambio dinámico

**Parte 3: Caso real (30 min)**
- Caso: SortingStrategy (bubble, quick, merge sort con misma interface)

**Checklist Día 11:**
- [ ] Entendés Strategy y cuándo usarlo
- [ ] Implementaste DiscountSystem con TDD
- [ ] Entendés intercambio de algoritmos en runtime
- [ ] Tests pasan

---

#### Día 12: Observer Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: objeto cambia de estado y necesita notificar a otros automáticamente
- Cuándo usar: eventos, notificaciones, data binding, pub/sub
- Diagrama: Subject (subscribe, unsubscribe, notify) → Observers
- Conexión con MVC: ya usaste Observer en tus proyectos anteriores (refuerzo)
- Ejemplo resuelto: EventEmitter genérico tipado

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: StockMarket notification system
  - Interface Observer<T> (update con dato tipado)
  - StockExchange (Subject) que mantiene precios
  - PriceAlert observer (notifica cuando precio cruza umbral)
  - TradingBot observer (ejecuta trades automáticos según reglas)
  - NewsDisplay observer (muestra actualizaciones)
  - Tests: subscribe, unsubscribe, notify, múltiples observers

**Parte 3: Caso real (30 min)**
- Caso: FormValidator con observers (campo cambia → validaciones se ejecutan)

**Checklist Día 12:**
- [ ] Entendés Observer y pub/sub
- [ ] Implementaste StockMarket system con TDD
- [ ] Entendés subscribe/unsubscribe/notify
- [ ] Conectás Observer con MVC que ya conocés
- [ ] Tests pasan

---

#### Día 13: Command Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: encapsular acciones como objetos (undo/redo, queue, logging)
- Cuándo usar: undo/redo, transacciones, command queues, macro recording
- Diagrama: Invoker → Command interface (execute, undo) ← ConcreteCommands → Receiver
- Analogía: orden en un restaurante (mesero = invoker, orden = command, cocina = receiver)
- Ejemplo resuelto: TextEditor con WriteCommand, EraseCommand + undo/redo

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: BankAccount transaction system
  - Interface Command (execute, undo, describe)
  - DepositCommand, WithdrawCommand, TransferCommand
  - BankAccount (receiver) con balance
  - TransactionHistory (invoker) con execute, undo, redo, getHistory
  - Tests: execute, undo, redo, history completo

**Parte 3: Caso real (30 min)**
- Caso: TaskQueue (encolar commands y ejecutarlos secuencialmente)

**Checklist Día 13:**
- [ ] Entendés Command y undo/redo
- [ ] Implementaste BankAccount transactions con TDD
- [ ] Entendés Invoker, Command, Receiver
- [ ] Tests pasan

---

#### Día 14: State Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: objeto cambia comportamiento según su estado interno (evitar if/switch gigantes)
- Cuándo usar: state machines, flujos con estados definidos
- Diagrama: Context → State interface ← ConcreteStates
- Conexión con enums del Día 2 de TS: OrderStatus → ahora cada estado es una clase
- Ejemplo resuelto: TrafficLight (Red, Yellow, Green states con transiciones)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: OrderStateMachine
  - States: PendingState, ConfirmedState, ShippedState, DeliveredState, CancelledState
  - Cada estado define qué acciones son válidas y a qué estado transiciona
  - Order (context) delega acciones al estado actual
  - Tests: transiciones válidas, transiciones inválidas, flujo completo

**Parte 3: Caso real (30 min)**
- Caso: MediaPlayer states (Idle, Playing, Paused, Stopped)

**Checklist Día 14:**
- [ ] Entendés State y state machines
- [ ] Implementaste OrderStateMachine con TDD
- [ ] Entendés diferencia entre State y Strategy
- [ ] Tests pasan

---

#### Día 15: Template Method Pattern

**Duración:** 3-4 horas

**Parte 1: Teoría + Ejemplo resuelto (1.5 horas)**
- Problema: algoritmo con pasos fijos pero algunos pasos varían según implementación
- Cuándo usar: frameworks, workflows, pipelines con pasos customizables
- Diagrama: AbstractClass (templateMethod + abstract steps) ← ConcreteClasses
- Conexión con abstract classes del Día 3 de TS (refuerzo directo)
- Ejemplo resuelto: DataMiner (mine, parse, analyze, report - pasos fijos, implementación variable)

**Parte 2: Ejercicio TDD (1.5 horas)**
- Ejercicio: ReportGenerator
  - Abstract class ReportGenerator con templateMethod generateReport()
  - Pasos fijos: gatherData → processData → formatOutput → deliver
  - PDFReportGenerator (implementa pasos para PDF)
  - HTMLReportGenerator (implementa pasos para HTML)
  - CSVReportGenerator (implementa pasos para CSV)
  - Hook methods opcionales: addHeader(), addFooter()
  - Tests: cada generator + que template method ejecuta pasos en orden

**Parte 3: Caso real (30 min)**
- Caso: TestFramework (setup → run → teardown como template method)

**Checklist Día 15:**
- [ ] Entendés Template Method y hook methods
- [ ] Implementaste ReportGenerator con TDD
- [ ] Entendés diferencia entre Template Method y Strategy
- [ ] Tests pasan

**Checklist Semana 3:**
- [ ] Strategy: algoritmos intercambiables en runtime
- [ ] Observer: notificaciones automáticas entre objetos
- [ ] Command: acciones como objetos con undo/redo
- [ ] State: comportamiento que cambia según estado
- [ ] Template Method: algoritmo con pasos customizables
- [ ] Commit pusheado

---

### SEMANA 4: Proyectos Integradores Progresivos
**Duración:** 5 días (20 horas)
**Objetivo:** Integrar múltiples patrones en proyectos reales con complejidad creciente

**Filosofía:** NO es un solo proyecto gigante. Son 3 proyectos completos de complejidad creciente. Cada uno se completa al 100% antes de avanzar al siguiente.

---

#### Proyecto Integrador 1: Task Automation System (Días 16-17)
**Duración:** 2 días (6-8 horas)
**Patterns:** Singleton + Factory + Strategy + Observer

**Qué construís:**
- Sistema de automatización de tareas con diferentes estrategias de ejecución
- Config global (Singleton)
- Factory que crea diferentes tipos de tasks
- Strategies para diferentes formas de ejecutar (sequential, parallel, priority)
- Observer para notificar progreso y completitud

**Features MVP:**
- TaskConfig (Singleton) con configuración global
- TaskFactory que crea tasks según tipo (EmailTask, ReportTask, BackupTask)
- ExecutionStrategy (SequentialStrategy, PriorityStrategy)
- TaskRunner que ejecuta tasks con la estrategia activa
- ProgressObserver que notifica cada cambio de estado
- Tests unitarios + integración

**Cronograma:**
- Día 16: TaskConfig + TaskFactory + tests
- Día 17: ExecutionStrategy + TaskRunner + ProgressObserver + integración + tests

---

#### Proyecto Integrador 2: E-Commerce Checkout (Días 18-19)
**Duración:** 2 días (6-8 horas)
**Patterns:** Builder + Adapter + Decorator + Facade + Command

**Qué construís:**
- Sistema de checkout de e-commerce con múltiples payment gateways
- OrderBuilder para construir órdenes complejas (Builder)
- PaymentAdapters para diferentes gateways (Adapter)
- Logging y validación en cada operación (Decorator)
- CheckoutFacade que simplifica el proceso (Facade)
- OrderCommands con undo para cancelaciones (Command)

**Features MVP:**
- OrderBuilder (items, shipping, discounts, payment method)
- 2 PaymentAdapters (StripeAdapter, PayPalAdapter) con interface común
- ValidationDecorator + LoggingDecorator en payment processing
- CheckoutFacade (placeOrder, cancelOrder, getOrderStatus)
- PlaceOrderCommand y CancelOrderCommand con undo
- Tests unitarios + integración

**Cronograma:**
- Día 18: OrderBuilder + PaymentAdapters + Decorators + tests
- Día 19: CheckoutFacade + Commands + integración + tests

---

#### Proyecto Integrador 3: Document Workflow Engine (Día 20)
**Duración:** 1 día (3-4 horas)
**Patterns:** State + Template Method + Proxy + Observer

**Qué construís:**
- Motor de workflow de documentos con estados y procesamiento
- Document con StateMachine (Draft → Review → Approved → Published) (State)
- DocumentProcessor con pasos fijos pero variaciones por tipo (Template Method)
- CachingProxy para documentos pesados (Proxy)
- WorkflowObserver para notificaciones de cambios de estado (Observer)

**Features MVP:**
- DocumentStateMachine con transiciones válidas/inválidas
- MarkdownProcessor y HTMLProcessor (Template Method)
- DocumentCacheProxy con TTL
- WorkflowNotifier observer
- Tests unitarios + integración

---

**Checklist Semana 4:**
- [ ] Proyecto 1 completo: Singleton + Factory + Strategy + Observer
- [ ] Proyecto 2 completo: Builder + Adapter + Decorator + Facade + Command
- [ ] Proyecto 3 completo: State + Template Method + Proxy + Observer
- [ ] Todos los patrones aplicados en contexto real
- [ ] Tests completos en los 3 proyectos
- [ ] Commits pusheados

---

## 🎯 RESUMEN DE PATRONES POR SEMANA

### Semana 1 - Creacionales:
| Patrón | Problema que resuelve | Ejemplo del entrenamiento |
|--------|----------------------|--------------------------|
| Singleton | Una sola instancia global | ConfigManager, DatabaseConnection |
| Factory Method | Crear objetos sin especificar clase exacta | PaymentProcessorFactory |
| Builder | Construir objetos complejos paso a paso | HttpRequestBuilder, QueryBuilder |

### Semana 2 - Estructurales:
| Patrón | Problema que resuelve | Ejemplo del entrenamiento |
|--------|----------------------|--------------------------|
| Adapter | Interfaces incompatibles trabajen juntas | WeatherServiceAdapter |
| Decorator | Agregar funcionalidad sin modificar código | NotificationService + decorators |
| Facade | Simplificar subsistemas complejos | CheckoutFacade |
| Proxy | Controlar acceso a un objeto | CachingProxy, AccessControlProxy |

### Semana 3 - Comportamiento:
| Patrón | Problema que resuelve | Ejemplo del entrenamiento |
|--------|----------------------|--------------------------|
| Strategy | Intercambiar algoritmos en runtime | DiscountSystem |
| Observer | Notificar cambios automáticamente | StockMarket notifications |
| Command | Encapsular acciones + undo/redo | BankAccount transactions |
| State | Comportamiento según estado interno | OrderStateMachine |
| Template Method | Algoritmo con pasos customizables | ReportGenerator |

### Semana 4 - Integración:
| Proyecto | Patrones combinados |
|----------|-------------------|
| Task Automation | Singleton + Factory + Strategy + Observer |
| E-Commerce Checkout | Builder + Adapter + Decorator + Facade + Command |
| Document Workflow | State + Template Method + Proxy + Observer |

---

## ⏱️ TIMELINE GLOBAL

```
SEMANA 1 (Días 1-5): Creacionales + TDD
├── Día 1:   Setup + TDD + Singleton
├── Día 2:   Factory Method
├── Día 3:   Builder
├── Día 4-5: Mini-proyecto integrador creacional

SEMANA 2 (Días 6-10): Estructurales
├── Día 6:   Adapter
├── Día 7:   Decorator
├── Día 8:   Facade
├── Día 9:   Proxy
├── Día 10:  Mini-proyecto integrador estructural

SEMANA 3 (Días 11-15): Comportamiento
├── Día 11:  Strategy
├── Día 12:  Observer
├── Día 13:  Command
├── Día 14:  State
├── Día 15:  Template Method

SEMANA 4 (Días 16-20): Integradores
├── Día 16-17: Proyecto 1 - Task Automation
├── Día 18-19: Proyecto 2 - E-Commerce Checkout
├── Día 20:    Proyecto 3 - Document Workflow
```

**Total estimado:** 4 semanas (~80 horas)

---

## 📂 ESTRUCTURA DE CARPETAS DEL PROYECTO

```
design-patterns-ts/
├── src/
│   ├── creational/
│   │   ├── singleton/
│   │   │   ├── singleton.ts
│   │   │   ├── singleton.test.ts
│   │   │   └── examples/
│   │   │       ├── config-manager.ts
│   │   │       └── config-manager.test.ts
│   │   ├── factory/
│   │   │   ├── factory.ts
│   │   │   ├── factory.test.ts
│   │   │   └── examples/
│   │   │       ├── payment-processor.ts
│   │   │       └── payment-processor.test.ts
│   │   └── builder/
│   │       ├── builder.ts
│   │       ├── builder.test.ts
│   │       └── examples/
│   │           ├── http-request-builder.ts
│   │           └── http-request-builder.test.ts
│   │
│   ├── structural/
│   │   ├── adapter/
│   │   │   ├── adapter.ts
│   │   │   ├── adapter.test.ts
│   │   │   └── examples/
│   │   ├── decorator/
│   │   │   ├── decorator.ts
│   │   │   ├── decorator.test.ts
│   │   │   └── examples/
│   │   ├── facade/
│   │   │   ├── facade.ts
│   │   │   ├── facade.test.ts
│   │   │   └── examples/
│   │   └── proxy/
│   │       ├── proxy.ts
│   │       ├── proxy.test.ts
│   │       └── examples/
│   │
│   ├── behavioral/
│   │   ├── strategy/
│   │   │   ├── strategy.ts
│   │   │   ├── strategy.test.ts
│   │   │   └── examples/
│   │   ├── observer/
│   │   │   ├── observer.ts
│   │   │   ├── observer.test.ts
│   │   │   └── examples/
│   │   ├── command/
│   │   │   ├── command.ts
│   │   │   ├── command.test.ts
│   │   │   └── examples/
│   │   ├── state/
│   │   │   ├── state.ts
│   │   │   ├── state.test.ts
│   │   │   └── examples/
│   │   └── template-method/
│   │       ├── template-method.ts
│   │       ├── template-method.test.ts
│   │       └── examples/
│   │
│   └── integrators/
│       ├── project-1-task-automation/
│       │   ├── ... (archivos del proyecto)
│       │   └── ... (tests)
│       ├── project-2-ecommerce-checkout/
│       │   ├── ...
│       │   └── ...
│       └── project-3-document-workflow/
│           ├── ...
│           └── ...
│
├── docs/                    ← Guías del entrenamiento (.md)
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

---

## 📋 FORMATO DE CADA DÍA DE PATRÓN

Cada día de patrón sigue esta estructura al generarse:

```
Parte 1: Teoría (archivo .md descargable)
  - Qué problema resuelve
  - Cuándo usar / cuándo NO usar
  - Diagrama ASCII de estructura
  - Analogía
  - Ejemplo resuelto completo comentado línea por línea

Parte 2: Ejercicio TDD (archivo .md descargable)
  - Tests completos (se dan listos)
  - Template con TODOs (el estudiante implementa)
  - Hints conceptuales (sin código completo)
  - Caso real adicional
```

El estudiante pide cada parte cuando está listo. No se genera todo de golpe.

---

## 📝 NOTAS

- Este roadmap es la estructura completa del entrenamiento
- Cada día se genera el contenido al momento (no todo de golpe)
- Al continuar en nuevos chats, referenciar: "Semana X - Día Y - Patrón Z"
- El roadmap NO se modifica, es referencia estática
- Los patrones omitidos (Abstract Factory, Prototype, Composite, Chain of Responsibility, Repository, DI, Unit of Work) pueden agregarse como entrenamiento futuro una vez dominados los 12 core
- Governor activo: máximo 2 iteraciones por ejercicio, 2 días por proyecto integrador

---

## ✅ CHECKLIST FINAL (AL COMPLETAR 4 SEMANAS)

**Patrones dominados (12):**
- [ ] Singleton
- [ ] Factory Method
- [ ] Builder
- [ ] Adapter
- [ ] Decorator
- [ ] Facade
- [ ] Proxy
- [ ] Strategy
- [ ] Observer
- [ ] Command
- [ ] State
- [ ] Template Method

**Habilidades:**
- [ ] TDD workflow automático (Red/Green/Refactor)
- [ ] Identificar qué patrón usar según el problema
- [ ] Combinar múltiples patrones en un sistema
- [ ] Tests completos con alta cobertura
- [ ] Arquitectura profesional en TypeScript

**Proyectos completados:**
- [ ] 12 ejercicios de patrones individuales
- [ ] 3 mini-proyectos integradores semanales
- [ ] 3 proyectos integradores finales
- [ ] 300+ tests escritos

**Listo para:**
- [ ] ✅ React (los patrones aparecen en hooks, context, state management)
- [ ] ✅ Node.js / Express (middleware = Chain, DI, Repository)
- [ ] ✅ Cualquier framework (los patrones son universales)
- [ ] ✅ Entrevistas técnicas (pregunta favorita: "¿qué patrón usarías?")
- [ ] ✅ Arquitectura de software profesional

---

**FIN DEL ROADMAP**

**Duración total:** 4 semanas (~80 horas)
**Nivel de salida:** Senior en Design Patterns
**Formato:** TDD + Código puro + Tests (sin HTML/CSS)
**Herramientas:** NPM + Jest + TypeScript
**Patrones:** 12 core (90% de lo que usás en la industria)
