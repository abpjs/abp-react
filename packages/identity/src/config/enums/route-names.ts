/**
 * Route names for the Identity module.
 * These are used for navigation menu items and breadcrumbs.
 *
 * @since 2.7.0 - Original location in lib/enums
 * @since 3.0.0 - Moved to config/enums, removed Administration key
 *
 * Note: In v3.0.0, the Administration key was removed from this enum.
 * The Administration menu item is now managed by @abpjs/core or individual modules.
 */
export const eIdentityRouteNames = {
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
