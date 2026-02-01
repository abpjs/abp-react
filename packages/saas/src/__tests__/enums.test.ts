/**
 * Tests for SaaS enums
 * @abpjs/saas v2.4.0
 */
import { describe, it, expect } from 'vitest';
import { eSaasComponents } from '../enums';

describe('eSaasComponents (v2.4.0)', () => {
  describe('enum values', () => {
    it('should have Editions component identifier', () => {
      expect(eSaasComponents.Editions).toBe('Saas.EditionsComponent');
    });

    it('should have Tenants component identifier', () => {
      expect(eSaasComponents.Tenants).toBe('Saas.TenantsComponent');
    });
  });

  describe('enum structure', () => {
    it('should have exactly 2 members', () => {
      const enumKeys = Object.keys(eSaasComponents).filter(
        (key) => isNaN(Number(key))
      );
      expect(enumKeys).toHaveLength(2);
    });

    it('should have all expected keys', () => {
      const enumKeys = Object.keys(eSaasComponents).filter(
        (key) => isNaN(Number(key))
      );
      expect(enumKeys).toContain('Editions');
      expect(enumKeys).toContain('Tenants');
    });

    it('should have unique values', () => {
      const values = [
        eSaasComponents.Editions,
        eSaasComponents.Tenants,
      ];
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('type safety', () => {
    it('should be usable as object keys', () => {
      const componentRegistry: Record<eSaasComponents, string> = {
        [eSaasComponents.Editions]: 'EditionsComponent',
        [eSaasComponents.Tenants]: 'TenantsComponent',
      };

      expect(componentRegistry[eSaasComponents.Editions]).toBe('EditionsComponent');
      expect(componentRegistry[eSaasComponents.Tenants]).toBe('TenantsComponent');
    });

    it('should follow naming convention', () => {
      expect(eSaasComponents.Editions).toMatch(/^Saas\..+Component$/);
      expect(eSaasComponents.Tenants).toMatch(/^Saas\..+Component$/);
    });
  });

  describe('reverse mapping', () => {
    it('should not have numeric reverse mapping (string enum)', () => {
      // String enums do not have reverse mapping
      const numericKeys = Object.keys(eSaasComponents).filter(
        (key) => !isNaN(Number(key))
      );
      expect(numericKeys).toHaveLength(0);
    });
  });
});
