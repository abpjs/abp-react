/**
 * Tests for useLanguageTexts hook
 * @abpjs/language-management v0.7.2
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguageTexts } from '../hooks/useLanguageTexts';
import type { LanguageManagement } from '../models';

// Mock @abpjs/core
const mockRequest = vi.fn();
vi.mock('@abpjs/core', () => ({
  useRestService: () => ({
    request: mockRequest,
  }),
}));

describe('useLanguageTexts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useLanguageTexts());

      expect(result.current.languageTexts).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.resources).toEqual([]);
      expect(result.current.selectedLanguageText).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchLanguageTexts', () => {
    it('should fetch language texts successfully', async () => {
      const mockTexts: LanguageManagement.LanguageText[] = [
        {
          resourceName: 'MyResource',
          cultureName: 'tr',
          baseCultureName: 'en',
          baseValue: 'Hello',
          name: 'Hello',
          value: 'Merhaba',
        },
      ];

      mockRequest.mockResolvedValueOnce({
        items: mockTexts,
        totalCount: 1,
      });

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        await result.current.fetchLanguageTexts({
          baseCultureName: 'en',
          targetCultureName: 'tr',
          getOnlyEmptyValues: false,
        });
      });

      expect(result.current.languageTexts).toEqual(mockTexts);
      expect(result.current.totalCount).toBe(1);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.fetchLanguageTexts({
          baseCultureName: 'en',
          targetCultureName: 'tr',
          getOnlyEmptyValues: false,
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Network error');
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('fetchResources', () => {
    it('should fetch resources successfully', async () => {
      const mockResources: LanguageManagement.Resource[] = [
        { name: 'MyResource' },
        { name: 'AnotherResource' },
      ];

      mockRequest.mockResolvedValueOnce(mockResources);

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        await result.current.fetchResources();
      });

      expect(result.current.resources).toEqual(mockResources);
    });

    it('should handle fetch resources error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Fetch resources failed'));

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.fetchResources();
        expect(res.success).toBe(false);
        expect(res.error).toBe('Fetch resources failed');
      });
    });
  });

  describe('getLanguageTextByName', () => {
    it('should get a language text by name and set as selected', async () => {
      const mockText: LanguageManagement.LanguageText = {
        resourceName: 'MyResource',
        cultureName: 'tr',
        baseCultureName: 'en',
        baseValue: 'Hello',
        name: 'Hello',
        value: 'Merhaba',
      };

      mockRequest.mockResolvedValueOnce(mockText);

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.getLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
        });
        expect(res.success).toBe(true);
      });

      expect(result.current.selectedLanguageText).toEqual(mockText);
    });
  });

  describe('updateLanguageTextByName', () => {
    it('should update a language text successfully', async () => {
      const params: LanguageManagement.LanguageTextUpdateByNameParams = {
        resourceName: 'MyResource',
        cultureName: 'tr',
        name: 'Hello',
        value: 'Merhaba (Updated)',
      };

      // Mock update request
      mockRequest.mockResolvedValueOnce({
        ...params,
        baseCultureName: 'en',
        baseValue: 'Hello',
      });

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.updateLanguageTextByName(params);
        expect(res.success).toBe(true);
      });
    });

    it('should refresh list after update if params are stored', async () => {
      const fetchParams: LanguageManagement.LanguageTextQueryParams = {
        baseCultureName: 'en',
        targetCultureName: 'tr',
        getOnlyEmptyValues: false,
      };

      // Initial fetch
      mockRequest.mockResolvedValueOnce({
        items: [],
        totalCount: 0,
      });

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        await result.current.fetchLanguageTexts(fetchParams);
      });

      // Update - will trigger refetch
      mockRequest.mockResolvedValueOnce({
        resourceName: 'MyResource',
        cultureName: 'tr',
        baseCultureName: 'en',
        baseValue: 'Hello',
        name: 'Hello',
        value: 'Merhaba',
      });
      mockRequest.mockResolvedValueOnce({
        items: [],
        totalCount: 0,
      });

      await act(async () => {
        await result.current.updateLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
          value: 'Merhaba',
        });
      });

      // Request should have been called 3 times: initial fetch, update, refetch
      expect(mockRequest).toHaveBeenCalledTimes(3);
    });

    it('should handle update error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Update failed'));

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.updateLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
          value: 'Test',
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Update failed');
      });
    });
  });

  describe('restoreLanguageTextByName', () => {
    it('should restore a language text successfully', async () => {
      // Mock restore request
      mockRequest.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.restoreLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
        });
        expect(res.success).toBe(true);
      });
    });

    it('should handle restore error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Restore failed'));

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.restoreLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Restore failed');
      });
    });
  });

  describe('setSelectedLanguageText', () => {
    it('should set and clear selected language text', () => {
      const { result } = renderHook(() => useLanguageTexts());

      const mockText: LanguageManagement.LanguageText = {
        resourceName: 'MyResource',
        cultureName: 'tr',
        baseCultureName: 'en',
        baseValue: 'Hello',
        name: 'Hello',
        value: 'Merhaba',
      };

      act(() => {
        result.current.setSelectedLanguageText(mockText);
      });

      expect(result.current.selectedLanguageText).toEqual(mockText);

      act(() => {
        result.current.setSelectedLanguageText(null);
      });

      expect(result.current.selectedLanguageText).toBeNull();
    });
  });

  describe('sorting', () => {
    it('should set sort key and order', () => {
      const { result } = renderHook(() => useLanguageTexts());

      act(() => {
        result.current.setSortKey('value');
      });

      expect(result.current.sortKey).toBe('value');

      act(() => {
        result.current.setSortOrder('desc');
      });

      expect(result.current.sortOrder).toBe('desc');
    });
  });

  describe('reset', () => {
    it('should reset all state', async () => {
      mockRequest.mockResolvedValueOnce({
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
      });

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        await result.current.fetchLanguageTexts({
          baseCultureName: 'en',
          targetCultureName: 'tr',
          getOnlyEmptyValues: false,
        });
      });

      expect(result.current.languageTexts.length).toBe(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.languageTexts).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.resources).toEqual([]);
      expect(result.current.selectedLanguageText).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('getLanguageTextByName edge cases', () => {
    it('should handle get language text by name error', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Text not found'));

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.getLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'InvalidKey',
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Text not found');
      });

      expect(result.current.error).toBe('Text not found');
    });
  });

  describe('restoreLanguageTextByName with stored params', () => {
    it('should refresh list after restore if params are stored', async () => {
      const fetchParams: LanguageManagement.LanguageTextQueryParams = {
        baseCultureName: 'en',
        targetCultureName: 'tr',
        getOnlyEmptyValues: false,
      };

      // Initial fetch
      mockRequest.mockResolvedValueOnce({
        items: [],
        totalCount: 0,
      });

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        await result.current.fetchLanguageTexts(fetchParams);
      });

      // Restore - will trigger refetch
      mockRequest.mockResolvedValueOnce(undefined);
      mockRequest.mockResolvedValueOnce({
        items: [],
        totalCount: 0,
      });

      await act(async () => {
        await result.current.restoreLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
        });
      });

      // Request should have been called 3 times: initial fetch, restore, refetch
      expect(mockRequest).toHaveBeenCalledTimes(3);
    });
  });

  describe('error handling with non-Error objects', () => {
    it('should handle non-Error rejection in fetchLanguageTexts', async () => {
      mockRequest.mockRejectedValueOnce('String error');

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.fetchLanguageTexts({
          baseCultureName: 'en',
          targetCultureName: 'tr',
          getOnlyEmptyValues: false,
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to fetch language texts');
      });
    });

    it('should handle non-Error rejection in fetchResources', async () => {
      mockRequest.mockRejectedValueOnce({ message: 'Object error' });

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.fetchResources();
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to fetch resources');
      });
    });

    it('should handle non-Error rejection in getLanguageTextByName', async () => {
      mockRequest.mockRejectedValueOnce(null);

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.getLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to fetch language text');
      });
    });

    it('should handle non-Error rejection in updateLanguageTextByName', async () => {
      mockRequest.mockRejectedValueOnce(undefined);

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.updateLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
          value: 'Test',
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to update language text');
      });
    });

    it('should handle non-Error rejection in restoreLanguageTextByName', async () => {
      mockRequest.mockRejectedValueOnce(42);

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.restoreLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
        });
        expect(res.success).toBe(false);
        expect(res.error).toBe('Failed to restore language text');
      });
    });
  });

  describe('updateLanguageTextByName without stored params', () => {
    it('should not refresh list if no params stored', async () => {
      // Update without prior fetch
      mockRequest.mockResolvedValueOnce({
        resourceName: 'MyResource',
        cultureName: 'tr',
        baseCultureName: 'en',
        baseValue: 'Hello',
        name: 'Hello',
        value: 'Merhaba',
      });

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.updateLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
          value: 'Merhaba',
        });
        expect(res.success).toBe(true);
      });

      // Should only have called update, not refetch
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('restoreLanguageTextByName without stored params', () => {
    it('should not refresh list if no params stored', async () => {
      // Restore without prior fetch
      mockRequest.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useLanguageTexts());

      await act(async () => {
        const res = await result.current.restoreLanguageTextByName({
          resourceName: 'MyResource',
          cultureName: 'tr',
          name: 'Hello',
        });
        expect(res.success).toBe(true);
      });

      // Should only have called restore, not refetch
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });
});
