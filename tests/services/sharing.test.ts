import { describe, it, expect, beforeEach } from 'vitest';
import { SharingService } from '../../src/services/sharing';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('SharingService', () => {
  let service: SharingService;
  let mockOperation: any;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher, mockOperation: operation } = createMockFetcher();
    mockOperation = operation;
    service = new SharingService(mockFetcher);
  });

  describe('listSharedCollections', () => {
    it('should make a GET request to list shared collections', async () => {
      const expectedResponse = {
        collections: [
          {
            id: 'collection-123',
            name: 'Shared Collection 1',
            owner: 'user-456',
            sharedWith: ['user-789', 'user-101'],
          },
          {
            id: 'collection-456',
            name: 'Shared Collection 2',
            owner: 'user-456',
            sharedWith: ['user-202'],
          },
        ],
      };

      await testServiceMethod(
        service,
        'listSharedCollections',
        {
          path: '/sharing/collections',
          method: 'get',
        },
        expectedResponse
      );
    });
  });

  describe('addCollaborators', () => {
    it('should make a POST request to add collaborators to a collection', async () => {
      const collectionId = 'collection-123';
      const requestData = {
        emails: ['user1@example.com', 'user2@example.com'],
        permissions: 'read',
      };
      const expectedResponse = {
        success: true,
        message: 'Collaborators added successfully',
      };

      await testServiceMethod(
        service,
        'addCollaborators',
        {
          path: '/sharing/collections/{id}/collaborate',
          actualPath: `/sharing/collections/${collectionId}/collaborate`,
          method: 'post',
          requestData,
        },
        expectedResponse,
        collectionId,
        requestData
      );
    });
  });

  describe('updatePermissions', () => {
    it('should make a PUT request to update sharing permissions', async () => {
      const collectionId = 'collection-123';
      const requestData = {
        userId: 'user-789',
        permissions: 'write',
      };
      const expectedResponse = {
        success: true,
        message: 'Permissions updated successfully',
      };

      await testServiceMethod(
        service,
        'updatePermissions',
        {
          path: '/sharing/collections/{id}/permissions',
          actualPath: `/sharing/collections/${collectionId}/permissions`,
          method: 'put',
          requestData,
        },
        expectedResponse,
        collectionId,
        requestData
      );
    });
  });

  describe('shareCollection', () => {
    it('should make a POST request to share a collection', async () => {
      const collectionId = 'collection-123';
      const requestData = {
        public: true,
        expiresAt: '2025-09-02T23:04:00Z',
      };
      const expectedResponse = {
        shareId: 'share-123',
        shareUrl: 'https://taggy.example.com/share/share-123',
        expiresAt: '2025-09-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'shareCollection',
        {
          path: '/sharing/collections/{id}/share',
          actualPath: `/sharing/collections/${collectionId}/share`,
          method: 'post',
          requestData,
        },
        expectedResponse,
        collectionId,
        requestData
      );
    });
  });

  describe('listInvitations', () => {
    it('should make a GET request to list sharing invitations', async () => {
      const expectedResponse = {
        invitations: [
          {
            id: 'invitation-123',
            collectionId: 'collection-123',
            collectionName: 'Shared Collection 1',
            from: 'user-456',
            permissions: 'read',
            createdAt: '2025-08-01T12:00:00Z',
          },
          {
            id: 'invitation-456',
            collectionId: 'collection-456',
            collectionName: 'Shared Collection 2',
            from: 'user-789',
            permissions: 'write',
            createdAt: '2025-08-02T12:00:00Z',
          },
        ],
      };

      await testServiceMethod(
        service,
        'listInvitations',
        {
          path: '/sharing/invitations',
          method: 'get',
        },
        expectedResponse
      );
    });
  });

  describe('acceptInvitation', () => {
    it('should make a POST request to accept an invitation', async () => {
      const invitationId = 'invitation-123';
      const expectedResponse = {
        success: true,
        message: 'Invitation accepted',
        collectionId: 'collection-123',
      };

      await testServiceMethod(
        service,
        'acceptInvitation',
        {
          path: '/sharing/invitations/{id}/accept',
          actualPath: `/sharing/invitations/${invitationId}/accept`,
          method: 'post',
        },
        expectedResponse,
        invitationId
      );
    });
  });

  describe('declineInvitation', () => {
    it('should make a POST request to decline an invitation', async () => {
      const invitationId = 'invitation-123';
      const expectedResponse = {
        success: true,
        message: 'Invitation declined',
      };

      await testServiceMethod(
        service,
        'declineInvitation',
        {
          path: '/sharing/invitations/{id}/decline',
          actualPath: `/sharing/invitations/${invitationId}/decline`,
          method: 'post',
        },
        expectedResponse,
        invitationId
      );
    });
  });

  describe('getPublicShare', () => {
    it('should make a GET request to get public shared content', async () => {
      const shareId = 'share-123';
      const expectedResponse = {
        collection: {
          id: 'collection-123',
          name: 'Shared Collection 1',
          items: [
            { id: 'item-1', title: 'Shared Item 1' },
            { id: 'item-2', title: 'Shared Item 2' },
          ],
        },
        owner: 'user-456',
        expiresAt: '2025-09-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'getPublicShare',
        {
          path: '/sharing/public/{shareId}',
          actualPath: `/sharing/public/${shareId}`,
          method: 'get',
        },
        expectedResponse,
        shareId
      );
    });
  });

  describe('shareTag', () => {
    it('should make a POST request to share a tag', async () => {
      const tagId = 'tag-123';
      const requestData = {
        public: true,
        expiresAt: '2025-09-02T23:04:00Z',
      };
      const expectedResponse = {
        shareId: 'share-456',
        shareUrl: 'https://taggy.example.com/share/tag/share-456',
        expiresAt: '2025-09-02T23:04:00Z',
      };

      await testServiceMethod(
        service,
        'shareTag',
        {
          path: '/sharing/tags/{id}/share',
          actualPath: `/sharing/tags/${tagId}/share`,
          method: 'post',
          requestData,
        },
        expectedResponse,
        tagId,
        requestData
      );
    });
  });

  describe('importTags', () => {
    it('should make a POST request to import shared tags', async () => {
      const requestData = {
        shareId: 'share-456',
        targetFolder: 'folder-123',
      };
      const expectedResponse = {
        success: true,
        message: 'Tags imported successfully',
        importedTags: [
          { id: 'tag-789', name: 'Imported Tag 1' },
          { id: 'tag-101', name: 'Imported Tag 2' },
        ],
      };

      await testServiceMethod(
        service,
        'importTags',
        {
          path: '/sharing/tags/import',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('getPublicTags', () => {
    it('should make a GET request to get public shared tags', async () => {
      const expectedResponse = {
        tags: [
          {
            id: 'tag-202',
            name: 'Public Tag 1',
            owner: 'user-303',
            popularity: 98,
          },
          {
            id: 'tag-404',
            name: 'Public Tag 2',
            owner: 'user-505',
            popularity: 85,
          },
        ],
      };

      await testServiceMethod(
        service,
        'getPublicTags',
        {
          path: '/sharing/tags/public',
          method: 'get',
        },
        expectedResponse
      );
    });
  });
});