# Semana 1 - Días 4-5: Mini-Proyecto Integrador Creacional

## ⏱️ DURACIÓN: 2 días (6-8 horas total)

---

## 🎯 ¿QUÉ VAS A CONSTRUIR?

Un **sistema de configuración y envío de notificaciones** que combina los 3 patrones creacionales:

```
┌─────────────────────────────────────────────────────────────┐
│              NOTIFICATION SYSTEM                             │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ AppConfig    │    │ Service      │    │ Message      │  │
│  │ (Singleton)  │───→│ Factory      │    │ Builder      │  │
│  │              │    │              │    │              │  │
│  │ Configuración│    │ Crea el      │    │ Construye    │  │
│  │ global       │    │ servicio     │    │ el mensaje   │  │
│  │ de la app    │    │ correcto     │    │ paso a paso  │  │
│  └──────────────┘    └──────┬───────┘    └──────┬───────┘  │
│                             │                    │          │
│                             ▼                    ▼          │
│                    ┌──────────────┐      ┌──────────────┐  │
│                    │ EmailService │      │ MessagePayload│  │
│                    │ SmsService   │◄─────│ (objeto final)│  │
│                    │ PushService  │ send │              │  │
│                    └──────────────┘      └──────────────┘  │
│                                                             │
│  FLUJO:                                                     │
│  1. AppConfig carga configuración (qué servicios hay)      │
│  2. ServiceFactory crea el servicio según la config         │
│  3. MessageBuilder construye el mensaje a enviar            │
│  4. El servicio envía el mensaje                            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ FEATURES (MVP)

### Must Have:
- [ ] AppConfig (Singleton) con load/get/set de configuración
- [ ] ServiceFactory que crea EmailService, SmsService, PushService
- [ ] Cada servicio implementa interfaz común (send, getStatus, getType)
- [ ] MessageBuilder que construye mensajes con fluent API
- [ ] Tests unitarios por clase
- [ ] Tests de integración del sistema completo

### Nice to Have (si sobra tiempo):
- [ ] Método en AppConfig para listar servicios habilitados
- [ ] Validación en Factory de que el servicio esté enabled en config

---

## 🏗️ ESTRUCTURA DE ARCHIVOS

```
src/1-creational/integrator/
├── app-config.ts              ← Singleton
├── app-config.test.ts
├── service-factory.ts         ← Factory (+ clases de servicios)
├── service-factory.test.ts
├── message-builder.ts         ← Builder
├── message-builder.test.ts
├── integration.test.ts        ← Tests de integración
└── types.ts                   ← Interfaces compartidas
```

Creá la carpeta:

```bash
mkdir -p src/1-creational/integrator
```

---

## 📅 CRONOGRAMA

### DÍA 4: AppConfig (Singleton) + ServiceFactory (Factory) + tests
### DÍA 5: MessageBuilder (Builder) + Integración + tests finales

---

---

# DÍA 4: Singleton + Factory

---

## PASO 1: Types compartidos (types.ts)

Este archivo define las interfaces que usan todos los módulos. **Copialo tal cual.**

```typescript
// ============================================
// types.ts
// Interfaces compartidas del sistema
// ============================================

// ============================================
// CONFIGURACIÓN
// ============================================

// Configuración específica de un servicio de notificación
export interface ServiceConfig {
  type: 'email' | 'sms' | 'push';
  enabled: boolean;
  priority: number;             // 1 = máxima, 10 = mínima
  settings: Record<string, string>;  // Config específica del servicio
}

// Configuración global de la aplicación
export interface AppConfiguration {
  appName: string;
  environment: 'development' | 'staging' | 'production';
  services: Record<string, ServiceConfig>;  // key = nombre del servicio
  defaultTimeout: number;
}

// ============================================
// MENSAJES
// ============================================

// Prioridad del mensaje
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

// Payload completo de un mensaje (lo que construye el Builder)
export interface MessagePayload {
  readonly to: string;
  readonly subject: string;
  readonly body: string;
  readonly priority: MessagePriority;
  readonly metadata: Readonly<Record<string, string>>;
  readonly timestamp: number;
}

// ============================================
// SERVICIOS
// ============================================

// Tipos de servicio disponibles
export type ServiceType = 'email' | 'sms' | 'push';

// Resultado de enviar un mensaje
export interface SendResult {
  success: boolean;
  serviceType: ServiceType;
  messageId?: string;
  timestamp?: number;
  error?: string;
}

// Contrato que TODOS los servicios de notificación deben cumplir
export interface NotificationService {
  send(message: MessagePayload): SendResult;
  getStatus(): 'idle' | 'ready' | 'error';
  getType(): ServiceType;
  getName(): string;
}
```

---

## PASO 2: AppConfig — Tests

```typescript
// ============================================
// app-config.test.ts
// Tests para AppConfig Singleton
// ============================================

import { AppConfig } from './app-config';
import type { AppConfiguration } from './types';

describe('AppConfig Singleton', () => {
  beforeEach(() => {
    AppConfig.resetInstance();
  });

  // =========================================
  // SINGLETON BEHAVIOR
  // =========================================
  describe('Singleton behavior', () => {
    it('should return the same instance', () => {
      const c1 = AppConfig.getInstance();
      const c2 = AppConfig.getInstance();
      expect(c1).toBe(c2);
    });

    it('should create fresh instance after reset', () => {
      const c1 = AppConfig.getInstance();
      AppConfig.resetInstance();
      const c2 = AppConfig.getInstance();
      expect(c1).not.toBe(c2);
    });

    it('should share state between references', () => {
      const c1 = AppConfig.getInstance();
      const c2 = AppConfig.getInstance();
      c1.set('appName', 'TestApp');
      expect(c2.get('appName')).toBe('TestApp');
    });
  });

  // =========================================
  // DEFAULT VALUES
  // =========================================
  describe('Default values', () => {
    it('should have default configuration', () => {
      const config = AppConfig.getInstance();
      const all = config.getAll();

      expect(all.appName).toBe('MyApp');
      expect(all.environment).toBe('development');
      expect(all.defaultTimeout).toBe(5000);
      expect(all.services).toEqual({});
    });
  });

  // =========================================
  // GET / SET
  // =========================================
  describe('get/set', () => {
    let config: AppConfig;

    beforeEach(() => {
      config = AppConfig.getInstance();
    });

    it('should set and get appName', () => {
      config.set('appName', 'NewApp');
      expect(config.get('appName')).toBe('NewApp');
    });

    it('should set and get environment', () => {
      config.set('environment', 'production');
      expect(config.get('environment')).toBe('production');
    });

    it('should set and get defaultTimeout', () => {
      config.set('defaultTimeout', 10000);
      expect(config.get('defaultTimeout')).toBe(10000);
    });
  });

  // =========================================
  // LOAD
  // =========================================
  describe('load()', () => {
    let config: AppConfig;

    beforeEach(() => {
      config = AppConfig.getInstance();
    });

    it('should load partial config without losing existing values', () => {
      config.load({ appName: 'LoadedApp', environment: 'staging' });

      expect(config.get('appName')).toBe('LoadedApp');
      expect(config.get('environment')).toBe('staging');
      expect(config.get('defaultTimeout')).toBe(5000);  // no cambió
    });

    it('should load services config', () => {
      config.load({
        services: {
          mainEmail: {
            type: 'email',
            enabled: true,
            priority: 1,
            settings: { server: 'smtp.gmail.com', port: '587' },
          },
          backupSms: {
            type: 'sms',
            enabled: false,
            priority: 2,
            settings: { provider: 'twilio' },
          },
        },
      });

      const services = config.get('services');
      expect(services['mainEmail']).toBeDefined();
      expect(services['mainEmail'].type).toBe('email');
      expect(services['mainEmail'].enabled).toBe(true);
      expect(services['backupSms'].enabled).toBe(false);
    });
  });

  // =========================================
  // GET ALL (inmutabilidad)
  // =========================================
  describe('getAll() immutability', () => {
    it('should return a copy of the config', () => {
      const config = AppConfig.getInstance();
      const all = config.getAll();
      all.appName = 'HACKED';

      expect(config.get('appName')).toBe('MyApp');
    });
  });

  // =========================================
  // SERVICE HELPERS
  // =========================================
  describe('Service helpers', () => {
    let config: AppConfig;

    beforeEach(() => {
      config = AppConfig.getInstance();
      config.load({
        services: {
          mainEmail: {
            type: 'email',
            enabled: true,
            priority: 1,
            settings: { server: 'smtp.gmail.com' },
          },
          backupSms: {
            type: 'sms',
            enabled: false,
            priority: 2,
            settings: { provider: 'twilio' },
          },
          mobilePush: {
            type: 'push',
            enabled: true,
            priority: 3,
            settings: { platform: 'firebase' },
          },
        },
      });
    });

    it('should get a specific service config', () => {
      const emailConfig = config.getServiceConfig('mainEmail');
      expect(emailConfig).toBeDefined();
      expect(emailConfig!.type).toBe('email');
      expect(emailConfig!.settings['server']).toBe('smtp.gmail.com');
    });

    it('should return undefined for non-existent service', () => {
      const config2 = config.getServiceConfig('nonExistent');
      expect(config2).toBeUndefined();
    });

    it('should list enabled services', () => {
      const enabled = config.getEnabledServices();
      expect(enabled).toHaveLength(2);

      const types = enabled.map((s) => s.type);
      expect(types).toContain('email');
      expect(types).toContain('push');
      expect(types).not.toContain('sms');  // disabled
    });

    it('should return enabled services sorted by priority', () => {
      const enabled = config.getEnabledServices();
      // priority 1 (email) antes que priority 3 (push)
      expect(enabled[0].type).toBe('email');
      expect(enabled[1].type).toBe('push');
    });
  });
});
```

---

## PASO 2: AppConfig — Template

```typescript
// ============================================
// app-config.ts
// Singleton que maneja la configuración global de la app
// ============================================

import type { AppConfiguration, ServiceConfig } from './types';

export class AppConfig {
  // ============================================
  // SINGLETON INFRASTRUCTURE
  // ============================================

  /**
   * TODO: Instancia estática privada
   */

  /**
   * TODO: Estado interno - objeto de configuración
   *
   * Tipo: AppConfiguration
   * Defaults:
   *   appName: 'MyApp'
   *   environment: 'development'
   *   services: {}
   *   defaultTimeout: 5000
   */

  /**
   * TODO: Constructor privado
   *       Inicializa this.config con los valores default
   */

  /**
   * TODO: getInstance()
   */

  /**
   * TODO: resetInstance()
   */

  // ============================================
  // CONFIG METHODS
  // ============================================

  /**
   * TODO: get(key) - Obtener valor de configuración
   *
   * Mismo approach que el ConfigManager del ejemplo del Día 1
   * Usa genéricos: get<K extends keyof AppConfiguration>(key: K): AppConfiguration[K]
   */

  /**
   * TODO: set(key, value) - Establecer valor de configuración
   *
   * Mismo approach con genéricos
   */

  /**
   * TODO: load(partial) - Cargar configuración parcial
   *
   * Recibe: Partial<AppConfiguration>
   * Usa spread para mergear: { ...this.config, ...partial }
   */

  /**
   * TODO: getAll() - Retorna copia completa de la config
   *
   * DEBE retornar copia profunda del objeto services
   * (spread simple no alcanza para objetos anidados)
   *
   * Approach: JSON.parse(JSON.stringify(this.config))
   * Es la forma más simple de deep clone
   */

  // ============================================
  // SERVICE HELPERS
  // ============================================

  /**
   * TODO: getServiceConfig(serviceName) - Obtener config de un servicio específico
   *
   * Recibe: string (nombre del servicio, ej: 'mainEmail')
   * Retorna: ServiceConfig | undefined
   * Buscar en this.config.services[serviceName]
   */

  /**
   * TODO: getEnabledServices() - Listar servicios habilitados
   *
   * Retorna: ServiceConfig[]
   * DEBE:
   * - Filtrar solo los que tienen enabled: true
   * - Ordenar por priority (menor número = mayor prioridad)
   *
   * Pasos:
   * 1. Object.values(this.config.services) → array de ServiceConfig
   * 2. .filter(s => s.enabled) → solo habilitados
   * 3. .sort((a, b) => a.priority - b.priority) → ordenar por prioridad
   */
}
```

---

## PASO 3: ServiceFactory — Tests

```typescript
// ============================================
// service-factory.test.ts
// Tests para ServiceFactory + Services
// ============================================

import { ServiceFactory, EmailService, SmsService, PushService } from './service-factory';
import type { NotificationService, ServiceType, MessagePayload } from './types';

// Helper: crea un MessagePayload válido para testing
function createTestMessage(overrides: Partial<MessagePayload> = {}): MessagePayload {
  return {
    to: 'user@test.com',
    subject: 'Test Subject',
    body: 'Test Body',
    priority: 'normal',
    metadata: {},
    timestamp: Date.now(),
    ...overrides,
  };
}

describe('ServiceFactory', () => {
  // =========================================
  // FACTORY CREATION
  // =========================================
  describe('create()', () => {
    it('should create EmailService for type "email"', () => {
      const service = ServiceFactory.create('email');
      expect(service).toBeInstanceOf(EmailService);
      expect(service.getType()).toBe('email');
    });

    it('should create SmsService for type "sms"', () => {
      const service = ServiceFactory.create('sms');
      expect(service).toBeInstanceOf(SmsService);
      expect(service.getType()).toBe('sms');
    });

    it('should create PushService for type "push"', () => {
      const service = ServiceFactory.create('push');
      expect(service).toBeInstanceOf(PushService);
      expect(service.getType()).toBe('push');
    });

    it('should throw for unknown service type', () => {
      expect(() =>
        ServiceFactory.create('fax' as ServiceType)
      ).toThrow('Unknown service type: fax');
    });

    it('should create new instances each time', () => {
      const s1 = ServiceFactory.create('email');
      const s2 = ServiceFactory.create('email');
      expect(s1).not.toBe(s2);
    });
  });

  // =========================================
  // SERVICE INTERFACE COMPLIANCE
  // =========================================
  describe('Interface compliance', () => {
    const types: ServiceType[] = ['email', 'sms', 'push'];

    types.forEach((type) => {
      describe(`${type} service`, () => {
        let service: NotificationService;

        beforeEach(() => {
          service = ServiceFactory.create(type);
        });

        it('should start with "idle" status', () => {
          expect(service.getStatus()).toBe('idle');
        });

        it('should have a name', () => {
          const name = service.getName();
          expect(typeof name).toBe('string');
          expect(name.length).toBeGreaterThan(0);
        });

        it('should return correct type', () => {
          expect(service.getType()).toBe(type);
        });
      });
    });
  });

  // =========================================
  // SEND MESSAGES
  // =========================================
  describe('send()', () => {
    const types: ServiceType[] = ['email', 'sms', 'push'];

    types.forEach((type) => {
      describe(`${type} service send`, () => {
        let service: NotificationService;

        beforeEach(() => {
          service = ServiceFactory.create(type);
        });

        it('should send a valid message successfully', () => {
          const message = createTestMessage();
          const result = service.send(message);

          expect(result.success).toBe(true);
          expect(result.serviceType).toBe(type);
          expect(result.messageId).toBeDefined();
          expect(typeof result.messageId).toBe('string');
          expect(result.timestamp).toBeDefined();
          expect(typeof result.timestamp).toBe('number');
        });

        it('should change status to "ready" after successful send', () => {
          const message = createTestMessage();
          service.send(message);
          expect(service.getStatus()).toBe('ready');
        });

        it('should fail if "to" is empty', () => {
          const message = createTestMessage({ to: '' });
          const result = service.send(message);

          expect(result.success).toBe(false);
          expect(result.error).toBe('Recipient is required');
        });

        it('should fail if "body" is empty', () => {
          const message = createTestMessage({ body: '' });
          const result = service.send(message);

          expect(result.success).toBe(false);
          expect(result.error).toBe('Message body is required');
        });

        it('should keep status as "idle" after failed send', () => {
          const message = createTestMessage({ to: '' });
          service.send(message);
          expect(service.getStatus()).toBe('idle');
        });
      });
    });
  });

  // =========================================
  // EMAIL SPECIFIC
  // =========================================
  describe('EmailService specifics', () => {
    let service: EmailService;

    beforeEach(() => {
      service = ServiceFactory.create('email') as EmailService;
    });

    it('should have name "Email Service"', () => {
      expect(service.getName()).toBe('Email Service');
    });

    it('should track sent messages count', () => {
      const msg = createTestMessage();
      service.send(msg);
      service.send(msg);
      service.send(msg);
      expect(service.getSentCount()).toBe(3);
    });

    it('should not count failed sends', () => {
      const badMsg = createTestMessage({ to: '' });
      service.send(badMsg);
      expect(service.getSentCount()).toBe(0);
    });
  });

  // =========================================
  // SMS SPECIFIC
  // =========================================
  describe('SmsService specifics', () => {
    let service: SmsService;

    beforeEach(() => {
      service = ServiceFactory.create('sms') as SmsService;
    });

    it('should have name "SMS Service"', () => {
      expect(service.getName()).toBe('SMS Service');
    });

    it('should fail if body exceeds 160 characters', () => {
      const longBody = 'A'.repeat(161);
      const message = createTestMessage({ body: longBody });
      const result = service.send(message);

      expect(result.success).toBe(false);
      expect(result.error).toBe('SMS body must be 160 characters or less');
    });

    it('should accept body of exactly 160 characters', () => {
      const body = 'A'.repeat(160);
      const message = createTestMessage({ body });
      const result = service.send(message);

      expect(result.success).toBe(true);
    });
  });

  // =========================================
  // PUSH SPECIFIC
  // =========================================
  describe('PushService specifics', () => {
    let service: PushService;

    beforeEach(() => {
      service = ServiceFactory.create('push') as PushService;
    });

    it('should have name "Push Service"', () => {
      expect(service.getName()).toBe('Push Service');
    });

    it('should fail if subject is empty', () => {
      const message = createTestMessage({ subject: '' });
      const result = service.send(message);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Push notification requires a subject');
    });
  });
});
```

---

## PASO 3: ServiceFactory — Template

```typescript
// ============================================
// service-factory.ts
// Factory que crea servicios de notificación
// ============================================

import { randomUUID } from 'crypto';
import type {
  NotificationService,
  ServiceType,
  MessagePayload,
  SendResult,
} from './types';

// ============================================
// IMPLEMENTACIONES DE SERVICIOS
// ============================================

/**
 * TODO: Implementar EmailService (implements NotificationService)
 *
 * Propiedades privadas:
 * - status: 'idle' | 'ready' | 'error' (iniciar 'idle')
 * - sentCount: number (iniciar 0)
 *
 * send(message):
 * - Validar: message.to vacío → { success: false, serviceType: 'email', error: 'Recipient is required' }
 * - Validar: message.body vacío → { success: false, serviceType: 'email', error: 'Message body is required' }
 * - Si válido:
 *   - Incrementar sentCount
 *   - Cambiar status a 'ready'
 *   - Retornar { success: true, serviceType: 'email', messageId: randomUUID(), timestamp: Date.now() }
 *
 * getStatus(): retorna this.status
 * getType(): retorna 'email'
 * getName(): retorna 'Email Service'
 * getSentCount(): retorna this.sentCount (método propio, no está en interface)
 */

/**
 * TODO: Implementar SmsService (implements NotificationService)
 *
 * Propiedades privadas:
 * - status: 'idle' | 'ready' | 'error' (iniciar 'idle')
 *
 * send(message):
 * - Validar: message.to vacío → { success: false, serviceType: 'sms', error: 'Recipient is required' }
 * - Validar: message.body vacío → { success: false, serviceType: 'sms', error: 'Message body is required' }
 * - Validar: message.body.length > 160 → { success: false, serviceType: 'sms', error: 'SMS body must be 160 characters or less' }
 * - Si válido:
 *   - Cambiar status a 'ready'
 *   - Retornar { success: true, serviceType: 'sms', messageId: randomUUID(), timestamp: Date.now() }
 *
 * getStatus(): retorna this.status
 * getType(): retorna 'sms'
 * getName(): retorna 'SMS Service'
 */

/**
 * TODO: Implementar PushService (implements NotificationService)
 *
 * Propiedades privadas:
 * - status: 'idle' | 'ready' | 'error' (iniciar 'idle')
 *
 * send(message):
 * - Validar: message.to vacío → { success: false, serviceType: 'push', error: 'Recipient is required' }
 * - Validar: message.body vacío → { success: false, serviceType: 'push', error: 'Message body is required' }
 * - Validar: message.subject vacío → { success: false, serviceType: 'push', error: 'Push notification requires a subject' }
 * - Si válido:
 *   - Cambiar status a 'ready'
 *   - Retornar { success: true, serviceType: 'push', messageId: randomUUID(), timestamp: Date.now() }
 *
 * getStatus(): retorna this.status
 * getType(): retorna 'push'
 * getName(): retorna 'Push Service'
 */

// ============================================
// FACTORY
// ============================================

/**
 * TODO: Implementar ServiceFactory
 *
 * static create(type: ServiceType): NotificationService
 *   - 'email' → new EmailService()
 *   - 'sms' → new SmsService()
 *   - 'push' → new PushService()
 *   - default → throw Error('Unknown service type: {type}')
 */
```

---

**Checkpoint Día 4:** Cuando AppConfig y ServiceFactory tengan todos los tests en verde, hacé commit y avisame para continuar con el Día 5.

---

---

# DÍA 5: Builder + Integración

---

## PASO 4: MessageBuilder — Tests

```typescript
// ============================================
// message-builder.test.ts
// Tests para MessageBuilder
// ============================================

import { MessageBuilder } from './message-builder';
import type { MessagePayload } from './types';

describe('MessageBuilder', () => {
  // =========================================
  // FLUENT API
  // =========================================
  describe('Fluent API', () => {
    it('should support full method chaining', () => {
      const message = new MessageBuilder()
        .to('user@test.com')
        .subject('Hello')
        .body('World')
        .priority('high')
        .addMetadata('source', 'test')
        .addMetadata('campaign', 'welcome')
        .build();

      expect(message.to).toBe('user@test.com');
      expect(message.subject).toBe('Hello');
      expect(message.body).toBe('World');
      expect(message.priority).toBe('high');
      expect(message.metadata).toEqual({
        source: 'test',
        campaign: 'welcome',
      });
    });

    it('should return the same builder instance', () => {
      const builder = new MessageBuilder();
      const returned = builder.to('user@test.com');
      expect(returned).toBe(builder);
    });
  });

  // =========================================
  // DEFAULTS
  // =========================================
  describe('Defaults', () => {
    it('should default priority to "normal"', () => {
      const message = new MessageBuilder()
        .to('user@test.com')
        .subject('Test')
        .body('Content')
        .build();

      expect(message.priority).toBe('normal');
    });

    it('should default metadata to empty object', () => {
      const message = new MessageBuilder()
        .to('user@test.com')
        .subject('Test')
        .body('Content')
        .build();

      expect(message.metadata).toEqual({});
    });

    it('should include a timestamp', () => {
      const before = Date.now();
      const message = new MessageBuilder()
        .to('user@test.com')
        .subject('Test')
        .body('Content')
        .build();
      const after = Date.now();

      expect(message.timestamp).toBeGreaterThanOrEqual(before);
      expect(message.timestamp).toBeLessThanOrEqual(after);
    });
  });

  // =========================================
  // VALIDATION
  // =========================================
  describe('Validation', () => {
    it('should throw if "to" is not set', () => {
      expect(() =>
        new MessageBuilder().subject('Test').body('Content').build()
      ).toThrow('Recipient (to) is required');
    });

    it('should throw if "to" is empty string', () => {
      expect(() =>
        new MessageBuilder().to('').subject('Test').body('Content').build()
      ).toThrow('Recipient (to) is required');
    });

    it('should throw if "subject" is not set', () => {
      expect(() =>
        new MessageBuilder().to('user@test.com').body('Content').build()
      ).toThrow('Subject is required');
    });

    it('should throw if "body" is not set', () => {
      expect(() =>
        new MessageBuilder().to('user@test.com').subject('Test').build()
      ).toThrow('Body is required');
    });

    it('should throw if priority is invalid', () => {
      expect(() =>
        new MessageBuilder()
          .to('user@test.com')
          .subject('Test')
          .body('Content')
          .priority('critical' as any)
          .build()
      ).toThrow('Invalid priority: critical');
    });
  });

  // =========================================
  // METADATA
  // =========================================
  describe('Metadata', () => {
    it('should accumulate multiple metadata entries', () => {
      const message = new MessageBuilder()
        .to('user@test.com')
        .subject('Test')
        .body('Content')
        .addMetadata('key1', 'value1')
        .addMetadata('key2', 'value2')
        .addMetadata('key3', 'value3')
        .build();

      expect(Object.keys(message.metadata)).toHaveLength(3);
    });

    it('should overwrite metadata with same key', () => {
      const message = new MessageBuilder()
        .to('user@test.com')
        .subject('Test')
        .body('Content')
        .addMetadata('key', 'old')
        .addMetadata('key', 'new')
        .build();

      expect(message.metadata['key']).toBe('new');
    });
  });

  // =========================================
  // IMMUTABILITY
  // =========================================
  describe('Immutability', () => {
    it('should return new object on each build', () => {
      const builder = new MessageBuilder()
        .to('user@test.com')
        .subject('Test')
        .body('Content');

      const m1 = builder.build();
      const m2 = builder.build();

      expect(m1).not.toBe(m2);
    });

    it('should not leak metadata reference', () => {
      const builder = new MessageBuilder()
        .to('user@test.com')
        .subject('Test')
        .body('Content')
        .addMetadata('key', 'value');

      const message = builder.build();

      // Intentar hackear el metadata del resultado
      (message.metadata as Record<string, string>)['hacked'] = 'yes';

      const message2 = builder.build();
      expect(message2.metadata['hacked']).toBeUndefined();
    });
  });
});
```

---

## PASO 4: MessageBuilder — Template

```typescript
// ============================================
// message-builder.ts
// Builder que construye MessagePayload paso a paso
// ============================================

import type { MessagePayload, MessagePriority } from './types';

/**
 * TODO: Implementar MessageBuilder
 *
 * Estado interno (propiedades privadas):
 * - _to: string (iniciar '')
 * - _subject: string (iniciar '')
 * - _body: string (iniciar '')
 * - _priority: MessagePriority (iniciar 'normal')
 * - _metadata: Record<string, string> (iniciar {})
 *
 * Métodos fluent (TODOS retornan this → MessageBuilder):
 *
 *   to(recipient: string): MessageBuilder
 *   subject(subject: string): MessageBuilder
 *   body(body: string): MessageBuilder
 *   priority(priority: MessagePriority): MessageBuilder
 *   addMetadata(key: string, value: string): MessageBuilder
 *
 * build(): MessagePayload
 *   Validaciones:
 *   - _to vacío → throw Error('Recipient (to) is required')
 *   - _subject vacío → throw Error('Subject is required')
 *   - _body vacío → throw Error('Body is required')
 *   - _priority no es uno de ['low','normal','high','urgent']
 *     → throw Error('Invalid priority: {priority}')
 *
 *   Retorna objeto MessagePayload con:
 *   - Todos los campos
 *   - timestamp: Date.now()
 *   - metadata: copia con spread { ...this._metadata }
 */
```

---

## PASO 5: Tests de Integración

```typescript
// ============================================
// integration.test.ts
// Tests que combinan Singleton + Factory + Builder
// ============================================

import { AppConfig } from './app-config';
import { ServiceFactory } from './service-factory';
import { MessageBuilder } from './message-builder';
import type { NotificationService, SendResult } from './types';

describe('Integration: Config + Factory + Builder', () => {
  beforeEach(() => {
    AppConfig.resetInstance();
  });

  // =========================================
  // FLUJO COMPLETO
  // =========================================
  describe('Full notification flow', () => {
    it('should load config, create services, build message, and send', () => {
      // 1. Cargar configuración (Singleton)
      const config = AppConfig.getInstance();
      config.load({
        appName: 'NotificationApp',
        environment: 'production',
        services: {
          mainEmail: {
            type: 'email',
            enabled: true,
            priority: 1,
            settings: { server: 'smtp.gmail.com' },
          },
        },
      });

      // 2. Obtener config del servicio
      const emailConfig = config.getServiceConfig('mainEmail');
      expect(emailConfig).toBeDefined();

      // 3. Crear servicio con Factory
      const emailService = ServiceFactory.create(emailConfig!.type);
      expect(emailService.getType()).toBe('email');

      // 4. Construir mensaje con Builder
      const message = new MessageBuilder()
        .to('juan@example.com')
        .subject('Bienvenido')
        .body('Gracias por registrarte en nuestra app')
        .priority('high')
        .addMetadata('template', 'welcome')
        .addMetadata('app', config.get('appName'))
        .build();

      // 5. Enviar
      const result = emailService.send(message);
      expect(result.success).toBe(true);
      expect(result.serviceType).toBe('email');
      expect(result.messageId).toBeDefined();
    });
  });

  // =========================================
  // MULTIPLE SERVICES FROM CONFIG
  // =========================================
  describe('Multiple services from config', () => {
    it('should create and use all enabled services', () => {
      // 1. Config con múltiples servicios
      const config = AppConfig.getInstance();
      config.load({
        services: {
          email: { type: 'email', enabled: true, priority: 1, settings: {} },
          sms: { type: 'sms', enabled: true, priority: 2, settings: {} },
          push: { type: 'push', enabled: false, priority: 3, settings: {} },
        },
      });

      // 2. Solo crear servicios habilitados
      const enabledConfigs = config.getEnabledServices();
      expect(enabledConfigs).toHaveLength(2);  // push está disabled

      // 3. Crear servicios con Factory
      const services: NotificationService[] = enabledConfigs.map(
        (sc) => ServiceFactory.create(sc.type)
      );

      expect(services).toHaveLength(2);

      // 4. Construir mensaje
      const message = new MessageBuilder()
        .to('user@test.com')
        .subject('Alert')
        .body('System update')
        .priority('urgent')
        .build();

      // 5. Enviar por todos los servicios habilitados
      const results: SendResult[] = services.map((s) => s.send(message));

      // Todos deberían ser exitosos
      results.forEach((r) => {
        expect(r.success).toBe(true);
      });

      // Verificar tipos de servicio
      const types = results.map((r) => r.serviceType);
      expect(types).toContain('email');
      expect(types).toContain('sms');
      expect(types).not.toContain('push');
    });
  });

  // =========================================
  // CONFIG SHARED STATE
  // =========================================
  describe('Config shared state (Singleton proof)', () => {
    it('should share config between different parts of the system', () => {
      // Simular: un módulo carga la config
      const configLoader = AppConfig.getInstance();
      configLoader.load({
        appName: 'SharedApp',
        services: {
          email: { type: 'email', enabled: true, priority: 1, settings: {} },
        },
      });

      // Otro módulo lee la misma config (sin recibir referencia directa)
      const serviceCreator = AppConfig.getInstance();
      expect(serviceCreator.get('appName')).toBe('SharedApp');

      const emailConfig = serviceCreator.getServiceConfig('email');
      expect(emailConfig).toBeDefined();

      // Son el mismo objeto (Singleton)
      expect(configLoader).toBe(serviceCreator);
    });
  });

  // =========================================
  // ERROR HANDLING
  // =========================================
  describe('Error handling across system', () => {
    it('should handle invalid service type from config', () => {
      const config = AppConfig.getInstance();
      config.load({
        services: {
          invalid: {
            type: 'fax' as any,
            enabled: true,
            priority: 1,
            settings: {},
          },
        },
      });

      const enabled = config.getEnabledServices();
      expect(enabled).toHaveLength(1);

      // Factory debería lanzar error para tipo desconocido
      expect(() =>
        ServiceFactory.create(enabled[0].type)
      ).toThrow('Unknown service type: fax');
    });

    it('should handle builder validation errors', () => {
      // Mensaje incompleto
      expect(() =>
        new MessageBuilder().to('user@test.com').build()
      ).toThrow('Subject is required');
    });

    it('should handle service-specific validation', () => {
      const smsService = ServiceFactory.create('sms');
      const longMessage = new MessageBuilder()
        .to('user@test.com')
        .subject('Alert')
        .body('A'.repeat(161))  // SMS > 160 chars
        .build();

      const result = smsService.send(longMessage);
      expect(result.success).toBe(false);
      expect(result.error).toBe('SMS body must be 160 characters or less');
    });
  });
});
```

---

## 💡 HINTS GENERALES

**Hint 1 (AppConfig - getAll):** Un spread simple `{ ...this.config }` NO hace deep clone del objeto `services` (que tiene objetos anidados). Usá `JSON.parse(JSON.stringify(this.config))` para clonar profundo. Si no, el test de inmutabilidad falla.

**Hint 2 (Servicios - código repetido):** Los 3 servicios comparten validaciones base (to vacío, body vacío). Podés repetir la lógica en cada uno o extraer un método helper. Ambos approaches son válidos — lo importante es que los tests pasen.

**Hint 3 (Integración):** Los tests de integración no requieren código nuevo. Solo usan las 3 clases juntas. Si los tests unitarios pasan, los de integración deberían pasar también.

---

## ✅ CHECKLIST FINAL (Días 4-5)

### Día 4:
- [ ] types.ts copiado
- [ ] AppConfig implementado (Singleton con service helpers)
- [ ] AppConfig tests pasan (~15 tests)
- [ ] ServiceFactory + 3 servicios implementados
- [ ] ServiceFactory tests pasan (~25 tests)
- [ ] Commit intermedio

### Día 5:
- [ ] MessageBuilder implementado (fluent API)
- [ ] MessageBuilder tests pasan (~15 tests)
- [ ] Integration tests pasan (~5 tests)
- [ ] Todos los tests del proyecto pasan (60+ tests)
- [ ] Commit final

```bash
# Commit Día 4:
git add .
git commit -m "feat: day 4 - creational integrator (AppConfig + ServiceFactory)"

# Commit Día 5:
git add .
git commit -m "feat: day 5 - creational integrator complete (MessageBuilder + integration)"
```

**Cuando todos los tests estén en verde → avisame y cerramos Semana 1 con resumen.**
