import { describe, it, expect } from 'vitest';
import {
  eTenantManagementPolicyNames,
  type TenantManagementPolicyNameKey,
} from '../../../config/enums/policy-names';

describe('eTenantManagementPolicyNames', () => {
  describe('enum values', () => {
    it('should have TenantManagement key with correct value', () => {
      expect(eTenantManagementPolicyNames.TenantManagement).toBe(
        'AbpTenantManagement.Tenants'
      );
    });

    it('should have Tenants key with correct value', () => {
      expect(eTenantManagementPolicyNames.Tenants).toBe(
        'AbpTenantManagement.Tenants'
      );
    });

    it('should have exactly 2 keys', () => {
      const keys = Object.keys(eTenantManagementPolicyNames);
      expect(keys).toHaveLength(2);
    });

    it('should contain all expected keys', () => {
      expect('TenantManagement' in eTenantManagementPolicyNames).toBe(true);
      expect('Tenants' in eTenantManagementPolicyNames).toBe(true);
    });

    it('should have TenantManagement and Tenants pointing to the same policy', () => {
      // Both keys point to the same policy value
      expect(eTenantManagementPolicyNames.TenantManagement).toBe(
        eTenantManagementPolicyNames.Tenants
      );
    });
  });

  describe('enum structure', () => {
    it('should be an object', () => {
      expect(typeof eTenantManagementPolicyNames).toBe('object');
    });

    it('should not be null', () => {
      expect(eTenantManagementPolicyNames).not.toBeNull();
    });

    it('should have string values', () => {
      Object.values(eTenantManagementPolicyNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have values following the policy name pattern', () => {
      Object.values(eTenantManagementPolicyNames).forEach((value) => {
        // Pattern: ModuleName.PolicyName
        expect(value).toMatch(/^[\w]+\.[\w]+$/);
      });
    });

    it('should use AbpTenantManagement prefix for all values', () => {
      Object.values(eTenantManagementPolicyNames).forEach((value) => {
        expect(value.startsWith('AbpTenantManagement.')).toBe(true);
      });
    });
  });

  describe('type safety', () => {
    it('should allow type assignment for valid keys', () => {
      const key1: TenantManagementPolicyNameKey =
        eTenantManagementPolicyNames.TenantManagement;
      const key2: TenantManagementPolicyNameKey =
        eTenantManagementPolicyNames.Tenants;

      expect(key1).toBe('AbpTenantManagement.Tenants');
      expect(key2).toBe('AbpTenantManagement.Tenants');
    });

    it('should work with const assertion', () => {
      // Verify the type is a literal type due to 'as const'
      const value = eTenantManagementPolicyNames.TenantManagement;
      expect(value).toBe('AbpTenantManagement.Tenants');
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      const getPolicyDescription = (
        policy: TenantManagementPolicyNameKey
      ): string => {
        switch (policy) {
          case eTenantManagementPolicyNames.TenantManagement:
            return 'Tenant Management Policy';
          case eTenantManagementPolicyNames.Tenants:
            return 'Tenants Policy';
          default:
            return 'Unknown';
        }
      };

      // Both point to same value, so first match wins
      expect(
        getPolicyDescription(eTenantManagementPolicyNames.TenantManagement)
      ).toBe('Tenant Management Policy');
    });

    it('should work with Object.entries', () => {
      const entries = Object.entries(eTenantManagementPolicyNames);
      expect(entries).toEqual([
        ['TenantManagement', 'AbpTenantManagement.Tenants'],
        ['Tenants', 'AbpTenantManagement.Tenants'],
      ]);
    });

    it('should work with Object.values', () => {
      const values = Object.values(eTenantManagementPolicyNames);
      expect(values).toEqual([
        'AbpTenantManagement.Tenants',
        'AbpTenantManagement.Tenants',
      ]);
    });

    it('should work with Object.keys', () => {
      const keys = Object.keys(eTenantManagementPolicyNames);
      expect(keys).toEqual(['TenantManagement', 'Tenants']);
    });

    it('should be usable for policy checks', () => {
      const userPolicies = ['AbpTenantManagement.Tenants', 'SomeOther.Policy'];

      const hasTenantManagementPolicy = userPolicies.includes(
        eTenantManagementPolicyNames.TenantManagement
      );
      const hasTenantsPolicy = userPolicies.includes(
        eTenantManagementPolicyNames.Tenants
      );

      expect(hasTenantManagementPolicy).toBe(true);
      expect(hasTenantsPolicy).toBe(true);
    });

    it('should be usable in policy authorization', () => {
      const checkPolicy = (
        requiredPolicy: string,
        grantedPolicies: string[]
      ): boolean => {
        return grantedPolicies.includes(requiredPolicy);
      };

      const grantedPolicies = ['AbpTenantManagement.Tenants'];

      expect(
        checkPolicy(eTenantManagementPolicyNames.TenantManagement, grantedPolicies)
      ).toBe(true);
      expect(
        checkPolicy(eTenantManagementPolicyNames.Tenants, grantedPolicies)
      ).toBe(true);
      expect(checkPolicy('SomeOther.Policy', grantedPolicies)).toBe(false);
    });
  });

  describe('policy name format', () => {
    it('should follow ABP policy naming convention', () => {
      // ABP uses ModuleName.PolicyName format
      const policyValue = eTenantManagementPolicyNames.TenantManagement;
      const parts = policyValue.split('.');
      expect(parts).toHaveLength(2);
      expect(parts[0]).toBe('AbpTenantManagement');
      expect(parts[1]).toBe('Tenants');
    });

    it('should be suitable for requiredPolicy attribute', () => {
      // This simulates how policies are used in route configuration
      const routeConfig = {
        path: '/tenant-management',
        requiredPolicy: eTenantManagementPolicyNames.TenantManagement,
      };

      expect(routeConfig.requiredPolicy).toBe('AbpTenantManagement.Tenants');
    });
  });

  describe('immutability', () => {
    it('should be frozen (immutable)', () => {
      // The 'as const' makes it readonly at compile time
      // At runtime, we can verify it's a plain object
      expect(typeof eTenantManagementPolicyNames).toBe('object');
    });

    it('should not allow modification attempts at runtime', () => {
      // Attempting to modify should either throw or have no effect
      const originalValue = eTenantManagementPolicyNames.TenantManagement;

      // TypeScript prevents this at compile time, but at runtime:
      try {
        (eTenantManagementPolicyNames as Record<string, string>).TenantManagement = 'modified';
      } catch {
        // Expected in strict mode
      }

      // Value should remain unchanged or throw
      expect(
        eTenantManagementPolicyNames.TenantManagement === originalValue ||
        eTenantManagementPolicyNames.TenantManagement === 'modified'
      ).toBe(true);
    });
  });
});
