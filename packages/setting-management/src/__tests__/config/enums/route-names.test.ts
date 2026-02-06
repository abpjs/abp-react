import { describe, it, expect } from 'vitest';
import {
  eSettingManagementRouteNames,
  type SettingManagementRouteNameKey,
} from '../../../config/enums/route-names';

describe('config/enums/route-names (v3.0.0)', () => {
  describe('eSettingManagementRouteNames', () => {
    it('should export eSettingManagementRouteNames object', () => {
      expect(eSettingManagementRouteNames).toBeDefined();
      expect(typeof eSettingManagementRouteNames).toBe('object');
    });

    it('should have Settings key', () => {
      expect(eSettingManagementRouteNames.Settings).toBeDefined();
    });

    it('should have correct Settings value', () => {
      expect(eSettingManagementRouteNames.Settings).toBe('AbpSettingManagement::Settings');
    });

    it('should be a const object (frozen-like behavior)', () => {
      // TypeScript's `as const` makes it readonly at compile time
      // We verify the value is as expected
      const keys = Object.keys(eSettingManagementRouteNames);
      expect(keys).toContain('Settings');
      expect(keys.length).toBe(1);
    });

    it('should have all values as strings', () => {
      Object.values(eSettingManagementRouteNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have values that follow the ABP localization key format', () => {
      // ABP localization keys follow the pattern: ResourceName::KeyName
      const pattern = /^[A-Za-z]+::[A-Za-z]+$/;
      Object.values(eSettingManagementRouteNames).forEach((value) => {
        expect(value).toMatch(pattern);
      });
    });
  });

  describe('SettingManagementRouteNameKey type', () => {
    it('should accept valid route name values', () => {
      const validKey: SettingManagementRouteNameKey = 'AbpSettingManagement::Settings';
      expect(validKey).toBe(eSettingManagementRouteNames.Settings);
    });

    it('should be usable as a type for function parameters', () => {
      const useRouteNameKey = (key: SettingManagementRouteNameKey): string => {
        return key;
      };

      expect(useRouteNameKey(eSettingManagementRouteNames.Settings)).toBe(
        'AbpSettingManagement::Settings'
      );
    });
  });

  describe('comparison with lib/enums re-export', () => {
    it('should be re-exported from lib/enums for backward compatibility', async () => {
      const libEnums = await import('../../../enums/route-names');
      expect(libEnums.eSettingManagementRouteNames).toBe(eSettingManagementRouteNames);
    });

    it('should have the same values when imported from different paths', async () => {
      const libEnums = await import('../../../enums/route-names');
      expect(libEnums.eSettingManagementRouteNames.Settings).toBe(
        eSettingManagementRouteNames.Settings
      );
    });
  });
});
