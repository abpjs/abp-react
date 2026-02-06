/**
 * Identity Pro Route Names
 * Translated from @volo/abp.ng.identity v2.9.0
 */

/**
 * Enum-like const object for identity route names.
 * Used for localization and navigation configuration.
 * @since 2.7.0
 * @updated 2.9.0 - Added OrganizationUnits
 */
export const eIdentityRouteNames = {
  Administration: 'AbpUiNavigation::Menu:Administration',
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
