/**
 * Type definitions for openapi-typescript-fetch
 */

import type { ApiResponse } from 'openapi-typescript-fetch';
import {CreateFetch, FetchConfig, OpenapiPaths} from 'openapi-typescript-fetch/types';

/**
 * Custom request init type
 */
export interface CustomRequestInit extends Omit<RequestInit, 'headers'> {
  readonly headers: Headers;
}

/**
 * Middleware function type
 */
export type Middleware = (
  url: string,
  init: CustomRequestInit,
  next: (url: string, init: CustomRequestInit) => Promise<ApiResponse>,
) => Promise<ApiResponse>;

export interface TaggyFetcher<Paths extends OpenapiPaths<Paths>> {
  configure: (config: FetchConfig) => void;
  use: (mw: Middleware) => number;
  path: <P extends keyof Paths>(
    path: P,
  ) => {
    method: <M extends keyof Paths[P]>(
      method: M,
    ) => {
      create: CreateFetch<M, Paths[P][M]>;
    };
  };
}
