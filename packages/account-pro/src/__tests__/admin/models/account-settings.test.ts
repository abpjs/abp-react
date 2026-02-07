import { describe, it, expect } from 'vitest';
import { eTwoFactorBehaviour } from '../../../admin/enums/two-factor-behaviour';
import type {
  AccountSettingsDto,
  AccountLdapSettingsDto,
  AccountTwoFactorSettingsDto,
  AccountCaptchaSettings,
  AccountExternalProviderSetting,
  AccountExternalProviderSettings,
} from '../../../admin/models/account-settings';

describe('admin model interfaces', () => {
  describe('AccountSettingsDto', () => {
    it('should accept valid settings', () => {
      const settings: AccountSettingsDto = {
        isSelfRegistrationEnabled: true,
        enableLocalLogin: true,
      };
      expect(settings.isSelfRegistrationEnabled).toBe(true);
      expect(settings.enableLocalLogin).toBe(true);
    });

    it('should accept false values', () => {
      const settings: AccountSettingsDto = {
        isSelfRegistrationEnabled: false,
        enableLocalLogin: false,
      };
      expect(settings.isSelfRegistrationEnabled).toBe(false);
      expect(settings.enableLocalLogin).toBe(false);
    });
  });

  describe('AccountLdapSettingsDto', () => {
    it('should accept valid LDAP settings', () => {
      const settings: AccountLdapSettingsDto = {
        enableLdapLogin: true,
      };
      expect(settings.enableLdapLogin).toBe(true);
    });
  });

  describe('AccountTwoFactorSettingsDto', () => {
    it('should accept valid two-factor settings', () => {
      const settings: AccountTwoFactorSettingsDto = {
        isTwoFactorEnabled: true,
        twoFactorBehaviour: eTwoFactorBehaviour.Optional,
        isRememberBrowserEnabled: true,
        usersCanChange: false,
      };
      expect(settings.isTwoFactorEnabled).toBe(true);
      expect(settings.twoFactorBehaviour).toBe(eTwoFactorBehaviour.Optional);
      expect(settings.isRememberBrowserEnabled).toBe(true);
      expect(settings.usersCanChange).toBe(false);
    });

    it('should accept all eTwoFactorBehaviour values', () => {
      const settingsOptional: AccountTwoFactorSettingsDto = {
        isTwoFactorEnabled: true,
        twoFactorBehaviour: eTwoFactorBehaviour.Optional,
        isRememberBrowserEnabled: false,
        usersCanChange: true,
      };
      expect(settingsOptional.twoFactorBehaviour).toBe(0);

      const settingsDisabled: AccountTwoFactorSettingsDto = {
        isTwoFactorEnabled: false,
        twoFactorBehaviour: eTwoFactorBehaviour.Disabled,
        isRememberBrowserEnabled: false,
        usersCanChange: false,
      };
      expect(settingsDisabled.twoFactorBehaviour).toBe(1);

      const settingsForced: AccountTwoFactorSettingsDto = {
        isTwoFactorEnabled: true,
        twoFactorBehaviour: eTwoFactorBehaviour.Forced,
        isRememberBrowserEnabled: true,
        usersCanChange: false,
      };
      expect(settingsForced.twoFactorBehaviour).toBe(2);
    });
  });

  describe('AccountCaptchaSettings (v4.0.0)', () => {
    it('should accept valid captcha settings', () => {
      const settings: AccountCaptchaSettings = {
        useCaptchaOnLogin: true,
        useCaptchaOnRegistration: false,
        verifyBaseUrl: 'https://www.google.com/recaptcha/api/siteverify',
        siteKey: 'test-site-key',
        siteSecret: 'test-site-secret',
        version: 3,
      };
      expect(settings.useCaptchaOnLogin).toBe(true);
      expect(settings.useCaptchaOnRegistration).toBe(false);
      expect(settings.verifyBaseUrl).toBe(
        'https://www.google.com/recaptcha/api/siteverify'
      );
      expect(settings.siteKey).toBe('test-site-key');
      expect(settings.siteSecret).toBe('test-site-secret');
      expect(settings.version).toBe(3);
    });
  });

  describe('AccountExternalProviderSetting (v4.0.0)', () => {
    it('should accept valid external provider setting', () => {
      const setting: AccountExternalProviderSetting = {
        name: 'Google',
        enabled: true,
        properties: [{ name: 'ClientId', value: 'google-client-id' }],
        secretProperties: [
          { name: 'ClientSecret', value: 'google-client-secret' },
        ],
      };
      expect(setting.name).toBe('Google');
      expect(setting.enabled).toBe(true);
      expect(setting.properties).toHaveLength(1);
      expect(setting.secretProperties).toHaveLength(1);
    });

    it('should accept optional useHostSettings', () => {
      const setting: AccountExternalProviderSetting = {
        name: 'Microsoft',
        enabled: false,
        properties: [],
        secretProperties: [],
        useHostSettings: true,
      };
      expect(setting.useHostSettings).toBe(true);
    });

    it('should accept setting without useHostSettings', () => {
      const setting: AccountExternalProviderSetting = {
        name: 'Twitter',
        enabled: true,
        properties: [
          { name: 'ConsumerKey', value: 'key' },
          { name: 'ConsumerSecret', value: 'secret' },
        ],
        secretProperties: [],
      };
      expect(setting.useHostSettings).toBeUndefined();
    });
  });

  describe('AccountExternalProviderSettings (v4.0.0)', () => {
    it('should accept settings collection', () => {
      const settings: AccountExternalProviderSettings = {
        settings: [
          {
            name: 'Google',
            enabled: true,
            properties: [{ name: 'ClientId', value: 'id' }],
            secretProperties: [{ name: 'ClientSecret', value: 'secret' }],
          },
          {
            name: 'Microsoft',
            enabled: false,
            properties: [],
            secretProperties: [],
            useHostSettings: true,
          },
        ],
      };
      expect(settings.settings).toHaveLength(2);
      expect(settings.settings[0].name).toBe('Google');
      expect(settings.settings[1].name).toBe('Microsoft');
    });

    it('should accept empty settings array', () => {
      const settings: AccountExternalProviderSettings = {
        settings: [],
      };
      expect(settings.settings).toHaveLength(0);
    });
  });
});
