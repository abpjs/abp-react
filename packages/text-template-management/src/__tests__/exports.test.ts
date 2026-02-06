/**
 * Tests for package exports
 * @since 2.7.0
 * @updated 3.0.0 - Added tests for new exports
 */
import { describe, it, expect } from 'vitest';
import * as textTemplateManagement from '../index';

describe('Package Exports', () => {
  describe('Enums', () => {
    it('should export eTextTemplateManagementComponents', () => {
      expect(
        textTemplateManagement.eTextTemplateManagementComponents,
      ).toBeDefined();
      expect(
        textTemplateManagement.eTextTemplateManagementComponents.TextTemplates,
      ).toBe('TextTemplateManagement.TextTemplates');
    });

    it('should export eTextTemplateManagementRouteNames', () => {
      expect(
        textTemplateManagement.eTextTemplateManagementRouteNames,
      ).toBeDefined();
      expect(
        textTemplateManagement.eTextTemplateManagementRouteNames.TextTemplates,
      ).toBe('TextTemplateManagement::Menu:TextTemplates');
    });
  });

  describe('Constants', () => {
    it('should export TEXT_TEMPLATE_MANAGEMENT_ROUTES', () => {
      expect(
        textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ROUTES,
      ).toBeDefined();
      expect(
        textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes,
      ).toBeDefined();
      expect(
        Array.isArray(
          textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes,
        ),
      ).toBe(true);
    });
  });

  describe('Services', () => {
    it('should export TemplateDefinitionService', () => {
      expect(textTemplateManagement.TemplateDefinitionService).toBeDefined();
    });

    it('should export TemplateContentService', () => {
      expect(textTemplateManagement.TemplateContentService).toBeDefined();
    });

    it('should export TextTemplateManagementStateService', () => {
      expect(
        textTemplateManagement.TextTemplateManagementStateService,
      ).toBeDefined();
    });
  });

  describe('Hooks', () => {
    it('should export useTextTemplates', () => {
      expect(textTemplateManagement.useTextTemplates).toBeDefined();
      expect(typeof textTemplateManagement.useTextTemplates).toBe('function');
    });
  });

  describe('Components', () => {
    it('should export TextTemplatesComponent', () => {
      expect(textTemplateManagement.TextTemplatesComponent).toBeDefined();
    });

    it('should export TemplateContentsComponent', () => {
      expect(textTemplateManagement.TemplateContentsComponent).toBeDefined();
    });
  });

  // v3.0.0 Exports
  describe('Config Exports (v3.0.0)', () => {
    it('should export eTextTemplateManagementPolicyNames', () => {
      expect(
        textTemplateManagement.eTextTemplateManagementPolicyNames,
      ).toBeDefined();
      expect(
        textTemplateManagement.eTextTemplateManagementPolicyNames.TextTemplates,
      ).toBe('TextTemplateManagement.TextTemplates');
    });

    it('should export TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG', () => {
      expect(
        textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG,
      ).toBeDefined();
      expect(
        textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG.path,
      ).toBe('/text-template-management');
    });

    it('should export configureRoutes', () => {
      expect(textTemplateManagement.configureRoutes).toBeDefined();
      expect(typeof textTemplateManagement.configureRoutes).toBe('function');
    });

    it('should export initializeTextTemplateManagementRoutes', () => {
      expect(
        textTemplateManagement.initializeTextTemplateManagementRoutes,
      ).toBeDefined();
      expect(
        typeof textTemplateManagement.initializeTextTemplateManagementRoutes,
      ).toBe('function');
    });

    it('should export TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS', () => {
      expect(
        textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS,
      ).toBeDefined();
    });
  });

  describe('Token Exports (v3.0.0)', () => {
    it('should export DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS', () => {
      expect(
        textTemplateManagement.DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS,
      ).toBeDefined();
    });

    it('should export DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS', () => {
      expect(
        textTemplateManagement.DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS,
      ).toBeDefined();
    });

    it('should export DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS', () => {
      expect(
        textTemplateManagement.DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS,
      ).toBeDefined();
    });

    it('should export TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS', () => {
      expect(
        textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS,
      ).toBeDefined();
      expect(
        typeof textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS,
      ).toBe('symbol');
    });

    it('should export TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS', () => {
      expect(
        textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS,
      ).toBeDefined();
      expect(
        typeof textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS,
      ).toBe('symbol');
    });

    it('should export TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS', () => {
      expect(
        textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
      ).toBeDefined();
      expect(
        typeof textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
      ).toBe('symbol');
    });
  });

  describe('Guard Exports (v3.0.0)', () => {
    it('should export textTemplateManagementExtensionsGuard', () => {
      expect(
        textTemplateManagement.textTemplateManagementExtensionsGuard,
      ).toBeDefined();
      expect(
        typeof textTemplateManagement.textTemplateManagementExtensionsGuard,
      ).toBe('function');
    });

    it('should export useTextTemplateManagementExtensionsGuard', () => {
      expect(
        textTemplateManagement.useTextTemplateManagementExtensionsGuard,
      ).toBeDefined();
      expect(
        typeof textTemplateManagement.useTextTemplateManagementExtensionsGuard,
      ).toBe('function');
    });

    it('should export TextTemplateManagementExtensionsGuard class', () => {
      expect(
        textTemplateManagement.TextTemplateManagementExtensionsGuard,
      ).toBeDefined();
    });
  });
});
