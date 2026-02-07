/* eslint-disable @typescript-eslint/no-namespace */
import { ABP, PagedResultDto } from '@abpjs/core';
import type {
  ClaimTypeDto,
  IdentityRoleDto,
  IdentityUserDto,
  OrganizationUnitWithDetailsDto,
} from '../proxy/identity/models';

/**
 * Identity namespace containing all types related to identity management.
 * Translated from @volo/abp.ng.identity Identity namespace.
 *
 * Pro features include:
 * - Claim type management
 * - User/Role claims management
 * - Organization unit management (v2.9.0)
 * - Security logs (v3.1.0)
 * - User lock functionality (v3.1.0)
 *
 * @since 0.7.2
 * @updated 2.9.0 - Added organization units support
 * @updated 3.1.0 - Added UserLockDurationType enum
 * @updated 3.2.0 - Types deprecated, use proxy/identity/models instead
 * @updated 4.0.0 - Removed deprecated types, State now references proxy types
 */
export namespace Identity {
  /**
   * Identity state shape for state management
   * @updated 4.0.0 - Now references proxy DTOs instead of deprecated types
   */
  export interface State {
    roles: PagedResultDto<IdentityRoleDto>;
    users: PagedResultDto<IdentityUserDto>;
    selectedRole: IdentityRoleDto;
    selectedUser: IdentityUserDto;
    selectedUserRoles: IdentityRoleDto[];
    /** Pro: Paginated claim types response */
    claims: PagedResultDto<ClaimTypeDto>;
    /** Pro: Selected claim type for editing */
    selectedClaim: ClaimTypeDto;
    /** Pro: Organization units (v2.9.0) */
    organizationUnits: PagedResultDto<OrganizationUnitWithDetailsDto>;
  }

  // ========================
  // Deprecated types - To be deleted in v5.0
  // These are kept for backward compatibility with consumers
  // that haven't migrated to proxy/identity/models yet.
  // ========================

  /**
   * Paginated response for roles
   * @deprecated To be deleted in v5.0. Use PagedResultDto<IdentityRoleDto> from proxy/identity/models instead
   */
  export type RoleResponse = ABP.PagedResponse<RoleItem>;

  /**
   * Request payload for creating/updating a role
   * @deprecated To be deleted in v5.0. Use IdentityRoleCreateDto or IdentityRoleUpdateDto from proxy/identity/models instead
   */
  export interface RoleSaveRequest {
    name: string;
    isDefault: boolean;
    isPublic: boolean;
  }

  /**
   * Role item returned from the API
   * @deprecated To be deleted in v5.0. Use IdentityRoleDto from proxy/identity/models instead
   */
  export interface RoleItem extends RoleSaveRequest {
    isStatic: boolean;
    concurrencyStamp: string;
    id: string;
  }

  /**
   * Paginated response for users
   * @deprecated To be deleted in v5.0. Use PagedResultDto<IdentityUserDto> from proxy/identity/models instead
   */
  export type UserResponse = ABP.PagedResponse<UserItem>;

  /**
   * Base user properties
   * @deprecated To be deleted in v5.0. Use IdentityUserCreateOrUpdateDtoBase from proxy/identity/models instead
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
   * @deprecated To be deleted in v5.0. Use IdentityUserDto from proxy/identity/models instead
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
   * @updated 2.9.0 - Added organizationUnitIds
   * @deprecated To be deleted in v5.0. Use IdentityUserCreateDto or IdentityUserUpdateDto from proxy/identity/models instead
   */
  export interface UserSaveRequest extends User {
    password: string;
    roleNames: string[];
    /** Organization unit IDs the user belongs to (v2.9.0) */
    organizationUnitIds: string[];
  }

  /**
   * Request payload for changing a user's password (admin action)
   * @since 2.7.0
   */
  export interface ChangePasswordRequest {
    /** The new password to set */
    newPassword: string;
  }

  // ========================
  // Pro Features: Claims
  // ========================

  /**
   * Simple claim type name for dropdowns
   * Pro feature since 0.7.2
   * @deprecated To be deleted in v5.0. Use ClaimTypeDto from proxy/identity/models instead
   */
  export interface ClaimTypeName {
    name: string;
  }

  /**
   * Full claim type definition
   * Pro feature since 0.7.2
   * @deprecated To be deleted in v5.0. Use ClaimTypeDto from proxy/identity/models instead
   */
  export interface ClaimType {
    /** Optional ID for existing claim types */
    id?: string;
    /** Claim type name (e.g., 'email', 'role') */
    name: string;
    /** Whether this claim is required */
    required: boolean;
    /** Whether this claim type is static (built-in) */
    isStatic: boolean;
    /** Regex pattern for value validation */
    regex: string;
    /** Human-readable description of the regex pattern */
    regexDescription: string;
    /** Claim type description */
    description: string;
    /** Value type: 0=String, 1=Int, 2=Boolean, 3=DateTime */
    valueType: number;
    /** String representation of value type */
    valueTypeAsString?: string;
  }

  /**
   * Claim request for assigning claims to users or roles
   * Pro feature since 0.7.2
   * @deprecated To be deleted in v5.0. Use IdentityUserClaimDto or IdentityRoleClaimDto from proxy/identity/models instead
   */
  export interface ClaimRequest {
    /** User ID (for user claims) */
    userId?: string;
    /** Role ID (for role claims) */
    roleId?: string;
    /** The claim type name */
    claimType: string;
    /** The claim value */
    claimValue: string;
  }

  /**
   * Paginated response for claim types
   * Pro feature since 0.7.2
   * @deprecated To be deleted in v5.0. Use PagedResultDto<ClaimTypeDto> from proxy/identity/models instead
   */
  export type ClaimResponse = ABP.PagedResponse<ClaimType>;

  /**
   * Value type enumeration for claim types
   * Pro feature since 0.7.2
   * @deprecated To be deleted in v5.0. Use IdentityClaimValueType from proxy/identity/identity-claim-value-type.enum instead
   */
  export enum ClaimValueType {
    String = 0,
    Int = 1,
    Boolean = 2,
    DateTime = 3,
  }

  /**
   * User lock duration type enumeration (values in seconds)
   * Used for locking user accounts for a specified duration.
   * @since 3.1.0
   */
  export enum UserLockDurationType {
    Second = 1,
    Minute = 60,
    Hour = 3600,
    Day = 86400,
    Month = 2592000,
    Year = 31536000,
  }
}
