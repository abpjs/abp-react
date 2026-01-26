import { eLayoutType, type ABP } from '@abpjs/core';

/**
 * Account module routes configuration
 *
 * This is the React equivalent of Angular's ACCOUNT_ROUTES constant.
 * These routes are registered with the ABP routing system.
 *
 * Route structure:
 * - /account (invisible, uses account layout)
 *   - /account/login
 *   - /account/register
 *
 * @since 0.9.0 - Changed from array to object with `routes` property
 */
export const ACCOUNT_ROUTES: { routes: ABP.FullRoute[] } = {
  routes: [
    {
      name: 'Account',
      path: 'account',
      invisible: true,
      layout: eLayoutType.application,
      children: [
        {
          path: 'login',
          name: 'Login',
          order: 1,
        },
        {
          path: 'register',
          name: 'Register',
          order: 2,
        },
      ],
    },
  ],
};

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
