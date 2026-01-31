/**
 * Tests for LanguageManagementStateService
 * @since 2.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LanguageManagementStateService } from '../services/language-management-state.service';
import { LanguageManagementService } from '../services/language-management.service';
import type { LanguageManagement } from '../models';

// Mock the LanguageManagementService
vi.mock('../services/language-management.service', () => ({
  LanguageManagementService: vi.fn().mockImplementation(() => ({
    getLanguages: vi.fn(),
    getLanguageById: vi.fn(),
    createLanguage: vi.fn(),
    updateLanguage: vi.fn(),
    deleteLanguage: vi.fn(),
    setAsDefaultLanguage: vi.fn(),
    getLanguageTexts: vi.fn(),
    updateLanguageTextByName: vi.fn(),
    restoreLanguageTextByName: vi.fn(),
    getCultures: vi.fn(),
    getResources: vi.fn(),
  })),
}));

describe('LanguageManagementStateService', () => {
  let stateService: LanguageManagementStateService;
  let mockService: ReturnType<typeof vi.mocked<LanguageManagementService>>;
  const mockRestService = {} as any;

  // Sample test data
  const mockLanguage: LanguageManagement.Language = {
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

  const mockLanguageResponse: LanguageManagement.LanguageResponse = {
    items: [mockLanguage],
    totalCount: 1,
  };

  const mockLanguageText: LanguageManagement.LanguageText = {
    resourceName: 'TestResource',
    cultureName: 'en',
    baseCultureName: 'en',
    baseValue: 'Hello',
    name: 'Greeting',
    value: 'Hello',
  };

  const mockLanguageTextsResponse: LanguageManagement.LanguageTextResponse = {
    items: [mockLanguageText],
    totalCount: 1,
  };

  const mockCulture: LanguageManagement.Culture = {
    name: 'en',
    displayName: 'English',
  };

  const mockResource: LanguageManagement.Resource = {
    name: 'TestResource',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    stateService = new LanguageManagementStateService(mockRestService);
    // Get the mocked service instance
    mockService = (stateService as any).service;
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
      mockService.getLanguages.mockResolvedValue(mockLanguageResponse);

      await stateService.dispatchGetLanguages();

      expect(stateService.getLanguages()).toEqual([mockLanguage]);
      expect(stateService.getLanguagesTotalCount()).toBe(1);
    });

    it('should return language texts after dispatch', async () => {
      mockService.getLanguageTexts.mockResolvedValue(mockLanguageTextsResponse);

      await stateService.dispatchGetLanguageTexts({
        baseCultureName: 'en',
        targetCultureName: 'fr',
        getOnlyEmptyValues: false,
      });

      expect(stateService.getLanguageTexts()).toEqual([mockLanguageText]);
      expect(stateService.getLanguageTextsTotalCount()).toBe(1);
    });

    it('should return cultures after dispatch', async () => {
      mockService.getCultures.mockResolvedValue([mockCulture]);

      await stateService.dispatchGetLanguageCultures();

      expect(stateService.getCultures()).toEqual([mockCulture]);
    });

    it('should return resources after dispatch', async () => {
      mockService.getResources.mockResolvedValue([mockResource]);

      await stateService.dispatchGetLanguageResources();

      expect(stateService.getResources()).toEqual([mockResource]);
    });
  });

  describe('Language Dispatch Methods', () => {
    it('should dispatch getLanguages and update state', async () => {
      mockService.getLanguages.mockResolvedValue(mockLanguageResponse);

      const result = await stateService.dispatchGetLanguages({ maxResultCount: 10 });

      expect(mockService.getLanguages).toHaveBeenCalledWith({ maxResultCount: 10 });
      expect(result).toEqual(mockLanguageResponse);
      expect(stateService.getLanguages()).toEqual([mockLanguage]);
    });

    it('should dispatch getLanguages with default params', async () => {
      mockService.getLanguages.mockResolvedValue(mockLanguageResponse);

      await stateService.dispatchGetLanguages();

      expect(mockService.getLanguages).toHaveBeenCalledWith({});
    });

    it('should dispatch getLanguageById and update selectedItem', async () => {
      mockService.getLanguageById.mockResolvedValue(mockLanguage);

      const result = await stateService.dispatchGetLanguageById('lang-1');

      expect(mockService.getLanguageById).toHaveBeenCalledWith('lang-1');
      expect(result).toEqual(mockLanguage);
    });

    it('should dispatch createUpdateLanguage for create (without id)', async () => {
      const createInput: LanguageManagement.CreateLanguageInput = {
        cultureName: 'fr',
        uiCultureName: 'fr',
        displayName: 'French',
        flagIcon: '🇫🇷',
        isEnabled: true,
      };
      const createdLanguage = { ...mockLanguage, id: 'lang-2', cultureName: 'fr', displayName: 'French' };

      mockService.createLanguage.mockResolvedValue(createdLanguage);
      mockService.getLanguages.mockResolvedValue({ items: [createdLanguage], totalCount: 1 });

      const result = await stateService.dispatchCreateUpdateLanguage(createInput);

      expect(mockService.createLanguage).toHaveBeenCalledWith(createInput);
      expect(mockService.updateLanguage).not.toHaveBeenCalled();
      expect(result).toEqual(createdLanguage);
      // Should refresh list after create
      expect(mockService.getLanguages).toHaveBeenCalled();
    });

    it('should dispatch createUpdateLanguage for update (with id)', async () => {
      const updateInput: LanguageManagement.UpdateLanguageInput = {
        displayName: 'English (Updated)',
        flagIcon: '🇬🇧',
        isEnabled: true,
      };
      const updatedLanguage = { ...mockLanguage, displayName: 'English (Updated)', flagIcon: '🇬🇧' };

      mockService.updateLanguage.mockResolvedValue(updatedLanguage);
      mockService.getLanguages.mockResolvedValue({ items: [updatedLanguage], totalCount: 1 });

      const result = await stateService.dispatchCreateUpdateLanguage(updateInput, 'lang-1');

      expect(mockService.updateLanguage).toHaveBeenCalledWith('lang-1', updateInput);
      expect(mockService.createLanguage).not.toHaveBeenCalled();
      expect(result).toEqual(updatedLanguage);
      // Should refresh list after update
      expect(mockService.getLanguages).toHaveBeenCalled();
    });

    it('should dispatch deleteLanguage and return null', async () => {
      mockService.deleteLanguage.mockResolvedValue(undefined);
      mockService.getLanguages.mockResolvedValue({ items: [], totalCount: 0 });

      const result = await stateService.dispatchDeleteLanguage('lang-1');

      expect(mockService.deleteLanguage).toHaveBeenCalledWith('lang-1');
      expect(result).toBeNull();
      // Should refresh list after delete
      expect(mockService.getLanguages).toHaveBeenCalled();
    });

    it('should dispatch setAsDefaultLanguage', async () => {
      mockService.setAsDefaultLanguage.mockResolvedValue(undefined);
      mockService.getLanguages.mockResolvedValue(mockLanguageResponse);

      await stateService.dispatchSetAsDefaultLanguage('lang-1');

      expect(mockService.setAsDefaultLanguage).toHaveBeenCalledWith('lang-1');
      // Should refresh list after setting default
      expect(mockService.getLanguages).toHaveBeenCalled();
    });
  });

  describe('Language Text Dispatch Methods', () => {
    it('should dispatch getLanguageTexts and update state', async () => {
      mockService.getLanguageTexts.mockResolvedValue(mockLanguageTextsResponse);

      const params: LanguageManagement.LanguageTextQueryParams = {
        baseCultureName: 'en',
        targetCultureName: 'fr',
        getOnlyEmptyValues: false,
        resourceName: 'TestResource',
        maxResultCount: 10,
        skipCount: 0,
      };

      const result = await stateService.dispatchGetLanguageTexts(params);

      expect(mockService.getLanguageTexts).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockLanguageTextsResponse);
      expect(stateService.getLanguageTexts()).toEqual([mockLanguageText]);
    });

    it('should dispatch updateLanguageTextByName', async () => {
      const params: LanguageManagement.LanguageTextUpdateByNameParams = {
        resourceName: 'TestResource',
        cultureName: 'fr',
        name: 'Greeting',
        value: 'Bonjour',
      };
      const updatedText = { ...mockLanguageText, value: 'Bonjour', cultureName: 'fr' };

      mockService.updateLanguageTextByName.mockResolvedValue(updatedText);

      const result = await stateService.dispatchUpdateLanguageTextByName(params);

      expect(mockService.updateLanguageTextByName).toHaveBeenCalledWith(params);
      expect(result).toEqual(updatedText);
    });

    it('should dispatch restoreLanguageTextByName', async () => {
      const params: LanguageManagement.LanguageTextRequestByNameParams = {
        resourceName: 'TestResource',
        cultureName: 'fr',
        name: 'Greeting',
      };

      mockService.restoreLanguageTextByName.mockResolvedValue(undefined);

      await stateService.dispatchRestoreLanguageTextByName(params);

      expect(mockService.restoreLanguageTextByName).toHaveBeenCalledWith(params);
    });
  });

  describe('Culture & Resource Dispatch Methods', () => {
    it('should dispatch getLanguageCultures and update state', async () => {
      const cultures = [mockCulture, { name: 'fr', displayName: 'French' }];
      mockService.getCultures.mockResolvedValue(cultures);

      const result = await stateService.dispatchGetLanguageCultures();

      expect(mockService.getCultures).toHaveBeenCalled();
      expect(result).toEqual(cultures);
      expect(stateService.getCultures()).toEqual(cultures);
    });

    it('should dispatch getLanguageResources and update state', async () => {
      const resources = [mockResource, { name: 'AnotherResource' }];
      mockService.getResources.mockResolvedValue(resources);

      const result = await stateService.dispatchGetLanguageResources();

      expect(mockService.getResources).toHaveBeenCalled();
      expect(result).toEqual(resources);
      expect(stateService.getResources()).toEqual(resources);
    });
  });

  describe('State Persistence', () => {
    it('should preserve state across multiple dispatches', async () => {
      // First dispatch cultures
      mockService.getCultures.mockResolvedValue([mockCulture]);
      await stateService.dispatchGetLanguageCultures();

      // Then dispatch resources
      mockService.getResources.mockResolvedValue([mockResource]);
      await stateService.dispatchGetLanguageResources();

      // Then dispatch languages
      mockService.getLanguages.mockResolvedValue(mockLanguageResponse);
      await stateService.dispatchGetLanguages();

      // All state should be preserved
      expect(stateService.getCultures()).toEqual([mockCulture]);
      expect(stateService.getResources()).toEqual([mockResource]);
      expect(stateService.getLanguages()).toEqual([mockLanguage]);
    });

    it('should handle empty responses', async () => {
      mockService.getLanguages.mockResolvedValue({ items: [], totalCount: 0 });
      mockService.getLanguageTexts.mockResolvedValue({ items: [], totalCount: 0 });
      mockService.getCultures.mockResolvedValue([]);
      mockService.getResources.mockResolvedValue([]);

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

      mockService.getLanguages.mockResolvedValue({
        items: manyLanguages,
        totalCount: 1000, // More than items in this page
      });

      await stateService.dispatchGetLanguages({ maxResultCount: 100 });

      expect(stateService.getLanguages()).toHaveLength(100);
      expect(stateService.getLanguagesTotalCount()).toBe(1000);
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from getLanguages', async () => {
      const error = new Error('Network error');
      mockService.getLanguages.mockRejectedValue(error);

      await expect(stateService.dispatchGetLanguages()).rejects.toThrow('Network error');
    });

    it('should propagate errors from getLanguageById', async () => {
      const error = new Error('Language not found');
      mockService.getLanguageById.mockRejectedValue(error);

      await expect(stateService.dispatchGetLanguageById('invalid-id')).rejects.toThrow('Language not found');
    });

    it('should propagate errors from createLanguage', async () => {
      const error = new Error('Validation failed');
      mockService.createLanguage.mockRejectedValue(error);

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
      mockService.updateLanguage.mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateUpdateLanguage(
          { displayName: 'Updated', flagIcon: '', isEnabled: true },
          'lang-1'
        )
      ).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deleteLanguage', async () => {
      const error = new Error('Cannot delete default language');
      mockService.deleteLanguage.mockRejectedValue(error);

      await expect(stateService.dispatchDeleteLanguage('lang-1')).rejects.toThrow('Cannot delete default language');
    });

    it('should propagate errors from setAsDefaultLanguage', async () => {
      const error = new Error('Permission denied');
      mockService.setAsDefaultLanguage.mockRejectedValue(error);

      await expect(stateService.dispatchSetAsDefaultLanguage('lang-1')).rejects.toThrow('Permission denied');
    });

    it('should propagate errors from getLanguageTexts', async () => {
      const error = new Error('Invalid parameters');
      mockService.getLanguageTexts.mockRejectedValue(error);

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
      mockService.updateLanguageTextByName.mockRejectedValue(error);

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
      mockService.restoreLanguageTextByName.mockRejectedValue(error);

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
      mockService.getCultures.mockRejectedValue(error);

      await expect(stateService.dispatchGetLanguageCultures()).rejects.toThrow('Cultures fetch failed');
    });

    it('should propagate errors from getResources', async () => {
      const error = new Error('Resources fetch failed');
      mockService.getResources.mockRejectedValue(error);

      await expect(stateService.dispatchGetLanguageResources()).rejects.toThrow('Resources fetch failed');
    });
  });
});
