/**
 * Authentication Flow Guard
 * Translated from @abp/ng.account v3.1.0
 *
 * A route guard that checks if the authentication flow is internal (password-based).
 * If using external auth (SSO/OAuth), it initiates the login flow and blocks navigation.
 *
 * In Angular, this implements CanActivate interface.
 * In React, this is a function that can be used with react-router loaders/guards.
 *
 * @since 3.1.0
 */

/**
 * Authentication flow guard result
 */
export interface AuthenticationFlowGuardResult {
  /**
   * Whether navigation is allowed
   */
  canActivate: boolean;

  /**
   * If navigation is blocked, the reason why
   */
  reason?: 'external_auth' | 'not_configured';
}

/**
 * Options for the authentication flow guard
 */
export interface AuthenticationFlowGuardOptions {
  /**
   * Whether internal authentication is being used.
   * When true, the guard allows navigation.
   * When false, the guard blocks navigation and initiates login.
   */
  isInternalAuth: boolean;

  /**
   * Function to initiate the login flow for external auth
   */
  initLogin: () => void | Promise<void>;
}

/**
 * Check if navigation should be allowed based on auth flow type
 *
 * @param options - The guard options
 * @returns Whether navigation is allowed
 *
 * @example
 * ```tsx
 * // In a route loader
 * export const loader = async () => {
 *   const result = authenticationFlowGuard({
 *     isInternalAuth: true, // or false for SSO
 *     initLogin: () => auth.login(),
 *   });
 *
 *   if (!result.canActivate) {
 *     return redirect('/');
 *   }
 *
 *   return null;
 * };
 * ```
 */
export function authenticationFlowGuard(
  options: AuthenticationFlowGuardOptions
): AuthenticationFlowGuardResult {
  const { isInternalAuth, initLogin } = options;

  // If using internal auth, allow navigation
  if (isInternalAuth) {
    return { canActivate: true };
  }

  // For external auth, initiate login and block navigation
  initLogin();
  return {
    canActivate: false,
    reason: 'external_auth',
  };
}

/**
 * React hook version of AuthenticationFlowGuard
 *
 * This hook can be used in a route component to check auth flow
 * and redirect if needed.
 *
 * @param options - The guard options
 * @returns Whether navigation is allowed
 *
 * @example
 * ```tsx
 * function ProtectedRoute({ children }) {
 *   const auth = useAuth();
 *   const canActivate = useAuthenticationFlowGuard({
 *     isInternalAuth: true,
 *     initLogin: auth.login,
 *   });
 *
 *   if (!canActivate) {
 *     return null; // Login redirect in progress
 *   }
 *
 *   return children;
 * }
 * ```
 */
export function useAuthenticationFlowGuard(
  options: AuthenticationFlowGuardOptions
): boolean {
  const result = authenticationFlowGuard(options);
  return result.canActivate;
}

/**
 * Class-based AuthenticationFlowGuard for Angular-like usage patterns
 *
 * This class provides a similar API to Angular's CanActivate guard.
 *
 * @since 3.1.0
 *
 * @example
 * ```tsx
 * const guard = new AuthenticationFlowGuard(
 *   isInternalAuth,
 *   () => auth.login()
 * );
 *
 * if (!guard.canActivate()) {
 *   // Navigation blocked, login initiated
 * }
 * ```
 */
export class AuthenticationFlowGuard {
  constructor(
    private isInternalAuth: boolean,
    private initLogin: () => void | Promise<void>
  ) {}

  /**
   * Check if navigation should be allowed
   * @returns Whether navigation is allowed
   */
  canActivate(): boolean {
    if (this.isInternalAuth) {
      return true;
    }

    this.initLogin();
    return false;
  }
}

export default AuthenticationFlowGuard;
