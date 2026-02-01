/**
 * Tests for Language Management enums
 * @abpjs/language-management v2.4.0
 */
import { describe, it, expect } from 'vitest';
import { eLanguageManagementComponents } from '../enums';

describe('eLanguageManagementComponents (v2.4.0)', () => {
  describe('enum values', () => {
    it('should have Languages component identifier', () => {
      expect(eLanguageManagementComponents.Languages).toBe('LanguageManagement.LanguagesComponent');
    });

    it('should have LanguageTexts component identifier', () => {
      expect(eLanguageManagementComponents.LanguageTexts).toBe('LanguageManagement.LanguageTextsComponent');
    });
  });

  describe('enum structure', () => {
    it('should have exactly 2 members', () => {
      const enumKeys = Object.keys(eLanguageManagementComponents).filter(
        (key) => isNaN(Number(key))
      );
      expect(enumKeys).toHaveLength(2);
    });

    it('should have all expected keys', () => {
      const enumKeys = Object.keys(eLanguageManagementComponents).filter(
        (key) => isNaN(Number(key))
      );
      expect(enumKeys).toContain('Languages');
      expect(enumKeys).toContain('LanguageTexts');
    });

    it('should have unique values', () => {
      const values = [
        eLanguageManagementComponents.Languages,
        eLanguageManagementComponents.LanguageTexts,
      ];
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('type safety', () => {
    it('should be usable as object keys', () => {
      const componentRegistry: Record<eLanguageManagementComponents, string> = {
        [eLanguageManagementComponents.Languages]: 'LanguagesComponent',
        [eLanguageManagementComponents.LanguageTexts]: 'LanguageTextsComponent',
      };

      expect(componentRegistry[eLanguageManagementComponents.Languages]).toBe('LanguagesComponent');
      expect(componentRegistry[eLanguageManagementComponents.LanguageTexts]).toBe('LanguageTextsComponent');
    });

    it('should follow naming convention', () => {
      expect(eLanguageManagementComponents.Languages).toMatch(/^LanguageManagement\..+Component$/);
      expect(eLanguageManagementComponents.LanguageTexts).toMatch(/^LanguageManagement\..+Component$/);
    });
  });

  describe('reverse mapping', () => {
    it('should not have numeric reverse mapping (string enum)', () => {
      // String enums do not have reverse mapping
      const numericKeys = Object.keys(eLanguageManagementComponents).filter(
        (key) => !isNaN(Number(key))
      );
      expect(numericKeys).toHaveLength(0);
    });
  });
});
