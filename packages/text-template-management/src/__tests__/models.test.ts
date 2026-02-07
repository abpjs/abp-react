/**
 * Tests for Text Template Management models
 * @since 2.7.0
 * @updated 3.1.0 - Added tests for GetTemplateDefinitionListInput and createGetTemplateDefinitionListInput
 */
import { describe, it, expect } from 'vitest';
import type { TextTemplateManagement } from '../models';
import {
  type GetTemplateDefinitionListInput,
  createGetTemplateDefinitionListInput,
} from '../models';

describe('TextTemplateManagement Models', () => {
  describe('TemplateDefinitionDto', () => {
    it('should create a valid template definition', () => {
      const template: TextTemplateManagement.TemplateDefinitionDto = {
        name: 'EmailTemplate',
        displayName: 'Email Template',
        isLayout: false,
        layout: 'DefaultLayout',
        defaultCultureName: 'en',
        isInlineLocalized: false,
      };

      expect(template.name).toBe('EmailTemplate');
      expect(template.displayName).toBe('Email Template');
      expect(template.isLayout).toBe(false);
      expect(template.layout).toBe('DefaultLayout');
      expect(template.defaultCultureName).toBe('en');
      expect(template.isInlineLocalized).toBe(false);
    });

    it('should allow layout template definition', () => {
      const layoutTemplate: TextTemplateManagement.TemplateDefinitionDto = {
        name: 'DefaultLayout',
        displayName: 'Default Layout',
        isLayout: true,
        layout: '',
        defaultCultureName: 'en',
        isInlineLocalized: false,
      };

      expect(layoutTemplate.isLayout).toBe(true);
      expect(layoutTemplate.layout).toBe('');
    });
  });

  describe('TextTemplateContentDto', () => {
    it('should create a valid template content', () => {
      const content: TextTemplateManagement.TextTemplateContentDto = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: '<html>Hello {{Name}}</html>',
      };

      expect(content.name).toBe('EmailTemplate');
      expect(content.cultureName).toBe('en');
      expect(content.content).toContain('Hello');
    });
  });

  describe('TemplateContentInput', () => {
    it('should create input with required fields', () => {
      const input: TextTemplateManagement.TemplateContentInput = {
        templateName: 'EmailTemplate',
      };

      expect(input.templateName).toBe('EmailTemplate');
      expect(input.cultureName).toBeUndefined();
    });

    it('should create input with optional culture name', () => {
      const input: TextTemplateManagement.TemplateContentInput = {
        templateName: 'EmailTemplate',
        cultureName: 'fr',
      };

      expect(input.templateName).toBe('EmailTemplate');
      expect(input.cultureName).toBe('fr');
    });
  });

  describe('CreateOrUpdateTemplateContentDto', () => {
    it('should create a valid create/update DTO', () => {
      const dto: TextTemplateManagement.CreateOrUpdateTemplateContentDto = {
        templateName: 'EmailTemplate',
        cultureName: 'en',
        content: '<html>Updated content</html>',
      };

      expect(dto.templateName).toBe('EmailTemplate');
      expect(dto.cultureName).toBe('en');
      expect(dto.content).toContain('Updated content');
    });
  });

  describe('State', () => {
    it('should create a valid state object', () => {
      const template: TextTemplateManagement.TemplateDefinitionDto = {
        name: 'EmailTemplate',
        displayName: 'Email Template',
        isLayout: false,
        layout: '',
        defaultCultureName: 'en',
        isInlineLocalized: false,
      };

      const content: TextTemplateManagement.TextTemplateContentDto = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: 'Hello World',
      };

      const state: TextTemplateManagement.State = {
        templateDefinitions: [template],
        totalCount: 1,
        selectedTemplate: template,
        templateContent: content,
      };

      expect(state.templateDefinitions).toHaveLength(1);
      expect(state.totalCount).toBe(1);
      expect(state.selectedTemplate).toBe(template);
      expect(state.templateContent).toBe(content);
    });

    it('should allow empty state', () => {
      const emptyState: TextTemplateManagement.State = {
        templateDefinitions: [],
        totalCount: 0,
        selectedTemplate: null,
        templateContent: null,
      };

      expect(emptyState.templateDefinitions).toHaveLength(0);
      expect(emptyState.totalCount).toBe(0);
      expect(emptyState.selectedTemplate).toBeNull();
      expect(emptyState.templateContent).toBeNull();
    });
  });

  describe('GetTemplateDefinitionsInput', () => {
    it('should create input with all optional fields', () => {
      const input: TextTemplateManagement.GetTemplateDefinitionsInput = {
        filterText: 'email',
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'name asc',
      };

      expect(input.filterText).toBe('email');
      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(10);
      expect(input.sorting).toBe('name asc');
    });

    it('should allow empty input', () => {
      const input: TextTemplateManagement.GetTemplateDefinitionsInput = {};

      expect(input.filterText).toBeUndefined();
      expect(input.skipCount).toBeUndefined();
    });
  });

  /**
   * v3.1.0 - GetTemplateDefinitionListInput tests
   */
  describe('GetTemplateDefinitionListInput (v3.1.0)', () => {
    it('should create input with all fields', () => {
      const input: GetTemplateDefinitionListInput = {
        filterText: 'welcome',
        skipCount: 10,
        maxResultCount: 25,
        sorting: 'displayName desc',
      };

      expect(input.filterText).toBe('welcome');
      expect(input.skipCount).toBe(10);
      expect(input.maxResultCount).toBe(25);
      expect(input.sorting).toBe('displayName desc');
    });

    it('should allow partial input with only filterText', () => {
      const input: GetTemplateDefinitionListInput = {
        filterText: 'email',
      };

      expect(input.filterText).toBe('email');
      expect(input.skipCount).toBeUndefined();
      expect(input.maxResultCount).toBeUndefined();
      expect(input.sorting).toBeUndefined();
    });

    it('should allow empty input', () => {
      const input: GetTemplateDefinitionListInput = {};

      expect(input.filterText).toBeUndefined();
      expect(input.skipCount).toBeUndefined();
      expect(input.maxResultCount).toBeUndefined();
      expect(input.sorting).toBeUndefined();
    });

    it('should allow pagination without filter', () => {
      const input: GetTemplateDefinitionListInput = {
        skipCount: 20,
        maxResultCount: 10,
      };

      expect(input.filterText).toBeUndefined();
      expect(input.skipCount).toBe(20);
      expect(input.maxResultCount).toBe(10);
    });
  });

  /**
   * v3.1.0 - createGetTemplateDefinitionListInput factory function tests
   */
  describe('createGetTemplateDefinitionListInput (v3.1.0)', () => {
    it('should create input with default values when no initial values provided', () => {
      const input = createGetTemplateDefinitionListInput();

      expect(input.filterText).toBeUndefined();
      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(10);
      expect(input.sorting).toBeUndefined();
    });

    it('should create input with provided initial values', () => {
      const input = createGetTemplateDefinitionListInput({
        filterText: 'invoice',
        skipCount: 5,
        maxResultCount: 20,
        sorting: 'name asc',
      });

      expect(input.filterText).toBe('invoice');
      expect(input.skipCount).toBe(5);
      expect(input.maxResultCount).toBe(20);
      expect(input.sorting).toBe('name asc');
    });

    it('should use default skipCount when not provided', () => {
      const input = createGetTemplateDefinitionListInput({
        filterText: 'test',
      });

      expect(input.filterText).toBe('test');
      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(10);
    });

    it('should use default maxResultCount when not provided', () => {
      const input = createGetTemplateDefinitionListInput({
        skipCount: 10,
      });

      expect(input.skipCount).toBe(10);
      expect(input.maxResultCount).toBe(10);
    });

    it('should override defaults with provided values', () => {
      const input = createGetTemplateDefinitionListInput({
        skipCount: 100,
        maxResultCount: 50,
      });

      expect(input.skipCount).toBe(100);
      expect(input.maxResultCount).toBe(50);
    });

    it('should handle zero values correctly', () => {
      const input = createGetTemplateDefinitionListInput({
        skipCount: 0,
        maxResultCount: 0,
      });

      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(0);
    });

    it('should handle empty string filterText', () => {
      const input = createGetTemplateDefinitionListInput({
        filterText: '',
      });

      expect(input.filterText).toBe('');
    });

    it('should handle undefined initial values object', () => {
      const input = createGetTemplateDefinitionListInput(undefined);

      expect(input.filterText).toBeUndefined();
      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(10);
      expect(input.sorting).toBeUndefined();
    });

    it('should preserve sorting when provided', () => {
      const input = createGetTemplateDefinitionListInput({
        sorting: 'createdAt desc',
      });

      expect(input.sorting).toBe('createdAt desc');
    });

    it('should be compatible with TextTemplateManagement.GetTemplateDefinitionsInput', () => {
      // The new type should work in places that expect the namespace type
      const input = createGetTemplateDefinitionListInput({
        filterText: 'test',
        skipCount: 0,
        maxResultCount: 10,
      });

      // Type assertion to verify compatibility
      const nsInput: TextTemplateManagement.GetTemplateDefinitionsInput = input;
      expect(nsInput.filterText).toBe('test');
    });
  });
});
