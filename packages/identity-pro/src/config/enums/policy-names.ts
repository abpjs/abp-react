/**
 * Identity Policy Names
 * Policy names for permission checking in the Identity module.
 * @since 3.0.0
 * @updated 3.1.0 - Added SecurityLogs
 */

/**
 * Identity policy names enum.
 * Used for checking permissions in the identity management module.
 * @since 3.0.0
 * @updated 3.1.0 - Added SecurityLogs
 */
export const eIdentityPolicyNames = {
  IdentityManagement: 'AbpIdentity.Roles || AbpIdentity.Users || AbpIdentity.ClaimTypes || AbpIdentity.OrganizationUnits',
  Roles: 'AbpIdentity.Roles',
  Users: 'AbpIdentity.Users',
  ClaimTypes: 'AbpIdentity.ClaimTypes',
  OrganizationUnits: 'AbpIdentity.OrganizationUnits',
  /** Security logs policy (v3.1.0) */
  SecurityLogs: 'AbpIdentity.SecurityLogs',
} as const;

/**
 * Type for identity policy name values
 */
export type IdentityPolicyNameKey =
  (typeof eIdentityPolicyNames)[keyof typeof eIdentityPolicyNames];
