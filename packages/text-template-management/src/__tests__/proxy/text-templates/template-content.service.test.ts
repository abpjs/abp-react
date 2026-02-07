/**
 * Tests for TemplateContentService (Proxy)
 * @since 3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemplateContentService } from '../../../proxy/text-templates/template-content.service';
import type { RestService } from '@abpjs/core';
import type {
  GetTemplateContentInput,
  RestoreTemplateContentInput,
  TextTemplateContentDto,
  UpdateTemplateContentInput,
} from '../../../proxy/text-templates/models';

describe('TemplateContentService (Proxy)', () => {
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

    it('should set apiName to default', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('get', () => {
    it('should call restService.request with correct parameters', async () => {
      const input: GetTemplateContentInput = {
        templateName: 'EmailTemplate',
        cultureName: 'en',
      };

      const mockResponse: TextTemplateContentDto = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: '<html>Hello</html>',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.get(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-contents',
        params: input,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return template content', async () => {
      const input: GetTemplateContentInput = {
        templateName: 'WelcomeEmail',
        cultureName: 'fr',
      };

      const mockResponse: TextTemplateContentDto = {
        name: 'WelcomeEmail',
        cultureName: 'fr',
        content: '<html>Bienvenue</html>',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.get(input);

      expect(result.name).toBe('WelcomeEmail');
      expect(result.cultureName).toBe('fr');
      expect(result.content).toContain('Bienvenue');
    });

    it('should handle different culture names', async () => {
      const cultures = ['en-US', 'de-DE', 'zh-CN', 'ja-JP'];

      for (const culture of cultures) {
        const input: GetTemplateContentInput = {
          templateName: 'TestTemplate',
          cultureName: culture,
        };

        const mockResponse: TextTemplateContentDto = {
          name: 'TestTemplate',
          cultureName: culture,
          content: `Content for ${culture}`,
        };

        vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

        const result = await service.get(input);

        expect(result.cultureName).toBe(culture);
      }
    });

    it('should propagate errors from restService', async () => {
      const input: GetTemplateContentInput = {
        templateName: 'NonExistent',
        cultureName: 'en',
      };

      vi.mocked(mockRestService.request).mockRejectedValue(new Error('Template not found'));

      await expect(service.get(input)).rejects.toThrow('Template not found');
    });
  });

  describe('restoreToDefault', () => {
    it('should call restService.request with correct parameters', async () => {
      const input: RestoreTemplateContentInput = {
        templateName: 'CustomizedTemplate',
        cultureName: 'en',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(undefined);

      await service.restoreToDefault(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/text-template-management/template-contents/restore-to-default',
        body: input,
      });
    });

    it('should return void on success', async () => {
      const input: RestoreTemplateContentInput = {
        templateName: 'TestTemplate',
        cultureName: 'en',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(undefined);

      const result = await service.restoreToDefault(input);

      expect(result).toBeUndefined();
    });

    it('should propagate errors from restService', async () => {
      const input: RestoreTemplateContentInput = {
        templateName: 'ReadOnlyTemplate',
        cultureName: 'en',
      };

      vi.mocked(mockRestService.request).mockRejectedValue(new Error('Permission denied'));

      await expect(service.restoreToDefault(input)).rejects.toThrow('Permission denied');
    });
  });

  describe('update', () => {
    it('should call restService.request with correct parameters', async () => {
      const input: UpdateTemplateContentInput = {
        templateName: 'EmailTemplate',
        cultureName: 'en',
        content: '<html>Updated content</html>',
      };

      const mockResponse: TextTemplateContentDto = {
        name: 'EmailTemplate',
        cultureName: 'en',
        content: '<html>Updated content</html>',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.update(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/text-template-management/template-contents',
        body: input,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return updated template content', async () => {
      const newContent = '<html><body>New Email Content</body></html>';
      const input: UpdateTemplateContentInput = {
        templateName: 'NotificationEmail',
        cultureName: 'de',
        content: newContent,
      };

      const mockResponse: TextTemplateContentDto = {
        name: 'NotificationEmail',
        cultureName: 'de',
        content: newContent,
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.update(input);

      expect(result.content).toBe(newContent);
    });

    it('should handle updating with empty content', async () => {
      const input: UpdateTemplateContentInput = {
        templateName: 'ClearTemplate',
        cultureName: 'en',
        content: '',
      };

      const mockResponse: TextTemplateContentDto = {
        name: 'ClearTemplate',
        cultureName: 'en',
        content: '',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.update(input);

      expect(result.content).toBe('');
    });

    it('should handle special characters in content', async () => {
      const specialContent = '{{user.name}} <script>test</script> 你好';
      const input: UpdateTemplateContentInput = {
        templateName: 'SpecialTemplate',
        cultureName: 'zh-CN',
        content: specialContent,
      };

      const mockResponse: TextTemplateContentDto = {
        name: 'SpecialTemplate',
        cultureName: 'zh-CN',
        content: specialContent,
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.update(input);

      expect(result.content).toBe(specialContent);
    });

    it('should propagate validation errors', async () => {
      const input: UpdateTemplateContentInput = {
        templateName: '',
        cultureName: 'en',
        content: 'test',
      };

      vi.mocked(mockRestService.request).mockRejectedValue(
        new Error('Template name is required')
      );

      await expect(service.update(input)).rejects.toThrow('Template name is required');
    });
  });
});
