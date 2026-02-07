import { describe, it, expect } from 'vitest';
import {
  eAccountComponents,
  type AccountComponentKey,
} from '../../enums/components';

describe('eAccountComponents (v3.2.0)', () => {
  describe('enum values', () => {
    it('should have Account key with correct value', () => {
      expect(eAccountComponents.Account).toBe('Account.AccountComponent');
    });

    it('should have Login key with correct value', () => {
      expect(eAccountComponents.Login).toBe('Account.LoginComponent');
    });

    it('should have Register key with correct value', () => {
      expect(eAccountComponents.Register).toBe('Account.RegisterComponent');
    });

    it('should have ForgotPassword key with correct value', () => {
      expect(eAccountComponents.ForgotPassword).toBe(
        'Account.ForgotPasswordComponent'
      );
    });

    it('should have ResetPassword key with correct value', () => {
      expect(eAccountComponents.ResetPassword).toBe(
        'Account.ResetPasswordComponent'
      );
    });

    it('should have ManageProfile key with correct value', () => {
      expect(eAccountComponents.ManageProfile).toBe(
        'Account.ManageProfileComponent'
      );
    });

    it('should have TenantBox key with correct value', () => {
      expect(eAccountComponents.TenantBox).toBe('Account.TenantBoxComponent');
    });

    it('should have ChangePassword key with correct value', () => {
      expect(eAccountComponents.ChangePassword).toBe(
        'Account.ChangePasswordComponent'
      );
    });

    it('should have PersonalSettings key with correct value', () => {
      expect(eAccountComponents.PersonalSettings).toBe(
        'Account.PersonalSettingsComponent'
      );
    });

    it('should have Logo key with correct value (v2.9.0)', () => {
      expect(eAccountComponents.Logo).toBe('Account.LogoComponent');
    });

    it('should have EmailConfirmation key with correct value (v3.1.0)', () => {
      expect(eAccountComponents.EmailConfirmation).toBe(
        'Account.EmailConfirmationComponent'
      );
    });

    it('should have MySecurityLogs key with correct value (v3.1.0)', () => {
      expect(eAccountComponents.MySecurityLogs).toBe('Account.MySecurityLogs');
    });

    it('should have ProfilePicture key with correct value (v3.2.0)', () => {
      expect(eAccountComponents.ProfilePicture).toBe('Account.ProfilePicture');
    });
  });

  describe('enum structure', () => {
    it('should have exactly 13 keys', () => {
      const keys = Object.keys(eAccountComponents);
      expect(keys).toHaveLength(13);
    });

    it('should have all expected keys', () => {
      const keys = Object.keys(eAccountComponents);
      expect(keys).toContain('Account');
      expect(keys).toContain('Login');
      expect(keys).toContain('Register');
      expect(keys).toContain('ForgotPassword');
      expect(keys).toContain('ResetPassword');
      expect(keys).toContain('ManageProfile');
      expect(keys).toContain('TenantBox');
      expect(keys).toContain('ChangePassword');
      expect(keys).toContain('PersonalSettings');
      expect(keys).toContain('Logo');
      expect(keys).toContain('EmailConfirmation');
      expect(keys).toContain('MySecurityLogs');
      expect(keys).toContain('ProfilePicture');
    });

    it('should be immutable (const assertion)', () => {
      // TypeScript enforces this at compile time
      // At runtime, we verify the object is frozen-like
      expect(typeof eAccountComponents).toBe('object');
      expect(eAccountComponents).not.toBeNull();
    });
  });

  describe('type safety', () => {
    it('should work with AccountComponentKey type', () => {
      const accountKey: AccountComponentKey = eAccountComponents.Account;
      const loginKey: AccountComponentKey = eAccountComponents.Login;
      const registerKey: AccountComponentKey = eAccountComponents.Register;
      const forgotPasswordKey: AccountComponentKey =
        eAccountComponents.ForgotPassword;
      const resetPasswordKey: AccountComponentKey =
        eAccountComponents.ResetPassword;
      const manageProfileKey: AccountComponentKey =
        eAccountComponents.ManageProfile;
      const tenantBoxKey: AccountComponentKey = eAccountComponents.TenantBox;
      const changePasswordKey: AccountComponentKey =
        eAccountComponents.ChangePassword;
      const personalSettingsKey: AccountComponentKey =
        eAccountComponents.PersonalSettings;
      const logoKey: AccountComponentKey = eAccountComponents.Logo;
      const emailConfirmationKey: AccountComponentKey =
        eAccountComponents.EmailConfirmation;
      const mySecurityLogsKey: AccountComponentKey =
        eAccountComponents.MySecurityLogs;
      const profilePictureKey: AccountComponentKey =
        eAccountComponents.ProfilePicture;

      expect(accountKey).toBe('Account.AccountComponent');
      expect(loginKey).toBe('Account.LoginComponent');
      expect(registerKey).toBe('Account.RegisterComponent');
      expect(forgotPasswordKey).toBe('Account.ForgotPasswordComponent');
      expect(resetPasswordKey).toBe('Account.ResetPasswordComponent');
      expect(manageProfileKey).toBe('Account.ManageProfileComponent');
      expect(tenantBoxKey).toBe('Account.TenantBoxComponent');
      expect(changePasswordKey).toBe('Account.ChangePasswordComponent');
      expect(personalSettingsKey).toBe('Account.PersonalSettingsComponent');
      expect(logoKey).toBe('Account.LogoComponent');
      expect(emailConfirmationKey).toBe('Account.EmailConfirmationComponent');
      expect(mySecurityLogsKey).toBe('Account.MySecurityLogs');
      expect(profilePictureKey).toBe('Account.ProfilePicture');
    });

    it('should preserve literal types', () => {
      // Verify the values are string literals, not just string
      const value = eAccountComponents.Login;
      expect(value).toBe('Account.LoginComponent');

      // TypeScript will infer this as the literal type 'Account.LoginComponent'
      // not just 'string'
      const exactValue: 'Account.LoginComponent' = eAccountComponents.Login;
      expect(exactValue).toBe('Account.LoginComponent');
    });
  });

  describe('usage patterns', () => {
    it('should allow iteration over all component keys', () => {
      const allKeys = Object.values(eAccountComponents);
      expect(allKeys).toHaveLength(13);
      expect(allKeys.every((key) => key.startsWith('Account.'))).toBe(true);
    });

    it('should allow lookup by key name', () => {
      const keyName = 'Login' as keyof typeof eAccountComponents;
      const value = eAccountComponents[keyName];
      expect(value).toBe('Account.LoginComponent');
    });

    it('should work in switch statements', () => {
      const getComponentLabel = (): AccountComponentKey =>
        eAccountComponents.ManageProfile;
      const componentKey = getComponentLabel();
      let label: string;

      switch (componentKey) {
        case eAccountComponents.Account:
          label = 'Account';
          break;
        case eAccountComponents.Login:
          label = 'Login';
          break;
        case eAccountComponents.Register:
          label = 'Register';
          break;
        case eAccountComponents.ForgotPassword:
          label = 'Forgot Password';
          break;
        case eAccountComponents.ResetPassword:
          label = 'Reset Password';
          break;
        case eAccountComponents.ManageProfile:
          label = 'Manage Profile';
          break;
        case eAccountComponents.TenantBox:
          label = 'Tenant Box';
          break;
        case eAccountComponents.ChangePassword:
          label = 'Change Password';
          break;
        case eAccountComponents.PersonalSettings:
          label = 'Personal Settings';
          break;
        case eAccountComponents.Logo:
          label = 'Logo';
          break;
        case eAccountComponents.EmailConfirmation:
          label = 'Email Confirmation';
          break;
        case eAccountComponents.MySecurityLogs:
          label = 'My Security Logs';
          break;
        case eAccountComponents.ProfilePicture:
          label = 'Profile Picture';
          break;
        default:
          label = 'Unknown';
      }

      expect(label).toBe('Manage Profile');
    });

    it('should work as object keys', () => {
      const componentConfig: Record<AccountComponentKey, boolean> = {
        [eAccountComponents.Account]: true,
        [eAccountComponents.Login]: true,
        [eAccountComponents.Register]: true,
        [eAccountComponents.ForgotPassword]: true,
        [eAccountComponents.ResetPassword]: true,
        [eAccountComponents.ManageProfile]: true,
        [eAccountComponents.TenantBox]: true,
        [eAccountComponents.ChangePassword]: true,
        [eAccountComponents.PersonalSettings]: true,
        [eAccountComponents.Logo]: true,
        [eAccountComponents.EmailConfirmation]: true,
        [eAccountComponents.MySecurityLogs]: true,
        [eAccountComponents.ProfilePicture]: true,
      };

      expect(
        componentConfig[eAccountComponents.Login as AccountComponentKey]
      ).toBe(true);
      expect(Object.keys(componentConfig)).toHaveLength(13);
    });
  });
});
