/**
 * AI Service
 * Service for AI-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

export type AnalyzeContentRequestData = OpArgType<paths['/ai/analyze']['post']>;
export type AnalyzeContentResponse = OpReturnType<paths['/ai/analyze']['post']>;
export type ListModelsResponse = OpReturnType<paths['/ai/models']['get']>;
export type GetSettingsResponse = OpReturnType<paths['/ai/settings']['get']>;
export type UpdateSettingsRequestData = OpArgType<paths['/ai/settings']['put']>;
export type UpdateSettingsResponse = OpReturnType<paths['/ai/settings']['put']>;
export type GetSuggestionsResponse = OpReturnType<paths['/ai/suggestions/{contentId}']['get']>;
export type TrainModelResponse = OpReturnType<paths['/ai/train']['post']>;

/**
 * Service for AI operations
 */
export class AIService extends BaseService {
  /**
   * Creates a new AIService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Analyze content for tag suggestions
   * @param data Content ID to analyze
   * @returns Promise with AI tag suggestions
   */
  async analyzeContent(data: AnalyzeContentRequestData): Promise<AnalyzeContentResponse> {
    return this.post<'/ai/analyze'>('/ai/analyze', data);
  }

  /**
   * Get a list of available AI models for tagging
   * @returns Promise with list of AI models
   */
  async listModels(): Promise<ListModelsResponse> {
    return this.get<'/ai/models'>('/ai/models');
  }

  /**
   * Get user's AI tagging preferences and configuration
   * @returns Promise with AI settings
   */
  async getSettings(): Promise<GetSettingsResponse> {
    return this.get<'/ai/settings'>('/ai/settings');
  }

  /**
   * Update user's AI tagging preferences and configuration
   * @param data AI settings to update
   * @returns Promise with updated AI settings
   */
  async updateSettings(data: UpdateSettingsRequestData): Promise<UpdateSettingsResponse> {
    return this.put<'/ai/settings'>('/ai/settings', data);
  }

  /**
   * Get AI-generated tag suggestions for a specific content item
   * @param contentId Content ID
   * @returns Promise with AI tag suggestions
   */
  async getSuggestions(contentId: number): Promise<GetSuggestionsResponse> {
    return this.get<'/ai/suggestions/{contentId}'>(
      `/ai/suggestions/${contentId}` as '/ai/suggestions/{contentId}',
    );
  }

  /**
   * Initiate training of a personalized AI model based on user's tagging history
   * @returns Promise that resolves when training is initiated
   */
  async trainModel(): Promise<TrainModelResponse> {
    return this.post<'/ai/train'>('/ai/train');
  }
}
