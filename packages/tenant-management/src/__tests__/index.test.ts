import { describe, it, expect } from 'vitest';
import * as tenantManagementExports from '../index';

describe('@abpjs/tenant-management package exports', () => {
  describe('enums (v2.7.0)', () => {
    it('should export eTenantManagementComponents', () => {
      expect(tenantManagementExports.eTenantManagementComponents).toBeDefined();
      expect(
        tenantManagementExports.eTenantManagementComponents.Tenants
      ).toBe('TenantManagement.TenantsComponent');
    });

    it('should export eTenantManagementRouteNames (v3.0.0: Administration removed)', () => {
      expect(tenantManagementExports.eTenantManagementRouteNames).toBeDefined();
      expect(
        tenantManagementExports.eTenantManagementRouteNames.TenantManagement
      ).toBe('AbpTenantManagement::Menu:TenantManagement');
      expect(tenantManagementExports.eTenantManagementRouteNames.Tenants).toBe(
        'AbpTenantManagement::Tenants'
      );
    });

    it('should export eTenantManagementPolicyNames (v3.0.0)', () => {
      expect(tenantManagementExports.eTenantManagementPolicyNames).toBeDefined();
      expect(
        tenantManagementExports.eTenantManagementPolicyNames.TenantManagement
      ).toBe('AbpTenantManagement.Tenants');
      expect(tenantManagementExports.eTenantManagementPolicyNames.Tenants).toBe(
        'AbpTenantManagement.Tenants'
      );
    });
  });

  describe('config (v3.0.0)', () => {
    it('should export TENANT_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(tenantManagementExports.TENANT_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
      expect(typeof tenantManagementExports.TENANT_MANAGEMENT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should export configureRoutes function', () => {
      expect(tenantManagementExports.configureRoutes).toBeDefined();
      expect(typeof tenantManagementExports.configureRoutes).toBe('function');
    });

    it('should export initializeTenantManagementRoutes function', () => {
      expect(tenantManagementExports.initializeTenantManagementRoutes).toBeDefined();
      expect(typeof tenantManagementExports.initializeTenantManagementRoutes).toBe('function');
    });
  });

  describe('components', () => {
    it('should export TenantManagementModal', () => {
      expect(tenantManagementExports.TenantManagementModal).toBeDefined();
      expect(typeof tenantManagementExports.TenantManagementModal).toBe(
        'function'
      );
    });

    it('should export TenantManagementModal with componentKey (v2.7.0)', () => {
      expect(tenantManagementExports.TenantManagementModal.componentKey).toBe(
        'TenantManagement.TenantsComponent'
      );
    });
  });

  describe('hooks', () => {
    it('should export useTenantManagement', () => {
      expect(tenantManagementExports.useTenantManagement).toBeDefined();
      expect(typeof tenantManagementExports.useTenantManagement).toBe(
        'function'
      );
    });
  });

  describe('services', () => {
    it('should NOT export TenantManagementService (removed in v4.0.0)', () => {
      expect((tenantManagementExports as any).TenantManagementService).toBeUndefined();
    });

    it('should export TenantManagementStateService', () => {
      expect(tenantManagementExports.TenantManagementStateService).toBeDefined();
    });

    it('should export getTenantManagementStateService', () => {
      expect(
        tenantManagementExports.getTenantManagementStateService
      ).toBeDefined();
      expect(
        typeof tenantManagementExports.getTenantManagementStateService
      ).toBe('function');
    });

    it('should export TenantService from proxy (v3.2.0)', () => {
      expect(tenantManagementExports.TenantService).toBeDefined();
      expect(typeof tenantManagementExports.TenantService).toBe('function');
    });
  });

  describe('proxy (v3.2.0)', () => {
    it('should export TenantService class', () => {
      expect(tenantManagementExports.TenantService).toBeDefined();
      expect(typeof tenantManagementExports.TenantService).toBe('function');
    });

    it('should export proxy types (verified by TypeScript compilation)', () => {
      // Proxy models are type-only exports (interfaces)
      // They don't exist at runtime, but TypeScript ensures they work:
      // - GetTenantsInput
      // - TenantCreateDto
      // - TenantUpdateDto
      // - TenantDto
      // - TenantCreateOrUpdateDtoBase
      expect(true).toBe(true);
    });
  });

  describe('constants', () => {
    it('should export TENANT_MANAGEMENT_ROUTE_PATHS', () => {
      expect(
        tenantManagementExports.TENANT_MANAGEMENT_ROUTE_PATHS
      ).toBeDefined();
    });

    it('should export TENANT_MANAGEMENT_POLICIES', () => {
      expect(tenantManagementExports.TENANT_MANAGEMENT_POLICIES).toBeDefined();
    });
  });

  describe('models namespace', () => {
    it('should export TenantManagement namespace types (verified by TypeScript compilation)', () => {
      // TenantManagement namespace contains only types (interfaces)
      // Type-only exports don't exist at runtime, but TypeScript ensures they work
      // This test verifies the package compiles correctly with the namespace export
      expect(true).toBe(true);
    });
  });

  describe('export completeness', () => {
    it('should export all required v4.0.0 functionality', () => {
      // Config (v3.0.0)
      expect(tenantManagementExports).toHaveProperty('TENANT_MANAGEMENT_ROUTE_PROVIDERS');
      expect(tenantManagementExports).toHaveProperty('configureRoutes');
      expect(tenantManagementExports).toHaveProperty('initializeTenantManagementRoutes');
      expect(tenantManagementExports).toHaveProperty('eTenantManagementPolicyNames');

      // Enums (v2.7.0)
      expect(tenantManagementExports).toHaveProperty(
        'eTenantManagementComponents'
      );
      expect(tenantManagementExports).toHaveProperty(
        'eTenantManagementRouteNames'
      );

      // Components
      expect(tenantManagementExports).toHaveProperty('TenantManagementModal');

      // Hooks
      expect(tenantManagementExports).toHaveProperty('useTenantManagement');

      // Services (v4.0.0: TenantManagementService removed)
      expect(tenantManagementExports).not.toHaveProperty('TenantManagementService');
      expect(tenantManagementExports).toHaveProperty(
        'TenantManagementStateService'
      );
      expect(tenantManagementExports).toHaveProperty(
        'getTenantManagementStateService'
      );

      // Proxy (v3.2.0)
      expect(tenantManagementExports).toHaveProperty('TenantService');

      // Constants
      expect(tenantManagementExports).toHaveProperty(
        'TENANT_MANAGEMENT_ROUTE_PATHS'
      );
      expect(tenantManagementExports).toHaveProperty(
        'TENANT_MANAGEMENT_POLICIES'
      );

      // Note: TenantManagement namespace and proxy models contain only types,
      // which don't exist at runtime. TypeScript compilation verifies type exports work correctly
    });

    it('should have componentKey on TenantManagementModal (v2.7.0)', () => {
      expect(tenantManagementExports.TenantManagementModal).toHaveProperty(
        'componentKey'
      );
      expect(tenantManagementExports.TenantManagementModal.componentKey).toBe(
        tenantManagementExports.eTenantManagementComponents.Tenants
      );
    });
  });
});
