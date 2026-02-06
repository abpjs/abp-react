import { describe, it, expect } from 'vitest';
import * as configEnumsExports from '../../../config/enums';

describe('config/enums barrel export', () => {
  describe('exported values', () => {
    it('should export eTenantManagementPolicyNames', () => {
      expect(configEnumsExports.eTenantManagementPolicyNames).toBeDefined();
      expect(typeof configEnumsExports.eTenantManagementPolicyNames).toBe('object');
    });

    it('should export eTenantManagementRouteNames', () => {
      expect(configEnumsExports.eTenantManagementRouteNames).toBeDefined();
      expect(typeof configEnumsExports.eTenantManagementRouteNames).toBe('object');
    });
  });

  describe('export structure', () => {
    it('should have exactly 2 enum exports', () => {
      const exportKeys = Object.keys(configEnumsExports);
      // Filter out type-only exports (types don't exist at runtime)
      const valueExports = exportKeys.filter(
        (key) =>
          typeof configEnumsExports[key as keyof typeof configEnumsExports] !== 'undefined'
      );
      expect(valueExports).toHaveLength(2);
    });

    it('should export policy names with correct values', () => {
      expect(configEnumsExports.eTenantManagementPolicyNames.TenantManagement).toBe(
        'AbpTenantManagement.Tenants'
      );
      expect(configEnumsExports.eTenantManagementPolicyNames.Tenants).toBe(
        'AbpTenantManagement.Tenants'
      );
    });

    it('should export route names with correct values', () => {
      expect(configEnumsExports.eTenantManagementRouteNames.TenantManagement).toBe(
        'AbpTenantManagement::Menu:TenantManagement'
      );
      expect(configEnumsExports.eTenantManagementRouteNames.Tenants).toBe(
        'AbpTenantManagement::Tenants'
      );
    });
  });

  describe('re-exports from individual files', () => {
    it('should re-export policy-names enum correctly', () => {
      const { eTenantManagementPolicyNames } = configEnumsExports;
      expect(Object.keys(eTenantManagementPolicyNames)).toEqual([
        'TenantManagement',
        'Tenants',
      ]);
    });

    it('should re-export route-names enum correctly', () => {
      const { eTenantManagementRouteNames } = configEnumsExports;
      expect(Object.keys(eTenantManagementRouteNames)).toEqual([
        'TenantManagement',
        'Tenants',
      ]);
    });
  });

  describe('v3.0.0 config enums', () => {
    it('should contain all v3.0.0 config enums', () => {
      expect(configEnumsExports).toHaveProperty('eTenantManagementPolicyNames');
      expect(configEnumsExports).toHaveProperty('eTenantManagementRouteNames');
    });

    it('should have route names without Administration key', () => {
      const routeNameKeys = Object.keys(configEnumsExports.eTenantManagementRouteNames);
      expect(routeNameKeys).not.toContain('Administration');
    });
  });
});
