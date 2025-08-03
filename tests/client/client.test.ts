import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaggyClient } from '../../src/client';
import * as fetchModule from 'openapi-typescript-fetch';
// @ts-ignore
import { ApiResponse } from 'openapi-typescript-fetch';

// Mock openapi-typescript-fetch
vi.mock('openapi-typescript-fetch', () => {
  const mockFetcher = {
    path: vi.fn().mockReturnThis(),
    method: vi.fn().mockReturnThis(),
    create: vi.fn(),
    configure: vi.fn(),
    use: vi.fn(),
  };
  
  return {
    Fetcher: {
      for: vi.fn().mockReturnValue(mockFetcher),
    },
    ApiResponse: class MockApiResponse {
      constructor(public data: any, public response: Response) {}
    },
  };
});

describe('TaggyClient', () => {
  let mockFetcher: any;
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockFetcher = fetchModule.Fetcher.for();
  });
  
  describe('constructor', () => {
    it('should create a client with default config', () => {
      const client = new TaggyClient();
      expect(client).toBeInstanceOf(TaggyClient);
      expect(fetchModule.Fetcher.for).toHaveBeenCalled();
    });

    it('should create a client with custom config', () => {
      const client = new TaggyClient({
        baseUrl: 'https://custom-api.example.com',
      });
      
      expect(client).toBeInstanceOf(TaggyClient);
      expect(mockFetcher.configure).toHaveBeenCalledWith(
        expect.objectContaining({
          baseUrl: 'https://custom-api.example.com',
        })
      );
    });
    
    it('should add error handler middleware', () => {
      const client = new TaggyClient();
      expect(mockFetcher.use).toHaveBeenCalledTimes(2);
    });
    
    it('should add auth middleware when auth config is provided', () => {
      const client = new TaggyClient({
        auth: {
          apiKey: 'test-api-key',
        },
      });
      
      // Error handler + auth middleware = 2 calls
      expect(mockFetcher.use).toHaveBeenCalledTimes(2);
    });
  });

  describe('getConfig', () => {
    it('should return the current configuration', () => {
      const client = new TaggyClient({
        baseUrl: 'https://test-api.example.com',
        debug: true,
      });
      
      const config = client.getConfig();
      
      expect(config.baseUrl).toBe('https://test-api.example.com');
      expect(config.debug).toBe(true);
    });
    
    it('should return a copy of the configuration', () => {
      const client = new TaggyClient({
        baseUrl: 'https://test-api.example.com',
      });
      
      const config = client.getConfig();
      config.baseUrl = 'modified';
      
      const newConfig = client.getConfig();
      expect(newConfig.baseUrl).toBe('https://test-api.example.com');
    });
  });
  
  describe('getFetcher', () => {
    it('should return the fetcher instance', () => {
      const client = new TaggyClient();
      const fetcher = client.getFetcher();
      
      expect(fetcher).toBeDefined();
      expect(fetcher).toBe(mockFetcher);
    });
  });

  describe('services', () => {
    it('should have auth service', () => {
      const client = new TaggyClient();
      expect(client.auth).toBeDefined();
    });

    it('should have content service', () => {
      const client = new TaggyClient();
      expect(client.content).toBeDefined();
    });

    it('should have tags service', () => {
      const client = new TaggyClient();
      expect(client.tags).toBeDefined();
    });
    
    it('should have archive service', () => {
      const client = new TaggyClient();
      expect(client.archive).toBeDefined();
    });
    
    it('should have collections service', () => {
      const client = new TaggyClient();
      expect(client.collections).toBeDefined();
    });
    
    it('should have files service', () => {
      const client = new TaggyClient();
      expect(client.files).toBeDefined();
    });
    
    it('should have likes service', () => {
      const client = new TaggyClient();
      expect(client.likes).toBeDefined();
    });
    
    it('should have media service', () => {
      const client = new TaggyClient();
      expect(client.media).toBeDefined();
    });
    
    it('should have search service', () => {
      const client = new TaggyClient();
      expect(client.search).toBeDefined();
    });
    
    it('should have sharing service', () => {
      const client = new TaggyClient();
      expect(client.sharing).toBeDefined();
    });
    
    it('should have extension service', () => {
      const client = new TaggyClient();
      expect(client.extension).toBeDefined();
    });
    
    it('should have ai service', () => {
      const client = new TaggyClient();
      expect(client.ai).toBeDefined();
    });
    
    it('should have comments service', () => {
      const client = new TaggyClient();
      expect(client.comments).toBeDefined();
    });
    
    it('should have system service', () => {
      const client = new TaggyClient();
      expect(client.system).toBeDefined();
    });
  });

  describe('auth middleware', () => {
    it('should add Bearer token header when token is provided', async () => {
      const client = new TaggyClient();
      client.setToken('test-token');
      
      // Extract the auth middleware
      const authMiddleware = mockFetcher.use.mock.calls[1][0];
      
      // Mock Headers
      global.Headers = class {
        private headers: Record<string, string> = {};
        
        constructor(init?: any) {
          if (init) {
            Object.entries(init).forEach(([key, value]) => {
              this.headers[key] = value as string;
            });
          }
        }
        
        set(name: string, value: string) {
          this.headers[name] = value;
        }
        
        get(name: string) {
          return this.headers[name];
        }
      } as any;
      
      // Mock next function
      const mockNext = vi.fn().mockResolvedValue(new ApiResponse({}, new Response()));
      
      // Call the middleware
      await authMiddleware('/api/v1/content', { headers: {} }, mockNext);
      
      // Check that the Authorization header was set
      const headers = mockNext.mock.calls[0][1].headers;
      expect(headers.get('Authorization')).toBe('Bearer test-token');
    });
  });
});