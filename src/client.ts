/**
 * Taggy SDK Client
 * Main client class for interacting with the Taggy API
 */

import { Fetcher, ApiResponse } from 'openapi-typescript-fetch';
import { paths } from './types/generated';
import { TaggyConfig, defaultConfig } from './config';
import { createErrorHandler } from './interceptors/error';
import { AuthService } from './services/auth';
import { ContentService } from './services/content';
import { TagService } from './services/tag';
import { ArchiveService } from './services/archive';
import { CollectionsService } from './services/collections';
import { FilesService } from './services/files';
import { LikesService } from './services/likes';
import { MediaService } from './services/media';
import { SearchService } from './services/search';
import { SharingService } from './services/sharing';
import { ExtensionService } from './services/extension';
import { AIService } from './services/ai';
import { CommentsService } from './services/comments';
import { SystemService } from './services/system';
import { CustomRequestInit, TaggyFetcher } from './types/fetch.ts';

/**
 * Main SDK client class
 */
export class TaggyClient {
  private readonly config: TaggyConfig;
  private readonly fetcher: TaggyFetcher<paths>;
  private _token?: string;

  /**
   * Service instances
   */
  readonly auth: AuthService;
  readonly content: ContentService;
  readonly tags: TagService;
  readonly archive: ArchiveService;
  readonly collections: CollectionsService;
  readonly files: FilesService;
  readonly likes: LikesService;
  readonly media: MediaService;
  readonly search: SearchService;
  readonly sharing: SharingService;
  readonly extension: ExtensionService;
  readonly ai: AIService;
  readonly comments: CommentsService;
  readonly system: SystemService;

  /**
   * Creates a new TaggyClient instance
   * @param config Configuration options
   */
  constructor(config: Partial<TaggyConfig> = {}) {
    this.config = { ...defaultConfig, ...config };

    // Create fetcher instance
    // @ts-ignore
    this.fetcher = Fetcher.for<paths>();

    // Configure the fetcher
    this.fetcher.configure({
      baseUrl: this.config.baseUrl,
      init: {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': `TaggySDK/${this.config.version}`,
          ...this.config.headers,
        },
      },
    });

    // Add error handler
    this.fetcher.use(createErrorHandler());

    // Add auth middleware
    this.fetcher.use(this.createAuthMiddleware());

    // Initialize services
    this.auth = new AuthService(this.fetcher);
    this.content = new ContentService(this.fetcher);
    this.tags = new TagService(this.fetcher);
    this.archive = new ArchiveService(this.fetcher);
    this.collections = new CollectionsService(this.fetcher);
    this.files = new FilesService(this.fetcher);
    this.likes = new LikesService(this.fetcher);
    this.media = new MediaService(this.fetcher);
    this.search = new SearchService(this.fetcher);
    this.sharing = new SharingService(this.fetcher);
    this.extension = new ExtensionService(this.fetcher);
    this.ai = new AIService(this.fetcher);
    this.comments = new CommentsService(this.fetcher);
    this.system = new SystemService(this.fetcher);
  }

  /**
   * Creates authentication middleware for the fetcher
   * @returns Middleware function for the fetcher
   */
  private createAuthMiddleware() {
    return async (
      url: string,
      init: CustomRequestInit,
      next: (url: string, init: CustomRequestInit) => Promise<ApiResponse>,
    ) => {
      // Create a new headers object
      const headers = new Headers(init.headers);

      // Use JWT token if available
      if (this._token) {
        headers.set('Authorization', `Bearer ${this._token}`);
      }

      // Create a completely new init object with the updated headers
      const newInit: CustomRequestInit = {
        ...init,
        headers: headers,
      };

      return next(url, newInit);
    };
  }

  /**
   * Gets the current configuration
   * @returns Current configuration
   */
  getConfig(): TaggyConfig {
    return { ...this.config };
  }

  /**
   * Gets the fetcher instance
   * @returns The fetcher instance
   */
  getFetcher(): TaggyFetcher<paths> {
    return this.fetcher;
  }

  /**
   * Gets the current authentication token
   * @returns The current JWT token
   */
  getToken(): string | undefined {
    return this._token;
  }

  /**
   * Sets the authentication token
   * @param token JWT token for authentication
   */
  setToken(token?: string): void {
    this._token = token;
  }
}
