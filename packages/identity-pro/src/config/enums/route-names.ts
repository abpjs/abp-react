/**
 * Identity Route Names
 * Route names for the Identity module navigation.
 * @since 3.0.0
 */

/**
 * Identity route names enum.
 * Used for localization and navigation configuration.
 *
 * Note: In v3.0.0, the Administration key was removed.
 * Routes are now organized under IdentityManagement.
 *
 * @since 3.0.0
 */
export const eIdentityRouteNames = {
  IdentityManagement: 'AbpIdentity::Menu:IdentityManagement',
  Roles: 'AbpIdentity::Roles',
  Users: 'AbpIdentity::Users',
  ClaimTypes: 'AbpIdentity::ClaimTypes',
  OrganizationUnits: 'AbpIdentity::OrganizationUnits',
} as const;

/**
 * Type for identity route name values
 */
export type IdentityRouteNameKey =
  (typeof eIdentityRouteNames)[keyof typeof eIdentityRouteNames];
