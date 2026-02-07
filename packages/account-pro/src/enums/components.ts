/**
 * Component keys for the Account Pro module.
 * These keys are used for component replacement/customization.
 * @since 2.7.0
 */
export const eAccountComponents = {
  /**
   * Key for the Account component (wrapper/layout component).
   */
  Account: 'Account.AccountComponent',

  /**
   * Key for the Login component.
   */
  Login: 'Account.LoginComponent',

  /**
   * Key for the Register component.
   */
  Register: 'Account.RegisterComponent',

  /**
   * Key for the EmailConfirmation component.
   * @since 3.1.0
   */
  EmailConfirmation: 'Account.EmailConfirmationComponent',

  /**
   * Key for the ForgotPassword component.
   */
  ForgotPassword: 'Account.ForgotPasswordComponent',

  /**
   * Key for the ResetPassword component.
   */
  ResetPassword: 'Account.ResetPasswordComponent',

  /**
   * Key for the ManageProfile component.
   */
  ManageProfile: 'Account.ManageProfileComponent',

  /**
   * Key for the TenantBox component.
   */
  TenantBox: 'Account.TenantBoxComponent',

  /**
   * Key for the ChangePassword component.
   */
  ChangePassword: 'Account.ChangePasswordComponent',

  /**
   * Key for the PersonalSettings component.
   */
  PersonalSettings: 'Account.PersonalSettingsComponent',

  /**
   * Key for the Logo component.
   * @since 2.9.0
   */
  Logo: 'Account.LogoComponent',

  /**
   * Key for the MySecurityLogs component.
   * @since 3.1.0
   */
  MySecurityLogs: 'Account.MySecurityLogs',
} as const;

/**
 * Type for account component key values
 */
export type AccountComponentKey =
  (typeof eAccountComponents)[keyof typeof eAccountComponents];
