/**
 * Tests for proxy/index.ts exports
 * @since 3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as proxy from '../../proxy';

describe('proxy exports', () => {
  describe('Re-exports from text-templates subpackage', () => {
    it('should export TemplateContentService', () => {
      expect(proxy.TemplateContentService).toBeDefined();
      expect(typeof proxy.TemplateContentService).toBe('function');
    });

    it('should export TemplateDefinitionService', () => {
      expect(proxy.TemplateDefinitionService).toBeDefined();
      expect(typeof proxy.TemplateDefinitionService).toBe('function');
    });

    it('should be able to instantiate services from proxy namespace', () => {
      const mockRestService = { request: () => Promise.resolve() };

      const contentService = new proxy.TemplateContentService(mockRestService as any);
      const definitionService = new proxy.TemplateDefinitionService(mockRestService as any);

      expect(contentService).toBeDefined();
      expect(definitionService).toBeDefined();
      expect(contentService.apiName).toBe('default');
      expect(definitionService.apiName).toBe('default');
    });
  });

  describe('Type exports (verified by usage)', () => {
    it('should export GetTemplateContentInput type', () => {
      const input: proxy.GetTemplateContentInput = {
        templateName: 'TestTemplate',
        cultureName: 'en',
      };
      expect(input.templateName).toBe('TestTemplate');
      expect(input.cultureName).toBe('en');
    });

    it('should export GetTemplateDefinitionListInput type', () => {
      const input: proxy.GetTemplateDefinitionListInput = {
        filterText: 'search',
        skipCount: 5,
        maxResultCount: 25,
        sorting: 'name desc',
      };
      expect(input.filterText).toBe('search');
      expect(input.skipCount).toBe(5);
    });

    it('should export RestoreTemplateContentInput type', () => {
      const input: proxy.RestoreTemplateContentInput = {
        templateName: 'RestoreTest',
        cultureName: 'de-DE',
      };
      expect(input.templateName).toBe('RestoreTest');
    });

    it('should export TemplateDefinitionDto type', () => {
      const dto: proxy.TemplateDefinitionDto = {
        name: 'TestDefinition',
        displayName: 'Test Definition',
        isLayout: true,
        layout: '',
        isInlineLocalized: false,
        defaultCultureName: 'en',
      };
      expect(dto.name).toBe('TestDefinition');
      expect(dto.isLayout).toBe(true);
    });

    it('should export TextTemplateContentDto type', () => {
      const dto: proxy.TextTemplateContentDto = {
        name: 'ContentTest',
        cultureName: 'fr',
        content: '<html>Contenu</html>',
      };
      expect(dto.content).toContain('Contenu');
    });

    it('should export UpdateTemplateContentInput type', () => {
      const input: proxy.UpdateTemplateContentInput = {
        templateName: 'UpdateTest',
        cultureName: 'ja-JP',
        content: '日本語コンテンツ',
      };
      expect(input.content).toContain('日本語');
    });
  });

  describe('Service functionality through proxy', () => {
    it('should have correct method signatures on TemplateContentService', () => {
      const mockRestService = { request: () => Promise.resolve() };
      const service = new proxy.TemplateContentService(mockRestService as any);

      expect(typeof service.get).toBe('function');
      expect(typeof service.restoreToDefault).toBe('function');
      expect(typeof service.update).toBe('function');
    });

    it('should have correct method signatures on TemplateDefinitionService', () => {
      const mockRestService = { request: () => Promise.resolve() };
      const service = new proxy.TemplateDefinitionService(mockRestService as any);

      expect(typeof service.get).toBe('function');
      expect(typeof service.getList).toBe('function');
    });
  });
});
