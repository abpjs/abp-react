import { ABP, PagedResultDto } from '@abpjs/core';
import type { IdentityRoleDto, IdentityUserDto } from '../proxy/identity/models';

/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Identity namespace containing all types related to identity management.
 * Translated from @abp/ng.identity Identity namespace.
 *
 * Changes in v3.2.0:
 * - State now uses PagedResultDto and new proxy DTOs (IdentityRoleDto, IdentityUserDto)
 * - Legacy types (RoleResponse, RoleItem, UserResponse, UserItem, etc.) deprecated
 */
export namespace Identity {
  /**
   * Identity state shape for state management
   * @updated 3.2.0 - Now uses PagedResultDto and new proxy DTOs
   */
  export interface State {
    roles: PagedResultDto<IdentityRoleDto>;
    users: PagedResultDto<IdentityUserDto>;
    selectedRole: IdentityRoleDto;
    selectedUser: IdentityUserDto;
    selectedUserRoles: IdentityRoleDto[];
  }

  // ============================================================================
  // Legacy Types (deprecated in v3.2.0, to be deleted in v4.0)
  // ============================================================================

  /**
   * Paginated response for roles
   * @deprecated To be deleted in v4.0. Use PagedResultDto<IdentityRoleDto> instead.
   */
  export type RoleResponse = ABP.PagedResponse<RoleItem>;

  /**
   * Request payload for creating/updating a role
   * @deprecated To be deleted in v4.0. Use IdentityRoleCreateDto or IdentityRoleUpdateDto instead.
   */
  export interface RoleSaveRequest {
    name: string;
    isDefault: boolean;
    isPublic: boolean;
  }

  /**
   * Role item returned from the API
   * @deprecated To be deleted in v4.0. Use IdentityRoleDto instead.
   */
  export interface RoleItem extends RoleSaveRequest {
    isStatic: boolean;
    concurrencyStamp: string;
    id: string;
  }

  /**
   * Paginated response for users
   * @deprecated To be deleted in v4.0. Use PagedResultDto<IdentityUserDto> instead.
   */
  export type UserResponse = ABP.PagedResponse<UserItem>;

  /**
   * Base user properties
   * @deprecated To be deleted in v4.0. Use IdentityUserCreateOrUpdateDtoBase instead.
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
   * @deprecated To be deleted in v4.0. Use IdentityUserDto instead.
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
   * @deprecated To be deleted in v4.0. Use IdentityUserCreateDto or IdentityUserUpdateDto instead.
   */
  export interface UserSaveRequest extends User {
    password: string;
    roleNames: string[];
  }

  // ========================
  // Component Interface Types (v2.0.0)
  // ========================

  /**
   * Input props for RolesComponent
   * @since 2.0.0
   */
  export interface RolesComponentInputs {
    /** Callback when a role is created */
    readonly onRoleCreated?: (role: RoleItem) => void;
    /** Callback when a role is updated */
    readonly onRoleUpdated?: (role: RoleItem) => void;
    /** Callback when a role is deleted */
    readonly onRoleDeleted?: (id: string) => void;
  }

  /**
   * Output callbacks for RolesComponent
   * @since 2.0.0
   */
  export interface RolesComponentOutputs {
    /** Callback when permission modal visibility changes */
    readonly onVisiblePermissionChange?: (visible: boolean) => void;
  }

  /**
   * Input props for UsersComponent
   * @since 2.0.0
   */
  export interface UsersComponentInputs {
    /** Callback when a user is created */
    readonly onUserCreated?: (user: UserItem) => void;
    /** Callback when a user is updated */
    readonly onUserUpdated?: (user: UserItem) => void;
    /** Callback when a user is deleted */
    readonly onUserDeleted?: (id: string) => void;
    /** Password validation rules to display */
    readonly passwordRulesArr?: ('number' | 'small' | 'capital' | 'special')[];
    /** Required minimum password length */
    readonly requiredPasswordLength?: number;
  }

  /**
   * Output callbacks for UsersComponent
   * @since 2.0.0
   */
  export interface UsersComponentOutputs {
    /** Callback when permission modal visibility changes */
    readonly onVisiblePermissionChange?: (visible: boolean) => void;
  }
}
