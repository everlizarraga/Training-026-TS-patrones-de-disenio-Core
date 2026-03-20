// ============================================
// calculator.test.ts
// TDD Paso a paso - Calculator
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
