/**
 * Tests for SaaS Route Names
 * @abpjs/saas v2.7.0
 */
import { describe, it, expect } from 'vitest';
import { eSaasRouteNames, SaasRouteNameKey } from '../../enums';

describe('eSaasRouteNames', () => {
  describe('route name values', () => {
    it('should have Administration route name', () => {
      expect(eSaasRouteNames.Administration).toBe('AbpUiNavigation::Menu:Administration');
    });

    it('should have Saas route name', () => {
      expect(eSaasRouteNames.Saas).toBe('Saas::Menu:Saas');
    });

    it('should have Tenants route name', () => {
      expect(eSaasRouteNames.Tenants).toBe('Saas::Tenants');
    });

    it('should have Editions route name', () => {
      expect(eSaasRouteNames.Editions).toBe('Saas::Editions');
    });
  });

  describe('string usage', () => {
    it('should be usable as string values', () => {
      const admin: string = eSaasRouteNames.Administration;
      const saas: string = eSaasRouteNames.Saas;
      const tenants: string = eSaasRouteNames.Tenants;
      const editions: string = eSaasRouteNames.Editions;

      expect(admin).toBe('AbpUiNavigation::Menu:Administration');
      expect(saas).toBe('Saas::Menu:Saas');
      expect(tenants).toBe('Saas::Tenants');
      expect(editions).toBe('Saas::Editions');
    });

    it('should be usable for route configuration', () => {
      const routes: Record<string, { path: string }> = {};
      routes[eSaasRouteNames.Tenants] = { path: '/saas/tenants' };
      routes[eSaasRouteNames.Editions] = { path: '/saas/editions' };

      expect(routes['Saas::Tenants'].path).toBe('/saas/tenants');
      expect(routes['Saas::Editions'].path).toBe('/saas/editions');
    });
  });

  describe('object structure', () => {
    it('should have correct keys', () => {
      const keys = Object.keys(eSaasRouteNames);
      expect(keys).toContain('Administration');
      expect(keys).toContain('Saas');
      expect(keys).toContain('Tenants');
      expect(keys).toContain('Editions');
      expect(keys).toHaveLength(4);
    });

    it('should have correct values', () => {
      const values = Object.values(eSaasRouteNames);
      expect(values).toContain('AbpUiNavigation::Menu:Administration');
      expect(values).toContain('Saas::Menu:Saas');
      expect(values).toContain('Saas::Tenants');
      expect(values).toContain('Saas::Editions');
      expect(values).toHaveLength(4);
    });

    it('should have unique values for each route', () => {
      const values = Object.values(eSaasRouteNames);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('should be a const object (immutable at runtime)', () => {
      expect(typeof eSaasRouteNames).toBe('object');
      expect(eSaasRouteNames).not.toBeNull();
    });
  });

  describe('localization key pattern', () => {
    it('should follow AbpModule::KeyName pattern', () => {
      Object.values(eSaasRouteNames).forEach((value) => {
        expect(value).toMatch(/^(Abp\w+|Saas)::/);
      });
    });

    it('should have valid localization key format', () => {
      Object.values(eSaasRouteNames).forEach((value) => {
        expect(value).toContain('::');
        const [module, key] = value.split('::');
        expect(module.length).toBeGreaterThan(0);
        expect(key.length).toBeGreaterThan(0);
      });
    });
  });

  describe('navigation hierarchy', () => {
    it('should have Administration as top-level menu', () => {
      expect(eSaasRouteNames.Administration).toContain('Menu:Administration');
    });

    it('should have Saas as submenu', () => {
      expect(eSaasRouteNames.Saas).toContain('Menu:Saas');
    });

    it('should have Tenants and Editions as leaf routes without Menu prefix', () => {
      expect(eSaasRouteNames.Tenants).not.toContain('Menu:');
      expect(eSaasRouteNames.Editions).not.toContain('Menu:');
    });
  });
});

describe('SaasRouteNameKey type', () => {
  it('should accept valid route name keys', () => {
    const adminKey: SaasRouteNameKey = 'AbpUiNavigation::Menu:Administration';
    const saasKey: SaasRouteNameKey = 'Saas::Menu:Saas';
    const tenantsKey: SaasRouteNameKey = 'Saas::Tenants';
    const editionsKey: SaasRouteNameKey = 'Saas::Editions';

    expect(adminKey).toBe(eSaasRouteNames.Administration);
    expect(saasKey).toBe(eSaasRouteNames.Saas);
    expect(tenantsKey).toBe(eSaasRouteNames.Tenants);
    expect(editionsKey).toBe(eSaasRouteNames.Editions);
  });

  it('should work with eSaasRouteNames values', () => {
    const key: SaasRouteNameKey = eSaasRouteNames.Tenants;
    expect(key).toBe('Saas::Tenants');
  });

  it('should be usable in function parameters', () => {
    const isValidRouteKey = (key: SaasRouteNameKey): boolean => {
      return Object.values(eSaasRouteNames).includes(key);
    };

    expect(isValidRouteKey(eSaasRouteNames.Administration)).toBe(true);
    expect(isValidRouteKey(eSaasRouteNames.Saas)).toBe(true);
    expect(isValidRouteKey(eSaasRouteNames.Tenants)).toBe(true);
    expect(isValidRouteKey(eSaasRouteNames.Editions)).toBe(true);
  });

  it('should work with Record type for route configuration', () => {
    const routePaths: Record<SaasRouteNameKey, string> = {
      'AbpUiNavigation::Menu:Administration': '/admin',
      'Saas::Menu:Saas': '/admin/saas',
      'Saas::Tenants': '/admin/saas/tenants',
      'Saas::Editions': '/admin/saas/editions',
    };

    expect(routePaths[eSaasRouteNames.Administration]).toBe('/admin');
    expect(routePaths[eSaasRouteNames.Saas]).toBe('/admin/saas');
    expect(routePaths[eSaasRouteNames.Tenants]).toBe('/admin/saas/tenants');
    expect(routePaths[eSaasRouteNames.Editions]).toBe('/admin/saas/editions');
  });

  it('should be usable for localization lookups', () => {
    const mockLocalize = (key: SaasRouteNameKey): string => {
      const translations: Record<SaasRouteNameKey, string> = {
        'AbpUiNavigation::Menu:Administration': 'Administration',
        'Saas::Menu:Saas': 'SaaS',
        'Saas::Tenants': 'Tenants',
        'Saas::Editions': 'Editions',
      };
      return translations[key];
    };

    expect(mockLocalize(eSaasRouteNames.Administration)).toBe('Administration');
    expect(mockLocalize(eSaasRouteNames.Saas)).toBe('SaaS');
    expect(mockLocalize(eSaasRouteNames.Tenants)).toBe('Tenants');
    expect(mockLocalize(eSaasRouteNames.Editions)).toBe('Editions');
  });
});
