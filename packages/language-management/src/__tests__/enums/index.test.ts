/**
 * Tests for Language Management Enums barrel export
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as enums from '../../enums';

describe('enums barrel export', () => {
  it('should export eLanguageManagementComponents', () => {
    expect(enums.eLanguageManagementComponents).toBeDefined();
    expect(typeof enums.eLanguageManagementComponents).toBe('object');
  });

  it('should export eLanguageManagementRouteNames', () => {
    expect(enums.eLanguageManagementRouteNames).toBeDefined();
    expect(typeof enums.eLanguageManagementRouteNames).toBe('object');
  });

  it('should export all expected members', () => {
    const exportedKeys = Object.keys(enums);
    expect(exportedKeys).toContain('eLanguageManagementComponents');
    expect(exportedKeys).toContain('eLanguageManagementRouteNames');
  });

  it('should have correct eLanguageManagementComponents values through barrel', () => {
    expect(enums.eLanguageManagementComponents.Languages).toBe('LanguageManagement.LanguagesComponent');
    expect(enums.eLanguageManagementComponents.LanguageTexts).toBe('LanguageManagement.LanguageTextsComponent');
  });

  it('should have correct eLanguageManagementRouteNames values through barrel (v3.0.0)', () => {
    expect(enums.eLanguageManagementRouteNames.LanguageManagement).toBe('LanguageManagement::LanguageManagement');
    expect(enums.eLanguageManagementRouteNames.Languages).toBe('LanguageManagement::Languages');
    expect(enums.eLanguageManagementRouteNames.LanguageTexts).toBe('LanguageManagement::LanguageTexts');
  });
});

describe('named imports from enums', () => {
  it('should support named import of eLanguageManagementComponents', async () => {
    const { eLanguageManagementComponents } = await import('../../enums');
    expect(eLanguageManagementComponents.Languages).toBe('LanguageManagement.LanguagesComponent');
  });

  it('should support named import of eLanguageManagementRouteNames (v3.0.0)', async () => {
    const { eLanguageManagementRouteNames } = await import('../../enums');
    expect(eLanguageManagementRouteNames.Languages).toBe('LanguageManagement::Languages');
  });

  it('should support named import of LanguageManagementComponentKey type (compile-time check)', () => {
    // This is a compile-time check - if this compiles, the type is exported correctly
    const key: enums.LanguageManagementComponentKey = 'LanguageManagement.LanguagesComponent';
    expect(key).toBe(enums.eLanguageManagementComponents.Languages);
  });

  it('should support named import of LanguageManagementRouteNameKey type (v3.0.0)', () => {
    // This is a compile-time check - if this compiles, the type is exported correctly
    const key: enums.LanguageManagementRouteNameKey = 'LanguageManagement::Languages';
    expect(key).toBe(enums.eLanguageManagementRouteNames.Languages);
  });
});
