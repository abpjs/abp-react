/**
 * Tests for Language Management Config Route Names
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  eLanguageManagementRouteNames,
  type LanguageManagementRouteNameKey,
} from '../../../config/enums/route-names';

describe('config/enums eLanguageManagementRouteNames', () => {
  describe('route name values', () => {
    it('should have LanguageManagement route name', () => {
      expect(eLanguageManagementRouteNames.LanguageManagement).toBe('LanguageManagement::LanguageManagement');
    });

    it('should have Languages route name', () => {
      expect(eLanguageManagementRouteNames.Languages).toBe('LanguageManagement::Languages');
    });

    it('should have LanguageTexts route name', () => {
      expect(eLanguageManagementRouteNames.LanguageTexts).toBe('LanguageManagement::LanguageTexts');
    });
  });

  describe('object structure', () => {
    it('should have correct keys', () => {
      const keys = Object.keys(eLanguageManagementRouteNames);
      expect(keys).toContain('LanguageManagement');
      expect(keys).toContain('Languages');
      expect(keys).toContain('LanguageTexts');
      expect(keys).toHaveLength(3);
    });

    it('should have unique values', () => {
      const values = Object.values(eLanguageManagementRouteNames);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('localization key format', () => {
    it('should follow LanguageManagement::KeyName pattern', () => {
      Object.values(eLanguageManagementRouteNames).forEach((value) => {
        expect(value).toMatch(/^LanguageManagement::/);
      });
    });

    it('should have valid localization key format', () => {
      Object.values(eLanguageManagementRouteNames).forEach((value) => {
        expect(value).toContain('::');
        const [module, key] = value.split('::');
        expect(module).toBe('LanguageManagement');
        expect(key.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('config/enums LanguageManagementRouteNameKey type', () => {
  it('should accept valid route name keys', () => {
    const key: LanguageManagementRouteNameKey = eLanguageManagementRouteNames.Languages;
    expect(key).toBe('LanguageManagement::Languages');
  });

  it('should work with all route name values', () => {
    const keys: LanguageManagementRouteNameKey[] = [
      eLanguageManagementRouteNames.LanguageManagement,
      eLanguageManagementRouteNames.Languages,
      eLanguageManagementRouteNames.LanguageTexts,
    ];
    expect(keys).toHaveLength(3);
  });
});
