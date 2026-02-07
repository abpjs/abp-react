/**
 * Organization Unit Service (Proxy)
 * Translated from @volo/abp.ng.identity OrganizationUnitService (proxy version)
 * @since 3.2.0
 */
import type { RestService, ListResultDto, PagedResultDto, PagedAndSortedResultRequestDto } from '@abpjs/core';
import type {
  GetAvailableRolesInput,
  GetAvailableUsersInput,
  GetIdentityUsersInput,
  GetOrganizationUnitInput,
  IdentityRoleDto,
  IdentityUserDto,
  OrganizationUnitCreateDto,
  OrganizationUnitMoveInput,
  OrganizationUnitRoleInput,
  OrganizationUnitUpdateDto,
  OrganizationUnitUserInput,
  OrganizationUnitWithDetailsDto,
} from './models';

/**
 * Proxy service for managing organization units
 * @since 3.2.0
 */
export class OrganizationUnitService {
  apiName = 'default';

  constructor(private restService: RestService) {}

  /**
   * Adds members to an organization unit
   */
  addMembers(id: string, input: OrganizationUnitUserInput): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/organization-units/${id}/members`,
      body: input,
    });
  }

  /**
   * Adds roles to an organization unit
   */
  addRoles(id: string, input: OrganizationUnitRoleInput): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/organization-units/${id}/roles`,
      body: input,
    });
  }

  /**
   * Creates a new organization unit
   */
  create(input: OrganizationUnitCreateDto): Promise<OrganizationUnitWithDetailsDto> {
    return this.restService.request<unknown, OrganizationUnitWithDetailsDto>({
      method: 'POST',
      url: '/api/identity/organization-units',
      body: input,
    });
  }

  /**
   * Deletes an organization unit
   */
  delete(id: string): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'DELETE',
      url: `/api/identity/organization-units/${id}`,
    });
  }

  /**
   * Gets an organization unit by ID
   */
  get(id: string): Promise<OrganizationUnitWithDetailsDto> {
    return this.restService.request<unknown, OrganizationUnitWithDetailsDto>({
      method: 'GET',
      url: `/api/identity/organization-units/${id}`,
    });
  }

  /**
   * Gets available roles for an organization unit
   */
  getAvailableRoles(input: GetAvailableRolesInput): Promise<PagedResultDto<IdentityRoleDto>> {
    return this.restService.request<unknown, PagedResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: `/api/identity/organization-units/${input.id}/available-roles`,
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }

  /**
   * Gets available users for an organization unit
   */
  getAvailableUsers(input: GetAvailableUsersInput): Promise<PagedResultDto<IdentityUserDto>> {
    return this.restService.request<unknown, PagedResultDto<IdentityUserDto>>({
      method: 'GET',
      url: `/api/identity/organization-units/${input.id}/available-users`,
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }

  /**
   * Gets a paginated list of organization units
   */
  getList(input: GetOrganizationUnitInput): Promise<PagedResultDto<OrganizationUnitWithDetailsDto>> {
    return this.restService.request<unknown, PagedResultDto<OrganizationUnitWithDetailsDto>>({
      method: 'GET',
      url: '/api/identity/organization-units',
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }

  /**
   * Gets all organization units without pagination
   */
  getListAll(): Promise<ListResultDto<OrganizationUnitWithDetailsDto>> {
    return this.restService.request<unknown, ListResultDto<OrganizationUnitWithDetailsDto>>({
      method: 'GET',
      url: '/api/identity/organization-units/all',
    });
  }

  /**
   * Gets members of an organization unit
   */
  getMembers(id: string, input: GetIdentityUsersInput): Promise<PagedResultDto<IdentityUserDto>> {
    return this.restService.request<unknown, PagedResultDto<IdentityUserDto>>({
      method: 'GET',
      url: `/api/identity/organization-units/${id}/members`,
      params: {
        filter: input.filter,
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }

  /**
   * Gets roles of an organization unit
   */
  getRoles(id: string, input: PagedAndSortedResultRequestDto): Promise<PagedResultDto<IdentityRoleDto>> {
    return this.restService.request<unknown, PagedResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: `/api/identity/organization-units/${id}/roles`,
      params: {
        sorting: input.sorting,
        skipCount: input.skipCount,
        maxResultCount: input.maxResultCount,
      },
    });
  }

  /**
   * Moves an organization unit to a new parent
   */
  move(id: string, input: OrganizationUnitMoveInput): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'PUT',
      url: `/api/identity/organization-units/${id}/move`,
      body: input,
    });
  }

  /**
   * Removes a member from an organization unit
   */
  removeMember(id: string, memberId: string): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'DELETE',
      url: `/api/identity/organization-units/${id}/members/${memberId}`,
    });
  }

  /**
   * Removes a role from an organization unit
   */
  removeRole(id: string, roleId: string): Promise<void> {
    return this.restService.request<unknown, void>({
      method: 'DELETE',
      url: `/api/identity/organization-units/${id}/roles/${roleId}`,
    });
  }

  /**
   * Updates an organization unit
   */
  update(id: string, input: OrganizationUnitUpdateDto): Promise<OrganizationUnitWithDetailsDto> {
    return this.restService.request<unknown, OrganizationUnitWithDetailsDto>({
      method: 'PUT',
      url: `/api/identity/organization-units/${id}`,
      body: input,
    });
  }
}
