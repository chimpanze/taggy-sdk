/**
 * Sharing Service
 * Service for sharing-related API endpoints
 */

import { BaseService } from './base';
import { paths } from '../types/generated.ts';
import { TaggyFetcher } from '../types/fetch.ts';
import { OpArgType, OpReturnType } from 'openapi-typescript-fetch/types';

// Collection sharing types
type ListSharedCollectionsResponse = OpReturnType<paths['/sharing/collections']['get']>;
type AddCollaboratorsRequestData = OpArgType<
  paths['/sharing/collections/{id}/collaborate']['post']
>;
type UpdatePermissionsRequestData = OpArgType<
  paths['/sharing/collections/{id}/permissions']['put']
>;
type UpdatePermissionsResponse = OpReturnType<
  paths['/sharing/collections/{id}/permissions']['put']
>;
type ShareCollectionRequestData = OpArgType<paths['/sharing/collections/{id}/share']['post']>;
type ShareCollectionResponse = OpReturnType<paths['/sharing/collections/{id}/share']['post']>;

// Invitation types
type ListInvitationsResponse = OpReturnType<paths['/sharing/invitations']['get']>;
type AcceptInvitationResponse = OpReturnType<paths['/sharing/invitations/{id}/accept']['post']>;
type DeclineInvitationResponse = OpReturnType<paths['/sharing/invitations/{id}/decline']['post']>;

// Public sharing types
type GetPublicShareResponse = OpReturnType<paths['/sharing/public/{shareId}']['get']>;

// Tag sharing types
type ShareTagRequestData = OpArgType<paths['/sharing/tags/{id}/share']['post']>;
type ShareTagResponse = OpReturnType<paths['/sharing/tags/{id}/share']['post']>;
type ImportTagsRequestData = OpArgType<paths['/sharing/tags/import']['post']>;
type ImportTagsResponse = OpReturnType<paths['/sharing/tags/import']['post']>;
type GetPublicTagsResponse = OpReturnType<paths['/sharing/tags/public']['get']>;

/**
 * Service for sharing operations
 */
export class SharingService extends BaseService {
  /**
   * Creates a new SharingService instance
   * @param fetcher Fetcher instance to use for requests
   */
  constructor(fetcher: TaggyFetcher<paths>) {
    super(fetcher);
  }

  /**
   * List shared collections
   * @returns Promise with shared collections data
   */
  async listSharedCollections(): Promise<ListSharedCollectionsResponse> {
    return this.get<'/sharing/collections'>('/sharing/collections');
  }

  /**
   * Add collaborators to a collection
   * @param id Collection ID
   * @param data Collaborator data
   * @returns Promise with response data
   */
  async addCollaborators(
    id: string,
    data: AddCollaboratorsRequestData,
  ): Promise<Record<string, string>> {
    return this.post<'/sharing/collections/{id}/collaborate'>(
      `/sharing/collections/${id}/collaborate` as '/sharing/collections/{id}/collaborate',
      data,
    );
  }

  /**
   * Update sharing permissions for a collection
   * @param id Collection ID
   * @param data Permission update data
   * @returns Promise with updated sharing settings
   */
  async updatePermissions(
    id: string,
    data: UpdatePermissionsRequestData,
  ): Promise<UpdatePermissionsResponse> {
    return this.put<'/sharing/collections/{id}/permissions'>(
      `/sharing/collections/${id}/permissions` as '/sharing/collections/{id}/permissions',
      data,
    );
  }

  /**
   * Share a collection
   * @param id Collection ID
   * @param data Share settings data
   * @returns Promise with share response
   */
  async shareCollection(
    id: string,
    data: ShareCollectionRequestData,
  ): Promise<ShareCollectionResponse> {
    return this.post<'/sharing/collections/{id}/share'>(
      `/sharing/collections/${id}/share` as '/sharing/collections/{id}/share',
      data,
    );
  }

  /**
   * List sharing invitations
   * @returns Promise with invitations data
   */
  async listInvitations(): Promise<ListInvitationsResponse> {
    return this.get<'/sharing/invitations'>('/sharing/invitations');
  }

  /**
   * Accept a sharing invitation
   * @param id Invitation ID
   * @returns Promise with response data
   */
  async acceptInvitation(id: string): Promise<AcceptInvitationResponse> {
    return this.post<'/sharing/invitations/{id}/accept'>(
      `/sharing/invitations/${id}/accept` as '/sharing/invitations/{id}/accept',
    );
  }

  /**
   * Decline a sharing invitation
   * @param id Invitation ID
   * @returns Promise with response data
   */
  async declineInvitation(id: string): Promise<DeclineInvitationResponse> {
    return this.post<'/sharing/invitations/{id}/decline'>(
      `/sharing/invitations/${id}/decline` as '/sharing/invitations/{id}/decline',
    );
  }

  /**
   * Get public shared content
   * @param shareId Share ID
   * @returns Promise with public share data
   */
  async getPublicShare(shareId: string): Promise<GetPublicShareResponse> {
    return this.get<'/sharing/public/{shareId}'>(
      `/sharing/public/${shareId}` as '/sharing/public/{shareId}',
    );
  }

  /**
   * Share a tag
   * @param id Tag ID
   * @param data Share settings data
   * @returns Promise with share response
   */
  async shareTag(id: string, data: ShareTagRequestData): Promise<ShareTagResponse> {
    return this.post<'/sharing/tags/{id}/share'>(
      `/sharing/tags/${id}/share` as '/sharing/tags/{id}/share',
      data,
    );
  }

  /**
   * Import shared tags
   * @param data Import data
   * @returns Promise with import response
   */
  async importTags(data: ImportTagsRequestData): Promise<ImportTagsResponse> {
    return this.post<'/sharing/tags/import'>('/sharing/tags/import', data);
  }

  /**
   * Get public shared tags
   * @returns Promise with public tags data
   */
  async getPublicTags(): Promise<GetPublicTagsResponse> {
    return this.get<'/sharing/tags/public'>('/sharing/tags/public');
  }
}
