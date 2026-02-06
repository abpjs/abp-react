/**
 * Tests for TemplateDefinitionService
 * @since 2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemplateDefinitionService } from '../../services/template-definition.service';
import type { RestService } from '@abpjs/core';

describe('TemplateDefinitionService', () => {
  let service: TemplateDefinitionService;
  let mockRestService: RestService;

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    } as unknown as RestService;
    service = new TemplateDefinitionService(mockRestService);
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      expect(service).toBeDefined();
    });

    it('should have apiName set to default', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('getList', () => {
    it('should call restService.request with correct parameters', async () => {
      const mockResponse = {
        items: [
          {
            name: 'EmailTemplate',
            displayName: 'Email Template',
            isLayout: false,
            layout: '',
            defaultCultureName: 'en',
            isInlineLocalized: false,
          },
        ],
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.getList();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-definitions',
        params: {},
      });
    });

    it('should pass pagination parameters', async () => {
      const mockResponse = { items: [] };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.getList({ skipCount: 10, maxResultCount: 20 });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-definitions',
        params: { skipCount: 10, maxResultCount: 20 },
      });
    });

    it('should return list of template definitions', async () => {
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
          {
            name: 'Template2',
            displayName: 'Template 2',
            isLayout: true,
            layout: '',
            defaultCultureName: 'en',
            isInlineLocalized: true,
          },
        ],
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.getList();

      expect(result.items).toHaveLength(2);
      expect(result.items?.[0].name).toBe('Template1');
      expect(result.items?.[1].isLayout).toBe(true);
    });

    it('should handle empty response', async () => {
      const mockResponse = { items: [] };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.getList();

      expect(result.items).toHaveLength(0);
    });

    it('should propagate errors from restService', async () => {
      const error = new Error('Network error');
      vi.mocked(mockRestService.request).mockRejectedValue(error);

      await expect(service.getList()).rejects.toThrow('Network error');
    });
  });
});
