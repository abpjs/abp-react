import { ABP } from '@abpjs/core';
import type { Identity } from '../models';
import { IdentityService } from './identity.service';

/**
 * IdentityStateService - A stateful service facade for identity operations.
 *
 * This service provides a stateful wrapper around IdentityService, maintaining
 * local state for roles and users. It's the React equivalent of Angular's
 * IdentityStateService which wraps NGXS store operations.
 *
 * For most React use cases, prefer using the hooks (useRoles, useUsers, useIdentity)
 * instead of this class. This class is provided for programmatic/non-hook scenarios.
 *
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * import { IdentityStateService, IdentityService } from '@abpjs/identity';
 * import { RestService } from '@abpjs/core';
 *
 * const rest = new RestService();
 * const identityService = new IdentityService(rest);
 * const stateService = new IdentityStateService(identityService);
 *
 * // Fetch and get roles
 * await stateService.dispatchGetRoles();
 * const roles = stateService.getRoles();
 * ```
 */
export class IdentityStateService {
  private identityService: IdentityService;

  // Internal state
  private roles: Identity.RoleItem[] = [];
  private rolesTotalCount: number = 0;
  private users: Identity.UserItem[] = [];
  private usersTotalCount: number = 0;

  constructor(identityService: IdentityService) {
    this.identityService = identityService;
  }

  // ========================
  // State Getters
  // ========================

  /**
   * Get the current roles from state
   */
  getRoles(): Identity.RoleItem[] {
    return this.roles;
  }

  /**
   * Get the total count of roles
   */
  getRolesTotalCount(): number {
    return this.rolesTotalCount;
  }

  /**
   * Get the current users from state
   */
  getUsers(): Identity.UserItem[] {
    return this.users;
  }

  /**
   * Get the total count of users
   */
  getUsersTotalCount(): number {
    return this.usersTotalCount;
  }

  // ========================
  // Role Dispatch Methods
  // ========================

  /**
   * Fetch roles and update internal state
   * @param params - Optional query parameters for pagination/filtering
   */
  async dispatchGetRoles(params?: ABP.PageQueryParams): Promise<Identity.RoleResponse> {
    const response = await this.identityService.getRoles(params);
    this.roles = response.items;
    this.rolesTotalCount = response.totalCount;
    return response;
  }

  /**
   * Fetch a role by ID
   * @param id - The role ID
   */
  async dispatchGetRoleById(id: string): Promise<Identity.RoleItem> {
    return this.identityService.getRoleById(id);
  }

  /**
   * Delete a role and refresh the list
   * @param id - The role ID to delete
   */
  async dispatchDeleteRole(id: string): Promise<Identity.RoleItem> {
    const result = await this.identityService.deleteRole(id);
    // Refresh roles list after deletion
    await this.dispatchGetRoles();
    return result;
  }

  /**
   * Create a new role and refresh the list
   * @param body - The role data to create
   */
  async dispatchCreateRole(body: Identity.RoleSaveRequest): Promise<Identity.RoleItem> {
    const result = await this.identityService.createRole(body);
    // Refresh roles list after creation
    await this.dispatchGetRoles();
    return result;
  }

  /**
   * Update an existing role and refresh the list
   * @param payload - Object containing id and updated role data
   */
  async dispatchUpdateRole(payload: { id: string; body: Identity.RoleSaveRequest }): Promise<Identity.RoleItem> {
    const result = await this.identityService.updateRole(payload.id, payload.body);
    // Refresh roles list after update
    await this.dispatchGetRoles();
    return result;
  }

  // ========================
  // User Dispatch Methods
  // ========================

  /**
   * Fetch users and update internal state
   * @param params - Optional query parameters for pagination/filtering
   */
  async dispatchGetUsers(params?: ABP.PageQueryParams): Promise<Identity.UserResponse> {
    const response = await this.identityService.getUsers(params);
    this.users = response.items;
    this.usersTotalCount = response.totalCount;
    return response;
  }

  /**
   * Fetch a user by ID
   * @param id - The user ID
   */
  async dispatchGetUserById(id: string): Promise<Identity.UserItem> {
    return this.identityService.getUserById(id);
  }

  /**
   * Delete a user and refresh the list
   * @param id - The user ID to delete
   */
  async dispatchDeleteUser(id: string): Promise<void> {
    await this.identityService.deleteUser(id);
    // Refresh users list after deletion
    await this.dispatchGetUsers();
  }

  /**
   * Create a new user and refresh the list
   * @param body - The user data to create
   */
  async dispatchCreateUser(body: Identity.UserSaveRequest): Promise<Identity.UserItem> {
    const result = await this.identityService.createUser(body);
    // Refresh users list after creation
    await this.dispatchGetUsers();
    return result;
  }

  /**
   * Update an existing user and refresh the list
   * @param payload - Object containing id and updated user data
   */
  async dispatchUpdateUser(payload: { id: string; body: Identity.UserSaveRequest }): Promise<Identity.UserItem> {
    const result = await this.identityService.updateUser(payload.id, payload.body);
    // Refresh users list after update
    await this.dispatchGetUsers();
    return result;
  }

  /**
   * Get roles assigned to a user
   * @param id - The user ID
   */
  async dispatchGetUserRoles(id: string): Promise<Identity.RoleResponse> {
    return this.identityService.getUserRoles(id);
  }
}
