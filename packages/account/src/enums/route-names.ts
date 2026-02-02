/**
 * Account route names for navigation
 *
 * These constants represent localization keys for account route names
 * in the ABP Framework navigation system.
 *
 * Translated from @abp/ng.account v2.7.0 eAccountRouteNames enum.
 *
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * import { eAccountRouteNames } from '@abpjs/account';
 *
 * // Use in route configuration
 * const routeName = eAccountRouteNames.Login;
 * ```
 */
export const eAccountRouteNames = {
  /**
   * Route name for Account menu
   */
  Account: 'AbpAccount::Menu:Account',

  /**
   * Route name for Login page
   */
  Login: 'AbpAccount::Login',

  /**
   * Route name for Register page
   */
  Register: 'AbpAccount::Register',

  /**
   * Route name for Manage Profile page
   */
  ManageProfile: 'AbpAccount::ManageYourProfile',
} as const;

/**
 * Type for eAccountRouteNames values
 */
export type eAccountRouteNames = (typeof eAccountRouteNames)[keyof typeof eAccountRouteNames];
