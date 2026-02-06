/**
 * Policy names for Identity module permissions.
 * Used to check authorization for identity management operations.
 *
 * @since 3.0.0
 */
export const eIdentityPolicyNames = {
  /**
   * Combined policy for identity management (Roles OR Users).
   * Use this for the main Identity Management menu item.
   */
  IdentityManagement: 'AbpIdentity.Roles || AbpIdentity.Users',

  /**
   * Policy for role management.
   */
  Roles: 'AbpIdentity.Roles',

  /**
   * Policy for user management.
   */
  Users: 'AbpIdentity.Users',
} as const;

/**
 * Type for identity policy name values
 */
export type IdentityPolicyNameKey =
  (typeof eIdentityPolicyNames)[keyof typeof eIdentityPolicyNames];
