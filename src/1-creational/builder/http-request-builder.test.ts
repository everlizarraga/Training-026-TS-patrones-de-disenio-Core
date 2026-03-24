// ============================================
// http-request-builder.test.ts
// Tests para HttpRequestBuilder
// TU OBJETIVO: hacer que TODOS estos tests pasen
// ============================================

import { HttpRequestBuilder } from './http-request-builder';
import type { HttpRequest } from './http-request-builder';

describe('HttpRequestBuilder', () => {
  // =========================================
  // FLUENT API
  // =========================================
  describe('Fluent API', () => {
    it('should support full method chaining', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com/users')
        .setMethod('POST')
        .addHeader('Content-Type', 'application/json')
        .addHeader('Authorization', 'Bearer token123')
        .setBody('{"name": "Juan"}')
        .setTimeout(5000)
        .addQueryParam('page', '1')
        .addQueryParam('limit', '10')
        .build();

      expect(request.url).toBe('https://api.com/users');
      expect(request.method).toBe('POST');
      expect(request.headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
      });
      expect(request.body).toBe('{"name": "Juan"}');
      expect(request.timeout).toBe(5000);
      expect(request.queryParams).toEqual({
        page: '1',
        limit: '10',
      });
    });

    it('should return the same builder instance on each method call', () => {
      const builder = new HttpRequestBuilder();
      const returned = builder.setUrl('https://api.com');

      // setUrl retorna el MISMO builder (no uno nuevo)
      expect(returned).toBe(builder);
    });
  });

  // =========================================
  // DEFAULTS
  // =========================================
  describe('Defaults', () => {
    it('should default method to GET', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.method).toBe('GET');
    });

    it('should default headers to empty object', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.headers).toEqual({});
    });

    it('should default body to null', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.body).toBeNull();
    });

    it('should default timeout to 30000', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.timeout).toBe(30000);
    });

    it('should default queryParams to empty object', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .build();

      expect(request.queryParams).toEqual({});
    });
  });

  // =========================================
  // VALIDATION
  // =========================================
  describe('Validation', () => {
    it('should throw if URL is not set', () => {
      expect(() =>
        new HttpRequestBuilder().build()
      ).toThrow('URL is required');
    });

    it('should throw if URL is empty string', () => {
      expect(() =>
        new HttpRequestBuilder().setUrl('').build()
      ).toThrow('URL is required');
    });

    it('should throw if method is invalid', () => {
      expect(() =>
        new HttpRequestBuilder()
          .setUrl('https://api.com')
          .setMethod('INVALID' as any)
          .build()
      ).toThrow('Invalid HTTP method: INVALID');
    });

    it('should throw if timeout is zero or negative', () => {
      expect(() =>
        new HttpRequestBuilder()
          .setUrl('https://api.com')
          .setTimeout(0)
          .build()
      ).toThrow('Timeout must be positive');

      expect(() =>
        new HttpRequestBuilder()
          .setUrl('https://api.com')
          .setTimeout(-100)
          .build()
      ).toThrow('Timeout must be positive');
    });

    it('should accept valid HTTP methods', () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

      methods.forEach((method) => {
        const request = new HttpRequestBuilder()
          .setUrl('https://api.com')
          .setMethod(method)
          .build();

        expect(request.method).toBe(method);
      });
    });
  });

  // =========================================
  // HEADERS
  // =========================================
  describe('Headers', () => {
    it('should accumulate multiple headers', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addHeader('Content-Type', 'application/json')
        .addHeader('Accept', 'application/json')
        .addHeader('X-Custom', 'value')
        .build();

      expect(Object.keys(request.headers)).toHaveLength(3);
      expect(request.headers['Content-Type']).toBe('application/json');
      expect(request.headers['Accept']).toBe('application/json');
      expect(request.headers['X-Custom']).toBe('value');
    });

    it('should overwrite header if same key is added twice', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addHeader('Authorization', 'Bearer old')
        .addHeader('Authorization', 'Bearer new')
        .build();

      expect(request.headers['Authorization']).toBe('Bearer new');
    });
  });

  // =========================================
  // QUERY PARAMS
  // =========================================
  describe('Query Params', () => {
    it('should accumulate multiple query params', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addQueryParam('page', '1')
        .addQueryParam('limit', '20')
        .addQueryParam('sort', 'name')
        .build();

      expect(Object.keys(request.queryParams)).toHaveLength(3);
      expect(request.queryParams['page']).toBe('1');
      expect(request.queryParams['limit']).toBe('20');
      expect(request.queryParams['sort']).toBe('name');
    });

    it('should overwrite param if same key is added twice', () => {
      const request = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addQueryParam('page', '1')
        .addQueryParam('page', '5')
        .build();

      expect(request.queryParams['page']).toBe('5');
    });
  });

  // =========================================
  // IMMUTABILITY
  // =========================================
  describe('Immutability', () => {
    it('should return a new object on each build', () => {
      const builder = new HttpRequestBuilder().setUrl('https://api.com');
      const r1 = builder.build();
      const r2 = builder.build();

      expect(r1).not.toBe(r2);
      expect(r1).toEqual(r2);
    });

    it('should not leak internal references (headers)', () => {
      const builder = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addHeader('Key', 'value');

      const request = builder.build();

      // Modificar el objeto retornado NO debe afectar al builder
      request.headers['Hacked'] = 'yes';

      const request2 = builder.build();
      expect(request2.headers['Hacked']).toBeUndefined();
    });

    it('should not leak internal references (queryParams)', () => {
      const builder = new HttpRequestBuilder()
        .setUrl('https://api.com')
        .addQueryParam('key', 'value');

      const request = builder.build();

      request.queryParams['hacked'] = 'yes';

      const request2 = builder.build();
      expect(request2.queryParams['hacked']).toBeUndefined();
    });
  });

  // =========================================
  // BUILDER REUSE
  // =========================================
  describe('Builder reuse', () => {
    it('should allow building multiple different requests from same base', () => {
      const baseBuilder = new HttpRequestBuilder()
        .setUrl('https://api.com/users')
        .addHeader('Authorization', 'Bearer token');

      // Primer request: GET (default)
      const getRequest = baseBuilder.build();

      // Cambiar método para segundo request
      const postRequest = baseBuilder
        .setMethod('POST')
        .setBody('{"name": "Juan"}')
        .build();

      expect(getRequest.method).toBe('GET');
      expect(getRequest.body).toBeNull();

      // NOTA: el builder MUTÓ su estado interno
      // postRequest refleja el estado actual del builder
      expect(postRequest.method).toBe('POST');
      expect(postRequest.body).toBe('{"name": "Juan"}');
    });
  });
});
