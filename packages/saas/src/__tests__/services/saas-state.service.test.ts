/**
 * Tests for SaasStateService
 * @since 2.0.0
 * @updated 3.2.0 - Updated to mock TenantService and EditionService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SaasStateService } from '../../services/saas-state.service';
import type { SaasTenantDto, EditionDto } from '../../proxy/host/dtos/models';
import type { PagedResultDto } from '@abpjs/core';
import type { GetEditionUsageStatisticsResult } from '../../proxy/host/models';

// Mock the TenantService
vi.mock('../../proxy/host/tenant.service', () => ({
  TenantService: vi.fn().mockImplementation(() => ({
    getList: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Mock the EditionService
vi.mock('../../proxy/host/edition.service', () => ({
  EditionService: vi.fn().mockImplementation(() => ({
    getList: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getUsageStatistics: vi.fn(),
  })),
}));

describe('SaasStateService', () => {
  let stateService: SaasStateService;
  let mockTenantService: {
    getList: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let mockEditionService: {
    getList: ReturnType<typeof vi.fn>;
    get: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    getUsageStatistics: ReturnType<typeof vi.fn>;
  };
  const mockRestService = {} as any;

  // Sample test data
  const mockTenant: SaasTenantDto = {
    id: 'tenant-1',
    name: 'Test Tenant',
    editionId: 'edition-1',
    editionName: 'Basic',
    concurrencyStamp: 'stamp-1',
  };

  const mockTenantsResponse: PagedResultDto<SaasTenantDto> = {
    items: [mockTenant],
    totalCount: 1,
  };

  const mockEdition: EditionDto = {
    id: 'edition-1',
    displayName: 'Basic Edition',
    concurrencyStamp: 'stamp-1',
  };

  const mockEditionsResponse: PagedResultDto<EditionDto> = {
    items: [mockEdition],
    totalCount: 1,
  };

  const mockUsageStatistics: GetEditionUsageStatisticsResult = {
    data: { 'Basic': 5, 'Premium': 10 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    stateService = new SaasStateService(mockRestService);
    // Get the mocked service instances
    mockTenantService = (stateService as any).tenantService;
    mockEditionService = (stateService as any).editionService;
  });

  describe('Getter Methods', () => {
    it('should return empty arrays for initial state', () => {
      expect(stateService.getTenants()).toEqual([]);
      expect(stateService.getLatestTenants()).toEqual([]);
      expect(stateService.getEditions()).toEqual([]);
    });

    it('should return zero for initial total counts', () => {
      expect(stateService.getTenantsTotalCount()).toBe(0);
      expect(stateService.getEditionsTotalCount()).toBe(0);
    });

    it('should return empty object for initial usage statistics', () => {
      expect(stateService.getUsageStatistics()).toEqual({});
    });

    it('should return tenants after dispatch', async () => {
      mockTenantService.getList.mockResolvedValue(mockTenantsResponse);

      await stateService.dispatchGetTenants();

      expect(stateService.getTenants()).toEqual([mockTenant]);
      expect(stateService.getTenantsTotalCount()).toBe(1);
    });

    it('should return latest tenants after dispatch', async () => {
      const latestTenants = [mockTenant, { ...mockTenant, id: 'tenant-2', name: 'New Tenant' }];
      mockTenantService.getList.mockResolvedValue({ items: latestTenants, totalCount: 2 });

      await stateService.dispatchGetLatestTenants();

      expect(stateService.getLatestTenants()).toEqual(latestTenants);
    });

    it('should return editions after dispatch', async () => {
      mockEditionService.getList.mockResolvedValue(mockEditionsResponse);

      await stateService.dispatchGetEditions();

      expect(stateService.getEditions()).toEqual([mockEdition]);
      expect(stateService.getEditionsTotalCount()).toBe(1);
    });

    it('should return usage statistics after dispatch', async () => {
      mockEditionService.getUsageStatistics.mockResolvedValue(mockUsageStatistics);

      await stateService.dispatchGetUsageStatistics();

      expect(stateService.getUsageStatistics()).toEqual(mockUsageStatistics.data);
    });
  });

  describe('Tenant Dispatch Methods', () => {
    it('should dispatch getTenants and update state', async () => {
      mockTenantService.getList.mockResolvedValue(mockTenantsResponse);

      const result = await stateService.dispatchGetTenants({ maxResultCount: 10 });

      expect(mockTenantService.getList).toHaveBeenCalledWith({ maxResultCount: 10 });
      expect(result).toEqual(mockTenantsResponse);
      expect(stateService.getTenants()).toEqual([mockTenant]);
    });

    it('should dispatch getTenants with default params', async () => {
      mockTenantService.getList.mockResolvedValue(mockTenantsResponse);

      await stateService.dispatchGetTenants();

      expect(mockTenantService.getList).toHaveBeenCalledWith({});
    });

    it('should dispatch getTenantById', async () => {
      mockTenantService.get.mockResolvedValue(mockTenant);

      const result = await stateService.dispatchGetTenantById('tenant-1');

      expect(mockTenantService.get).toHaveBeenCalledWith('tenant-1');
      expect(result).toEqual(mockTenant);
    });

    it('should dispatch createTenant and refresh list', async () => {
      const createRequest = {
        name: 'New Tenant',
        editionId: 'edition-1',
        adminEmailAddress: 'admin@test.com',
        adminPassword: 'password123',
      };
      const createdTenant = { ...mockTenant, id: 'tenant-new', name: 'New Tenant' };

      mockTenantService.create.mockResolvedValue(createdTenant);
      mockTenantService.getList.mockResolvedValue({ items: [createdTenant], totalCount: 1 });

      const result = await stateService.dispatchCreateTenant(createRequest);

      expect(mockTenantService.create).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(createdTenant);
      // Should refresh list after create
      expect(mockTenantService.getList).toHaveBeenCalled();
    });

    it('should dispatch updateTenant and refresh list', async () => {
      const updateRequest = {
        id: 'tenant-1',
        name: 'Updated Tenant',
        editionId: 'edition-2',
      };
      const updatedTenant = { ...mockTenant, name: 'Updated Tenant' };

      mockTenantService.update.mockResolvedValue(updatedTenant);
      mockTenantService.getList.mockResolvedValue({ items: [updatedTenant], totalCount: 1 });

      const result = await stateService.dispatchUpdateTenant(updateRequest);

      expect(mockTenantService.update).toHaveBeenCalledWith('tenant-1', {
        name: 'Updated Tenant',
        editionId: 'edition-2',
      });
      expect(result).toEqual(updatedTenant);
      // Should refresh list after update
      expect(mockTenantService.getList).toHaveBeenCalled();
    });

    it('should dispatch deleteTenant and refresh list', async () => {
      mockTenantService.delete.mockResolvedValue(undefined);
      mockTenantService.getList.mockResolvedValue({ items: [], totalCount: 0 });

      await stateService.dispatchDeleteTenant('tenant-1');

      expect(mockTenantService.delete).toHaveBeenCalledWith('tenant-1');
      // Should refresh list after delete
      expect(mockTenantService.getList).toHaveBeenCalled();
    });

    it('should dispatch getLatestTenants and update state', async () => {
      const latestTenants = [mockTenant];
      mockTenantService.getList.mockResolvedValue({ items: latestTenants, totalCount: 1 });

      const result = await stateService.dispatchGetLatestTenants();

      expect(mockTenantService.getList).toHaveBeenCalledWith({ maxResultCount: 5, sorting: 'creationTime desc' });
      expect(result).toEqual({ items: latestTenants, totalCount: 1 });
      expect(stateService.getLatestTenants()).toEqual(latestTenants);
    });
  });

  describe('Edition Dispatch Methods', () => {
    it('should dispatch getEditions and update state', async () => {
      mockEditionService.getList.mockResolvedValue(mockEditionsResponse);

      const result = await stateService.dispatchGetEditions({ maxResultCount: 10 });

      expect(mockEditionService.getList).toHaveBeenCalledWith({ maxResultCount: 10 });
      expect(result).toEqual(mockEditionsResponse);
      expect(stateService.getEditions()).toEqual([mockEdition]);
    });

    it('should dispatch getEditions with default params', async () => {
      mockEditionService.getList.mockResolvedValue(mockEditionsResponse);

      await stateService.dispatchGetEditions();

      expect(mockEditionService.getList).toHaveBeenCalledWith({});
    });

    it('should dispatch getEditionById', async () => {
      mockEditionService.get.mockResolvedValue(mockEdition);

      const result = await stateService.dispatchGetEditionById('edition-1');

      expect(mockEditionService.get).toHaveBeenCalledWith('edition-1');
      expect(result).toEqual(mockEdition);
    });

    it('should dispatch createEdition and refresh list', async () => {
      const createRequest = {
        displayName: 'Premium Edition',
      };
      const createdEdition = { ...mockEdition, id: 'edition-new', displayName: 'Premium Edition' };

      mockEditionService.create.mockResolvedValue(createdEdition);
      mockEditionService.getList.mockResolvedValue({ items: [createdEdition], totalCount: 1 });

      const result = await stateService.dispatchCreateEdition(createRequest);

      expect(mockEditionService.create).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(createdEdition);
      // Should refresh list after create
      expect(mockEditionService.getList).toHaveBeenCalled();
    });

    it('should dispatch updateEdition and refresh list', async () => {
      const updateRequest = {
        id: 'edition-1',
        displayName: 'Updated Edition',
      };
      const updatedEdition = { ...mockEdition, displayName: 'Updated Edition' };

      mockEditionService.update.mockResolvedValue(updatedEdition);
      mockEditionService.getList.mockResolvedValue({ items: [updatedEdition], totalCount: 1 });

      const result = await stateService.dispatchUpdateEdition(updateRequest);

      expect(mockEditionService.update).toHaveBeenCalledWith('edition-1', {
        displayName: 'Updated Edition',
      });
      expect(result).toEqual(updatedEdition);
      // Should refresh list after update
      expect(mockEditionService.getList).toHaveBeenCalled();
    });

    it('should dispatch deleteEdition and refresh list', async () => {
      mockEditionService.delete.mockResolvedValue(undefined);
      mockEditionService.getList.mockResolvedValue({ items: [], totalCount: 0 });

      await stateService.dispatchDeleteEdition('edition-1');

      expect(mockEditionService.delete).toHaveBeenCalledWith('edition-1');
      // Should refresh list after delete
      expect(mockEditionService.getList).toHaveBeenCalled();
    });
  });

  describe('Statistics Dispatch Methods', () => {
    it('should dispatch getUsageStatistics and update state', async () => {
      mockEditionService.getUsageStatistics.mockResolvedValue(mockUsageStatistics);

      const result = await stateService.dispatchGetUsageStatistics();

      expect(mockEditionService.getUsageStatistics).toHaveBeenCalled();
      expect(result).toEqual(mockUsageStatistics);
      expect(stateService.getUsageStatistics()).toEqual(mockUsageStatistics.data);
    });
  });

  describe('State Persistence', () => {
    it('should preserve state across multiple dispatches', async () => {
      // First dispatch tenants
      mockTenantService.getList.mockResolvedValue(mockTenantsResponse);
      await stateService.dispatchGetTenants();

      // Then dispatch editions
      mockEditionService.getList.mockResolvedValue(mockEditionsResponse);
      await stateService.dispatchGetEditions();

      // Then dispatch usage statistics
      mockEditionService.getUsageStatistics.mockResolvedValue(mockUsageStatistics);
      await stateService.dispatchGetUsageStatistics();

      // All state should be preserved
      expect(stateService.getTenants()).toEqual([mockTenant]);
      expect(stateService.getEditions()).toEqual([mockEdition]);
      expect(stateService.getUsageStatistics()).toEqual(mockUsageStatistics.data);
    });

    it('should handle empty responses', async () => {
      mockTenantService.getList.mockResolvedValue({ items: [], totalCount: 0 });
      mockEditionService.getList.mockResolvedValue({ items: [], totalCount: 0 });
      mockEditionService.getUsageStatistics.mockResolvedValue({ data: {} });

      await stateService.dispatchGetTenants();
      await stateService.dispatchGetEditions();
      await stateService.dispatchGetLatestTenants();
      await stateService.dispatchGetUsageStatistics();

      expect(stateService.getTenants()).toEqual([]);
      expect(stateService.getTenantsTotalCount()).toBe(0);
      expect(stateService.getEditions()).toEqual([]);
      expect(stateService.getEditionsTotalCount()).toBe(0);
      expect(stateService.getLatestTenants()).toEqual([]);
      expect(stateService.getUsageStatistics()).toEqual({});
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined tenants items gracefully', () => {
      expect(stateService.getTenants()).toEqual([]);
      expect(stateService.getTenantsTotalCount()).toBe(0);
    });

    it('should handle undefined editions items gracefully', () => {
      expect(stateService.getEditions()).toEqual([]);
      expect(stateService.getEditionsTotalCount()).toBe(0);
    });

    it('should handle undefined latestTenants gracefully', () => {
      expect(stateService.getLatestTenants()).toEqual([]);
    });

    it('should handle undefined usageStatistics gracefully', () => {
      expect(stateService.getUsageStatistics()).toEqual({});
    });

    it('should handle large datasets', async () => {
      const manyTenants = Array.from({ length: 100 }, (_, i) => ({
        ...mockTenant,
        id: `tenant-${i}`,
        name: `Tenant ${i}`,
      }));

      mockTenantService.getList.mockResolvedValue({
        items: manyTenants,
        totalCount: 1000, // More than items in this page
      });

      await stateService.dispatchGetTenants({ maxResultCount: 100 });

      expect(stateService.getTenants()).toHaveLength(100);
      expect(stateService.getTenantsTotalCount()).toBe(1000);
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from getTenants', async () => {
      const error = new Error('Network error');
      mockTenantService.getList.mockRejectedValue(error);

      await expect(stateService.dispatchGetTenants()).rejects.toThrow('Network error');
    });

    it('should propagate errors from getTenantById', async () => {
      const error = new Error('Tenant not found');
      mockTenantService.get.mockRejectedValue(error);

      await expect(stateService.dispatchGetTenantById('invalid-id')).rejects.toThrow('Tenant not found');
    });

    it('should propagate errors from createTenant', async () => {
      const error = new Error('Validation failed');
      mockTenantService.create.mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateTenant({ name: '', adminEmailAddress: '', adminPassword: '' })
      ).rejects.toThrow('Validation failed');
    });

    it('should propagate errors from updateTenant', async () => {
      const error = new Error('Update failed');
      mockTenantService.update.mockRejectedValue(error);

      await expect(
        stateService.dispatchUpdateTenant({ id: 'tenant-1', name: 'Updated' })
      ).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deleteTenant', async () => {
      const error = new Error('Cannot delete tenant with active subscription');
      mockTenantService.delete.mockRejectedValue(error);

      await expect(stateService.dispatchDeleteTenant('tenant-1')).rejects.toThrow('Cannot delete tenant with active subscription');
    });

    it('should propagate errors from getLatestTenants', async () => {
      const error = new Error('Failed to fetch latest tenants');
      mockTenantService.getList.mockRejectedValue(error);

      await expect(stateService.dispatchGetLatestTenants()).rejects.toThrow('Failed to fetch latest tenants');
    });

    it('should propagate errors from getEditions', async () => {
      const error = new Error('Network error');
      mockEditionService.getList.mockRejectedValue(error);

      await expect(stateService.dispatchGetEditions()).rejects.toThrow('Network error');
    });

    it('should propagate errors from getEditionById', async () => {
      const error = new Error('Edition not found');
      mockEditionService.get.mockRejectedValue(error);

      await expect(stateService.dispatchGetEditionById('invalid-id')).rejects.toThrow('Edition not found');
    });

    it('should propagate errors from createEdition', async () => {
      const error = new Error('Edition name already exists');
      mockEditionService.create.mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateEdition({ displayName: 'Duplicate' })
      ).rejects.toThrow('Edition name already exists');
    });

    it('should propagate errors from updateEdition', async () => {
      const error = new Error('Update failed');
      mockEditionService.update.mockRejectedValue(error);

      await expect(
        stateService.dispatchUpdateEdition({ id: 'edition-1', displayName: 'Updated' })
      ).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deleteEdition', async () => {
      const error = new Error('Cannot delete edition with active tenants');
      mockEditionService.delete.mockRejectedValue(error);

      await expect(stateService.dispatchDeleteEdition('edition-1')).rejects.toThrow('Cannot delete edition with active tenants');
    });

    it('should propagate errors from getUsageStatistics', async () => {
      const error = new Error('Statistics unavailable');
      mockEditionService.getUsageStatistics.mockRejectedValue(error);

      await expect(stateService.dispatchGetUsageStatistics()).rejects.toThrow('Statistics unavailable');
    });
  });
});
