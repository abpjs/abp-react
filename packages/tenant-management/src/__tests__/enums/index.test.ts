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

    it('should export eTenantManagementPolicyNames (v3.0.0)', () => {
      expect(enumsExports.eTenantManagementPolicyNames).toBeDefined();
      expect(typeof enumsExports.eTenantManagementPolicyNames).toBe('object');
    });
  });

  describe('export structure', () => {
    it('should have 3 enum exports (v3.0.0: added eTenantManagementPolicyNames)', () => {
      const exportKeys = Object.keys(enumsExports);
      // Filter out type-only exports (types don't exist at runtime)
      const valueExports = exportKeys.filter(
        (key) => typeof enumsExports[key as keyof typeof enumsExports] !== 'undefined'
      );
      expect(valueExports).toHaveLength(3);
    });

    it('should export enums with correct values', () => {
      expect(enumsExports.eTenantManagementComponents.Tenants).toBe(
        'TenantManagement.TenantsComponent'
      );
      expect(enumsExports.eTenantManagementRouteNames.TenantManagement).toBe(
        'AbpTenantManagement::Menu:TenantManagement'
      );
      expect(enumsExports.eTenantManagementRouteNames.Tenants).toBe(
        'AbpTenantManagement::Tenants'
      );
    });

    it('should export policy names with correct values (v3.0.0)', () => {
      expect(enumsExports.eTenantManagementPolicyNames.TenantManagement).toBe(
        'AbpTenantManagement.Tenants'
      );
      expect(enumsExports.eTenantManagementPolicyNames.Tenants).toBe(
        'AbpTenantManagement.Tenants'
      );
    });
  });

  describe('re-exports from individual files', () => {
    it('should re-export components enum correctly', () => {
      const { eTenantManagementComponents } = enumsExports;
      expect(Object.keys(eTenantManagementComponents)).toEqual(['Tenants']);
    });

    it('should re-export route-names enum correctly (v3.0.0: Administration removed)', () => {
      const { eTenantManagementRouteNames } = enumsExports;
      expect(Object.keys(eTenantManagementRouteNames)).toEqual([
        'TenantManagement',
        'Tenants',
      ]);
    });

    it('should re-export policy-names enum correctly (v3.0.0)', () => {
      const { eTenantManagementPolicyNames } = enumsExports;
      expect(Object.keys(eTenantManagementPolicyNames)).toEqual([
        'TenantManagement',
        'Tenants',
      ]);
    });
  });
});
