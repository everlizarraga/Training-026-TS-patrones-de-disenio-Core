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
