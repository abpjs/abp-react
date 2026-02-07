/**
 * Proxy models for permission management
 * Translated from @abp/ng.permission-management v3.2.0
 */

/**
 * Result of getting permissions list
 */
export interface GetPermissionListResultDto {
  entityDisplayName: string;
  groups: PermissionGroupDto[];
}

/**
 * Permission grant information
 */
export interface PermissionGrantInfoDto {
  name: string;
  displayName: string;
  parentName: string;
  isGranted: boolean;
  allowedProviders: string[];
  grantedProviders: ProviderInfoDto[];
}

/**
 * Permission group containing related permissions
 */
export interface PermissionGroupDto {
  name: string;
  displayName: string;
  permissions: PermissionGrantInfoDto[];
}

/**
 * Provider information
 */
export interface ProviderInfoDto {
  providerName: string;
  providerKey: string;
}

/**
 * Single permission update
 */
export interface UpdatePermissionDto {
  name: string;
  isGranted: boolean;
}

/**
 * Batch permission update request
 */
export interface UpdatePermissionsDto {
  permissions: UpdatePermissionDto[];
}
