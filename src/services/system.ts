/**
 * System Service
 * Service for system-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';

// Define response types for system endpoints
// Since these endpoints might not be explicitly defined in the OpenAPI spec,
// we're using generic types that should be compatible with most health/ready endpoints
type ReadyResponse = { status: string; message?: string } | string;
type HealthResponse = { status: string; version?: string; details?: Record<string, any> } | string;

/**
 * Service for system operations
 */
export class SystemService extends BaseService {
  /**
   * Creates a new SystemService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * Check if the API is ready to accept requests
   * @returns Promise with readiness status
   */
  async ready(): Promise<ReadyResponse> {
    try {
      // Using any as a workaround since the endpoint might not be in the OpenAPI spec
      return (await this.get<any>('/ready' as any)) as Promise<ReadyResponse>;
    } catch (error) {
      // Handle potential errors gracefully
      console.error('Error checking readiness:', error);
      return { status: 'error', message: 'Failed to check readiness' };
    }
  }

  /**
   * Check the health status of the API
   * @returns Promise with health status
   */
  async health(): Promise<HealthResponse> {
    try {
      // Using any as a workaround since the endpoint might not be in the OpenAPI spec
      return (await this.get<any>('/health' as any)) as Promise<HealthResponse>;
    } catch (error) {
      // Handle potential errors gracefully
      console.error('Error checking health:', error);
      return new Promise(() => {
        return { status: 'error', message: 'Failed to check health' };
      }) as Promise<HealthResponse>;
    }
  }
}
