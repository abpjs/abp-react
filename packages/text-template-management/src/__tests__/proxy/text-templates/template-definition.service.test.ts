/**
 * Tests for TemplateDefinitionService (Proxy)
 * @since 3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemplateDefinitionService } from '../../../proxy/text-templates/template-definition.service';
import type { RestService, PagedResultDto } from '@abpjs/core';
import type {
  GetTemplateDefinitionListInput,
  TemplateDefinitionDto,
} from '../../../proxy/text-templates/models';

describe('TemplateDefinitionService (Proxy)', () => {
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

    it('should set apiName to default', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('get', () => {
    it('should call restService.request with correct URL', async () => {
      const templateName = 'EmailVerification';
      const mockResponse: TemplateDefinitionDto = {
        name: 'EmailVerification',
        displayName: 'Email Verification Template',
        isLayout: false,
        layout: '',
        isInlineLocalized: false,
        defaultCultureName: 'en',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.get(templateName);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-definitions/EmailVerification',
      });
    });

    it('should return template definition', async () => {
      const templateName = 'PasswordReset';
      const mockResponse: TemplateDefinitionDto = {
        name: 'PasswordReset',
        displayName: 'Password Reset Email',
        isLayout: false,
        layout: 'DefaultEmailLayout',
        isInlineLocalized: false,
        defaultCultureName: 'en',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.get(templateName);

      expect(result.name).toBe('PasswordReset');
      expect(result.displayName).toBe('Password Reset Email');
      expect(result.layout).toBe('DefaultEmailLayout');
    });

    it('should handle layout templates', async () => {
      const templateName = 'DefaultEmailLayout';
      const mockResponse: TemplateDefinitionDto = {
        name: 'DefaultEmailLayout',
        displayName: 'Default Email Layout',
        isLayout: true,
        layout: '',
        isInlineLocalized: false,
        defaultCultureName: 'en',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.get(templateName);

      expect(result.isLayout).toBe(true);
    });

    it('should handle inline localized templates', async () => {
      const templateName = 'InlineTemplate';
      const mockResponse: TemplateDefinitionDto = {
        name: 'InlineTemplate',
        displayName: 'Inline Localized Template',
        isLayout: false,
        layout: '',
        isInlineLocalized: true,
        defaultCultureName: 'en',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.get(templateName);

      expect(result.isInlineLocalized).toBe(true);
    });

    it('should handle template names with special characters', async () => {
      const templateName = 'Org.Module.TemplateName';
      const mockResponse: TemplateDefinitionDto = {
        name: 'Org.Module.TemplateName',
        displayName: 'Organization Module Template',
        isLayout: false,
        layout: '',
        isInlineLocalized: false,
        defaultCultureName: 'en',
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.get(templateName);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-definitions/Org.Module.TemplateName',
      });
    });

    it('should propagate errors for non-existent templates', async () => {
      vi.mocked(mockRestService.request).mockRejectedValue(
        new Error('Template not found')
      );

      await expect(service.get('NonExistentTemplate')).rejects.toThrow('Template not found');
    });
  });

  describe('getList', () => {
    it('should call restService.request with default parameters', async () => {
      const mockResponse: PagedResultDto<TemplateDefinitionDto> = {
        items: [],
        totalCount: 0,
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.getList();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-definitions',
        params: {},
      });
    });

    it('should pass filterText parameter', async () => {
      const input: GetTemplateDefinitionListInput = {
        filterText: 'email',
      };

      const mockResponse: PagedResultDto<TemplateDefinitionDto> = {
        items: [
          {
            name: 'EmailVerification',
            displayName: 'Email Verification',
            isLayout: false,
            layout: '',
            isInlineLocalized: false,
            defaultCultureName: 'en',
          },
        ],
        totalCount: 1,
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-definitions',
        params: { filterText: 'email' },
      });
      expect(result.items).toHaveLength(1);
    });

    it('should pass pagination parameters', async () => {
      const input: GetTemplateDefinitionListInput = {
        skipCount: 10,
        maxResultCount: 20,
      };

      const mockResponse: PagedResultDto<TemplateDefinitionDto> = {
        items: [],
        totalCount: 50,
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-definitions',
        params: { skipCount: 10, maxResultCount: 20 },
      });
    });

    it('should pass sorting parameter', async () => {
      const input: GetTemplateDefinitionListInput = {
        sorting: 'name asc',
      };

      const mockResponse: PagedResultDto<TemplateDefinitionDto> = {
        items: [],
        totalCount: 0,
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-definitions',
        params: { sorting: 'name asc' },
      });
    });

    it('should pass all parameters together', async () => {
      const input: GetTemplateDefinitionListInput = {
        filterText: 'notification',
        skipCount: 0,
        maxResultCount: 50,
        sorting: 'displayName desc',
      };

      const mockResponse: PagedResultDto<TemplateDefinitionDto> = {
        items: [],
        totalCount: 0,
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/text-template-management/template-definitions',
        params: input,
      });
    });

    it('should return paged result with items', async () => {
      const mockItems: TemplateDefinitionDto[] = [
        {
          name: 'Template1',
          displayName: 'Template One',
          isLayout: false,
          layout: '',
          isInlineLocalized: false,
          defaultCultureName: 'en',
        },
        {
          name: 'Template2',
          displayName: 'Template Two',
          isLayout: true,
          layout: '',
          isInlineLocalized: false,
          defaultCultureName: 'en',
        },
        {
          name: 'Template3',
          displayName: 'Template Three',
          isLayout: false,
          layout: 'Template2',
          isInlineLocalized: true,
          defaultCultureName: 'de',
        },
      ];

      const mockResponse: PagedResultDto<TemplateDefinitionDto> = {
        items: mockItems,
        totalCount: 3,
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.getList();

      expect(result.items).toHaveLength(3);
      expect(result.totalCount).toBe(3);
      expect(result.items?.[0].name).toBe('Template1');
      expect(result.items?.[1].isLayout).toBe(true);
      expect(result.items?.[2].isInlineLocalized).toBe(true);
    });

    it('should handle empty result', async () => {
      const mockResponse: PagedResultDto<TemplateDefinitionDto> = {
        items: [],
        totalCount: 0,
      };

      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.getList({ filterText: 'nonexistent' });

      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });

    it('should propagate errors from restService', async () => {
      vi.mocked(mockRestService.request).mockRejectedValue(
        new Error('Server error')
      );

      await expect(service.getList()).rejects.toThrow('Server error');
    });
  });
});
