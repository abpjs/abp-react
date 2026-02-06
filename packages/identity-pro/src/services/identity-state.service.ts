/**
 * Identity State Service
 * Translated from @volo/abp.ng.identity v3.0.0
 *
 * This service provides facade methods for dispatching identity actions.
 * In Angular, this uses NGXS store dispatch. In React, we wrap the API calls.
 *
 * @since 2.0.0
 * @updated 3.0.0 - Removed getClaimTypeNames and dispatchGetClaimTypeNames
 */

import type { RestService, ABP } from '@abpjs/core';
import type { Identity } from '../models';
import { IdentityService } from './identity.service';

/**
 * State service for identity operations.
 * Provides facade methods that mirror the Angular IdentityStateService.
 *
 * Pro features include all dispatch methods for roles, users, and claim types.
 *
 * @since 2.0.0
 * @updated 3.0.0 - Removed claim type names state (use getRolesClaimTypes/getUsersClaimTypes instead)
 */
export class IdentityStateService {
  private identityService: IdentityService;

  // State
  private _roles: Identity.RoleItem[] = [];
  private _rolesTotalCount: number = 0;
  private _users: Identity.UserItem[] = [];
  private _usersTotalCount: number = 0;
  private _claimTypes: Identity.ClaimType[] = [];
  private _claimTypesTotalCount: number = 0;

  constructor(restService: RestService) {
    this.identityService = new IdentityService(restService);
  }

  // ========================
  // Getter Methods
  // ========================

  /**
   * Get the current roles
   */
  getRoles(): Identity.RoleItem[] {
    return this._roles;
  }

  /**
   * Get the total count of roles
   */
  getRolesTotalCount(): number {
    return this._rolesTotalCount;
  }

  /**
   * Get the current users
   */
  getUsers(): Identity.UserItem[] {
    return this._users;
  }

  /**
   * Get the total count of users
   */
  getUsersTotalCount(): number {
    return this._usersTotalCount;
  }

  /**
   * Get the current claim types
   */
  getClaimTypes(): Identity.ClaimType[] {
    return this._claimTypes;
  }

  /**
   * Get the total count of claim types
   */
  getClaimTypesTotalCount(): number {
    return this._claimTypesTotalCount;
  }

  // ========================
  // Role Dispatch Methods (v2.0.0)
  // ========================

  /**
   * Dispatch get roles action
   * @param params Query parameters for fetching roles
   * @returns Promise resolving to the roles response
   * @since 2.0.0
   */
  async dispatchGetRoles(params?: ABP.PageQueryParams): Promise<Identity.RoleResponse> {
    const response = await this.identityService.getRoles(params);
    this._roles = response.items || [];
    this._rolesTotalCount = response.totalCount || 0;
    return response;
  }

  /**
   * Dispatch get role by ID action
   * @param id The role ID
   * @returns Promise resolving to the role item
   * @since 2.0.0
   */
  async dispatchGetRoleById(id: string): Promise<Identity.RoleItem> {
    return this.identityService.getRoleById(id);
  }

  /**
   * Dispatch delete role action
   * @param id The role ID to delete
   * @returns Promise resolving to the deleted role
   * @since 2.0.0
   */
  async dispatchDeleteRole(id: string): Promise<Identity.RoleItem> {
    const result = await this.identityService.deleteRole(id);
    // Refresh roles list after deletion
    await this.dispatchGetRoles();
    return result;
  }

  /**
   * Dispatch create role action
   * @param body The role data to create
   * @returns Promise resolving to the created role
   * @since 2.0.0
   */
  async dispatchCreateRole(body: Identity.RoleSaveRequest): Promise<Identity.RoleItem> {
    const result = await this.identityService.createRole(body);
    // Refresh roles list after creation
    await this.dispatchGetRoles();
    return result;
  }

  /**
   * Dispatch update role action
   * @param id The role ID to update
   * @param body The updated role data
   * @returns Promise resolving to the updated role
   * @since 2.0.0
   */
  async dispatchUpdateRole(id: string, body: Identity.RoleSaveRequest): Promise<Identity.RoleItem> {
    const result = await this.identityService.updateRole(id, body);
    // Refresh roles list after update
    await this.dispatchGetRoles();
    return result;
  }

  // ========================
  // Claim Type Dispatch Methods (v2.0.0)
  // ========================

  /**
   * Dispatch get claim types action
   * @param params Query parameters for fetching claim types
   * @returns Promise resolving to the claim types response
   * @since 2.0.0
   */
  async dispatchGetClaimTypes(params?: ABP.PageQueryParams): Promise<Identity.ClaimResponse> {
    const response = await this.identityService.getClaimTypes(params);
    this._claimTypes = response.items || [];
    this._claimTypesTotalCount = response.totalCount || 0;
    return response;
  }

  /**
   * Dispatch get claim type by ID action
   * @param id The claim type ID
   * @returns Promise resolving to the claim type
   * @since 2.0.0
   */
  async dispatchGetClaimTypeById(id: string): Promise<Identity.ClaimType> {
    return this.identityService.getClaimTypeById(id);
  }

  /**
   * Dispatch delete claim type action
   * @param id The claim type ID to delete
   * @returns Promise resolving when complete
   * @since 2.0.0
   */
  async dispatchDeleteClaimType(id: string): Promise<void> {
    await this.identityService.deleteClaimType(id);
    // Refresh claim types list after deletion
    await this.dispatchGetClaimTypes();
  }

  /**
   * Dispatch create claim type action
   * @param body The claim type data to create
   * @returns Promise resolving to the created claim type
   * @since 2.0.0
   */
  async dispatchCreateClaimType(body: Identity.ClaimType): Promise<Identity.ClaimType> {
    const result = await this.identityService.createClaimType(body);
    // Refresh claim types list after creation
    await this.dispatchGetClaimTypes();
    return result;
  }

  /**
   * Dispatch update claim type action
   * @param body The claim type data to update
   * @returns Promise resolving to the updated claim type
   * @since 2.0.0
   */
  async dispatchUpdateClaimType(body: Identity.ClaimType): Promise<Identity.ClaimType> {
    const result = await this.identityService.updateClaimType(body);
    // Refresh claim types list after update
    await this.dispatchGetClaimTypes();
    return result;
  }

  // ========================
  // User Dispatch Methods (v2.0.0)
  // ========================

  /**
   * Dispatch get users action
   * @param params Query parameters for fetching users
   * @returns Promise resolving to the users response
   * @since 2.0.0
   */
  async dispatchGetUsers(params?: ABP.PageQueryParams): Promise<Identity.UserResponse> {
    const response = await this.identityService.getUsers(params);
    this._users = response.items || [];
    this._usersTotalCount = response.totalCount || 0;
    return response;
  }

  /**
   * Dispatch get user by ID action
   * @param id The user ID
   * @returns Promise resolving to the user item
   * @since 2.0.0
   */
  async dispatchGetUserById(id: string): Promise<Identity.UserItem> {
    return this.identityService.getUserById(id);
  }

  /**
   * Dispatch delete user action
   * @param id The user ID to delete
   * @returns Promise resolving when complete
   * @since 2.0.0
   */
  async dispatchDeleteUser(id: string): Promise<void> {
    await this.identityService.deleteUser(id);
    // Refresh users list after deletion
    await this.dispatchGetUsers();
  }

  /**
   * Dispatch create user action
   * @param body The user data to create
   * @returns Promise resolving to the created user
   * @since 2.0.0
   */
  async dispatchCreateUser(body: Identity.UserSaveRequest): Promise<Identity.UserItem> {
    const result = await this.identityService.createUser(body);
    // Refresh users list after creation
    await this.dispatchGetUsers();
    return result;
  }

  /**
   * Dispatch update user action
   * @param id The user ID to update
   * @param body The updated user data
   * @returns Promise resolving to the updated user
   * @since 2.0.0
   */
  async dispatchUpdateUser(id: string, body: Identity.UserSaveRequest): Promise<Identity.UserItem> {
    const result = await this.identityService.updateUser(id, body);
    // Refresh users list after update
    await this.dispatchGetUsers();
    return result;
  }

  /**
   * Dispatch get user roles action
   * @param id The user ID
   * @returns Promise resolving to the user's roles
   * @since 2.0.0
   */
  async dispatchGetUserRoles(id: string): Promise<Identity.RoleItem[]> {
    const response = await this.identityService.getUserRoles(id);
    return response.items || [];
  }
}
