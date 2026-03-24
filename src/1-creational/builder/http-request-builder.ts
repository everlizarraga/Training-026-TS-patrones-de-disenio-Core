// ============================================
// http-request-builder.ts
// Builder que construye objetos HttpRequest paso a paso
// ============================================

// ============================================
// TYPES
// ============================================

/**
 * Métodos HTTP válidos
 *
 * TODO: Definir el union type HttpMethod
 *       Valores: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// ============================================
// PRODUCT (objeto final que el builder crea)
// ============================================

/**
 * TODO: Definir la interface HttpRequest
 *
 * DEBE tener:
 * - url: string
 * - method: HttpMethod
 * - headers: Record<string, string>
 *   (Record<string, string> = objeto donde keys y values son strings)
 *   (ej: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ...' })
 * - body: string | null
 * - timeout: number
 * - queryParams: Record<string, string>
 */
export interface HttpRequest {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body: string | null;
  timeout: number;
  queryParams: Record<string, string>;
}

// ============================================
// BUILDER
// ============================================

/**
 * TODO: Implementar HttpRequestBuilder
 *
 * Estado interno (propiedades privadas):
 * - url: string (iniciar vacío '')
 * - method: HttpMethod (iniciar 'GET')
 * - headers: Record<string, string> (iniciar {})
 * - body: string | null (iniciar null)
 * - timeout: number (iniciar 30000)
 * - queryParams: Record<string, string> (iniciar {})
 *
 * Métodos fluent (TODOS retornan this):
 *
 *   setUrl(url: string): HttpRequestBuilder
 *     - Guarda la url
 *
 *   setMethod(method: HttpMethod): HttpRequestBuilder
 *     - Guarda el método
 *
 *   addHeader(key: string, value: string): HttpRequestBuilder
 *     - Agrega header al objeto de headers
 *     - Si la key ya existe, sobreescribe el valor
 *
 *   setBody(body: string): HttpRequestBuilder
 *     - Guarda el body
 *
 *   setTimeout(ms: number): HttpRequestBuilder
 *     - Guarda el timeout en milisegundos
 *
 *   addQueryParam(key: string, value: string): HttpRequestBuilder
 *     - Agrega query param al objeto
 *     - Si la key ya existe, sobreescribe el valor
 *
 *   build(): HttpRequest
 *     - Valida:
 *       - URL no vacía → throw Error('URL is required')
 *       - Method válido (GET|POST|PUT|DELETE|PATCH) → throw Error('Invalid HTTP method: {method}')
 *       - Timeout > 0 → throw Error('Timeout must be positive')
 *     - Retorna objeto HttpRequest con COPIAS de headers y queryParams
 *       (usar spread { ...this.headers } para evitar leak de referencias)
 */
export class HttpRequestBuilder {
  private url: string = '';
  private method: HttpMethod = 'GET';
  private headers: Record<string, string> = {};
  private body: string | null = null;
  private timeout: number = 30000;
  private queryParams: Record<string, string> = {};

  setUrl(url:string): HttpRequestBuilder {
    this.url = url;
    return this;
  }

  setMethod(method: HttpMethod): HttpRequestBuilder {
    this.method = method;
    return this;
  }

  addHeader(key: string, value: string): HttpRequestBuilder {
    this.headers[key] = value;
    return this;
  }

  setBody(body: string): HttpRequestBuilder {
    this.body = body;
    return this;
  }

  setTimeout(ms: number): HttpRequestBuilder {
    this.timeout = ms;
    return this;
  }

  addQueryParam(key: string, value: string): HttpRequestBuilder {
    this.queryParams[key] = value;
    return this;
  }

  build(): HttpRequest {
    if(!this.url) throw Error('URL is required');
    const methodosValidos: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if(!methodosValidos.includes(this.method)) throw Error(`Invalid HTTP method: ${this.method}`);
    if(this.timeout <= 0) throw Error('Timeout must be positive');
    return {
      url: this.url,
      method: this.method,
      headers: {...this.headers},
      body: this.body,
      timeout: this.timeout,
      queryParams: {...this.queryParams}
    }
  }
}
