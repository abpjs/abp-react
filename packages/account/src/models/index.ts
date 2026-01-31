/**
 * Account module type definitions
 */
import type { ReactNode } from 'react';

// ============================================================================
// Account Namespace - v2.0.0
// ============================================================================

/**
 * Account namespace containing component interface types.
 * Translated from @abp/ng.account v2.0.0 Account namespace.
 *
 * These interfaces define the inputs and outputs for account components,
 * enabling type-safe component customization and extension.
 *
 * @since 2.0.0
 */
export namespace Account {
  /**
   * Inputs for AuthWrapper component
   */
  export interface AuthWrapperComponentInputs {
    /** Main content to render in the auth wrapper */
    readonly mainContentRef?: ReactNode;
    /** Optional cancel/secondary content */
    readonly cancelContentRef?: ReactNode;
  }

  /**
   * Outputs for AuthWrapper component
   */
  export interface AuthWrapperComponentOutputs {
    // No outputs currently defined
  }

  /**
   * Inputs for TenantBox component
   */
  export interface TenantBoxComponentInputs {
    // No inputs currently defined
  }

  /**
   * Outputs for TenantBox component
   */
  export interface TenantBoxComponentOutputs {
    // No outputs currently defined
  }

  /**
   * Inputs for PersonalSettings component
   */
  export interface PersonalSettingsComponentInputs {
    // No inputs currently defined
  }

  /**
   * Outputs for PersonalSettings component
   */
  export interface PersonalSettingsComponentOutputs {
    // No outputs currently defined
  }

  /**
   * Inputs for ChangePassword component
   */
  export interface ChangePasswordComponentInputs {
    // No inputs currently defined
  }

  /**
   * Outputs for ChangePassword component
   */
  export interface ChangePasswordComponentOutputs {
    // No outputs currently defined
  }
}

// ============================================================================
// Core Types
// ============================================================================

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
