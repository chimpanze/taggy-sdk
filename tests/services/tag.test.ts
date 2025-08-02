import { describe, it, expect, beforeEach } from 'vitest';
import { TagService } from '../../src/services/tag';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('TagService', () => {
  let service: TagService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new TagService(mockFetcher);
  });

  describe('getById', () => {
    it('should make a GET request to retrieve a tag by ID', async () => {
      const tagId = 'tag-123';
      const expectedResponse = {
        id: tagId,
        name: 'Example Tag',
        color: '#FF5733',
        createdAt: '2025-08-01T12:00:00Z',
        updatedAt: '2025-08-02T12:00:00Z',
      };

      await testServiceMethod(
        service,
        'getById',
        {
          path: '/tags/{id}',
          actualPath: `/tags/${tagId}`,
          method: 'get',
        },
        expectedResponse,
        tagId
      );
    });
  });

  describe('list', () => {
    it('should make a GET request to list tags with pagination and filtering', async () => {
      const options = {
        limit: 10,
        offset: 0,
        sort: 'name',
        order: 'asc',
      };
      const expectedResponse = {
        tags: [
          {
            id: 'tag-123',
            name: 'Example Tag',
            color: '#FF5733',
          },
          {
            id: 'tag-456',
            name: 'Another Tag',
            color: '#33FF57',
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
          path: '/tags',
          method: 'get',
          queryParams: options,
        },
        expectedResponse,
        options
      );
    });
  });

  describe('create', () => {
    it('should make a POST request to create a new tag', async () => {
      const requestData = {
        name: 'New Tag',
        color: '#5733FF',
        description: 'A new tag for testing',
      };
      const expectedResponse = {
        id: 'tag-789',
        name: 'New Tag',
        color: '#5733FF',
        description: 'A new tag for testing',
        createdAt: '2025-08-02T23:04:00Z',
        updatedAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'create',
        {
          path: '/tags',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('update', () => {
    it('should make a PUT request to update an existing tag', async () => {
      const tagId = 'tag-123';
      const requestData = {
        name: 'Updated Tag',
        color: '#3357FF',
        description: 'An updated tag for testing',
      };
      const expectedResponse = {
        id: tagId,
        name: 'Updated Tag',
        color: '#3357FF',
        description: 'An updated tag for testing',
        createdAt: '2025-08-01T12:00:00Z',
        updatedAt: '2025-08-02T23:05:00Z',
      };

      await testServiceMethod(
        service,
        'update',
        {
          path: '/tags/{id}',
          actualPath: `/tags/${tagId}`,
          method: 'put',
          requestData,
        },
        expectedResponse,
        tagId,
        requestData
      );
    });
  });

  describe('deleteTag', () => {
    it('should make a DELETE request to remove a tag', async () => {
      const tagId = 'tag-123';
      const expectedResponse = {
        success: true,
        message: 'Tag deleted successfully',
      };

      await testServiceMethod(
        service,
        'deleteTag',
        {
          path: '/tags/{id}',
          actualPath: `/tags/${tagId}`,
          method: 'delete',
        },
        expectedResponse,
        tagId
      );
    });
  });
});