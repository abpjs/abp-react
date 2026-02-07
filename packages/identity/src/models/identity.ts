import { PagedResultDto } from '@abpjs/core';
import type { IdentityRoleDto, IdentityUserDto } from '../proxy/identity/models';

/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Identity namespace containing all types related to identity management.
 * Translated from @abp/ng.identity Identity namespace.
 *
 * Changes in v4.0.0:
 * - Removed deprecated legacy types (RoleResponse, RoleSaveRequest, RoleItem,
 *   UserResponse, User, UserItem, UserSaveRequest)
 * - Component interface types now use IdentityRoleDto/IdentityUserDto
 *
 * Changes in v3.2.0:
 * - State now uses PagedResultDto and new proxy DTOs (IdentityRoleDto, IdentityUserDto)
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

  // ========================
  // Component Interface Types (v2.0.0)
  // v4.0.0: Updated to use IdentityRoleDto/IdentityUserDto
  // ========================

  /**
   * Input props for RolesComponent
   * @since 2.0.0
   * @updated 4.0.0 - Callbacks now use IdentityRoleDto instead of RoleItem
   */
  export interface RolesComponentInputs {
    /** Callback when a role is created */
    readonly onRoleCreated?: (role: IdentityRoleDto) => void;
    /** Callback when a role is updated */
    readonly onRoleUpdated?: (role: IdentityRoleDto) => void;
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
   * @updated 4.0.0 - Callbacks now use IdentityUserDto instead of UserItem
   */
  export interface UsersComponentInputs {
    /** Callback when a user is created */
    readonly onUserCreated?: (user: IdentityUserDto) => void;
    /** Callback when a user is updated */
    readonly onUserUpdated?: (user: IdentityUserDto) => void;
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
