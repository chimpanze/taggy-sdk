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
export { ArchiveService } from './services/archive';
export { CollectionsService } from './services/collections';
export { FilesService } from './services/files';
export { LikesService } from './services/likes';
export { MediaService } from './services/media';
export { SearchService } from './services/search';
export { SharingService } from './services/sharing';
export { ExtensionService } from './services/extension';
export { AIService } from './services/ai';
export { CommentsService } from './services/comments';
export { SystemService } from './services/system';

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
