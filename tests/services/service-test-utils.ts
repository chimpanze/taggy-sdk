import { expect, vi } from 'vitest';
import { BaseService } from '../../src/services/base';
import { paths } from '../../src/types/generated';
import { TaggyFetcher } from '../../src/types/fetch';
import { ApiResponse } from 'openapi-typescript-fetch';

/**
 * Creates a mock API response with the provided data
 * @param data Response data
 * @returns Mock ApiResponse object
 */
export function createMockApiResponse(data: any = {}): ApiResponse<any> {
  // @ts-ignore - We're mocking the ApiResponse
  return {
    data: data,
    ok: true,
    status: 200,
    statusText: 'OK',
  };
}

/**
 * Creates a mock fetcher for testing services
 * @param mockResponseData Optional response data to return from the mock operation
 * @returns Mock fetcher and operation
 */
export function createMockFetcher(mockResponseData: any = { success: true }) {
  // Create mock operation
  const mockOperation = vi.fn().mockResolvedValue(createMockApiResponse(mockResponseData));
  
  // Create mock fetcher
  const mockFetcher = {
    path: vi.fn().mockReturnThis(),
    method: vi.fn().mockReturnThis(),
    create: vi.fn().mockReturnValue(mockOperation),
  } as unknown as TaggyFetcher<paths>;
  
  return { mockFetcher, mockOperation };
}

/**
 * Type for service method parameters
 */
export type ServiceMethodParams = {
  path: string;
  actualPath?: string; // The actual path with parameters replaced
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  requestData?: Record<string, any>;
  queryParams?: Record<string, any>;
};

function emptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Tests a service method that extends BaseService
 * @param service Service instance to test
 * @param methodName Name of the method to test
 * @param params Parameters for the service method
 * @param expectedResponse Expected response from the service method
 * @param methodArgs Arguments to pass to the service method
 */
export async function testServiceMethod<T extends BaseService>(
  service: T,
  methodName: keyof T,
  params: ServiceMethodParams,
  expectedResponse: any,
  ...methodArgs: any[]
): Promise<void> {
  // Get the mock fetcher and operation from the service
  // @ts-ignore - We're accessing private properties for testing
  const mockFetcher = service.fetcher;
  // @ts-ignore - We're accessing private properties for testing
  const mockOperation = mockFetcher.create();
  
  // Mock the operation to return the expected response
  mockOperation.mockResolvedValue(createMockApiResponse(expectedResponse));
  
  // Call the service method
  const method = service[methodName] as (...args: any[]) => Promise<any>;
  const result = await method.apply(service, methodArgs);
  
  // Verify the fetcher was called with the correct path and method
  if (params.actualPath) {
    expect(mockFetcher.path).toHaveBeenCalledWith(params.actualPath);
  } else {
    expect(mockFetcher.path).toHaveBeenCalledWith(params.path);
  }
  expect(mockFetcher.method).toHaveBeenCalledWith(params.method);
  
  // Verify the operation was called with the correct parameters
  let expectedOperationParams: Record<string, any> = {};

  if (params.method === 'post' || params.method === 'put' || params.method === 'patch') {
    // @ts-ignore
    if (params.requestData && emptyObject(params.requestData) === false) {
      expectedOperationParams = params.requestData;
    }
  }

  expect(mockOperation).toHaveBeenCalledWith(expect.objectContaining(expectedOperationParams));
  
  // Verify the result matches the expected response
  expect(result).toEqual(expectedResponse);
}