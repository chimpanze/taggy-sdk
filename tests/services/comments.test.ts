import { describe, it, expect, beforeEach } from 'vitest';
import { CommentsService } from '../../src/services/comments';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('CommentsService', () => {
  let service: CommentsService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new CommentsService(mockFetcher);
  });

  describe('hasLiked', () => {
    it('should make a GET request to check if user has liked a comment', async () => {
      const commentId = 'comment-123';
      const expectedResponse = {
        liked: true,
        likedAt: '2025-08-01T12:00:00Z',
      };

      await testServiceMethod(
        service,
        'hasLiked',
        {
          path: '/comments/{id}/like',
          actualPath: `/comments/${commentId}/like`,
          method: 'get',
        },
        expectedResponse,
        commentId
      );
    });
  });

  describe('like', () => {
    it('should make a POST request to like a comment', async () => {
      const commentId = 'comment-123';
      const expectedResponse = {
        success: true,
        message: 'Comment liked successfully',
        liked: true,
        likedAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'like',
        {
          path: '/comments/{id}/like',
          actualPath: `/comments/${commentId}/like`,
          method: 'post',
        },
        expectedResponse,
        commentId
      );
    });
  });

  describe('unlike', () => {
    it('should make a DELETE request to unlike a comment', async () => {
      const commentId = 'comment-123';
      const expectedResponse = {
        success: true,
        message: 'Comment unliked successfully',
      };

      await testServiceMethod(
        service,
        'unlike',
        {
          path: '/comments/{id}/like',
          actualPath: `/comments/${commentId}/like`,
          method: 'delete',
        },
        expectedResponse,
        commentId
      );
    });
  });
});