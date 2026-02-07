/**
 * Tests for proxy/text-templates/index.ts exports
 * @since 3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as textTemplatesProxy from '../../../proxy/text-templates';

describe('proxy/text-templates exports', () => {
  describe('Models', () => {
    it('should export GetTemplateContentInput type (verified by usage)', () => {
      // Type verification - if this compiles, the type is exported correctly
      const input: textTemplatesProxy.GetTemplateContentInput = {
        templateName: 'Test',
        cultureName: 'en',
      };
      expect(input.templateName).toBe('Test');
    });

    it('should export GetTemplateDefinitionListInput type (verified by usage)', () => {
      const input: textTemplatesProxy.GetTemplateDefinitionListInput = {
        filterText: 'test',
        skipCount: 0,
        maxResultCount: 10,
      };
      expect(input.filterText).toBe('test');
    });

    it('should export RestoreTemplateContentInput type (verified by usage)', () => {
      const input: textTemplatesProxy.RestoreTemplateContentInput = {
        templateName: 'Test',
        cultureName: 'en',
      };
      expect(input.templateName).toBe('Test');
    });

    it('should export TemplateDefinitionDto type (verified by usage)', () => {
      const dto: textTemplatesProxy.TemplateDefinitionDto = {
        name: 'Test',
        displayName: 'Test Template',
        isLayout: false,
        layout: '',
        isInlineLocalized: false,
        defaultCultureName: 'en',
      };
      expect(dto.name).toBe('Test');
    });

    it('should export TextTemplateContentDto type (verified by usage)', () => {
      const dto: textTemplatesProxy.TextTemplateContentDto = {
        name: 'Test',
        cultureName: 'en',
        content: 'Test content',
      };
      expect(dto.content).toBe('Test content');
    });

    it('should export UpdateTemplateContentInput type (verified by usage)', () => {
      const input: textTemplatesProxy.UpdateTemplateContentInput = {
        templateName: 'Test',
        cultureName: 'en',
        content: 'Updated',
      };
      expect(input.content).toBe('Updated');
    });
  });

  describe('Services', () => {
    it('should export TemplateContentService class', () => {
      expect(textTemplatesProxy.TemplateContentService).toBeDefined();
      expect(typeof textTemplatesProxy.TemplateContentService).toBe('function');
    });

    it('should export TemplateDefinitionService class', () => {
      expect(textTemplatesProxy.TemplateDefinitionService).toBeDefined();
      expect(typeof textTemplatesProxy.TemplateDefinitionService).toBe('function');
    });

    it('should be able to instantiate TemplateContentService', () => {
      const mockRestService = { request: () => Promise.resolve() };
      const service = new textTemplatesProxy.TemplateContentService(
        mockRestService as any
      );
      expect(service).toBeDefined();
      expect(service.apiName).toBe('default');
    });

    it('should be able to instantiate TemplateDefinitionService', () => {
      const mockRestService = { request: () => Promise.resolve() };
      const service = new textTemplatesProxy.TemplateDefinitionService(
        mockRestService as any
      );
      expect(service).toBeDefined();
      expect(service.apiName).toBe('default');
    });
  });

  describe('Re-exports completeness', () => {
    it('should export all expected members', () => {
      // Verify all service exports are present
      const expectedServiceExports = [
        'TemplateContentService',
        'TemplateDefinitionService',
      ];

      expectedServiceExports.forEach((exportName) => {
        expect(textTemplatesProxy).toHaveProperty(exportName);
      });
    });
  });
});
