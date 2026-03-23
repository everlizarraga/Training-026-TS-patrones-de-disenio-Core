// ============================================
// payment-processor.ts
// Factory que crea diferentes procesadores de pago
// ============================================

// import { v4 as uuidv4 } from 'uuid';
import { randomUUID as uuidv4 } from 'crypto';

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
export interface PaymentResult {
  success: boolean;
  amount?: number;
  transactionId?: string;
  fee?: number;
  error?: string;
}

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
export interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

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
export interface ProcessorInfo {
  name: string;
  feePercentage: number;
  maxAmount: number;
  supportedCurrencies: string[];
}

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
export interface PaymentProcessor {
  processPayment(amount: number): PaymentResult;
  refund(transactionId: string): RefundResult;
  getName(): string;
  getInfo(): ProcessorInfo;
}

// ============================================
// TIPOS
// ============================================

/**
 * TODO: Definir el union type PaymentType
 *       Valores: 'creditCard' | 'paypal' | 'crypto'
 */
export type PaymentType = 'creditCard' | 'paypal' | 'crypto';

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
export class CreditCardProcessor implements PaymentProcessor {

  private name: string = 'Credit Card';
  private fee: number = 2.9/100;
  private limit: number = 10000;
  private supportedCurrencies: string[] = ['USD', 'EUR', 'GBP'];

  private completedTransactions: string[] = [];
  private refundedTransactions: string[] = [];

  private _completedTransAdd(id: string) {
    this.completedTransactions.push(id);
  }

  private _isCompletedTransaction(id: string): boolean {
    return this.completedTransactions.includes(id);
  }

  private _refundedTransAdd(id: string) {
    this.refundedTransactions.push(id);
  }

  private _isRefundedTransaction(id: string): boolean {
    return this.refundedTransactions.includes(id);
  }

  getInfo(): ProcessorInfo {
    return {
      name: this.getName(),
      maxAmount: this.limit,
      feePercentage: this.fee*100,
      supportedCurrencies: [...this.supportedCurrencies]
    };
  }

  getName(): string {
    return this.name;
  }

  processPayment(amount: number): PaymentResult {
    if(amount <= 0) return {success: false, error: 'Amount must be positive'};
    if(amount > this.limit) return {success: false, error: 'Amount exceeds credit card limit'};
    const id: string = uuidv4();
    this._completedTransAdd(id);
    // console.log('uuidV4:', id);
    const fee: number = amount*(this.fee);
    return {
      success: true,
      amount,
      transactionId: id,
      fee
    };
  }

  refund(transactionId: string): RefundResult {
    if(!this._isCompletedTransaction(transactionId)) return { success: false, error: 'Transaction not found' };
    if(this._isRefundedTransaction(transactionId)) return { success: false, error: 'Transaction already refunded'};
    this._refundedTransAdd(transactionId);
    return { success: true, refundId: uuidv4() };
  }
}

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
export class PayPalProcessor implements PaymentProcessor {

  private name: string = 'PayPal';
  private fee:number = 3.5;
  private limit:number = 5000;
  private supportedCurrencies: string[] = ['USD', 'EUR'];

  private completedTransactions: string[] = [];
  private refundedTransactions: string[] = [];

  private _completedTransAdd(id: string) {
    this.completedTransactions.push(id);
  }

  private _isCompletedTransaction(id: string): boolean {
    return this.completedTransactions.includes(id);
  }

  private _refundedTransAdd(id: string) {
    this.refundedTransactions.push(id);
  }

  private _isRefundedTransaction(id: string): boolean {
    return this.refundedTransactions.includes(id);
  }

  getInfo(): ProcessorInfo {
    return {
      name: this.getName(),
      maxAmount: this.limit,
      feePercentage: this.fee,
      supportedCurrencies: [...this.supportedCurrencies]
    };
  }

  getName(): string {
    return this.name;
  }

  processPayment(amount: number): PaymentResult {
    if(amount <= 0) return { success: false, error: 'Amount must be positive' };
    if(amount > 5000) return { success: false, error: 'Amount exceeds PayPal limit' };
    const id: string = uuidv4();
    this._completedTransAdd(id);
    // console.log('uuidv4:', id);
    const fee: number = amount*this.fee/100;
    return {
      success: true,
      amount,
      transactionId: id,
      fee
    };
  }

  refund(transactionId: string): RefundResult {
    if(!this._isCompletedTransaction(transactionId)) return { success: false, error: 'Transaction not found' };
    if(this._isRefundedTransaction(transactionId)) return { success: false, error: 'Transaction already refunded'};
    this._refundedTransAdd(transactionId);
    return { success: true, refundId: uuidv4() };
  }
}

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
export class CryptoProcessor implements PaymentProcessor {
  
  private name:string = 'Crypto';
  private fee: number = 1;
  private limit: number = Infinity;
  private supportedCurrencies: string[] = ['BTC', 'ETH', 'USDT'];

  private completedTransactions: string[] = [];
  private refundedTransactions: string[] = [];

  private _completedTransAdd(id: string) {
    this.completedTransactions.push(id);
  }

  private _isCompletedTransaction(id: string): boolean {
    return this.completedTransactions.includes(id);
  }

  private _refundedTransAdd(id: string) {
    this.refundedTransactions.push(id);
  }

  private _isRefundedTransaction(id: string): boolean {
    return this.refundedTransactions.includes(id);
  }

  getInfo(): ProcessorInfo {
    return {
      name: this.getName(),
      maxAmount: this.limit,
      feePercentage: this.fee,
      supportedCurrencies: [...this.supportedCurrencies]
    }
  }

  getName(): string {
    return this.name;
  }

  processPayment(amount: number): PaymentResult {
    if(amount <= 0) return { success: false, error: 'Amount must be positive' };
    const id: string = uuidv4();
    this._completedTransAdd(id);
    // console.log('uuidv4:', id);
    const fee: number = amount*this.fee/100;
    return {
      success: true,
      amount,
      transactionId: id,
      fee
    };
  }

  refund(transactionId: string): RefundResult {
    if(!this._isCompletedTransaction(transactionId)) return { success: false, error: 'Transaction not found' };
    if(this._isRefundedTransaction(transactionId)) return { success: false, error: 'Transaction already refunded'};
    this._refundedTransAdd(transactionId);
    return { success: true, refundId: uuidv4() };
  }
}

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
export class PaymentFactory {

  public static create(type: PaymentType): PaymentProcessor {
    switch (type) {
      case 'creditCard':
        return new CreditCardProcessor();
      case 'paypal':
        return new PayPalProcessor();
      case 'crypto':
        return new CryptoProcessor();
      default:
        throw new Error(`Unknown payment type: ${type}`);
    }
  }
}