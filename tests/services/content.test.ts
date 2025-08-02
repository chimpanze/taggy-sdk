import { describe, it, expect, beforeEach } from 'vitest';
import { ContentService } from '../../src/services/content';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('ContentService', () => {
  let service: ContentService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new ContentService(mockFetcher);
  });

  describe('getById', () => {
    it('should make a GET request to retrieve content by ID', async () => {
      const contentId = 'content-123';
      const expectedResponse = {
        id: contentId,
        title: 'Example Content',
        type: 'article',
        url: 'https://example.com/article',
        tags: ['tag1', 'tag2'],
        createdAt: '2025-08-01T12:00:00Z',
      };

      await testServiceMethod(
        service,
        'getById',
        {
          path: '/content/{id}',
          actualPath: `/content/${contentId}`,
          method: 'get',
        },
        expectedResponse,
        contentId
      );
    });
  });

  describe('list', () => {
    it('should make a GET request to list content with filters', async () => {
      const options = {
        limit: 10,
        offset: 0,
        type: 'article',
        tags: ['tag1'],
      };
      const expectedResponse = {
        items: [
          {
            id: 'content-123',
            title: 'Example Content 1',
            type: 'article',
            url: 'https://example.com/article1',
            tags: ['tag1', 'tag2'],
            createdAt: '2025-08-01T12:00:00Z',
          },
          {
            id: 'content-124',
            title: 'Example Content 2',
            type: 'article',
            url: 'https://example.com/article2',
            tags: ['tag1', 'tag3'],
            createdAt: '2025-08-02T12:00:00Z',
          },
        ],
        total: 2,
        limit: 10,
        offset: 0,
      };

      await testServiceMethod(
        service,
        'list',
        {
          path: '/content',
          method: 'get',
          queryParams: options,
        },
        expectedResponse,
        options
      );
    });
  });

  describe('create', () => {
    it('should make a POST request to create content', async () => {
      const requestData = {
        title: 'New Content',
        type: 'article',
        url: 'https://example.com/new-article',
        tags: ['tag1', 'tag4'],
      };
      const expectedResponse = {
        id: 'content-125',
        title: 'New Content',
        type: 'article',
        url: 'https://example.com/new-article',
        tags: ['tag1', 'tag4'],
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'create',
        {
          path: '/content',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('update', () => {
    it('should make a PUT request to update content', async () => {
      const contentId = 'content-123';
      const requestData = {
        title: 'Updated Content',
        tags: ['tag1', 'tag5'],
      };
      const expectedResponse = {
        id: contentId,
        title: 'Updated Content',
        type: 'article',
        url: 'https://example.com/article',
        tags: ['tag1', 'tag5'],
        createdAt: '2025-08-01T12:00:00Z',
        updatedAt: '2025-08-02T23:05:00Z',
      };

      await testServiceMethod(
        service,
        'update',
        {
          path: '/content/{id}',
          actualPath: `/content/${contentId}`,
          method: 'put',
          requestData,
        },
        expectedResponse,
        contentId,
        requestData
      );
    });
  });

  describe('deleteContent', () => {
    it('should make a DELETE request to remove content', async () => {
      const contentId = 'content-123';
      const expectedResponse = {
        success: true,
        message: 'Content deleted successfully',
      };

      await testServiceMethod(
        service,
        'deleteContent',
        {
          path: '/content/{id}',
          actualPath: `/content/${contentId}`,
          method: 'delete',
        },
        expectedResponse,
        contentId
      );
    });
  });
});