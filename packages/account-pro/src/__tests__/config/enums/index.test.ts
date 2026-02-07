import { describe, it, expect } from 'vitest';
import * as enumsExports from '../../../config/enums';

describe('config/enums barrel exports (v3.2.0)', () => {
  describe('route-names exports', () => {
    it('should export eAccountRouteNames', () => {
      expect(enumsExports.eAccountRouteNames).toBeDefined();
      expect(typeof enumsExports.eAccountRouteNames).toBe('object');
    });

    it('should export eAccountRouteNames with all keys', () => {
      expect(enumsExports.eAccountRouteNames.Account).toBe('AbpAccount::Menu:Account');
      expect(enumsExports.eAccountRouteNames.Login).toBe('AbpAccount::Login');
      expect(enumsExports.eAccountRouteNames.Register).toBe('AbpAccount::Register');
      expect(enumsExports.eAccountRouteNames.ForgotPassword).toBe('AbpAccount::ForgotPassword');
      expect(enumsExports.eAccountRouteNames.ResetPassword).toBe('AbpAccount::ResetPassword');
      expect(enumsExports.eAccountRouteNames.ManageProfile).toBe('AbpAccount::ManageYourProfile');
    });
  });

  describe('setting-tab-names exports', () => {
    it('should export eAccountSettingTabNames', () => {
      expect(enumsExports.eAccountSettingTabNames).toBeDefined();
      expect(typeof enumsExports.eAccountSettingTabNames).toBe('object');
    });

    it('should export eAccountSettingTabNames with all keys', () => {
      expect(enumsExports.eAccountSettingTabNames.Account).toBe('AbpAccount::Menu:Account');
    });
  });

  describe('manage-profile-tab-names exports (v3.2.0)', () => {
    it('should export eAccountManageProfileTabNames', () => {
      expect(enumsExports.eAccountManageProfileTabNames).toBeDefined();
      expect(typeof enumsExports.eAccountManageProfileTabNames).toBe('object');
    });

    it('should export eAccountManageProfileTabNames with all keys', () => {
      expect(enumsExports.eAccountManageProfileTabNames.ProfilePicture).toBe(
        'AbpAccount::ProfilePicture'
      );
      expect(enumsExports.eAccountManageProfileTabNames.ChangePassword).toBe(
        'AbpUi::ChangePassword'
      );
      expect(enumsExports.eAccountManageProfileTabNames.PersonalSettings).toBe(
        'AbpAccount::PersonalSettings'
      );
      expect(enumsExports.eAccountManageProfileTabNames.TwoFactor).toBe(
        'AbpAccount::AccountSettingsTwoFactor'
      );
    });
  });

  describe('profile-picture-type exports (v3.2.0)', () => {
    it('should export ProfilePictureType', () => {
      expect(enumsExports.ProfilePictureType).toBeDefined();
      expect(typeof enumsExports.ProfilePictureType).toBe('object');
    });

    it('should export ProfilePictureType with all values', () => {
      expect(enumsExports.ProfilePictureType.None).toBe(0);
      expect(enumsExports.ProfilePictureType.Gravatar).toBe(1);
      expect(enumsExports.ProfilePictureType.Image).toBe(2);
    });
  });

  describe('two-factor-behaviour exports (v3.2.0)', () => {
    it('should export eTwoFactorBehaviour', () => {
      expect(enumsExports.eTwoFactorBehaviour).toBeDefined();
      expect(typeof enumsExports.eTwoFactorBehaviour).toBe('object');
    });

    it('should export eTwoFactorBehaviour with all values', () => {
      expect(enumsExports.eTwoFactorBehaviour.Optional).toBe(0);
      expect(enumsExports.eTwoFactorBehaviour.Disabled).toBe(1);
      expect(enumsExports.eTwoFactorBehaviour.Forced).toBe(2);
    });
  });

  describe('exports completeness', () => {
    it('should export all expected enums', () => {
      const exportKeys = Object.keys(enumsExports);
      expect(exportKeys).toContain('eAccountRouteNames');
      expect(exportKeys).toContain('eAccountSettingTabNames');
      expect(exportKeys).toContain('eAccountManageProfileTabNames');
      expect(exportKeys).toContain('ProfilePictureType');
      expect(exportKeys).toContain('eTwoFactorBehaviour');
    });

    it('should have at least 5 exports', () => {
      const exportKeys = Object.keys(enumsExports);
      expect(exportKeys.length).toBeGreaterThanOrEqual(5);
    });
  });
});
