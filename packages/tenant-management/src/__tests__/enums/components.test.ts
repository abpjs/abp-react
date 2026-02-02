import { describe, it, expect } from 'vitest';
import {
  eTenantManagementComponents,
  type TenantManagementComponentKey,
} from '../../enums/components';

describe('eTenantManagementComponents', () => {
  describe('enum values', () => {
    it('should have Tenants key with correct value', () => {
      expect(eTenantManagementComponents.Tenants).toBe(
        'TenantManagement.TenantsComponent'
      );
    });

    it('should have exactly 1 key', () => {
      const keys = Object.keys(eTenantManagementComponents);
      expect(keys).toHaveLength(1);
    });

    it('should contain the Tenants key', () => {
      expect('Tenants' in eTenantManagementComponents).toBe(true);
    });
  });

  describe('enum structure', () => {
    it('should be an object', () => {
      expect(typeof eTenantManagementComponents).toBe('object');
    });

    it('should not be null', () => {
      expect(eTenantManagementComponents).not.toBeNull();
    });

    it('should have string values', () => {
      Object.values(eTenantManagementComponents).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have values following the pattern Module.ComponentName', () => {
      Object.values(eTenantManagementComponents).forEach((value) => {
        expect(value).toMatch(/^[\w]+\.[\w]+$/);
      });
    });
  });

  describe('type safety', () => {
    it('should allow type assignment for valid keys', () => {
      const key: TenantManagementComponentKey =
        eTenantManagementComponents.Tenants;
      expect(key).toBe('TenantManagement.TenantsComponent');
    });

    it('should have correct type for Tenants value', () => {
      const value = eTenantManagementComponents.Tenants;
      expect(value).toBe('TenantManagement.TenantsComponent');
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      const componentKey = eTenantManagementComponents.Tenants;
      let result = '';

      switch (componentKey) {
        case eTenantManagementComponents.Tenants:
          result = 'tenants';
          break;
        default:
          result = 'unknown';
      }

      expect(result).toBe('tenants');
    });

    it('should work with Object.entries', () => {
      const entries = Object.entries(eTenantManagementComponents);
      expect(entries).toEqual([
        ['Tenants', 'TenantManagement.TenantsComponent'],
      ]);
    });

    it('should work with Object.values', () => {
      const values = Object.values(eTenantManagementComponents);
      expect(values).toEqual(['TenantManagement.TenantsComponent']);
    });

    it('should work with Object.keys', () => {
      const keys = Object.keys(eTenantManagementComponents);
      expect(keys).toEqual(['Tenants']);
    });

    it('should be usable for component lookup', () => {
      const componentRegistry: Record<TenantManagementComponentKey, string> = {
        [eTenantManagementComponents.Tenants]: 'TenantManagementModal',
      };

      expect(
        componentRegistry[eTenantManagementComponents.Tenants]
      ).toBe('TenantManagementModal');
    });
  });
});
