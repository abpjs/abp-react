/**
 * Policy name keys for the Tenant Management module.
 * These keys are used for permission/policy checks.
 *
 * @since 3.0.0
 */
export const eTenantManagementPolicyNames = {
  /**
   * Tenant Management policy name key.
   * Used for the main tenant management permission.
   */
  TenantManagement: 'AbpTenantManagement.Tenants',

  /**
   * Tenants policy name key.
   * Used for tenant-specific permissions.
   */
  Tenants: 'AbpTenantManagement.Tenants',
} as const;

/**
 * Type for tenant management policy name key values
 */
export type TenantManagementPolicyNameKey =
  (typeof eTenantManagementPolicyNames)[keyof typeof eTenantManagementPolicyNames];
