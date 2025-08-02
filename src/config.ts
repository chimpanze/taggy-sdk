/**
 * Taggy SDK Configuration
 * Configuration types and defaults for the SDK
 */
import packageJson from '../package.json';
const version = packageJson.version;


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
  version: version,
  debug: false,
  maxRetries: 3,
  retryDelay: 1000,
  headers: {},
};
