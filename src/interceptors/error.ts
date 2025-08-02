/**
 * Error Interceptor
 * Error handler for openapi-typescript-fetch
 */

import type { ApiResponse } from 'openapi-typescript-fetch';
import { CustomRequestInit, Middleware } from '../types/fetch';

/**
 * Custom SDK error class
 */
export class TaggyError extends Error {
  /**
   * HTTP status code
   */
  status: number;

  /**
   * Error code from API
   */
  code: string;

  /**
   * Original error object
   */
  originalError: Error;

  /**
   * Creates a new TaggyError
   * @param message Error message
   * @param status HTTP status code
   * @param code Error code
   * @param originalError Original error
   */
  constructor(message: string, status: number, code: string, originalError: Error) {
    super(message);
    this.name = 'TaggyError';
    this.status = status;
    this.code = code;
    this.originalError = originalError;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, TaggyError.prototype);
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends TaggyError {
  constructor(message: string, code: string, originalError: Error) {
    super(message, 401, code, originalError);
    this.name = 'AuthenticationError';

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization error class
 */
export class AuthorizationError extends TaggyError {
  constructor(message: string, code: string, originalError: Error) {
    super(message, 403, code, originalError);
    this.name = 'AuthorizationError';

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not found error class
 */
export class NotFoundError extends TaggyError {
  constructor(message: string, code: string, originalError: Error) {
    super(message, 404, code, originalError);
    this.name = 'NotFoundError';

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Validation error class
 */
export class ValidationError extends TaggyError {
  /**
   * Validation errors by field
   */
  errors: Record<string, string[]>;

  constructor(
    message: string,
    code: string,
    errors: Record<string, string[]>,
    originalError: Error,
  ) {
    super(message, 422, code, originalError);
    this.name = 'ValidationError';
    this.errors = errors;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Rate limit error class
 */
export class RateLimitError extends TaggyError {
  /**
   * When rate limit will reset
   */
  resetAt: Date;

  constructor(message: string, code: string, resetAt: Date, originalError: Error) {
    super(message, 429, code, originalError);
    this.name = 'RateLimitError';
    this.resetAt = resetAt;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Creates an error handler for openapi-typescript-fetch
 * @returns Error handler middleware function
 */
export function createErrorHandler(): Middleware {
  return async (
    url: string,
    init: CustomRequestInit,
    next: (url: string, init: CustomRequestInit) => Promise<ApiResponse>,
  ) => {
    try {
      const response = await next(url, init);

      // If the response is not ok, handle the error
      if (!response.ok) {
        let data: Record<string, any> = response.data || {};

        const status = response.status;
        const errorMessage = (data?.message as string) || 'Unknown error';
        const errorCode = (data?.code as string) || 'UNKNOWN_ERROR';

        // Create an error object to pass to the error handlers
        const error = new Error(errorMessage);

        // Handle different error types based on status code
        switch (status) {
          case 401:
            throw new AuthenticationError(errorMessage, errorCode, error);

          case 403:
            throw new AuthorizationError(errorMessage, errorCode, error);

          case 404:
            throw new NotFoundError(errorMessage, errorCode, error);

          case 422:
            throw new ValidationError(
              errorMessage,
              errorCode,
              (data?.errors as Record<string, string[]>) || {},
              error,
            );

          case 429:
            const resetAtValue = data?.resetAt as string;
            const resetAt = resetAtValue ? new Date(resetAtValue) : new Date(Date.now() + 60000); // Default to 1 minute

            throw new RateLimitError(errorMessage, errorCode, resetAt, error);

          default:
            throw new TaggyError(errorMessage, status, errorCode, error);
        }
      }

      return response;
    } catch (error) {
      // If the error is already a TaggyError, rethrow it
      if (error instanceof TaggyError) {
        throw error;
      }

      // If it's a network error or other fetch error
      if (error instanceof Error) {
        throw new TaggyError('Network error or request timeout', 0, 'NETWORK_ERROR', error);
      }

      // For any other type of error
      throw new TaggyError('Unknown error', 0, 'UNKNOWN_ERROR', new Error(String(error)));
    }
  };
}
