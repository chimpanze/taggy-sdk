/**
 * Comments Service
 * Service for comment-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpReturnType } from 'openapi-typescript-fetch/types';

type CheckLikeResponse = OpReturnType<paths['/comments/{id}/like']['get']>;
type LikeCommentResponse = OpReturnType<paths['/comments/{id}/like']['post']>;
type UnlikeCommentResponse = OpReturnType<paths['/comments/{id}/like']['delete']>;

/**
 * Service for comment operations
 */
export class CommentsService extends BaseService {
  /**
   * Creates a new CommentsService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Check if the authenticated user has liked a comment
   * @param id Comment ID
   * @returns Promise with like status
   */
  async hasLiked(id: string): Promise<CheckLikeResponse> {
    return this.get<'/comments/{id}/like'>(`/comments/${id}/like` as '/comments/{id}/like');
  }

  /**
   * Like a comment for the authenticated user
   * @param id Comment ID
   * @returns Promise that resolves when like is complete
   */
  async like(id: string): Promise<LikeCommentResponse> {
    return this.post<'/comments/{id}/like'>(`/comments/${id}/like` as '/comments/{id}/like');
  }

  /**
   * Unlike a comment for the authenticated user
   * @param id Comment ID
   * @returns Promise that resolves when unlike is complete
   */
  async unlike(id: string): Promise<UnlikeCommentResponse> {
    return this.delete<'/comments/{id}/like'>(`/comments/${id}/like` as '/comments/{id}/like');
  }
}
