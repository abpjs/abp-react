/**
 * Route name keys for the Account module config.
 * These keys are used for route localization and identification.
 *
 * @since 3.0.0
 * @deprecated Removed from Angular config/enums in v4.0.0. To be deleted in v5.0.
 * Still available via direct import from config/enums/route-names or enums/route-names.
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
   * EmailConfirmation route name key.
   * @since 3.1.0
   */
  EmailConfirmation: 'AbpAccount::EmailConfirmation',

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

  /**
   * MySecurityLogs route name key.
   * @since 3.1.0
   */
  MySecurityLogs: 'AbpAccount::MySecurityLogs',
} as const;

/**
 * Type for account route name key values
 */
export type AccountRouteNameKey =
  (typeof eAccountRouteNames)[keyof typeof eAccountRouteNames];
