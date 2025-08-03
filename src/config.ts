/**
 * Taggy SDK Configuration
 * Configuration types and defaults for the SDK
 */
import packageJson from '../package.json';
const version = packageJson.version;

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
   * Custom headers to include in all requests
   */
  headers?: Record<string, string>;

  /**
   * Enable debug mode for additional logging
   */
  debug: boolean;
}

/**
 * Default configuration values
 */
export const defaultConfig: TaggyConfig = {
  baseUrl: 'http://localhost:8080/api/v1',
  version: version,
  debug: false,
  headers: {},
};
