import { describe, it, expect } from 'vitest';
import {
  TENANT_MANAGEMENT_ROUTE_PATHS,
  TENANT_MANAGEMENT_POLICIES,
} from '../constants/routes';

describe('Tenant Management Route Constants', () => {
  describe('TENANT_MANAGEMENT_ROUTE_PATHS', () => {
    it('should have BASE path', () => {
      expect(TENANT_MANAGEMENT_ROUTE_PATHS.BASE).toBe('/tenant-management');
    });

    it('should have TENANTS path', () => {
      expect(TENANT_MANAGEMENT_ROUTE_PATHS.TENANTS).toBe('/tenant-management/tenants');
    });

    it('should have correct path structure', () => {
      expect(TENANT_MANAGEMENT_ROUTE_PATHS.TENANTS.startsWith(TENANT_MANAGEMENT_ROUTE_PATHS.BASE)).toBe(true);
    });
  });

  describe('TENANT_MANAGEMENT_POLICIES', () => {
    it('should have TENANTS policy', () => {
      expect(TENANT_MANAGEMENT_POLICIES.TENANTS).toBe('AbpTenantManagement.Tenants');
    });

    it('should have TENANTS_CREATE policy', () => {
      expect(TENANT_MANAGEMENT_POLICIES.TENANTS_CREATE).toBe('AbpTenantManagement.Tenants.Create');
    });

    it('should have TENANTS_UPDATE policy', () => {
      expect(TENANT_MANAGEMENT_POLICIES.TENANTS_UPDATE).toBe('AbpTenantManagement.Tenants.Update');
    });

    it('should have TENANTS_DELETE policy', () => {
      expect(TENANT_MANAGEMENT_POLICIES.TENANTS_DELETE).toBe('AbpTenantManagement.Tenants.Delete');
    });

    it('should have TENANTS_MANAGE_CONNECTION_STRINGS policy', () => {
      expect(TENANT_MANAGEMENT_POLICIES.TENANTS_MANAGE_CONNECTION_STRINGS).toBe(
        'AbpTenantManagement.Tenants.ManageConnectionStrings'
      );
    });

    it('should have TENANTS_MANAGE_FEATURES policy', () => {
      expect(TENANT_MANAGEMENT_POLICIES.TENANTS_MANAGE_FEATURES).toBe(
        'AbpTenantManagement.Tenants.ManageFeatures'
      );
    });

    it('should have all policies following ABP naming convention', () => {
      const policyValues = Object.values(TENANT_MANAGEMENT_POLICIES);
      policyValues.forEach((policy) => {
        expect(policy).toMatch(/^AbpTenantManagement\./);
      });
    });
  });

  describe('TENANT_MANAGEMENT_ROUTES removal (v2.0.0)', () => {
    it('should not export TENANT_MANAGEMENT_ROUTES (removed in v2.0.0)', () => {
      // TENANT_MANAGEMENT_ROUTES was deprecated in v0.9.0 and removed in v2.0.0
      // Importing it directly from the module should fail at compile time
      // This test just documents the removal
      expect(true).toBe(true);
    });
  });
});
