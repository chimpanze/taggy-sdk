# Taggy SDK - Todo List

This document outlines the current state of the Taggy SDK project and lists potential improvements and future tasks.

## Current State (as of 2025-08-02)

The Taggy SDK is currently functional and buildable with the following features implemented:

- ✅ Core client implementation with configuration options
- ✅ Authentication service with support for API key, JWT token, and custom token provider
- ✅ Content service with CRUD operations
- ✅ Tag service with CRUD operations
- ✅ Error handling with specialized error classes
- ✅ Type safety using OpenAPI-generated types
- ✅ Basic utility functions (URL validation, date formatting, random string generation)
- ✅ Test coverage for client and utility functions

## Potential Improvements

### High Priority

1. **Resolve Axios vs Fetch Inconsistency**
   - The auth interceptor (src/interceptors/auth.ts) uses Axios, but the client uses openapi-typescript-fetch
   - Either update the auth interceptor to use fetch or remove it if not needed

2. **Improve Test Coverage**
   - Add tests for services (auth, content, tag)
   - Add tests for error handling
   - Add integration tests with a mock server

3. **Documentation**
   - Add more examples in the docs directory
   - Improve JSDoc comments for better TypeDoc output
   - Create a getting started guide

### Medium Priority

4. **Additional Features**
   - Add pagination helpers for list operations
   - Add batch operations for content and tags
   - Add caching mechanism for frequently accessed data

5. **Developer Experience**
   - Add more detailed error messages
   - Improve type definitions for better IDE support
   - Add more utility functions for common operations

### Low Priority

6. **Performance Optimizations**
   - Optimize bundle size
   - Add request batching
   - Implement request cancellation

7. **Additional Tooling**
   - Add benchmarking tools
   - Add more examples for different use cases
   - Create a playground for testing the SDK

## Completed Tasks

- ✅ Initial SDK implementation
- ✅ Basic service implementations
- ✅ Error handling
- ✅ Configuration options
- ✅ Type generation from OpenAPI spec
- ✅ Basic testing setup