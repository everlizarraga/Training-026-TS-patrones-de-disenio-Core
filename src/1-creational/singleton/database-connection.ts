// ============================================
// database-connection.ts
// Singleton que simula una conexión a base de datos
// ============================================

// Interfaz para el resultado de una query
interface QueryResult {
  query: string;
  timestamp: number;
}

export class DatabaseConnection {
  // ============================================
  // SINGLETON INFRASTRUCTURE
  // ============================================

  /**
   * Instancia única de DatabaseConnection
   *
   * TODO: Declarar la propiedad estática privada
   *       Tipo: DatabaseConnection | null
   *       Valor inicial: null
   */
  private static instance: DatabaseConnection | null = null;

  // ============================================
  // ESTADO INTERNO
  // ============================================

  /**
   * TODO: Declarar propiedades privadas para:
   *   - connected: boolean (¿está conectado?)
   *   - url: string (URL de conexión)
   *   - queryHistory: string[] (historial de queries)
   */
  private connected: boolean;
  private url: string;
  private queryHistory: string[];

  // ============================================
  // CONSTRUCTOR PRIVADO
  // ============================================

  /**
   * TODO: Implementar constructor privado
   *
   * DEBE:
   * - Ser private (nadie puede hacer new DatabaseConnection())
   * - Inicializar connected en false
   * - Inicializar url en string vacío
   * - Inicializar queryHistory como array vacío
   */
  private constructor() {
    this.connected = false;
    this.url = '';
    this.queryHistory = [];
  }

  // ============================================
  // SINGLETON METHODS
  // ============================================

  /**
   * Retorna la única instancia de DatabaseConnection
   *
   * TODO: Implementar getInstance()
   *
   * DEBE:
   * - Ser static y public
   * - Si no existe instancia → crear una nueva
   * - Si ya existe → retornar la existente
   * - Retornar tipo DatabaseConnection
   */
  static getInstance(): DatabaseConnection {
    if(!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Resetea la instancia (solo para testing)
   *
   * TODO: Implementar resetInstance()
   *
   * DEBE:
   * - Ser static y public
   * - Poner la instancia en null
   * - No retornar nada (void)
   */
  static resetInstance(): void {
    DatabaseConnection.instance = null;
  }

  // ============================================
  // CONNECTION METHODS
  // ============================================

  /**
   * Conecta a la base de datos
   *
   * TODO: Implementar connect(url)
   *
   * DEBE:
   * - Recibir url: string
   * - Si ya está conectado → throw Error('Already connected')
   * - Si no → guardar url, poner connected en true
   */
  connect(url: string): void {
    if(this.connected) throw new Error('Already connected');
    this.url = url;
    this.connected = true;
  }

  /**
   * Desconecta de la base de datos
   *
   * TODO: Implementar disconnect()
   *
   * DEBE:
   * - Si no está conectado → throw Error('Not connected')
   * - Si sí → poner connected en false, limpiar url, limpiar historial
   */
  disconnect(): void {
    if(!this.connected) throw new Error("Not connected");
    this.connected = false;
    this.url = '';
    this.queryHistory = [];
  }

  /**
   * Retorna si está conectado
   *
   * TODO: Implementar isConnected()
   *
   * DEBE:
   * - Retornar boolean
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Retorna la URL de conexión actual
   *
   * TODO: Implementar getConnectionUrl()
   *
   * DEBE:
   * - Retornar string (la url guardada)
   */
  getConnectionUrl(): string {
    return this.url;
  }

  // ============================================
  // QUERY METHODS
  // ============================================

  /**
   * Ejecuta una query
   *
   * TODO: Implementar query(sql)
   *
   * DEBE:
   * - Recibir sql: string
   * - Si no está conectado → throw Error('Not connected')
   * - Agregar la query al historial
   * - Retornar objeto QueryResult con:
   *   - query: la sql recibida
   *   - timestamp: Date.now()
   */
  query(sql: string): QueryResult {
    if(!this.isConnected()) throw new Error("Not connected");
    this.queryHistory.push(sql);
    return {
      query: sql,
      timestamp: Date.now()
    };
  }

  /**
   * Retorna el historial de queries ejecutadas
   *
   * TODO: Implementar getQueryHistory()
   *
   * DEBE:
   * - Retornar copia del array de historial (spread [...])
   * - No retornar la referencia directa (para evitar modificación externa)
   */
  getQueryHistory(): string[] {
    return [...this.queryHistory];
  }
}
