import { describe, it, expect } from 'vitest';
import * as accountProExports from '../index';

describe('package root exports (v3.0.0)', () => {
  describe('config exports (v3.0.0)', () => {
    it('should export eAccountRouteNames from config', () => {
      expect(accountProExports.eAccountRouteNames).toBeDefined();
      expect(typeof accountProExports.eAccountRouteNames).toBe('object');
    });

    it('should export eAccountSettingTabNames', () => {
      expect(accountProExports.eAccountSettingTabNames).toBeDefined();
      expect(typeof accountProExports.eAccountSettingTabNames).toBe('object');
      expect(accountProExports.eAccountSettingTabNames.Account).toBe(
        'AbpAccount::Menu:Account'
      );
    });

    it('should export ACCOUNT_ROUTE_PROVIDERS', () => {
      expect(accountProExports.ACCOUNT_ROUTE_PROVIDERS).toBeDefined();
      expect(typeof accountProExports.ACCOUNT_ROUTE_PROVIDERS).toBe('object');
      expect(
        typeof accountProExports.ACCOUNT_ROUTE_PROVIDERS.configureRoutes
      ).toBe('function');
    });

    it('should export configureRoutes', () => {
      expect(accountProExports.configureRoutes).toBeDefined();
      expect(typeof accountProExports.configureRoutes).toBe('function');
    });

    it('should export initializeAccountRoutes', () => {
      expect(accountProExports.initializeAccountRoutes).toBeDefined();
      expect(typeof accountProExports.initializeAccountRoutes).toBe('function');
    });

    it('should export ACCOUNT_SETTING_TAB_PROVIDERS', () => {
      expect(accountProExports.ACCOUNT_SETTING_TAB_PROVIDERS).toBeDefined();
      expect(typeof accountProExports.ACCOUNT_SETTING_TAB_PROVIDERS).toBe(
        'object'
      );
      expect(
        typeof accountProExports.ACCOUNT_SETTING_TAB_PROVIDERS.configureSettingTabs
      ).toBe('function');
    });

    it('should export configureSettingTabs', () => {
      expect(accountProExports.configureSettingTabs).toBeDefined();
      expect(typeof accountProExports.configureSettingTabs).toBe('function');
    });

    it('should export getSettingTabsService', () => {
      expect(accountProExports.getSettingTabsService).toBeDefined();
      expect(typeof accountProExports.getSettingTabsService).toBe('function');
    });
  });

  describe('tokens exports (v3.0.0)', () => {
    it('should export ACCOUNT_OPTIONS', () => {
      expect(accountProExports.ACCOUNT_OPTIONS).toBeDefined();
      expect(typeof accountProExports.ACCOUNT_OPTIONS).toBe('symbol');
    });

    it('should export DEFAULT_ACCOUNT_OPTIONS', () => {
      expect(accountProExports.DEFAULT_ACCOUNT_OPTIONS).toBeDefined();
      expect(accountProExports.DEFAULT_ACCOUNT_OPTIONS.redirectUrl).toBe('/');
    });
  });

  describe('utils exports (v3.0.0)', () => {
    it('should export accountOptionsFactory', () => {
      expect(accountProExports.accountOptionsFactory).toBeDefined();
      expect(typeof accountProExports.accountOptionsFactory).toBe('function');
    });

    it('should accountOptionsFactory return correct defaults', () => {
      const result = accountProExports.accountOptionsFactory({});
      expect(result.redirectUrl).toBe('/');
    });

    it('should accountOptionsFactory apply custom redirectUrl', () => {
      const result = accountProExports.accountOptionsFactory({
        redirectUrl: '/dashboard',
      });
      expect(result.redirectUrl).toBe('/dashboard');
    });
  });
  describe('enum exports', () => {
    it('should export eAccountComponents', () => {
      expect(accountProExports.eAccountComponents).toBeDefined();
      expect(typeof accountProExports.eAccountComponents).toBe('object');
    });

    it('should export eAccountRouteNames', () => {
      expect(accountProExports.eAccountRouteNames).toBeDefined();
      expect(typeof accountProExports.eAccountRouteNames).toBe('object');
    });

    it('should have all eAccountComponents keys accessible', () => {
      const { eAccountComponents } = accountProExports;
      expect(eAccountComponents.Account).toBe('Account.AccountComponent');
      expect(eAccountComponents.Login).toBe('Account.LoginComponent');
      expect(eAccountComponents.Register).toBe('Account.RegisterComponent');
      expect(eAccountComponents.ForgotPassword).toBe(
        'Account.ForgotPasswordComponent'
      );
      expect(eAccountComponents.ResetPassword).toBe(
        'Account.ResetPasswordComponent'
      );
      expect(eAccountComponents.ManageProfile).toBe(
        'Account.ManageProfileComponent'
      );
      expect(eAccountComponents.TenantBox).toBe('Account.TenantBoxComponent');
      expect(eAccountComponents.ChangePassword).toBe(
        'Account.ChangePasswordComponent'
      );
      expect(eAccountComponents.PersonalSettings).toBe(
        'Account.PersonalSettingsComponent'
      );
      expect(eAccountComponents.Logo).toBe('Account.LogoComponent');
    });

    it('should have all eAccountRouteNames keys accessible', () => {
      const { eAccountRouteNames } = accountProExports;
      expect(eAccountRouteNames.Account).toBe('AbpAccount::Menu:Account');
      expect(eAccountRouteNames.Login).toBe('AbpAccount::Login');
      expect(eAccountRouteNames.Register).toBe('AbpAccount::Register');
      expect(eAccountRouteNames.ForgotPassword).toBe(
        'AbpAccount::ForgotPassword'
      );
      expect(eAccountRouteNames.ResetPassword).toBe('AbpAccount::ResetPassword');
      expect(eAccountRouteNames.ManageProfile).toBe(
        'AbpAccount::ManageYourProfile'
      );
    });
  });

  describe('existing exports preserved', () => {
    it('should still export AccountProService', () => {
      expect(accountProExports.AccountProService).toBeDefined();
    });

    it('should still export useAccountProService', () => {
      expect(accountProExports.useAccountProService).toBeDefined();
    });

    it('should still export AccountProProvider', () => {
      expect(accountProExports.AccountProProvider).toBeDefined();
    });

    it('should still export account routes', () => {
      expect(accountProExports.ACCOUNT_PRO_ROUTES).toBeDefined();
    });
  });

  describe('components exported', () => {
    it('should export LoginForm component', () => {
      expect(accountProExports.LoginForm).toBeDefined();
    });

    it('should export RegisterForm component', () => {
      expect(accountProExports.RegisterForm).toBeDefined();
    });

    it('should export TenantBox component', () => {
      expect(accountProExports.TenantBox).toBeDefined();
    });

    it('should export ForgotPassword component', () => {
      expect(accountProExports.ForgotPassword).toBeDefined();
    });

    it('should export ResetPassword component', () => {
      expect(accountProExports.ResetPassword).toBeDefined();
    });

    it('should export Logo component (v2.9.0)', () => {
      expect(accountProExports.Logo).toBeDefined();
    });

    it('should export Logo with correct componentKey (v2.9.0)', () => {
      expect(accountProExports.Logo.componentKey).toBe('Account.LogoComponent');
    });
  });
});
