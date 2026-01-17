import { ABP } from '@abpjs/core';

/**
 * Identity namespace containing all types related to identity management.
 * Translated from @abp/ng.identity Identity namespace.
 */
export namespace Identity {
  /**
   * Identity state shape for state management
   */
  export interface State {
    roles: RoleResponse;
    users: UserResponse;
    selectedRole: RoleItem;
    selectedUser: UserItem;
    selectedUserRoles: RoleItem[];
  }

  /**
   * Paginated response for roles
   */
  export type RoleResponse = ABP.PagedResponse<RoleItem>;

  /**
   * Request payload for creating/updating a role
   */
  export interface RoleSaveRequest {
    name: string;
    isDefault: boolean;
    isPublic: boolean;
  }

  /**
   * Role item returned from the API
   */
  export interface RoleItem extends RoleSaveRequest {
    isStatic: boolean;
    concurrencyStamp: string;
    id: string;
  }

  /**
   * Paginated response for users
   */
  export type UserResponse = ABP.PagedResponse<UserItem>;

  /**
   * Base user properties
   */
  export interface User {
    userName: string;
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    twoFactorEnabled: boolean;
    lockoutEnabled: boolean;
  }

  /**
   * User item returned from the API
   */
  export interface UserItem extends User {
    tenantId: string;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    isLockedOut: boolean;
    concurrencyStamp: string;
    id: string;
  }

  /**
   * Request payload for creating/updating a user
   */
  export interface UserSaveRequest extends User {
    password: string;
    roleNames: string[];
  }
}
