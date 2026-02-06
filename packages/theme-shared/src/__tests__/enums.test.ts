import { describe, it, expect } from 'vitest';
import { eThemeSharedRouteNames } from '../enums/route-names';

describe('eThemeSharedRouteNames (v3.0.0)', () => {
  describe('Administration', () => {
    it('should have Administration enum value', () => {
      expect(eThemeSharedRouteNames.Administration).toBeDefined();
    });

    it('should have correct localization key for Administration', () => {
      expect(eThemeSharedRouteNames.Administration).toBe('AbpUiNavigation::Menu:Administration');
    });

    it('should be usable as a string', () => {
      const name: string = eThemeSharedRouteNames.Administration;
      expect(typeof name).toBe('string');
    });
  });

  describe('enum structure', () => {
    it('should be a valid TypeScript enum', () => {
      expect(eThemeSharedRouteNames).toBeDefined();
      expect(typeof eThemeSharedRouteNames).toBe('object');
    });

    it('should have Administration as the only value', () => {
      // Get only the string keys (enum values)
      const enumKeys = Object.keys(eThemeSharedRouteNames).filter(
        (key) => isNaN(Number(key))
      );
      expect(enumKeys).toEqual(['Administration']);
    });

    it('should allow comparison with string value', () => {
      expect(eThemeSharedRouteNames.Administration === 'AbpUiNavigation::Menu:Administration').toBe(true);
    });

    it('should be usable in switch statements', () => {
      const routeName = eThemeSharedRouteNames.Administration;
      let result = '';

      switch (routeName) {
        case eThemeSharedRouteNames.Administration:
          result = 'admin';
          break;
        default:
          result = 'unknown';
      }

      expect(result).toBe('admin');
    });

    it('should be usable as object key', () => {
      const routeConfig: Record<eThemeSharedRouteNames, string> = {
        [eThemeSharedRouteNames.Administration]: '/admin',
      };

      expect(routeConfig[eThemeSharedRouteNames.Administration]).toBe('/admin');
    });
  });

  describe('localization key format', () => {
    it('should follow ABP localization key format', () => {
      // ABP uses format: ResourceName::Key
      const value = eThemeSharedRouteNames.Administration;
      expect(value).toMatch(/^[A-Za-z]+::[A-Za-z]+:/);
    });

    it('should use AbpUiNavigation resource', () => {
      const value = eThemeSharedRouteNames.Administration;
      expect(value.startsWith('AbpUiNavigation::')).toBe(true);
    });

    it('should be in Menu namespace', () => {
      const value = eThemeSharedRouteNames.Administration;
      expect(value).toContain('Menu:');
    });
  });

  describe('v3.0.0 migration', () => {
    it('should be exported from enums module', () => {
      // This test verifies the enum is properly exported
      expect(eThemeSharedRouteNames).toBeDefined();
    });

    it('should provide type-safe route names', () => {
      // This is a compile-time check that also works at runtime
      const adminRoute: eThemeSharedRouteNames = eThemeSharedRouteNames.Administration;
      expect(adminRoute).toBe(eThemeSharedRouteNames.Administration);
    });
  });
});

describe('Route Names enum exports', () => {
  it('should export eThemeSharedRouteNames', async () => {
    const module = await import('../enums/route-names');
    expect(module.eThemeSharedRouteNames).toBeDefined();
  });

  it('should be accessible from enums index', async () => {
    const module = await import('../enums');
    expect(module.eThemeSharedRouteNames).toBeDefined();
  });
});
