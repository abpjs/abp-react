import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { GetFeatureListResultDto } from '../models';

// Create mock functions matching FeaturesService API
const mockGet = vi.fn();
const mockUpdate = vi.fn();

// Mock the service - v4.0.0: FeaturesService replaces FeatureManagementService
vi.mock('../services', () => ({
  FeaturesService: vi.fn().mockImplementation(() => ({
    get: mockGet,
    update: mockUpdate,
  })),
}));

// Mock @abpjs/core
const mockRestService = {};
vi.mock('@abpjs/core', () => ({
  useRestService: () => mockRestService,
}));

// Import hook after mocks are set up
import { useFeatureManagement } from '../hooks/useFeatureManagement';

// Sample test data - v4.0.0: uses grouped response format (GetFeatureListResultDto)
const createMockGroupedResponse = (): GetFeatureListResultDto => ({
  groups: [
    {
      name: 'ChatGroup',
      displayName: 'Chat Features',
      features: [
        {
          name: 'Feature.EnableChat',
          displayName: 'Enable Chat',
          value: 'true',
          description: 'Enable chat functionality',
          valueType: {
            name: 'ToggleStringValueType',
            item: {},
            properties: {},
            validator: { name: '', item: {}, properties: {} },
          },
          provider: { name: 'T', key: 'TestTenant' },
          depth: 0,
          parentName: '',
        },
        {
          name: 'Feature.Disabled',
          displayName: 'Disabled Feature',
          value: 'false',
          description: 'A disabled feature',
          valueType: {
            name: 'ToggleStringValueType',
            item: {},
            properties: {},
            validator: { name: '', item: {}, properties: {} },
          },
          provider: { name: 'T', key: 'TestTenant' },
          depth: 0,
          parentName: '',
        },
      ],
    },
    {
      name: 'LimitsGroup',
      displayName: 'Limit Features',
      features: [
        {
          name: 'Feature.MaxUsers',
          displayName: 'Maximum Users',
          value: '100',
          description: 'Maximum number of users',
          valueType: {
            name: 'FreeTextStringValueType',
            item: {},
            properties: {},
            validator: { name: '', item: {}, properties: {} },
          },
          provider: { name: 'T', key: 'TestTenant' },
          depth: 0,
          parentName: '',
        },
      ],
    },
  ],
});

describe('useFeatureManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('v4.0.0 - grouped response format', () => {
    it('should flatten features from groups', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      // Features should be flattened from all groups
      expect(result.current.features).toHaveLength(3);
      expect(result.current.features[0].name).toBe('Feature.EnableChat');
      expect(result.current.features[1].name).toBe('Feature.Disabled');
      expect(result.current.features[2].name).toBe('Feature.MaxUsers');
    });

    it('should expose groups', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.groups).toHaveLength(2);
      expect(result.current.groups[0].name).toBe('ChatGroup');
      expect(result.current.groups[1].name).toBe('LimitsGroup');
    });

    it('should preserve displayName in features after fetch', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      const enableChatFeature = result.current.features.find(
        (f) => f.name === 'Feature.EnableChat'
      );
      expect(enableChatFeature?.displayName).toBe('Enable Chat');

      const maxUsersFeature = result.current.features.find((f) => f.name === 'Feature.MaxUsers');
      expect(maxUsersFeature?.displayName).toBe('Maximum Users');
    });

    it('should call FeaturesService.get with (providerName, providerKey)', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      // v4.0.0: FeaturesService.get(providerName, providerKey) — note order
      expect(mockGet).toHaveBeenCalledWith('T', 'TestTenant');
    });

    it('should call FeaturesService.update with (providerName, providerKey, input)', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());
      mockUpdate.mockResolvedValue(undefined);

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      act(() => {
        result.current.updateFeatureValue('Feature.MaxUsers', '200');
      });

      await act(async () => {
        await result.current.saveFeatures('TestTenant', 'T');
      });

      // v4.0.0: FeaturesService.update(providerName, providerKey, { features })
      expect(mockUpdate).toHaveBeenCalledWith('T', 'TestTenant', {
        features: expect.arrayContaining([
          expect.objectContaining({ name: 'Feature.MaxUsers', value: '200' }),
        ]),
      });
    });
  });

  describe('initial state', () => {
    it('should return initial state with empty values', () => {
      const { result } = renderHook(() => useFeatureManagement());

      expect(result.current.features).toEqual([]);
      expect(result.current.groups).toEqual([]);
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
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        const response = await result.current.fetchFeatures('TestTenant', 'T');
        expect(response.success).toBe(true);
      });

      expect(result.current.features).toHaveLength(3);
      expect(result.current.featureValues['Feature.EnableChat']).toBe('true');
      expect(result.current.featureValues['Feature.MaxUsers']).toBe('100');
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state while fetching', async () => {
      let resolvePromise: (value: GetFeatureListResultDto) => void;
      const pendingPromise = new Promise<GetFeatureListResultDto>((resolve) => {
        resolvePromise = resolve;
      });
      mockGet.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => useFeatureManagement());

      act(() => {
        result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!(createMockGroupedResponse());
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle fetch error', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

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
      mockGet.mockRejectedValue('String error');

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
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.getFeatureValue('Feature.EnableChat')).toBe('true');
      expect(result.current.getFeatureValue('Feature.MaxUsers')).toBe('100');
    });

    it('should return empty string for non-existent feature', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.getFeatureValue('NonExistent.Feature')).toBe('');
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return true for feature with value "true"', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isFeatureEnabled('Feature.EnableChat')).toBe(true);
    });

    it('should return false for feature with value "false"', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isFeatureEnabled('Feature.Disabled')).toBe(false);
    });

    it('should return false for non-toggle feature', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isFeatureEnabled('Feature.MaxUsers')).toBe(false);
    });

    it('should handle "True" case variation', async () => {
      const response: GetFeatureListResultDto = {
        groups: [{
          name: 'TestGroup',
          displayName: 'Test',
          features: [{
            name: 'Feature.CaseSensitive',
            displayName: 'Case Sensitive Feature',
            value: 'True',
            description: '',
            valueType: { name: 'ToggleStringValueType', item: {}, properties: {}, validator: { name: '', item: {}, properties: {} } },
            provider: { name: 'T', key: 'TestTenant' },
            depth: 0,
            parentName: '',
          }],
        }],
      };
      mockGet.mockResolvedValue(response);

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.isFeatureEnabled('Feature.CaseSensitive')).toBe(true);
    });
  });

  describe('updateFeatureValue', () => {
    it('should update feature value in form state', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

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
      mockGet.mockResolvedValue(createMockGroupedResponse());

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
      mockGet.mockResolvedValue(createMockGroupedResponse());
      mockUpdate.mockResolvedValue(undefined);

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      act(() => {
        result.current.updateFeatureValue('Feature.MaxUsers', '200');
      });

      await act(async () => {
        const response = await result.current.saveFeatures('TestTenant', 'T');
        expect(response.success).toBe(true);
      });

      expect(mockUpdate).toHaveBeenCalled();
    });

    it('should return success without calling API if nothing changed', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      await act(async () => {
        const response = await result.current.saveFeatures('TestTenant', 'T');
        expect(response.success).toBe(true);
      });

      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should handle save error', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());
      mockUpdate.mockRejectedValue(new Error('Update failed'));

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
        expect(response.error).toBe('Update failed');
      });

      expect(result.current.error).toBe('Update failed');
    });

    it('should handle non-Error rejection in save', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());
      mockUpdate.mockRejectedValue('String error');

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

    it('should use original feature value when featureValues entry is undefined', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());
      mockUpdate.mockResolvedValue(undefined);

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      act(() => {
        result.current.updateFeatureValue('Feature.EnableChat', 'false');
      });

      await act(async () => {
        const response = await result.current.saveFeatures('TestTenant', 'T');
        expect(response.success).toBe(true);
      });

      expect(mockUpdate).toHaveBeenCalled();
      const updateCall = mockUpdate.mock.calls[0];
      // v4.0.0: FeaturesService.update(providerName, providerKey, { features })
      const updateInput = updateCall[2]; // Third argument is UpdateFeaturesDto
      const updatedFeatures = updateInput.features;

      expect(updatedFeatures.every((f: { value: string }) => f.value !== undefined)).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      mockGet.mockResolvedValue(createMockGroupedResponse());

      const { result } = renderHook(() => useFeatureManagement());

      await act(async () => {
        await result.current.fetchFeatures('TestTenant', 'T');
      });

      expect(result.current.features.length).toBeGreaterThan(0);
      expect(result.current.groups.length).toBeGreaterThan(0);

      act(() => {
        result.current.reset();
      });

      expect(result.current.features).toEqual([]);
      expect(result.current.groups).toEqual([]);
      expect(result.current.featureValues).toEqual({});
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
