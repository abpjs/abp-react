/**
 * Tests for TemplateContentService
 * @since 2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemplateContentService } from '../../services/template-content.service';
import type { RestService } from '@abpjs/core';

describe('TemplateContentService', () => {
  let service: TemplateContentService;
  let mockRestService: RestService;

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    } as unknown as RestService;
    service = new TemplateContentService(mockRestService);
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      expect(service).toBeDefined();
    });

    it('should have apiName set to default', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('getByInput', () => {
    it('should call restService.request with template name only', async () => {
      const mockResponse = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: '<html>Hello</html>',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.getByInput({ templateName: 'EmailTemplate' });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-contents',
        params: { templateName: 'EmailTemplate' },
      });
    });

    it('should call restService.request with template name and culture', async () => {
      const mockResponse = {
        name: 'EmailTemplate',
        cultureName: 'fr',
        content: '<html>Bonjour</html>',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.getByInput({ templateName: 'EmailTemplate', cultureName: 'fr' });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-contents',
        params: { templateName: 'EmailTemplate', cultureName: 'fr' },
      });
    });

    it('should return template content', async () => {
      const mockResponse = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: '<html>Hello {{Name}}</html>',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.getByInput({ templateName: 'EmailTemplate' });

      expect(result.name).toBe('EmailTemplate');
      expect(result.cultureName).toBe('en');
      expect(result.content).toContain('Hello');
    });

    it('should propagate errors', async () => {
      vi.mocked(mockRestService.request).mockRejectedValue(new Error('Not found'));

      await expect(
        service.getByInput({ templateName: 'NonExistent' })
      ).rejects.toThrow('Not found');
    });
  });

  describe('restoreToDefaultByInput', () => {
    it('should call restService.request with correct parameters', async () => {
      vi.mocked(mockRestService.request).mockResolvedValue(undefined);

      await service.restoreToDefaultByInput({
        templateName: 'EmailTemplate',
        cultureName: 'en',
      });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/text-template-management/template-contents/restore-to-default',
        body: { templateName: 'EmailTemplate', cultureName: 'en' },
      });
    });

    it('should resolve without returning data', async () => {
      vi.mocked(mockRestService.request).mockResolvedValue(undefined);

      const result = await service.restoreToDefaultByInput({
        templateName: 'EmailTemplate',
        cultureName: 'en',
      });

      expect(result).toBeUndefined();
    });

    it('should propagate errors', async () => {
      vi.mocked(mockRestService.request).mockRejectedValue(new Error('Restore failed'));

      await expect(
        service.restoreToDefaultByInput({
          templateName: 'EmailTemplate',
          cultureName: 'en',
        })
      ).rejects.toThrow('Restore failed');
    });
  });

  describe('updateByInput', () => {
    it('should call restService.request with correct parameters', async () => {
      const mockResponse = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: 'Updated content',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.updateByInput({
        templateName: 'EmailTemplate',
        cultureName: 'en',
        content: 'Updated content',
      });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/text-template-management/template-contents',
        body: {
          templateName: 'EmailTemplate',
          cultureName: 'en',
          content: 'Updated content',
        },
      });
    });

    it('should return updated template content', async () => {
      const mockResponse = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: 'New content',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.updateByInput({
        templateName: 'EmailTemplate',
        cultureName: 'en',
        content: 'New content',
      });

      expect(result.content).toBe('New content');
    });

    it('should propagate errors', async () => {
      vi.mocked(mockRestService.request).mockRejectedValue(new Error('Update failed'));

      await expect(
        service.updateByInput({
          templateName: 'EmailTemplate',
          cultureName: 'en',
          content: 'Content',
        })
      ).rejects.toThrow('Update failed');
    });
  });
});
