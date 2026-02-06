/**
 * Tests for SaaS Enums barrel export
 * @abpjs/saas v3.0.0
 *
 * Breaking changes in v3.0.0:
 * - Removed 'Administration' key from eSaasRouteNames
 */
import { describe, it, expect } from 'vitest';
import * as enums from '../../enums';

describe('enums barrel export', () => {
  it('should export eSaasComponents', () => {
    expect(enums.eSaasComponents).toBeDefined();
    expect(typeof enums.eSaasComponents).toBe('object');
  });

  it('should export eSaasRouteNames', () => {
    expect(enums.eSaasRouteNames).toBeDefined();
    expect(typeof enums.eSaasRouteNames).toBe('object');
  });

  it('should export all expected members', () => {
    const exportedKeys = Object.keys(enums);
    expect(exportedKeys).toContain('eSaasComponents');
    expect(exportedKeys).toContain('eSaasRouteNames');
  });

  it('should have correct eSaasComponents values through barrel', () => {
    expect(enums.eSaasComponents.Editions).toBe('Saas.EditionsComponent');
    expect(enums.eSaasComponents.Tenants).toBe('Saas.TenantsComponent');
  });

  it('should have correct eSaasRouteNames values through barrel (v3.0.0)', () => {
    // v3.0.0: Administration was removed
    // @ts-expect-error - Administration was removed in v3.0.0
    expect(enums.eSaasRouteNames.Administration).toBeUndefined();
    expect(enums.eSaasRouteNames.Saas).toBe('Saas::Menu:Saas');
    expect(enums.eSaasRouteNames.Tenants).toBe('Saas::Tenants');
    expect(enums.eSaasRouteNames.Editions).toBe('Saas::Editions');
  });
});

describe('named imports from enums', () => {
  it('should support named import of eSaasComponents', async () => {
    const { eSaasComponents } = await import('../../enums');
    expect(eSaasComponents.Editions).toBe('Saas.EditionsComponent');
  });

  it('should support named import of eSaasRouteNames', async () => {
    const { eSaasRouteNames } = await import('../../enums');
    expect(eSaasRouteNames.Tenants).toBe('Saas::Tenants');
  });

  it('should support named import of SaasComponentKey type (compile-time check)', () => {
    // This is a compile-time check - if this compiles, the type is exported correctly
    const key: enums.SaasComponentKey = 'Saas.EditionsComponent';
    expect(key).toBe(enums.eSaasComponents.Editions);
  });

  it('should support named import of SaasRouteNameKey type (compile-time check)', () => {
    // This is a compile-time check - if this compiles, the type is exported correctly
    const key: enums.SaasRouteNameKey = 'Saas::Tenants';
    expect(key).toBe(enums.eSaasRouteNames.Tenants);
  });
});
