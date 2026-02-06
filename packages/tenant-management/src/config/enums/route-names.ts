/**
 * Route name keys for the Tenant Management module config.
 * These keys are used for route localization and identification.
 *
 * Note: In v3.0.0, the Administration key was removed from this enum.
 * It now only contains TenantManagement-specific route names.
 *
 * @since 3.0.0
 */
export const eTenantManagementRouteNames = {
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
