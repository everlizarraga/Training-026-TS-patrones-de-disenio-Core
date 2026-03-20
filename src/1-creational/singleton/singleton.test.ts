// ============================================
// TEST DE VERIFICACIÓN
// Solo para confirmar que Jest + TypeScript funcionan
// Este archivo se reemplaza en la Parte 3 (Singleton)
// ============================================

describe('Setup Verification', () => {
  it('should run TypeScript tests correctly', () => {
    // Arrange
    const a: number = 2;
    const b: number = 3;

    // Act
    const result: number = a + b;

    // Assert
    expect(result).toBe(5);
  });

  it('should support TypeScript features', () => {
    // Verificar que interfaces funcionan
    interface Testable {
      name: string;
      value: number;
    }

    const obj: Testable = { name: 'test', value: 42 };

    expect(obj.name).toBe('test');
    expect(obj.value).toBe(42);
  });
});
