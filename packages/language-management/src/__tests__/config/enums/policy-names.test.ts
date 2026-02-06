/**
 * Tests for Language Management Policy Names
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  eLanguageManagementPolicyNames,
  type LanguageManagementPolicyNameKey,
} from '../../../config/enums/policy-names';

describe('eLanguageManagementPolicyNames', () => {
  describe('policy name values', () => {
    it('should have LanguageManagement policy name', () => {
      expect(eLanguageManagementPolicyNames.LanguageManagement).toBe(
        'LanguageManagement.Languages || LanguageManagement.LanguageTexts'
      );
    });

    it('should have Languages policy name', () => {
      expect(eLanguageManagementPolicyNames.Languages).toBe('LanguageManagement.Languages');
    });

    it('should have LanguageTexts policy name', () => {
      expect(eLanguageManagementPolicyNames.LanguageTexts).toBe('LanguageManagement.LanguageTexts');
    });
  });

  describe('object structure', () => {
    it('should have correct keys', () => {
      const keys = Object.keys(eLanguageManagementPolicyNames);
      expect(keys).toContain('LanguageManagement');
      expect(keys).toContain('Languages');
      expect(keys).toContain('LanguageTexts');
      expect(keys).toHaveLength(3);
    });

    it('should have unique values', () => {
      const values = Object.values(eLanguageManagementPolicyNames);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be a const object', () => {
      expect(typeof eLanguageManagementPolicyNames).toBe('object');
      expect(eLanguageManagementPolicyNames).not.toBeNull();
    });
  });

  describe('policy name format', () => {
    it('should follow LanguageManagement.* pattern for specific policies', () => {
      expect(eLanguageManagementPolicyNames.Languages).toMatch(/^LanguageManagement\./);
      expect(eLanguageManagementPolicyNames.LanguageTexts).toMatch(/^LanguageManagement\./);
    });

    it('should have OR pattern for combined policy', () => {
      expect(eLanguageManagementPolicyNames.LanguageManagement).toContain(' || ');
    });
  });
});

describe('LanguageManagementPolicyNameKey type', () => {
  it('should accept valid policy name keys', () => {
    const languageManagementKey: LanguageManagementPolicyNameKey =
      'LanguageManagement.Languages || LanguageManagement.LanguageTexts';
    const languagesKey: LanguageManagementPolicyNameKey = 'LanguageManagement.Languages';
    const languageTextsKey: LanguageManagementPolicyNameKey = 'LanguageManagement.LanguageTexts';

    expect(languageManagementKey).toBe(eLanguageManagementPolicyNames.LanguageManagement);
    expect(languagesKey).toBe(eLanguageManagementPolicyNames.Languages);
    expect(languageTextsKey).toBe(eLanguageManagementPolicyNames.LanguageTexts);
  });

  it('should work with eLanguageManagementPolicyNames values', () => {
    const key: LanguageManagementPolicyNameKey = eLanguageManagementPolicyNames.Languages;
    expect(key).toBe('LanguageManagement.Languages');
  });

  it('should be usable in function parameters', () => {
    const hasPolicy = (policy: LanguageManagementPolicyNameKey): boolean => {
      return Object.values(eLanguageManagementPolicyNames).includes(policy);
    };

    expect(hasPolicy(eLanguageManagementPolicyNames.LanguageManagement)).toBe(true);
    expect(hasPolicy(eLanguageManagementPolicyNames.Languages)).toBe(true);
    expect(hasPolicy(eLanguageManagementPolicyNames.LanguageTexts)).toBe(true);
  });
});
