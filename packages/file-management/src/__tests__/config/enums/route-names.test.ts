/**
 * Tests for eFileManagementRouteNames
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import { eFileManagementRouteNames } from '../../../config/enums/route-names';

describe('eFileManagementRouteNames', () => {
  describe('route name values', () => {
    it('should have FileManagement route name', () => {
      expect(eFileManagementRouteNames.FileManagement).toBe(
        'FileManagement::Menu:FileManagement'
      );
    });
  });

  describe('route name format', () => {
    it('should follow the Module::Menu:RouteName pattern', () => {
      expect(eFileManagementRouteNames.FileManagement).toMatch(/^[\w]+::Menu:[\w]+$/);
    });

    it('should contain the localization key separator (::)', () => {
      expect(eFileManagementRouteNames.FileManagement).toContain('::');
    });

    it('should contain Menu: prefix for menu items', () => {
      expect(eFileManagementRouteNames.FileManagement).toContain('Menu:');
    });
  });

  describe('const object behavior', () => {
    it('should be a const object', () => {
      expect(typeof eFileManagementRouteNames).toBe('object');
    });

    it('should have exactly 1 route name', () => {
      const routeCount = Object.keys(eFileManagementRouteNames).length;
      expect(routeCount).toBe(1);
    });
  });

  describe('usage in routes configuration', () => {
    it('should be usable as route name in route config', () => {
      const routeConfig = {
        name: eFileManagementRouteNames.FileManagement,
        path: '/file-management',
      };
      expect(routeConfig.name).toBe('FileManagement::Menu:FileManagement');
    });

    it('should work with route patching', () => {
      const patches: Record<string, { invisible?: boolean }> = {
        [eFileManagementRouteNames.FileManagement]: { invisible: true },
      };
      expect(patches[eFileManagementRouteNames.FileManagement]?.invisible).toBe(true);
    });
  });
});
