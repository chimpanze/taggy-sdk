/**
 * Error handling examples for Taggy SDK
 * 
 * This example demonstrates how to handle different types of errors.
 */

import { 
  TaggyClient, 
  TaggyError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ValidationError, 
  RateLimitError 
} from 'taggy-sdk';

// Initialize the client
const client = new TaggyClient({
  auth: {
    apiKey: 'your-api-key'
  }
});

// Example 1: Basic error handling
async function basicErrorHandling() {
  try {
    // Attempt to get a content item with an invalid ID
    const contentItem = await client.content.getById(999999);
    console.log('Content item:', contentItem);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

// Example 2: Handling specific error types
async function specificErrorHandling() {
  try {
    // Attempt to access a protected resource
    const contentItems = await client.content.getAll();
    console.log('Content items:', contentItems);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.error('Authentication failed:', error.message);
      // Handle authentication error (e.g., redirect to login)
    } else if (error instanceof AuthorizationError) {
      console.error('Not authorized:', error.message);
      // Handle authorization error (e.g., show permission denied message)
    } else if (error instanceof NotFoundError) {
      console.error('Resource not found:', error.message);
      // Handle not found error (e.g., show 404 page)
    } else if (error instanceof ValidationError) {
      console.error('Validation error:', error.message);
      // Handle validation error (e.g., show form errors)
    } else if (error instanceof RateLimitError) {
      console.error('Rate limit exceeded:', error.message);
      console.log('Retry after:', error.retryAfter);
      // Handle rate limit error (e.g., implement retry with backoff)
    } else if (error instanceof TaggyError) {
      console.error('Taggy API error:', error.message);
      // Handle general API error
    } else {
      console.error('Unknown error:', error);
      // Handle unknown error
    }
  }
}

// Example 3: Implementing retry logic for rate limit errors
async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 3) {
  let retries = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof RateLimitError && retries < maxRetries) {
        retries++;
        const delay = error.retryAfter || Math.pow(2, retries) * 1000; // Exponential backoff
        console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Re-throw if not a rate limit error or max retries reached
      }
    }
  }
}

// Example usage of retry logic
async function retryExample() {
  try {
    const result = await retryWithBackoff(async () => {
      return await client.content.getAll();
    });
    console.log('Result after retries:', result);
  } catch (error) {
    console.error('Failed after retries:', error);
  }
}

// Run the examples
basicErrorHandling();
specificErrorHandling();
retryExample();