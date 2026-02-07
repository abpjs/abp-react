/**
 * Tests for LanguageManagementStateService
 * @since 2.0.0
 * @updated 3.0.0 - Removed getLanguagesTotalCount() tests (removed in v3.0.0)
 * @updated 3.2.0 - Updated to use new proxy services
 * @updated 4.0.0 - Re-added getLanguagesTotalCount() tests, mockLanguageResponse now PagedResultDto
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageManagementStateService } from '../services/language-management-state.service';
import { LanguageService } from '../proxy/language.service';
import { LanguageTextService } from '../proxy/language-text.service';
import type {
  LanguageDto,
  LanguageTextDto,
  CultureInfoDto,
  LanguageResourceDto,
  CreateLanguageDto,
  UpdateLanguageDto,
  GetLanguagesTextsInput,
} from '../proxy/dto/models';

// Mock the proxy services
vi.mock('../proxy/language.service', () => ({
  LanguageService: vi.fn().mockImplementation(() => ({
    getList: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    setAsDefault: vi.fn(),
    getCulturelist: vi.fn(),
    getResources: vi.fn(),
  })),
}));

vi.mock('../proxy/language-text.service', () => ({
  LanguageTextService: vi.fn().mockImplementation(() => ({
    getList: vi.fn(),
    update: vi.fn(),
    restoreToDefault: vi.fn(),
  })),
}));

describe('LanguageManagementStateService', () => {
  let stateService: LanguageManagementStateService;
  let mockLanguageService: ReturnType<typeof vi.mocked<LanguageService>>;
  let mockLanguageTextService: ReturnType<typeof vi.mocked<LanguageTextService>>;
  const mockRestService = {} as any;

  // Sample test data
  const mockLanguage: LanguageDto = {
    id: 'lang-1',
    cultureName: 'en',
    uiCultureName: 'en',
    displayName: 'English',
    flagIcon: '🇺🇸',
    isEnabled: true,
    isDefaultLanguage: true,
    creationTime: '2024-01-01T00:00:00Z',
    creatorId: 'user-1',
  };

  const mockLanguageResponse = {
    items: [mockLanguage],
    totalCount: 1,
  };

  const mockLanguageText: LanguageTextDto = {
    resourceName: 'TestResource',
    cultureName: 'en',
    baseCultureName: 'en',
    baseValue: 'Hello',
    name: 'Greeting',
    value: 'Hello',
  };

  const mockLanguageTextsResponse = {
    items: [mockLanguageText],
    totalCount: 1,
  };

  const mockCulture: CultureInfoDto = {
    name: 'en',
    displayName: 'English',
  };

  const mockResource: LanguageResourceDto = {
    name: 'TestResource',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    stateService = new LanguageManagementStateService(mockRestService);
    // Get the mocked service instances
    mockLanguageService = (stateService as any).languageService;
    mockLanguageTextService = (stateService as any).languageTextService;
  });

  describe('Getter Methods', () => {
    it('should return empty arrays for initial state', () => {
      expect(stateService.getLanguages()).toEqual([]);
      expect(stateService.getLanguageTexts()).toEqual([]);
      expect(stateService.getCultures()).toEqual([]);
      expect(stateService.getResources()).toEqual([]);
    });

    it('should return zero for initial total counts', () => {
      expect(stateService.getLanguagesTotalCount()).toBe(0);
      expect(stateService.getLanguageTextsTotalCount()).toBe(0);
    });

    it('should return languages after dispatch', async () => {
      mockLanguageService.getList.mockResolvedValue(mockLanguageResponse);

      await stateService.dispatchGetLanguages();

      expect(stateService.getLanguages()).toEqual([mockLanguage]);
      expect(stateService.getLanguagesTotalCount()).toBe(1);
    });

    it('should return language texts after dispatch', async () => {
      mockLanguageTextService.getList.mockResolvedValue(mockLanguageTextsResponse);

      const params: GetLanguagesTextsInput = {
        baseCultureName: 'en',
        targetCultureName: 'fr',
        getOnlyEmptyValues: false,
      };

      await stateService.dispatchGetLanguageTexts(params);

      expect(stateService.getLanguageTexts()).toEqual([mockLanguageText]);
      expect(stateService.getLanguageTextsTotalCount()).toBe(1);
    });

    it('should return cultures after dispatch', async () => {
      mockLanguageService.getCulturelist.mockResolvedValue([mockCulture]);

      await stateService.dispatchGetLanguageCultures();

      expect(stateService.getCultures()).toEqual([mockCulture]);
    });

    it('should return resources after dispatch', async () => {
      mockLanguageService.getResources.mockResolvedValue([mockResource]);

      await stateService.dispatchGetLanguageResources();

      expect(stateService.getResources()).toEqual([mockResource]);
    });
  });

  describe('Language Dispatch Methods', () => {
    it('should dispatch getLanguages and update state', async () => {
      mockLanguageService.getList.mockResolvedValue(mockLanguageResponse);

      const params: GetLanguagesTextsInput = { maxResultCount: 10 };
      const result = await stateService.dispatchGetLanguages(params);

      expect(mockLanguageService.getList).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockLanguageResponse);
      expect(stateService.getLanguages()).toEqual([mockLanguage]);
    });

    it('should dispatch getLanguages with default params', async () => {
      mockLanguageService.getList.mockResolvedValue(mockLanguageResponse);

      await stateService.dispatchGetLanguages();

      expect(mockLanguageService.getList).toHaveBeenCalledWith(undefined);
    });

    it('should dispatch getLanguageById and update selectedItem', async () => {
      mockLanguageService.get.mockResolvedValue(mockLanguage);

      const result = await stateService.dispatchGetLanguageById('lang-1');

      expect(mockLanguageService.get).toHaveBeenCalledWith('lang-1');
      expect(result).toEqual(mockLanguage);
    });

    it('should dispatch createUpdateLanguage for create (without id)', async () => {
      const createInput: CreateLanguageDto = {
        cultureName: 'fr',
        uiCultureName: 'fr',
        displayName: 'French',
        flagIcon: '🇫🇷',
        isEnabled: true,
      };
      const createdLanguage: LanguageDto = { ...mockLanguage, id: 'lang-2', cultureName: 'fr', displayName: 'French' };

      mockLanguageService.create.mockResolvedValue(createdLanguage);
      mockLanguageService.getList.mockResolvedValue({ items: [createdLanguage] });

      const result = await stateService.dispatchCreateUpdateLanguage(createInput);

      expect(mockLanguageService.create).toHaveBeenCalledWith(createInput);
      expect(mockLanguageService.update).not.toHaveBeenCalled();
      expect(result).toEqual(createdLanguage);
      // Should refresh list after create
      expect(mockLanguageService.getList).toHaveBeenCalled();
    });

    it('should dispatch createUpdateLanguage for update (with id)', async () => {
      const updateInput: UpdateLanguageDto = {
        displayName: 'English (Updated)',
        flagIcon: '🇬🇧',
        isEnabled: true,
      };
      const updatedLanguage: LanguageDto = { ...mockLanguage, displayName: 'English (Updated)', flagIcon: '🇬🇧' };

      mockLanguageService.update.mockResolvedValue(updatedLanguage);
      mockLanguageService.getList.mockResolvedValue({ items: [updatedLanguage] });

      const result = await stateService.dispatchCreateUpdateLanguage(updateInput, 'lang-1');

      expect(mockLanguageService.update).toHaveBeenCalledWith('lang-1', updateInput);
      expect(mockLanguageService.create).not.toHaveBeenCalled();
      expect(result).toEqual(updatedLanguage);
      // Should refresh list after update
      expect(mockLanguageService.getList).toHaveBeenCalled();
    });

    it('should dispatch deleteLanguage', async () => {
      mockLanguageService.delete.mockResolvedValue(undefined);
      mockLanguageService.getList.mockResolvedValue({ items: [] });

      await stateService.dispatchDeleteLanguage('lang-1');

      expect(mockLanguageService.delete).toHaveBeenCalledWith('lang-1');
      // Should refresh list after delete
      expect(mockLanguageService.getList).toHaveBeenCalled();
    });

    it('should dispatch setAsDefaultLanguage', async () => {
      mockLanguageService.setAsDefault.mockResolvedValue(undefined);
      mockLanguageService.getList.mockResolvedValue(mockLanguageResponse);

      await stateService.dispatchSetAsDefaultLanguage('lang-1');

      expect(mockLanguageService.setAsDefault).toHaveBeenCalledWith('lang-1');
      // Should refresh list after setting default
      expect(mockLanguageService.getList).toHaveBeenCalled();
    });
  });

  describe('Language Text Dispatch Methods', () => {
    it('should dispatch getLanguageTexts and update state', async () => {
      mockLanguageTextService.getList.mockResolvedValue(mockLanguageTextsResponse);

      const params: GetLanguagesTextsInput = {
        baseCultureName: 'en',
        targetCultureName: 'fr',
        getOnlyEmptyValues: false,
        resourceName: 'TestResource',
        maxResultCount: 10,
        skipCount: 0,
      };

      const result = await stateService.dispatchGetLanguageTexts(params);

      expect(mockLanguageTextService.getList).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockLanguageTextsResponse);
      expect(stateService.getLanguageTexts()).toEqual([mockLanguageText]);
    });

    it('should dispatch updateLanguageTextByName', async () => {
      const params = {
        resourceName: 'TestResource',
        cultureName: 'fr',
        name: 'Greeting',
        value: 'Bonjour',
      };

      mockLanguageTextService.update.mockResolvedValue(undefined);

      await stateService.dispatchUpdateLanguageTextByName(params);

      expect(mockLanguageTextService.update).toHaveBeenCalledWith(
        params.resourceName,
        params.cultureName,
        params.name,
        params.value
      );
    });

    it('should dispatch restoreLanguageTextByName', async () => {
      const params = {
        resourceName: 'TestResource',
        cultureName: 'fr',
        name: 'Greeting',
      };

      mockLanguageTextService.restoreToDefault.mockResolvedValue(undefined);

      await stateService.dispatchRestoreLanguageTextByName(params);

      expect(mockLanguageTextService.restoreToDefault).toHaveBeenCalledWith(
        params.resourceName,
        params.cultureName,
        params.name
      );
    });
  });

  describe('Culture & Resource Dispatch Methods', () => {
    it('should dispatch getLanguageCultures and update state', async () => {
      const cultures: CultureInfoDto[] = [mockCulture, { name: 'fr', displayName: 'French' }];
      mockLanguageService.getCulturelist.mockResolvedValue(cultures);

      const result = await stateService.dispatchGetLanguageCultures();

      expect(mockLanguageService.getCulturelist).toHaveBeenCalled();
      expect(result).toEqual(cultures);
      expect(stateService.getCultures()).toEqual(cultures);
    });

    it('should dispatch getLanguageResources and update state', async () => {
      const resources: LanguageResourceDto[] = [mockResource, { name: 'AnotherResource' }];
      mockLanguageService.getResources.mockResolvedValue(resources);

      const result = await stateService.dispatchGetLanguageResources();

      expect(mockLanguageService.getResources).toHaveBeenCalled();
      expect(result).toEqual(resources);
      expect(stateService.getResources()).toEqual(resources);
    });
  });

  describe('State Persistence', () => {
    it('should preserve state across multiple dispatches', async () => {
      // First dispatch cultures
      mockLanguageService.getCulturelist.mockResolvedValue([mockCulture]);
      await stateService.dispatchGetLanguageCultures();

      // Then dispatch resources
      mockLanguageService.getResources.mockResolvedValue([mockResource]);
      await stateService.dispatchGetLanguageResources();

      // Then dispatch languages
      mockLanguageService.getList.mockResolvedValue(mockLanguageResponse);
      await stateService.dispatchGetLanguages();

      // All state should be preserved
      expect(stateService.getCultures()).toEqual([mockCulture]);
      expect(stateService.getResources()).toEqual([mockResource]);
      expect(stateService.getLanguages()).toEqual([mockLanguage]);
    });

    it('should handle empty responses', async () => {
      mockLanguageService.getList.mockResolvedValue({ items: [], totalCount: 0 });
      mockLanguageTextService.getList.mockResolvedValue({ items: [], totalCount: 0 });
      mockLanguageService.getCulturelist.mockResolvedValue([]);
      mockLanguageService.getResources.mockResolvedValue([]);

      await stateService.dispatchGetLanguages();
      await stateService.dispatchGetLanguageTexts({
        baseCultureName: 'en',
        targetCultureName: 'fr',
        getOnlyEmptyValues: false,
      });
      await stateService.dispatchGetLanguageCultures();
      await stateService.dispatchGetLanguageResources();

      expect(stateService.getLanguages()).toEqual([]);
      expect(stateService.getLanguagesTotalCount()).toBe(0);
      expect(stateService.getLanguageTexts()).toEqual([]);
      expect(stateService.getLanguageTextsTotalCount()).toBe(0);
      expect(stateService.getCultures()).toEqual([]);
      expect(stateService.getResources()).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined languageResponse items gracefully', () => {
      // Access getters before any state is set - should return defaults
      expect(stateService.getLanguages()).toEqual([]);
      expect(stateService.getLanguagesTotalCount()).toBe(0);
    });

    it('should handle undefined languageTextsResponse items gracefully', () => {
      expect(stateService.getLanguageTexts()).toEqual([]);
      expect(stateService.getLanguageTextsTotalCount()).toBe(0);
    });

    it('should handle undefined cultures gracefully', () => {
      expect(stateService.getCultures()).toEqual([]);
    });

    it('should handle undefined resources gracefully', () => {
      expect(stateService.getResources()).toEqual([]);
    });

    it('should handle large datasets', async () => {
      const manyLanguages = Array.from({ length: 100 }, (_, i) => ({
        ...mockLanguage,
        id: `lang-${i}`,
        cultureName: `culture-${i}`,
      }));

      mockLanguageService.getList.mockResolvedValue({
        items: manyLanguages,
        totalCount: 500,
      });

      await stateService.dispatchGetLanguages({ maxResultCount: 100 });

      expect(stateService.getLanguages()).toHaveLength(100);
      expect(stateService.getLanguagesTotalCount()).toBe(500);
    });
  });

  describe('v4.0.0 - getLanguagesTotalCount', () => {
    it('should return 0 before any dispatch', () => {
      expect(stateService.getLanguagesTotalCount()).toBe(0);
    });

    it('should return totalCount from dispatched response', async () => {
      mockLanguageService.getList.mockResolvedValue({
        items: [mockLanguage],
        totalCount: 42,
      });

      await stateService.dispatchGetLanguages();

      expect(stateService.getLanguagesTotalCount()).toBe(42);
    });

    it('should update totalCount when response changes', async () => {
      mockLanguageService.getList.mockResolvedValue({
        items: [mockLanguage],
        totalCount: 10,
      });
      await stateService.dispatchGetLanguages();
      expect(stateService.getLanguagesTotalCount()).toBe(10);

      mockLanguageService.getList.mockResolvedValue({
        items: [],
        totalCount: 0,
      });
      await stateService.dispatchGetLanguages();
      expect(stateService.getLanguagesTotalCount()).toBe(0);
    });

    it('should default to 0 when totalCount is undefined', async () => {
      mockLanguageService.getList.mockResolvedValue({
        items: [mockLanguage],
      });

      await stateService.dispatchGetLanguages();

      // totalCount not in response - should fallback to 0
      expect(stateService.getLanguagesTotalCount()).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from getLanguages', async () => {
      const error = new Error('Network error');
      mockLanguageService.getList.mockRejectedValue(error);

      await expect(stateService.dispatchGetLanguages()).rejects.toThrow('Network error');
    });

    it('should propagate errors from getLanguageById', async () => {
      const error = new Error('Language not found');
      mockLanguageService.get.mockRejectedValue(error);

      await expect(stateService.dispatchGetLanguageById('invalid-id')).rejects.toThrow('Language not found');
    });

    it('should propagate errors from createLanguage', async () => {
      const error = new Error('Validation failed');
      mockLanguageService.create.mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateUpdateLanguage({
          cultureName: 'invalid',
          uiCultureName: 'invalid',
          displayName: '',
          flagIcon: '',
          isEnabled: true,
        })
      ).rejects.toThrow('Validation failed');
    });

    it('should propagate errors from updateLanguage', async () => {
      const error = new Error('Update failed');
      mockLanguageService.update.mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateUpdateLanguage(
          { displayName: 'Updated', flagIcon: '', isEnabled: true },
          'lang-1'
        )
      ).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deleteLanguage', async () => {
      const error = new Error('Cannot delete default language');
      mockLanguageService.delete.mockRejectedValue(error);

      await expect(stateService.dispatchDeleteLanguage('lang-1')).rejects.toThrow('Cannot delete default language');
    });

    it('should propagate errors from setAsDefaultLanguage', async () => {
      const error = new Error('Permission denied');
      mockLanguageService.setAsDefault.mockRejectedValue(error);

      await expect(stateService.dispatchSetAsDefaultLanguage('lang-1')).rejects.toThrow('Permission denied');
    });

    it('should propagate errors from getLanguageTexts', async () => {
      const error = new Error('Invalid parameters');
      mockLanguageTextService.getList.mockRejectedValue(error);

      await expect(
        stateService.dispatchGetLanguageTexts({
          baseCultureName: 'en',
          targetCultureName: 'fr',
          getOnlyEmptyValues: false,
        })
      ).rejects.toThrow('Invalid parameters');
    });

    it('should propagate errors from updateLanguageTextByName', async () => {
      const error = new Error('Text not found');
      mockLanguageTextService.update.mockRejectedValue(error);

      await expect(
        stateService.dispatchUpdateLanguageTextByName({
          resourceName: 'Test',
          cultureName: 'en',
          name: 'invalid',
          value: 'value',
        })
      ).rejects.toThrow('Text not found');
    });

    it('should propagate errors from restoreLanguageTextByName', async () => {
      const error = new Error('Restore failed');
      mockLanguageTextService.restoreToDefault.mockRejectedValue(error);

      await expect(
        stateService.dispatchRestoreLanguageTextByName({
          resourceName: 'Test',
          cultureName: 'en',
          name: 'invalid',
        })
      ).rejects.toThrow('Restore failed');
    });

    it('should propagate errors from getCultures', async () => {
      const error = new Error('Cultures fetch failed');
      mockLanguageService.getCulturelist.mockRejectedValue(error);

      await expect(stateService.dispatchGetLanguageCultures()).rejects.toThrow('Cultures fetch failed');
    });

    it('should propagate errors from getResources', async () => {
      const error = new Error('Resources fetch failed');
      mockLanguageService.getResources.mockRejectedValue(error);

      await expect(stateService.dispatchGetLanguageResources()).rejects.toThrow('Resources fetch failed');
    });
  });
});
