import { describe, it, expect } from 'vitest';
import {
  eSettingManagementRouteNames,
  type SettingManagementRouteNameKey,
} from '../../enums/route-names';

describe('eSettingManagementRouteNames', () => {
  describe('enum values', () => {
    it('should have Settings key with correct value', () => {
      expect(eSettingManagementRouteNames.Settings).toBe(
        'AbpSettingManagement::Settings'
      );
    });

    it('should have exactly 1 key', () => {
      const keys = Object.keys(eSettingManagementRouteNames);
      expect(keys).toHaveLength(1);
    });

    it('should contain the Settings key', () => {
      expect('Settings' in eSettingManagementRouteNames).toBe(true);
    });
  });

  describe('enum structure', () => {
    it('should be an object', () => {
      expect(typeof eSettingManagementRouteNames).toBe('object');
    });

    it('should not be null', () => {
      expect(eSettingManagementRouteNames).not.toBeNull();
    });

    it('should have string values', () => {
      Object.values(eSettingManagementRouteNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have values following the localization key pattern', () => {
      Object.values(eSettingManagementRouteNames).forEach((value) => {
        // Pattern: ModuleName::KeyName
        expect(value).toMatch(/^[\w]+::[\w]+$/);
      });
    });
  });

  describe('type safety', () => {
    it('should allow type assignment for valid keys', () => {
      const key: SettingManagementRouteNameKey =
        eSettingManagementRouteNames.Settings;
      expect(key).toBe('AbpSettingManagement::Settings');
    });

    it('should have correct type for Settings value', () => {
      const value = eSettingManagementRouteNames.Settings;
      expect(value).toBe('AbpSettingManagement::Settings');
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      const routeName = eSettingManagementRouteNames.Settings;
      let result = '';

      switch (routeName) {
        case eSettingManagementRouteNames.Settings:
          result = 'settings-route';
          break;
        default:
          result = 'unknown';
      }

      expect(result).toBe('settings-route');
    });

    it('should work with Object.entries', () => {
      const entries = Object.entries(eSettingManagementRouteNames);
      expect(entries).toEqual([['Settings', 'AbpSettingManagement::Settings']]);
    });

    it('should work with Object.values', () => {
      const values = Object.values(eSettingManagementRouteNames);
      expect(values).toEqual(['AbpSettingManagement::Settings']);
    });

    it('should work with Object.keys', () => {
      const keys = Object.keys(eSettingManagementRouteNames);
      expect(keys).toEqual(['Settings']);
    });

    it('should be usable for route name lookup', () => {
      const routeLabels: Record<SettingManagementRouteNameKey, string> = {
        [eSettingManagementRouteNames.Settings]: 'Settings',
      };

      expect(routeLabels[eSettingManagementRouteNames.Settings]).toBe('Settings');
    });

    it('should be usable for localization keys', () => {
      // Simulate localization lookup
      const localizations: Record<string, string> = {
        'AbpSettingManagement::Settings': 'Settings',
      };

      const key = eSettingManagementRouteNames.Settings;
      expect(localizations[key]).toBe('Settings');
    });
  });

  describe('localization key format', () => {
    it('should use AbpSettingManagement as module prefix', () => {
      const value = eSettingManagementRouteNames.Settings;
      expect(value.startsWith('AbpSettingManagement::')).toBe(true);
    });

    it('should have Settings as the key name', () => {
      const value = eSettingManagementRouteNames.Settings;
      const keyName = value.split('::')[1];
      expect(keyName).toBe('Settings');
    });
  });
});
