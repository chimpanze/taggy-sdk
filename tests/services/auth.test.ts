import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../../src/services/auth';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('AuthService', () => {
  let service: AuthService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new AuthService(mockFetcher);
  });

  describe('getCurrentUser', () => {
    it('should make a GET request to retrieve the current user profile', async () => {
      const expectedResponse = {
        id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        displayName: 'Test User',
        createdAt: '2025-01-15T10:30:00Z',
        preferences: {
          theme: 'dark',
          language: 'en',
        },
      };

      await testServiceMethod(
        service,
        'getCurrentUser',
        {
          path: '/auth/user',
          method: 'get',
        },
        expectedResponse
      );
    });
  });

  describe('validateToken', () => {
    it('should make a POST request to validate a JWT token', async () => {
      const requestData = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiaWF0IjoxNjkxMDAwMDAwLCJleHAiOjE2OTEwODY0MDB9.signature',
      };
      const expectedResponse = {
        valid: true,
        expires: '2025-08-03T23:04:00Z',
        userId: 'user123',
      };

      await testServiceMethod(
        service,
        'validateToken',
        {
          path: '/auth/validate',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });

    it('should handle invalid token validation', async () => {
      const requestData = {
        token: 'invalid-token',
      };
      const expectedResponse = {
        valid: false,
        error: 'Invalid token format',
      };

      await testServiceMethod(
        service,
        'validateToken',
        {
          path: '/auth/validate',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });
});