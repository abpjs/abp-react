import type { ListResultDto, PagedResultDto } from '@abpjs/core';
import { RestService } from '@abpjs/core';
import type {
  GetIdentityUsersInput,
  IdentityRoleDto,
  IdentityUserCreateDto,
  IdentityUserDto,
  IdentityUserUpdateDto,
  IdentityUserUpdateRolesDto,
} from './models';

/**
 * Identity User proxy service for user management API calls
 * Translated from @abp/ng.identity v3.2.0
 *
 * @since 3.2.0
 */
export class IdentityUserService {
  private restService: RestService;

  /**
   * The API name used for REST requests.
   */
  apiName = 'default';

  constructor(restService: RestService) {
    this.restService = restService;
  }

  /**
   * Create a new user
   * @param input - The user data to create
   * @returns Promise with the created user
   */
  create = (input: IdentityUserCreateDto): Promise<IdentityUserDto> => {
    return this.restService.request<IdentityUserCreateDto, IdentityUserDto>({
      method: 'POST',
      url: '/api/identity/users',
      body: input,
    });
  };

  /**
   * Delete a user by ID
   * @param id - The user ID to delete
   * @returns Promise that resolves when deletion is complete
   */
  delete = (id: string): Promise<void> => {
    return this.restService.request<void, void>({
      method: 'DELETE',
      url: `/api/identity/users/${id}`,
    });
  };

  /**
   * Find a user by email
   * @param email - The user's email
   * @returns Promise with the user
   */
  findByEmail = (email: string): Promise<IdentityUserDto> => {
    return this.restService.request<void, IdentityUserDto>({
      method: 'GET',
      url: `/api/identity/users/by-email/${email}`,
    });
  };

  /**
   * Find a user by username
   * @param username - The user's username
   * @returns Promise with the user
   */
  findByUsername = (username: string): Promise<IdentityUserDto> => {
    return this.restService.request<void, IdentityUserDto>({
      method: 'GET',
      url: `/api/identity/users/by-username/${username}`,
    });
  };

  /**
   * Get a user by ID
   * @param id - The user ID
   * @returns Promise with the user
   */
  get = (id: string): Promise<IdentityUserDto> => {
    return this.restService.request<void, IdentityUserDto>({
      method: 'GET',
      url: `/api/identity/users/${id}`,
    });
  };

  /**
   * Get all roles that can be assigned to users
   * @returns Promise with assignable roles
   */
  getAssignableRoles = (): Promise<ListResultDto<IdentityRoleDto>> => {
    return this.restService.request<void, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: '/api/identity/users/assignable-roles',
    });
  };

  /**
   * Get users with pagination and filtering
   * @param input - Pagination, sorting, and filter parameters
   * @returns Promise with paginated users
   */
  getList = (input: GetIdentityUsersInput): Promise<PagedResultDto<IdentityUserDto>> => {
    return this.restService.request<void, PagedResultDto<IdentityUserDto>>({
      method: 'GET',
      url: '/api/identity/users',
      params: input,
    });
  };

  /**
   * Get roles assigned to a user
   * @param id - The user ID
   * @returns Promise with the user's roles
   */
  getRoles = (id: string): Promise<ListResultDto<IdentityRoleDto>> => {
    return this.restService.request<void, ListResultDto<IdentityRoleDto>>({
      method: 'GET',
      url: `/api/identity/users/${id}/roles`,
    });
  };

  /**
   * Update a user
   * @param id - The user ID to update
   * @param input - The updated user data
   * @returns Promise with the updated user
   */
  update = (id: string, input: IdentityUserUpdateDto): Promise<IdentityUserDto> => {
    return this.restService.request<IdentityUserUpdateDto, IdentityUserDto>({
      method: 'PUT',
      url: `/api/identity/users/${id}`,
      body: input,
    });
  };

  /**
   * Update a user's roles
   * @param id - The user ID
   * @param input - The new role assignments
   * @returns Promise that resolves when update is complete
   */
  updateRoles = (id: string, input: IdentityUserUpdateRolesDto): Promise<void> => {
    return this.restService.request<IdentityUserUpdateRolesDto, void>({
      method: 'PUT',
      url: `/api/identity/users/${id}/roles`,
      body: input,
    });
  };
}
