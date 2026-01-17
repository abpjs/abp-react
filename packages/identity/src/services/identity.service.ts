import { RestService, ABP } from '@abpjs/core';
import { Identity } from '../models';

/**
 * Service for managing identity-related API operations.
 * Handles roles and users CRUD operations.
 *
 * Translated from @abp/ng.identity IdentityService
 */
export class IdentityService {
  private rest: RestService;

  constructor(rest: RestService) {
    this.rest = rest;
  }

  // ========================
  // Role Operations
  // ========================

  /**
   * Get all roles
   * @returns Promise with paginated role response
   */
  getRoles(): Promise<Identity.RoleResponse> {
    return this.rest.request<null, Identity.RoleResponse>({
      method: 'GET',
      url: '/api/identity/roles',
    });
  }

  /**
   * Get a role by ID
   * @param id - The role ID
   * @returns Promise with the role item
   */
  getRoleById(id: string): Promise<Identity.RoleItem> {
    return this.rest.request<null, Identity.RoleItem>({
      method: 'GET',
      url: `/api/identity/roles/${id}`,
    });
  }

  /**
   * Delete a role
   * @param id - The role ID to delete
   * @returns Promise with the deleted role
   */
  deleteRole(id: string): Promise<Identity.RoleItem> {
    return this.rest.request<null, Identity.RoleItem>({
      method: 'DELETE',
      url: `/api/identity/roles/${id}`,
    });
  }

  /**
   * Create a new role
   * @param body - The role data to create
   * @returns Promise with the created role
   */
  createRole(body: Identity.RoleSaveRequest): Promise<Identity.RoleItem> {
    return this.rest.request<Identity.RoleSaveRequest, Identity.RoleItem>({
      method: 'POST',
      url: '/api/identity/roles',
      body,
    });
  }

  /**
   * Update an existing role
   * @param id - The role ID to update
   * @param body - The updated role data
   * @returns Promise with the updated role
   */
  updateRole(id: string, body: Identity.RoleSaveRequest): Promise<Identity.RoleItem> {
    return this.rest.request<Identity.RoleSaveRequest, Identity.RoleItem>({
      method: 'PUT',
      url: `/api/identity/roles/${id}`,
      body,
    });
  }

  // ========================
  // User Operations
  // ========================

  /**
   * Get users with pagination and filtering
   * @param params - Query parameters for pagination and filtering
   * @returns Promise with paginated user response
   */
  getUsers(params: ABP.PageQueryParams = {}): Promise<Identity.UserResponse> {
    return this.rest.request<null, Identity.UserResponse>({
      method: 'GET',
      url: '/api/identity/users',
      params,
    });
  }

  /**
   * Get a user by ID
   * @param id - The user ID
   * @returns Promise with the user item
   */
  getUserById(id: string): Promise<Identity.UserItem> {
    return this.rest.request<null, Identity.UserItem>({
      method: 'GET',
      url: `/api/identity/users/${id}`,
    });
  }

  /**
   * Get roles assigned to a user
   * @param id - The user ID
   * @returns Promise with the user's roles
   */
  getUserRoles(id: string): Promise<Identity.RoleResponse> {
    return this.rest.request<null, Identity.RoleResponse>({
      method: 'GET',
      url: `/api/identity/users/${id}/roles`,
    });
  }

  /**
   * Delete a user
   * @param id - The user ID to delete
   * @returns Promise resolving when complete
   */
  deleteUser(id: string): Promise<void> {
    return this.rest.request<null, void>({
      method: 'DELETE',
      url: `/api/identity/users/${id}`,
    });
  }

  /**
   * Create a new user
   * @param body - The user data to create
   * @returns Promise with the created user
   */
  createUser(body: Identity.UserSaveRequest): Promise<Identity.UserItem> {
    return this.rest.request<Identity.UserSaveRequest, Identity.UserItem>({
      method: 'POST',
      url: '/api/identity/users',
      body,
    });
  }

  /**
   * Update an existing user
   * @param id - The user ID to update
   * @param body - The updated user data
   * @returns Promise with the updated user
   */
  updateUser(id: string, body: Identity.UserSaveRequest): Promise<Identity.UserItem> {
    return this.rest.request<Identity.UserSaveRequest, Identity.UserItem>({
      method: 'PUT',
      url: `/api/identity/users/${id}`,
      body,
    });
  }
}
