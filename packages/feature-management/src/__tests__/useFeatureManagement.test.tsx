import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { FeatureManagement } from '../models';

// Create mock functions
const mockGetFeatures = vi.fn();
const mockUpdateFeatures = vi.fn();

// Mock the service
vi.mock('../services', () => ({
  FeatureManagementService: vi.fn().mockImplementation(() => ({
    getFeatures: mockGetFeatures,
    updateFeatures: mockUpdateFeatures,
  })),
}));

// Mock @abpjs/core
const mockRestService = {};
vi.mock('@abpjs/core', () => ({
  useRestService: () => mockRestService,
}));

// Import hook after mocks are set up
import { useFeatureManagement } from '../hooks/useFeatureManagement';

// Sample test data
const createMockFeaturesResponse = (): FeatureManagement.Features => ({
  features: [
    {
      name: 'Feature.EnableChat',
      value: 'true',
      description: 'Enable chat functionality',
      valueType: {
        name: 'ToggleStringValueType',
        properties: {},
        validator: {},
      },
      depth: 0,
      parentName: '',
    },
    {
      name: 'Feature.MaxUsers',
      value: '100',
      description: 'Maximum number of users',
      valueType: {
        name: 'FreeTextStringValueType',
        properties: {},
        validator: {},
      },
      depth: 0,
      parentName: '',
    },
    {
      name: 'Feature.Disabled',
      value: 'false',
      description: 'A disabled feature',
      valueType: {
        name: 'ToggleStringValueType',
        properties: {},
        validator: {},
      },
      depth: 0,
      parentName: '',
    },
  ],
});

describe('useFeatureManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state with empty values', () => {
      const { result } = renderHook(() => useFeatureManagement());

      expect(result.current.features).toEqual([]);
      expect(result.current.featureValues).toEqual({});
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should provide all expected methods', () => {
      const { result } = renderHook(() => useFeatureManagement());

      expect(typeof result.current.fetchFeatures).toBe('function');
      expect(typeof result.current.saveFeatures).toBe('function');
      expect(typeof result.current.updateFeatureValue).toBe('function');
      expect(typeof result.current.getFeatureValue).toBe('function');
      expect(typeof result.current.isFeatureEnabled).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('fetchFeatures', () => {
    it('should fetch features and set state', async () => {
      const mockResponse = createMockFeaturesResponse();
      mockGetFeatures.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        const response = await result.current.fetchFeatures('TestTenant', 'T');
        expect(response.success).toBe(true);
      });

      expect(result.current.features).toEqual(mockResponse.features);
      expect(result.current.featureValues['Feature.EnableChat']).toBe('true');
      expect(result.current.featureValues['Feature.MaxUsers']).toBe('100');
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state while fetching', async () => {
      let resolvePromise: (value: FeatureManagement.Features) => void;
      const pendingPromise = new Promise<FeatureManagement.Features>((resolve) => {
        resolvePromise = resolve;
      });
      mockGetFeatures.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => useFeatureManagement());

      act(() => {
        result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!(createMockFeaturesResponse());
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle fetch error', async () => {
      mockGetFeatures.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        const response = await result.current.fetchFeatures('TestTenant', 'T');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Network error');
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle non-Error rejection', async () => {
      mockGetFeatures.mockRejectedValue('String error');

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        const response = await result.current.fetchFeatures('TestTenant', 'T');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to fetch features');
      });
    });
  });

  describe('getFeatureValue', () => {
    it('should return feature value from form state', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.getFeatureValue('Feature.EnableChat')).toBe('true');
      expect(result.current.getFeatureValue('Feature.MaxUsers')).toBe('100');
    });

    it('should return empty string for non-existent feature', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.getFeatureValue('NonExistent.Feature')).toBe('');
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return true for feature with value "true"', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isFeatureEnabled('Feature.EnableChat')).toBe(true);
    });

    it('should return false for feature with value "false"', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isFeatureEnabled('Feature.Disabled')).toBe(false);
    });

    it('should return false for non-toggle feature', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      // Feature.MaxUsers has value "100" which is not "true" or "True"
      expect(result.current.isFeatureEnabled('Feature.MaxUsers')).toBe(false);
    });

    it('should handle "True" case variation', async () => {
      const response: FeatureManagement.Features = {
        features: [
          {
            name: 'Feature.CaseSensitive',
            value: 'True',
            valueType: { name: 'ToggleStringValueType', properties: {}, validator: {} },
          },
        ],
      };
      mockGetFeatures.mockResolvedValue(response);

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isFeatureEnabled('Feature.CaseSensitive')).toBe(true);
    });
  });

  describe('updateFeatureValue', () => {
    it('should update feature value in form state', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      act(() => {
        result.current.updateFeatureValue('Feature.MaxUsers', '200');
      });

      expect(result.current.featureValues['Feature.MaxUsers']).toBe('200');
      expect(result.current.getFeatureValue('Feature.MaxUsers')).toBe('200');
    });

    it('should update toggle feature value', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isFeatureEnabled('Feature.EnableChat')).toBe(true);

      act(() => {
        result.current.updateFeatureValue('Feature.EnableChat', 'false');
      });

      expect(result.current.isFeatureEnabled('Feature.EnableChat')).toBe(false);
    });
  });

  describe('saveFeatures', () => {
    it('should save changed features', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());
      mockUpdateFeatures.mockResolvedValue(undefined);

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      // Change a feature value
      act(() => {
        result.current.updateFeatureValue('Feature.MaxUsers', '200');
      });

      await act(async () => {
        const response = await result.current.saveFeatures('TestTenant', 'T');
        expect(response.success).toBe(true);
      });

      expect(mockUpdateFeatures).toHaveBeenCalled();
    });

    it('should return success without calling API if nothing changed', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      // Don't change anything
      await act(async () => {
        const response = await result.current.saveFeatures('TestTenant', 'T');
        expect(response.success).toBe(true);
      });

      expect(mockUpdateFeatures).not.toHaveBeenCalled();
    });

    it('should handle save error', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());
      mockUpdateFeatures.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      // Change a feature value
      act(() => {
        result.current.updateFeatureValue('Feature.MaxUsers', '200');
      });

      await act(async () => {
        const response = await result.current.saveFeatures('TestTenant', 'T');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Update failed');
      });

      expect(result.current.error).toBe('Update failed');
    });

    it('should handle non-Error rejection in save', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());
      mockUpdateFeatures.mockRejectedValue('String error');

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      act(() => {
        result.current.updateFeatureValue('Feature.MaxUsers', '200');
      });

      await act(async () => {
        const response = await result.current.saveFeatures('TestTenant', 'T');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to update features');
      });
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      mockGetFeatures.mockResolvedValue(createMockFeaturesResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.features.length).toBeGreaterThan(0);

      act(() => {
        result.current.reset();
      });

      expect(result.current.features).toEqual([]);
      expect(result.current.featureValues).toEqual({});
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
