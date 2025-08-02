/**
 * Media Service
 * Service for media-related API endpoints
 */

import { BaseService } from './base';
import { paths } from "../types/generated.ts";
import { TaggyFetcher } from "../types/fetch.ts";
import { OpArgType, OpReturnType } from "openapi-typescript-fetch/types";

type DeleteMediaResponse = OpReturnType<paths['/media/{id}']['delete']>
type FetchMediaRequestData = OpArgType<paths['/media/fetch']['post']>
type FetchMediaResponse = OpReturnType<paths['/media/fetch']['post']>
type FetchAudioRequestData = OpArgType<paths['/media/fetch-audio']['post']>
type FetchAudioResponse = OpReturnType<paths['/media/fetch-audio']['post']>
type FetchStatusResponse = OpReturnType<paths['/media/fetch-status/{jobId}']['get']>
type MediaFormatsResponse = OpReturnType<paths['/media/formats/{url}']['get']>
type MediaSettingsResponse = OpReturnType<paths['/media/settings']['get']>
type UpdateMediaSettingsRequestData = OpArgType<paths['/media/settings']['put']>

/**
 * Service for media operations
 */
export class MediaService extends BaseService {
  /**
   * Creates a new MediaService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Delete media
   * @param id Media ID
   * @returns Promise that resolves when deletion is complete
   */
  async deleteMedia(id: string): Promise<DeleteMediaResponse> {
    return this.delete<`/media/{id}`>(`/media/${id}` as '/media/{id}');
  }

  /**
   * Fetch media from URL
   * @param data Media fetch request data
   * @returns Promise with media job response
   */
  async fetchMedia(data: FetchMediaRequestData): Promise<FetchMediaResponse> {
    return this.post<'/media/fetch'>('/media/fetch', data);
  }

  /**
   * Fetch audio from video URL
   * @param data Audio fetch request data
   * @returns Promise with media job response
   */
  async fetchAudio(data: FetchAudioRequestData): Promise<FetchAudioResponse> {
    return this.post<'/media/fetch-audio'>('/media/fetch-audio', data);
  }

  /**
   * Get media fetch status
   * @param jobId Job ID
   * @returns Promise with media job status
   */
  async getFetchStatus(jobId: string): Promise<FetchStatusResponse> {
    return this.get<`/media/fetch-status/{jobId}`>(`/media/fetch-status/${jobId}` as '/media/fetch-status/{jobId}');
  }

  /**
   * Get available media formats
   * @param url Media URL (URL-encoded)
   * @returns Promise with available media formats
   */
  async getFormats(url: string): Promise<MediaFormatsResponse> {
    return this.get<`/media/formats/{url}`>(`/media/formats/${url}` as '/media/formats/{url}');
  }

  /**
   * Get media settings
   * @returns Promise with media settings
   */
  async getSettings(): Promise<MediaSettingsResponse> {
    return this.get<'/media/settings'>('/media/settings');
  }

  /**
   * Update media settings
   * @param data Media settings update data
   * @returns Promise with updated media settings
   */
  async updateSettings(data: UpdateMediaSettingsRequestData): Promise<MediaSettingsResponse> {
    return this.put<'/media/settings'>('/media/settings', data);
  }
}