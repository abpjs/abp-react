/* eslint-disable @typescript-eslint/no-namespace */
/**
 * @abpjs/account-pro Models
 * Translated from @volo/abp.ng.account v3.2.0
 *
 * @changelog
 * v3.2.0:
 * - Added ProfilePictureInput, ProfilePictureSourceDto
 * - Added AccountTwoFactorSettingsDto
 */

// Config options (v3.0.0)
export * from './config-options';

import { ProfilePictureType } from '../config/enums/profile-picture-type';
import { eTwoFactorBehaviour } from '../config/enums/two-factor-behaviour';

/**
 * Input for setting a profile picture
 * @since 3.2.0
 */
export interface ProfilePictureInput {
  /**
   * The type of profile picture source
   */
  type: ProfilePictureType;

  /**
   * The file bytes for image upload (base64 encoded)
   * Required when type is ProfilePictureType.Image
   */
  fileBytes?: string;
}

/**
 * Profile picture source information
 * @since 3.2.0
 */
export interface ProfilePictureSourceDto {
  /**
   * The type of profile picture source
   */
  type: ProfilePictureType;

  /**
   * The source URL of the profile picture
   * May be a Gravatar URL, blob URL, or empty string depending on type
   */
  source: string;

  /**
   * The file content for download (base64 encoded)
   * Only populated for type=Image when specifically requested
   */
  fileContent?: string;
}

/**
 * Two-factor authentication settings for the account
 * @since 3.2.0
 */
export interface AccountTwoFactorSettingsDto {
  /**
   * Whether two-factor authentication is enabled for the account
   */
  isEnabled: boolean;

  /**
   * The two-factor authentication behaviour policy
   */
  behaviour: eTwoFactorBehaviour;
}

/**
 * Account settings for general configuration
 * @since 3.1.0
 */
export interface AccountSettings {
  /**
   * Whether self-registration is enabled
   */
  isSelfRegistrationEnabled: boolean;

  /**
   * Whether local login is enabled
   */
  enableLocalLogin: boolean;

  /**
   * Whether remember browser option is enabled
   */
  isRememberBrowserEnabled: boolean;
}

/**
 * Account LDAP settings for LDAP authentication configuration
 * @since 3.1.0
 */
export interface AccountLdapSettings {
  /**
   * Whether LDAP login is enabled
   */
  enableLdapLogin: boolean;

  /**
   * LDAP server host address
   */
  ldapServerHost: string;

  /**
   * LDAP server port
   */
  ldapServerPort: string;

  /**
   * LDAP base DC (distinguished name component)
   */
  ldapBaseDc: string;

  /**
   * LDAP username for binding
   */
  ldapUserName: string;

  /**
   * LDAP password for binding
   */
  ldapPassword: string;
}

/**
 * Email confirmation input parameters
 * @since 3.1.0
 */
export interface EmailConfirmationInput {
  /**
   * Email confirmation token
   */
  confirmationToken: string;

  /**
   * User ID
   */
  userId: string;

  /**
   * Tenant ID (optional)
   */
  tenantId?: string;
}

/**
 * Account namespace containing component interface types
 * @since 2.0.0
 */
export namespace Account {
  /**
   * Input props for TenantBox component
   * @since 2.0.0
   */
  export type TenantBoxComponentInputs = Record<string, never>;

  /**
   * Output callbacks for TenantBox component
   * @since 2.0.0
   */
  export type TenantBoxComponentOutputs = Record<string, never>;

  /**
   * Input props for PersonalSettings component
   * @since 2.0.0
   */
  export type PersonalSettingsComponentInputs = Record<string, never>;

  /**
   * Output callbacks for PersonalSettings component
   * @since 2.0.0
   */
  export type PersonalSettingsComponentOutputs = Record<string, never>;

  /**
   * Input props for ChangePassword component
   * @since 2.0.0
   */
  export type ChangePasswordComponentInputs = Record<string, never>;

  /**
   * Output callbacks for ChangePassword component
   * @since 2.0.0
   */
  export type ChangePasswordComponentOutputs = Record<string, never>;
}

/**
 * Password flow result
 */
export interface PasswordFlowResult {
  success: boolean;
  error?: string;
}

/**
 * Configuration options for the account-pro module
 */
export interface AccountOptions {
  /**
   * URL to redirect to after successful login
   * @default '/'
   */
  redirectUrl?: string;

  /**
   * Whether to redirect to login on 401 errors
   */
  redirectToLogin?: boolean;

  /**
   * Custom login URL
   */
  loginUrl?: string;

  /**
   * Custom register URL
   */
  registerUrl?: string;

  /**
   * Enable social logins (Pro feature)
   * @since 0.7.2
   */
  enableSocialLogins?: boolean;

  /**
   * Enable two-factor authentication (Pro feature)
   * @since 0.7.2
   */
  enableTwoFactor?: boolean;

  /**
   * Whether local login (username/password) is enabled
   * When false, only external login providers (social logins) are available
   * @default true
   * @since 2.0.0
   */
  enableLocalLogin?: boolean;
}

/**
 * Form data for the login form
 */
export interface LoginFormData {
  /**
   * Username or email
   */
  username: string;
  
  /**
   * Password
   */
  password: string;
  
  /**
   * Remember me flag
   */
  rememberMe?: boolean;
}

/**
 * Form data for the registration form
 */
export interface RegisterFormData {
  /**
   * Username
   */
  username: string;
  
  /**
   * Email address
   */
  emailAddress: string;
  
  /**
   * Password
   */
  password: string;
  
  /**
   * Application name (optional)
   */
  appName?: string;
}

/**
 * Tenant information returned from tenant lookup
 */
export interface TenantInfo {
  /**
   * Tenant ID
   */
  id: string;
  
  /**
   * Tenant name
   */
  name: string;
  
  /**
   * Whether the tenant is available
   */
  isAvailable?: boolean;
}

/**
 * Request payload for registering a new user
 */
export interface RegisterRequest {
  /**
   * Username
   */
  userName: string;
  
  /**
   * Email address
   */
  emailAddress: string;
  
  /**
   * Password
   */
  password: string;
  
  /**
   * Application name (optional)
   */
  appName?: string;
}

/**
 * Response from user registration
 */
export interface RegisterResponse {
  /**
   * The ID of the newly created user
   */
  id?: string;
  
  /**
   * The username
   */
  userName?: string;
  
  /**
   * The email address
   */
  email?: string;
}

/**
 * Response from tenant lookup
 */
export interface TenantIdResponse {
  /**
   * Whether the tenant was found and is available
   */
  success: boolean;
  
  /**
   * The tenant ID (if found)
   */
  tenantId: string | null;
  
  /**
   * The tenant name (if found)
   */
  name?: string;
  
  /**
   * Whether the tenant is active
   */
  isActive?: boolean;
}

/**
 * Request payload for sending password reset code
 * @since 0.7.2 (Pro feature)
 */
export interface SendPasswordResetCodeRequest {
  /**
   * Email address to send the reset code to
   */
  email: string;
  
  /**
   * Application name (optional)
   */
  appName?: string;
  
  /**
   * Return URL after password reset (optional)
   */
  returnUrl?: string;
  
  /**
   * Return URL hash (optional)
   */
  returnUrlHash?: string;
}

/**
 * Request payload for resetting password
 * @since 0.7.2 (Pro feature)
 */
export interface ResetPasswordRequest {
  /**
   * User ID
   */
  userId: string;
  
  /**
   * Reset token received via email
   */
  resetToken: string;
  
  /**
   * New password
   */
  password: string;
}

/**
 * Form data for forgot password form
 * @since 0.7.2 (Pro feature)
 */
export interface ForgotPasswordFormData {
  /**
   * Email address
   */
  email: string;
}

/**
 * Form data for reset password form
 * @since 0.7.2 (Pro feature)
 */
export interface ResetPasswordFormData {
  /**
   * New password
   */
  password: string;
  
  /**
   * Confirm password
   */
  confirmPassword: string;
}

/**
 * Form data for change password form
 * @since 0.7.2 (Pro feature)
 */
export interface ChangePasswordFormData {
  /**
   * Current password
   */
  currentPassword: string;
  
  /**
   * New password
   */
  newPassword: string;
  
  /**
   * Confirm new password
   */
  confirmNewPassword: string;
}

/**
 * Request payload for changing password
 * @since 0.7.2 (Pro feature)
 */
export interface ChangePasswordRequest {
  /**
   * Current password
   */
  currentPassword: string;
  
  /**
   * New password
   */
  newPassword: string;
}

/**
 * Personal settings form data
 * @since 0.7.2 (Pro feature)
 */
export interface PersonalSettingsFormData {
  /**
   * Username
   */
  userName: string;
  
  /**
   * Email address
   */
  email: string;
  
  /**
   * Name
   */
  name?: string;
  
  /**
   * Surname
   */
  surname?: string;
  
  /**
   * Phone number
   */
  phoneNumber?: string;
}

/**
 * Request payload for updating personal settings
 * @since 0.7.2 (Pro feature)
 */
export interface UpdateProfileRequest {
  /**
   * Username
   */
  userName: string;
  
  /**
   * Email address
   */
  email: string;
  
  /**
   * Name
   */
  name?: string;
  
  /**
   * Surname
   */
  surname?: string;
  
  /**
   * Phone number
   */
  phoneNumber?: string;
}

/**
 * Profile information response
 * @since 0.7.2 (Pro feature)
 * @since 2.4.0 Added phoneNumberConfirmed field
 */
export interface ProfileResponse {
  /**
   * Username
   */
  userName: string;

  /**
   * Email address
   */
  email: string;

  /**
   * Name
   */
  name?: string;

  /**
   * Surname
   */
  surname?: string;

  /**
   * Phone number
   */
  phoneNumber?: string;

  /**
   * Whether the email is confirmed
   */
  isEmailConfirmed?: boolean;

  /**
   * Whether the phone is confirmed
   * @deprecated Use phoneNumberConfirmed instead
   */
  isPhoneNumberConfirmed?: boolean;

  /**
   * Whether the phone number is confirmed
   * @since 2.4.0
   */
  phoneNumberConfirmed?: boolean;

  /**
   * Whether two-factor authentication is enabled
   */
  isTwoFactorEnabled?: boolean;
}
