import { describe, it, expect } from 'vitest';
import * as accountProExports from '../index';

describe('package root exports (v2.9.0)', () => {
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
