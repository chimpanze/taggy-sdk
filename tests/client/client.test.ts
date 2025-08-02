import { describe, it, expect, vi } from 'vitest';
import { TaggyClient } from '../../src/client';
import * as fetchModule from 'openapi-typescript-fetch';

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
  };
});

describe('TaggyClient', () => {
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
      const mockFetcher = fetchModule.Fetcher.for();
      expect(mockFetcher.configure).toHaveBeenCalledWith(
        expect.objectContaining({
          baseUrl: 'https://custom-api.example.com',
        })
      );
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
  });
});