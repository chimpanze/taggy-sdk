/**
 * Taggy SDK - A TypeScript SDK for the Taggy API
 * @module TaggySDK
 */

// Export main client
export { TaggyClient } from './client';

// Export configuration types
export type { TaggyConfig, AuthConfig } from './config';
export { defaultConfig } from './config';

// Export services
export { AuthService } from './services/auth';
export { ContentService } from './services/content';
export { TagService } from './services/tag';

// Export error classes
export {
  TaggyError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
} from './interceptors/error';

// Export utility functions
export * from './utils/helpers';

// Version information
export const VERSION = '1.0.0';
