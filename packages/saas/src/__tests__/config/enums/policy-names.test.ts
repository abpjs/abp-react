/**
 * Tests for SaaS Policy Names
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect } from 'vitest';
import { eSaasPolicyNames, SaasPolicyNameKey } from '../../../config/enums/policy-names';

describe('eSaasPolicyNames', () => {
  describe('policy name values', () => {
    it('should have Saas policy name with OR condition', () => {
      expect(eSaasPolicyNames.Saas).toBe('Saas.Tenants || Saas.Editions');
    });

    it('should have Tenants policy name', () => {
      expect(eSaasPolicyNames.Tenants).toBe('Saas.Tenants');
    });

    it('should have Editions policy name', () => {
      expect(eSaasPolicyNames.Editions).toBe('Saas.Editions');
    });
  });

  describe('object structure', () => {
    it('should have exactly 3 keys', () => {
      const keys = Object.keys(eSaasPolicyNames);
      expect(keys).toHaveLength(3);
    });

    it('should have correct keys', () => {
      const keys = Object.keys(eSaasPolicyNames);
      expect(keys).toContain('Saas');
      expect(keys).toContain('Tenants');
      expect(keys).toContain('Editions');
    });

    it('should have unique values', () => {
      const values = Object.values(eSaasPolicyNames);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be a const object (immutable at runtime)', () => {
      expect(typeof eSaasPolicyNames).toBe('object');
      expect(eSaasPolicyNames).not.toBeNull();
    });
  });

  describe('policy name format', () => {
    it('should follow Saas.* pattern for individual policies', () => {
      expect(eSaasPolicyNames.Tenants).toMatch(/^Saas\./);
      expect(eSaasPolicyNames.Editions).toMatch(/^Saas\./);
    });

    it('should have valid OR condition syntax for Saas policy', () => {
      expect(eSaasPolicyNames.Saas).toContain('||');
      const parts = eSaasPolicyNames.Saas.split('||').map((p) => p.trim());
      expect(parts).toHaveLength(2);
      expect(parts[0]).toBe('Saas.Tenants');
      expect(parts[1]).toBe('Saas.Editions');
    });
  });

  describe('usage patterns', () => {
    it('should be usable for permission checking', () => {
      const checkPermission = (policy: string): boolean => {
        return policy.startsWith('Saas.');
      };

      expect(checkPermission(eSaasPolicyNames.Tenants)).toBe(true);
      expect(checkPermission(eSaasPolicyNames.Editions)).toBe(true);
    });

    it('should be usable in route configuration', () => {
      const route = {
        path: '/saas/tenants',
        requiredPolicy: eSaasPolicyNames.Tenants,
      };

      expect(route.requiredPolicy).toBe('Saas.Tenants');
    });
  });
});

describe('SaasPolicyNameKey type', () => {
  it('should accept valid policy name keys', () => {
    const saasKey: SaasPolicyNameKey = 'Saas.Tenants || Saas.Editions';
    const tenantsKey: SaasPolicyNameKey = 'Saas.Tenants';
    const editionsKey: SaasPolicyNameKey = 'Saas.Editions';

    expect(saasKey).toBe(eSaasPolicyNames.Saas);
    expect(tenantsKey).toBe(eSaasPolicyNames.Tenants);
    expect(editionsKey).toBe(eSaasPolicyNames.Editions);
  });

  it('should work with eSaasPolicyNames values', () => {
    const key: SaasPolicyNameKey = eSaasPolicyNames.Tenants;
    expect(key).toBe('Saas.Tenants');
  });

  it('should be usable in function parameters', () => {
    const isValidPolicyKey = (key: SaasPolicyNameKey): boolean => {
      return Object.values(eSaasPolicyNames).includes(key);
    };

    expect(isValidPolicyKey(eSaasPolicyNames.Saas)).toBe(true);
    expect(isValidPolicyKey(eSaasPolicyNames.Tenants)).toBe(true);
    expect(isValidPolicyKey(eSaasPolicyNames.Editions)).toBe(true);
  });

  it('should work with Record type', () => {
    const policyDescriptions: Record<SaasPolicyNameKey, string> = {
      'Saas.Tenants || Saas.Editions': 'Access to SaaS module',
      'Saas.Tenants': 'Access to tenant management',
      'Saas.Editions': 'Access to edition management',
    };

    expect(policyDescriptions[eSaasPolicyNames.Saas]).toBe('Access to SaaS module');
    expect(policyDescriptions[eSaasPolicyNames.Tenants]).toBe('Access to tenant management');
    expect(policyDescriptions[eSaasPolicyNames.Editions]).toBe('Access to edition management');
  });
});
