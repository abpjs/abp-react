/**
 * Tests for useLanguages hook
 * @abpjs/language-management v0.7.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguages } from '../hooks/useLanguages';
import type { LanguageManagement } from '../models';

// Mock @abpjs/core
const mockRequest = vi.fn();
vi.mock('@abpjs/core', () => ({
  useRestService: () => ({
    request: mockRequest,
  }),
}));

describe('useLanguages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useLanguages());

      expect(result.current.languages).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.cultures).toEqual([]);
      expect(result.current.selectedLanguage).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchLanguages', () => {
    it('should fetch languages successfully', async () => {
      const mockLanguages: LanguageManagement.Language[] = [
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
      ];

      mockRequest.mockResolvedValueOnce({
        items: mockLanguages,
        totalCount: 1,
      });

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        await result.current.fetchLanguages();
      });

      expect(result.current.languages).toEqual(mockLanguages);
      expect(result.current.totalCount).toBe(1);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.fetchLanguages();
        expect(res.success).toBe(false);
        expect(res.error).toBe('Network error');
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('fetchCultures', () => {
    it('should fetch cultures successfully', async () => {
      const mockCultures: LanguageManagement.Culture[] = [
        { name: 'en', displayName: 'English' },
        { name: 'tr', displayName: 'Turkish' },
      ];

      mockRequest.mockResolvedValueOnce(mockCultures);

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        await result.current.fetchCultures();
      });

      expect(result.current.cultures).toEqual(mockCultures);
    });
  });

  describe('createLanguage', () => {
    it('should create a language successfully', async () => {
      const input: LanguageManagement.CreateLanguageInput = {
        cultureName: 'tr',
        uiCultureName: 'tr',
        displayName: 'Turkish',
        flagIcon: '🇹🇷',
        isEnabled: true,
      };

      // Mock create request
      mockRequest.mockResolvedValueOnce({
        id: '2',
        ...input,
        isDefaultLanguage: false,
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'user1',
      });

      // Mock fetch languages request (called after create)
      mockRequest.mockResolvedValueOnce({
        items: [],
        totalCount: 0,
      });

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.createLanguage(input);
        expect(res.success).toBe(true);
      });
    });

    it('should handle create error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Create failed'));

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.createLanguage({
          cultureName: 'tr',
          uiCultureName: 'tr',
          displayName: 'Turkish',
          flagIcon: '🇹🇷',
          isEnabled: true,
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Create failed');
      });
    });
  });

  describe('updateLanguage', () => {
    it('should update a language successfully', async () => {
      const input: LanguageManagement.UpdateLanguageInput = {
        displayName: 'Turkish (Updated)',
        flagIcon: '🇹🇷',
        isEnabled: false,
      };

      // Mock update request
      mockRequest.mockResolvedValueOnce({
        id: '2',
        cultureName: 'tr',
        uiCultureName: 'tr',
        ...input,
        isDefaultLanguage: false,
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'user1',
      });

      // Mock fetch languages request
      mockRequest.mockResolvedValueOnce({
        items: [],
        totalCount: 0,
      });

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.updateLanguage('2', input);
        expect(res.success).toBe(true);
      });
    });

    it('should handle update error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Update failed'));

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.updateLanguage('2', {
          displayName: 'Test',
          flagIcon: '',
          isEnabled: true,
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Update failed');
      });
    });
  });

  describe('deleteLanguage', () => {
    it('should delete a language successfully', async () => {
      // Mock delete request
      mockRequest.mockResolvedValueOnce(undefined);

      // Mock fetch languages request
      mockRequest.mockResolvedValueOnce({
        items: [],
        totalCount: 0,
      });

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.deleteLanguage('2');
        expect(res.success).toBe(true);
      });
    });

    it('should handle delete error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Delete failed'));

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.deleteLanguage('2');
        expect(res.success).toBe(false);
        expect(res.error).toBe('Delete failed');
      });
    });
  });

  describe('setAsDefaultLanguage', () => {
    it('should set a language as default successfully', async () => {
      // Mock set default request
      mockRequest.mockResolvedValueOnce(undefined);

      // Mock fetch languages request
      mockRequest.mockResolvedValueOnce({
        items: [],
        totalCount: 0,
      });

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.setAsDefaultLanguage('2');
        expect(res.success).toBe(true);
      });
    });

    it('should handle set default error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Set default failed'));

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.setAsDefaultLanguage('2');
        expect(res.success).toBe(false);
        expect(res.error).toBe('Set default failed');
      });
    });
  });

  describe('getLanguageById', () => {
    it('should get a language by ID and set as selected', async () => {
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

      mockRequest.mockResolvedValueOnce(mockLanguage);

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.getLanguageById('1');
        expect(res.success).toBe(true);
      });

      expect(result.current.selectedLanguage).toEqual(mockLanguage);
    });
  });

  describe('setSelectedLanguage', () => {
    it('should set and clear selected language', () => {
      const { result } = renderHook(() => useLanguages());

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

      act(() => {
        result.current.setSelectedLanguage(mockLanguage);
      });

      expect(result.current.selectedLanguage).toEqual(mockLanguage);

      act(() => {
        result.current.setSelectedLanguage(null);
      });

      expect(result.current.selectedLanguage).toBeNull();
    });
  });

  describe('sorting', () => {
    it('should set sort key and order', () => {
      const { result } = renderHook(() => useLanguages());

      act(() => {
        result.current.setSortKey('cultureName');
      });

      expect(result.current.sortKey).toBe('cultureName');

      act(() => {
        result.current.setSortOrder('asc');
      });

      expect(result.current.sortOrder).toBe('asc');
    });
  });

  describe('reset', () => {
    it('should reset all state', async () => {
      mockRequest.mockResolvedValueOnce({
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
      });

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        await result.current.fetchLanguages();
      });

      expect(result.current.languages.length).toBe(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.languages).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.cultures).toEqual([]);
      expect(result.current.selectedLanguage).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchCultures edge cases', () => {
    it('should handle fetch cultures error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Fetch cultures failed'));

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.fetchCultures();
        expect(res.success).toBe(false);
        expect(res.error).toBe('Fetch cultures failed');
      });

      expect(result.current.error).toBe('Fetch cultures failed');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('getLanguageById edge cases', () => {
    it('should handle get language by ID error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Language not found'));

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.getLanguageById('invalid-id');
        expect(res.success).toBe(false);
        expect(res.error).toBe('Language not found');
      });

      expect(result.current.error).toBe('Language not found');
    });
  });

  describe('fetchLanguages with pagination', () => {
    it('should fetch languages with pagination params', async () => {
      mockRequest.mockResolvedValueOnce({
        items: [],
        totalCount: 100,
      });

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        await result.current.fetchLanguages({ skipCount: 10, maxResultCount: 20 });
      });

      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { skipCount: 10, maxResultCount: 20 },
        })
      );
    });
  });

  describe('error handling with non-Error objects', () => {
    it('should handle non-Error rejection in fetchLanguages', async () => {
      mockRequest.mockRejectedValueOnce('String error');

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.fetchLanguages();
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to fetch languages');
      });
    });

    it('should handle non-Error rejection in fetchCultures', async () => {
      mockRequest.mockRejectedValueOnce({ message: 'Object error' });

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.fetchCultures();
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to fetch cultures');
      });
    });

    it('should handle non-Error rejection in createLanguage', async () => {
      mockRequest.mockRejectedValueOnce(null);

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.createLanguage({
          cultureName: 'de',
          uiCultureName: 'de',
          displayName: 'German',
          flagIcon: '',
          isEnabled: true,
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to create language');
      });
    });

    it('should handle non-Error rejection in updateLanguage', async () => {
      mockRequest.mockRejectedValueOnce(undefined);

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.updateLanguage('1', {
          displayName: 'Test',
          flagIcon: '',
          isEnabled: true,
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to update language');
      });
    });

    it('should handle non-Error rejection in deleteLanguage', async () => {
      mockRequest.mockRejectedValueOnce(42);

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.deleteLanguage('1');
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to delete language');
      });
    });

    it('should handle non-Error rejection in setAsDefaultLanguage', async () => {
      mockRequest.mockRejectedValueOnce([]);

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.setAsDefaultLanguage('1');
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to set language as default');
      });
    });

    it('should handle non-Error rejection in getLanguageById', async () => {
      mockRequest.mockRejectedValueOnce(false);

      const { result } = renderHook(() => useLanguages());

      await act(async () => {
        const res = await result.current.getLanguageById('1');
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to fetch language');
      });
    });
  });
});
