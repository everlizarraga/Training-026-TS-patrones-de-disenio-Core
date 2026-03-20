export class Calculator {
  // Vacía por ahora - el test solo pide que exista

  // ---- Suma ----
  // Retorna la suma de dos números
  add(a: number, b: number): number {
    return a + b;
  }

  // ---- Resta ----
  subtract(a: number, b: number): number {
    return a - b;
  }

  // ---- División ----
  // Valida que no se divida por cero
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
}
