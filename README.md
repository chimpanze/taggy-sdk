# Taggy SDK

A TypeScript client library for interacting with the Taggy API, a content organization platform that allows users to save, tag, and organize various types of content from the web and other sources.

[![GitHub Package Version](https://img.shields.io/github/package-json/v/chimpanze/taggy-sdk)](https://github.com/chimpanze/taggy-sdk/packages)
[![Build and Publish](https://github.com/chimpanze/taggy-sdk/actions/workflows/publish.yml/badge.svg)](https://github.com/chimpanze/taggy-sdk/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

To install the package from GitHub Packages, you first need to authenticate with GitHub Packages:

1. Create a Personal Access Token (PAT) with the `read:packages` scope on GitHub.
2. Configure npm to use GitHub Packages for the @chimpanze scope:

```bash
# Create or edit ~/.npmrc
echo "@chimpanze:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PAT" >> ~/.npmrc
```

Then install the package:

```bash
# Using npm
npm install @chimpanze/taggy-sdk

# Using yarn
yarn add @chimpanze/taggy-sdk

# Using pnpm
pnpm add @chimpanze/taggy-sdk
```

## Quick Start

```typescript
import { TaggyClient } from '@chimpanze/taggy-sdk';

// Initialize the client with your API key
const client = new TaggyClient({
  auth: {
    apiKey: 'your-api-key'
  }
});

// Use the client to interact with the API
async function main() {
  try {
    // Get all content items
    const contentItems = await client.content.getAll();
    console.log('Content items:', contentItems);
    
    // Get all tags
    const tags = await client.tags.getAll();
    console.log('Tags:', tags);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

## Authentication

The Taggy SDK supports multiple authentication methods:

### API Key

```typescript
const client = new TaggyClient({
  auth: {
    apiKey: 'your-api-key'
  }
});
```

### JWT Token

```typescript
const client = new TaggyClient({
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Custom Token Provider

```typescript
const client = new TaggyClient({
  auth: {
    getToken: async () => {
      // Implement your token retrieval logic here
      return 'your-token';
    }
  }
});
```

## Configuration Options

The `TaggyClient` constructor accepts a configuration object with the following options:

```typescript
const client = new TaggyClient({
  // Base URL for the API (default: 'https://api.taggy.com/api/v1')
  baseUrl: 'https://api.taggy.com/api/v1',
  
  // Authentication configuration
  auth: {
    apiKey: 'your-api-key',
    // OR
    token: 'your-jwt-token',
    // OR
    getToken: async () => 'your-token'
  },
  
  // Custom headers to include in all requests
  headers: {
    'X-Custom-Header': 'custom-value'
  },
  
  // SDK version (automatically set)
  version: '1.0.0'
});
```

## Available Services

The Taggy SDK provides the following services:

### Content Service

```typescript
// Get all content items
const contentItems = await client.content.getAll();

// Get a specific content item by ID
const contentItem = await client.content.getById(123);

// Create a new content item
const newContentItem = await client.content.create({
  url: 'https://example.com/article',
  title: 'Example Article',
  description: 'This is an example article'
});

// Update a content item
await client.content.update(123, {
  title: 'Updated Title',
  description: 'Updated description'
});

// Delete a content item
await client.content.delete(123);
```

### Tag Service

```typescript
// Get all tags
const tags = await client.tags.getAll();

// Get a specific tag by ID
const tag = await client.tags.getById(123);

// Create a new tag
const newTag = await client.tags.create({
  name: 'example-tag',
  color: '#FF5733'
});

// Update a tag
await client.tags.update(123, {
  name: 'updated-tag',
  color: '#33FF57'
});

// Delete a tag
await client.tags.delete(123);
```

### Archive Service

```typescript
// Create a new archive
const newArchive = await client.archive.create({
  url: 'https://example.com/article',
  options: {
    includeImages: true,
    saveAsPdf: false
  }
});

// Get archive status
const archiveStatus = await client.archive.getStatus(123);

// Get archive by ID
const archiveById = await client.archive.getById(123);

// Delete an archive
await client.archive.deleteArchive(123);
```

## Error Handling

The Taggy SDK provides specialized error classes for different types of errors:

```typescript
import { 
  TaggyError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ValidationError, 
  RateLimitError 
} from '@chimpanze/taggy-sdk';

try {
  // Use the SDK
  const contentItems = await client.content.getAll();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof AuthorizationError) {
    console.error('Not authorized:', error.message);
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded:', error.message);
    console.log('Retry after:', error.retryAfter);
  } else if (error instanceof TaggyError) {
    console.error('Taggy API error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Examples

Check out the [examples](./examples) directory for more usage examples.

## API Documentation

For detailed API documentation, see the [API docs](https://chimpanze.github.io/taggy-sdk/). The documentation is automatically generated from the source code and deployed to GitHub Pages whenever changes are pushed to the main branch or a new version is tagged.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.