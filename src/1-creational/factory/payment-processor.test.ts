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
          expect(result.transactionId!.length).toBeGreaterThan(0);
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
