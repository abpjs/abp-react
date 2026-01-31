/**
 * Account module routes constants
 *
 * @since 2.0.0 - Removed deprecated ACCOUNT_ROUTES (use AccountProvider instead)
 */

/**
 * Default redirect path after login
 */
export const DEFAULT_REDIRECT_URL = '/';

/**
 * Account route paths for easy reference
 */
export const ACCOUNT_PATHS = {
  login: '/account/login',
  register: '/account/register',
} as const;
