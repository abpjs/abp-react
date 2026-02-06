/**
 * Tests for package exports
 * @since 2.7.0
 */
import { describe, it, expect } from 'vitest';
import * as textTemplateManagement from '../index';

describe('Package Exports', () => {
  describe('Enums', () => {
    it('should export eTextTemplateManagementComponents', () => {
      expect(textTemplateManagement.eTextTemplateManagementComponents).toBeDefined();
      expect(textTemplateManagement.eTextTemplateManagementComponents.TextTemplates).toBe(
        'TextTemplateManagement.TextTemplates'
      );
    });

    it('should export eTextTemplateManagementRouteNames', () => {
      expect(textTemplateManagement.eTextTemplateManagementRouteNames).toBeDefined();
      expect(textTemplateManagement.eTextTemplateManagementRouteNames.TextTemplates).toBe(
        'TextTemplateManagement::Menu:TextTemplates'
      );
    });
  });

  describe('Constants', () => {
    it('should export TEXT_TEMPLATE_MANAGEMENT_ROUTES', () => {
      expect(textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ROUTES).toBeDefined();
      expect(textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes).toBeDefined();
      expect(Array.isArray(textTemplateManagement.TEXT_TEMPLATE_MANAGEMENT_ROUTES.routes)).toBe(
        true
      );
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
      expect(textTemplateManagement.TextTemplateManagementStateService).toBeDefined();
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
});
