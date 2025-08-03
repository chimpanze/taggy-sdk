/**
 * Archive Service
 * Service for archive-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

export type GetArchiveResponse = OpReturnType<paths['/archive/{id}']['get']>;
export type CreateArchiveRequestData = OpArgType<paths['/archive/create']['post']>;
export type CreateArchiveResponse = OpReturnType<paths['/archive/create']['post']>;
export type GetArchiveStatusResponse = OpReturnType<paths['/archive/status/{id}']['get']>;
export type DeleteArchiveResponse = OpReturnType<paths['/archive/{id}']['delete']>;

/**
 * Service for archive operations
 */
export class ArchiveService extends BaseService {
  /**
   * Creates a new ArchiveService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Get archive by ID
   * @param id Archive ID
   * @returns Promise with archive data
   */
  async getById(id: number): Promise<GetArchiveResponse> {
    return this.get<'/archive/{id}'>(`/archive/${id}` as '/archive/{id}');
  }

  /**
   * Create a web page archive
   * @param data Archive creation data
   * @returns Promise with created archive
   */
  async create(data: CreateArchiveRequestData): Promise<CreateArchiveResponse> {
    return this.post<'/archive/create'>('/archive/create', data);
  }

  /**
   * Get archive creation status
   * @param id Archive ID
   * @returns Promise with archive status data
   */
  async getStatus(id: number): Promise<GetArchiveStatusResponse> {
    return this.get<'/archive/status/{id}'>(`/archive/status/${id}` as '/archive/status/{id}');
  }

  /**
   * Delete archive
   * @param id Archive ID
   * @returns Promise that resolves when deletion is complete
   */
  async deleteArchive(id: number): Promise<DeleteArchiveResponse> {
    return this.delete<'/archive/{id}'>(`/archive/${id}` as '/archive/{id}');
  }
}
