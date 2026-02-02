import { describe, it, expect } from 'vitest';
import {
  eAccountRouteNames,
  type AccountRouteNameKey,
} from '../../enums/route-names';

describe('eAccountRouteNames (v2.7.0)', () => {
  describe('enum values', () => {
    it('should have Account key with correct value', () => {
      expect(eAccountRouteNames.Account).toBe('AbpAccount::Menu:Account');
    });

    it('should have Login key with correct value', () => {
      expect(eAccountRouteNames.Login).toBe('AbpAccount::Login');
    });

    it('should have Register key with correct value', () => {
      expect(eAccountRouteNames.Register).toBe('AbpAccount::Register');
    });

    it('should have ForgotPassword key with correct value', () => {
      expect(eAccountRouteNames.ForgotPassword).toBe(
        'AbpAccount::ForgotPassword'
      );
    });

    it('should have ResetPassword key with correct value', () => {
      expect(eAccountRouteNames.ResetPassword).toBe('AbpAccount::ResetPassword');
    });

    it('should have ManageProfile key with correct value', () => {
      expect(eAccountRouteNames.ManageProfile).toBe(
        'AbpAccount::ManageYourProfile'
      );
    });
  });

  describe('enum structure', () => {
    it('should have exactly 6 keys', () => {
      const keys = Object.keys(eAccountRouteNames);
      expect(keys).toHaveLength(6);
    });

    it('should have all expected keys', () => {
      const keys = Object.keys(eAccountRouteNames);
      expect(keys).toContain('Account');
      expect(keys).toContain('Login');
      expect(keys).toContain('Register');
      expect(keys).toContain('ForgotPassword');
      expect(keys).toContain('ResetPassword');
      expect(keys).toContain('ManageProfile');
    });

    it('should be immutable (const assertion)', () => {
      expect(typeof eAccountRouteNames).toBe('object');
      expect(eAccountRouteNames).not.toBeNull();
    });
  });

  describe('type safety', () => {
    it('should work with AccountRouteNameKey type', () => {
      const accountKey: AccountRouteNameKey = eAccountRouteNames.Account;
      const loginKey: AccountRouteNameKey = eAccountRouteNames.Login;
      const registerKey: AccountRouteNameKey = eAccountRouteNames.Register;
      const forgotPasswordKey: AccountRouteNameKey =
        eAccountRouteNames.ForgotPassword;
      const resetPasswordKey: AccountRouteNameKey =
        eAccountRouteNames.ResetPassword;
      const manageProfileKey: AccountRouteNameKey =
        eAccountRouteNames.ManageProfile;

      expect(accountKey).toBe('AbpAccount::Menu:Account');
      expect(loginKey).toBe('AbpAccount::Login');
      expect(registerKey).toBe('AbpAccount::Register');
      expect(forgotPasswordKey).toBe('AbpAccount::ForgotPassword');
      expect(resetPasswordKey).toBe('AbpAccount::ResetPassword');
      expect(manageProfileKey).toBe('AbpAccount::ManageYourProfile');
    });

    it('should preserve literal types', () => {
      const value = eAccountRouteNames.Login;
      expect(value).toBe('AbpAccount::Login');

      const exactValue: 'AbpAccount::Login' = eAccountRouteNames.Login;
      expect(exactValue).toBe('AbpAccount::Login');
    });
  });

  describe('localization key format', () => {
    it('should use AbpAccount namespace for all keys', () => {
      const allValues = Object.values(eAccountRouteNames);
      expect(allValues.every((v) => v.startsWith('AbpAccount::'))).toBe(true);
    });

    it('should use Menu prefix for menu-related routes', () => {
      expect(eAccountRouteNames.Account).toContain('Menu:');
    });

    it('should use simple format for page routes', () => {
      expect(eAccountRouteNames.Login).toBe('AbpAccount::Login');
      expect(eAccountRouteNames.Register).toBe('AbpAccount::Register');
      expect(eAccountRouteNames.ForgotPassword).toBe(
        'AbpAccount::ForgotPassword'
      );
      expect(eAccountRouteNames.ResetPassword).toBe('AbpAccount::ResetPassword');
    });

    it('should use descriptive name for ManageProfile', () => {
      expect(eAccountRouteNames.ManageProfile).toBe(
        'AbpAccount::ManageYourProfile'
      );
    });
  });

  describe('usage patterns', () => {
    it('should allow iteration over all route name keys', () => {
      const allKeys = Object.values(eAccountRouteNames);
      expect(allKeys).toHaveLength(6);
    });

    it('should allow lookup by key name', () => {
      const keyName = 'Login' as keyof typeof eAccountRouteNames;
      const value = eAccountRouteNames[keyName];
      expect(value).toBe('AbpAccount::Login');
    });

    it('should work in switch statements', () => {
      const getRouteName = (): AccountRouteNameKey =>
        eAccountRouteNames.ForgotPassword;
      const routeName = getRouteName();
      let label: string;

      switch (routeName) {
        case eAccountRouteNames.Account:
          label = 'Account Menu';
          break;
        case eAccountRouteNames.Login:
          label = 'Login Page';
          break;
        case eAccountRouteNames.Register:
          label = 'Register Page';
          break;
        case eAccountRouteNames.ForgotPassword:
          label = 'Forgot Password Page';
          break;
        case eAccountRouteNames.ResetPassword:
          label = 'Reset Password Page';
          break;
        case eAccountRouteNames.ManageProfile:
          label = 'Manage Profile Page';
          break;
        default:
          label = 'Unknown';
      }

      expect(label).toBe('Forgot Password Page');
    });

    it('should work as object keys for route configuration', () => {
      const routeConfig: Record<AccountRouteNameKey, { path: string }> = {
        [eAccountRouteNames.Account]: { path: '/account' },
        [eAccountRouteNames.Login]: { path: '/account/login' },
        [eAccountRouteNames.Register]: { path: '/account/register' },
        [eAccountRouteNames.ForgotPassword]: {
          path: '/account/forgot-password',
        },
        [eAccountRouteNames.ResetPassword]: { path: '/account/reset-password' },
        [eAccountRouteNames.ManageProfile]: { path: '/account/manage' },
      };

      expect(
        routeConfig[eAccountRouteNames.Login as AccountRouteNameKey].path
      ).toBe('/account/login');
      expect(Object.keys(routeConfig)).toHaveLength(6);
    });

    it('should allow mapping to localized strings', () => {
      const localizations: Record<AccountRouteNameKey, string> = {
        [eAccountRouteNames.Account]: 'Account',
        [eAccountRouteNames.Login]: 'Sign In',
        [eAccountRouteNames.Register]: 'Create Account',
        [eAccountRouteNames.ForgotPassword]: 'Forgot your password?',
        [eAccountRouteNames.ResetPassword]: 'Reset password',
        [eAccountRouteNames.ManageProfile]: 'Manage your profile',
      };

      expect(
        localizations[eAccountRouteNames.Register as AccountRouteNameKey]
      ).toBe('Create Account');
    });
  });
});
