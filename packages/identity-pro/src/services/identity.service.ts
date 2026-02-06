import { RestService, ABP } from '@abpjs/core';
import { Identity, OrganizationUnitWithDetailsDto } from '../models';

/**
 * Service for managing identity-related API operations.
 * Handles roles, users, and claim types CRUD operations.
 *
 * Pro features include:
 * - Claim type management
 * - User/Role claims management
 *
 * Translated from @volo/abp.ng.identity IdentityService
 * @since 2.0.0
 */
export class IdentityService {
  /**
   * The API name used for REST requests.
   * @since 2.4.0
   */
  apiName = 'default';

  private rest: RestService;

  constructor(rest: RestService) {
    this.rest = rest;
  }

  // ========================
  // Role Operations
  // ========================

  /**
   * Get all roles with optional pagination/filtering (v0.9.0)
   * @param params - Optional query parameters for pagination and filtering
   * @returns Promise with paginated role response
   */
  getRoles(params: ABP.PageQueryParams = {}): Promise<Identity.RoleResponse> {
    return this.rest.request<null, Identity.RoleResponse>({
      method: 'GET',
      url: '/api/identity/roles',
      params,
    });
  }

  /**
   * Get all roles without pagination
   * @since 2.4.0
   * @returns Promise with all roles response
   */
  getAllRoles(): Promise<Identity.RoleResponse> {
    return this.rest.request<null, Identity.RoleResponse>({
      method: 'GET',
      url: '/api/identity/roles/all',
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
   * Get organization units assigned to a user
   * @since 2.9.0
   * @param id - The user ID
   * @returns Promise with the user's organization units
   */
  getUserOrganizationUnits(id: string): Promise<OrganizationUnitWithDetailsDto[]> {
    return this.rest.request<null, OrganizationUnitWithDetailsDto[]>({
      method: 'GET',
      url: `/api/identity/users/${id}/organization-units`,
    });
  }

  /**
   * Change a user's password (admin action)
   * @since 2.7.0
   * @param id - The user ID
   * @param body - The password change request (newPassword required)
   * @returns Promise resolving when complete
   */
  changePassword(id: string, body: Identity.ChangePasswordRequest): Promise<void> {
    return this.rest.request<Identity.ChangePasswordRequest, void>({
      method: 'PUT',
      url: `/api/identity/users/${id}/change-password`,
      body,
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
   * Unlock a locked out user
   * @since 2.2.0
   * @param id - The user ID to unlock
   * @returns Promise resolving when complete
   */
  unlockUser(id: string): Promise<void> {
    return this.rest.request<null, void>({
      method: 'PUT',
      url: `/api/identity/users/${id}/unlock`,
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

  /**
   * Get assignable roles for users
   * @since 3.0.0
   * @returns Promise with roles that can be assigned to users
   */
  getUserAssingableRoles(): Promise<Identity.RoleResponse> {
    return this.rest.request<null, Identity.RoleResponse>({
      method: 'GET',
      url: '/api/identity/users/assignable-roles',
    });
  }

  // ========================
  // Pro: Claim Type Operations
  // ========================

  /**
   * Get claim types available for roles
   * @since 3.0.0
   * @returns Promise with claim type names for roles
   */
  getRolesClaimTypes(): Promise<Identity.ClaimTypeName[]> {
    return this.rest.request<null, Identity.ClaimTypeName[]>({
      method: 'GET',
      url: '/api/identity/roles/available-claim-types',
    });
  }

  /**
   * Get claim types available for users
   * @since 3.0.0
   * @returns Promise with claim type names for users
   */
  getUsersClaimTypes(): Promise<Identity.ClaimTypeName[]> {
    return this.rest.request<null, Identity.ClaimTypeName[]>({
      method: 'GET',
      url: '/api/identity/users/available-claim-types',
    });
  }

  /**
   * Get claim types with pagination
   * Pro feature since 0.7.2
   * @param params - Query parameters for pagination and filtering
   * @returns Promise with paginated claim types response
   */
  getClaimTypes(params: ABP.PageQueryParams = {}): Promise<Identity.ClaimResponse> {
    return this.rest.request<null, Identity.ClaimResponse>({
      method: 'GET',
      url: '/api/identity/claim-types',
      params,
    });
  }

  /**
   * Get a claim type by ID
   * Pro feature since 0.7.2
   * @param id - The claim type ID
   * @returns Promise with the claim type
   */
  getClaimTypeById(id: string): Promise<Identity.ClaimType> {
    return this.rest.request<null, Identity.ClaimType>({
      method: 'GET',
      url: `/api/identity/claim-types/${id}`,
    });
  }

  /**
   * Create a new claim type
   * Pro feature since 0.7.2
   * @param body - The claim type data
   * @returns Promise with the created claim type
   */
  createClaimType(body: Identity.ClaimType): Promise<Identity.ClaimType> {
    return this.rest.request<Identity.ClaimType, Identity.ClaimType>({
      method: 'POST',
      url: '/api/identity/claim-types',
      body,
    });
  }

  /**
   * Update an existing claim type
   * Pro feature since 0.7.2
   * @param body - The claim type data (must include id)
   * @returns Promise with the updated claim type
   */
  updateClaimType(body: Identity.ClaimType): Promise<Identity.ClaimType> {
    return this.rest.request<Identity.ClaimType, Identity.ClaimType>({
      method: 'PUT',
      url: `/api/identity/claim-types/${body.id}`,
      body,
    });
  }

  /**
   * Delete a claim type
   * Pro feature since 0.7.2
   * @param id - The claim type ID to delete
   * @returns Promise resolving when complete
   */
  deleteClaimType(id: string): Promise<void> {
    return this.rest.request<null, void>({
      method: 'DELETE',
      url: `/api/identity/claim-types/${id}`,
    });
  }

  // ========================
  // Pro: User/Role Claims
  // ========================

  /**
   * Get claims for a user or role
   * Pro feature since 0.7.2
   * @param body - Object with id and type ('users' | 'roles')
   * @returns Promise with claim requests
   */
  getClaims(body: { id: string; type: 'roles' | 'users' }): Promise<Identity.ClaimRequest[]> {
    return this.rest.request<null, Identity.ClaimRequest[]>({
      method: 'GET',
      url: `/api/identity/${body.type}/${body.id}/claims`,
    });
  }

  /**
   * Update claims for a user or role
   * Pro feature since 0.7.2
   * @param body - Object with id, type, and claims array
   * @returns Promise resolving when complete
   */
  updateClaims(body: {
    id: string;
    type: 'roles' | 'users';
    claims: Identity.ClaimRequest[];
  }): Promise<void> {
    return this.rest.request<Identity.ClaimRequest[], void>({
      method: 'PUT',
      url: `/api/identity/${body.type}/${body.id}/claims`,
      body: body.claims,
    });
  }
}
