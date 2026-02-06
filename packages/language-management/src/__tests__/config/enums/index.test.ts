/**
 * Tests for Language Management Config Enums barrel export
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as configEnums from '../../../config/enums';

describe('config/enums barrel export', () => {
  it('should export eLanguageManagementPolicyNames', () => {
    expect(configEnums.eLanguageManagementPolicyNames).toBeDefined();
    expect(typeof configEnums.eLanguageManagementPolicyNames).toBe('object');
  });

  it('should export eLanguageManagementRouteNames', () => {
    expect(configEnums.eLanguageManagementRouteNames).toBeDefined();
    expect(typeof configEnums.eLanguageManagementRouteNames).toBe('object');
  });

  it('should have correct policy name values', () => {
    expect(configEnums.eLanguageManagementPolicyNames.Languages).toBe('LanguageManagement.Languages');
    expect(configEnums.eLanguageManagementPolicyNames.LanguageTexts).toBe('LanguageManagement.LanguageTexts');
  });

  it('should have correct route name values', () => {
    expect(configEnums.eLanguageManagementRouteNames.Languages).toBe('LanguageManagement::Languages');
    expect(configEnums.eLanguageManagementRouteNames.LanguageTexts).toBe('LanguageManagement::LanguageTexts');
  });
});
