import { describe, it, expect } from 'vitest';
import {
  TENANT_MANAGEMENT_ROUTES,
  TENANT_MANAGEMENT_ROUTE_PATHS,
  TENANT_MANAGEMENT_POLICIES,
} from '../constants/routes';

describe('Tenant Management Route Constants', () => {
  describe('TENANT_MANAGEMENT_ROUTES', () => {
    it('should have routes property with array of routes (v0.9.0 format)', () => {
      expect(TENANT_MANAGEMENT_ROUTES).toHaveProperty('routes');
      expect(Array.isArray(TENANT_MANAGEMENT_ROUTES.routes)).toBe(true);
    });

    it('should have Administration wrapper route', () => {
      const adminRoute = TENANT_MANAGEMENT_ROUTES.routes.find(
        (r) => r.name === 'AbpUiNavigation::Menu:Administration'
      );
      expect(adminRoute).toBeDefined();
      expect(adminRoute?.wrapper).toBe(true);
      expect(adminRoute?.path).toBe('');
      expect(adminRoute?.order).toBe(1);
    });

    it('should have Tenant Management route with correct configuration', () => {
      const tmRoute = TENANT_MANAGEMENT_ROUTES.routes.find(
        (r) => r.name === 'AbpTenantManagement::Menu:TenantManagement'
      );
      expect(tmRoute).toBeDefined();
      expect(tmRoute?.path).toBe('tenant-management');
      expect(tmRoute?.order).toBe(2);
      expect(tmRoute?.parentName).toBe('AbpUiNavigation::Menu:Administration');
      expect(tmRoute?.layout).toBeDefined();
      expect(tmRoute?.requiredPolicy).toBe('AbpTenantManagement.Tenants');
    });

    it('should have Tenants child route', () => {
      const tmRoute = TENANT_MANAGEMENT_ROUTES.routes.find(
        (r) => r.name === 'AbpTenantManagement::Menu:TenantManagement'
      );
      expect(tmRoute?.children).toBeDefined();
      expect(tmRoute?.children?.length).toBeGreaterThan(0);

      const tenantsRoute = tmRoute?.children?.find(
        (r) => r.name === 'AbpTenantManagement::Tenants'
      );
      expect(tenantsRoute).toBeDefined();
      expect(tenantsRoute?.path).toBe('tenants');
      expect(tenantsRoute?.order).toBe(1);
      expect(tenantsRoute?.requiredPolicy).toBe('AbpTenantManagement.Tenants');
    });
  });

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
});
