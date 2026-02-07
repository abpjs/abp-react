import type { ListResultDto, PagedAndSortedResultRequestDto, PagedResultDto } from '@abpjs/core';
import { RestService } from '@abpjs/core';
import type { IdentityRoleCreateDto, IdentityRoleDto, IdentityRoleUpdateDto } from './models';

/**
 * Identity Role proxy service for role management API calls
 * Translated from @abp/ng.identity v3.2.0
 *
 * @since 3.2.0
 */
export class IdentityRoleService {
  private restService: RestService;

  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(restService: RestService) {
    this.restService = restService;
  }

  /**
   * Create a new role
   * @param input - The role data to create
   * @returns Promise with the created role
   */
  create = (input: IdentityRoleCreateDto): Promise<IdentityRoleDto> => {
    return this.restService.request<IdentityRoleCreateDto, IdentityRoleDto>({
      method: 'POST',
      url: '/api/identity/roles',
      body: input,
    });
  };

  /**
   * Delete a role by ID
   * @param id - The role ID to delete
   * @returns Promise that resolves when deletion is complete
   */
  delete = (id: string): Promise<void> => {
    return this.restService.request<void, void>({
      method: 'DELETE',
      url: `/api/identity/roles/${id}`,
    });
  };

  /**
   * Get a role by ID
   * @param id - The role ID
   * @returns Promise with the role
   */
  get = (id: string): Promise<IdentityRoleDto> => {
    return this.restService.request<void, IdentityRoleDto>({
      method: 'GET',
      url: `/api/identity/roles/${id}`,
    });
  };

  /**
   * Get all roles without pagination
   * @returns Promise with all roles
   */
  getAllList = (): Promise<ListResultDto<IdentityRoleDto>> => {
    return this.restService.request<void, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: '/api/identity/roles/all',
    });
  };

  /**
   * Get roles with pagination
   * @param input - Pagination and sorting parameters
   * @returns Promise with paginated roles
   */
  getList = (input: PagedAndSortedResultRequestDto): Promise<PagedResultDto<IdentityRoleDto>> => {
    return this.restService.request<void, PagedResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: '/api/identity/roles',
      params: input,
    });
  };

  /**
   * Update a role
   * @param id - The role ID to update
   * @param input - The updated role data
   * @returns Promise with the updated role
   */
  update = (id: string, input: IdentityRoleUpdateDto): Promise<IdentityRoleDto> => {
    return this.restService.request<IdentityRoleUpdateDto, IdentityRoleDto>({
      method: 'PUT',
      url: `/api/identity/roles/${id}`,
      body: input,
    });
  };
}
