/**
 * Tests for Language Management Route Names
 * @abpjs/language-management v2.7.0
 */
import { describe, it, expect } from 'vitest';
import { eLanguageManagementRouteNames, LanguageManagementRouteNameKey } from '../../enums';

describe('eLanguageManagementRouteNames', () => {
  describe('route name values', () => {
    it('should have Administration route name', () => {
      expect(eLanguageManagementRouteNames.Administration).toBe('AbpUiNavigation::Menu:Administration');
    });

    it('should have Languages route name', () => {
      expect(eLanguageManagementRouteNames.Languages).toBe('LanguageManagement::Menu:Languages');
    });

    it('should have LanguageTexts route name', () => {
      expect(eLanguageManagementRouteNames.LanguageTexts).toBe('LanguageManagement::LanguageTexts');
    });
  });

  describe('string usage', () => {
    it('should be usable as string values', () => {
      const admin: string = eLanguageManagementRouteNames.Administration;
      const languages: string = eLanguageManagementRouteNames.Languages;
      const languageTexts: string = eLanguageManagementRouteNames.LanguageTexts;

      expect(admin).toBe('AbpUiNavigation::Menu:Administration');
      expect(languages).toBe('LanguageManagement::Menu:Languages');
      expect(languageTexts).toBe('LanguageManagement::LanguageTexts');
    });

    it('should be usable for route configuration', () => {
      const routes: Record<string, { path: string }> = {};
      routes[eLanguageManagementRouteNames.Languages] = { path: '/language-management/languages' };
      routes[eLanguageManagementRouteNames.LanguageTexts] = { path: '/language-management/language-texts' };

      expect(routes['LanguageManagement::Menu:Languages'].path).toBe('/language-management/languages');
      expect(routes['LanguageManagement::LanguageTexts'].path).toBe('/language-management/language-texts');
    });
  });

  describe('object structure', () => {
    it('should have correct keys', () => {
      const keys = Object.keys(eLanguageManagementRouteNames);
      expect(keys).toContain('Administration');
      expect(keys).toContain('Languages');
      expect(keys).toContain('LanguageTexts');
      expect(keys).toHaveLength(3);
    });

    it('should have correct values', () => {
      const values = Object.values(eLanguageManagementRouteNames);
      expect(values).toContain('AbpUiNavigation::Menu:Administration');
      expect(values).toContain('LanguageManagement::Menu:Languages');
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
    it('should follow AbpModule::KeyName pattern', () => {
      Object.values(eLanguageManagementRouteNames).forEach((value) => {
        expect(value).toMatch(/^(Abp\w+|LanguageManagement)::/);
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

  describe('navigation hierarchy', () => {
    it('should have Administration as top-level menu', () => {
      expect(eLanguageManagementRouteNames.Administration).toContain('Menu:Administration');
    });

    it('should have Languages as submenu', () => {
      expect(eLanguageManagementRouteNames.Languages).toContain('Menu:Languages');
    });

    it('should have LanguageTexts as leaf route without Menu prefix', () => {
      expect(eLanguageManagementRouteNames.LanguageTexts).not.toContain('Menu:');
    });
  });
});

describe('LanguageManagementRouteNameKey type', () => {
  it('should accept valid route name keys', () => {
    const adminKey: LanguageManagementRouteNameKey = 'AbpUiNavigation::Menu:Administration';
    const languagesKey: LanguageManagementRouteNameKey = 'LanguageManagement::Menu:Languages';
    const languageTextsKey: LanguageManagementRouteNameKey = 'LanguageManagement::LanguageTexts';

    expect(adminKey).toBe(eLanguageManagementRouteNames.Administration);
    expect(languagesKey).toBe(eLanguageManagementRouteNames.Languages);
    expect(languageTextsKey).toBe(eLanguageManagementRouteNames.LanguageTexts);
  });

  it('should work with eLanguageManagementRouteNames values', () => {
    const key: LanguageManagementRouteNameKey = eLanguageManagementRouteNames.Languages;
    expect(key).toBe('LanguageManagement::Menu:Languages');
  });

  it('should be usable in function parameters', () => {
    const isValidRouteKey = (key: LanguageManagementRouteNameKey): boolean => {
      return Object.values(eLanguageManagementRouteNames).includes(key);
    };

    expect(isValidRouteKey(eLanguageManagementRouteNames.Administration)).toBe(true);
    expect(isValidRouteKey(eLanguageManagementRouteNames.Languages)).toBe(true);
    expect(isValidRouteKey(eLanguageManagementRouteNames.LanguageTexts)).toBe(true);
  });

  it('should work with Record type for route configuration', () => {
    const routePaths: Record<LanguageManagementRouteNameKey, string> = {
      'AbpUiNavigation::Menu:Administration': '/admin',
      'LanguageManagement::Menu:Languages': '/admin/language-management/languages',
      'LanguageManagement::LanguageTexts': '/admin/language-management/language-texts',
    };

    expect(routePaths[eLanguageManagementRouteNames.Administration]).toBe('/admin');
    expect(routePaths[eLanguageManagementRouteNames.Languages]).toBe('/admin/language-management/languages');
    expect(routePaths[eLanguageManagementRouteNames.LanguageTexts]).toBe('/admin/language-management/language-texts');
  });

  it('should be usable for localization lookups', () => {
    const mockLocalize = (key: LanguageManagementRouteNameKey): string => {
      const translations: Record<LanguageManagementRouteNameKey, string> = {
        'AbpUiNavigation::Menu:Administration': 'Administration',
        'LanguageManagement::Menu:Languages': 'Languages',
        'LanguageManagement::LanguageTexts': 'Language Texts',
      };
      return translations[key];
    };

    expect(mockLocalize(eLanguageManagementRouteNames.Administration)).toBe('Administration');
    expect(mockLocalize(eLanguageManagementRouteNames.Languages)).toBe('Languages');
    expect(mockLocalize(eLanguageManagementRouteNames.LanguageTexts)).toBe('Language Texts');
  });
});
