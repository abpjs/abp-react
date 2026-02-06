/**
 * Account configuration options interface.
 * Used for configuring the account module during initialization.
 *
 * @since 3.0.0
 */
export interface AccountConfigOptions {
  /**
   * URL to redirect to after successful login.
   * @default '/'
   */
  redirectUrl?: string;
}
