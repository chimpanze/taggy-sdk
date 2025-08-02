/**
 * Authentication examples for Taggy SDK
 * 
 * This example demonstrates different authentication methods.
 */

import { TaggyClient } from 'taggy-sdk';

// Example 1: API Key Authentication
const apiKeyClient = new TaggyClient({
  auth: {
    apiKey: 'your-api-key'
  }
});

// Example 2: JWT Token Authentication
const jwtClient = new TaggyClient({
  auth: {
    token: 'your-jwt-token'
  }
});

// Example 3: Custom Token Provider
const tokenProviderClient = new TaggyClient({
  auth: {
    getToken: async () => {
      // Implement your token retrieval logic here
      // For example, fetch a token from a secure storage or another API
      return 'your-token';
    }
  }
});

// Example 4: Login with email and password
async function loginExample() {
  // Create a client without authentication
  const client = new TaggyClient();
  
  try {
    // Login with email and password
    const loginResult = await client.auth.login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    console.log('Login successful:', loginResult);
    
    // Now you can use the client with the authenticated session
    const contentItems = await client.content.getAll();
    console.log('Content items:', contentItems);
    
    // Logout when done
    await client.auth.logout();
    console.log('Logged out successfully');
    
  } catch (error) {
    console.error('Authentication error:', error);
  }
}

// Example 5: Register a new user
async function registerExample() {
  // Create a client without authentication
  const client = new TaggyClient();
  
  try {
    // Register a new user
    const registerResult = await client.auth.register({
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User'
    });
    
    console.log('Registration successful:', registerResult);
    
  } catch (error) {
    console.error('Registration error:', error);
  }
}

// Run the examples
loginExample();
registerExample();