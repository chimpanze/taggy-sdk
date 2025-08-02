# TODO List: TypeScript SDK for Taggy API

## Project Setup and Configuration

### 1. Initialize Project Structure
```bash
# Create the following structure:
taggy-sdk/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── client.ts                # Main SDK client class
│   ├── config.ts                # Configuration types and defaults
│   ├── types/
│   │   ├── index.ts             # Re-export all types
│   │   ├── generated.ts         # Auto-generated from Swagger
│   │   ├── common.ts            # Common types
│   │   ├── requests.ts          # Request types
│   │   └── responses.ts         # Response types
│   ├── services/
│   │   ├── index.ts             # Service exports
│   │   ├── base.service.ts      # Base service class
│   │   ├── ai.service.ts        # AI endpoints
│   │   ├── archive.service.ts   # Archive endpoints
│   │   ├── auth.service.ts      # Auth endpoints
│   │   ├── collections.service.ts
│   │   ├── content.service.ts
│   │   ├── extension.service.ts
│   │   ├── files.service.ts
│   │   ├── likes.service.ts
│   │   ├── media.service.ts
│   │   ├── search.service.ts
│   │   ├── sharing.service.ts
│   │   └── tags.service.ts
│   ├── utils/
│   │   ├── http.ts              # HTTP client wrapper
│   │   ├── errors.ts            # Custom error classes
│   │   ├── validators.ts        # Input validators
│   │   └── helpers.ts           # Utility functions
│   └── interceptors/
│       ├── auth.interceptor.ts  # JWT token handling
│       └── error.interceptor.ts # Error handling
├── tests/
│   ├── setup.ts
│   └── services/
├── examples/
│   ├── basic-usage.ts
│   ├── browser-extension.ts
│   └── advanced-features.ts
├── docs/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.js
├── .prettierrc
└── README.md
```

### 2. Package.json Template
```json
{
  "name": "@taggy/sdk",
  "version": "1.0.0",
  "description": "TypeScript SDK for Taggy API",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "generate:types": "openapi-typescript ./swagger.json -o ./src/types/generated.ts",
    "docs": "typedoc src/index.ts"
  },
  "dependencies": {
    "openapi-typescript-fetch": "^1.1.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "@vitest/coverage-v8": "^1.0.0",
    "eslint": "^8.55.0",
    "openapi-typescript": "^6.7.0",
    "prettier": "^3.1.0",
    "typedoc": "^0.25.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.6.0",
    "vitest": "^1.0.0"
  }
}
```

### 3. TypeScript Configuration
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "types": ["vitest/globals", "node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

## Core Implementation Tasks

### 4. Main Client Class Template
```typescript
// src/client.ts
import { TaggyConfig, TaggyClientOptions } from './config';
import { 
  AIService,
  ArchiveService,
  AuthService,
  CollectionsService,
  ContentService,
  ExtensionService,
  FilesService,
  LikesService,
  MediaService,
  SearchService,
  SharingService,
  TagsService
} from './services';
import { HttpClient } from './utils/http';

export class TaggyClient {
  private config: TaggyConfig;
  private http: HttpClient;
  
  // Services
  public readonly ai: AIService;
  public readonly archive: ArchiveService;
  public readonly auth: AuthService;
  public readonly collections: CollectionsService;
  public readonly content: ContentService;
  public readonly extension: ExtensionService;
  public readonly files: FilesService;
  public readonly likes: LikesService;
  public readonly media: MediaService;
  public readonly search: SearchService;
  public readonly sharing: SharingService;
  public readonly tags: TagsService;

  constructor(options: TaggyClientOptions) {
    this.config = this.validateConfig(options);
    this.http = new HttpClient(this.config);
    
    // Initialize services
    this.ai = new AIService(this.http);
    this.archive = new ArchiveService(this.http);
    this.auth = new AuthService(this.http);
    this.collections = new CollectionsService(this.http);
    this.content = new ContentService(this.http);
    this.extension = new ExtensionService(this.http);
    this.files = new FilesService(this.http);
    this.likes = new LikesService(this.http);
    this.media = new MediaService(this.http);
    this.search = new SearchService(this.http);
    this.sharing = new SharingService(this.http);
    this.tags = new TagsService(this.http);
  }

  private validateConfig(options: TaggyClientOptions): TaggyConfig {
    // Validate and merge with defaults
    return {
      baseUrl: options.baseUrl || 'https://api.taggy.io',
      apiVersion: options.apiVersion || 'v1',
      timeout: options.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
  }

  // Authentication methods
  public setAuthToken(token: string): void {
    this.http.setAuthToken(token);
  }

  public clearAuthToken(): void {
    this.http.clearAuthToken();
  }

  // Health check methods
  public async checkHealth(): Promise<HealthCheckResponse> {
    return this.http.get<HealthCheckResponse>('/health');
  }

  public async checkReadiness(): Promise<ReadyCheckResponse> {
    return this.http.get<ReadyCheckResponse>('/ready');
  }
}

// Export a factory function for easier instantiation
export function createTaggyClient(options: TaggyClientOptions): TaggyClient {
  return new TaggyClient(options);
}
```

### 5. Configuration Types
```typescript
// src/config.ts
export interface TaggyConfig {
  baseUrl: string;
  apiVersion: string;
  timeout: number;
  headers: Record<string, string>;
  authToken?: string;
  onTokenRefresh?: (token: string) => void;
  onError?: (error: TaggyError) => void;
}

export interface TaggyClientOptions {
  baseUrl?: string;
  apiVersion?: string;
  timeout?: number;
  headers?: Record<string, string>;
  authToken?: string;
  onTokenRefresh?: (token: string) => void;
  onError?: (error: TaggyError) => void;
}

export const DEFAULT_CONFIG: Partial<TaggyConfig> = {
  baseUrl: 'https://api.taggy.io',
  apiVersion: 'v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};
```

### 6. HTTP Client Wrapper
```typescript
// src/utils/http.ts
import { Fetcher, FetcherOptions } from 'openapi-typescript-fetch';
import { paths } from '../types/generated';
import { TaggyConfig } from '../config';
import { TaggyError, NetworkError, ValidationError } from './errors';
import { createAuthMiddleware } from '../interceptors/auth.interceptor';
import { createErrorHandler } from '../interceptors/error.interceptor';

export type TaggyFetcher = Fetcher<paths>;

export class HttpClient {
  private fetcher: TaggyFetcher;
  private config: TaggyConfig;

  constructor(config: TaggyConfig) {
    this.config = config;
    
    // Create fetcher instance
    this.fetcher = Fetcher.for<paths>();
    
    // Configure the fetcher
    this.fetcher.configure({
      baseUrl: `${config.baseUrl}/api/${config.apiVersion}`,
      timeout: config.timeout,
      init: {
        headers: config.headers,
      },
    });
    
    // Setup middleware
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    // Add error handler
    this.fetcher.use(createErrorHandler());
    
    // Add auth middleware
    this.fetcher.use(createAuthMiddleware(this.config));
  }

  public setAuthToken(token: string): void {
    this.config.authToken = token;
  }

  public clearAuthToken(): void {
    delete this.config.authToken;
  }

  // Create operation for a specific path and method
  public createOperation<P extends keyof paths, M extends keyof paths[P]>(
    method: M,
    path: P
  ) {
    return this.fetcher.path(path).method(method).create();
  }

  // HTTP methods with proper typing
  public async get<P extends keyof paths, R>(
    path: P,
    params?: Record<string, any>
  ): Promise<R> {
    const operation = this.createOperation('get', path);
    const response = await operation({ query: params });
    return response.data as unknown as R;
  }

  public async post<P extends keyof paths, R>(
    path: P,
    data?: Record<string, any>,
    params?: Record<string, any>
  ): Promise<R> {
    const operation = this.createOperation('post', path);
    const response = await operation({ body: data, query: params });
    return response.data as unknown as R;
  }

  public async put<P extends keyof paths, R>(
    path: P,
    data?: Record<string, any>,
    params?: Record<string, any>
  ): Promise<R> {
    const operation = this.createOperation('put', path);
    const response = await operation({ body: data, query: params });
    return response.data as unknown as R;
  }

  public async delete<P extends keyof paths, R>(
    path: P,
    params?: Record<string, any>
  ): Promise<R> {
    const operation = this.createOperation('delete', path);
    const response = await operation({ query: params });
    return response.data as unknown as R;
  }

  public async upload<P extends keyof paths, R>(
    path: P,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<R> {
    // Note: Progress tracking is not natively supported with fetch API
    // If progress tracking is critical, a custom implementation would be needed
    if (onProgress) {
      console.warn('Progress tracking is not supported with fetch API in this implementation');
      // Call once to indicate start
      onProgress(0);
    }
    
    const operation = this.createOperation('post', path);
    const response = await operation({
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Call once more to indicate completion if progress callback was provided
    if (onProgress) {
      onProgress(100);
    }
    
    return response.data as unknown as R;
  }
}
```

### 7. Base Service Class
```typescript
// src/services/base.service.ts
import { HttpClient } from '../utils/http';

export abstract class BaseService {
  protected http: HttpClient;
  protected basePath: string;

  constructor(http: HttpClient, basePath: string) {
    this.http = http;
    this.basePath = basePath;
  }

  protected buildUrl(path: string = ''): string {
    return `${this.basePath}${path}`;
  }

  protected buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
    
    return filtered.length > 0 ? `?${filtered.join('&')}` : '';
  }
}
```

## Service Implementation Tasks

### 8. AI Service Implementation
```typescript
// src/services/ai.service.ts
import { BaseService } from './base.service';
import {
  AIModelResponse,
  AITagSuggestionsResponse,
  AITaggingSettingsResponse,
  UpdateAISettingsRequest,
  TrainModelResponse
} from '../types';

export class AIService extends BaseService {
  constructor(http: HttpClient) {
    super(http, '/ai');
  }

  /**
   * Get AI tagging settings for the current user
   */
  async getSettings(): Promise<AITaggingSettingsResponse> {
    return this.http.get<AITaggingSettingsResponse>(this.buildUrl('/settings'));
  }

  /**
   * Update AI tagging settings
   */
  async updateSettings(settings: UpdateAISettingsRequest): Promise<AITaggingSettingsResponse> {
    return this.http.put<AITaggingSettingsResponse>(
      this.buildUrl('/settings'),
      settings
    );
  }

  /**
   * Analyze content for tag suggestions
   */
  async analyzeContent(contentId: number): Promise<AITagSuggestionsResponse> {
    return this.http.post<AITagSuggestionsResponse>(
      this.buildUrl('/analyze'),
      { content_id: contentId }
    );
  }

  /**
   * Get AI tag suggestions for specific content
   */
  async getSuggestions(contentId: number): Promise<AITagSuggestionsResponse> {
    return this.http.get<AITagSuggestionsResponse>(
      this.buildUrl(`/suggestions/${contentId}`)
    );
  }

  /**
   * Train personalized AI model based on user's tagging history
   */
  async trainModel(): Promise<TrainModelResponse> {
    return this.http.post<TrainModelResponse>(this.buildUrl('/train'));
  }

  /**
   * List available AI models
   */
  async getModels(): Promise<AIModelResponse> {
    return this.http.get<AIModelResponse>(this.buildUrl('/models'));
  }
}
```

### 9. Content Service Implementation
```typescript
// src/services/content.service.ts
import { BaseService } from './base.service';
import {
  ContentListResponse,
  ContentResponse,
  CreateContentRequest,
  UpdateContentRequest,
  BulkOperationRequest,
  AddTagsRequest,
  ContentListParams,
  SuccessResponse
} from '../types';

export class ContentService extends BaseService {
  constructor(http: HttpClient) {
    super(http, '/content');
  }

  /**
   * List user content with pagination and filtering
   */
  async list(params?: ContentListParams): Promise<ContentListResponse> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.http.get<ContentListResponse>(this.buildUrl(queryString));
  }

  /**
   * Get specific content by ID
   */
  async get(id: number): Promise<ContentResponse> {
    return this.http.get<ContentResponse>(this.buildUrl(`/${id}`));
  }

  /**
   * Create new content
   */
  async create(content: CreateContentRequest): Promise<ContentResponse> {
    return this.http.post<ContentResponse>(this.buildUrl(), content);
  }

  /**
   * Update existing content
   */
  async update(id: number, content: UpdateContentRequest): Promise<ContentResponse> {
    return this.http.put<ContentResponse>(this.buildUrl(`/${id}`), content);
  }

  /**
   * Delete content
   */
  async delete(id: number): Promise<void> {
    await this.http.delete<void>(this.buildUrl(`/${id}`));
  }

  /**
   * Perform bulk operations on content
   */
  async bulkOperation(operation: BulkOperationRequest): Promise<SuccessResponse> {
    return this.http.post<SuccessResponse>(this.buildUrl('/bulk'), operation);
  }

  /**
   * Add tags to content
   */
  async addTags(contentId: number, tagIds: number[]): Promise<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      this.buildUrl(`/${contentId}/tags`),
      { tag_ids: tagIds }
    );
  }

  /**
   * Remove tag from content
   */
  async removeTag(contentId: number, tagId: number): Promise<SuccessResponse> {
    return this.http.delete<SuccessResponse>(
      this.buildUrl(`/${contentId}/tags/${tagId}`)
    );
  }

  /**
   * Batch create content items
   */
  async batchCreate(items: CreateContentRequest[]): Promise<ContentResponse[]> {
    return this.http.post<ContentResponse[]>(this.buildUrl('/batch'), items);
  }
}
```

### 10. Extension Service Implementation
```typescript
// src/services/extension.service.ts
import { BaseService } from './base.service';
import {
  ExtensionResponse,
  SaveBookmarkRequest,
  SaveImageRequest,
  SaveTextRequest,
  SaveVideoRequest,
  QuickTagRequest,
  QuickTagResponse,
  ExtensionAISuggestionResponse,
  ArchiveCurrentPageRequest,
  TagResponse
} from '../types';

export class ExtensionService extends BaseService {
  constructor(http: HttpClient) {
    super(http, '/extension');
  }

  /**
   * Save bookmark from browser extension
   */
  async saveBookmark(bookmark: SaveBookmarkRequest): Promise<ExtensionResponse> {
    return this.http.post<ExtensionResponse>(
      this.buildUrl('/save-bookmark'),
      bookmark
    );
  }

  /**
   * Save image from browser extension
   */
  async saveImage(image: SaveImageRequest): Promise<ExtensionResponse> {
    return this.http.post<ExtensionResponse>(
      this.buildUrl('/save-image'),
      image
    );
  }

  /**
   * Save text selection from browser extension
   */
  async saveText(text: SaveTextRequest): Promise<ExtensionResponse> {
    return this.http.post<ExtensionResponse>(
      this.buildUrl('/save-text'),
      text
    );
  }

  /**
   * Save video for downloading from browser extension
   */
  async saveVideo(video: SaveVideoRequest): Promise<ExtensionResponse> {
    return this.http.post<ExtensionResponse>(
      this.buildUrl('/save-video'),
      video
    );
  }

  /**
   * Get user tags for quick selection
   */
  async getTags(params?: {
    recent?: boolean;
    popular?: boolean;
    limit?: number;
  }): Promise<TagResponse[]> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.http.get<TagResponse[]>(this.buildUrl('/tags' + queryString));
  }

  /**
   * Quick tag content from extension
   */
  async quickTag(request: QuickTagRequest): Promise<QuickTagResponse> {
    return this.http.post<QuickTagResponse>(
      this.buildUrl('/quick-tag'),
      request
    );
  }

  /**
   * Archive current page
   */
  async archivePage(request: ArchiveCurrentPageRequest): Promise<ArchiveResponse> {
    return this.http.post<ArchiveResponse>(
      this.buildUrl('/archive'),
      request
    );
  }

  /**
   * Get AI tag suggestions for content
   */
  async getAISuggestions(contentId: string): Promise<ExtensionAISuggestionResponse> {
    return this.http.get<ExtensionAISuggestionResponse>(
      this.buildUrl(`/ai-suggestions/${contentId}`)
    );
  }

  /**
   * Check media job progress
   */
  async checkMediaJobProgress(jobId: string): Promise<any> {
    return this.http.get<any>(this.buildUrl(`/media-job/${jobId}`));
  }
}
```

### 11. Media Service Implementation
```typescript
// src/services/media.service.ts
import { BaseService } from './base.service';
import {
  FetchMediaRequest,
  FetchAudioRequest,
  MediaJobResponse,
  MediaFormatResponse,
  MediaSettingsResponse,
  UpdateMediaSettingsRequest
} from '../types';

export class MediaService extends BaseService {
  constructor(http: HttpClient) {
    super(http, '/media');
  }

  /**
   * Fetch media from URL
   */
  async fetchMedia(request: FetchMediaRequest): Promise<MediaJobResponse> {
    return this.http.post<MediaJobResponse>(
      this.buildUrl('/fetch'),
      request
    );
  }

  /**
   * Fetch audio only from video URL
   */
  async fetchAudio(request: FetchAudioRequest): Promise<MediaJobResponse> {
    return this.http.post<MediaJobResponse>(
      this.buildUrl('/fetch-audio'),
      request
    );
  }

  /**
   * Get media fetch job status
   */
  async getFetchStatus(jobId: string): Promise<MediaJobResponse> {
    return this.http.get<MediaJobResponse>(
      this.buildUrl(`/fetch-status/${jobId}`)
    );
  }

  /**
   * Get available formats for a media URL
   */
  async getFormats(url: string): Promise<MediaFormatResponse[]> {
    const encodedUrl = encodeURIComponent(url);
    return this.http.get<MediaFormatResponse[]>(
      this.buildUrl(`/formats/${encodedUrl}`)
    );
  }

  /**
   * Get media settings
   */
  async getSettings(): Promise<MediaSettingsResponse> {
    return this.http.get<MediaSettingsResponse>(this.buildUrl('/settings'));
  }

  /**
   * Update media settings
   */
  async updateSettings(settings: UpdateMediaSettingsRequest): Promise<MediaSettingsResponse> {
    return this.http.put<MediaSettingsResponse>(
      this.buildUrl('/settings'),
      settings
    );
  }

  /**
   * Delete media
   */
  async deleteMedia(id: string): Promise<void> {
    await this.http.delete<void>(this.buildUrl(`/${id}`));
  }

  /**
   * Poll for job completion with callback
   */
  async pollJobStatus(
    jobId: string,
    onProgress?: (job: MediaJobResponse) => void,
    pollInterval: number = 2000
  ): Promise<MediaJobResponse> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const job = await this.getFetchStatus(jobId);
          
          if (onProgress) {
            onProgress(job);
          }

          if (job.status === 'completed') {
            resolve(job);
          } else if (job.status === 'failed') {
            reject(new Error(job.error || 'Media fetch failed'));
          } else {
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}
```

### 12. Collections Service Implementation
```typescript
// src/services/collections.service.ts
import { BaseService } from './base.service';
import {
  CollectionResponse,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  AddItemsRequest,
  CollectionListParams
} from '../types';

export class CollectionsService extends BaseService {
  constructor(http: HttpClient) {
    super(http, '/collections');
  }

  /**
   * List user collections with filtering
   */
  async list(params?: CollectionListParams): Promise<CollectionResponse[]> {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.http.get<CollectionResponse[]>(this.buildUrl(queryString));
  }

  /**
   * Get collection by ID
   */
  async get(id: number): Promise<CollectionResponse> {
    return this.http.get<CollectionResponse>(this.buildUrl(`/${id}`));
  }

  /**
   * Create new collection
   */
  async create(collection: CreateCollectionRequest): Promise<CollectionResponse> {
    return this.http.post<CollectionResponse>(this.buildUrl(), collection);
  }

  /**
   * Update collection
   */
  async update(id: number, collection: UpdateCollectionRequest): Promise<CollectionResponse> {
    return this.http.put<CollectionResponse>(
      this.buildUrl(`/${id}`),
      collection
    );
  }

  /**
   * Delete collection
   */
  async delete(id: number): Promise<void> {
    await this.http.delete<void>(this.buildUrl(`/${id}`));
  }

  /**
   * Add items to collection
   */
  async addItems(id: number, contentIds: number[]): Promise<any> {
    return this.http.post<any>(
      this.buildUrl(`/${id}/items`),
      { content_ids: contentIds }
    );
  }

  /**
   * Remove item from collection
   */
  async removeItem(id: number, contentId: number): Promise<any> {
    return this.http.delete<any>(
      this.buildUrl(`/${id}/items/${contentId}`)
    );
  }

  /**
   * Duplicate/fork a collection
   */
  async fork(id: number, name?: string): Promise<CollectionResponse> {
    return this.http.post<CollectionResponse>(
      this.buildUrl(`/${id}/fork`),
      { name }
    );
  }
}
```

## Utility Implementation Tasks

### 13. Error Classes
```typescript
// src/utils/errors.ts
export class TaggyError extends Error {
  public statusCode?: number;
  public code?: string;
  public details?: any;

  constructor(message: string, statusCode?: number, code?: string, details?: any) {
    super(message);
    this.name = 'TaggyError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends TaggyError {
  constructor(message: string, details?: any) {
    super(message, 0, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends TaggyError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends TaggyError {
  constructor(message: string = 'Authentication required', details?: any) {
    super(message, 401, 'AUTH_ERROR', details);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends TaggyError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends TaggyError {
  public retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number, details?: any) {
    super(message, 429, 'RATE_LIMIT', details);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
```

### 14. Validation Utilities
```typescript
// src/utils/validators.ts
import { z } from 'zod';

// Common validation schemas
export const PaginationSchema = z.object({
  page: z.number().min(1).optional(),
  page_size: z.number().min(1).max(100).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

export const ContentTypeSchema = z.enum([
  'image',
  'text',
  'bookmark',
  'note',
  'file',
  'video',
  'audio'
]);

export const ShareTypeSchema = z.enum(['public', 'private', 'link-only']);

export const PermissionSchema = z.enum(['viewer', 'contributor', 'editor', 'admin']);

// Validation helpers
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateColor(color: string): boolean {
  const colorRegex = /^#[0-9A-F]{6}$/i;
  return colorRegex.test(color);
}

// Request validators
export const CreateContentSchema = z.object({
  title: z.string().min(1).max(255),
  type: ContentTypeSchema,
  description: z.string().optional(),
  content: z.string().optional(),
  url: z.string().url().optional(),
  file_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  tag_ids: z.array(z.number()).optional()
});

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().optional(),
  parent_id: z.number().optional()
});

// Type inference from schemas
export type CreateContentInput = z.infer<typeof CreateContentSchema>;
export type CreateTagInput = z.infer<typeof CreateTagSchema>;
```

### 15. Helper Functions
```typescript
// src/utils/helpers.ts
import { ContentResponse } from '../types';

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 2,
    onRetry
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      if (onRetry) {
        onRetry(lastError, attempt);
      }

      const waitTime = delay * Math.pow(backoff, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
}

/**
 * Group content by type
 */
export function groupContentByType(
  content: ContentResponse[]
): Record<string, ContentResponse[]> {
  return content.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, ContentResponse[]>);
}

/**
 * Filter content by tags
 */
export function filterContentByTags(
  content: ContentResponse[],
  tagIds: number[]
): ContentResponse[] {
  return content.filter(item =>
    item.tags.some(tag => tagIds.includes(tag.id))
  );
}
```

## Testing Implementation Tasks

### 16. Test Setup
```typescript
// tests/setup.ts
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Global test utilities
export const mockAuthToken = 'mock-jwt-token';
export const mockUserId = 'test-user-123';
export const mockApiUrl = 'http://localhost:8080/api/v1';
```

### 17. Service Tests Example
```typescript
// tests/services/content.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createTaggyClient } from '../../src';
import { mockAuthToken, mockApiUrl } from '../setup';

describe('ContentService', () => {
  let client: TaggyClient;

  beforeEach(() => {
    client = createTaggyClient({
      baseUrl: mockApiUrl,
      authToken: mockAuthToken
    });
  });

  describe('list', () => {
    it('should list content with default parameters', async () => {
      const response = await client.content.list();
      
      expect(response).toBeDefined();
      expect(response.data).toBeInstanceOf(Array);
      expect(response.page).toBe(1);
      expect(response.page_size).toBe(20);
    });

    it('should list content with filters', async () => {
      const response = await client.content.list({
        page: 2,
        page_size: 10,
        type: 'image',
        tag_id: 5
      });

      expect(response.page).toBe(2);
      expect(response.page_size).toBe(10);
      expect(response.data.every(item => item.type === 'image')).toBe(true);
    });
  });

  describe('create', () => {
    it('should create new content', async () => {
      const newContent = {
        title: 'Test Content',
        type: 'bookmark' as const,
        url: 'https://example.com',
        description: 'Test description',
        tag_ids: [1, 2, 3]
      };

      const response = await client.content.create(newContent);

      expect(response).toBeDefined();
      expect(response.title).toBe(newContent.title);
      expect(response.type).toBe(newContent.type);
      expect(response.tags).toHaveLength(3);
    });

    it('should validate required fields', async () => {
      await expect(
        client.content.create({} as any)
      ).rejects.toThrow('Validation error');
    });
  });
});
```

## Documentation Tasks

### 18. README Template
```markdown
# Taggy SDK for TypeScript

Official TypeScript SDK for the Taggy API - a comprehensive content organization platform.

## Installation

```bash
npm install @taggy/sdk
# or
yarn add @taggy/sdk
# or
pnpm add @taggy/sdk
```

## Quick Start

```typescript
import { createTaggyClient } from '@taggy/sdk';

// Initialize the client
const taggy = createTaggyClient({
  baseUrl: 'https://api.taggy.io', // Optional, uses default
  authToken: 'your-auth-token'     // Required for authenticated endpoints
});

// Save a bookmark
const bookmark = await taggy.content.create({
  title: 'Interesting Article',
  type: 'bookmark',
  url: 'https://example.com/article',
  tag_ids: [1, 2, 3]
});

// Search content
const results = await taggy.search.search({
  q: 'javascript tutorial',
  type: 'bookmark',
  page: 1,
  per_page: 20
});
```

## Authentication

The SDK supports JWT token authentication via Hanko:

```typescript
// Validate and set token
const validation = await taggy.auth.validate({
  jwt: 'hanko-jwt-token',
  audience: 'your-audience'
});

if (validation.is_valid) {
  taggy.setAuthToken('your-auth-token');
}

// Clear token on logout
taggy.clearAuthToken();
```

## Services

### AI Service
- Automatic tag suggestions
- Content analysis
- Custom model training

### Content Service
- Create, read, update, delete content
- Bulk operations
- Tag management

### Collections Service
- Organize content into collections
- Share collections
- Collaborate with others

### Media Service
- Download videos from 1000+ sites
- Extract audio from videos
- Track download progress

### Extension Service
- Browser extension integration
- Quick save functionality
- Context menu support

## Advanced Usage

### Error Handling

```typescript
import { TaggyError, ValidationError, RateLimitError } from '@taggy/sdk';

try {
  await taggy.content.create(data);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.details);
  } else if (error instanceof RateLimitError) {
    console.log(`Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof TaggyError) {
    console.error(`API error: ${error.message}`);
  }
}
```

### File Uploads

```typescript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('title', 'My Document');

const upload = await taggy.files.upload(
  formData,
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);
```

### Polling for Job Status

```typescript
// Start a video download
const job = await taggy.media.fetchMedia({
  url: 'https://youtube.com/watch?v=...',
  title: 'Tutorial Video'
});

// Poll for completion
const completed = await taggy.media.pollJobStatus(
  job.id,
  (job) => {
    console.log(`Progress: ${job.progress}%`);
  }
);

console.log('Download completed:', completed.file_path);
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import type {
  ContentResponse,
  CreateContentRequest,
  TagResponse,
  CollectionResponse
} from '@taggy/sdk';
```

## Browser Usage

The SDK can be used in browsers with a bundler:

```html
<script type="module">
  import { createTaggyClient } from '@taggy/sdk';
  
  const taggy = createTaggyClient({
    authToken: 'your-token'
  });
</script>
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT
```

### 19. Example Usage Files
```typescript
// examples/basic-usage.ts
import { createTaggyClient } from '@taggy/sdk';

async function main() {
  // Initialize client
  const taggy = createTaggyClient({
    authToken: process.env.TAGGY_AUTH_TOKEN
  });

  // Create a tag
  const tag = await taggy.tags.create({
    name: 'Important',
    color: '#FF0000',
    icon: '⭐'
  });

  // Save a bookmark with the tag
  const bookmark = await taggy.content.create({
    title: 'TypeScript Documentation',
    type: 'bookmark',
    url: 'https://www.typescriptlang.org/docs/',
    description: 'Official TypeScript documentation',
    tag_ids: [tag.id]
  });

  // Create a collection
  const collection = await taggy.collections.create({
    name: 'Learning Resources',
    description: 'Useful learning materials',
    is_public: false
  });

  // Add bookmark to collection
  await taggy.collections.addItems(collection.id, [bookmark.id]);

  // Search for content
  const searchResults = await taggy.search.search({
    q: 'typescript',
    type: 'bookmark'
  });

  console.log(`Found ${searchResults.total} results`);
}

main().catch(console.error);
```

```typescript
// examples/browser-extension.ts
import { createTaggyClient } from '@taggy/sdk';

// Extension popup script
const taggy = createTaggyClient({
  authToken: localStorage.getItem('taggy_token')
});

// Save current tab as bookmark
async function saveCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url || !tab.title) return;

  // Get user's recent tags
  const recentTags = await taggy.extension.getTags({
    recent: true,
    limit: 10
  });

  // Save the bookmark
  const response = await taggy.extension.saveBookmark({
    title: tab.title,
    url: tab.url,
    description: tab.title,
    archive: true, // Also archive the page
    tag_ids: [] // User can select from recentTags
  });

  // Show success notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Saved to Taggy',
    message: `${tab.title} has been saved!`
  });
}

// Context menu handler for saving images
async function saveImage(info: chrome.contextMenus.OnClickData) {
  if (info.mediaType !== 'image' || !info.srcUrl) return;

  const response = await taggy.extension.saveImage({
    url: info.srcUrl,
    source: info.pageUrl || '',
    title: 'Saved Image', // Could extract alt text
    tag_ids: []
  });

  console.log('Image saved:', response);
}

// Save selected text
async function saveSelection(info: chrome.contextMenus.OnClickData) {
  if (!info.selectionText) return;

  const response = await taggy.extension.saveText({
    content: info.selectionText,
    source: info.pageUrl || '',
    title: info.selectionText.substring(0, 50) + '...',
    context: '', // Could get surrounding text
    tag_ids: []
  });

  console.log('Text saved:', response);
}
```

### 20. Build Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TaggySDK',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
    },
    rollupOptions: {
      external: ['openapi-typescript-fetch', 'zod'],
      output: {
        globals: {
          'openapi-typescript-fetch': 'openapi-typescript-fetch',
          zod: 'zod'
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild'
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', 'examples/']
    }
  }
});
```

## Additional Implementation Tasks

### 21. Type Generation Script
```json
// package.json script
{
  "scripts": {
    "generate:types": "openapi-typescript ./swagger.json -o ./src/types/generated.ts && npm run format:types",
    "format:types": "prettier --write ./src/types/generated.ts"
  }
}
```

### 22. CI/CD Configuration
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run build
      
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

### 23. NPM Publishing Configuration
```json
// .npmrc
@taggy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

### 24. SDK Features Checklist
- [ ] Full TypeScript support with strict typing
- [ ] Auto-generated types from Swagger/OpenAPI
- [ ] Comprehensive error handling and custom error classes
- [ ] Request/response interceptors for auth and errors
- [ ] File upload with progress tracking
- [ ] Automatic retry with exponential backoff
- [ ] Request validation using Zod
- [ ] Pagination helpers
- [ ] Search and filter builders
- [ ] WebSocket support for real-time updates
- [ ] Browser and Node.js compatibility
- [ ] Comprehensive test coverage (>90%)
- [ ] API documentation with examples
- [ ] TypeDoc generated documentation
- [ ] Example applications
- [ ] Migration guide from API to SDK
- [ ] Performance optimizations (request batching, caching)
- [ ] Debug mode with request/response logging
- [ ] Custom plugin system for extensions
- [ ] Offline support with request queuing
- [ ] Rate limit handling with smart retry

## Final Notes

This TODO list provides a comprehensive guide for implementing a modern TypeScript SDK for the Taggy API. Each section includes boilerplate code that can be directly used or adapted. The SDK follows best practices including:

- **Type Safety**: Full TypeScript support with strict typing
- **Modern Tooling**: Uses Vite, Vitest, and latest TypeScript features
- **Developer Experience**: Intuitive API, good documentation, helpful error messages
- **Testing**: Comprehensive test coverage with MSW for mocking
- **Flexibility**: Works in both Node.js and browser environments
- **Performance**: Optimized bundle size, tree-shaking support
- **Maintainability**: Clean architecture, separation of concerns

The implementation should be done in phases:
1. Core setup and configuration
2. Basic services (Auth, Content, Tags)
3. Advanced services (AI, Media, Sharing)
4. Testing and documentation
5. Examples and utilities
6. Publishing and CI/CD

Each service should be implemented with full CRUD operations, proper error handling, and comprehensive typing. The SDK should be regularly tested against the actual API to ensure compatibility.