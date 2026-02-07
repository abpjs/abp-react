import { describe, it, expect } from 'vitest';
import {
  eAccountRouteNames,
  AccountRouteNameKey,
} from '../../../config/enums/route-names';

describe('eAccountRouteNames (v3.1.0)', () => {
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
      expect(eAccountRouteNames.ForgotPassword).toBe('AbpAccount::ForgotPassword');
    });

    it('should have ResetPassword key with correct value', () => {
      expect(eAccountRouteNames.ResetPassword).toBe('AbpAccount::ResetPassword');
    });

    it('should have ManageProfile key with correct value', () => {
      expect(eAccountRouteNames.ManageProfile).toBe('AbpAccount::ManageYourProfile');
    });

    it('should have EmailConfirmation key with correct value (v3.1.0)', () => {
      expect(eAccountRouteNames.EmailConfirmation).toBe('AbpAccount::EmailConfirmation');
    });

    it('should have MySecurityLogs key with correct value (v3.1.0)', () => {
      expect(eAccountRouteNames.MySecurityLogs).toBe('AbpAccount::MySecurityLogs');
    });
  });

  describe('enum structure', () => {
    it('should be a const object (readonly at compile time)', () => {
      // Note: `as const` makes the object readonly at TypeScript level,
      // not at runtime. The object is not frozen in JavaScript.
      expect(typeof eAccountRouteNames).toBe('object');
      expect(eAccountRouteNames).not.toBeNull();
    });

    it('should have exactly 8 keys', () => {
      const keys = Object.keys(eAccountRouteNames);
      expect(keys).toHaveLength(8);
    });

    it('should contain all expected keys', () => {
      const keys = Object.keys(eAccountRouteNames);
      expect(keys).toContain('Account');
      expect(keys).toContain('Login');
      expect(keys).toContain('Register');
      expect(keys).toContain('ForgotPassword');
      expect(keys).toContain('ResetPassword');
      expect(keys).toContain('ManageProfile');
      expect(keys).toContain('EmailConfirmation');
      expect(keys).toContain('MySecurityLogs');
    });

    it('should have all values be strings', () => {
      Object.values(eAccountRouteNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have all values start with AbpAccount::', () => {
      Object.values(eAccountRouteNames).forEach((value) => {
        expect(value).toMatch(/^AbpAccount::/);
      });
    });
  });

  describe('type safety', () => {
    it('should allow AccountRouteNameKey type assignment', () => {
      const accountKey: AccountRouteNameKey = eAccountRouteNames.Account;
      const loginKey: AccountRouteNameKey = eAccountRouteNames.Login;
      const registerKey: AccountRouteNameKey = eAccountRouteNames.Register;
      const forgotPasswordKey: AccountRouteNameKey = eAccountRouteNames.ForgotPassword;
      const resetPasswordKey: AccountRouteNameKey = eAccountRouteNames.ResetPassword;
      const manageProfileKey: AccountRouteNameKey = eAccountRouteNames.ManageProfile;
      const emailConfirmationKey: AccountRouteNameKey = eAccountRouteNames.EmailConfirmation;
      const mySecurityLogsKey: AccountRouteNameKey = eAccountRouteNames.MySecurityLogs;

      expect(accountKey).toBe('AbpAccount::Menu:Account');
      expect(loginKey).toBe('AbpAccount::Login');
      expect(registerKey).toBe('AbpAccount::Register');
      expect(forgotPasswordKey).toBe('AbpAccount::ForgotPassword');
      expect(resetPasswordKey).toBe('AbpAccount::ResetPassword');
      expect(manageProfileKey).toBe('AbpAccount::ManageYourProfile');
      expect(emailConfirmationKey).toBe('AbpAccount::EmailConfirmation');
      expect(mySecurityLogsKey).toBe('AbpAccount::MySecurityLogs');
    });
  });

  describe('localization key format', () => {
    it('should follow ABP localization key format', () => {
      // ABP localization keys typically follow the pattern: Module::Key or Module::Category:Key
      expect(eAccountRouteNames.Account).toMatch(/^Abp\w+::\w+/);
      expect(eAccountRouteNames.Login).toMatch(/^Abp\w+::\w+/);
    });

    it('should use Menu prefix for menu-related routes', () => {
      expect(eAccountRouteNames.Account).toContain('Menu:');
    });
  });
});
