/**
 * Tests for Identity Setting Tab Names
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect } from 'vitest';
import { eIdentitySettingTabNames, IdentitySettingTabNameKey } from '../../../config/enums/setting-tab-names';

describe('eIdentitySettingTabNames', () => {
  describe('setting tab name values', () => {
    it('should have IdentityManagement setting tab name', () => {
      expect(eIdentitySettingTabNames.IdentityManagement).toBe('AbpIdentity::Menu:IdentityManagement');
    });
  });

  describe('object structure', () => {
    it('should have exactly 1 setting tab name', () => {
      const keys = Object.keys(eIdentitySettingTabNames);
      expect(keys).toHaveLength(1);
    });

    it('should have correct key', () => {
      const keys = Object.keys(eIdentitySettingTabNames);
      expect(keys).toContain('IdentityManagement');
    });

    it('should be a const object', () => {
      expect(typeof eIdentitySettingTabNames).toBe('object');
      expect(eIdentitySettingTabNames).not.toBeNull();
    });
  });

  describe('localization key pattern', () => {
    it('should follow AbpModule::KeyName pattern', () => {
      expect(eIdentitySettingTabNames.IdentityManagement).toMatch(/^Abp\w+::/);
    });

    it('should have valid localization key format', () => {
      const value = eIdentitySettingTabNames.IdentityManagement;
      expect(value).toContain('::');
      const [module, key] = value.split('::');
      expect(module.length).toBeGreaterThan(0);
      expect(key.length).toBeGreaterThan(0);
    });
  });
});

describe('IdentitySettingTabNameKey type', () => {
  it('should accept valid setting tab name values', () => {
    const identityKey: IdentitySettingTabNameKey = 'AbpIdentity::Menu:IdentityManagement';
    expect(identityKey).toBe(eIdentitySettingTabNames.IdentityManagement);
  });

  it('should work with eIdentitySettingTabNames values', () => {
    const key: IdentitySettingTabNameKey = eIdentitySettingTabNames.IdentityManagement;
    expect(key).toBe('AbpIdentity::Menu:IdentityManagement');
  });

  it('should be usable in function parameters', () => {
    const isValidTabKey = (key: IdentitySettingTabNameKey): boolean => {
      return Object.values(eIdentitySettingTabNames).includes(key);
    };

    expect(isValidTabKey(eIdentitySettingTabNames.IdentityManagement)).toBe(true);
  });
});
