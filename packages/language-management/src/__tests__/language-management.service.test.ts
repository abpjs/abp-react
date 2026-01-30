/**
 * Tests for LanguageManagementService
 * @abpjs/language-management v0.7.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RestService } from '@abpjs/core';
import { LanguageManagementService } from '../services/language-management.service';
import type { LanguageManagement } from '../models';

// Mock RestService
const createMockRestService = (): RestService => {
  return {
    request: vi.fn(),
  } as unknown as RestService;
};

describe('LanguageManagementService', () => {
  let service: LanguageManagementService;
  let mockRestService: RestService;

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new LanguageManagementService(mockRestService);
  });

  describe('Language Operations', () => {
    describe('getLanguages', () => {
      it('should fetch languages with default params', async () => {
        const mockResponse: LanguageManagement.LanguageResponse = {
          items: [
            {
              id: '1',
              cultureName: 'en',
              uiCultureName: 'en',
              displayName: 'English',
              flagIcon: '🇺🇸',
              isEnabled: true,
              isDefaultLanguage: true,
              creationTime: '2024-01-01T00:00:00Z',
              creatorId: 'user1',
            },
          ],
          totalCount: 1,
        };
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

        const result = await service.getLanguages();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/language-management/languages',
          params: {},
        });
        expect(result).toEqual(mockResponse);
      });

      it('should fetch languages with pagination params', async () => {
        const params = { skipCount: 10, maxResultCount: 20 };
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue({
          items: [],
          totalCount: 0,
        });

        await service.getLanguages(params);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/language-management/languages',
          params,
        });
      });
    });

    describe('getLanguageById', () => {
      it('should fetch a language by ID', async () => {
        const mockLanguage: LanguageManagement.Language = {
          id: '1',
          cultureName: 'en',
          uiCultureName: 'en',
          displayName: 'English',
          flagIcon: '🇺🇸',
          isEnabled: true,
          isDefaultLanguage: true,
          creationTime: '2024-01-01T00:00:00Z',
          creatorId: 'user1',
        };
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockLanguage);

        const result = await service.getLanguageById('1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/language-management/languages/1',
        });
        expect(result).toEqual(mockLanguage);
      });
    });

    describe('createLanguage', () => {
      it('should create a new language', async () => {
        const input: LanguageManagement.CreateLanguageInput = {
          cultureName: 'tr',
          uiCultureName: 'tr',
          displayName: 'Turkish',
          flagIcon: '🇹🇷',
          isEnabled: true,
        };
        const mockLanguage: LanguageManagement.Language = {
          ...input,
          id: '2',
          isDefaultLanguage: false,
          creationTime: '2024-01-01T00:00:00Z',
          creatorId: 'user1',
        };
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockLanguage);

        const result = await service.createLanguage(input);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'POST',
          url: '/api/language-management/languages',
          body: input,
        });
        expect(result).toEqual(mockLanguage);
      });
    });

    describe('updateLanguage', () => {
      it('should update an existing language', async () => {
        const input: LanguageManagement.UpdateLanguageInput = {
          displayName: 'Turkish (Updated)',
          flagIcon: '🇹🇷',
          isEnabled: false,
        };
        const mockLanguage: LanguageManagement.Language = {
          id: '2',
          cultureName: 'tr',
          uiCultureName: 'tr',
          displayName: 'Turkish (Updated)',
          flagIcon: '🇹🇷',
          isEnabled: false,
          isDefaultLanguage: false,
          creationTime: '2024-01-01T00:00:00Z',
          creatorId: 'user1',
        };
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockLanguage);

        const result = await service.updateLanguage('2', input);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/language-management/languages/2',
          body: input,
        });
        expect(result).toEqual(mockLanguage);
      });
    });

    describe('deleteLanguage', () => {
      it('should delete a language', async () => {
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

        await service.deleteLanguage('2');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'DELETE',
          url: '/api/language-management/languages/2',
        });
      });
    });

    describe('setAsDefaultLanguage', () => {
      it('should set a language as default', async () => {
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

        await service.setAsDefaultLanguage('2');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/language-management/languages/2/set-as-default',
        });
      });
    });
  });

  describe('Culture Operations', () => {
    describe('getCultures', () => {
      it('should fetch all cultures', async () => {
        const mockCultures: LanguageManagement.Culture[] = [
          { name: 'en', displayName: 'English' },
          { name: 'tr', displayName: 'Turkish' },
        ];
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockCultures);

        const result = await service.getCultures();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/language-management/languages/culture-list',
        });
        expect(result).toEqual(mockCultures);
      });
    });
  });

  describe('Resource Operations', () => {
    describe('getResources', () => {
      it('should fetch all resources', async () => {
        const mockResources: LanguageManagement.Resource[] = [
          { name: 'MyResource' },
          { name: 'AnotherResource' },
        ];
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockResources);

        const result = await service.getResources();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/language-management/languages/resources',
        });
        expect(result).toEqual(mockResources);
      });
    });
  });

  describe('Language Text Operations', () => {
    describe('getLanguageTexts', () => {
      it('should fetch language texts with params', async () => {
        const params: LanguageManagement.LanguageTextQueryParams = {
          baseCultureName: 'en',
          targetCultureName: 'tr',
          getOnlyEmptyValues: false,
        };
        const mockResponse: LanguageManagement.LanguageTextResponse = {
          items: [
            {
              resourceName: 'MyResource',
              cultureName: 'tr',
              baseCultureName: 'en',
              baseValue: 'Hello',
              name: 'Hello',
              value: 'Merhaba',
            },
          ],
          totalCount: 1,
        };
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

        const result = await service.getLanguageTexts(params);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/language-management/language-texts',
          params: params as unknown,
        });
        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateLanguageTextByName', () => {
      it('should update a language text', async () => {
        const params: LanguageManagement.LanguageTextUpdateByNameParams = {
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
          value: 'Merhaba (Updated)',
        };
        const mockText: LanguageManagement.LanguageText = {
          resourceName: 'MyResource',
          cultureName: 'tr',
          baseCultureName: 'en',
          baseValue: 'Hello',
          name: 'Hello',
          value: 'Merhaba (Updated)',
        };
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockText);

        const result = await service.updateLanguageTextByName(params);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/language-management/language-texts/MyResource/tr/Hello',
          body: { value: 'Merhaba (Updated)' },
        });
        expect(result).toEqual(mockText);
      });
    });

    describe('restoreLanguageTextByName', () => {
      it('should restore a language text to default', async () => {
        const params: LanguageManagement.LanguageTextRequestByNameParams = {
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
        };
        (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

        await service.restoreLanguageTextByName(params);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/language-management/language-texts/MyResource/tr/Hello/restore',
        });
      });
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from RestService', async () => {
      const error = new Error('Network error');
      (mockRestService.request as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      await expect(service.getLanguages()).rejects.toThrow('Network error');
    });
  });
});
