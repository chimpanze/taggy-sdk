/**
 * Auth Interceptor
 * Axios interceptor for handling authentication
 */

import { InternalAxiosRequestConfig } from 'axios';
import { AuthConfig } from '../config';

/**
 * Creates an authentication interceptor for Axios
 * @param authConfig Authentication configuration
 * @returns Axios request interceptor function
 */
export function createAuthInterceptor(authConfig: AuthConfig) {
  return async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    // Skip authentication for auth endpoints
    if (config.url?.startsWith('/auth/login') || config.url?.startsWith('/auth/register')) {
      return config;
    }

    // Clone the config to avoid modifying the original
    const newConfig = { ...config };

    // Use custom token provider if available
    if (authConfig.getToken) {
      const token = await authConfig.getToken();
      newConfig.headers.Authorization = `Bearer ${token}`;
      return newConfig;
    }

    // Use API key if available
    if (authConfig.apiKey) {
      newConfig.headers['X-API-Key'] = authConfig.apiKey;
      return newConfig;
    }

    // Use JWT token if available
    if (authConfig.token) {
      newConfig.headers.Authorization = `Bearer ${authConfig.token}`;
      return newConfig;
    }

    // No authentication provided
    return newConfig;
  };
}