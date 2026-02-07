/* eslint-disable @typescript-eslint/no-namespace */
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
  export type AuthWrapperComponentOutputs = Record<string, never>;

  /**
   * Inputs for TenantBox component
   */
  export type TenantBoxComponentInputs = Record<string, never>;

  /**
   * Outputs for TenantBox component
   */
  export type TenantBoxComponentOutputs = Record<string, never>;

  /**
   * Inputs for PersonalSettings component
   */
  export type PersonalSettingsComponentInputs = Record<string, never>;

  /**
   * Outputs for PersonalSettings component
   */
  export type PersonalSettingsComponentOutputs = Record<string, never>;

  /**
   * Inputs for ChangePassword component
   */
  export type ChangePasswordComponentInputs = Record<string, never>;

  /**
   * Outputs for ChangePassword component
   */
  export type ChangePasswordComponentOutputs = Record<string, never>;
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
 *
 * @since 3.2.0 - Removed twoFactorEnabled property
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
 *
 * @since 2.7.0 - Added name property
 */
export interface TenantIdResponse {
  success: boolean;
  tenantId: string;
  /**
   * The name of the tenant
   * @since 2.7.0
   */
  name?: string;
}
