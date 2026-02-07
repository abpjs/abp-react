/**
 * Identity Route Names
 * Route names for the Identity module navigation.
 * @since 3.0.0
 * @updated 3.1.0 - Added SecurityLogs
 */

/**
 * Identity route names enum.
 * Used for localization and navigation configuration.
 *
 * Note: In v3.0.0, the Administration key was removed.
 * Routes are now organized under IdentityManagement.
 *
 * @since 3.0.0
 * @updated 3.1.0 - Added SecurityLogs
 */
export const eIdentityRouteNames = {
  IdentityManagement: 'AbpIdentity::Menu:IdentityManagement',
  Roles: 'AbpIdentity::Roles',
  Users: 'AbpIdentity::Users',
  ClaimTypes: 'AbpIdentity::ClaimTypes',
  OrganizationUnits: 'AbpIdentity::OrganizationUnits',
  /** Security logs route name (v3.1.0) */
  SecurityLogs: 'AbpIdentity::SecurityLogs',
} as const;

/**
 * Type for identity route name values
 */
export type IdentityRouteNameKey =
  (typeof eIdentityRouteNames)[keyof typeof eIdentityRouteNames];
