/**
 * Organization Unit Service
 * @since 2.9.0
 * @updated 3.2.0 - New proxy service re-exported, legacy service renamed
 */
import { RestService, ABP, PagedResultDto } from '@abpjs/core';
import { Identity } from '../models/identity';
import type { LegacyGetOrganizationUnitInput } from '../models/get-organization-unit-input';
import type { LegacyOrganizationUnitCreateDto } from '../models/organization-unit-create-dto';
import type { LegacyOrganizationUnitMoveInput } from '../models/organization-unit-move-input';
import type { LegacyOrganizationUnitRoleInput } from '../models/organization-unit-role-input';
import type { LegacyOrganizationUnitUpdateDto } from '../models/organization-unit-update-dto';
import type { LegacyOrganizationUnitUserInput } from '../models/organization-unit-user-input';
import type { LegacyOrganizationUnitWithDetailsDto } from '../models/organization-unit-with-details-dto';

// Re-export new proxy service
export { OrganizationUnitService } from '../proxy/identity/organization-unit.service';

/**
 * Legacy service for managing organization unit operations.
 * @deprecated Use OrganizationUnitService from proxy/identity instead
 * @since 2.9.0
 */
export class LegacyOrganizationUnitService {
  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  private rest: RestService;

  constructor(rest: RestService) {
    this.rest = rest;
  }

  /**
   * Add roles to an organization unit
   * @param body - The role IDs to add
   * @param id - The organization unit ID
   * @returns Promise resolving when complete
   */
  addRolesByIdAndInput(body: LegacyOrganizationUnitRoleInput, id: string): Promise<void> {
    return this.rest.request<LegacyOrganizationUnitRoleInput, void>({
      method: 'POST',
      url: `/api/identity/organization-units/${id}/roles`,
      body,
    });
  }

  /**
   * Add members (users) to an organization unit
   * @param body - The user IDs to add
   * @param id - The organization unit ID
   * @returns Promise resolving when complete
   */
  addMembersByIdAndInput(body: LegacyOrganizationUnitUserInput, id: string): Promise<void> {
    return this.rest.request<LegacyOrganizationUnitUserInput, void>({
      method: 'POST',
      url: `/api/identity/organization-units/${id}/members`,
      body,
    });
  }

  /**
   * Create a new organization unit
   * @param body - The organization unit data
   * @returns Promise with the created organization unit
   */
  createByInput(body: LegacyOrganizationUnitCreateDto): Promise<LegacyOrganizationUnitWithDetailsDto> {
    return this.rest.request<LegacyOrganizationUnitCreateDto, LegacyOrganizationUnitWithDetailsDto>({
      method: 'POST',
      url: '/api/identity/organization-units',
      body,
    });
  }

  /**
   * Delete an organization unit
   * @param id - The organization unit ID to delete
   * @returns Promise resolving when complete
   */
  deleteById(id: string): Promise<void> {
    return this.rest.request<null, void>({
      method: 'DELETE',
      url: `/api/identity/organization-units/${id}`,
    });
  }

  /**
   * Get an organization unit by ID
   * @param id - The organization unit ID
   * @returns Promise with the organization unit
   */
  getById(id: string): Promise<LegacyOrganizationUnitWithDetailsDto> {
    return this.rest.request<null, LegacyOrganizationUnitWithDetailsDto>({
      method: 'GET',
      url: `/api/identity/organization-units/${id}`,
    });
  }

  /**
   * Get organization units with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated organization units
   */
  getListByInput(params?: LegacyGetOrganizationUnitInput): Promise<PagedResultDto<LegacyOrganizationUnitWithDetailsDto>> {
    return this.rest.request<null, PagedResultDto<LegacyOrganizationUnitWithDetailsDto>>({
      method: 'GET',
      url: '/api/identity/organization-units',
      params: params as unknown as Record<string, unknown>,
    });
  }

  /**
   * Get roles assigned to an organization unit
   * @param params - Query parameters for pagination
   * @param id - The organization unit ID
   * @returns Promise with paginated roles
   */
  getRolesById(params: ABP.PageQueryParams, id: string): Promise<PagedResultDto<Identity.RoleItem>> {
    return this.rest.request<null, PagedResultDto<Identity.RoleItem>>({
      method: 'GET',
      url: `/api/identity/organization-units/${id}/roles`,
      params,
    });
  }

  /**
   * Get members (users) of an organization unit
   * @param params - Query parameters for pagination
   * @param id - The organization unit ID
   * @returns Promise with paginated users
   */
  getMembersById(params: ABP.PageQueryParams, id: string): Promise<PagedResultDto<Identity.UserItem>> {
    return this.rest.request<null, PagedResultDto<Identity.UserItem>>({
      method: 'GET',
      url: `/api/identity/organization-units/${id}/members`,
      params,
    });
  }

  /**
   * Move an organization unit to a new parent
   * @param body - The move input with new parent ID
   * @param id - The organization unit ID to move
   * @returns Promise resolving when complete
   */
  moveByIdAndInput(body: LegacyOrganizationUnitMoveInput, id: string): Promise<void> {
    return this.rest.request<LegacyOrganizationUnitMoveInput, void>({
      method: 'PUT',
      url: `/api/identity/organization-units/${id}/move`,
      body,
    });
  }

  /**
   * Update an organization unit
   * @param body - The updated organization unit data
   * @param id - The organization unit ID to update
   * @returns Promise with the updated organization unit
   */
  updateByIdAndInput(body: LegacyOrganizationUnitUpdateDto, id: string): Promise<LegacyOrganizationUnitWithDetailsDto> {
    return this.rest.request<LegacyOrganizationUnitUpdateDto, LegacyOrganizationUnitWithDetailsDto>({
      method: 'PUT',
      url: `/api/identity/organization-units/${id}`,
      body,
    });
  }

  /**
   * Remove a member (user) from an organization unit
   * @param id - The organization unit ID
   * @param memberId - The user ID to remove
   * @returns Promise resolving when complete
   */
  removeMemberByIdAndMemberId(id: string, memberId: string): Promise<void> {
    return this.rest.request<null, void>({
      method: 'DELETE',
      url: `/api/identity/organization-units/${id}/members/${memberId}`,
    });
  }

  /**
   * Remove a role from an organization unit
   * @param id - The organization unit ID
   * @param roleId - The role ID to remove
   * @returns Promise resolving when complete
   */
  removeRoleByIdAndRoleId(id: string, roleId: string): Promise<void> {
    return this.rest.request<null, void>({
      method: 'DELETE',
      url: `/api/identity/organization-units/${id}/roles/${roleId}`,
    });
  }
}
