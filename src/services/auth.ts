/**
 * Auth Service
 * Service for authentication-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

type GetUserProfileResponse = OpReturnType<paths['/auth/user']['get']>;
type ValidateTokenRequestData = OpArgType<paths['/auth/validate']['post']>;
type ValidateTokenResponse = OpReturnType<paths['/auth/validate']['post']>;

/**
 * Service for authentication operations
 */
export class AuthService extends BaseService {
  /**
   * Creates a new AuthService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Get current user profile
   * @returns Promise with user profile data
   */
  async getCurrentUser(): Promise<GetUserProfileResponse> {
    return this.get<'/auth/user'>('/auth/user');
  }

  /**
   * Validate JWT token
   * @param data Token validation request data
   * @returns Promise with validation response
   */
  async validateToken(data: ValidateTokenRequestData): Promise<ValidateTokenResponse> {
    return this.post<'/auth/validate'>('/auth/validate', data);
  }
}
