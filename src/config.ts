/**
 * Taggy SDK Configuration
 * Configuration types and defaults for the SDK
 */

import { VERSION } from './index';

/**
 * Authentication configuration
 */
export interface AuthConfig {
  /**
   * API key for authentication
   */
  apiKey?: string;
  
  /**
   * JWT token for authentication
   */
  token?: string;
  
  /**
   * Refresh token for refreshing JWT
   */
  refreshToken?: string;
  
  /**
   * Custom function to get authentication token
   */
  getToken?: () => Promise<string>;
}

/**
 * SDK configuration options
 */
export interface TaggyConfig {
  /**
   * Base URL for API requests
   */
  baseUrl: string;
  
  /**
   * Request timeout in milliseconds
   */
  timeout: number;
  
  /**
   * SDK version
   */
  version: string;
  
  /**
   * Authentication configuration
   */
  auth?: AuthConfig;
  
  /**
   * Custom headers to include in all requests
   */
  headers?: Record<string, string>;
  
  /**
   * Enable debug mode for additional logging
   */
  debug: boolean;
  
  /**
   * Maximum number of retries for failed requests
   */
  maxRetries: number;
  
  /**
   * Retry delay in milliseconds
   */
  retryDelay: number;
}

/**
 * Default configuration values
 */
export const defaultConfig: TaggyConfig = {
  baseUrl: 'http://localhost:8080/api/v1',
  timeout: 30000,
  version: VERSION,
  debug: false,
  maxRetries: 3,
  retryDelay: 1000,
  headers: {},
};