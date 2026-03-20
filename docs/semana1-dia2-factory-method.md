# Semana 1 - Día 2: Factory Method Pattern

## ⏱️ TIEMPO ESTIMADO: 3-4 horas

---

## 🎯 OBJETIVO

Entender cómo Factory Method desacopla la creación de objetos, cuándo usarlo, e implementar uno completo con TDD.

---

## ¿QUÉ PROBLEMA RESUELVE FACTORY METHOD?

**El problema:**

Imaginá que tenés un sistema de notificaciones. Hoy soportás Email y SMS. Mañana tu jefe dice "agregá Push notifications". Pasado mañana: "ahora también WhatsApp".

```
SIN Factory:

  function enviarNotificacion(tipo: string, mensaje: string) {
    if (tipo === 'email') {
      // 20 líneas de lógica de email
      const email = new EmailNotification();
      email.setServer('smtp.gmail.com');
      email.setPort(587);
      email.send(mensaje);
    } else if (tipo === 'sms') {
      // 20 líneas de lógica de SMS
      const sms = new SmsNotification();
      sms.setProvider('twilio');
      sms.setApiKey('xxx');
      sms.send(mensaje);
    } else if (tipo === 'push') {
      // 20 líneas más...
    } else if (tipo === 'whatsapp') {
      // 20 líneas más...
    }
    // Este if/else CRECE infinitamente
    // Cada tipo nuevo = modificar esta función
    // Riesgo: romper los existentes al tocar el código
  }
```

```
CON Factory:

  // Cada tipo de notificación implementa la MISMA interfaz
  interface Notification {
    send(message: string): void;
    getInfo(): string;
  }

  // La Factory crea el tipo correcto según el parámetro
  const notification = NotificationFactory.create('email');
  notification.send('Hola');  // No me importa CÓMO funciona internamente

  // Agregar WhatsApp = crear WhatsAppNotification + registrar en Factory
  // NO se toca el código existente
  // Los otros tipos siguen funcionando exactamente igual
```

**Factory Method encapsula la creación de objetos. El código cliente trabaja con la interfaz, sin saber (ni importarle) qué clase concreta hay detrás.**

---

## ANALOGÍA: El Restaurante

```
SIN Factory (cocinás vos):
  - Querés pizza → vas a la cocina, amasás, horneás
  - Querés sushi → vas a la cocina, cortás pescado, armás rolls
  - Querés hamburguesa → vas a la cocina, molés carne, cocinás
  - Cada plato nuevo = aprender una receta nueva VOS

CON Factory (pedís al mozo):
  - Querés pizza → "mozo, una pizza" → te la traen hecha
  - Querés sushi → "mozo, un sushi" → te lo traen hecho
  - Querés hamburguesa → "mozo, una hamburguesa" → te la traen hecha
  - Cada plato nuevo = el restaurante lo agrega al menú
  - Vos solo pedís. No sabés ni te importa cómo lo preparan.

  El mozo = Factory
  El menú = tipos disponibles
  Tu pedido = create('pizza')
  El plato que llega = objeto que implementa la interfaz
```

---

## DIAGRAMA DE ESTRUCTURA

```
┌─────────────────────────────────────────────────────────┐
│                    FACTORY METHOD                        │
│                                                         │
│  ┌─────────────────────┐                                │
│  │   <<interface>>      │                                │
│  │   Product            │  ← Contrato que TODOS cumplen │
│  ├─────────────────────┤                                │
│  │ + send(): void       │                                │
│  │ + getInfo(): string  │                                │
│  └────────┬────────────┘                                │
│           │ implements                                   │
│     ┌─────┼──────────┐                                  │
│     │     │          │                                   │
│     ▼     ▼          ▼                                   │
│  ┌──────┐ ┌──────┐ ┌──────┐                             │
│  │Email │ │ SMS  │ │ Push │  ← Implementaciones         │
│  │Notif.│ │Notif.│ │Notif.│    concretas                │
│  └──────┘ └──────┘ └──────┘                             │
│                                                         │
│  ┌─────────────────────────┐                            │
│  │   Factory               │                            │
│  ├─────────────────────────┤                            │
│  │ + create(type): Product │  ← Decide cuál crear       │
│  └─────────────────────────┘                            │
│                                                         │
│  FLUJO:                                                 │
│                                                         │
│  Cliente → Factory.create('email') → EmailNotification  │
│  Cliente → Factory.create('sms')   → SmsNotification    │
│  Cliente → Factory.create('push')  → PushNotification   │
│                                                         │
│  Cliente solo conoce la interfaz Product                 │
│  NO conoce EmailNotification, SmsNotification, etc.     │
└─────────────────────────────────────────────────────────┘
```

---

## CUÁNDO USAR FACTORY METHOD

```
✅ USAR cuando:
  - Tenés múltiples tipos de objetos con la MISMA interfaz
  - No sabés de antemano qué tipo concreto necesitás (depende de input)
  - Querés desacoplar la creación del uso
  - Nuevos tipos se agregan frecuentemente
  - La creación involucra lógica compleja (configuración, validación)

❌ NO USAR cuando:
  - Solo tenés 1 tipo de objeto (no necesitás factory para eso)
  - Los objetos no comparten interfaz
  - La creación es trivial (new MiClase() y listo)
  - Agregás complejidad sin beneficio real
```

---

## SIN FACTORY vs CON FACTORY (comparación directa)

```typescript
// ============================================
// ❌ SIN FACTORY: Código acoplado
// ============================================

// El código cliente SABE qué clases existen
// Tiene que conocer los detalles de cada una
function procesarNotificacion(tipo: string, msg: string): void {
  if (tipo === 'email') {
    const n = new EmailNotification('smtp.gmail.com', 587);
    n.send(msg);
  } else if (tipo === 'sms') {
    const n = new SmsNotification('twilio', 'api-key-123');
    n.send(msg);
  }
  // Agregar push = modificar ESTE código
  // Agregar whatsapp = modificar ESTE código DE NUEVO
  // ¿Y si este if/else está en 10 lugares de la app? Modificar los 10.
}


// ============================================
// ✅ CON FACTORY: Código desacoplado
// ============================================

// El código cliente NO sabe qué clases existen
// Solo conoce la interfaz y la factory
function procesarNotificacion(tipo: string, msg: string): void {
  const notification = NotificationFactory.create(tipo);
  notification.send(msg);
  // Agregar push = crear PushNotification + registrar en Factory
  // Este código NO se toca
  // Funciona para CUALQUIER tipo presente o futuro
}
```

---

---

# EJEMPLO RESUELTO: NotificationFactory

Estudiá este código línea por línea. Es la referencia completa del patrón.

---

## notification-factory.ts

```typescript
// ============================================
// EJEMPLO RESUELTO: NotificationFactory
// Factory que crea diferentes tipos de notificaciones
// ============================================

// ============================================
// INTERFAZ: Contrato que TODAS las notificaciones cumplen
// ============================================
// Cualquier notificación (email, sms, push) DEBE tener estos métodos
// El código cliente trabaja con esta interfaz, no con clases concretas
export interface Notification {
  // Envía la notificación y retorna true si fue exitoso
  send(to: string, message: string): boolean;

  // Retorna información sobre el tipo de notificación
  getInfo(): string;

  // Retorna el tipo como string (para identificación)
  getType(): string;
}

// ============================================
// IMPLEMENTACIÓN 1: Email
// ============================================
export class EmailNotification implements Notification {
  // Cada implementación puede tener su propia configuración interna
  private readonly server: string = 'smtp.default.com';
  private readonly port: number = 587;

  send(to: string, message: string): boolean {
    // Simula envío de email
    // En producción acá iría la lógica real con nodemailer, SendGrid, etc.
    console.log(`[EMAIL] Sending to ${to} via ${this.server}:${this.port}`);
    console.log(`[EMAIL] Message: ${message}`);
    return true;
  }

  getInfo(): string {
    return `Email Notification (server: ${this.server}, port: ${this.port})`;
  }

  getType(): string {
    return 'email';
  }
}

// ============================================
// IMPLEMENTACIÓN 2: SMS
// ============================================
export class SmsNotification implements Notification {
  private readonly provider: string = 'twilio';

  send(to: string, message: string): boolean {
    // Simula envío de SMS
    // En producción: Twilio API, MessageBird, etc.
    console.log(`[SMS] Sending to ${to} via ${this.provider}`);
    console.log(`[SMS] Message: ${message}`);
    return true;
  }

  getInfo(): string {
    return `SMS Notification (provider: ${this.provider})`;
  }

  getType(): string {
    return 'sms';
  }
}

// ============================================
// IMPLEMENTACIÓN 3: Push
// ============================================
export class PushNotification implements Notification {
  private readonly platform: string = 'firebase';

  send(to: string, message: string): boolean {
    // Simula push notification
    // En producción: Firebase Cloud Messaging, Apple Push, etc.
    console.log(`[PUSH] Sending to device ${to} via ${this.platform}`);
    console.log(`[PUSH] Message: ${message}`);
    return true;
  }

  getInfo(): string {
    return `Push Notification (platform: ${this.platform})`;
  }

  getType(): string {
    return 'push';
  }
}

// ============================================
// TIPOS VÁLIDOS
// ============================================
// Union type: solo estos strings son válidos como tipo de notificación
// Si alguien pasa 'fax' → TypeScript da error en COMPILACIÓN
export type NotificationType = 'email' | 'sms' | 'push';

// ============================================
// LA FACTORY
// ============================================
export class NotificationFactory {
  // Método estático: se llama en la clase, no en una instancia
  // NotificationFactory.create('email') → EmailNotification
  //
  // Recibe: tipo de notificación (restringido por NotificationType)
  // Retorna: un objeto que cumple la interfaz Notification
  //          (el cliente no sabe ni le importa qué clase concreta es)
  static create(type: NotificationType): Notification {
    switch (type) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SmsNotification();
      case 'push':
        return new PushNotification();
      default:
        // Si TypeScript es estricto y type es NotificationType,
        // nunca debería llegar acá. Pero por seguridad:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}
```

---

## notification-factory.test.ts

```typescript
// ============================================
// TESTS: NotificationFactory
// ============================================

import {
  NotificationFactory,
  EmailNotification,
  SmsNotification,
  PushNotification,
} from './notification-factory';
import type { Notification, NotificationType } from './notification-factory';

describe('NotificationFactory', () => {
  // -------------------------------------------
  // Tests de creación por tipo
  // -------------------------------------------
  describe('create()', () => {
    it('should create an EmailNotification for type "email"', () => {
      const notification = NotificationFactory.create('email');

      // Verificamos que es instancia de la clase correcta
      expect(notification).toBeInstanceOf(EmailNotification);
      // Y que cumple con la interfaz (tiene los métodos)
      expect(notification.getType()).toBe('email');
    });

    it('should create an SmsNotification for type "sms"', () => {
      const notification = NotificationFactory.create('sms');
      expect(notification).toBeInstanceOf(SmsNotification);
      expect(notification.getType()).toBe('sms');
    });

    it('should create a PushNotification for type "push"', () => {
      const notification = NotificationFactory.create('push');
      expect(notification).toBeInstanceOf(PushNotification);
      expect(notification.getType()).toBe('push');
    });

    it('should throw for unknown type', () => {
      // Forzamos un tipo inválido con "as" para testear el default del switch
      expect(() =>
        NotificationFactory.create('fax' as NotificationType)
      ).toThrow('Unknown notification type: fax');
    });
  });

  // -------------------------------------------
  // Tests de interfaz común
  // -------------------------------------------
  describe('Interface compliance', () => {
    // Testeamos que TODOS los tipos cumplen la interfaz
    const types: NotificationType[] = ['email', 'sms', 'push'];

    types.forEach((type) => {
      describe(`${type} notification`, () => {
        let notification: Notification;

        beforeEach(() => {
          notification = NotificationFactory.create(type);
        });

        it('should have send() method that returns boolean', () => {
          const result = notification.send('user@test.com', 'Hello');
          expect(typeof result).toBe('boolean');
        });

        it('should have getInfo() method that returns string', () => {
          const info = notification.getInfo();
          expect(typeof info).toBe('string');
          expect(info.length).toBeGreaterThan(0);
        });

        it('should have getType() method that returns its type', () => {
          expect(notification.getType()).toBe(type);
        });
      });
    });
  });

  // -------------------------------------------
  // Tests de desacoplamiento
  // -------------------------------------------
  describe('Decoupling', () => {
    it('should create different instances each time', () => {
      // Cada llamada a create() retorna una instancia NUEVA
      // (a diferencia de Singleton que retorna la MISMA)
      const n1 = NotificationFactory.create('email');
      const n2 = NotificationFactory.create('email');
      expect(n1).not.toBe(n2);
    });

    it('should allow working with interface without knowing concrete class', () => {
      // Este código funciona sin saber qué clase concreta hay detrás
      // Solo sabe que cumple la interfaz Notification
      const notifications: Notification[] = [
        NotificationFactory.create('email'),
        NotificationFactory.create('sms'),
        NotificationFactory.create('push'),
      ];

      // Iterar y usar la interfaz común
      notifications.forEach((n) => {
        expect(n.send('user@test.com', 'Test')).toBe(true);
        expect(typeof n.getInfo()).toBe('string');
        expect(typeof n.getType()).toBe('string');
      });
    });
  });
});
```

---

## ¿QUÉ OBSERVAR DEL EJEMPLO?

```
1. INTERFAZ COMO CONTRATO
   → Notification define QUÉ métodos deben existir
   → Todas las implementaciones DEBEN cumplirla
   → El cliente trabaja con la interfaz, no con clases

2. CADA CLASE TIENE SU PROPIA LÓGICA
   → EmailNotification tiene server y port
   → SmsNotification tiene provider
   → PushNotification tiene platform
   → Pero TODAS tienen send(), getInfo(), getType()

3. LA FACTORY ENCAPSULA EL "SWITCH"
   → El switch vive en UN SOLO lugar (la factory)
   → Si necesitás agregar WhatsApp:
     1. Creás WhatsAppNotification implements Notification
     2. Agregás 'whatsapp' al switch de la factory
     3. NADA MÁS cambia

4. UNION TYPE COMO RESTRICCIÓN
   → NotificationType = 'email' | 'sms' | 'push'
   → TypeScript te avisa si pasás un tipo inválido
   → Seguridad en COMPILACIÓN, no en runtime

5. FACTORY vs SINGLETON
   → Singleton: UNA instancia compartida (misma referencia)
   → Factory: NUEVA instancia cada vez (diferentes referencias)
   → Son complementarios, no opuestos
```

---

## FLUJO VISUAL

```
Cliente dice: NotificationFactory.create('sms')
  │
  ▼
Factory recibe 'sms'
  │
  ├─ switch('sms')
  │   └─ return new SmsNotification()
  │
  ▼
Cliente recibe un objeto tipo Notification
  │
  ├─ notification.send('user', 'hola')  ← funciona
  ├─ notification.getInfo()              ← funciona
  ├─ notification.getType()              ← funciona
  │
  └─ El cliente NO sabe que es SmsNotification
     Solo sabe que es "algo que cumple Notification"


Agregar WhatsApp en el futuro:

  1. class WhatsAppNotification implements Notification { ... }
  2. case 'whatsapp': return new WhatsAppNotification();
  3. Listo. El cliente ni se entera.
```

---

---

# 🎯 EJERCICIO TDD: PaymentProcessorFactory

## ⏱️ TIEMPO LÍMITE: 1.5 horas

---

## CONSIGNA

Implementá una Factory que cree diferentes tipos de procesadores de pago. Cada procesador tiene la misma interfaz pero lógica interna diferente.

**Archivos a crear:**

```
src/1-creational/factory/payment-processor.ts       ← tu código
src/1-creational/factory/payment-processor.test.ts  ← tests (se dan listos)
```

---

## TESTS (copiá este archivo tal cual)

```typescript
// ============================================
// payment-processor.test.ts
// Tests para PaymentProcessorFactory
// TU OBJETIVO: hacer que TODOS estos tests pasen
// ============================================

import {
  PaymentFactory,
  CreditCardProcessor,
  PayPalProcessor,
  CryptoProcessor,
} from './payment-processor';
import type { PaymentProcessor, PaymentType } from './payment-processor';

describe('PaymentProcessorFactory', () => {
  // =========================================
  // FACTORY CREATION
  // =========================================
  describe('PaymentFactory.create()', () => {
    it('should create a CreditCardProcessor for type "creditCard"', () => {
      const processor = PaymentFactory.create('creditCard');
      expect(processor).toBeInstanceOf(CreditCardProcessor);
      expect(processor.getName()).toBe('Credit Card');
    });

    it('should create a PayPalProcessor for type "paypal"', () => {
      const processor = PaymentFactory.create('paypal');
      expect(processor).toBeInstanceOf(PayPalProcessor);
      expect(processor.getName()).toBe('PayPal');
    });

    it('should create a CryptoProcessor for type "crypto"', () => {
      const processor = PaymentFactory.create('crypto');
      expect(processor).toBeInstanceOf(CryptoProcessor);
      expect(processor.getName()).toBe('Crypto');
    });

    it('should throw for unknown payment type', () => {
      expect(() =>
        PaymentFactory.create('cash' as PaymentType)
      ).toThrow('Unknown payment type: cash');
    });

    it('should create new instances each time', () => {
      const p1 = PaymentFactory.create('creditCard');
      const p2 = PaymentFactory.create('creditCard');
      expect(p1).not.toBe(p2);
    });
  });

  // =========================================
  // PROCESS PAYMENT
  // =========================================
  describe('processPayment()', () => {
    const types: PaymentType[] = ['creditCard', 'paypal', 'crypto'];

    types.forEach((type) => {
      describe(`${type} processor`, () => {
        let processor: PaymentProcessor;

        beforeEach(() => {
          processor = PaymentFactory.create(type);
        });

        it('should process a valid payment and return success', () => {
          const result = processor.processPayment(100);
          expect(result.success).toBe(true);
          expect(result.amount).toBe(100);
          expect(result.transactionId).toBeDefined();
          expect(typeof result.transactionId).toBe('string');
          expect(result.transactionId.length).toBeGreaterThan(0);
        });

        it('should reject zero amount', () => {
          const result = processor.processPayment(0);
          expect(result.success).toBe(false);
          expect(result.error).toBe('Amount must be positive');
        });

        it('should reject negative amount', () => {
          const result = processor.processPayment(-50);
          expect(result.success).toBe(false);
          expect(result.error).toBe('Amount must be positive');
        });
      });
    });
  });

  // =========================================
  // CREDIT CARD SPECIFIC
  // =========================================
  describe('CreditCardProcessor specifics', () => {
    let processor: CreditCardProcessor;

    beforeEach(() => {
      processor = PaymentFactory.create('creditCard') as CreditCardProcessor;
    });

    it('should apply 2.9% fee', () => {
      const result = processor.processPayment(100);
      expect(result.fee).toBeCloseTo(2.9);
    });

    it('should calculate fee for any amount', () => {
      const result = processor.processPayment(200);
      expect(result.fee).toBeCloseTo(5.8);
    });

    it('should reject amounts above 10000', () => {
      const result = processor.processPayment(10001);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Amount exceeds credit card limit');
    });

    it('should accept exactly 10000', () => {
      const result = processor.processPayment(10000);
      expect(result.success).toBe(true);
    });
  });

  // =========================================
  // PAYPAL SPECIFIC
  // =========================================
  describe('PayPalProcessor specifics', () => {
    let processor: PayPalProcessor;

    beforeEach(() => {
      processor = PaymentFactory.create('paypal') as PayPalProcessor;
    });

    it('should apply 3.5% fee', () => {
      const result = processor.processPayment(100);
      expect(result.fee).toBeCloseTo(3.5);
    });

    it('should reject amounts above 5000', () => {
      const result = processor.processPayment(5001);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Amount exceeds PayPal limit');
    });

    it('should accept exactly 5000', () => {
      const result = processor.processPayment(5000);
      expect(result.success).toBe(true);
    });
  });

  // =========================================
  // CRYPTO SPECIFIC
  // =========================================
  describe('CryptoProcessor specifics', () => {
    let processor: CryptoProcessor;

    beforeEach(() => {
      processor = PaymentFactory.create('crypto') as CryptoProcessor;
    });

    it('should apply 1% fee', () => {
      const result = processor.processPayment(100);
      expect(result.fee).toBeCloseTo(1);
    });

    it('should have no upper limit (accept large amounts)', () => {
      const result = processor.processPayment(1000000);
      expect(result.success).toBe(true);
    });
  });

  // =========================================
  // REFUND
  // =========================================
  describe('refund()', () => {
    it('should refund a valid transaction', () => {
      const processor = PaymentFactory.create('creditCard');
      const payment = processor.processPayment(100);
      const refund = processor.refund(payment.transactionId!);

      expect(refund.success).toBe(true);
      expect(refund.refundId).toBeDefined();
      expect(typeof refund.refundId).toBe('string');
    });

    it('should fail refund for unknown transaction', () => {
      const processor = PaymentFactory.create('creditCard');
      const refund = processor.refund('non-existent-id');

      expect(refund.success).toBe(false);
      expect(refund.error).toBe('Transaction not found');
    });

    it('should not allow refunding the same transaction twice', () => {
      const processor = PaymentFactory.create('paypal');
      const payment = processor.processPayment(50);
      const transactionId = payment.transactionId!;

      // Primer refund: OK
      const refund1 = processor.refund(transactionId);
      expect(refund1.success).toBe(true);

      // Segundo refund: FALLA
      const refund2 = processor.refund(transactionId);
      expect(refund2.success).toBe(false);
      expect(refund2.error).toBe('Transaction already refunded');
    });
  });

  // =========================================
  // GET INFO
  // =========================================
  describe('getInfo()', () => {
    it('should return processor info with supported currencies', () => {
      const types: PaymentType[] = ['creditCard', 'paypal', 'crypto'];

      types.forEach((type) => {
        const processor = PaymentFactory.create(type);
        const info = processor.getInfo();

        expect(info).toHaveProperty('name');
        expect(info).toHaveProperty('feePercentage');
        expect(info).toHaveProperty('maxAmount');
        expect(info).toHaveProperty('supportedCurrencies');
        expect(Array.isArray(info.supportedCurrencies)).toBe(true);
        expect(info.supportedCurrencies.length).toBeGreaterThan(0);
      });
    });

    it('should return correct info for credit card', () => {
      const processor = PaymentFactory.create('creditCard');
      const info = processor.getInfo();
      expect(info.name).toBe('Credit Card');
      expect(info.feePercentage).toBe(2.9);
      expect(info.maxAmount).toBe(10000);
      expect(info.supportedCurrencies).toContain('USD');
    });

    it('should return correct info for paypal', () => {
      const processor = PaymentFactory.create('paypal');
      const info = processor.getInfo();
      expect(info.name).toBe('PayPal');
      expect(info.feePercentage).toBe(3.5);
      expect(info.maxAmount).toBe(5000);
    });

    it('should return correct info for crypto', () => {
      const processor = PaymentFactory.create('crypto');
      const info = processor.getInfo();
      expect(info.name).toBe('Crypto');
      expect(info.feePercentage).toBe(1);
      expect(info.maxAmount).toBe(Infinity);
    });
  });
});
```

---

## TEMPLATE (tu punto de partida)

```typescript
// ============================================
// payment-processor.ts
// Factory que crea diferentes procesadores de pago
// ============================================

import { v4 as uuidv4 } from 'uuid';

// ============================================
// INTERFACES
// ============================================

/**
 * Resultado de un pago procesado
 *
 * TODO: Definir la interface PaymentResult
 *
 * DEBE tener:
 * - success: boolean
 * - amount: number (opcional - presente en pagos exitosos)
 * - transactionId: string (opcional - presente en pagos exitosos)
 * - fee: number (opcional - presente en pagos exitosos)
 * - error: string (opcional - presente en pagos fallidos)
 */

/**
 * Resultado de un refund
 *
 * TODO: Definir la interface RefundResult
 *
 * DEBE tener:
 * - success: boolean
 * - refundId: string (opcional - presente en refunds exitosos)
 * - error: string (opcional - presente en refunds fallidos)
 */

/**
 * Info del procesador
 *
 * TODO: Definir la interface ProcessorInfo
 *
 * DEBE tener:
 * - name: string
 * - feePercentage: number
 * - maxAmount: number
 * - supportedCurrencies: string[]
 */

/**
 * Contrato que TODOS los procesadores de pago deben cumplir
 *
 * TODO: Definir la interface PaymentProcessor
 *
 * Métodos:
 * - processPayment(amount: number): PaymentResult
 * - refund(transactionId: string): RefundResult
 * - getName(): string
 * - getInfo(): ProcessorInfo
 */

// ============================================
// TIPOS
// ============================================

/**
 * TODO: Definir el union type PaymentType
 *       Valores: 'creditCard' | 'paypal' | 'crypto'
 */

// ============================================
// IMPLEMENTACIONES
// ============================================

/**
 * Procesador de tarjeta de crédito
 *
 * TODO: Implementar CreditCardProcessor (implements PaymentProcessor)
 *
 * Características:
 * - Fee: 2.9%
 * - Límite: 10000
 * - Monedas soportadas: ['USD', 'EUR', 'GBP']
 * - Debe trackear transacciones completadas (para refunds)
 * - Debe trackear transacciones ya reembolsadas (para evitar doble refund)
 *
 * processPayment(amount):
 * - Si amount <= 0 → { success: false, error: 'Amount must be positive' }
 * - Si amount > 10000 → { success: false, error: 'Amount exceeds credit card limit' }
 * - Si válido → calcular fee, generar transactionId con uuidv4()
 *   guardar transactionId en completedTransactions
 *   retornar { success: true, amount, transactionId, fee }
 *
 * refund(transactionId):
 * - Si no existe en completedTransactions → { success: false, error: 'Transaction not found' }
 * - Si ya está en refundedTransactions → { success: false, error: 'Transaction already refunded' }
 * - Si válido → agregar a refundedTransactions, retornar { success: true, refundId: uuidv4() }
 *
 * getName(): 'Credit Card'
 *
 * getInfo(): { name, feePercentage, maxAmount, supportedCurrencies }
 */

/**
 * Procesador de PayPal
 *
 * TODO: Implementar PayPalProcessor (implements PaymentProcessor)
 *
 * Características:
 * - Fee: 3.5%
 * - Límite: 5000
 * - Monedas soportadas: ['USD', 'EUR']
 * - Misma lógica de refund que CreditCard
 *
 * processPayment(amount):
 * - Si amount <= 0 → { success: false, error: 'Amount must be positive' }
 * - Si amount > 5000 → { success: false, error: 'Amount exceeds PayPal limit' }
 * - Si válido → misma estructura que CreditCard
 */

/**
 * Procesador de criptomonedas
 *
 * TODO: Implementar CryptoProcessor (implements PaymentProcessor)
 *
 * Características:
 * - Fee: 1%
 * - Límite: Infinity (sin límite)
 * - Monedas soportadas: ['BTC', 'ETH', 'USDT']
 * - Misma lógica de refund que los otros
 *
 * processPayment(amount):
 * - Si amount <= 0 → { success: false, error: 'Amount must be positive' }
 * - Sin límite superior
 * - Si válido → misma estructura que los otros
 */

// ============================================
// FACTORY
// ============================================

/**
 * TODO: Implementar PaymentFactory
 *
 * Método estático:
 * - create(type: PaymentType): PaymentProcessor
 *   - 'creditCard' → new CreditCardProcessor()
 *   - 'paypal' → new PayPalProcessor()
 *   - 'crypto' → new CryptoProcessor()
 *   - default → throw Error('Unknown payment type: {type}')
 */
```

---

## 💡 HINTS (solo si te trabás >15 min)

**Hint 1:** Los 3 procesadores comparten lógica de refund idéntica. Podés implementarlo en cada uno por separado (repetición) o pensar en cómo reutilizar. Ambos enfoques son válidos para este ejercicio — priorizá que los tests pasen primero.

**Hint 2:** Para trackear transacciones, necesitás dos `Set<string>`: uno para transacciones completadas y otro para reembolsadas. `Set` es ideal porque no permite duplicados y `.has()` es O(1).

**Hint 3:** Las interfaces con propiedades opcionales se definen con `?`. Por ejemplo: `transactionId?: string` significa que puede existir o no en el objeto.

---

## ✅ CHECKLIST DÍA 2

- [ ] Leíste y entendés el ejemplo de NotificationFactory completo
- [ ] Entendés interfaz como contrato + implementaciones concretas
- [ ] Entendés cómo la Factory desacopla creación de uso
- [ ] Implementaste PaymentProcessorFactory con TDD
- [ ] Todos los tests pasan (deberían ser ~25 tests)
- [ ] Entendés la diferencia entre Factory (nueva instancia) y Singleton (misma instancia)
- [ ] Commit pusheado

**Cuando todos los tests estén en verde → avisame y avanzamos al Día 3: Builder Pattern.**
