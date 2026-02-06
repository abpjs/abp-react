/**
 * Tests for eTextTemplateManagementRouteNames
 * @since 2.7.0
 * @updated 3.0.0 - Removed Administration key tests (breaking change)
 */
import { describe, it, expect } from 'vitest';
import {
  eTextTemplateManagementRouteNames,
  type TextTemplateManagementRouteNameKey,
} from '../../enums/route-names';

describe('eTextTemplateManagementRouteNames', () => {
  describe('Const Object Values', () => {
    it('should have TextTemplates key with correct value', () => {
      expect(eTextTemplateManagementRouteNames.TextTemplates).toBe(
        'TextTemplateManagement::Menu:TextTemplates',
      );
    });

    it('should NOT have Administration key in v3.0.0 (breaking change)', () => {
      expect(
        (eTextTemplateManagementRouteNames as Record<string, unknown>)
          .Administration,
      ).toBeUndefined();
    });
  });

  describe('Localization Key Pattern', () => {
    it('should follow AbpModule::KeyName pattern for TextTemplates', () => {
      expect(eTextTemplateManagementRouteNames.TextTemplates).toMatch(
        /^TextTemplateManagement::/,
      );
    });
  });

  describe('Object Structure', () => {
    it('should have only TextTemplates key in v3.0.0', () => {
      const keys = Object.keys(eTextTemplateManagementRouteNames);
      expect(keys).toContain('TextTemplates');
      expect(keys).toHaveLength(1);
    });

    it('should have all values as strings', () => {
      Object.values(eTextTemplateManagementRouteNames).forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('TextTemplateManagementRouteNameKey Type', () => {
    it('should accept TextTemplates value', () => {
      const key: TextTemplateManagementRouteNameKey =
        eTextTemplateManagementRouteNames.TextTemplates;
      expect(key).toBe('TextTemplateManagement::Menu:TextTemplates');
    });
  });

  describe('Type-Safe Route Configuration', () => {
    it('should allow type-safe route path lookup', () => {
      const routePaths: Record<TextTemplateManagementRouteNameKey, string> = {
        'TextTemplateManagement::Menu:TextTemplates': '/text-templates',
      };

      expect(routePaths[eTextTemplateManagementRouteNames.TextTemplates]).toBe(
        '/text-templates',
      );
    });

    it('should work as navigation menu keys', () => {
      const menuItems = {
        [eTextTemplateManagementRouteNames.TextTemplates]: {
          label: 'Text Templates',
          path: '/text-templates',
        },
      };

      expect(
        menuItems['TextTemplateManagement::Menu:TextTemplates'].label,
      ).toBe('Text Templates');
    });
  });

  describe('Usage in Route Configuration', () => {
    it('should be usable for defining routes', () => {
      const routes = [
        {
          name: eTextTemplateManagementRouteNames.TextTemplates,
          path: '/text-templates',
        },
      ];

      expect(routes[0].name).toBe('TextTemplateManagement::Menu:TextTemplates');
    });
  });
});
