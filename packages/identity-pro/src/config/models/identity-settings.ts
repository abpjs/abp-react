/**
 * Identity Settings Models
 * Models for identity settings configuration.
 * @since 3.0.0
 */

/**
 * Identity settings structure containing all identity-related settings.
 */
export interface Settings {
  password: Password;
  lockout: Lockout;
  signIn: SignIn;
  user: User;
}

/**
 * Lockout settings for user account lockout behavior.
 */
export interface Lockout {
  allowedForNewUsers: boolean;
  lockoutDuration: number;
  maxFailedAccessAttempts: number;
}

/**
 * Password settings for password validation rules.
 */
export interface Password {
  requiredLength: number;
  requiredUniqueChars: number;
  requireNonAlphanumeric: boolean;
  requireLowercase: boolean;
  requireUppercase: boolean;
  requireDigit: boolean;
}

/**
 * Sign-in settings for login behavior.
 */
export interface SignIn {
  requireConfirmedEmail: boolean;
  enablePhoneNumberConfirmation: boolean;
  requireConfirmedPhoneNumber: boolean;
}

/**
 * User settings for user profile behavior.
 */
export interface User {
  isUserNameUpdateEnabled: boolean;
  isEmailUpdateEnabled: boolean;
}
