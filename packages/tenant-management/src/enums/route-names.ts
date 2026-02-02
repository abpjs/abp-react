/**
 * Route name keys for the Tenant Management module.
 * These keys are used for route localization and identification.
 * @since 2.7.0
 */
export const eTenantManagementRouteNames = {
  /**
   * Administration menu route name key.
   */
  Administration: 'AbpUiNavigation::Menu:Administration',

  /**
   * Tenant Management menu route name key.
   */
  TenantManagement: 'AbpTenantManagement::Menu:TenantManagement',

  /**
   * Tenants route name key.
   */
  Tenants: 'AbpTenantManagement::Tenants',
} as const;

/**
 * Type for tenant management route name key values
 */
export type TenantManagementRouteNameKey =
  (typeof eTenantManagementRouteNames)[keyof typeof eTenantManagementRouteNames];
