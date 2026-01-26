import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeatureManagementService } from '../services/feature-management.service';
import type { RestService } from '@abpjs/core';
import type { FeatureManagement } from '../models';

describe('FeatureManagementService', () => {
  let service: FeatureManagementService;
  let mockRestService: RestService;

  const mockFeaturesResponse: FeatureManagement.Features = {
    features: [
      {
        name: 'Feature.TestFeature1',
        value: 'true',
        description: 'Test feature 1',
        valueType: {
          name: 'ToggleStringValueType',
          properties: {},
          validator: {},
        },
        depth: 0,
        parentName: '',
      },
      {
        name: 'Feature.TestFeature2',
        value: 'SomeValue',
        description: 'Test feature 2',
        valueType: {
          name: 'FreeTextStringValueType',
          properties: {},
          validator: {},
        },
        depth: 0,
        parentName: '',
      },
    ],
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    } as unknown as RestService;

    service = new FeatureManagementService(mockRestService);
  });

  describe('getFeatures', () => {
    it('should call rest service with correct parameters', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockFeaturesResponse);

      const params: FeatureManagement.Provider = {
        providerKey: 'TestTenant',
        providerName: 'T',
      };

      await service.getFeatures(params);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/abp/features',
        params,
      });
    });

    it('should return features response', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockFeaturesResponse);

      const params: FeatureManagement.Provider = {
        providerKey: 'TestTenant',
        providerName: 'T',
      };

      const result = await service.getFeatures(params);

      expect(result).toEqual(mockFeaturesResponse);
      expect(result.features).toHaveLength(2);
    });

    it('should propagate errors from rest service', async () => {
      const error = new Error('Network error');
      (mockRestService.request as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      const params: FeatureManagement.Provider = {
        providerKey: 'TestTenant',
        providerName: 'T',
      };

      await expect(service.getFeatures(params)).rejects.toThrow('Network error');
    });
  });

  describe('updateFeatures', () => {
    it('should call rest service with correct parameters', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      const request: FeatureManagement.Provider & FeatureManagement.Features = {
        providerKey: 'TestTenant',
        providerName: 'T',
        features: [
          { name: 'Feature.TestFeature1', value: 'false' } as FeatureManagement.Feature,
        ],
      };

      await service.updateFeatures(request);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/abp/features',
        body: { features: request.features },
        params: { providerKey: 'TestTenant', providerName: 'T' },
      });
    });

    it('should send features in body and provider info in params', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      const features = [
        { name: 'Feature.A', value: 'true' } as FeatureManagement.Feature,
        { name: 'Feature.B', value: 'customValue' } as FeatureManagement.Feature,
      ];

      await service.updateFeatures({
        providerKey: 'MyKey',
        providerName: 'E',
        features,
      });

      const callArgs = (mockRestService.request as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callArgs.body.features).toEqual(features);
      expect(callArgs.params.providerKey).toBe('MyKey');
      expect(callArgs.params.providerName).toBe('E');
    });

    it('should propagate errors from rest service', async () => {
      const error = new Error('Update failed');
      (mockRestService.request as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      await expect(
        service.updateFeatures({
          providerKey: 'TestTenant',
          providerName: 'T',
          features: [],
        })
      ).rejects.toThrow('Update failed');
    });
  });
});
