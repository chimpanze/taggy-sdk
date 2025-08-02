/**
 * Auth Service
 * Service for authentication-related API endpoints
 */

import { BaseService } from './base';
import { paths } from "../types/generated.ts";
import { TaggyFetcher } from "../types/fetch.ts";
import {OpArgType, OpReturnType} from "openapi-typescript-fetch/types";

type UserResponse = OpReturnType<paths['/auth/user']['get']>
type ValidateResponse = OpReturnType<paths['/auth/validate']['post']>
type ValidateRequestData = OpArgType<paths['/auth/validate']['post']>

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
   * Get the current user profile
   * @returns Promise with user profile data
   */
  async getCurrentUser(): Promise<UserResponse> {
    return this.get('/auth/user');
  }

  /**
   * Get the current user profile
   * @returns Promise with user profile data
   */
  async validate(data: ValidateRequestData): Promise<ValidateResponse> {
    return this.post('/auth/validate', data);
  }
}