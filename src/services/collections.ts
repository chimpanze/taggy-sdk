/**
 * Collections Service
 * Service for collections-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

type GetCollectionResponse = OpReturnType<paths['/collections/{id}']['get']>;
type ListCollectionsRequestData = OpArgType<paths['/collections']['get']>;
type ListCollectionsResponse = OpReturnType<paths['/collections']['get']>;
type CreateCollectionRequestData = OpArgType<paths['/collections']['post']>;
type CreateCollectionResponse = OpReturnType<paths['/collections']['post']>;
type UpdateCollectionRequestData = OpArgType<paths['/collections/{id}']['put']>;
type DeleteCollectionResponse = OpReturnType<paths['/collections/{id}']['delete']>;
type AddItemsRequestData = OpArgType<paths['/collections/{id}/items']['post']>;
type AddItemsResponse = OpReturnType<paths['/collections/{id}/items']['post']>;
type RemoveItemResponse = OpReturnType<paths['/collections/{id}/items/{itemId}']['delete']>;

/**
 * Service for collections operations
 */
export class CollectionsService extends BaseService {
  /**
   * Creates a new CollectionsService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Get collection by ID
   * @param id Collection ID
   * @returns Promise with collection data
   */
  async getById(id: number): Promise<GetCollectionResponse> {
    return this.get<'/collections/{id}'>(`/collections/${id}` as '/collections/{id}');
  }

  /**
   * List collections with filtering and sorting
   * @param options Filter and sorting options
   * @returns Promise with collections response
   */
  async list(options?: ListCollectionsRequestData): Promise<ListCollectionsResponse> {
    return this.get<'/collections'>('/collections', options);
  }

  /**
   * Create new collection
   * @param data Collection creation data
   * @returns Promise with created collection
   */
  async create(data: CreateCollectionRequestData): Promise<CreateCollectionResponse> {
    return this.post<'/collections'>('/collections', data);
  }

  /**
   * Update existing collection
   * @param id Collection ID
   * @param data Collection update data
   * @returns Promise with updated collection
   */
  async update(id: number, data: UpdateCollectionRequestData): Promise<GetCollectionResponse> {
    return this.put<'/collections/{id}'>(`/collections/${id}` as '/collections/{id}', data);
  }

  /**
   * Delete collection
   * @param id Collection ID
   * @returns Promise that resolves when deletion is complete
   */
  async deleteCollection(id: number): Promise<DeleteCollectionResponse> {
    return this.delete<'/collections/{id}'>(`/collections/${id}` as '/collections/{id}');
  }

  /**
   * Add items to a collection
   * @param id Collection ID
   * @param data Items to add
   * @returns Promise that resolves when items are added
   */
  async addItems(id: number, data: AddItemsRequestData): Promise<AddItemsResponse> {
    return this.post<'/collections/{id}/items'>(
      `/collections/${id}/items` as '/collections/{id}/items',
      data,
    );
  }

  /**
   * Remove an item from a collection
   * @param collectionId Collection ID
   * @param itemId Item ID to remove
   * @returns Promise that resolves when item is removed
   */
  async removeItem(collectionId: number, itemId: number): Promise<RemoveItemResponse> {
    return this.delete<'/collections/{id}/items/{itemId}'>(
      `/collections/${collectionId}/items/${itemId}` as '/collections/{id}/items/{itemId}',
    );
  }
}
