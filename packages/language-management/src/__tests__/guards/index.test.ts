/**
 * Tests for Language Management Guards barrel export
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as guards from '../../guards';

describe('guards barrel export', () => {
  it('should export languageManagementExtensionsGuard', () => {
    expect(guards.languageManagementExtensionsGuard).toBeDefined();
    expect(typeof guards.languageManagementExtensionsGuard).toBe('function');
  });

  it('should export useLanguageManagementExtensionsGuard', () => {
    expect(guards.useLanguageManagementExtensionsGuard).toBeDefined();
    expect(typeof guards.useLanguageManagementExtensionsGuard).toBe('function');
  });

  it('should export LanguageManagementExtensionsGuard class', () => {
    expect(guards.LanguageManagementExtensionsGuard).toBeDefined();
    expect(typeof guards.LanguageManagementExtensionsGuard).toBe('function');
  });

  it('should be able to use exported guard function', async () => {
    const result = await guards.languageManagementExtensionsGuard();
    expect(result).toBe(true);
  });

  it('should be able to use exported hook', () => {
    const result = guards.useLanguageManagementExtensionsGuard();
    expect(result.isLoaded).toBe(true);
    expect(result.loading).toBe(false);
  });

  it('should be able to instantiate exported class', () => {
    const guard = new guards.LanguageManagementExtensionsGuard();
    expect(guard).toBeInstanceOf(guards.LanguageManagementExtensionsGuard);
  });
});
