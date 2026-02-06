/**
 * Tests for Language Management Route Names
 * @abpjs/language-management v3.0.0
 *
 * Changes in v3.0.0:
 * - Removed Administration key
 * - Changed Languages value from 'LanguageManagement::Menu:Languages' to 'LanguageManagement::Languages'
 * - Added LanguageManagement key for parent route
 */
import { describe, it, expect } from 'vitest';
import { eLanguageManagementRouteNames, LanguageManagementRouteNameKey } from '../../enums';

describe('eLanguageManagementRouteNames', () => {
  describe('route name values', () => {
    it('should have LanguageManagement route name (v3.0.0)', () => {
      expect(eLanguageManagementRouteNames.LanguageManagement).toBe('LanguageManagement::LanguageManagement');
    });

    it('should have Languages route name with v3.0.0 value', () => {
      expect(eLanguageManagementRouteNames.Languages).toBe('LanguageManagement::Languages');
    });

    it('should have LanguageTexts route name', () => {
      expect(eLanguageManagementRouteNames.LanguageTexts).toBe('LanguageManagement::LanguageTexts');
    });

    it('should NOT have Administration key (removed in v3.0.0)', () => {
      expect((eLanguageManagementRouteNames as Record<string, string>).Administration).toBeUndefined();
    });
  });

  describe('string usage', () => {
    it('should be usable as string values', () => {
      const languageManagement: string = eLanguageManagementRouteNames.LanguageManagement;
      const languages: string = eLanguageManagementRouteNames.Languages;
      const languageTexts: string = eLanguageManagementRouteNames.LanguageTexts;

      expect(languageManagement).toBe('LanguageManagement::LanguageManagement');
      expect(languages).toBe('LanguageManagement::Languages');
      expect(languageTexts).toBe('LanguageManagement::LanguageTexts');
    });

    it('should be usable for route configuration', () => {
      const routes: Record<string, { path: string }> = {};
      routes[eLanguageManagementRouteNames.LanguageManagement] = { path: '/language-management' };
      routes[eLanguageManagementRouteNames.Languages] = { path: '/language-management/languages' };
      routes[eLanguageManagementRouteNames.LanguageTexts] = { path: '/language-management/language-texts' };

      expect(routes['LanguageManagement::LanguageManagement'].path).toBe('/language-management');
      expect(routes['LanguageManagement::Languages'].path).toBe('/language-management/languages');
      expect(routes['LanguageManagement::LanguageTexts'].path).toBe('/language-management/language-texts');
    });
  });

  describe('object structure', () => {
    it('should have correct keys (v3.0.0)', () => {
      const keys = Object.keys(eLanguageManagementRouteNames);
      expect(keys).toContain('LanguageManagement');
      expect(keys).toContain('Languages');
      expect(keys).toContain('LanguageTexts');
      expect(keys).not.toContain('Administration');
      expect(keys).toHaveLength(3);
    });

    it('should have correct values (v3.0.0)', () => {
      const values = Object.values(eLanguageManagementRouteNames);
      expect(values).toContain('LanguageManagement::LanguageManagement');
      expect(values).toContain('LanguageManagement::Languages');
      expect(values).toContain('LanguageManagement::LanguageTexts');
      expect(values).toHaveLength(3);
    });

    it('should have unique values for each route', () => {
      const values = Object.values(eLanguageManagementRouteNames);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be a const object (immutable at runtime)', () => {
      expect(typeof eLanguageManagementRouteNames).toBe('object');
      expect(eLanguageManagementRouteNames).not.toBeNull();
    });
  });

  describe('localization key pattern', () => {
    it('should follow LanguageManagement::KeyName pattern', () => {
      Object.values(eLanguageManagementRouteNames).forEach((value) => {
        expect(value).toMatch(/^LanguageManagement::/);
      });
    });

    it('should have valid localization key format', () => {
      Object.values(eLanguageManagementRouteNames).forEach((value) => {
        expect(value).toContain('::');
        const [module, key] = value.split('::');
        expect(module.length).toBeGreaterThan(0);
        expect(key.length).toBeGreaterThan(0);
      });
    });
  });

  describe('navigation hierarchy (v3.0.0)', () => {
    it('should have LanguageManagement as top-level menu', () => {
      expect(eLanguageManagementRouteNames.LanguageManagement).toContain('LanguageManagement');
    });

    it('should have Languages as submenu without Menu prefix', () => {
      expect(eLanguageManagementRouteNames.Languages).not.toContain('Menu:');
    });

    it('should have LanguageTexts as submenu without Menu prefix', () => {
      expect(eLanguageManagementRouteNames.LanguageTexts).not.toContain('Menu:');
    });
  });
});

describe('LanguageManagementRouteNameKey type', () => {
  it('should accept valid route name keys (v3.0.0)', () => {
    const languageManagementKey: LanguageManagementRouteNameKey = 'LanguageManagement::LanguageManagement';
    const languagesKey: LanguageManagementRouteNameKey = 'LanguageManagement::Languages';
    const languageTextsKey: LanguageManagementRouteNameKey = 'LanguageManagement::LanguageTexts';

    expect(languageManagementKey).toBe(eLanguageManagementRouteNames.LanguageManagement);
    expect(languagesKey).toBe(eLanguageManagementRouteNames.Languages);
    expect(languageTextsKey).toBe(eLanguageManagementRouteNames.LanguageTexts);
  });

  it('should work with eLanguageManagementRouteNames values', () => {
    const key: LanguageManagementRouteNameKey = eLanguageManagementRouteNames.Languages;
    expect(key).toBe('LanguageManagement::Languages');
  });

  it('should be usable in function parameters', () => {
    const isValidRouteKey = (key: LanguageManagementRouteNameKey): boolean => {
      return Object.values(eLanguageManagementRouteNames).includes(key);
    };

    expect(isValidRouteKey(eLanguageManagementRouteNames.LanguageManagement)).toBe(true);
    expect(isValidRouteKey(eLanguageManagementRouteNames.Languages)).toBe(true);
    expect(isValidRouteKey(eLanguageManagementRouteNames.LanguageTexts)).toBe(true);
  });

  it('should work with Record type for route configuration (v3.0.0)', () => {
    const routePaths: Record<LanguageManagementRouteNameKey, string> = {
      'LanguageManagement::LanguageManagement': '/language-management',
      'LanguageManagement::Languages': '/language-management/languages',
      'LanguageManagement::LanguageTexts': '/language-management/language-texts',
    };

    expect(routePaths[eLanguageManagementRouteNames.LanguageManagement]).toBe('/language-management');
    expect(routePaths[eLanguageManagementRouteNames.Languages]).toBe('/language-management/languages');
    expect(routePaths[eLanguageManagementRouteNames.LanguageTexts]).toBe('/language-management/language-texts');
  });

  it('should be usable for localization lookups (v3.0.0)', () => {
    const mockLocalize = (key: LanguageManagementRouteNameKey): string => {
      const translations: Record<LanguageManagementRouteNameKey, string> = {
        'LanguageManagement::LanguageManagement': 'Language Management',
        'LanguageManagement::Languages': 'Languages',
        'LanguageManagement::LanguageTexts': 'Language Texts',
      };
      return translations[key];
    };

    expect(mockLocalize(eLanguageManagementRouteNames.LanguageManagement)).toBe('Language Management');
    expect(mockLocalize(eLanguageManagementRouteNames.Languages)).toBe('Languages');
    expect(mockLocalize(eLanguageManagementRouteNames.LanguageTexts)).toBe('Language Texts');
  });
});
