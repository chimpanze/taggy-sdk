import { describe, it, expect, beforeEach } from 'vitest';
import { SearchService } from '../../src/services/search';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('SearchService', () => {
  let service: SearchService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new SearchService(mockFetcher);
  });

  describe('search', () => {
    it('should make a GET request to search content with filters', async () => {
      const query = 'test query';
      const options = {
        limit: 10,
        offset: 0,
        sort: 'relevance',
        tags: ['tag1', 'tag2'],
      };
      const expectedResponse = {
        results: [
          {
            id: 'content-123',
            title: 'Test Content',
            url: 'https://example.com/article',
            createdAt: '2025-08-01T12:00:00Z',
          },
          {
            id: 'content-456',
            title: 'Another Test',
            url: 'https://example.com/another',
            createdAt: '2025-08-02T12:00:00Z',
          },
        ],
        total: 2,
        limit: 10,
        offset: 0,
      };

      await testServiceMethod(
        service,
        'search',
        {
          path: '/search',
          method: 'get',
          queryParams: { q: query, ...options },
        },
        expectedResponse,
        query,
        options
      );
    });
  });

  describe('getRecent', () => {
    it('should make a GET request to get recent content', async () => {
      const options = {
        limit: 5,
      };
      const expectedResponse = {
        results: [
          {
            id: 'content-789',
            title: 'Recent Content',
            url: 'https://example.com/recent',
            createdAt: '2025-08-02T23:00:00Z',
          },
          {
            id: 'content-101',
            title: 'New Content',
            url: 'https://example.com/new',
            createdAt: '2025-08-02T22:00:00Z',
          },
        ],
        total: 2,
      };

      await testServiceMethod(
        service,
        'getRecent',
        {
          path: '/search/recent',
          method: 'get',
          queryParams: options,
        },
        expectedResponse,
        options
      );
    });
  });

  describe('getSuggestions', () => {
    it('should make a GET request to get search suggestions', async () => {
      const query = 'prog';
      const expectedResponse = {
        suggestions: [
          'programming',
          'progress',
          'progressive web apps',
        ],
      };

      await testServiceMethod(
        service,
        'getSuggestions',
        {
          path: '/search/suggestions',
          method: 'get',
          queryParams: { q: query },
        },
        expectedResponse,
        query
      );
    });
  });

  describe('getTrending', () => {
    it('should make a GET request to get trending content', async () => {
      const options = {
        limit: 3,
      };
      const expectedResponse = {
        results: [
          {
            id: 'content-202',
            title: 'Trending Topic',
            url: 'https://example.com/trending',
            popularity: 98,
          },
          {
            id: 'content-303',
            title: 'Hot Topic',
            url: 'https://example.com/hot',
            popularity: 95,
          },
          {
            id: 'content-404',
            title: 'Popular Topic',
            url: 'https://example.com/popular',
            popularity: 90,
          },
        ],
        total: 3,
      };

      await testServiceMethod(
        service,
        'getTrending',
        {
          path: '/search/trending',
          method: 'get',
          queryParams: options,
        },
        expectedResponse,
        options
      );
    });
  });
});