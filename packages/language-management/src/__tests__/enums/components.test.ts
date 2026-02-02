/**
 * Tests for Language Management Component Identifiers
 * @abpjs/language-management v2.7.0
 */
import { describe, it, expect } from 'vitest';
import { eLanguageManagementComponents, LanguageManagementComponentKey } from '../../enums';

describe('eLanguageManagementComponents', () => {
  describe('component values', () => {
    it('should have Languages component identifier', () => {
      expect(eLanguageManagementComponents.Languages).toBe('LanguageManagement.LanguagesComponent');
    });

    it('should have LanguageTexts component identifier', () => {
      expect(eLanguageManagementComponents.LanguageTexts).toBe('LanguageManagement.LanguageTextsComponent');
    });
  });

  describe('string usage', () => {
    it('should be usable as string values', () => {
      const languagesKey: string = eLanguageManagementComponents.Languages;
      const languageTextsKey: string = eLanguageManagementComponents.LanguageTexts;

      expect(languagesKey).toBe('LanguageManagement.LanguagesComponent');
      expect(languageTextsKey).toBe('LanguageManagement.LanguageTextsComponent');
    });

    it('should be usable for component registration', () => {
      const componentRegistry: Record<string, string> = {};
      componentRegistry[eLanguageManagementComponents.Languages] = 'LanguagesComponent';
      componentRegistry[eLanguageManagementComponents.LanguageTexts] = 'LanguageTextsComponent';

      expect(componentRegistry['LanguageManagement.LanguagesComponent']).toBe('LanguagesComponent');
      expect(componentRegistry['LanguageManagement.LanguageTextsComponent']).toBe('LanguageTextsComponent');
    });
  });

  describe('object structure', () => {
    it('should have correct keys', () => {
      const keys = Object.keys(eLanguageManagementComponents);
      expect(keys).toContain('Languages');
      expect(keys).toContain('LanguageTexts');
      expect(keys).toHaveLength(2);
    });

    it('should have correct values', () => {
      const values = Object.values(eLanguageManagementComponents);
      expect(values).toContain('LanguageManagement.LanguagesComponent');
      expect(values).toContain('LanguageManagement.LanguageTextsComponent');
      expect(values).toHaveLength(2);
    });

    it('should have unique values for each component', () => {
      const values = Object.values(eLanguageManagementComponents);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be a const object (immutable at runtime)', () => {
      expect(typeof eLanguageManagementComponents).toBe('object');
      expect(eLanguageManagementComponents).not.toBeNull();
    });
  });

  describe('v2.7.0 const object pattern', () => {
    it('should follow Module.ComponentName pattern', () => {
      Object.values(eLanguageManagementComponents).forEach((value) => {
        expect(value).toMatch(/^LanguageManagement\.\w+Component$/);
      });
    });

    it('should be usable in type-safe component lookup', () => {
      const getComponent = (key: LanguageManagementComponentKey): string => {
        const components: Record<LanguageManagementComponentKey, string> = {
          [eLanguageManagementComponents.Languages]: 'LanguagesComponent',
          [eLanguageManagementComponents.LanguageTexts]: 'LanguageTextsComponent',
        };
        return components[key];
      };

      expect(getComponent(eLanguageManagementComponents.Languages)).toBe('LanguagesComponent');
      expect(getComponent(eLanguageManagementComponents.LanguageTexts)).toBe('LanguageTextsComponent');
    });
  });
});

describe('LanguageManagementComponentKey type', () => {
  it('should accept valid component keys', () => {
    const languagesKey: LanguageManagementComponentKey = 'LanguageManagement.LanguagesComponent';
    const languageTextsKey: LanguageManagementComponentKey = 'LanguageManagement.LanguageTextsComponent';

    expect(languagesKey).toBe(eLanguageManagementComponents.Languages);
    expect(languageTextsKey).toBe(eLanguageManagementComponents.LanguageTexts);
  });

  it('should work with eLanguageManagementComponents values', () => {
    const key: LanguageManagementComponentKey = eLanguageManagementComponents.Languages;
    expect(key).toBe('LanguageManagement.LanguagesComponent');
  });

  it('should be usable in function parameters', () => {
    const isValidKey = (key: LanguageManagementComponentKey): boolean => {
      return Object.values(eLanguageManagementComponents).includes(key);
    };

    expect(isValidKey(eLanguageManagementComponents.Languages)).toBe(true);
    expect(isValidKey(eLanguageManagementComponents.LanguageTexts)).toBe(true);
  });

  it('should work with Record type', () => {
    const componentNames: Record<LanguageManagementComponentKey, string> = {
      'LanguageManagement.LanguagesComponent': 'Languages',
      'LanguageManagement.LanguageTextsComponent': 'Language Texts',
    };

    expect(componentNames[eLanguageManagementComponents.Languages]).toBe('Languages');
    expect(componentNames[eLanguageManagementComponents.LanguageTexts]).toBe('Language Texts');
  });
});
