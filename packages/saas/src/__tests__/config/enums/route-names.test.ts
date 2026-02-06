/**
 * Tests for SaaS Config Route Names
 * @abpjs/saas v3.0.0
 *
 * Tests the config/enums/route-names.ts file (the canonical source)
 */
import { describe, it, expect } from 'vitest';
import {
  eSaasRouteNames,
  SaasRouteNameKey,
} from '../../../config/enums/route-names';

describe('eSaasRouteNames (config)', () => {
  describe('route name values', () => {
    it('should have Saas route name', () => {
      expect(eSaasRouteNames.Saas).toBe('Saas::Menu:Saas');
    });

    it('should have Tenants route name', () => {
      expect(eSaasRouteNames.Tenants).toBe('Saas::Tenants');
    });

    it('should have Editions route name', () => {
      expect(eSaasRouteNames.Editions).toBe('Saas::Editions');
    });

    it('should NOT have Administration (removed in v3.0.0)', () => {
      // @ts-expect-error - Administration was removed in v3.0.0
      expect(eSaasRouteNames.Administration).toBeUndefined();
    });
  });

  describe('object structure', () => {
    it('should have exactly 3 keys', () => {
      const keys = Object.keys(eSaasRouteNames);
      expect(keys).toHaveLength(3);
    });

    it('should have correct keys', () => {
      const keys = Object.keys(eSaasRouteNames);
      expect(keys).toContain('Saas');
      expect(keys).toContain('Tenants');
      expect(keys).toContain('Editions');
      expect(keys).not.toContain('Administration');
    });

    it('should have unique values', () => {
      const values = Object.values(eSaasRouteNames);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('localization key format', () => {
    it('should follow Saas:: pattern', () => {
      Object.values(eSaasRouteNames).forEach((value) => {
        expect(value).toMatch(/^Saas::/);
      });
    });

    it('should have valid format with module::key', () => {
      Object.values(eSaasRouteNames).forEach((value) => {
        const parts = value.split('::');
        expect(parts).toHaveLength(2);
        expect(parts[0]).toBe('Saas');
        expect(parts[1].length).toBeGreaterThan(0);
      });
    });
  });
});

describe('SaasRouteNameKey type (config)', () => {
  it('should accept valid route name keys', () => {
    const saasKey: SaasRouteNameKey = 'Saas::Menu:Saas';
    const tenantsKey: SaasRouteNameKey = 'Saas::Tenants';
    const editionsKey: SaasRouteNameKey = 'Saas::Editions';

    expect(saasKey).toBe(eSaasRouteNames.Saas);
    expect(tenantsKey).toBe(eSaasRouteNames.Tenants);
    expect(editionsKey).toBe(eSaasRouteNames.Editions);
  });

  it('should be usable in Record types', () => {
    const routePaths: Record<SaasRouteNameKey, string> = {
      'Saas::Menu:Saas': '/saas',
      'Saas::Tenants': '/saas/tenants',
      'Saas::Editions': '/saas/editions',
    };

    expect(routePaths[eSaasRouteNames.Saas]).toBe('/saas');
    expect(routePaths[eSaasRouteNames.Tenants]).toBe('/saas/tenants');
    expect(routePaths[eSaasRouteNames.Editions]).toBe('/saas/editions');
  });
});
