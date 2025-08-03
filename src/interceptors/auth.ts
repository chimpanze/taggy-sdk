/**
 * Auth Interceptor
 */

import { CustomRequestInit } from '../types/fetch.ts';
import type { ApiResponse } from 'openapi-typescript-fetch';

/**
 * Creates an authentication interceptor for Axios
 * @param getToken Function to get the current token
 * @returns Axios request interceptor function
 */
export function createAuthInterceptor(getToken: () => string | undefined) {
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

    // Use JWT token if available
    const token = getToken();
    if (token) {
      newConfig.headers.set('Authorization', `Bearer ${token}`);
    }

    // No authentication provided
    return next(url, newConfig);
  };
}
