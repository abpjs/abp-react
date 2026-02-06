import { describe, it, expect } from 'vitest';
import * as configExports from '../../config';

describe('config barrel export', () => {
  describe('enums exports', () => {
    it('should export eTenantManagementPolicyNames', () => {
      expect(configExports.eTenantManagementPolicyNames).toBeDefined();
      expect(typeof configExports.eTenantManagementPolicyNames).toBe('object');
    });

    it('should export eTenantManagementRouteNames', () => {
      expect(configExports.eTenantManagementRouteNames).toBeDefined();
      expect(typeof configExports.eTenantManagementRouteNames).toBe('object');
    });

    it('should have correct policy names values', () => {
      expect(configExports.eTenantManagementPolicyNames.TenantManagement).toBe(
        'AbpTenantManagement.Tenants'
      );
      expect(configExports.eTenantManagementPolicyNames.Tenants).toBe(
        'AbpTenantManagement.Tenants'
      );
    });

    it('should have correct route names values', () => {
      expect(configExports.eTenantManagementRouteNames.TenantManagement).toBe(
        'AbpTenantManagement::Menu:TenantManagement'
      );
      expect(configExports.eTenantManagementRouteNames.Tenants).toBe(
        'AbpTenantManagement::Tenants'
      );
    });
  });

  describe('providers exports', () => {
    it('should export configureRoutes', () => {
      expect(configExports.configureRoutes).toBeDefined();
      expect(typeof configExports.configureRoutes).toBe('function');
    });

    it('should export TENANT_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(configExports.TENANT_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
      expect(typeof configExports.TENANT_MANAGEMENT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should export initializeTenantManagementRoutes', () => {
      expect(configExports.initializeTenantManagementRoutes).toBeDefined();
      expect(typeof configExports.initializeTenantManagementRoutes).toBe('function');
    });
  });

  describe('export completeness', () => {
    it('should have exactly 5 exports', () => {
      const exportKeys = Object.keys(configExports);
      expect(exportKeys).toHaveLength(5);
    });

    it('should contain all v3.0.0 config exports', () => {
      expect(configExports).toHaveProperty('eTenantManagementPolicyNames');
      expect(configExports).toHaveProperty('eTenantManagementRouteNames');
      expect(configExports).toHaveProperty('configureRoutes');
      expect(configExports).toHaveProperty('TENANT_MANAGEMENT_ROUTE_PROVIDERS');
      expect(configExports).toHaveProperty('initializeTenantManagementRoutes');
    });
  });

  describe('v3.0.0 config subpackage', () => {
    it('should provide all necessary configuration for route setup', () => {
      // Verify that all necessary exports are available for route configuration
      const routeConfig = {
        name: configExports.eTenantManagementRouteNames.TenantManagement,
        requiredPolicy: configExports.eTenantManagementPolicyNames.TenantManagement,
      };

      expect(routeConfig.name).toBe('AbpTenantManagement::Menu:TenantManagement');
      expect(routeConfig.requiredPolicy).toBe('AbpTenantManagement.Tenants');
    });

    it('should have TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes as a function', () => {
      expect(typeof configExports.TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe(
        'function'
      );
    });

    it('should have TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes reference configureRoutes', () => {
      expect(configExports.TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe(
        configExports.configureRoutes
      );
    });
  });

  describe('backward compatibility', () => {
    it('should not include deprecated Administration route name', () => {
      const routeNameKeys = Object.keys(configExports.eTenantManagementRouteNames);
      expect(routeNameKeys).not.toContain('Administration');
    });
  });
});
