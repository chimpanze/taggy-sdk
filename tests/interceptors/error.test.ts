import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createErrorHandler, 
  TaggyError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ValidationError, 
  RateLimitError 
} from '../../src/interceptors/error';
import { ApiResponse } from 'openapi-typescript-fetch';

// Mock Response class for testing
class MockResponse {
  constructor(
    public ok: boolean = true, 
    public status: number = 200, 
    public data: any = {},
    public statusText: string = 'OK'
  ) {}
}

// Helper to create ApiResponse
function createApiResponse(ok: boolean, status: number, data: any = {}): ApiResponse {
  const response = new Response(JSON.stringify(data), {
    status,
    statusText: ok ? 'OK' : 'Error'
  });
  
  // @ts-ignore - We're mocking the ApiResponse
  return {
    ok,
    status,
    data,
    response
  };
}

describe('Error Interceptor', () => {
  // Setup for each test
  let mockNext: any;
  let errorHandler: any;
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Create error handler
    errorHandler = createErrorHandler();
  });
  
  describe('successful response handling', () => {
    it('should pass through successful responses', async () => {
      // Mock next function that returns a successful response
      const successResponse = createApiResponse(true, 200, { data: 'test' });
      mockNext = vi.fn().mockResolvedValue(successResponse);
      
      // Call the error handler
      const url = '/api/content';
      const init = { headers: new Headers() };
      const result = await errorHandler(url, init, mockNext);
      
      // Verify next was called
      expect(mockNext).toHaveBeenCalledWith(url, init);
      
      // Verify response was passed through
      expect(result).toBe(successResponse);
    });
  });
  
  describe('error response handling', () => {
    it('should throw AuthenticationError for 401 responses', async () => {
      // Mock next function that returns a 401 error
      const errorResponse = createApiResponse(false, 401, { 
        message: 'Unauthorized', 
        code: 'UNAUTHORIZED' 
      });
      mockNext = vi.fn().mockResolvedValue(errorResponse);
      
      // Call the error handler and expect it to throw
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toThrow(AuthenticationError);
      await expect(errorHandler(url, init, mockNext)).rejects.toMatchObject({
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
        status: 401
      });
    });
    
    it('should throw AuthorizationError for 403 responses', async () => {
      // Mock next function that returns a 403 error
      const errorResponse = createApiResponse(false, 403, { 
        message: 'Forbidden', 
        code: 'FORBIDDEN' 
      });
      mockNext = vi.fn().mockResolvedValue(errorResponse);
      
      // Call the error handler and expect it to throw
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toThrow(AuthorizationError);
      await expect(errorHandler(url, init, mockNext)).rejects.toMatchObject({
        message: 'Forbidden',
        code: 'FORBIDDEN',
        status: 403
      });
    });
    
    it('should throw NotFoundError for 404 responses', async () => {
      // Mock next function that returns a 404 error
      const errorResponse = createApiResponse(false, 404, { 
        message: 'Not Found', 
        code: 'NOT_FOUND' 
      });
      mockNext = vi.fn().mockResolvedValue(errorResponse);
      
      // Call the error handler and expect it to throw
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toThrow(NotFoundError);
      await expect(errorHandler(url, init, mockNext)).rejects.toMatchObject({
        message: 'Not Found',
        code: 'NOT_FOUND',
        status: 404
      });
    });
    
    it('should throw ValidationError for 422 responses', async () => {
      // Mock next function that returns a 422 error
      const validationErrors = {
        title: ['Title is required'],
        url: ['Invalid URL format']
      };
      
      const errorResponse = createApiResponse(false, 422, { 
        message: 'Validation Failed', 
        code: 'VALIDATION_ERROR',
        errors: validationErrors
      });
      mockNext = vi.fn().mockResolvedValue(errorResponse);
      
      // Call the error handler and expect it to throw
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toThrow(ValidationError);
      await expect(errorHandler(url, init, mockNext)).rejects.toMatchObject({
        message: 'Validation Failed',
        code: 'VALIDATION_ERROR',
        status: 422,
        errors: validationErrors
      });
    });
    
    it('should throw RateLimitError for 429 responses', async () => {
      // Mock next function that returns a 429 error
      const resetAt = new Date(Date.now() + 60000); // 1 minute from now
      
      const errorResponse = createApiResponse(false, 429, { 
        message: 'Too Many Requests', 
        code: 'RATE_LIMIT_EXCEEDED',
        resetAt: resetAt.toISOString()
      });
      mockNext = vi.fn().mockResolvedValue(errorResponse);
      
      // Call the error handler and expect it to throw
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toThrow(RateLimitError);
      
      try {
        await errorHandler(url, init, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        expect(error.message).toBe('Too Many Requests');
        expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
        expect(error.status).toBe(429);
        expect(error.resetAt).toBeInstanceOf(Date);
        // We can't directly compare dates due to millisecond differences
        expect(error.resetAt.getTime()).toBeGreaterThan(Date.now());
      }
    });
    
    it('should use default resetAt for RateLimitError if not provided', async () => {
      // Mock next function that returns a 429 error without resetAt
      const errorResponse = createApiResponse(false, 429, { 
        message: 'Too Many Requests', 
        code: 'RATE_LIMIT_EXCEEDED'
      });
      mockNext = vi.fn().mockResolvedValue(errorResponse);
      
      // Call the error handler and expect it to throw
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      try {
        await errorHandler(url, init, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(RateLimitError);
        expect(error.resetAt).toBeInstanceOf(Date);
        // Default is 1 minute from now
        const expectedMinTime = Date.now() + 59000; // Allow 1 second buffer
        expect(error.resetAt.getTime()).toBeGreaterThan(expectedMinTime);
      }
    });
    
    it('should throw TaggyError for other error status codes', async () => {
      // Mock next function that returns a 500 error
      const errorResponse = createApiResponse(false, 500, { 
        message: 'Internal Server Error', 
        code: 'SERVER_ERROR' 
      });
      mockNext = vi.fn().mockResolvedValue(errorResponse);
      
      // Call the error handler and expect it to throw
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toThrow(TaggyError);
      await expect(errorHandler(url, init, mockNext)).rejects.toMatchObject({
        message: 'Internal Server Error',
        code: 'SERVER_ERROR',
        status: 500
      });
    });
    
    it('should handle responses with missing data', async () => {
      // Mock next function that returns an error with no data
      const errorResponse = createApiResponse(false, 500, null);
      mockNext = vi.fn().mockResolvedValue(errorResponse);
      
      // Call the error handler and expect it to throw
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toThrow(TaggyError);
      await expect(errorHandler(url, init, mockNext)).rejects.toMatchObject({
        message: 'Unknown error',
        code: 'UNKNOWN_ERROR',
        status: 500
      });
    });
  });
  
  describe('error handling for thrown errors', () => {
    it('should rethrow TaggyError instances', async () => {
      // Create a TaggyError
      const originalError = new TaggyError('Custom error', 400, 'CUSTOM_ERROR', new Error('Original'));
      
      // Mock next function that throws the error
      mockNext = vi.fn().mockRejectedValue(originalError);
      
      // Call the error handler and expect it to rethrow the same error
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toBe(originalError);
    });
    
    it('should wrap network errors in TaggyError', async () => {
      // Create a network error
      const networkError = new Error('Network error');
      
      // Mock next function that throws the error
      mockNext = vi.fn().mockRejectedValue(networkError);
      
      // Call the error handler and expect it to wrap the error
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toThrow(TaggyError);
      await expect(errorHandler(url, init, mockNext)).rejects.toMatchObject({
        message: 'Network error or request timeout',
        code: 'NETWORK_ERROR',
        status: 0,
        originalError: networkError
      });
    });
    
    it('should wrap unknown errors in TaggyError', async () => {
      // Create an unknown error (not an Error instance)
      const unknownError = 'Not an error object';
      
      // Mock next function that throws the error
      mockNext = vi.fn().mockRejectedValue(unknownError);
      
      // Call the error handler and expect it to wrap the error
      const url = '/api/content';
      const init = { headers: new Headers() };
      
      await expect(errorHandler(url, init, mockNext)).rejects.toThrow(TaggyError);
      await expect(errorHandler(url, init, mockNext)).rejects.toMatchObject({
        message: 'Unknown error',
        code: 'UNKNOWN_ERROR',
        status: 0
      });
      
      try {
        await errorHandler(url, init, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(TaggyError);
        expect(error.originalError).toBeInstanceOf(Error);
        expect(error.originalError.message).toBe('Not an error object');
      }
    });
  });
});