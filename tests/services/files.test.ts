import { describe, it, expect, beforeEach } from 'vitest';
import { FilesService } from '../../src/services/files';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('FilesService', () => {
  let service: FilesService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new FilesService(mockFetcher);
  });

  describe('download', () => {
    it('should make a GET request to download a file', async () => {
      const fileId = 'file-123';
      const expectedResponse = {
        id: fileId,
        name: 'example.pdf',
        contentType: 'application/pdf',
        size: 1024,
        url: 'https://example.com/files/example.pdf',
        createdAt: '2025-08-01T12:00:00Z',
      };

      await testServiceMethod(
        service,
        'download',
        {
          path: '/files/{id}',
          actualPath: `/files/${fileId}`,
          method: 'get',
        },
        expectedResponse,
        fileId
      );
    });
  });

  describe('deleteFile', () => {
    it('should make a DELETE request to remove a file', async () => {
      const fileId = 'file-123';
      const expectedResponse = {
        success: true,
        message: 'File deleted successfully',
      };

      await testServiceMethod(
        service,
        'deleteFile',
        {
          path: '/files/{id}',
          actualPath: `/files/${fileId}`,
          method: 'delete',
        },
        expectedResponse,
        fileId
      );
    });
  });

  describe('generatePresignedURL', () => {
    it('should make a POST request to generate a presigned URL', async () => {
      const requestData = {
        fileId: 'file-123',
        expiresIn: 3600,
        operation: 'read',
      };
      const expectedResponse = {
        url: 'https://example.com/presigned-url',
        expiresAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'generatePresignedURL',
        {
          path: '/files/presigned',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('upload', () => {
    it('should make a POST request to upload a file', async () => {
      const requestData = {
        file: 'file-binary-data',
        title: 'Example File',
        description: 'An example file for testing',
      };
      const expectedResponse = {
        id: 'file-123',
        name: 'Example File',
        contentType: 'application/pdf',
        size: 1024,
        url: 'https://example.com/files/example.pdf',
        createdAt: '2025-08-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'upload',
        {
          path: '/files/upload',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });
});