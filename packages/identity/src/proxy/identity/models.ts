import type {
  ExtensibleEntityDto,
  ExtensibleFullAuditedEntityDto,
  ExtensibleObject,
  PagedAndSortedResultRequestDto,
} from '@abpjs/core';

/**
 * Identity Proxy Models
 * Translated from @abp/ng.identity v3.2.0
 *
 * These are the new typed DTOs for identity API operations.
 * @since 3.2.0
 */

// ============================================================================
// Password / Profile Models
// ============================================================================

/**
 * Input for changing password
 * @since 3.2.0
 */
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

/**
 * Profile DTO returned from API
 * @since 3.2.0
 */
export interface ProfileDto extends ExtensibleObject {
  userName: string;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
  isExternal: boolean;
  hasPassword: boolean;
}

/**
 * Input for updating profile
 * @since 3.2.0
 */
export interface UpdateProfileDto extends ExtensibleObject {
  userName: string;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
}

// ============================================================================
// Role Models
// ============================================================================

/**
 * Base DTO for role create/update operations
 * @since 3.2.0
 */
export interface IdentityRoleCreateOrUpdateDtoBase extends ExtensibleObject {
  name: string;
  isDefault: boolean;
  isPublic: boolean;
}

/**
 * DTO for creating a role
 * @since 3.2.0
 */
export type IdentityRoleCreateDto = IdentityRoleCreateOrUpdateDtoBase;

/**
 * DTO for updating a role
 * @since 3.2.0
 */
export interface IdentityRoleUpdateDto extends IdentityRoleCreateOrUpdateDtoBase {
  concurrencyStamp: string;
}

/**
 * Role DTO returned from API
 * @since 3.2.0
 */
export interface IdentityRoleDto extends ExtensibleEntityDto<string> {
  name: string;
  isDefault: boolean;
  isStatic: boolean;
  isPublic: boolean;
  concurrencyStamp: string;
}

// ============================================================================
// User Models
// ============================================================================

/**
 * Input for getting users with pagination and filtering
 * @since 3.2.0
 */
export interface GetIdentityUsersInput extends PagedAndSortedResultRequestDto {
  filter: string;
}

/**
 * Base DTO for user create/update operations
 * @since 3.2.0
 */
export interface IdentityUserCreateOrUpdateDtoBase extends ExtensibleObject {
  userName: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  lockoutEnabled: boolean;
  roleNames: string[];
}

/**
 * DTO for creating a user
 * @since 3.2.0
 */
export interface IdentityUserCreateDto extends IdentityUserCreateOrUpdateDtoBase {
  password: string;
}

/**
 * DTO for updating a user
 * @since 3.2.0
 */
export interface IdentityUserUpdateDto extends IdentityUserCreateOrUpdateDtoBase {
  password: string;
  concurrencyStamp: string;
}

/**
 * DTO for updating user roles
 * @since 3.2.0
 */
export interface IdentityUserUpdateRolesDto {
  roleNames: string[];
}

/**
 * User DTO returned from API
 * @since 3.2.0
 */
export interface IdentityUserDto extends ExtensibleFullAuditedEntityDto<string> {
  tenantId?: string;
  userName: string;
  name: string;
  surname: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  lockoutEnabled: boolean;
  lockoutEnd?: string;
  concurrencyStamp: string;
}

// ============================================================================
// User Lookup Models
// ============================================================================

/**
 * Input for counting users in lookup
 * @since 3.2.0
 */
export interface UserLookupCountInputDto {
  filter: string;
}

/**
 * Input for searching users in lookup
 * @since 3.2.0
 */
export interface UserLookupSearchInputDto extends PagedAndSortedResultRequestDto {
  filter: string;
}
