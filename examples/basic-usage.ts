/**
 * Basic usage example for Taggy SDK
 * 
 * This example demonstrates how to initialize the client and perform basic operations.
 */

import { TaggyClient } from 'taggy-sdk';

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
    
    // Create a new content item
    const newContentItem = await client.content.create({
      url: 'https://example.com/article',
      title: 'Example Article',
      description: 'This is an example article'
    });
    console.log('New content item:', newContentItem);
    
    // Create a new tag
    const newTag = await client.tags.create({
      name: 'example-tag',
      color: '#FF5733'
    });
    console.log('New tag:', newTag);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();