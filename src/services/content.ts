/**
 * Content Service
 * Service for content-related API endpoints
 */

import { BaseService } from './base';
import {paths} from "../types/generated.ts";
import {TaggyFetcher} from "../types/fetch.ts";
import {OpArgType, OpReturnType} from "openapi-typescript-fetch/types";

type GetContentResponse = OpReturnType<paths['/content/{id}']['get']>
type ListContentRequestData = OpArgType<paths['/content']['post']>
type ListContentResponse = OpReturnType<paths['/content']['get']>
type CreateContentRequestData = OpArgType<paths['/content']['post']>
type CreateContentResponse = OpReturnType<paths['/content']['post']>
type UpdateContentRequestData = OpArgType<paths['/content/{id}']['put']>
type DeleteContentResponse = OpReturnType<paths['/content/{id}']['delete']>

/**
 * Service for content operations
 */
export class ContentService extends BaseService {
  /**
   * Creates a new ContentService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Get content by ID
   * @param id Content ID
   * @returns Promise with content data
   */
  async getById(id: string): Promise<GetContentResponse> {
    return this.get<'/content/{id}'>(`/content/${id}` as '/content/{id}');
  }

  /**
   * List content with pagination and filtering
   * @param options Filter and pagination options
   * @returns Promise with paginated content response
   */
  async list(options?: ListContentRequestData): Promise<ListContentResponse> {
    return this.get<'/content'>('/content', options);
  }

  /**
   * Create new content
   * @param data Content creation data
   * @returns Promise with created content
   */
  async create(data: CreateContentRequestData): Promise<CreateContentResponse> {
    return this.post<'/content'>('/content', data);
  }

  /**
   * Update existing content
   * @param id Content ID
   * @param data Content update data
   * @returns Promise with updated content
   */
  async update(id: string, data: UpdateContentRequestData): Promise<GetContentResponse> {
    return this.put<`/content/{id}`>(`/content/${id}` as '/content/{id}', data);
  }

  /**
   * Delete content
   * @param id Content ID
   * @returns Promise that resolves when deletion is complete
   */
  async deleteContent(id: string): Promise<DeleteContentResponse> {
    return this.delete<`/content/{id}`>(`/content/${id}` as '/content/{id}');
  }
}