/**
 * Identity proxy models
 * Translated from @volo/abp.ng.identity/lib/proxy/identity/models
 * @since 3.2.0
 */
import type {
  CreationAuditedEntityDto,
  EntityDto,
  ExtensibleEntityDto,
  ExtensibleFullAuditedEntityDto,
  ExtensibleObject,
  PagedAndSortedResultRequestDto,
  PagedResultRequestDto,
} from '@abpjs/core';
import type { IdentityClaimValueType } from './identity-claim-value-type.enum';

// ========================
// Password and Profile
// ========================

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileDto extends ExtensibleObject {
  userName: string;
  email: string;
  emailConfirmed: boolean;
  name: string;
  surname: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  isExternal: boolean;
  hasPassword: boolean;
}

export interface UpdateProfileDto extends ExtensibleObject {
  userName: string;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
}

// ========================
// Claim Types
// ========================

export interface ClaimTypeDto extends ExtensibleEntityDto<string> {
  name: string;
  required: boolean;
  isStatic: boolean;
  regex: string;
  regexDescription: string;
  description: string;
  valueType: IdentityClaimValueType;
  valueTypeAsString: string;
}

export interface CreateClaimTypeDto extends ExtensibleObject {
  name: string;
  required: boolean;
  regex: string;
  regexDescription: string;
  description: string;
  valueType: IdentityClaimValueType;
}

export interface UpdateClaimTypeDto extends ExtensibleObject {
  name: string;
  required: boolean;
  regex: string;
  regexDescription: string;
  description: string;
  valueType: IdentityClaimValueType;
}

export interface GetIdentityClaimTypesInput extends PagedAndSortedResultRequestDto {
  filter: string;
}

// ========================
// Roles
// ========================

export interface IdentityRoleDto extends ExtensibleEntityDto<string> {
  name: string;
  isDefault: boolean;
  isStatic: boolean;
  isPublic: boolean;
  concurrencyStamp: string;
}

export interface IdentityRoleCreateOrUpdateDtoBase extends ExtensibleObject {
  name: string;
  isDefault: boolean;
  isPublic: boolean;
}

export type IdentityRoleCreateDto = IdentityRoleCreateOrUpdateDtoBase;

export interface IdentityRoleUpdateDto extends IdentityRoleCreateOrUpdateDtoBase {
  concurrencyStamp: string;
}

export interface IdentityRoleClaimDto {
  roleId: string;
  claimType: string;
  claimValue: string;
}

export interface GetIdentityRoleListInput extends PagedAndSortedResultRequestDto {
  filter: string;
}

// ========================
// Users
// ========================

export interface IdentityUserDto extends ExtensibleEntityDto<string> {
  tenantId?: string;
  userName: string;
  email: string;
  name: string;
  surname: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  supportTwoFactor: boolean;
  lockoutEnabled: boolean;
  isLockedOut: boolean;
  concurrencyStamp: string;
}

export interface IdentityUserCreateOrUpdateDtoBase extends ExtensibleObject {
  userName: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  lockoutEnabled: boolean;
  roleNames: string[];
  organizationUnitIds: string[];
}

export interface IdentityUserCreateDto extends IdentityUserCreateOrUpdateDtoBase {
  password: string;
}

export interface IdentityUserUpdateDto extends IdentityUserCreateOrUpdateDtoBase {
  concurrencyStamp: string;
}

export interface IdentityUserClaimDto {
  userId: string;
  claimType: string;
  claimValue: string;
}

export interface IdentityUserUpdatePasswordInput {
  newPassword: string;
}

export interface IdentityUserUpdateRolesDto {
  roleNames: string[];
}

export interface GetIdentityUsersInput extends PagedAndSortedResultRequestDto {
  filter: string;
}

// ========================
// Security Logs
// ========================

export interface IdentitySecurityLogDto extends EntityDto<string> {
  tenantId?: string;
  applicationName: string;
  identity: string;
  action: string;
  userId?: string;
  userName: string;
  tenantName: string;
  clientId: string;
  correlationId: string;
  clientIpAddress: string;
  browserInfo: string;
  creationTime: string;
  extraProperties: Record<string, object>;
}

export interface GetIdentitySecurityLogListInput extends PagedAndSortedResultRequestDto {
  startTime?: string;
  endTime?: string;
  applicationName: string;
  identity: string;
  action: string;
  userName: string;
  clientId: string;
  correlationId: string;
}

// ========================
// Settings
// ========================

export interface IdentityPasswordSettingsDto {
  requiredLength: number;
  requiredUniqueChars: number;
  requireNonAlphanumeric: boolean;
  requireLowercase: boolean;
  requireUppercase: boolean;
  requireDigit: boolean;
}

export interface IdentityLockoutSettingsDto {
  allowedForNewUsers: boolean;
  lockoutDuration: number;
  maxFailedAccessAttempts: number;
}

export interface IdentitySignInSettingsDto {
  requireConfirmedEmail: boolean;
  enablePhoneNumberConfirmation: boolean;
  requireConfirmedPhoneNumber: boolean;
}

export interface IdentityUserSettingsDto {
  isUserNameUpdateEnabled: boolean;
  isEmailUpdateEnabled: boolean;
}

export interface IdentitySettingsDto {
  password: IdentityPasswordSettingsDto;
  lockout: IdentityLockoutSettingsDto;
  signIn: IdentitySignInSettingsDto;
  user: IdentityUserSettingsDto;
}

// ========================
// Organization Units
// ========================

export interface OrganizationUnitCreateOrUpdateDtoBase extends ExtensibleObject {
  displayName: string;
}

export interface OrganizationUnitCreateDto extends OrganizationUnitCreateOrUpdateDtoBase {
  parentId?: string;
}

export type OrganizationUnitUpdateDto = OrganizationUnitCreateOrUpdateDtoBase;

export interface OrganizationUnitRoleDto extends CreationAuditedEntityDto {
  organizationUnitId: string;
  roleId: string;
}

export interface OrganizationUnitDto extends ExtensibleFullAuditedEntityDto<string> {
  parentId?: string;
  code: string;
  displayName: string;
  roles: OrganizationUnitRoleDto[];
}

export interface OrganizationUnitWithDetailsDto extends ExtensibleFullAuditedEntityDto<string> {
  parentId?: string;
  code: string;
  displayName: string;
  roles: IdentityRoleDto[];
}

export interface OrganizationUnitMoveInput {
  newParentId?: string;
}

export interface OrganizationUnitRoleInput {
  roleIds: string[];
}

export interface OrganizationUnitUserInput {
  userIds: string[];
}

export interface GetOrganizationUnitInput extends PagedAndSortedResultRequestDto {
  filter: string;
}

export interface GetAvailableRolesInput extends PagedAndSortedResultRequestDto {
  filter: string;
  id: string;
}

export interface GetAvailableUsersInput extends PagedAndSortedResultRequestDto {
  filter: string;
  id: string;
}

// ========================
// User Lookup
// ========================

export interface UserLookupCountInputDto {
  filter: string;
}

export interface UserLookupSearchInputDto extends PagedResultRequestDto {
  sorting: string;
  filter: string;
}
