/**
 * Two-factor authentication behaviour enum for the Account Pro module.
 * Defines how two-factor authentication is enforced for users.
 * @since 3.2.0
 */
export enum eTwoFactorBehaviour {
  /**
   * Two-factor authentication is optional.
   * Users can choose to enable or disable it.
   */
  Optional = 0,

  /**
   * Two-factor authentication is disabled.
   * Users cannot enable two-factor authentication.
   */
  Disabled = 1,

  /**
   * Two-factor authentication is forced/required.
   * All users must use two-factor authentication.
   */
  Forced = 2,
}
