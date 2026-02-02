/**
 * Component keys for the Tenant Management module.
 * These keys are used for component replacement/customization.
 * @since 2.7.0
 */
export const eTenantManagementComponents = {
  /**
   * Key for the Tenants component.
   * Use this to replace the default TenantsComponent with a custom implementation.
   */
  Tenants: 'TenantManagement.TenantsComponent',
} as const;

/**
 * Type for tenant management component key values
 */
export type TenantManagementComponentKey =
  (typeof eTenantManagementComponents)[keyof typeof eTenantManagementComponents];
