/**
 * Auth Interceptor
 */

import { AuthConfig } from '../config';
import { CustomRequestInit } from '../types/fetch.ts';
import type { ApiResponse } from 'openapi-typescript-fetch';

/**
 * Creates an authentication interceptor for Axios
 * @param authConfig Authentication configuration
 * @returns Axios request interceptor function
 */
export function createAuthInterceptor(authConfig: AuthConfig) {
  return async (
    url: string,
    init: CustomRequestInit,
    next: (url: string, init: CustomRequestInit) => Promise<ApiResponse>,
  ) => {
    // Skip authentication for auth endpoints
    if (url?.startsWith('/auth/login') || url?.startsWith('/auth/register')) {
      return next(url, init);
    }

    // Clone the config to avoid modifying the original
    const newConfig = { ...init };

    // Use custom token provider if available
    if (authConfig.getToken) {
      const token = await authConfig.getToken();
      newConfig.headers.set('Authorization', `Bearer ${token}`);
      return next(url, newConfig);
    }

    // Use JWT token if available
    if (authConfig.token) {
      newConfig.headers.set('Authorization', `Bearer ${authConfig.token}`);
      return next(url, newConfig);
    }

    // No authentication provided
    return next(url, newConfig);
  };
}
