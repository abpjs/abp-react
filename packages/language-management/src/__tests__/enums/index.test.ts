/**
 * Tests for Language Management Enums barrel export
 * @abpjs/language-management v2.7.0
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

  it('should have correct eLanguageManagementRouteNames values through barrel', () => {
    expect(enums.eLanguageManagementRouteNames.Administration).toBe('AbpUiNavigation::Menu:Administration');
    expect(enums.eLanguageManagementRouteNames.Languages).toBe('LanguageManagement::Menu:Languages');
    expect(enums.eLanguageManagementRouteNames.LanguageTexts).toBe('LanguageManagement::LanguageTexts');
  });
});

describe('named imports from enums', () => {
  it('should support named import of eLanguageManagementComponents', async () => {
    const { eLanguageManagementComponents } = await import('../../enums');
    expect(eLanguageManagementComponents.Languages).toBe('LanguageManagement.LanguagesComponent');
  });

  it('should support named import of eLanguageManagementRouteNames', async () => {
    const { eLanguageManagementRouteNames } = await import('../../enums');
    expect(eLanguageManagementRouteNames.Languages).toBe('LanguageManagement::Menu:Languages');
  });

  it('should support named import of LanguageManagementComponentKey type (compile-time check)', () => {
    // This is a compile-time check - if this compiles, the type is exported correctly
    const key: enums.LanguageManagementComponentKey = 'LanguageManagement.LanguagesComponent';
    expect(key).toBe(enums.eLanguageManagementComponents.Languages);
  });

  it('should support named import of LanguageManagementRouteNameKey type (compile-time check)', () => {
    // This is a compile-time check - if this compiles, the type is exported correctly
    const key: enums.LanguageManagementRouteNameKey = 'LanguageManagement::Menu:Languages';
    expect(key).toBe(enums.eLanguageManagementRouteNames.Languages);
  });
});
