/**
 * Tag Service
 * Service for tag-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

export type GetTagResponse = OpReturnType<paths['/tags/{id}']['get']>;
export type ListTagRequestData = OpArgType<paths['/tags']['get']>;
export type ListTagResponse = OpReturnType<paths['/tags']['get']>;
export type CreateTagRequestData = OpArgType<paths['/tags']['post']>;
export type CreateTagResponse = OpReturnType<paths['/tags']['post']>;
export type UpdateTagRequestData = OpArgType<paths['/tags/{id}']['put']>;
export type UpdateTagResponse = OpReturnType<paths['/tags/{id}']['put']>;
export type DeleteTagResponse = OpReturnType<paths['/tags/{id}']['delete']>;

/**
 * Service for tag operations
 */
export class TagService extends BaseService {
  /**
   * Creates a new TagService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Get tag by ID
   * @param id Tag ID
   * @returns Promise with tag data
   */
  async getById(id: string): Promise<GetTagResponse> {
    return this.get<`/tags/{id}`>(`/tags/${id}` as '/tags/{id}');
  }

  /**
   * List tags with pagination and filtering
   * @param options Filter and pagination options
   * @returns Promise with paginated tag response
   */
  async list(options?: ListTagRequestData): Promise<ListTagResponse> {
    return this.get<'/tags'>('/tags', options);
  }

  /**
   * Create new tag
   * @param data Tag creation data
   * @returns Promise with created tag
   */
  async create(data: CreateTagRequestData): Promise<CreateTagResponse> {
    return this.post<'/tags'>('/tags', data);
  }

  /**
   * Update existing tag
   * @param id Tag ID
   * @param data Tag update data
   * @returns Promise with updated tag
   */
  async update(id: string, data: UpdateTagRequestData): Promise<UpdateTagResponse> {
    return this.put<`/tags/{id}`>(`/tags/${id}` as '/tags/{id}', data);
  }

  /**
   * Delete tag
   * @param id Tag ID
   * @returns Promise that resolves when deletion is complete
   */
  async deleteTag(id: string): Promise<DeleteTagResponse> {
    return this.delete<`/tags/{id}`>(`/tags/${id}` as '/tags/{id}');
  }
}
