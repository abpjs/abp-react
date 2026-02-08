/**
 * Tests for proxy/language.service.ts
 * @since 3.2.0
 * @updated 4.0.0 - getList return type changed from ListResultDto to PagedResultDto
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageService } from '../../proxy/language.service';
import type {
  CreateLanguageDto,
  UpdateLanguageDto,
  LanguageDto,
  CultureInfoDto,
  LanguageResourceDto,
  GetLanguagesTextsInput,
} from '../../proxy/dto/models';
import type { RestService, ListResultDto, PagedResultDto } from '@abpjs/core';

describe('LanguageService', () => {
  let service: LanguageService;
  let mockRestService: {
    request: ReturnType<typeof vi.fn>;
  };

  const mockLanguage: LanguageDto = {
    id: 'lang-1',
    cultureName: 'en-US',
    uiCultureName: 'en-US',
    displayName: 'English',
    flagIcon: 'us',
    isEnabled: true,
    isDefaultLanguage: true,
    creationTime: '2024-01-01T00:00:00Z',
    creatorId: 'user-1',
  };

  const mockLanguageListResult: ListResultDto<LanguageDto> = {
    items: [mockLanguage],
  };

  const mockCultures: CultureInfoDto[] = [
    { displayName: 'English (United States)', name: 'en-US' },
    { displayName: 'French (France)', name: 'fr-FR' },
  ];

  const mockResources: LanguageResourceDto[] = [
    { name: 'AbpIdentity' },
    { name: 'LanguageManagement' },
  ];

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new LanguageService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should initialize with default apiName', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('create', () => {
    it('should call restService.request with correct parameters', async () => {
      const input: CreateLanguageDto = {
        displayName: 'French',
        cultureName: 'fr-FR',
        uiCultureName: 'fr-FR',
        flagIcon: 'fr',
        isEnabled: true,
      };

      const createdLanguage: LanguageDto = {
        ...mockLanguage,
        id: 'lang-2',
        cultureName: 'fr-FR',
        displayName: 'French',
      };

      mockRestService.request.mockResolvedValue(createdLanguage);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/language-management/languages',
        body: input,
      });
      expect(result).toEqual(createdLanguage);
    });

    it('should propagate errors from restService', async () => {
      const input: CreateLanguageDto = {
        displayName: 'Invalid',
        cultureName: '',
        uiCultureName: '',
        flagIcon: '',
        isEnabled: false,
      };

      const error = new Error('Validation failed');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.create(input)).rejects.toThrow('Validation failed');
    });

    it('should handle extraProperties in input', async () => {
      const input: CreateLanguageDto = {
        displayName: 'Spanish',
        cultureName: 'es-ES',
        uiCultureName: 'es-ES',
        flagIcon: 'es',
        isEnabled: true,
        extraProperties: { region: 'Europe' },
      };

      mockRestService.request.mockResolvedValue({ ...mockLanguage, ...input });

      await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/language-management/languages',
        body: input,
      });
    });
  });

  describe('delete', () => {
    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.delete('lang-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/language-management/languages/lang-1',
      });
    });

    it('should return void on success', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const result = await service.delete('lang-1');

      expect(result).toBeUndefined();
    });

    it('should propagate errors for non-existent language', async () => {
      const error = new Error('Language not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.delete('invalid-id')).rejects.toThrow('Language not found');
    });

    it('should handle special characters in id', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.delete('lang-with-special-chars-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/language-management/languages/lang-with-special-chars-123',
      });
    });
  });

  describe('get', () => {
    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(mockLanguage);

      const result = await service.get('lang-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/languages/lang-1',
      });
      expect(result).toEqual(mockLanguage);
    });

    it('should return the language with all properties', async () => {
      const fullLanguage: LanguageDto = {
        id: 'lang-full',
        cultureName: 'de-DE',
        uiCultureName: 'de-DE',
        displayName: 'German',
        flagIcon: 'de',
        isEnabled: true,
        isDefaultLanguage: false,
        creationTime: '2024-06-15T12:00:00Z',
        creatorId: 'admin-user',
        extraProperties: { customField: 'value' },
      };

      mockRestService.request.mockResolvedValue(fullLanguage);

      const result = await service.get('lang-full');

      expect(result.extraProperties).toEqual({ customField: 'value' });
      expect(result.creationTime).toBe('2024-06-15T12:00:00Z');
    });

    it('should propagate errors for non-existent language', async () => {
      const error = new Error('Language not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.get('invalid-id')).rejects.toThrow('Language not found');
    });
  });

  describe('getAllList', () => {
    it('should call restService.request with correct URL', async () => {
      mockRestService.request.mockResolvedValue(mockLanguageListResult);

      const result = await service.getAllList();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/languages/all',
      });
      expect(result).toEqual(mockLanguageListResult);
    });

    it('should return empty list when no languages exist', async () => {
      mockRestService.request.mockResolvedValue({ items: [] });

      const result = await service.getAllList();

      expect(result.items).toEqual([]);
    });

    it('should return multiple languages', async () => {
      const multipleLanguages: ListResultDto<LanguageDto> = {
        items: [
          mockLanguage,
          { ...mockLanguage, id: 'lang-2', cultureName: 'fr-FR', displayName: 'French' },
          { ...mockLanguage, id: 'lang-3', cultureName: 'de-DE', displayName: 'German' },
        ],
      };

      mockRestService.request.mockResolvedValue(multipleLanguages);

      const result = await service.getAllList();

      expect(result.items).toHaveLength(3);
    });
  });

  describe('getCulturelist', () => {
    it('should call restService.request with correct URL', async () => {
      mockRestService.request.mockResolvedValue(mockCultures);

      const result = await service.getCulturelist();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/languages/culture-list',
      });
      expect(result).toEqual(mockCultures);
    });

    it('should return empty array when no cultures available', async () => {
      mockRestService.request.mockResolvedValue([]);

      const result = await service.getCulturelist();

      expect(result).toEqual([]);
    });

    it('should return cultures with proper structure', async () => {
      const cultures: CultureInfoDto[] = [
        { displayName: 'English', name: 'en' },
        { displayName: 'Chinese (Simplified)', name: 'zh-Hans' },
      ];

      mockRestService.request.mockResolvedValue(cultures);

      const result = await service.getCulturelist();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('en');
      expect(result[1].displayName).toBe('Chinese (Simplified)');
    });
  });

  describe('getList', () => {
    it('should call restService.request without params when input is undefined', async () => {
      mockRestService.request.mockResolvedValue(mockLanguageListResult);

      const result = await service.getList();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/languages',
        params: undefined,
      });
      expect(result).toEqual(mockLanguageListResult);
    });

    it('should call restService.request with input params', async () => {
      const input: GetLanguagesTextsInput = {
        filter: 'english',
        maxResultCount: 10,
        skipCount: 0,
      };

      mockRestService.request.mockResolvedValue(mockLanguageListResult);

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/languages',
        params: input,
      });
      expect(result).toEqual(mockLanguageListResult);
    });

    it('should handle all query parameters', async () => {
      const input: GetLanguagesTextsInput = {
        filter: 'test',
        resourceName: 'AbpIdentity',
        baseCultureName: 'en',
        targetCultureName: 'fr',
        getOnlyEmptyValues: true,
        skipCount: 10,
        maxResultCount: 20,
        sorting: 'displayName asc',
      };

      mockRestService.request.mockResolvedValue(mockLanguageListResult);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/languages',
        params: input,
      });
    });
  });

  describe('getList v4.0.0 - PagedResultDto return type', () => {
    it('should return PagedResultDto with totalCount', async () => {
      const pagedResult: PagedResultDto<LanguageDto> = {
        items: [mockLanguage],
        totalCount: 42,
      };

      mockRestService.request.mockResolvedValue(pagedResult);

      const result = await service.getList();

      expect(result).toEqual(pagedResult);
      expect(result.totalCount).toBe(42);
      expect(result.items).toHaveLength(1);
    });

    it('should return empty PagedResultDto', async () => {
      const emptyResult: PagedResultDto<LanguageDto> = {
        items: [],
        totalCount: 0,
      };

      mockRestService.request.mockResolvedValue(emptyResult);

      const result = await service.getList();

      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should return totalCount greater than items length for pagination', async () => {
      const paginatedResult: PagedResultDto<LanguageDto> = {
        items: [mockLanguage],
        totalCount: 100,
      };

      mockRestService.request.mockResolvedValue(paginatedResult);

      const result = await service.getList({ maxResultCount: 1, skipCount: 0 });

      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(100);
    });
  });

  describe('getResources', () => {
    it('should call restService.request with correct URL', async () => {
      mockRestService.request.mockResolvedValue(mockResources);

      const result = await service.getResources();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/language-management/languages/resources',
      });
      expect(result).toEqual(mockResources);
    });

    it('should return empty array when no resources exist', async () => {
      mockRestService.request.mockResolvedValue([]);

      const result = await service.getResources();

      expect(result).toEqual([]);
    });

    it('should return multiple resources', async () => {
      const resources: LanguageResourceDto[] = [
        { name: 'AbpIdentity' },
        { name: 'AbpAccount' },
        { name: 'LanguageManagement' },
        { name: 'CustomModule' },
      ];

      mockRestService.request.mockResolvedValue(resources);

      const result = await service.getResources();

      expect(result).toHaveLength(4);
      expect(result.map((r) => r.name)).toContain('LanguageManagement');
    });
  });

  describe('setAsDefault', () => {
    it('should call restService.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.setAsDefault('lang-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/languages/lang-1/set-as-default',
      });
    });

    it('should return void on success', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const result = await service.setAsDefault('lang-1');

      expect(result).toBeUndefined();
    });

    it('should propagate errors for non-existent language', async () => {
      const error = new Error('Language not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.setAsDefault('invalid-id')).rejects.toThrow('Language not found');
    });

    it('should propagate permission errors', async () => {
      const error = new Error('Permission denied');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.setAsDefault('lang-1')).rejects.toThrow('Permission denied');
    });
  });

  describe('update', () => {
    it('should call restService.request with correct parameters', async () => {
      const input: UpdateLanguageDto = {
        displayName: 'English (Updated)',
        flagIcon: 'gb',
        isEnabled: true,
      };

      const updatedLanguage: LanguageDto = {
        ...mockLanguage,
        displayName: 'English (Updated)',
        flagIcon: 'gb',
      };

      mockRestService.request.mockResolvedValue(updatedLanguage);

      const result = await service.update('lang-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/languages/lang-1',
        body: input,
      });
      expect(result).toEqual(updatedLanguage);
    });

    it('should handle disabling a language', async () => {
      const input: UpdateLanguageDto = {
        displayName: 'Disabled Language',
        flagIcon: 'xx',
        isEnabled: false,
      };

      mockRestService.request.mockResolvedValue({
        ...mockLanguage,
        ...input,
        isEnabled: false,
      });

      const result = await service.update('lang-1', input);

      expect(result.isEnabled).toBe(false);
    });

    it('should propagate errors for non-existent language', async () => {
      const input: UpdateLanguageDto = {
        displayName: 'Test',
        flagIcon: 'xx',
        isEnabled: true,
      };

      const error = new Error('Language not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.update('invalid-id', input)).rejects.toThrow('Language not found');
    });

    it('should handle extraProperties in update', async () => {
      const input: UpdateLanguageDto = {
        displayName: 'Spanish',
        flagIcon: 'es',
        isEnabled: true,
        extraProperties: { updatedBy: 'admin' },
      };

      mockRestService.request.mockResolvedValue({ ...mockLanguage, ...input });

      await service.update('lang-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/language-management/languages/lang-1',
        body: input,
      });
    });
  });

  describe('error handling', () => {
    it('should propagate network errors', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.getAllList()).rejects.toThrow('Network error');
    });

    it('should propagate server errors', async () => {
      const error = new Error('Internal server error');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.getCulturelist()).rejects.toThrow('Internal server error');
    });

    it('should propagate validation errors', async () => {
      const input: CreateLanguageDto = {
        displayName: '',
        cultureName: '',
        uiCultureName: '',
        flagIcon: '',
        isEnabled: false,
      };

      const error = new Error('Validation failed: displayName is required');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.create(input)).rejects.toThrow('Validation failed');
    });
  });
});
