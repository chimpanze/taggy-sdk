/**
 * Extension Service
 * Service for extension-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

// Type aliases for request and response data
export type GetAISuggestionsResponse = OpReturnType<paths['/extension/ai-suggestions/{contentId}']['get']>;
export type ArchivePageRequestData = OpArgType<paths['/extension/archive']['post']>;
export type ArchivePageResponse = OpReturnType<paths['/extension/archive']['post']>;
export type GetMediaJobResponse = OpReturnType<paths['/extension/media-job/{jobId}']['get']>;
export type QuickTagRequestData = OpArgType<paths['/extension/quick-tag']['post']>;
export type QuickTagResponse = OpReturnType<paths['/extension/quick-tag']['post']>;
export type SaveBookmarkRequestData = OpArgType<paths['/extension/save-bookmark']['post']>;
export type SaveBookmarkResponse = OpReturnType<paths['/extension/save-bookmark']['post']>;
export type SaveImageRequestData = OpArgType<paths['/extension/save-image']['post']>;
export type SaveImageResponse = OpReturnType<paths['/extension/save-image']['post']>;
export type SaveTextRequestData = OpArgType<paths['/extension/save-text']['post']>;
export type SaveTextResponse = OpReturnType<paths['/extension/save-text']['post']>;
export type SaveVideoRequestData = OpArgType<paths['/extension/save-video']['post']>;
export type SaveVideoResponse = OpReturnType<paths['/extension/save-video']['post']>;
export type GetTagsResponse = OpReturnType<paths['/extension/tags']['get']>;

/**
 * Service for extension operations
 */
export class ExtensionService extends BaseService {
  /**
   * Creates a new ExtensionService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Get AI tag suggestions for content
   * @param contentId Content ID
   * @returns Promise with AI suggestions data
   */
  async getAISuggestions(contentId: string): Promise<GetAISuggestionsResponse> {
    return this.get<'/extension/ai-suggestions/{contentId}'>(
      `/extension/ai-suggestions/${contentId}` as '/extension/ai-suggestions/{contentId}',
    );
  }

  /**
   * Archive the current page from browser extension
   * @param data Archive request data
   * @returns Promise with archive response
   */
  async archivePage(data: ArchivePageRequestData): Promise<ArchivePageResponse> {
    return this.post<'/extension/archive'>('/extension/archive', data);
  }

  /**
   * Check the progress of a media fetch job
   * @param jobId Job ID
   * @returns Promise with media job status
   */
  async getMediaJobStatus(jobId: string): Promise<GetMediaJobResponse> {
    return this.get<'/extension/media-job/{jobId}'>(
      `/extension/media-job/${jobId}` as '/extension/media-job/{jobId}',
    );
  }

  /**
   * Quickly apply tags to content from browser extension
   * @param data Quick tag request data
   * @returns Promise with quick tag response
   */
  async quickTag(data: QuickTagRequestData): Promise<QuickTagResponse> {
    return this.post<'/extension/quick-tag'>('/extension/quick-tag', data);
  }

  /**
   * Save a bookmark from browser extension with metadata and tags
   * @param data Save bookmark request data
   * @returns Promise with save response
   */
  async saveBookmark(data: SaveBookmarkRequestData): Promise<SaveBookmarkResponse> {
    return this.post<'/extension/save-bookmark'>('/extension/save-bookmark', data);
  }

  /**
   * Save an image from browser extension with metadata and tags
   * @param data Save image request data
   * @returns Promise with save response
   */
  async saveImage(data: SaveImageRequestData): Promise<SaveImageResponse> {
    return this.post<'/extension/save-image'>('/extension/save-image', data);
  }

  /**
   * Save selected text from browser extension with context and tags
   * @param data Save text request data
   * @returns Promise with save response
   */
  async saveText(data: SaveTextRequestData): Promise<SaveTextResponse> {
    return this.post<'/extension/save-text'>('/extension/save-text', data);
  }

  /**
   * Save a video from browser extension for downloading
   * @param data Save video request data
   * @returns Promise with save response
   */
  async saveVideo(data: SaveVideoRequestData): Promise<SaveVideoResponse> {
    return this.post<'/extension/save-video'>('/extension/save-video', data);
  }

  /**
   * Get user's tags for quick selection in browser extension
   * @param options Options for retrieving tags (recent, popular, limit)
   * @returns Promise with tags data
   */
  async getTags(options?: {
    recent?: boolean;
    popular?: boolean;
    limit?: number;
  }): Promise<GetTagsResponse> {
    return this.get<'/extension/tags'>('/extension/tags', options);
  }
}
