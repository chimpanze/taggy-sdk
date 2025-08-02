import { describe, it, expect, beforeEach } from 'vitest';
import { MediaService } from '../../src/services/media';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('MediaService', () => {
  let service: MediaService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new MediaService(mockFetcher);
  });

  describe('deleteMedia', () => {
    it('should make a DELETE request to remove media', async () => {
      const mediaId = 'media-123';
      const expectedResponse = {
        success: true,
        message: 'Media deleted successfully',
      };

      await testServiceMethod(
        service,
        'deleteMedia',
        {
          path: '/media/{id}',
          actualPath: `/media/${mediaId}`,
          method: 'delete',
        },
        expectedResponse,
        mediaId
      );
    });
  });

  describe('fetchMedia', () => {
    it('should make a POST request to fetch media from URL', async () => {
      const requestData = {
        url: 'https://example.com/video.mp4',
        options: {
          quality: 'high',
          format: 'mp4',
        },
      };
      const expectedResponse = {
        id: 'job-123',
        url: 'https://example.com/video.mp4',
        status: 'processing',
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'fetchMedia',
        {
          path: '/media/fetch',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('fetchAudio', () => {
    it('should make a POST request to fetch audio from video URL', async () => {
      const requestData = {
        url: 'https://example.com/video.mp4',
        options: {
          format: 'mp3',
          bitrate: 320,
        },
      };
      const expectedResponse = {
        id: 'job-123',
        url: 'https://example.com/video.mp4',
        status: 'processing',
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'fetchAudio',
        {
          path: '/media/fetch-audio',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('getFetchStatus', () => {
    it('should make a GET request to check media fetch status', async () => {
      const jobId = 'job-123';
      const expectedResponse = {
        id: jobId,
        status: 'completed',
        progress: 100,
        completedAt: '2025-08-02T23:05:00Z',
      };

      await testServiceMethod(
        service,
        'getFetchStatus',
        {
          path: '/media/fetch-status/{jobId}',
          actualPath: `/media/fetch-status/${jobId}`,
          method: 'get',
        },
        expectedResponse,
        jobId
      );
    });
  });

  describe('getFormats', () => {
    it('should make a GET request to get available media formats', async () => {
      const url = encodeURIComponent('https://example.com/video.mp4');
      const expectedResponse = {
        formats: [
          { format: 'mp4', quality: '720p' },
          { format: 'mp4', quality: '1080p' },
          { format: 'webm', quality: '720p' },
        ],
      };

      await testServiceMethod(
        service,
        'getFormats',
        {
          path: '/media/formats/{url}',
          actualPath: `/media/formats/${url}`,
          method: 'get',
        },
        expectedResponse,
        url
      );
    });
  });

  describe('getSettings', () => {
    it('should make a GET request to get media settings', async () => {
      const expectedResponse = {
        defaultQuality: 'high',
        autoDownload: false,
        preferredFormat: 'mp4',
      };

      await testServiceMethod(
        service,
        'getSettings',
        {
          path: '/media/settings',
          method: 'get',
        },
        expectedResponse
      );
    });
  });

  describe('updateSettings', () => {
    it('should make a PUT request to update media settings', async () => {
      const requestData = {
        defaultQuality: 'medium',
        autoDownload: true,
        preferredFormat: 'webm',
      };
      const expectedResponse = {
        defaultQuality: 'medium',
        autoDownload: true,
        preferredFormat: 'webm',
      };

      await testServiceMethod(
        service,
        'updateSettings',
        {
          path: '/media/settings',
          method: 'put',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });
});