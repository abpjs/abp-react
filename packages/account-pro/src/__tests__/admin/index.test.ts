import { describe, it, expect } from 'vitest';
import * as adminExports from '../../admin/index';

describe('admin barrel exports (v4.0.0)', () => {
  describe('abstracts', () => {
    it('should export AbstractAccountSettingsService', () => {
      expect(adminExports.AbstractAccountSettingsService).toBeDefined();
      expect(typeof adminExports.AbstractAccountSettingsService).toBe('function');
    });

    it('should export useAccountSettings', () => {
      expect(adminExports.useAccountSettings).toBeDefined();
      expect(typeof adminExports.useAccountSettings).toBe('function');
    });
  });

  describe('components', () => {
    it('should export useAccountSettingsComponent', () => {
      expect(adminExports.useAccountSettingsComponent).toBeDefined();
      expect(typeof adminExports.useAccountSettingsComponent).toBe('function');
    });

    it('should export useAccountSettingsTwoFactor', () => {
      expect(adminExports.useAccountSettingsTwoFactor).toBeDefined();
      expect(typeof adminExports.useAccountSettingsTwoFactor).toBe('function');
    });

    it('should export useAccountSettingsCaptcha', () => {
      expect(adminExports.useAccountSettingsCaptcha).toBeDefined();
      expect(typeof adminExports.useAccountSettingsCaptcha).toBe('function');
    });

    it('should export useAccountSettingsExternalProvider', () => {
      expect(adminExports.useAccountSettingsExternalProvider).toBeDefined();
      expect(typeof adminExports.useAccountSettingsExternalProvider).toBe(
        'function'
      );
    });
  });

  describe('services', () => {
    it('should export AccountSettingsService', () => {
      expect(adminExports.AccountSettingsService).toBeDefined();
      expect(typeof adminExports.AccountSettingsService).toBe('function');
    });

    it('should export AccountLdapService', () => {
      expect(adminExports.AccountLdapService).toBeDefined();
      expect(typeof adminExports.AccountLdapService).toBe('function');
    });

    it('should export AccountTwoFactorSettingService', () => {
      expect(adminExports.AccountTwoFactorSettingService).toBeDefined();
      expect(typeof adminExports.AccountTwoFactorSettingService).toBe('function');
    });

    it('should export AccountCaptchaService (v4.0.0)', () => {
      expect(adminExports.AccountCaptchaService).toBeDefined();
      expect(typeof adminExports.AccountCaptchaService).toBe('function');
    });

    it('should export AccountExternalProviderService (v4.0.0)', () => {
      expect(adminExports.AccountExternalProviderService).toBeDefined();
      expect(typeof adminExports.AccountExternalProviderService).toBe('function');
    });
  });

  describe('selective exports (no naming collisions)', () => {
    // eTwoFactorBehaviour should NOT be re-exported from admin barrel
    // because it already exists in config/enums
    it('should NOT export eTwoFactorBehaviour (to avoid collision)', () => {
      expect(
        (adminExports as Record<string, unknown>).eTwoFactorBehaviour
      ).toBeUndefined();
    });

    // AccountTwoFactorSettingsDto is a type-only export, so it won't appear at runtime
    // but we can verify that runtime-accessible exports are as expected
    it('should have expected number of runtime exports', () => {
      const exportKeys = Object.keys(adminExports);
      // abstracts: AbstractAccountSettingsService, useAccountSettings
      // components: useAccountSettingsComponent, useAccountSettingsTwoFactor,
      //   useAccountSettingsCaptcha, useAccountSettingsExternalProvider
      // services: AccountSettingsService, AccountLdapService,
      //   AccountTwoFactorSettingService, AccountCaptchaService,
      //   AccountExternalProviderService
      expect(exportKeys).toHaveLength(11);
    });
  });
});
