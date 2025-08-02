/**
 * Search Service
 * Service for search-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

type SearchRequestParams = OpArgType<paths['/search']['get']>;
type SearchResponse = OpReturnType<paths['/search']['get']>;
type RecentSearchRequestParams = OpArgType<paths['/search/recent']['get']>;
type RecentSearchResponse = OpReturnType<paths['/search/recent']['get']>;
type SearchSuggestionsResponse = OpReturnType<paths['/search/suggestions']['get']>;
type TrendingSearchRequestParams = OpArgType<paths['/search/trending']['get']>;
type TrendingSearchResponse = OpReturnType<paths['/search/trending']['get']>;

/**
 * Service for search operations
 */
export class SearchService extends BaseService {
  /**
   * Creates a new SearchService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Search content with filters and pagination
   * @param query Search query
   * @param options Additional search options
   * @returns Promise with search results
   */
  async search(query: string, options?: Omit<SearchRequestParams, 'q'>): Promise<SearchResponse> {
    return this.get<'/search'>('/search', { q: query, ...options });
  }

  /**
   * Get recently created/updated content
   * @param options Limit options
   * @returns Promise with recent content results
   */
  async getRecent(options?: RecentSearchRequestParams): Promise<RecentSearchResponse> {
    return this.get<'/search/recent'>('/search/recent', options);
  }

  /**
   * Get search suggestions based on query
   * @param query Search query for suggestions
   * @returns Promise with search suggestions
   */
  async getSuggestions(query: string): Promise<SearchSuggestionsResponse> {
    return this.get<'/search/suggestions'>('/search/suggestions', { q: query });
  }

  /**
   * Get trending/popular content
   * @param options Limit options
   * @returns Promise with trending content results
   */
  async getTrending(options?: TrendingSearchRequestParams): Promise<TrendingSearchResponse> {
    return this.get<'/search/trending'>('/search/trending', options);
  }
}
