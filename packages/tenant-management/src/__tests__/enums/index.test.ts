import { describe, it, expect } from 'vitest';
import * as enumsExports from '../../enums';

describe('enums barrel export', () => {
  describe('exported values', () => {
    it('should export eTenantManagementComponents', () => {
      expect(enumsExports.eTenantManagementComponents).toBeDefined();
      expect(typeof enumsExports.eTenantManagementComponents).toBe('object');
    });

    it('should export eTenantManagementRouteNames', () => {
      expect(enumsExports.eTenantManagementRouteNames).toBeDefined();
      expect(typeof enumsExports.eTenantManagementRouteNames).toBe('object');
    });
  });

  describe('export structure', () => {
    it('should have exactly 2 enum exports', () => {
      const exportKeys = Object.keys(enumsExports);
      // Filter out type-only exports (types don't exist at runtime)
      const valueExports = exportKeys.filter(
        (key) => typeof enumsExports[key as keyof typeof enumsExports] !== 'undefined'
      );
      expect(valueExports).toHaveLength(2);
    });

    it('should export enums with correct values', () => {
      expect(enumsExports.eTenantManagementComponents.Tenants).toBe(
        'TenantManagement.TenantsComponent'
      );
      expect(enumsExports.eTenantManagementRouteNames.Administration).toBe(
        'AbpUiNavigation::Menu:Administration'
      );
      expect(enumsExports.eTenantManagementRouteNames.TenantManagement).toBe(
        'AbpTenantManagement::Menu:TenantManagement'
      );
      expect(enumsExports.eTenantManagementRouteNames.Tenants).toBe(
        'AbpTenantManagement::Tenants'
      );
    });
  });

  describe('re-exports from individual files', () => {
    it('should re-export components enum correctly', () => {
      const { eTenantManagementComponents } = enumsExports;
      expect(Object.keys(eTenantManagementComponents)).toEqual(['Tenants']);
    });

    it('should re-export route-names enum correctly', () => {
      const { eTenantManagementRouteNames } = enumsExports;
      expect(Object.keys(eTenantManagementRouteNames)).toEqual([
        'Administration',
        'TenantManagement',
        'Tenants',
      ]);
    });
  });
});
