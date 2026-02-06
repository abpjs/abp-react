/**
 * Route name keys for the Account module config.
 * These keys are used for route localization and identification.
 *
 * @since 3.0.0
 */
export const eAccountRouteNames = {
  /**
   * Account menu route name key.
   */
  Account: 'AbpAccount::Menu:Account',

  /**
   * Login route name key.
   */
  Login: 'AbpAccount::Login',

  /**
   * Register route name key.
   */
  Register: 'AbpAccount::Register',

  /**
   * ForgotPassword route name key.
   */
  ForgotPassword: 'AbpAccount::ForgotPassword',

  /**
   * ResetPassword route name key.
   */
  ResetPassword: 'AbpAccount::ResetPassword',

  /**
   * ManageProfile route name key.
   */
  ManageProfile: 'AbpAccount::ManageYourProfile',
} as const;

/**
 * Type for account route name key values
 */
export type AccountRouteNameKey =
  (typeof eAccountRouteNames)[keyof typeof eAccountRouteNames];
