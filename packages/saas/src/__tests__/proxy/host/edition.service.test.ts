/**
 * Tests for EditionService (proxy)
 * @since 3.2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditionService } from '../../../proxy/host/edition.service';
import type { EditionDto, EditionCreateDto, EditionUpdateDto, GetEditionsInput } from '../../../proxy/host/dtos/models';
import type { GetEditionUsageStatisticsResult } from '../../../proxy/host/models';
import type { PagedResultDto } from '@abpjs/core';

describe('EditionService', () => {
  let service: EditionService;
  let mockRestService: {
    request: ReturnType<typeof vi.fn>;
  };

  // Sample test data
  const mockEdition: EditionDto = {
    id: 'edition-1',
    displayName: 'Basic Edition',
    concurrencyStamp: 'stamp-123',
    creationTime: '2024-01-15T10:00:00Z',
    creatorId: 'user-1',
    extraProperties: { customProp: 'value' },
  };

  const mockEditionsResponse: PagedResultDto<EditionDto> = {
    items: [mockEdition],
    totalCount: 1,
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new EditionService(mockRestService as any);
  });

  describe('Constructor and Properties', () => {
    it('should create an instance', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(EditionService);
    });

    it('should have default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow changing apiName', () => {
      service.apiName = 'custom-api';
      expect(service.apiName).toBe('custom-api');
    });
  });

  describe('create', () => {
    it('should create an edition with required fields', async () => {
      const input: EditionCreateDto = {
        displayName: 'New Edition',
      };
      mockRestService.request.mockResolvedValue({ ...mockEdition, displayName: 'New Edition' });

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/saas/editions',
        body: input,
      });
      expect(result.displayName).toBe('New Edition');
    });

    it('should create an edition with extra properties', async () => {
      const input: EditionCreateDto = {
        displayName: 'Premium Edition',
        extraProperties: { maxUsers: 100, features: ['feature1', 'feature2'] },
      };
      const createdEdition = { ...mockEdition, ...input };
      mockRestService.request.mockResolvedValue(createdEdition);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/saas/editions',
        body: input,
      });
      expect(result.extraProperties).toEqual(input.extraProperties);
    });

    it('should propagate errors from REST service', async () => {
      const input: EditionCreateDto = { displayName: '' };
      mockRestService.request.mockRejectedValue(new Error('Validation failed'));

      await expect(service.create(input)).rejects.toThrow('Validation failed');
    });
  });

  describe('delete', () => {
    it('should delete an edition by ID', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.delete('edition-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/saas/editions/edition-1',
      });
    });

    it('should handle deletion of non-existent edition', async () => {
      mockRestService.request.mockRejectedValue(new Error('Edition not found'));

      await expect(service.delete('non-existent')).rejects.toThrow('Edition not found');
    });

    it('should handle deletion when edition has active tenants', async () => {
      mockRestService.request.mockRejectedValue(new Error('Cannot delete edition with active tenants'));

      await expect(service.delete('edition-1')).rejects.toThrow('Cannot delete edition with active tenants');
    });
  });

  describe('get', () => {
    it('should get an edition by ID', async () => {
      mockRestService.request.mockResolvedValue(mockEdition);

      const result = await service.get('edition-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/editions/edition-1',
      });
      expect(result).toEqual(mockEdition);
    });

    it('should return full edition data with all fields', async () => {
      const fullEdition: EditionDto = {
        id: 'edition-full',
        displayName: 'Full Edition',
        concurrencyStamp: 'stamp-abc',
        creationTime: new Date('2024-01-01'),
        creatorId: 'admin-user',
        extraProperties: { tier: 'enterprise' },
      };
      mockRestService.request.mockResolvedValue(fullEdition);

      const result = await service.get('edition-full');

      expect(result.id).toBe('edition-full');
      expect(result.displayName).toBe('Full Edition');
      expect(result.concurrencyStamp).toBe('stamp-abc');
      expect(result.creatorId).toBe('admin-user');
    });

    it('should handle edition not found', async () => {
      mockRestService.request.mockRejectedValue(new Error('Edition not found'));

      await expect(service.get('invalid-id')).rejects.toThrow('Edition not found');
    });
  });

  describe('getList', () => {
    it('should get editions list with default params', async () => {
      mockRestService.request.mockResolvedValue(mockEditionsResponse);

      const result = await service.getList();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/editions',
        params: {},
      });
      expect(result).toEqual(mockEditionsResponse);
    });

    it('should get editions list with filter', async () => {
      const input: GetEditionsInput = { filter: 'Premium' };
      mockRestService.request.mockResolvedValue(mockEditionsResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/editions',
        params: { filter: 'Premium' },
      });
    });

    it('should get editions list with pagination', async () => {
      const input: GetEditionsInput = {
        skipCount: 10,
        maxResultCount: 20,
      };
      mockRestService.request.mockResolvedValue(mockEditionsResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/editions',
        params: { skipCount: 10, maxResultCount: 20 },
      });
    });

    it('should get editions list with sorting', async () => {
      const input: GetEditionsInput = { sorting: 'displayName desc' };
      mockRestService.request.mockResolvedValue(mockEditionsResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/editions',
        params: { sorting: 'displayName desc' },
      });
    });

    it('should get editions list with all params', async () => {
      const input: GetEditionsInput = {
        filter: 'Enterprise',
        skipCount: 0,
        maxResultCount: 50,
        sorting: 'creationTime asc',
      };
      mockRestService.request.mockResolvedValue(mockEditionsResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/editions',
        params: input,
      });
    });

    it('should handle empty results', async () => {
      mockRestService.request.mockResolvedValue({ items: [], totalCount: 0 });

      const result = await service.getList();

      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should handle large result sets', async () => {
      const manyEditions = Array.from({ length: 100 }, (_, i) => ({
        ...mockEdition,
        id: `edition-${i}`,
        displayName: `Edition ${i}`,
      }));
      mockRestService.request.mockResolvedValue({
        items: manyEditions,
        totalCount: 500,
      });

      const result = await service.getList({ maxResultCount: 100 });

      expect(result.items).toHaveLength(100);
      expect(result.totalCount).toBe(500);
    });
  });

  describe('getUsageStatistics', () => {
    it('should get usage statistics', async () => {
      const stats: GetEditionUsageStatisticsResult = {
        data: {
          'Basic': 15,
          'Premium': 25,
          'Enterprise': 5,
        },
      };
      mockRestService.request.mockResolvedValue(stats);

      const result = await service.getUsageStatistics();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/editions/statistics/usage-statistic',
      });
      expect(result).toEqual(stats);
      expect(result.data['Basic']).toBe(15);
      expect(result.data['Premium']).toBe(25);
    });

    it('should handle empty usage statistics', async () => {
      const stats: GetEditionUsageStatisticsResult = { data: {} };
      mockRestService.request.mockResolvedValue(stats);

      const result = await service.getUsageStatistics();

      expect(result.data).toEqual({});
    });

    it('should propagate errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Statistics unavailable'));

      await expect(service.getUsageStatistics()).rejects.toThrow('Statistics unavailable');
    });
  });

  describe('update', () => {
    it('should update an edition', async () => {
      const input: EditionUpdateDto = {
        displayName: 'Updated Edition',
      };
      const updatedEdition = { ...mockEdition, displayName: 'Updated Edition' };
      mockRestService.request.mockResolvedValue(updatedEdition);

      const result = await service.update('edition-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/saas/editions/edition-1',
        body: input,
      });
      expect(result.displayName).toBe('Updated Edition');
    });

    it('should update an edition with extra properties', async () => {
      const input: EditionUpdateDto = {
        displayName: 'Premium+',
        extraProperties: { maxUsers: 200, newFeature: true },
      };
      const updatedEdition = { ...mockEdition, ...input };
      mockRestService.request.mockResolvedValue(updatedEdition);

      const result = await service.update('edition-1', input);

      expect(result.displayName).toBe('Premium+');
      expect(result.extraProperties).toEqual(input.extraProperties);
    });

    it('should handle update of non-existent edition', async () => {
      const input: EditionUpdateDto = { displayName: 'Updated' };
      mockRestService.request.mockRejectedValue(new Error('Edition not found'));

      await expect(service.update('non-existent', input)).rejects.toThrow('Edition not found');
    });

    it('should handle concurrency conflicts', async () => {
      const input: EditionUpdateDto = { displayName: 'Updated' };
      mockRestService.request.mockRejectedValue(new Error('Concurrency conflict'));

      await expect(service.update('edition-1', input)).rejects.toThrow('Concurrency conflict');
    });

    it('should handle validation errors', async () => {
      const input: EditionUpdateDto = { displayName: '' };
      mockRestService.request.mockRejectedValue(new Error('Display name is required'));

      await expect(service.update('edition-1', input)).rejects.toThrow('Display name is required');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in edition ID', async () => {
      mockRestService.request.mockResolvedValue(mockEdition);

      await service.get('edition-with-special-chars-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/editions/edition-with-special-chars-123',
      });
    });

    it('should handle network errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Network error'));

      await expect(service.getList()).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Request timeout'));

      await expect(service.create({ displayName: 'Test' })).rejects.toThrow('Request timeout');
    });

    it('should handle unauthorized errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Unauthorized'));

      await expect(service.update('edition-1', { displayName: 'Test' })).rejects.toThrow('Unauthorized');
    });
  });
});
