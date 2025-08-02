import { describe, it, expect, beforeEach } from 'vitest';
import { ExtensionService } from '../../src/services/extension';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('ExtensionService', () => {
  let service: ExtensionService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new ExtensionService(mockFetcher);
  });

  describe('getAISuggestions', () => {
    it('should make a GET request to retrieve AI suggestions for content', async () => {
      const contentId = 'content-123';
      const expectedResponse = {
        suggestions: [
          { tag: 'technology', confidence: 0.95 },
          { tag: 'programming', confidence: 0.87 },
          { tag: 'javascript', confidence: 0.82 },
        ],
      };

      await testServiceMethod(
        service,
        'getAISuggestions',
        {
          path: '/extension/ai-suggestions/{contentId}',
          actualPath: `/extension/ai-suggestions/${contentId}`,
          method: 'get',
        },
        expectedResponse,
        contentId
      );
    });
  });

  describe('archivePage', () => {
    it('should make a POST request to archive a page', async () => {
      const requestData = {
        url: 'https://example.com/article',
        options: {
          includeImages: true,
          saveAsPdf: false,
        },
      };
      const expectedResponse = {
        id: 'archive-123',
        url: 'https://example.com/article',
        status: 'processing',
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'archivePage',
        {
          path: '/extension/archive',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('getMediaJobStatus', () => {
    it('should make a GET request to check media job status', async () => {
      const jobId = 'job-123';
      const expectedResponse = {
        id: jobId,
        status: 'completed',
        progress: 100,
        result: {
          contentId: 'content-456',
          mediaType: 'image',
        },
        completedAt: '2025-08-02T23:05:00Z',
      };

      await testServiceMethod(
        service,
        'getMediaJobStatus',
        {
          path: '/extension/media-job/{jobId}',
          actualPath: `/extension/media-job/${jobId}`,
          method: 'get',
        },
        expectedResponse,
        jobId
      );
    });
  });

  describe('quickTag', () => {
    it('should make a POST request to quickly tag content', async () => {
      const requestData = {
        contentId: 'content-123',
        tags: ['tag1', 'tag2'],
      };
      const expectedResponse = {
        success: true,
        contentId: 'content-123',
        tags: ['tag1', 'tag2'],
        updatedAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'quickTag',
        {
          path: '/extension/quick-tag',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('saveBookmark', () => {
    it('should make a POST request to save a bookmark', async () => {
      const requestData = {
        url: 'https://example.com/article',
        title: 'Example Article',
        description: 'An example article for testing',
        tags: ['tag1', 'tag2'],
      };
      const expectedResponse = {
        id: 'content-123',
        type: 'bookmark',
        url: 'https://example.com/article',
        title: 'Example Article',
        description: 'An example article for testing',
        tags: ['tag1', 'tag2'],
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'saveBookmark',
        {
          path: '/extension/save-bookmark',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('saveImage', () => {
    it('should make a POST request to save an image', async () => {
      const requestData = {
        imageUrl: 'https://example.com/image.jpg',
        pageUrl: 'https://example.com/article',
        title: 'Example Image',
        tags: ['tag1', 'tag2'],
      };
      const expectedResponse = {
        id: 'content-123',
        type: 'image',
        imageUrl: 'https://example.com/image.jpg',
        pageUrl: 'https://example.com/article',
        title: 'Example Image',
        tags: ['tag1', 'tag2'],
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'saveImage',
        {
          path: '/extension/save-image',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('saveText', () => {
    it('should make a POST request to save text', async () => {
      const requestData = {
        text: 'This is some selected text',
        pageUrl: 'https://example.com/article',
        title: 'Selected Text',
        tags: ['tag1', 'tag2'],
      };
      const expectedResponse = {
        id: 'content-123',
        type: 'text',
        text: 'This is some selected text',
        pageUrl: 'https://example.com/article',
        title: 'Selected Text',
        tags: ['tag1', 'tag2'],
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'saveText',
        {
          path: '/extension/save-text',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('saveVideo', () => {
    it('should make a POST request to save a video', async () => {
      const requestData = {
        videoUrl: 'https://example.com/video.mp4',
        pageUrl: 'https://example.com/article',
        title: 'Example Video',
        tags: ['tag1', 'tag2'],
      };
      const expectedResponse = {
        id: 'content-123',
        type: 'video',
        videoUrl: 'https://example.com/video.mp4',
        pageUrl: 'https://example.com/article',
        title: 'Example Video',
        tags: ['tag1', 'tag2'],
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'saveVideo',
        {
          path: '/extension/save-video',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('getTags', () => {
    it('should make a GET request to get user tags', async () => {
      const options = {
        recent: true,
        limit: 10,
      };
      const expectedResponse = {
        tags: [
          { name: 'tag1', count: 15 },
          { name: 'tag2', count: 10 },
          { name: 'tag3', count: 5 },
        ],
      };

      await testServiceMethod(
        service,
        'getTags',
        {
          path: '/extension/tags',
          method: 'get',
          queryParams: options,
        },
        expectedResponse,
        options
      );
    });
  });
});