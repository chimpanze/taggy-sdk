import { describe, it, expect, beforeEach } from 'vitest';
import { CollectionsService } from '../../src/services/collections';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('CollectionsService', () => {
  let service: CollectionsService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new CollectionsService(mockFetcher);
  });

  describe('getById', () => {
    it('should make a GET request to retrieve a collection by ID', async () => {
      const collectionId = 123;
      const expectedResponse = {
        id: collectionId,
        name: 'My Collection',
        description: 'A collection of items',
        itemCount: 5,
        createdAt: '2025-08-01T12:00:00Z',
      };

      await testServiceMethod(
        service,
        'getById',
        {
          path: '/collections/{id}',
          actualPath: `/collections/${collectionId}`,
          method: 'get',
        },
        expectedResponse,
        collectionId
      );
    });
  });

  describe('list', () => {
    it('should make a GET request to list collections', async () => {
      const options = {
        limit: 10,
        offset: 0,
        sort: 'createdAt',
      };
      const expectedResponse = {
        items: [
          {
            id: 123,
            name: 'Collection 1',
            description: 'Description 1',
            itemCount: 5,
            createdAt: '2025-08-01T12:00:00Z',
          },
          {
            id: 124,
            name: 'Collection 2',
            description: 'Description 2',
            itemCount: 3,
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
          path: '/collections',
          method: 'get',
          queryParams: options,
        },
        expectedResponse,
        options
      );
    });
  });

  describe('create', () => {
    it('should make a POST request to create a collection', async () => {
      const requestData = {
        name: 'New Collection',
        description: 'A new collection',
        isPublic: true,
      };
      const expectedResponse = {
        id: 125,
        name: 'New Collection',
        description: 'A new collection',
        isPublic: true,
        itemCount: 0,
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'create',
        {
          path: '/collections',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('update', () => {
    it('should make a PUT request to update a collection', async () => {
      const collectionId = 123;
      const requestData = {
        name: 'Updated Collection',
        description: 'Updated description',
        isPublic: false,
      };
      const expectedResponse = {
        id: collectionId,
        name: 'Updated Collection',
        description: 'Updated description',
        isPublic: false,
        itemCount: 5,
        createdAt: '2025-08-01T12:00:00Z',
        updatedAt: '2025-08-02T23:05:00Z',
      };

      await testServiceMethod(
        service,
        'update',
        {
          path: '/collections/{id}',
          actualPath: `/collections/${collectionId}`,
          method: 'put',
          requestData,
        },
        expectedResponse,
        collectionId,
        requestData
      );
    });
  });

  describe('deleteCollection', () => {
    it('should make a DELETE request to remove a collection', async () => {
      const collectionId = 123;
      const expectedResponse = {
        success: true,
        message: 'Collection deleted successfully',
      };

      await testServiceMethod(
        service,
        'deleteCollection',
        {
          path: '/collections/{id}',
          actualPath: `/collections/${collectionId}`,
          method: 'delete',
        },
        expectedResponse,
        collectionId
      );
    });
  });

  describe('addItems', () => {
    it('should make a POST request to add items to a collection', async () => {
      const collectionId = 123;
      const requestData = {
        itemIds: [456, 789],
      };
      const expectedResponse = {
        success: true,
        message: 'Items added to collection',
        addedCount: 2,
      };

      await testServiceMethod(
        service,
        'addItems',
        {
          path: '/collections/{id}/items',
          actualPath: `/collections/${collectionId}/items`,
          method: 'post',
          requestData,
        },
        expectedResponse,
        collectionId,
        requestData
      );
    });
  });

  describe('removeItem', () => {
    it('should make a DELETE request to remove an item from a collection', async () => {
      const collectionId = 123;
      const itemId = 456;
      const expectedResponse = {
        success: true,
        message: 'Item removed from collection',
      };

      await testServiceMethod(
        service,
        'removeItem',
        {
          path: '/collections/{id}/items/{itemId}',
          actualPath: `/collections/${collectionId}/items/${itemId}`,
          method: 'delete',
        },
        expectedResponse,
        collectionId,
        itemId
      );
    });
  });
});