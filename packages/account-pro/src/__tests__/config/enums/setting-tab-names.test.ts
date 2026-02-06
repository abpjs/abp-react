import { describe, it, expect } from 'vitest';
import {
  eAccountSettingTabNames,
  AccountSettingTabNameKey,
} from '../../../config/enums/setting-tab-names';
import { eAccountRouteNames } from '../../../config/enums/route-names';

describe('eAccountSettingTabNames (v3.0.0)', () => {
  describe('enum values', () => {
    it('should have Account key with correct value', () => {
      expect(eAccountSettingTabNames.Account).toBe('AbpAccount::Menu:Account');
    });
  });

  describe('enum structure', () => {
    it('should be a const object (readonly at compile time)', () => {
      // Note: `as const` makes the object readonly at TypeScript level,
      // not at runtime. The object is not frozen in JavaScript.
      expect(typeof eAccountSettingTabNames).toBe('object');
      expect(eAccountSettingTabNames).not.toBeNull();
    });

    it('should have exactly 1 key', () => {
      const keys = Object.keys(eAccountSettingTabNames);
      expect(keys).toHaveLength(1);
    });

    it('should contain the Account key', () => {
      const keys = Object.keys(eAccountSettingTabNames);
      expect(keys).toContain('Account');
    });

    it('should have all values be strings', () => {
      Object.values(eAccountSettingTabNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have all values start with AbpAccount::', () => {
      Object.values(eAccountSettingTabNames).forEach((value) => {
        expect(value).toMatch(/^AbpAccount::/);
      });
    });
  });

  describe('type safety', () => {
    it('should allow AccountSettingTabNameKey type assignment', () => {
      const accountKey: AccountSettingTabNameKey = eAccountSettingTabNames.Account;
      expect(accountKey).toBe('AbpAccount::Menu:Account');
    });

    it('should match the same value as eAccountRouteNames.Account', () => {
      // Both should use the same localization key for Account
      expect(eAccountSettingTabNames.Account).toBe('AbpAccount::Menu:Account');
    });
  });

  describe('setting tab naming convention', () => {
    it('should follow ABP setting tab naming pattern', () => {
      // Setting tabs typically use the same keys as routes for consistency
      expect(eAccountSettingTabNames.Account).toMatch(/^Abp\w+::\w+/);
    });

    it('should use Menu prefix for menu-related tabs', () => {
      expect(eAccountSettingTabNames.Account).toContain('Menu:');
    });
  });

  describe('comparison with route names', () => {
    it('should have Account value matching route Account value', () => {
      // Both should use the same localization key for Account
      expect(eAccountSettingTabNames.Account).toBe(eAccountRouteNames.Account);
    });
  });
});
