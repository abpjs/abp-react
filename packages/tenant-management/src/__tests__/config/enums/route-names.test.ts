import { describe, it, expect } from 'vitest';
import {
  eTenantManagementRouteNames,
  type TenantManagementRouteNameKey,
} from '../../../config/enums/route-names';

describe('config/enums/route-names - eTenantManagementRouteNames', () => {
  describe('enum values', () => {
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

    it('should have exactly 2 keys (v3.0.0: Administration was removed)', () => {
      const keys = Object.keys(eTenantManagementRouteNames);
      expect(keys).toHaveLength(2);
    });

    it('should contain all expected keys', () => {
      expect('TenantManagement' in eTenantManagementRouteNames).toBe(true);
      expect('Tenants' in eTenantManagementRouteNames).toBe(true);
    });

    it('should NOT contain Administration key (removed in v3.0.0)', () => {
      expect('Administration' in eTenantManagementRouteNames).toBe(false);
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

    it('should use AbpTenantManagement prefix for all values', () => {
      Object.values(eTenantManagementRouteNames).forEach((value) => {
        expect(value.startsWith('AbpTenantManagement::')).toBe(true);
      });
    });
  });

  describe('type safety', () => {
    it('should allow type assignment for valid keys', () => {
      const key1: TenantManagementRouteNameKey =
        eTenantManagementRouteNames.TenantManagement;
      const key2: TenantManagementRouteNameKey =
        eTenantManagementRouteNames.Tenants;

      expect(key1).toBe('AbpTenantManagement::Menu:TenantManagement');
      expect(key2).toBe('AbpTenantManagement::Tenants');
    });
  });

  describe('usage patterns', () => {
    it('should work in switch statements', () => {
      const getRouteDescription = (
        routeName: TenantManagementRouteNameKey
      ): string => {
        switch (routeName) {
          case eTenantManagementRouteNames.TenantManagement:
            return 'Tenant Management Menu';
          case eTenantManagementRouteNames.Tenants:
            return 'Tenants Page';
          default:
            return 'Unknown';
        }
      };

      expect(
        getRouteDescription(eTenantManagementRouteNames.TenantManagement)
      ).toBe('Tenant Management Menu');
      expect(getRouteDescription(eTenantManagementRouteNames.Tenants)).toBe(
        'Tenants Page'
      );
    });

    it('should work with Object.entries', () => {
      const entries = Object.entries(eTenantManagementRouteNames);
      expect(entries).toEqual([
        ['TenantManagement', 'AbpTenantManagement::Menu:TenantManagement'],
        ['Tenants', 'AbpTenantManagement::Tenants'],
      ]);
    });

    it('should work with Object.values', () => {
      const values = Object.values(eTenantManagementRouteNames);
      expect(values).toEqual([
        'AbpTenantManagement::Menu:TenantManagement',
        'AbpTenantManagement::Tenants',
      ]);
    });

    it('should work with Object.keys', () => {
      const keys = Object.keys(eTenantManagementRouteNames);
      expect(keys).toEqual(['TenantManagement', 'Tenants']);
    });

    it('should be usable for route name lookup', () => {
      const routeLabels: Record<TenantManagementRouteNameKey, string> = {
        [eTenantManagementRouteNames.TenantManagement]: 'Tenant Management',
        [eTenantManagementRouteNames.Tenants]: 'Tenants',
      };

      expect(routeLabels[eTenantManagementRouteNames.TenantManagement]).toBe(
        'Tenant Management'
      );
      expect(routeLabels[eTenantManagementRouteNames.Tenants]).toBe('Tenants');
    });

    it('should be usable for localization keys', () => {
      const localizations: Record<string, string> = {
        'AbpTenantManagement::Menu:TenantManagement': 'Tenant Management',
        'AbpTenantManagement::Tenants': 'Tenants',
      };

      expect(localizations[eTenantManagementRouteNames.TenantManagement]).toBe(
        'Tenant Management'
      );
      expect(localizations[eTenantManagementRouteNames.Tenants]).toBe('Tenants');
    });
  });

  describe('localization key format', () => {
    it('should use Menu: prefix for menu items', () => {
      expect(eTenantManagementRouteNames.TenantManagement).toContain('Menu:');
    });

    it('should not use Menu: prefix for non-menu items', () => {
      expect(eTenantManagementRouteNames.Tenants).not.toContain('Menu:');
    });

    it('should use :: separator for localization keys', () => {
      Object.values(eTenantManagementRouteNames).forEach((value) => {
        expect(value).toContain('::');
      });
    });
  });

  describe('v3.0.0 breaking changes', () => {
    it('should document that Administration was removed', () => {
      // In v3.0.0, Administration was removed from eTenantManagementRouteNames
      // Users should use 'AbpUiNavigation::Menu:Administration' directly
      const administrationValue = 'AbpUiNavigation::Menu:Administration';
      expect(typeof administrationValue).toBe('string');
      expect(administrationValue).toBe('AbpUiNavigation::Menu:Administration');
    });

    it('should only have 2 keys after v3.0.0 migration', () => {
      const keys = Object.keys(eTenantManagementRouteNames);
      // v2.x had 3 keys (Administration, TenantManagement, Tenants)
      // v3.0.0 has 2 keys (TenantManagement, Tenants)
      expect(keys).toHaveLength(2);
      expect(keys).not.toContain('Administration');
    });
  });

  describe('route configuration usage', () => {
    it('should be suitable for route name configuration', () => {
      const routeConfig = {
        path: '/tenant-management',
        name: eTenantManagementRouteNames.TenantManagement,
        parentName: 'AbpUiNavigation::Menu:Administration',
      };

      expect(routeConfig.name).toBe('AbpTenantManagement::Menu:TenantManagement');
      expect(routeConfig.parentName).toBe('AbpUiNavigation::Menu:Administration');
    });

    it('should be suitable for child route configuration', () => {
      const routeConfig = {
        path: '/tenant-management/tenants',
        name: eTenantManagementRouteNames.Tenants,
        parentName: eTenantManagementRouteNames.TenantManagement,
      };

      expect(routeConfig.name).toBe('AbpTenantManagement::Tenants');
      expect(routeConfig.parentName).toBe('AbpTenantManagement::Menu:TenantManagement');
    });
  });
});
