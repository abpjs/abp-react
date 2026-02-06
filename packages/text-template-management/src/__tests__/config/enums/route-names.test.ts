/**
 * Tests for config/enums/route-names (v3.0.0)
 * @since 3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  eTextTemplateManagementRouteNames,
  type TextTemplateManagementRouteNameKey,
} from '../../../config/enums/route-names';

describe('Config eTextTemplateManagementRouteNames', () => {
  describe('Const Object Values', () => {
    it('should have TextTemplates key with correct value', () => {
      expect(eTextTemplateManagementRouteNames.TextTemplates).toBe(
        'TextTemplateManagement::Menu:TextTemplates',
      );
    });

    it('should NOT have Administration key (removed in v3.0.0)', () => {
      expect(
        (eTextTemplateManagementRouteNames as Record<string, unknown>)
          .Administration,
      ).toBeUndefined();
    });
  });

  describe('Localization Key Pattern', () => {
    it('should follow Module::Menu:KeyName pattern', () => {
      expect(eTextTemplateManagementRouteNames.TextTemplates).toMatch(
        /^TextTemplateManagement::Menu:/,
      );
    });
  });

  describe('Object Structure', () => {
    it('should have exactly 1 key in v3.0.0', () => {
      const keys = Object.keys(eTextTemplateManagementRouteNames);
      expect(keys).toHaveLength(1);
      expect(keys).toContain('TextTemplates');
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

  describe('Usage in Navigation', () => {
    it('should be usable for menu item configuration', () => {
      const menuItem = {
        name: eTextTemplateManagementRouteNames.TextTemplates,
        path: '/text-templates',
        icon: 'fa-file-alt',
      };

      expect(menuItem.name).toBe('TextTemplateManagement::Menu:TextTemplates');
    });

    it('should be usable in route lookup', () => {
      const routes: Record<TextTemplateManagementRouteNameKey, string> = {
        'TextTemplateManagement::Menu:TextTemplates': '/text-templates',
      };

      expect(routes[eTextTemplateManagementRouteNames.TextTemplates]).toBe(
        '/text-templates',
      );
    });
  });
});
