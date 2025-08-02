import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAuthInterceptor } from '../../src/interceptors/auth';
import { AuthConfig } from '../../src/config';
import type { ApiResponse } from 'openapi-typescript-fetch';

// Mock Headers class for testing
class MockHeaders {
  private headers: Record<string, string> = {};
  
  constructor(init?: Record<string, string>) {
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers[key] = value;
      });
    }
  }
  
  set(name: string, value: string) {
    this.headers[name] = value;
  }
  
  get(name: string) {
    return this.headers[name];
  }

  has(name: string) {
    return name in this.headers;
  }
}

// Helper to create mock ApiResponse
function createMockApiResponse(ok: boolean = true, status: number = 200, data: any = {}): ApiResponse {
  // @ts-ignore - We're mocking the ApiResponse
  return {
    ok,
    status,
    data,
  };
}

describe('Auth Interceptor', () => {
  // Setup for each test
  let mockNext: any;
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Mock next function that returns a successful response
    mockNext = vi.fn().mockImplementation((url, init) => {
      return Promise.resolve(createMockApiResponse(true, 200, {}));
    });
    
    // Set global Headers if not available in test environment
    if (typeof Headers === 'undefined') {
      global.Headers = MockHeaders as any;
    }
  });
  
  describe('skipping authentication', () => {
    it('should skip authentication for /auth/login endpoint', async () => {
      // Create auth interceptor with token
      const authConfig: AuthConfig = {
        token: 'test-token'
      };
      const authInterceptor = createAuthInterceptor(authConfig);
      
      // Call the interceptor with auth login endpoint
      const url = '/auth/login';
      const init = { headers: new Headers() };
      await authInterceptor(url, init, mockNext);
      
      // Verify next was called with original parameters
      expect(mockNext).toHaveBeenCalledWith(url, init);
      
      // Verify no Authorization header was added
      const headers = mockNext.mock.calls[0][1].headers;
      expect(headers.has('Authorization')).toBeFalsy();
    });
    
    it('should skip authentication for /auth/register endpoint', async () => {
      // Create auth interceptor with token
      const authConfig: AuthConfig = {
        token: 'test-token'
      };
      const authInterceptor = createAuthInterceptor(authConfig);
      
      // Call the interceptor with auth register endpoint
      const url = '/auth/register';
      const init = { headers: new Headers() };
      await authInterceptor(url, init, mockNext);
      
      // Verify next was called with original parameters
      expect(mockNext).toHaveBeenCalledWith(url, init);
      
      // Verify no Authorization header was added
      const headers = mockNext.mock.calls[0][1].headers;
      expect(headers.has('Authorization')).toBeFalsy();
    });
  });
  
  describe('token authentication', () => {
    it('should add Bearer token when token is provided', async () => {
      // Create auth interceptor with token
      const authConfig: AuthConfig = {
        token: 'test-token'
      };
      const authInterceptor = createAuthInterceptor(authConfig);
      
      // Call the interceptor with non-auth endpoint
      const url = '/api/content';
      const init = { headers: new Headers() };
      await authInterceptor(url, init, mockNext);
      
      // Verify Authorization header was added with Bearer token
      const headers = mockNext.mock.calls[0][1].headers;
      expect(headers.get('Authorization')).toBe('Bearer test-token');
    });
  });
  
  describe('custom token provider', () => {
    it('should use getToken function when provided', async () => {
      // Create mock getToken function
      const getToken = vi.fn().mockResolvedValue('dynamic-token');
      
      // Create auth interceptor with getToken
      const authConfig: AuthConfig = {
        getToken
      };
      const authInterceptor = createAuthInterceptor(authConfig);
      
      // Call the interceptor with non-auth endpoint
      const url = '/api/content';
      const init = { headers: new Headers() };
      await authInterceptor(url, init, mockNext);
      
      // Verify getToken was called
      expect(getToken).toHaveBeenCalled();
      
      // Verify Authorization header was added with dynamic token
      const headers = mockNext.mock.calls[0][1].headers;
      expect(headers.get('Authorization')).toBe('Bearer dynamic-token');
    });
    
    it('should prioritize getToken over token when both are provided', async () => {
      // Create mock getToken function
      const getToken = vi.fn().mockResolvedValue('dynamic-token');
      
      // Create auth interceptor with both getToken and token
      const authConfig: AuthConfig = {
        getToken,
        token: 'static-token'
      };
      const authInterceptor = createAuthInterceptor(authConfig);
      
      // Call the interceptor with non-auth endpoint
      const url = '/api/content';
      const init = { headers: new Headers() };
      await authInterceptor(url, init, mockNext);
      
      // Verify getToken was called
      expect(getToken).toHaveBeenCalled();
      
      // Verify Authorization header was added with dynamic token
      const headers = mockNext.mock.calls[0][1].headers;
      expect(headers.get('Authorization')).toBe('Bearer dynamic-token');
    });
  });
  
  describe('no authentication', () => {
    it('should not add any auth headers when no auth config is provided', async () => {
      // Create auth interceptor with empty config
      const authConfig: AuthConfig = {};
      const authInterceptor = createAuthInterceptor(authConfig);
      
      // Call the interceptor with non-auth endpoint
      const url = '/api/content';
      const init = { headers: new Headers() };
      await authInterceptor(url, init, mockNext);
      
      // Verify next was called with cloned config
      expect(mockNext).toHaveBeenCalledWith(url, expect.objectContaining({
        headers: expect.any(Headers)
      }));
      
      // Verify no Authorization header was added
      const headers = mockNext.mock.calls[0][1].headers;
      expect(headers.has('Authorization')).toBeFalsy();
    });
  });
});