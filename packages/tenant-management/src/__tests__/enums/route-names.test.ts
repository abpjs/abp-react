import { describe, it, expect } from 'vitest';
import {
  eTenantManagementRouteNames,
  type TenantManagementRouteNameKey,
} from '../../enums/route-names';

describe('eTenantManagementRouteNames', () => {
  describe('enum values', () => {
    it('should have Administration key with correct value', () => {
      expect(eTenantManagementRouteNames.Administration).toBe(
        'AbpUiNavigation::Menu:Administration'
      );
    });

    it('should have TenantManagement key with correct value', () => {
      expect(eTenantManagementRouteNames.TenantManagement).toBe(
        'AbpTenantManagement::Menu:TenantManagement'
      );
    });

    it('should have Tenants key with correct value', () => {
      expect(eTenantManagementRouteNames.Tenants).toBe(
        'AbpTenantManagement::Tenants'
      );
    });

    it('should have exactly 3 keys', () => {
      const keys = Object.keys(eTenantManagementRouteNames);
      expect(keys).toHaveLength(3);
    });

    it('should contain all expected keys', () => {
      expect('Administration' in eTenantManagementRouteNames).toBe(true);
      expect('TenantManagement' in eTenantManagementRouteNames).toBe(true);
      expect('Tenants' in eTenantManagementRouteNames).toBe(true);
    });
  });

  describe('enum structure', () => {
    it('should be an object', () => {
      expect(typeof eTenantManagementRouteNames).toBe('object');
    });

    it('should not be null', () => {
      expect(eTenantManagementRouteNames).not.toBeNull();
    });

    it('should have string values', () => {
      Object.values(eTenantManagementRouteNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should have values following the localization key pattern', () => {
      Object.values(eTenantManagementRouteNames).forEach((value) => {
        // Pattern: ModuleName::KeyName or ModuleName::Menu:KeyName
        expect(value).toMatch(/^[\w]+::([\w]+:)?[\w]+$/);
      });
    });
  });

  describe('type safety', () => {
    it('should allow type assignment for valid keys', () => {
      const key1: TenantManagementRouteNameKey =
        eTenantManagementRouteNames.Administration;
      const key2: TenantManagementRouteNameKey =
        eTenantManagementRouteNames.TenantManagement;
      const key3: TenantManagementRouteNameKey =
        eTenantManagementRouteNames.Tenants;

      expect(key1).toBe('AbpUiNavigation::Menu:Administration');
      expect(key2).toBe('AbpTenantManagement::Menu:TenantManagement');
      expect(key3).toBe('AbpTenantManagement::Tenants');
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      // Use a function to get the value to avoid TypeScript narrowing
      const getRouteName = (): TenantManagementRouteNameKey =>
        eTenantManagementRouteNames.Tenants;
      const routeName = getRouteName();
      let result = '';

      switch (routeName) {
        case eTenantManagementRouteNames.Administration:
          result = 'admin';
          break;
        case eTenantManagementRouteNames.TenantManagement:
          result = 'tenant-management';
          break;
        case eTenantManagementRouteNames.Tenants:
          result = 'tenants';
          break;
        default:
          result = 'unknown';
      }

      expect(result).toBe('tenants');
    });

    it('should work with Object.entries', () => {
      const entries = Object.entries(eTenantManagementRouteNames);
      expect(entries).toEqual([
        ['Administration', 'AbpUiNavigation::Menu:Administration'],
        ['TenantManagement', 'AbpTenantManagement::Menu:TenantManagement'],
        ['Tenants', 'AbpTenantManagement::Tenants'],
      ]);
    });

    it('should work with Object.values', () => {
      const values = Object.values(eTenantManagementRouteNames);
      expect(values).toEqual([
        'AbpUiNavigation::Menu:Administration',
        'AbpTenantManagement::Menu:TenantManagement',
        'AbpTenantManagement::Tenants',
      ]);
    });

    it('should work with Object.keys', () => {
      const keys = Object.keys(eTenantManagementRouteNames);
      expect(keys).toEqual(['Administration', 'TenantManagement', 'Tenants']);
    });

    it('should be usable for route name lookup', () => {
      const routeLabels: Record<TenantManagementRouteNameKey, string> = {
        [eTenantManagementRouteNames.Administration]: 'Administration',
        [eTenantManagementRouteNames.TenantManagement]: 'Tenant Management',
        [eTenantManagementRouteNames.Tenants]: 'Tenants',
      };

      expect(routeLabels[eTenantManagementRouteNames.Administration]).toBe(
        'Administration'
      );
      expect(routeLabels[eTenantManagementRouteNames.TenantManagement]).toBe(
        'Tenant Management'
      );
      expect(routeLabels[eTenantManagementRouteNames.Tenants]).toBe('Tenants');
    });

    it('should be usable for localization keys', () => {
      // Simulate localization lookup
      const localizations: Record<string, string> = {
        'AbpUiNavigation::Menu:Administration': 'Administration',
        'AbpTenantManagement::Menu:TenantManagement': 'Tenant Management',
        'AbpTenantManagement::Tenants': 'Tenants',
      };

      expect(localizations[eTenantManagementRouteNames.Administration]).toBe(
        'Administration'
      );
      expect(localizations[eTenantManagementRouteNames.TenantManagement]).toBe(
        'Tenant Management'
      );
      expect(localizations[eTenantManagementRouteNames.Tenants]).toBe('Tenants');
    });
  });

  describe('localization key format', () => {
    it('should use AbpUiNavigation for Administration prefix', () => {
      const value = eTenantManagementRouteNames.Administration;
      expect(value.startsWith('AbpUiNavigation::')).toBe(true);
    });

    it('should use AbpTenantManagement for TenantManagement prefix', () => {
      const value = eTenantManagementRouteNames.TenantManagement;
      expect(value.startsWith('AbpTenantManagement::')).toBe(true);
    });

    it('should use AbpTenantManagement for Tenants prefix', () => {
      const value = eTenantManagementRouteNames.Tenants;
      expect(value.startsWith('AbpTenantManagement::')).toBe(true);
    });

    it('should use Menu: prefix for menu items', () => {
      expect(eTenantManagementRouteNames.Administration).toContain('Menu:');
      expect(eTenantManagementRouteNames.TenantManagement).toContain('Menu:');
    });

    it('should not use Menu: prefix for non-menu items', () => {
      expect(eTenantManagementRouteNames.Tenants).not.toContain('Menu:');
    });
  });
});
