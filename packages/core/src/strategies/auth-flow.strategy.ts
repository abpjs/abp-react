/**
 * Auth Flow Strategy
 * Translated from @abp/ng.core v3.1.0
 *
 * Provides different authentication flow strategies for OAuth.
 *
 * @since 3.1.0
 */

import { UserManager } from 'oidc-client-ts';

/**
 * Abstract base class for authentication flow strategies
 * @since 3.1.0
 */
export abstract class AuthFlowStrategy {
  /**
   * Whether this strategy uses internal (password) authentication
   */
  abstract readonly isInternalAuth: boolean;

  protected userManager: UserManager | null = null;

  constructor(protected options: { userManager?: UserManager } = {}) {
    this.userManager = options.userManager ?? null;
  }

  /**
   * Check if the current configuration uses internal auth
   */
  abstract checkIfInternalAuth(): boolean;

  /**
   * Initiate the login flow
   */
  abstract login(): Promise<void>;

  /**
   * Perform logout
   */
  abstract logout(): Promise<void>;

  /**
   * Clean up resources
   */
  abstract destroy(): void;

  /**
   * Initialize the authentication flow
   */
  async init(): Promise<void> {
    // Base implementation - override in subclasses if needed
  }

  /**
   * Handle authentication errors
   */
  protected handleError(error: unknown): never {
    console.error('Authentication error:', error);
    throw error;
  }
}

/**
 * Authorization Code Flow Strategy (for external/SSO auth)
 * @since 3.1.0
 */
export class AuthCodeFlowStrategy extends AuthFlowStrategy {
  readonly isInternalAuth = false;

  checkIfInternalAuth(): boolean {
    return false;
  }

  async init(): Promise<void> {
    if (!this.userManager) {
      throw new Error('UserManager is required for AuthCodeFlowStrategy');
    }

    try {
      // Try to silently sign in if there's a valid session
      await this.userManager.signinSilent();
    } catch {
      // Silent sign-in failed, user needs to authenticate
    }
  }

  async login(): Promise<void> {
    if (!this.userManager) {
      throw new Error('UserManager is required for login');
    }

    try {
      await this.userManager.signinRedirect();
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    if (!this.userManager) {
      throw new Error('UserManager is required for logout');
    }

    try {
      await this.userManager.signoutRedirect();
    } catch (error) {
      this.handleError(error);
    }
  }

  destroy(): void {
    // Clean up any resources
    this.userManager = null;
  }
}

/**
 * Password Flow Strategy (for internal/resource owner password auth)
 * @since 3.1.0
 */
export class AuthPasswordFlowStrategy extends AuthFlowStrategy {
  readonly isInternalAuth = true;

  checkIfInternalAuth(): boolean {
    return true;
  }

  async login(): Promise<void> {
    // Password flow login is handled by the login form component
    // This method is a no-op as the actual login is done via REST API
  }

  async logout(): Promise<void> {
    if (this.userManager) {
      try {
        await this.userManager.removeUser();
      } catch (error) {
        this.handleError(error);
      }
    }
  }

  destroy(): void {
    this.userManager = null;
  }
}

/**
 * Factory for creating auth flow strategies
 * @since 3.1.0
 */
export const AUTH_FLOW_STRATEGY = {
  /**
   * Create an Authorization Code Flow strategy
   */
  Code(options?: { userManager?: UserManager }): AuthCodeFlowStrategy {
    return new AuthCodeFlowStrategy(options);
  },

  /**
   * Create a Password Flow strategy
   */
  Password(options?: { userManager?: UserManager }): AuthPasswordFlowStrategy {
    return new AuthPasswordFlowStrategy(options);
  },
} as const;

/**
 * Determine the appropriate auth flow strategy based on OAuth config
 * @param oAuthConfig - The OAuth configuration
 * @returns The appropriate auth flow strategy type
 * @since 3.1.0
 */
export function getAuthFlowType(oAuthConfig: {
  response_type?: string;
}): 'Code' | 'Password' {
  const responseType = oAuthConfig.response_type ?? '';

  // If response_type includes 'code', use authorization code flow
  if (responseType.includes('code')) {
    return 'Code';
  }

  // Default to password flow for resource owner password credentials
  return 'Password';
}
