import { describe, it, expect } from 'vitest';
import * as enumsExports from '../../../config/enums';

describe('config/enums barrel exports (v4.0.0)', () => {
  // v4.0.0: route-names and manage-profile-tab-names removed from config/enums exports
  describe('route-names exports (removed in v4.0.0)', () => {
    it('should NOT export eAccountRouteNames from config/enums (removed in v4.0.0)', () => {
      expect((enumsExports as Record<string, unknown>).eAccountRouteNames).toBeUndefined();
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

  describe('manage-profile-tab-names exports (removed in v4.0.0)', () => {
    it('should NOT export eAccountManageProfileTabNames from config/enums (removed in v4.0.0)', () => {
      expect(
        (enumsExports as Record<string, unknown>).eAccountManageProfileTabNames
      ).toBeUndefined();
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
    it('should export only setting-tab-names, profile-picture-type, and two-factor-behaviour', () => {
      const exportKeys = Object.keys(enumsExports);
      expect(exportKeys).toContain('eAccountSettingTabNames');
      expect(exportKeys).toContain('ProfilePictureType');
      expect(exportKeys).toContain('eTwoFactorBehaviour');
      // Removed in v4.0.0
      expect(exportKeys).not.toContain('eAccountRouteNames');
      expect(exportKeys).not.toContain('eAccountManageProfileTabNames');
    });

    it('should have exactly 3 exports (v4.0.0)', () => {
      const exportKeys = Object.keys(enumsExports);
      expect(exportKeys.length).toBe(3);
    });
  });
});
