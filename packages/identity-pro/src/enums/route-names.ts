/**
 * Identity Pro Route Names
 * Translated from @volo/abp.ng.identity v2.7.0
 */

/**
 * Enum-like const object for identity route names.
 * Used for localization and navigation configuration.
 * @since 2.7.0
 */
export const eIdentityRouteNames = {
  Administration: 'AbpUiNavigation::Menu:Administration',
  IdentityManagement: 'AbpIdentity::Menu:IdentityManagement',
  Roles: 'AbpIdentity::Roles',
  Users: 'AbpIdentity::Users',
  ClaimTypes: 'AbpIdentity::ClaimTypes',
} as const;

/**
 * Type for identity route name values
 */
export type IdentityRouteNameKey =
  (typeof eIdentityRouteNames)[keyof typeof eIdentityRouteNames];
