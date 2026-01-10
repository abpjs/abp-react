/**
 * Account module type definitions
 */

/**
 * Account module configuration options
 */
export interface AccountOptions {
  /**
   * URL to redirect to after successful login
   * @default '/'
   */
  redirectUrl?: string;
}

/**
 * Login form data structure
 */
export interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

/**
 * Register form data structure
 */
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

/**
 * Tenant selection data
 */
export interface TenantInfo {
  name: string;
}

/**
 * Password flow result
 */
export interface PasswordFlowResult {
  success: boolean;
  error?: string;
}
