import { describe, it, expect, beforeEach } from 'vitest';
import { ArchiveService } from '../../src/services/archive';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('ArchiveService', () => {
  let service: ArchiveService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new ArchiveService(mockFetcher);
  });

  describe('getById', () => {
    it('should make a GET request to retrieve an archive by ID', async () => {
      const archiveId = 123;
      const expectedResponse = {
        id: archiveId,
        url: 'https://example.com/article',
        title: 'Example Article',
        content: 'This is the archived content',
        createdAt: '2025-08-01T12:00:00Z',
      };

      await testServiceMethod(
        service,
        'getById',
        {
          path: '/archive/{id}',
          actualPath: `/archive/${archiveId}`,
          method: 'get',
        },
        expectedResponse,
        archiveId
      );
    });
  });

  describe('create', () => {
    it('should make a POST request to create an archive', async () => {
      const requestData = {
        url: 'https://example.com/article',
        options: {
          includeImages: true,
          saveAsPdf: false,
        },
      };
      const expectedResponse = {
        id: 123,
        url: 'https://example.com/article',
        status: 'processing',
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'create',
        {
          path: '/archive/create',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('getStatus', () => {
    it('should make a GET request to check archive status', async () => {
      const archiveId = 123;
      const expectedResponse = {
        id: archiveId,
        status: 'completed',
        progress: 100,
        completedAt: '2025-08-02T23:05:00Z',
      };

      await testServiceMethod(
        service,
        'getStatus',
        {
          path: '/archive/status/{id}',
          actualPath: `/archive/status/${archiveId}`,
          method: 'get',
        },
        expectedResponse,
        archiveId
      );
    });
  });

  describe('deleteArchive', () => {
    it('should make a DELETE request to remove an archive', async () => {
      const archiveId = 123;
      const expectedResponse = {
        success: true,
        message: 'Archive deleted successfully',
      };

      await testServiceMethod(
        service,
        'deleteArchive',
        {
          path: '/archive/{id}',
          actualPath: `/archive/${archiveId}`,
          method: 'delete',
        },
        expectedResponse,
        archiveId
      );
    });
  });
});