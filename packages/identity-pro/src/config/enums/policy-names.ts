/**
 * Identity Policy Names
 * Policy names for permission checking in the Identity module.
 * @since 3.0.0
 */

/**
 * Identity policy names enum.
 * Used for checking permissions in the identity management module.
 * @since 3.0.0
 */
export const eIdentityPolicyNames = {
  IdentityManagement: 'AbpIdentity.Roles || AbpIdentity.Users || AbpIdentity.ClaimTypes || AbpIdentity.OrganizationUnits',
  Roles: 'AbpIdentity.Roles',
  Users: 'AbpIdentity.Users',
  ClaimTypes: 'AbpIdentity.ClaimTypes',
  OrganizationUnits: 'AbpIdentity.OrganizationUnits',
} as const;

/**
 * Type for identity policy name values
 */
export type IdentityPolicyNameKey =
  (typeof eIdentityPolicyNames)[keyof typeof eIdentityPolicyNames];
