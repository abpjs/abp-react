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

// ============================================================================
// New in v0.9.0
// ============================================================================

/**
 * Request body for user registration
 */
export interface RegisterRequest {
  userName: string;
  emailAddress: string;
  password: string;
  appName?: string;
}

/**
 * Response from user registration API
 */
export interface RegisterResponse {
  tenantId: string;
  userName: string;
  name: string;
  surname: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  lockoutEnd: string;
  concurrencyStamp: string;
  isDeleted: boolean;
  deleterId: string;
  deletionTime: string;
  lastModificationTime: string;
  lastModifierId: string;
  creationTime: string;
  creatorId: string;
  id: string;
}

/**
 * Response from tenant lookup API
 */
export interface TenantIdResponse {
  success: boolean;
  tenantId: string;
}
