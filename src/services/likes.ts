/**
 * Likes Service
 * Service for likes-related API endpoints
 */

import { BaseService } from './base';
import { paths } from "../types/generated.ts";
import { TaggyFetcher } from "../types/fetch.ts";
import { OpReturnType } from "openapi-typescript-fetch/types";

type GetLikedCollectionsResponse = OpReturnType<paths['/likes/collections']['get']>
type CheckLikeResponse = OpReturnType<paths['/likes/collections/{id}/like']['get']>
type LikeCollectionResponse = OpReturnType<paths['/likes/collections/{id}/like']['post']>
type UnlikeCollectionResponse = OpReturnType<paths['/likes/collections/{id}/like']['delete']>

/**
 * Service for likes operations
 */
export class LikesService extends BaseService {
  /**
   * Creates a new LikesService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Get collections liked by the authenticated user
   * @param limit Optional limit for the number of results (default: 10)
   * @returns Promise with liked collections data
   */
  async getLikedCollections(limit?: number): Promise<GetLikedCollectionsResponse> {
    const params = limit ? { limit } : undefined;
    return this.get<'/likes/collections'>('/likes/collections', params);
  }

  /**
   * Check if the authenticated user has liked a collection
   * @param id Collection ID
   * @returns Promise with like status data
   */
  async checkLike(id: number): Promise<CheckLikeResponse> {
    return this.get<'/likes/collections/{id}/like'>(`/likes/collections/${id}/like` as '/likes/collections/{id}/like');
  }

  /**
   * Like a collection for the authenticated user
   * @param id Collection ID
   * @returns Promise with like operation result
   */
  async likeCollection(id: number): Promise<LikeCollectionResponse> {
    return this.post<'/likes/collections/{id}/like'>(`/likes/collections/${id}/like` as '/likes/collections/{id}/like');
  }

  /**
   * Unlike a collection for the authenticated user
   * @param id Collection ID
   * @returns Promise with unlike operation result
   */
  async unlikeCollection(id: number): Promise<UnlikeCollectionResponse> {
    return this.delete<'/likes/collections/{id}/like'>(`/likes/collections/${id}/like` as '/likes/collections/{id}/like');
  }
}