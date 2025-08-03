/**
 * Files Service
 * Service for file-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

export type DownloadFileResponse = OpReturnType<paths['/files/{id}']['get']>;
export type DeleteFileResponse = OpReturnType<paths['/files/{id}']['delete']>;
export type PresignedURLRequestData = OpArgType<paths['/files/presigned']['post']>;
export type PresignedURLResponse = OpReturnType<paths['/files/presigned']['post']>;
export type FileUploadRequestData = OpArgType<paths['/files/upload']['post']>;
export type FileUploadResponse = OpReturnType<paths['/files/upload']['post']>;

/**
 * Service for file operations
 */
export class FilesService extends BaseService {
  /**
   * Creates a new FilesService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Download a file by ID
   * @param id File ID
   * @returns Promise with file content
   */
  async download(id: string): Promise<DownloadFileResponse> {
    return this.get<'/files/{id}'>(`/files/${id}` as '/files/{id}');
  }

  /**
   * Delete a file by ID
   * @param id File ID
   * @returns Promise that resolves when deletion is complete
   */
  async deleteFile(id: string): Promise<DeleteFileResponse> {
    return this.delete<`/files/{id}`>(`/files/${id}` as '/files/{id}');
  }

  /**
   * Generate a presigned URL for temporary file access
   * @param data Presigned URL request data
   * @returns Promise with presigned URL response
   */
  async generatePresignedURL(data: PresignedURLRequestData): Promise<PresignedURLResponse> {
    return this.post<'/files/presigned'>('/files/presigned', data);
  }

  /**
   * Upload a file with optional title and description
   * @param data File upload data (multipart/form-data)
   * @returns Promise with uploaded file details
   */
  async upload(data: FileUploadRequestData): Promise<FileUploadResponse> {
    return this.post<'/files/upload'>('/files/upload', data);
  }
}
