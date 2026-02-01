import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditions } from '../../hooks/useEditions';

// Mock SaasService
const mockGetEditions = vi.fn();
const mockGetEditionById = vi.fn();
const mockCreateEdition = vi.fn();
const mockUpdateEdition = vi.fn();
const mockDeleteEdition = vi.fn();
const mockGetUsageStatistics = vi.fn();

vi.mock('../../services', () => ({
  SaasService: vi.fn().mockImplementation(() => ({
    getEditions: mockGetEditions,
    getEditionById: mockGetEditionById,
    createEdition: mockCreateEdition,
    updateEdition: mockUpdateEdition,
    deleteEdition: mockDeleteEdition,
    getUsageStatistics: mockGetUsageStatistics,
  })),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({})),
}));

describe('useEditions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetEditions.mockReset();
    mockGetEditionById.mockReset();
    mockCreateEdition.mockReset();
    mockUpdateEdition.mockReset();
    mockDeleteEdition.mockReset();
    mockGetUsageStatistics.mockReset();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useEditions());

    expect(result.current.editions).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.selectedEdition).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.sortKey).toBe('displayName');
    expect(result.current.sortOrder).toBe('');
    expect(result.current.usageStatistics).toEqual({});
    // v2.2.0 features modal state
    expect(result.current.visibleFeatures).toBe(false);
    expect(result.current.featuresProviderKey).toBe('');
  });

  describe('fetchEditions', () => {
    it('should fetch editions successfully', async () => {
      const mockEditionsData = {
        items: [
          { id: 'ed-1', displayName: 'Basic Edition', concurrencyStamp: 'stamp1' },
          { id: 'ed-2', displayName: 'Pro Edition', concurrencyStamp: 'stamp2' },
        ],
        totalCount: 2,
      };
      mockGetEditions.mockResolvedValue(mockEditionsData);

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.fetchEditions();
        expect(response.success).toBe(true);
      });

      expect(result.current.editions).toEqual(mockEditionsData.items);
      expect(result.current.totalCount).toBe(2);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle fetch editions error', async () => {
      mockGetEditions.mockRejectedValue(new Error('Failed to fetch editions'));

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.fetchEditions();
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to fetch editions');
      });

      expect(result.current.error).toBe('Failed to fetch editions');
      expect(result.current.isLoading).toBe(false);
    });

    it('should pass query parameters', async () => {
      mockGetEditions.mockResolvedValue({ items: [], totalCount: 0 });

      const { result } = renderHook(() => useEditions());
      const params = { skipCount: 0, maxResultCount: 10, filter: 'pro' };

      await act(async () => {
        await result.current.fetchEditions(params);
      });

      expect(mockGetEditions).toHaveBeenCalledWith(params);
    });
  });

  describe('getEditionById', () => {
    it('should get edition by ID', async () => {
      const mockEdition = { id: 'ed-1', displayName: 'Basic Edition', concurrencyStamp: 'stamp1' };
      mockGetEditionById.mockResolvedValue(mockEdition);

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.getEditionById('ed-1');
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockEdition);
      });

      expect(result.current.selectedEdition).toEqual(mockEdition);
    });

    it('should handle get edition by ID error', async () => {
      mockGetEditionById.mockRejectedValue(new Error('Edition not found'));

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.getEditionById('invalid-id');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Edition not found');
      });

      expect(result.current.error).toBe('Edition not found');
    });
  });

  describe('createEdition', () => {
    it('should create edition successfully', async () => {
      const newEdition = { displayName: 'Enterprise Edition' };
      const createdEdition = { id: 'new-ed-id', displayName: 'Enterprise Edition', concurrencyStamp: 'stamp' };
      mockCreateEdition.mockResolvedValue(createdEdition);

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.createEdition(newEdition);
        expect(response.success).toBe(true);
        expect(response.data).toEqual(createdEdition);
      });

      expect(mockCreateEdition).toHaveBeenCalledWith(newEdition);
    });

    it('should handle create edition error', async () => {
      mockCreateEdition.mockRejectedValue(new Error('Creation failed'));

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.createEdition({ displayName: 'Test' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Creation failed');
      });

      expect(result.current.error).toBe('Creation failed');
    });
  });

  describe('updateEdition', () => {
    it('should update edition successfully', async () => {
      const updatedEdition = { id: 'ed-1', displayName: 'Updated Basic Edition', concurrencyStamp: 'stamp1' };
      const responseData = { ...updatedEdition, concurrencyStamp: 'new-stamp' };
      mockUpdateEdition.mockResolvedValue(responseData);

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.updateEdition(updatedEdition);
        expect(response.success).toBe(true);
        expect(response.data).toEqual(responseData);
      });

      expect(mockUpdateEdition).toHaveBeenCalledWith(updatedEdition);
    });

    it('should handle update edition error', async () => {
      mockUpdateEdition.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.updateEdition({ id: 'ed-1', displayName: 'Test', concurrencyStamp: 'stamp' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Update failed');
      });

      expect(result.current.error).toBe('Update failed');
    });
  });

  describe('deleteEdition', () => {
    it('should delete edition successfully', async () => {
      mockDeleteEdition.mockResolvedValue(undefined);

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.deleteEdition('ed-1');
        expect(response.success).toBe(true);
      });

      expect(mockDeleteEdition).toHaveBeenCalledWith('ed-1');
    });

    it('should handle delete edition error', async () => {
      mockDeleteEdition.mockRejectedValue(new Error('Delete failed'));

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.deleteEdition('ed-1');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Delete failed');
      });

      expect(result.current.error).toBe('Delete failed');
    });
  });

  describe('fetchUsageStatistics', () => {
    it('should fetch usage statistics successfully', async () => {
      const mockStatsData = [
        { label: 'Basic', value: 10 },
        { label: 'Pro', value: 5 },
        { label: 'Enterprise', value: 2 },
      ];
      const mockStatsResponse = { data: mockStatsData };
      mockGetUsageStatistics.mockResolvedValue(mockStatsResponse);

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.fetchUsageStatistics();
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockStatsData);
      });

      expect(result.current.usageStatistics).toEqual(mockStatsData);
    });

    it('should handle fetch usage statistics error', async () => {
      mockGetUsageStatistics.mockRejectedValue(new Error('Statistics fetch failed'));

      const { result } = renderHook(() => useEditions());

      await act(async () => {
        const response = await result.current.fetchUsageStatistics();
        expect(response.success).toBe(false);
        expect(response.error).toBe('Statistics fetch failed');
      });

      expect(result.current.error).toBe('Statistics fetch failed');
    });
  });

  describe('State Management', () => {
    it('should set selected edition', () => {
      const { result } = renderHook(() => useEditions());
      const edition = { id: 'ed-1', displayName: 'Basic Edition', concurrencyStamp: 'stamp1' };

      act(() => {
        result.current.setSelectedEdition(edition);
      });

      expect(result.current.selectedEdition).toEqual(edition);
    });

    it('should clear selected edition', () => {
      const { result } = renderHook(() => useEditions());
      const edition = { id: 'ed-1', displayName: 'Basic Edition', concurrencyStamp: 'stamp1' };

      act(() => {
        result.current.setSelectedEdition(edition);
      });
      expect(result.current.selectedEdition).toEqual(edition);

      act(() => {
        result.current.setSelectedEdition(null);
      });
      expect(result.current.selectedEdition).toBeNull();
    });

    it('should set sort key', () => {
      const { result } = renderHook(() => useEditions());

      act(() => {
        result.current.setSortKey('id');
      });

      expect(result.current.sortKey).toBe('id');
    });

    it('should set sort order', () => {
      const { result } = renderHook(() => useEditions());

      act(() => {
        result.current.setSortOrder('desc');
      });

      expect(result.current.sortOrder).toBe('desc');
    });

    it('should reset state', async () => {
      mockGetEditions.mockResolvedValue({
        items: [{ id: 'ed-1', displayName: 'Basic Edition', concurrencyStamp: 'stamp1' }],
        totalCount: 1,
      });

      const { result } = renderHook(() => useEditions());

      // First fetch some data
      await act(async () => {
        await result.current.fetchEditions();
      });

      expect(result.current.editions.length).toBe(1);

      // Change some state
      act(() => {
        result.current.setSortKey('id');
        result.current.setSortOrder('desc');
      });

      // Open features modal
      act(() => {
        result.current.openFeaturesModal('E:ed-1');
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('E:ed-1');

      // Then reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.editions).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.selectedEdition).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.sortKey).toBe('displayName');
      expect(result.current.sortOrder).toBe('');
      expect(result.current.usageStatistics).toEqual({});
      // v2.2.0 features modal state
      expect(result.current.visibleFeatures).toBe(false);
      expect(result.current.featuresProviderKey).toBe('');
    });
  });

  describe('v2.2.0 - Features Modal', () => {
    it('should open features modal with provider key', () => {
      const { result } = renderHook(() => useEditions());

      act(() => {
        result.current.openFeaturesModal('E:ed-1');
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('E:ed-1');
    });

    it('should close features modal and clear provider key', () => {
      const { result } = renderHook(() => useEditions());

      // Open modal first
      act(() => {
        result.current.openFeaturesModal('E:ed-1');
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('E:ed-1');

      // Close modal
      act(() => {
        result.current.onVisibleFeaturesChange(false);
      });

      expect(result.current.visibleFeatures).toBe(false);
      expect(result.current.featuresProviderKey).toBe('');
    });

    it('should set visibleFeatures to true without clearing provider key', () => {
      const { result } = renderHook(() => useEditions());

      // Open modal first
      act(() => {
        result.current.openFeaturesModal('E:ed-1');
      });

      // Call with true (should not clear provider key)
      act(() => {
        result.current.onVisibleFeaturesChange(true);
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('E:ed-1');
    });

    it('should handle multiple modal open/close cycles', () => {
      const { result } = renderHook(() => useEditions());

      // First cycle
      act(() => {
        result.current.openFeaturesModal('E:ed-1');
      });
      expect(result.current.featuresProviderKey).toBe('E:ed-1');

      act(() => {
        result.current.onVisibleFeaturesChange(false);
      });
      expect(result.current.featuresProviderKey).toBe('');

      // Second cycle with different key
      act(() => {
        result.current.openFeaturesModal('E:ed-2');
      });
      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('E:ed-2');

      act(() => {
        result.current.onVisibleFeaturesChange(false);
      });
      expect(result.current.visibleFeatures).toBe(false);
      expect(result.current.featuresProviderKey).toBe('');
    });

    it('should allow changing provider key while modal is open', () => {
      const { result } = renderHook(() => useEditions());

      act(() => {
        result.current.openFeaturesModal('E:ed-1');
      });

      expect(result.current.featuresProviderKey).toBe('E:ed-1');

      // Open with different key (simulating switching editions)
      act(() => {
        result.current.openFeaturesModal('E:ed-2');
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('E:ed-2');
    });
  });
});
