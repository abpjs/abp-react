/**
 * Tests for eTextTemplateManagementRouteNames
 * @since 2.7.0
 */
import { describe, it, expect } from 'vitest';
import {
  eTextTemplateManagementRouteNames,
  type TextTemplateManagementRouteNameKey,
} from '../../enums/route-names';

describe('eTextTemplateManagementRouteNames', () => {
  describe('Const Object Values', () => {
    it('should have Administration key with correct value', () => {
      expect(eTextTemplateManagementRouteNames.Administration).toBe(
        'AbpUiNavigation::Menu:Administration'
      );
    });

    it('should have TextTemplates key with correct value', () => {
      expect(eTextTemplateManagementRouteNames.TextTemplates).toBe(
        'TextTemplateManagement::Menu:TextTemplates'
      );
    });
  });

  describe('Localization Key Pattern', () => {
    it('should follow AbpModule::KeyName pattern for Administration', () => {
      expect(eTextTemplateManagementRouteNames.Administration).toMatch(/^AbpUiNavigation::/);
    });

    it('should follow AbpModule::KeyName pattern for TextTemplates', () => {
      expect(eTextTemplateManagementRouteNames.TextTemplates).toMatch(
        /^TextTemplateManagement::/
      );
    });
  });

  describe('Object Structure', () => {
    it('should be a frozen object (as const)', () => {
      const keys = Object.keys(eTextTemplateManagementRouteNames);
      expect(keys).toContain('Administration');
      expect(keys).toContain('TextTemplates');
      expect(keys).toHaveLength(2);
    });

    it('should have all values as strings', () => {
      Object.values(eTextTemplateManagementRouteNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('TextTemplateManagementRouteNameKey Type', () => {
    it('should accept Administration value', () => {
      const key: TextTemplateManagementRouteNameKey =
        eTextTemplateManagementRouteNames.Administration;
      expect(key).toBe('AbpUiNavigation::Menu:Administration');
    });

    it('should accept TextTemplates value', () => {
      const key: TextTemplateManagementRouteNameKey =
        eTextTemplateManagementRouteNames.TextTemplates;
      expect(key).toBe('TextTemplateManagement::Menu:TextTemplates');
    });
  });

  describe('Type-Safe Route Configuration', () => {
    it('should allow type-safe route path lookup', () => {
      const routePaths: Record<TextTemplateManagementRouteNameKey, string> = {
        'AbpUiNavigation::Menu:Administration': '/admin',
        'TextTemplateManagement::Menu:TextTemplates': '/admin/text-templates',
      };

      expect(routePaths[eTextTemplateManagementRouteNames.Administration]).toBe('/admin');
      expect(routePaths[eTextTemplateManagementRouteNames.TextTemplates]).toBe(
        '/admin/text-templates'
      );
    });

    it('should work as navigation menu keys', () => {
      const menuItems = {
        [eTextTemplateManagementRouteNames.Administration]: {
          label: 'Administration',
          path: '/admin',
        },
        [eTextTemplateManagementRouteNames.TextTemplates]: {
          label: 'Text Templates',
          path: '/admin/text-templates',
        },
      };

      expect(menuItems['AbpUiNavigation::Menu:Administration'].label).toBe('Administration');
      expect(menuItems['TextTemplateManagement::Menu:TextTemplates'].label).toBe('Text Templates');
    });
  });

  describe('Usage in Route Configuration', () => {
    it('should be usable for defining routes', () => {
      const routes = [
        {
          name: eTextTemplateManagementRouteNames.TextTemplates,
          path: '/text-templates',
          parentName: eTextTemplateManagementRouteNames.Administration,
        },
      ];

      expect(routes[0].name).toBe('TextTemplateManagement::Menu:TextTemplates');
      expect(routes[0].parentName).toBe('AbpUiNavigation::Menu:Administration');
    });
  });
});
