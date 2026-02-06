/**
 * Tests for TEXT_TEMPLATE_MANAGEMENT_ROUTES
 * @since 2.7.0
 */
import { describe, it, expect } from 'vitest';
import { TEXT_TEMPLATE_MANAGEMENT_ROUTES } from '../../constants/routes';

describe('TEXT_TEMPLATE_MANAGEMENT_ROUTES', () => {
  describe('Structure', () => {
    it('should be defined', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTES).toBeDefined();
    });

    it('should have routes array', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes).toBeDefined();
      expect(Array.isArray(TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes)).toBe(true);
    });

    it('should have at least one route', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes.length).toBeGreaterThan(0);
    });
  });

  describe('Text Templates Route', () => {
    const textTemplatesRoute = TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes[0];

    it('should have correct name', () => {
      expect(textTemplatesRoute.name).toBe('TextTemplateManagement::Menu:TextTemplates');
    });

    it('should have correct path', () => {
      expect(textTemplatesRoute.path).toBe('text-template-management');
    });

    it('should have application layout', () => {
      expect(textTemplatesRoute.layout).toBe('application');
    });

    it('should have order property', () => {
      expect(textTemplatesRoute.order).toBeDefined();
      expect(typeof textTemplatesRoute.order).toBe('number');
    });

    it('should have parentName for Administration', () => {
      expect(textTemplatesRoute.parentName).toBe('AbpUiNavigation::Menu:Administration');
    });
  });

  describe('Route Usage', () => {
    it('should be usable for route configuration', () => {
      const routes = TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes.map((route) => ({
        path: route.path,
        name: route.name,
      }));

      expect(routes[0].path).toBe('text-template-management');
    });

    it('should support navigation hierarchy', () => {
      const route = TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes[0];
      expect(route.parentName).toBeDefined();
      expect(route.parentName).toContain('Administration');
    });
  });
});
