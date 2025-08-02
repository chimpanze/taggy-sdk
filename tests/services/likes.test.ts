import { describe, it, expect, beforeEach } from 'vitest';
import { LikesService } from '../../src/services/likes';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('LikesService', () => {
  let service: LikesService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new LikesService(mockFetcher);
  });

  describe('getLikedCollections', () => {
    it('should make a GET request to retrieve liked collections', async () => {
      const limit = 5;
      const expectedResponse = {
        collections: [
          {
            id: 123,
            name: 'Collection 1',
            description: 'Description 1',
            itemCount: 5,
            createdAt: '2025-08-01T12:00:00Z',
            likedAt: '2025-08-01T14:00:00Z',
          },
          {
            id: 124,
            name: 'Collection 2',
            description: 'Description 2',
            itemCount: 3,
            createdAt: '2025-08-02T12:00:00Z',
            likedAt: '2025-08-02T14:00:00Z',
          },
        ],
        total: 2,
      };

      await testServiceMethod(
        service,
        'getLikedCollections',
        {
          path: '/likes/collections',
          method: 'get',
          queryParams: { limit },
        },
        expectedResponse,
        limit
      );
    });

    it('should make a GET request without limit parameter', async () => {
      const expectedResponse = {
        collections: [
          {
            id: 123,
            name: 'Collection 1',
            description: 'Description 1',
            itemCount: 5,
            createdAt: '2025-08-01T12:00:00Z',
            likedAt: '2025-08-01T14:00:00Z',
          },
        ],
        total: 1,
      };

      await testServiceMethod(
        service,
        'getLikedCollections',
        {
          path: '/likes/collections',
          method: 'get',
        },
        expectedResponse
      );
    });
  });

  describe('checkLike', () => {
    it('should make a GET request to check if user has liked a collection', async () => {
      const collectionId = 123;
      const expectedResponse = {
        liked: true,
        likedAt: '2025-08-01T14:00:00Z',
      };

      await testServiceMethod(
        service,
        'checkLike',
        {
          path: '/likes/collections/{id}/like',
          actualPath: `/likes/collections/${collectionId}/like`,
          method: 'get',
        },
        expectedResponse,
        collectionId
      );
    });
  });

  describe('likeCollection', () => {
    it('should make a POST request to like a collection', async () => {
      const collectionId = 123;
      const expectedResponse = {
        success: true,
        message: 'Collection liked successfully',
        liked: true,
        likedAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'likeCollection',
        {
          path: '/likes/collections/{id}/like',
          actualPath: `/likes/collections/${collectionId}/like`,
          method: 'post',
        },
        expectedResponse,
        collectionId
      );
    });
  });

  describe('unlikeCollection', () => {
    it('should make a DELETE request to unlike a collection', async () => {
      const collectionId = 123;
      const expectedResponse = {
        success: true,
        message: 'Collection unliked successfully',
      };

      await testServiceMethod(
        service,
        'unlikeCollection',
        {
          path: '/likes/collections/{id}/like',
          actualPath: `/likes/collections/${collectionId}/like`,
          method: 'delete',
        },
        expectedResponse,
        collectionId
      );
    });
  });
});