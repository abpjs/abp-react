/**
 * Tenant Management module route constants
 * Translated from @abp/ng.tenant-management v2.0.0
 *
 * Note: TENANT_MANAGEMENT_ROUTES was deprecated in v0.9.0 and removed in v2.0.0.
 * Use TENANT_MANAGEMENT_ROUTE_PATHS and TENANT_MANAGEMENT_POLICIES instead.
 */

/**
 * Route paths for the tenant management module.
 * Use these constants for programmatic navigation.
 */
export const TENANT_MANAGEMENT_ROUTE_PATHS = {
  /** Base path for tenant management module */
  BASE: '/tenant-management',
  /** Tenants management path */
  TENANTS: '/tenant-management/tenants',
} as const;

/**
 * Required policies for tenant management module routes.
 */
export const TENANT_MANAGEMENT_POLICIES = {
  /** Policy for tenants management */
  TENANTS: 'AbpTenantManagement.Tenants',
  /** Policy for creating tenants */
  TENANTS_CREATE: 'AbpTenantManagement.Tenants.Create',
  /** Policy for updating tenants */
  TENANTS_UPDATE: 'AbpTenantManagement.Tenants.Update',
  /** Policy for deleting tenants */
  TENANTS_DELETE: 'AbpTenantManagement.Tenants.Delete',
  /** Policy for managing connection strings */
  TENANTS_MANAGE_CONNECTION_STRINGS: 'AbpTenantManagement.Tenants.ManageConnectionStrings',
  /** Policy for managing features */
  TENANTS_MANAGE_FEATURES: 'AbpTenantManagement.Tenants.ManageFeatures',
} as const;
