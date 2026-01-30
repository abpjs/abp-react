/**
 * @abpjs/account-pro Models
 * Translated from @volo/abp.ng.account v0.7.2
 */

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
   */
  isPhoneNumberConfirmed?: boolean;
  
  /**
   * Whether two-factor authentication is enabled
   */
  isTwoFactorEnabled?: boolean;
}
