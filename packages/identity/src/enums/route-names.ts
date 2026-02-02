/**
 * Route names for the Identity module.
 * These are used for navigation menu items and breadcrumbs.
 * @since 2.7.0
 */
export const eIdentityRouteNames = {
  /**
   * Administration menu item name.
   */
  Administration: 'AbpUiNavigation::Menu:Administration',

  /**
   * Identity Management menu item name.
   */
  IdentityManagement: 'AbpIdentity::Menu:IdentityManagement',

  /**
   * Roles menu item name.
   */
  Roles: 'AbpIdentity::Roles',

  /**
   * Users menu item name.
   */
  Users: 'AbpIdentity::Users',
} as const;

/**
 * Type for identity route name values
 */
export type IdentityRouteNameKey =
  (typeof eIdentityRouteNames)[keyof typeof eIdentityRouteNames];
