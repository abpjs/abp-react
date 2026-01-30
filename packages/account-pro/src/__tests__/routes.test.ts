import { describe, it, expect } from 'vitest';
import { ACCOUNT_PRO_ROUTES, ACCOUNT_PRO_PATHS, DEFAULT_REDIRECT_URL } from '../routes';

describe('Routes', () => {
  describe('ACCOUNT_PRO_ROUTES', () => {
    it('should have routes array', () => {
      expect(ACCOUNT_PRO_ROUTES.routes).toBeDefined();
      expect(Array.isArray(ACCOUNT_PRO_ROUTES.routes)).toBe(true);
      expect(ACCOUNT_PRO_ROUTES.routes.length).toBeGreaterThan(0);
    });

    it('should have account as root route', () => {
      const accountRoute = ACCOUNT_PRO_ROUTES.routes[0];
      expect(accountRoute.path).toBe('account');
      expect(accountRoute.name).toBe('Account');
      expect(accountRoute.invisible).toBe(true);
    });

    it('should have login, register, and forgot-password routes', () => {
      const accountRoute = ACCOUNT_PRO_ROUTES.routes[0];
      const children = accountRoute.children || [];

      const loginRoute = children.find((r) => r.path === 'login');
      const registerRoute = children.find((r) => r.path === 'register');
      const forgotPasswordRoute = children.find((r) => r.path === 'forgot-password');
      const resetPasswordRoute = children.find((r) => r.path === 'reset-password');
      const manageProfileRoute = children.find((r) => r.path === 'manage-profile');

      expect(loginRoute).toBeDefined();
      expect(registerRoute).toBeDefined();
      expect(forgotPasswordRoute).toBeDefined();
      expect(resetPasswordRoute).toBeDefined();
      expect(manageProfileRoute).toBeDefined();
    });

    it('should have manage-profile children', () => {
      const accountRoute = ACCOUNT_PRO_ROUTES.routes[0];
      const children = accountRoute.children || [];
      const manageProfileRoute = children.find((r) => r.path === 'manage-profile');

      expect(manageProfileRoute?.children).toBeDefined();
      const profileChildren = manageProfileRoute?.children || [];

      const changePasswordRoute = profileChildren.find((r) => r.path === 'change-password');
      const personalSettingsRoute = profileChildren.find((r) => r.path === 'personal-settings');

      expect(changePasswordRoute).toBeDefined();
      expect(personalSettingsRoute).toBeDefined();
    });
  });

  describe('ACCOUNT_PRO_PATHS', () => {
    it('should have all path constants', () => {
      expect(ACCOUNT_PRO_PATHS.login).toBe('/account/login');
      expect(ACCOUNT_PRO_PATHS.register).toBe('/account/register');
      expect(ACCOUNT_PRO_PATHS.forgotPassword).toBe('/account/forgot-password');
      expect(ACCOUNT_PRO_PATHS.resetPassword).toBe('/account/reset-password');
      expect(ACCOUNT_PRO_PATHS.manageProfile).toBe('/account/manage-profile');
      expect(ACCOUNT_PRO_PATHS.changePassword).toBe('/account/manage-profile/change-password');
      expect(ACCOUNT_PRO_PATHS.personalSettings).toBe('/account/manage-profile/personal-settings');
    });
  });

  describe('DEFAULT_REDIRECT_URL', () => {
    it('should be root path', () => {
      expect(DEFAULT_REDIRECT_URL).toBe('/');
    });
  });
});
