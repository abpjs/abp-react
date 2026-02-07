/**
 * Tests for TextTemplateManagementStateService
 * @since 2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextTemplateManagementStateService } from '../../services/text-template-management-state.service';
import type { RestService } from '@abpjs/core';

describe('TextTemplateManagementStateService', () => {
  let service: TextTemplateManagementStateService;
  let mockRestService: RestService;

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    } as unknown as RestService;
    service = new TextTemplateManagementStateService(mockRestService);
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with empty state', () => {
      expect(service.getTemplateDefinitions()).toEqual([]);
      expect(service.getTotalCount()).toBe(0);
      expect(service.getSelectedTemplate()).toBeNull();
      expect(service.getTemplateContent()).toBeNull();
    });
  });

  describe('Getters', () => {
    it('should return template definitions from state', () => {
      expect(service.getTemplateDefinitions()).toEqual([]);
    });

    it('should return total count from state', () => {
      expect(service.getTotalCount()).toBe(0);
    });

    it('should return selected template from state', () => {
      expect(service.getSelectedTemplate()).toBeNull();
    });

    it('should return template content from state', () => {
      expect(service.getTemplateContent()).toBeNull();
    });
  });

  describe('dispatchGetTemplateDefinitions', () => {
    it('should fetch and store template definitions', async () => {
      const mockResponse = {
        items: [
          {
            name: 'Template1',
            displayName: 'Template 1',
            isLayout: false,
            layout: '',
            defaultCultureName: 'en',
            isInlineLocalized: false,
          },
        ],
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.dispatchGetTemplateDefinitions();

      expect(service.getTemplateDefinitions()).toHaveLength(1);
      expect(service.getTemplateDefinitions()[0].name).toBe('Template1');
      expect(service.getTotalCount()).toBe(1);
    });

    it('should pass pagination parameters', async () => {
      const mockResponse = { items: [] };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.dispatchGetTemplateDefinitions({ skipCount: 10, maxResultCount: 5 });

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { skipCount: 10, maxResultCount: 5 },
        })
      );
    });

    it('should handle empty response', async () => {
      vi.mocked(mockRestService.request).mockResolvedValue({ items: [] });

      await service.dispatchGetTemplateDefinitions();

      expect(service.getTemplateDefinitions()).toEqual([]);
      expect(service.getTotalCount()).toBe(0);
    });

    it('should handle undefined items', async () => {
      vi.mocked(mockRestService.request).mockResolvedValue({});

      await service.dispatchGetTemplateDefinitions();

      expect(service.getTemplateDefinitions()).toEqual([]);
      expect(service.getTotalCount()).toBe(0);
    });

    it('should return the result', async () => {
      const mockResponse = {
        items: [{ name: 'Test', displayName: 'Test', isLayout: false, layout: '', defaultCultureName: 'en', isInlineLocalized: false }],
      };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.dispatchGetTemplateDefinitions();

      expect(result.items).toHaveLength(1);
    });
  });

  describe('dispatchGetTemplateContent', () => {
    it('should fetch and store template content', async () => {
      const mockResponse = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: '<html>Hello</html>',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.dispatchGetTemplateContent({
        templateName: 'EmailTemplate',
        cultureName: 'en',
      });

      const content = service.getTemplateContent();
      expect(content).not.toBeNull();
      expect(content?.name).toBe('EmailTemplate');
      expect(content?.content).toContain('Hello');
    });

    it('should return the fetched content', async () => {
      const mockResponse = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: 'Test content',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.dispatchGetTemplateContent({
        templateName: 'EmailTemplate',
        cultureName: 'en',
      });

      expect(result.content).toBe('Test content');
    });

    it('should throw error if cultureName is not provided', async () => {
      await expect(
        service.dispatchGetTemplateContent({
          templateName: 'EmailTemplate',
        })
      ).rejects.toThrow('cultureName is required for getting template content');
    });
  });

  describe('dispatchUpdateTemplateContent', () => {
    it('should update and store template content', async () => {
      const mockResponse = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: 'Updated content',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.dispatchUpdateTemplateContent({
        templateName: 'EmailTemplate',
        cultureName: 'en',
        content: 'Updated content',
      });

      const content = service.getTemplateContent();
      expect(content?.content).toBe('Updated content');
    });

    it('should return the updated content', async () => {
      const mockResponse = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: 'New content',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.dispatchUpdateTemplateContent({
        templateName: 'EmailTemplate',
        cultureName: 'en',
        content: 'New content',
      });

      expect(result.content).toBe('New content');
    });
  });

  describe('dispatchRestoreToDefault', () => {
    it('should restore template and refresh content', async () => {
      // First call for restore, second call for refresh
      vi.mocked(mockRestService.request)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({
          name: 'EmailTemplate',
          cultureName: 'en',
          content: 'Default content',
        });

      await service.dispatchRestoreToDefault({
        templateName: 'EmailTemplate',
        cultureName: 'en',
      });

      expect(mockRestService.request).toHaveBeenCalledTimes(2);
      const content = service.getTemplateContent();
      expect(content?.content).toBe('Default content');
    });

    it('should throw error if cultureName is not provided', async () => {
      await expect(
        service.dispatchRestoreToDefault({
          templateName: 'EmailTemplate',
        })
      ).rejects.toThrow('cultureName is required for restoring template content');
    });
  });

  describe('setSelectedTemplate', () => {
    it('should set selected template', () => {
      const template = {
        name: 'Test',
        displayName: 'Test Template',
        isLayout: false,
        layout: '',
        defaultCultureName: 'en',
        isInlineLocalized: false,
      };

      service.setSelectedTemplate(template);

      expect(service.getSelectedTemplate()).toBe(template);
    });

    it('should clear selected template with null', () => {
      const template = {
        name: 'Test',
        displayName: 'Test Template',
        isLayout: false,
        layout: '',
        defaultCultureName: 'en',
        isInlineLocalized: false,
      };

      service.setSelectedTemplate(template);
      service.setSelectedTemplate(null);

      expect(service.getSelectedTemplate()).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      // Set up some state
      vi.mocked(mockRestService.request).mockResolvedValue({
        items: [{ name: 'Test', displayName: 'Test', isLayout: false, layout: '', defaultCultureName: 'en', isInlineLocalized: false }],
      });
      await service.dispatchGetTemplateDefinitions();

      service.setSelectedTemplate({
        name: 'Test',
        displayName: 'Test',
        isLayout: false,
        layout: '',
        defaultCultureName: 'en',
        isInlineLocalized: false,
      });

      // Reset
      service.reset();

      expect(service.getTemplateDefinitions()).toEqual([]);
      expect(service.getTotalCount()).toBe(0);
      expect(service.getSelectedTemplate()).toBeNull();
      expect(service.getTemplateContent()).toBeNull();
    });
  });
});
