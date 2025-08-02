/**
 * Base Service
 * Base class for all API services
 */

import { paths } from '../types/generated';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

/**
 * Base service class that all service implementations extend from
 */
export abstract class BaseService {
  /**
   * Fetcher instance for making HTTP requests
   */
  protected readonly fetcher: TaggyFetcher<paths>;

  /**
   * Creates a new service instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    this.fetcher = fetcher;
  }

  /**
   * Creates a fetch operation for a specific path and method
   * @param method HTTP method
   * @param path API path
   * @returns Fetch operation
   */
  protected createOperation<P extends keyof paths, M extends keyof paths[P]>(method: M, path: P) {
    return this.fetcher.path(path).method(method).create();
  }

  /**
   * Makes a GET request
   * @param path API path
   * @param params Query parameters
   * @returns Promise with the response data
   */
  protected async get<P extends keyof paths>(
    path: P,
    params?: Record<string, any>,
  ): Promise<OpReturnType<paths[P]['get']>> {
    const operation = this.createOperation('get', path);
    if (params === undefined) {
      params = {};
    }
    const response = await operation({ query: params } as OpArgType<paths[P]['get']>);
    return response.data as OpReturnType<paths[P]['get']>;
  }

  /**
   * Makes a POST request
   * @param path API path
   * @param data Request body
   * @param params Query parameters
   * @returns Promise with the response data
   */
  protected async post<P extends keyof paths>(
    path: P,
    data?: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<OpReturnType<paths[P]['post']>> {
    const operation = this.createOperation('post', path);
    const response = await operation({ body: data, query: params } as OpArgType<paths[P]['post']>);
    return response.data as OpReturnType<paths[P]['post']>;
  }

  /**
   * Makes a PUT request
   * @param path API path
   * @param data Request body
   * @param params Query parameters
   * @returns Promise with the response data
   */
  protected async put<P extends keyof paths>(
    path: P,
    data?: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<OpReturnType<paths[P]['put']>> {
    const operation = this.createOperation('put', path);
    const response = await operation({ body: data, query: params } as OpArgType<paths[P]['put']>);
    return response.data as OpReturnType<paths[P]['put']>;
  }

  /**
   * Makes a PATCH request
   * @param path API path
   * @param data Request body
   * @param params Query parameters
   * @returns Promise with the response data
   */
  protected async patch<P extends keyof paths>(
    path: P,
    data?: Record<string, any>,
    params?: Record<string, any>,
  ): Promise<OpReturnType<paths[P]['patch']>> {
    const operation = this.createOperation('patch', path);
    const response = await operation({ body: data, query: params } as OpArgType<paths[P]['patch']>);
    return response.data as OpReturnType<paths[P]['patch']>;
  }

  /**
   * Makes a DELETE request
   * @param path API path
   * @param params Query parameters
   * @returns Promise with the response data
   */
  protected async delete<P extends keyof paths>(
    path: P,
    params?: Record<string, any>,
  ): Promise<OpReturnType<paths[P]['delete']>> {
    const operation = this.createOperation('delete', path);
    const response = await operation({ query: params } as OpArgType<paths[P]['delete']>);
    return response.data as OpReturnType<paths[P]['delete']>;
  }
}
