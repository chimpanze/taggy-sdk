import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseService } from '../../src/services/base';
import { paths } from '../../src/types/generated';
import { TaggyFetcher } from '../../src/types/fetch';
import { ApiResponse } from 'openapi-typescript-fetch';

// Create a concrete implementation of the abstract BaseService class for testing
class TestService extends BaseService {
  // Expose protected methods for testing
  public testGet<P extends keyof paths>(path: P, params?: Record<string, any>) {
    return this.get(path, params);
  }

  public testPost<P extends keyof paths>(path: P, data?: Record<string, any>, params?: Record<string, any>) {
    return this.post(path, data, params);
  }

  public testPut<P extends keyof paths>(path: P, data?: Record<string, any>, params?: Record<string, any>) {
    return this.put(path, data, params);
  }

  public testPatch<P extends keyof paths>(path: P, data?: Record<string, any>, params?: Record<string, any>) {
    return this.patch(path, data, params);
  }

  public testDelete<P extends keyof paths>(path: P, params?: Record<string, any>) {
    return this.delete(path, params);
  }

  public testCreateOperation<P extends keyof paths, M extends keyof paths[P]>(method: M, path: P) {
    return this.createOperation(method, path);
  }
}

// Helper to create mock API response
function createMockApiResponse(data: any = {}): ApiResponse<any> {
  // @ts-ignore - We're mocking the ApiResponse
  return {
    data,
    ok: true,
    status: 200,
    statusText: 'OK',
  };
}

describe('BaseService', () => {
  let mockFetcher: TaggyFetcher<paths>;
  let mockOperation: any;
  let service: TestService;
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Create mock operation
    mockOperation = vi.fn().mockResolvedValue(createMockApiResponse({ success: true }));
    
    // Create mock fetcher
    mockFetcher = {
      path: vi.fn().mockReturnThis(),
      method: vi.fn().mockReturnThis(),
      create: vi.fn().mockReturnValue(mockOperation),
    } as unknown as TaggyFetcher<paths>;
    
    // Create service instance with mock fetcher
    service = new TestService(mockFetcher);
  });
  
  describe('constructor', () => {
    it('should create a service instance with the provided fetcher', () => {
      expect(service).toBeInstanceOf(TestService);
      expect(service).toBeInstanceOf(BaseService);
    });
  });
  
  describe('createOperation', () => {
    it('should create an operation with the specified method and path', () => {
      const path = '/content' as keyof paths;
      const method = 'get' as keyof paths[typeof path];
      
      service.testCreateOperation(method, path);
      
      expect(mockFetcher.path).toHaveBeenCalledWith(path);
      expect(mockFetcher.method).toHaveBeenCalledWith(method);
      expect(mockFetcher.create).toHaveBeenCalled();
    });
  });
  
  describe('get', () => {
    it('should make a GET request with the specified path', async () => {
      const path = '/content' as keyof paths;
      
      await service.testGet(path);
      
      expect(mockFetcher.path).toHaveBeenCalledWith(path);
      expect(mockFetcher.method).toHaveBeenCalledWith('get');
      expect(mockOperation).toHaveBeenCalledWith({ params: undefined });
    });
    
    it('should make a GET request with query parameters', async () => {
      const path = '/content' as keyof paths;
      const params = { limit: 10, offset: 0 };
      
      await service.testGet(path, params);
      
      expect(mockOperation).toHaveBeenCalledWith({ params: params });
    });
    
    it('should return the response data', async () => {
      const path = '/content' as keyof paths;
      const responseData = { items: [], total: 0 };
      mockOperation.mockResolvedValue(createMockApiResponse(responseData));
      
      const result = await service.testGet(path);
      
      expect(result).toEqual(responseData);
    });
  });
  
  describe('post', () => {
    it('should make a POST request with the specified path', async () => {
      const path = '/content' as keyof paths;
      
      await service.testPost(path, { content: "Test content" });
      
      expect(mockFetcher.path).toHaveBeenCalledWith(path);
      expect(mockFetcher.method).toHaveBeenCalledWith('post');
      expect(mockOperation).toHaveBeenCalledWith({ content: "Test content", query: undefined });
    });
    
    it('should make a POST request with body data', async () => {
      const path = '/content' as keyof paths;
      const data = { title: 'Test', content: 'Test content' };
      
      await service.testPost(path, data);
      
      expect(mockOperation).toHaveBeenCalledWith({ ...data, query: undefined });
    });
    
    it('should make a POST request with query parameters', async () => {
      const path = '/content' as keyof paths;
      const data = { title: 'Test', content: 'Test content' };
      const params = { draft: true };
      
      await service.testPost(path, data, params);
      
      expect(mockOperation).toHaveBeenCalledWith(data);
    });
    
    it('should return the response data', async () => {
      const path = '/content' as keyof paths;
      const responseData = { id: '123', title: 'Test' };
      mockOperation.mockResolvedValue(createMockApiResponse(responseData));
      
      const result = await service.testPost(path);
      
      expect(result).toEqual(responseData);
    });
  });
  
  describe('put', () => {
    it('should make a PUT request with the specified path', async () => {
      const path = '/content/123' as keyof paths;
      
      await service.testPut(path);
      
      expect(mockFetcher.path).toHaveBeenCalledWith(path);
      expect(mockFetcher.method).toHaveBeenCalledWith('put');
      expect(mockOperation).toHaveBeenCalledWith(undefined);
    });
    
    it('should make a PUT request with body data', async () => {
      const path = '/content/123' as keyof paths;
      const data = { title: 'Updated Test', content: 'Updated content' };
      
      await service.testPut(path, data);
      
      expect(mockOperation).toHaveBeenCalledWith({ ...data, query: undefined });
    });
    
    it('should make a PUT request with query parameters', async () => {
      const path = '/content/123' as keyof paths;
      const data = { title: 'Updated Test', content: 'Updated content' };
      const params = { publish: true };
      
      await service.testPut(path, data, params);
      
      expect(mockOperation).toHaveBeenCalledWith(data);
    });
    
    it('should return the response data', async () => {
      const path = '/content/123' as keyof paths;
      const responseData = { id: '123', title: 'Updated Test' };
      mockOperation.mockResolvedValue(createMockApiResponse(responseData));
      
      const result = await service.testPut(path);
      
      expect(result).toEqual(responseData);
    });
  });
  
  describe('patch', () => {
    it('should make a PATCH request with the specified path', async () => {
      const path = '/content/123' as keyof paths;
      
      await service.testPatch(path);
      
      expect(mockFetcher.path).toHaveBeenCalledWith(path);
      expect(mockFetcher.method).toHaveBeenCalledWith('patch');
      expect(mockOperation).toHaveBeenCalledWith(undefined);
    });
    
    it('should make a PATCH request with body data', async () => {
      const path = '/content/123' as keyof paths;
      const data = { title: 'Patched Test' };
      
      await service.testPatch(path, data);
      
      expect(mockOperation).toHaveBeenCalledWith({ ...data, query: undefined });
    });
    
    it('should make a PATCH request with query parameters', async () => {
      const path = '/content/123' as keyof paths;
      const data = { title: 'Patched Test' };
      const params = { partial: true };
      
      await service.testPatch(path, data, params);
      
      expect(mockOperation).toHaveBeenCalledWith(data);
    });
    
    it('should return the response data', async () => {
      const path = '/content/123' as keyof paths;
      const responseData = { id: '123', title: 'Patched Test' };
      mockOperation.mockResolvedValue(createMockApiResponse(responseData));
      
      const result = await service.testPatch(path);
      
      expect(result).toEqual(responseData);
    });
  });
  
  describe('delete', () => {
    it('should make a DELETE request with the specified path', async () => {
      const path = '/content/123' as keyof paths;
      
      await service.testDelete(path);
      
      expect(mockFetcher.path).toHaveBeenCalledWith(path);
      expect(mockFetcher.method).toHaveBeenCalledWith('delete');
      expect(mockOperation).toHaveBeenCalledWith({ query: undefined });
    });
    
    it('should make a DELETE request with query parameters', async () => {
      const path = '/content/123' as keyof paths;
      const params = { permanent: true };
      
      await service.testDelete(path, params);
      
      expect(mockOperation).toHaveBeenCalledWith({ params: params });
    });
    
    it('should return the response data', async () => {
      const path = '/content/123' as keyof paths;
      const responseData = { success: true };
      mockOperation.mockResolvedValue(createMockApiResponse(responseData));
      
      const result = await service.testDelete(path);
      
      expect(result).toEqual(responseData);
    });
  });
});