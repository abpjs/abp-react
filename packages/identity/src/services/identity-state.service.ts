import type { PagedAndSortedResultRequestDto, PagedResultDto, ListResultDto } from '@abpjs/core';
import type {
  IdentityRoleDto,
  IdentityRoleCreateDto,
  IdentityRoleUpdateDto,
  IdentityUserDto,
  IdentityUserCreateDto,
  IdentityUserUpdateDto,
  GetIdentityUsersInput,
} from '../proxy/identity/models';
import { IdentityRoleService } from '../proxy/identity/identity-role.service';
import { IdentityUserService } from '../proxy/identity/identity-user.service';

/**
 * IdentityStateService - A stateful service facade for identity operations.
 *
 * This service provides a stateful wrapper around the proxy services, maintaining
 * local state for roles and users. It's the React equivalent of Angular's
 * IdentityStateService which wraps NGXS store operations.
 *
 * For most React use cases, prefer using the hooks (useRoles, useUsers, useIdentity)
 * instead of this class. This class is provided for programmatic/non-hook scenarios.
 *
 * @since 2.0.0
 * @updated 4.0.0 - Migrated from deprecated IdentityService to IdentityRoleService/IdentityUserService
 *
 * @example
 * ```typescript
 * import { IdentityStateService, IdentityRoleService, IdentityUserService } from '@abpjs/identity';
 * import { RestService } from '@abpjs/core';
 *
 * const rest = new RestService();
 * const roleService = new IdentityRoleService(rest);
 * const userService = new IdentityUserService(rest);
 * const stateService = new IdentityStateService(roleService, userService);
 *
 * // Fetch and get roles
 * await stateService.dispatchGetRoles();
 * const roles = stateService.getRoles();
 * ```
 */
export class IdentityStateService {
  private identityRoleService: IdentityRoleService;
  private identityUserService: IdentityUserService;

  // Internal state
  private roles: IdentityRoleDto[] = [];
  private rolesTotalCount: number = 0;
  private users: IdentityUserDto[] = [];
  private usersTotalCount: number = 0;

  constructor(identityRoleService: IdentityRoleService, identityUserService: IdentityUserService) {
    this.identityRoleService = identityRoleService;
    this.identityUserService = identityUserService;
  }

  // ========================
  // State Getters
  // ========================

  /**
   * Get the current roles from state
   * @updated 4.0.0 - Returns IdentityRoleDto[] instead of Identity.RoleItem[]
   */
  getRoles(): IdentityRoleDto[] {
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
   * @updated 4.0.0 - Returns IdentityUserDto[] instead of Identity.UserItem[]
   */
  getUsers(): IdentityUserDto[] {
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
   * @param params - Optional pagination/sorting parameters
   */
  async dispatchGetRoles(params?: PagedAndSortedResultRequestDto): Promise<PagedResultDto<IdentityRoleDto>> {
    const response = await this.identityRoleService.getList(params || {} as PagedAndSortedResultRequestDto);
    this.roles = response.items ?? [];
    this.rolesTotalCount = response.totalCount ?? 0;
    return response;
  }

  /**
   * Fetch a role by ID
   * @param id - The role ID
   */
  async dispatchGetRoleById(id: string): Promise<IdentityRoleDto> {
    return this.identityRoleService.get(id);
  }

  /**
   * Delete a role and refresh the list
   * @param id - The role ID to delete
   */
  async dispatchDeleteRole(id: string): Promise<void> {
    await this.identityRoleService.delete(id);
    // Refresh roles list after deletion
    await this.dispatchGetRoles();
  }

  /**
   * Create a new role and refresh the list
   * @param body - The role data to create
   */
  async dispatchCreateRole(body: IdentityRoleCreateDto): Promise<IdentityRoleDto> {
    const result = await this.identityRoleService.create(body);
    // Refresh roles list after creation
    await this.dispatchGetRoles();
    return result;
  }

  /**
   * Update an existing role and refresh the list
   * @param payload - Object containing id and updated role data
   */
  async dispatchUpdateRole(payload: { id: string; body: IdentityRoleUpdateDto }): Promise<IdentityRoleDto> {
    const result = await this.identityRoleService.update(payload.id, payload.body);
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
  async dispatchGetUsers(params?: GetIdentityUsersInput): Promise<PagedResultDto<IdentityUserDto>> {
    const response = await this.identityUserService.getList(params || {} as GetIdentityUsersInput);
    this.users = response.items ?? [];
    this.usersTotalCount = response.totalCount ?? 0;
    return response;
  }

  /**
   * Fetch a user by ID
   * @param id - The user ID
   */
  async dispatchGetUserById(id: string): Promise<IdentityUserDto> {
    return this.identityUserService.get(id);
  }

  /**
   * Delete a user and refresh the list
   * @param id - The user ID to delete
   */
  async dispatchDeleteUser(id: string): Promise<void> {
    await this.identityUserService.delete(id);
    // Refresh users list after deletion
    await this.dispatchGetUsers();
  }

  /**
   * Create a new user and refresh the list
   * @param body - The user data to create
   */
  async dispatchCreateUser(body: IdentityUserCreateDto): Promise<IdentityUserDto> {
    const result = await this.identityUserService.create(body);
    // Refresh users list after creation
    await this.dispatchGetUsers();
    return result;
  }

  /**
   * Update an existing user and refresh the list
   * @param payload - Object containing id and updated user data
   */
  async dispatchUpdateUser(payload: { id: string; body: IdentityUserUpdateDto }): Promise<IdentityUserDto> {
    const result = await this.identityUserService.update(payload.id, payload.body);
    // Refresh users list after update
    await this.dispatchGetUsers();
    return result;
  }

  /**
   * Get roles assigned to a user
   * @param id - The user ID
   */
  async dispatchGetUserRoles(id: string): Promise<ListResultDto<IdentityRoleDto>> {
    return this.identityUserService.getRoles(id);
  }
}
