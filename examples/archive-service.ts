/**
 * Archive service examples for Taggy SDK
 * 
 * This example demonstrates how to use the Archive service to archive web content.
 */

import { TaggyClient } from 'taggy-sdk';

// Initialize the client
const client = new TaggyClient({
  auth: {
    apiKey: 'your-api-key'
  }
});

// Example 1: Create a new archive
async function createArchive() {
  try {
    // Create a new archive for a web page
    const newArchive = await client.archive.create({
      url: 'https://example.com/article',
      options: {
        includeImages: true,
        saveAsPdf: false,
        // Additional options can be specified here
        captureScreenshot: true,
        extractText: true,
        followLinks: false,
        maxDepth: 1
      }
    });
    
    console.log('Archive creation started:', newArchive);
    console.log('Archive ID:', newArchive.id);
    console.log('Status:', newArchive.status);
    
    return newArchive.id;
  } catch (error) {
    console.error('Error creating archive:', error);
    return null;
  }
}

// Example 2: Check archive status
async function checkArchiveStatus(archiveId: number) {
  try {
    // Check the status of an archive
    const archiveStatus = await client.archive.getStatus(archiveId);
    
    console.log('Archive status:', archiveStatus);
    console.log('Status:', archiveStatus.status);
    console.log('Progress:', archiveStatus.progress);
    
    if (archiveStatus.status === 'completed') {
      console.log('Archive completed at:', archiveStatus.completedAt);
    } else if (archiveStatus.status === 'failed') {
      console.log('Archive failed with error:', archiveStatus.error);
    }
    
    return archiveStatus.status;
  } catch (error) {
    console.error('Error checking archive status:', error);
    return null;
  }
}

// Example 3: Get archive content
async function getArchiveContent(archiveId: number) {
  try {
    // Get the content of a completed archive
    const archiveContent = await client.archive.getById(archiveId);
    
    console.log('Archive content:', archiveContent);
    console.log('URL:', archiveContent.url);
    console.log('Title:', archiveContent.title);
    console.log('Content:', archiveContent.content.substring(0, 100) + '...');
    
    return archiveContent;
  } catch (error) {
    console.error('Error getting archive content:', error);
    return null;
  }
}

// Example 4: Delete an archive
async function deleteArchive(archiveId: number) {
  try {
    // Delete an archive
    const result = await client.archive.deleteArchive(archiveId);
    
    console.log('Archive deletion result:', result);
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    return result.success;
  } catch (error) {
    console.error('Error deleting archive:', error);
    return false;
  }
}

// Example 5: Complete archive workflow
async function archiveWorkflow() {
  // Step 1: Create a new archive
  const archiveId = await createArchive();
  
  if (!archiveId) {
    console.error('Failed to create archive');
    return;
  }
  
  // Step 2: Poll for archive status until completed or failed
  let status = 'processing';
  const maxAttempts = 10;
  let attempts = 0;
  
  while (status === 'processing' && attempts < maxAttempts) {
    console.log(`Checking status (attempt ${attempts + 1}/${maxAttempts})...`);
    
    // Wait for 2 seconds between status checks
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    status = await checkArchiveStatus(archiveId);
    attempts++;
  }
  
  // Step 3: Get archive content if completed
  if (status === 'completed') {
    const content = await getArchiveContent(archiveId);
    
    if (content) {
      console.log('Successfully archived content');
      
      // Step 4: Delete the archive when done (optional)
      console.log('Deleting archive...');
      const deleted = await deleteArchive(archiveId);
      
      if (deleted) {
        console.log('Archive deleted successfully');
      } else {
        console.log('Failed to delete archive');
      }
    }
  } else {
    console.log(`Archive not completed. Final status: ${status}`);
  }
}

// Run the complete workflow
archiveWorkflow();