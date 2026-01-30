import { eLayoutType, type ABP } from '@abpjs/core';

/**
 * Account Pro module routes configuration
 *
 * This is the React equivalent of Angular's routes from @volo/abp.ng.account.
 * These routes are registered with the ABP routing system.
 *
 * Route structure:
 * - /account (invisible, uses account layout)
 *   - /account/login
 *   - /account/register
 *   - /account/forgot-password (Pro)
 *   - /account/reset-password (Pro)
 *   - /account/manage-profile (Pro)
 *     - /account/manage-profile/change-password
 *     - /account/manage-profile/personal-settings
 *
 * @since 0.7.2
 */
export const ACCOUNT_PRO_ROUTES: { routes: ABP.FullRoute[] } = {
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
        {
          path: 'forgot-password',
          name: 'ForgotPassword',
          order: 3,
        },
        {
          path: 'reset-password',
          name: 'ResetPassword',
          order: 4,
        },
        {
          path: 'manage-profile',
          name: 'ManageProfile',
          order: 5,
          children: [
            {
              path: 'change-password',
              name: 'ChangePassword',
              order: 1,
            },
            {
              path: 'personal-settings',
              name: 'PersonalSettings',
              order: 2,
            },
          ],
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
 * Account Pro route paths for easy reference
 * @since 0.7.2
 */
export const ACCOUNT_PRO_PATHS = {
  login: '/account/login',
  register: '/account/register',
  forgotPassword: '/account/forgot-password',
  resetPassword: '/account/reset-password',
  manageProfile: '/account/manage-profile',
  changePassword: '/account/manage-profile/change-password',
  personalSettings: '/account/manage-profile/personal-settings',
} as const;
