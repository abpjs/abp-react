import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeaturesService } from '../services/features.service';
import type { RestService } from '@abpjs/core';
import type { GetFeatureListResultDto, UpdateFeaturesDto } from '../models';

/**
 * Tests for FeaturesService (v3.2.0)
 * This is the new proxy service for feature management API calls.
 */
describe('FeaturesService (v3.2.0)', () => {
  let service: FeaturesService;
  let mockRestService: RestService;

  const mockFeatureListResponse: GetFeatureListResultDto = {
    groups: [
      {
        name: 'TestGroup',
        displayName: 'Test Group',
        features: [
          {
            name: 'Feature.TestFeature1',
            displayName: 'Test Feature 1',
            value: 'true',
            provider: { name: 'T', key: 'tenant-123' },
            description: 'A test toggle feature',
            valueType: {
              name: 'ToggleStringValueType',
              item: {},
              properties: {},
              validator: { name: '', item: {}, properties: {} },
            },
            depth: 0,
            parentName: '',
          },
          {
            name: 'Feature.TestFeature2',
            displayName: 'Test Feature 2',
            value: '100',
            provider: { name: 'T', key: 'tenant-123' },
            description: 'A numeric feature',
            valueType: {
              name: 'FreeTextStringValueType',
              item: {},
              properties: {},
              validator: { name: 'NumericValidator', item: {}, properties: {} },
            },
            depth: 0,
            parentName: '',
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    } as unknown as RestService;

    service = new FeaturesService(mockRestService);
  });

  describe('constructor', () => {
    it('should initialize with restService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('apiName property', () => {
    it('should have apiName property with default value "default"', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow apiName to be modified', () => {
      service.apiName = 'customApi';
      expect(service.apiName).toBe('customApi');
    });

    it('should have apiName as a string type', () => {
      expect(typeof service.apiName).toBe('string');
    });
  });

  describe('get method', () => {
    it('should call rest service with correct GET parameters', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockFeatureListResponse);

      await service.get('T', 'tenant-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/feature-management/features',
        params: { providerName: 'T', providerKey: 'tenant-123' },
      });
    });

    it('should return GetFeatureListResultDto', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(mockFeatureListResponse);

      const result = await service.get('T', 'tenant-123');

      expect(result).toEqual(mockFeatureListResponse);
      expect(result.groups).toHaveLength(1);
      expect(result.groups[0].features).toHaveLength(2);
    });

    it('should work with different provider types', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue({ groups: [] });

      await service.get('E', 'edition-456');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/feature-management/features',
        params: { providerName: 'E', providerKey: 'edition-456' },
      });
    });

    it('should handle empty providerKey', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue({ groups: [] });

      await service.get('T', '');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/feature-management/features',
        params: { providerName: 'T', providerKey: '' },
      });
    });

    it('should propagate errors from rest service', async () => {
      const error = new Error('Network error');
      (mockRestService.request as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      await expect(service.get('T', 'tenant-123')).rejects.toThrow('Network error');
    });
  });

  describe('update method', () => {
    it('should call rest service with correct PUT parameters', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      const input: UpdateFeaturesDto = {
        features: [
          { name: 'Feature.TestFeature1', value: 'false' },
        ],
      };

      await service.update('T', 'tenant-123', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/feature-management/features',
        body: input,
        params: { providerName: 'T', providerKey: 'tenant-123' },
      });
    });

    it('should handle multiple feature updates', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      const input: UpdateFeaturesDto = {
        features: [
          { name: 'Feature.A', value: 'true' },
          { name: 'Feature.B', value: 'custom-value' },
          { name: 'Feature.C', value: '100' },
        ],
      };

      await service.update('E', 'edition-456', input);

      const callArgs = (mockRestService.request as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callArgs.body.features).toHaveLength(3);
      expect(callArgs.params.providerName).toBe('E');
      expect(callArgs.params.providerKey).toBe('edition-456');
    });

    it('should handle empty features array', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      const input: UpdateFeaturesDto = { features: [] };

      await service.update('T', 'tenant-123', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/feature-management/features',
        body: { features: [] },
        params: { providerName: 'T', providerKey: 'tenant-123' },
      });
    });

    it('should propagate errors from rest service', async () => {
      const error = new Error('Update failed');
      (mockRestService.request as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      const input: UpdateFeaturesDto = {
        features: [{ name: 'Feature.A', value: 'true' }],
      };

      await expect(service.update('T', 'tenant-123', input)).rejects.toThrow('Update failed');
    });

    it('should return void on success', async () => {
      (mockRestService.request as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      const input: UpdateFeaturesDto = {
        features: [{ name: 'Feature.A', value: 'true' }],
      };

      const result = await service.update('T', 'tenant-123', input);

      expect(result).toBeUndefined();
    });
  });
});
