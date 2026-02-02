/**
 * Account component keys for component replacement system
 *
 * These keys are used by ABP's component replacement system to allow
 * customization of account module components.
 *
 * Translated from @abp/ng.account v2.7.0 eAccountComponents enum.
 *
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * import { eAccountComponents } from '@abpjs/account';
 *
 * // Use in component replacement
 * const key = eAccountComponents.Login;
 * ```
 */
export const eAccountComponents = {
  /**
   * Key for the Login component
   */
  Login: 'Account.LoginComponent',

  /**
   * Key for the Register component
   */
  Register: 'Account.RegisterComponent',

  /**
   * Key for the ManageProfile component
   */
  ManageProfile: 'Account.ManageProfileComponent',

  /**
   * Key for the TenantBox component
   */
  TenantBox: 'Account.TenantBoxComponent',

  /**
   * Key for the AuthWrapper component
   */
  AuthWrapper: 'Account.AuthWrapperComponent',

  /**
   * Key for the ChangePassword component
   */
  ChangePassword: 'Account.ChangePasswordComponent',

  /**
   * Key for the PersonalSettings component
   */
  PersonalSettings: 'Account.PersonalSettingsComponent',
} as const;

/**
 * Type for eAccountComponents values
 */
export type eAccountComponents = (typeof eAccountComponents)[keyof typeof eAccountComponents];
