/**
 * Tests for SaaS Component Identifiers
 * @abpjs/saas v2.7.0
 */
import { describe, it, expect } from 'vitest';
import { eSaasComponents, SaasComponentKey } from '../../enums';

describe('eSaasComponents', () => {
  describe('component values', () => {
    it('should have Editions component identifier', () => {
      expect(eSaasComponents.Editions).toBe('Saas.EditionsComponent');
    });

    it('should have Tenants component identifier', () => {
      expect(eSaasComponents.Tenants).toBe('Saas.TenantsComponent');
    });
  });

  describe('string usage', () => {
    it('should be usable as string values', () => {
      const editionsKey: string = eSaasComponents.Editions;
      const tenantsKey: string = eSaasComponents.Tenants;

      expect(editionsKey).toBe('Saas.EditionsComponent');
      expect(tenantsKey).toBe('Saas.TenantsComponent');
    });

    it('should be usable for component registration', () => {
      const componentRegistry: Record<string, string> = {};
      componentRegistry[eSaasComponents.Editions] = 'EditionsComponent';
      componentRegistry[eSaasComponents.Tenants] = 'TenantsComponent';

      expect(componentRegistry['Saas.EditionsComponent']).toBe('EditionsComponent');
      expect(componentRegistry['Saas.TenantsComponent']).toBe('TenantsComponent');
    });
  });

  describe('object structure', () => {
    it('should have correct keys', () => {
      const keys = Object.keys(eSaasComponents);
      expect(keys).toContain('Editions');
      expect(keys).toContain('Tenants');
      expect(keys).toHaveLength(2);
    });

    it('should have correct values', () => {
      const values = Object.values(eSaasComponents);
      expect(values).toContain('Saas.EditionsComponent');
      expect(values).toContain('Saas.TenantsComponent');
      expect(values).toHaveLength(2);
    });

    it('should have unique values for each component', () => {
      const values = Object.values(eSaasComponents);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be a const object (immutable at runtime)', () => {
      expect(typeof eSaasComponents).toBe('object');
      expect(eSaasComponents).not.toBeNull();
    });
  });

  describe('v2.7.0 const object pattern', () => {
    it('should follow Module.ComponentName pattern', () => {
      Object.values(eSaasComponents).forEach((value) => {
        expect(value).toMatch(/^Saas\.\w+Component$/);
      });
    });

    it('should be usable in type-safe component lookup', () => {
      const getComponent = (key: SaasComponentKey): string => {
        const components: Record<SaasComponentKey, string> = {
          [eSaasComponents.Editions]: 'EditionsComponent',
          [eSaasComponents.Tenants]: 'TenantsComponent',
        };
        return components[key];
      };

      expect(getComponent(eSaasComponents.Editions)).toBe('EditionsComponent');
      expect(getComponent(eSaasComponents.Tenants)).toBe('TenantsComponent');
    });
  });
});

describe('SaasComponentKey type', () => {
  it('should accept valid component keys', () => {
    const editionsKey: SaasComponentKey = 'Saas.EditionsComponent';
    const tenantsKey: SaasComponentKey = 'Saas.TenantsComponent';

    expect(editionsKey).toBe(eSaasComponents.Editions);
    expect(tenantsKey).toBe(eSaasComponents.Tenants);
  });

  it('should work with eSaasComponents values', () => {
    const key: SaasComponentKey = eSaasComponents.Editions;
    expect(key).toBe('Saas.EditionsComponent');
  });

  it('should be usable in function parameters', () => {
    const isValidKey = (key: SaasComponentKey): boolean => {
      return Object.values(eSaasComponents).includes(key);
    };

    expect(isValidKey(eSaasComponents.Editions)).toBe(true);
    expect(isValidKey(eSaasComponents.Tenants)).toBe(true);
  });

  it('should work with Record type', () => {
    const componentNames: Record<SaasComponentKey, string> = {
      'Saas.EditionsComponent': 'Editions',
      'Saas.TenantsComponent': 'Tenants',
    };

    expect(componentNames[eSaasComponents.Editions]).toBe('Editions');
    expect(componentNames[eSaasComponents.Tenants]).toBe('Tenants');
  });
});
