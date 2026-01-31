/**
 * Tests for SaasStateService
 * @since 2.0.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SaasStateService } from '../../services/saas-state.service';
import { SaasService } from '../../services/saas.service';
import type { Saas } from '../../models';

// Mock the SaasService
vi.mock('../../services/saas.service', () => ({
  SaasService: vi.fn().mockImplementation(() => ({
    getTenants: vi.fn(),
    getTenantById: vi.fn(),
    createTenant: vi.fn(),
    updateTenant: vi.fn(),
    deleteTenant: vi.fn(),
    getLatestTenants: vi.fn(),
    getEditions: vi.fn(),
    getEditionById: vi.fn(),
    createEdition: vi.fn(),
    updateEdition: vi.fn(),
    deleteEdition: vi.fn(),
    getUsageStatistics: vi.fn(),
  })),
}));

describe('SaasStateService', () => {
  let stateService: SaasStateService;
  let mockService: ReturnType<typeof vi.mocked<SaasService>>;
  const mockRestService = {} as any;

  // Sample test data
  const mockTenant: Saas.Tenant = {
    id: 'tenant-1',
    name: 'Test Tenant',
    editionId: 'edition-1',
    editionName: 'Basic',
    concurrencyStamp: 'stamp-1',
  };

  const mockTenantsResponse: Saas.TenantsResponse = {
    items: [mockTenant],
    totalCount: 1,
  };

  const mockEdition: Saas.Edition = {
    id: 'edition-1',
    displayName: 'Basic Edition',
    concurrencyStamp: 'stamp-1',
  };

  const mockEditionsResponse: Saas.EditionsResponse = {
    items: [mockEdition],
    totalCount: 1,
  };

  const mockUsageStatistics: Saas.UsageStatisticsResponse = {
    data: { 'Basic': 5, 'Premium': 10 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    stateService = new SaasStateService(mockRestService);
    // Get the mocked service instance
    mockService = (stateService as any).service;
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
      mockService.getTenants.mockResolvedValue(mockTenantsResponse);

      await stateService.dispatchGetTenants();

      expect(stateService.getTenants()).toEqual([mockTenant]);
      expect(stateService.getTenantsTotalCount()).toBe(1);
    });

    it('should return latest tenants after dispatch', async () => {
      const latestTenants = [mockTenant, { ...mockTenant, id: 'tenant-2', name: 'New Tenant' }];
      mockService.getLatestTenants.mockResolvedValue(latestTenants);

      await stateService.dispatchGetLatestTenants();

      expect(stateService.getLatestTenants()).toEqual(latestTenants);
    });

    it('should return editions after dispatch', async () => {
      mockService.getEditions.mockResolvedValue(mockEditionsResponse);

      await stateService.dispatchGetEditions();

      expect(stateService.getEditions()).toEqual([mockEdition]);
      expect(stateService.getEditionsTotalCount()).toBe(1);
    });

    it('should return usage statistics after dispatch', async () => {
      mockService.getUsageStatistics.mockResolvedValue(mockUsageStatistics);

      await stateService.dispatchGetUsageStatistics();

      expect(stateService.getUsageStatistics()).toEqual(mockUsageStatistics.data);
    });
  });

  describe('Tenant Dispatch Methods', () => {
    it('should dispatch getTenants and update state', async () => {
      mockService.getTenants.mockResolvedValue(mockTenantsResponse);

      const result = await stateService.dispatchGetTenants({ maxResultCount: 10 });

      expect(mockService.getTenants).toHaveBeenCalledWith({ maxResultCount: 10 });
      expect(result).toEqual(mockTenantsResponse);
      expect(stateService.getTenants()).toEqual([mockTenant]);
    });

    it('should dispatch getTenants with default params', async () => {
      mockService.getTenants.mockResolvedValue(mockTenantsResponse);

      await stateService.dispatchGetTenants();

      expect(mockService.getTenants).toHaveBeenCalledWith({});
    });

    it('should dispatch getTenantById', async () => {
      mockService.getTenantById.mockResolvedValue(mockTenant);

      const result = await stateService.dispatchGetTenantById('tenant-1');

      expect(mockService.getTenantById).toHaveBeenCalledWith('tenant-1');
      expect(result).toEqual(mockTenant);
    });

    it('should dispatch createTenant and refresh list', async () => {
      const createRequest: Saas.CreateTenantRequest = {
        name: 'New Tenant',
        editionId: 'edition-1',
        adminEmailAddress: 'admin@test.com',
        adminPassword: 'password123',
      };
      const createdTenant = { ...mockTenant, id: 'tenant-new', name: 'New Tenant' };

      mockService.createTenant.mockResolvedValue(createdTenant);
      mockService.getTenants.mockResolvedValue({ items: [createdTenant], totalCount: 1 });

      const result = await stateService.dispatchCreateTenant(createRequest);

      expect(mockService.createTenant).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(createdTenant);
      // Should refresh list after create
      expect(mockService.getTenants).toHaveBeenCalled();
    });

    it('should dispatch updateTenant and refresh list', async () => {
      const updateRequest: Saas.UpdateTenantRequest = {
        id: 'tenant-1',
        name: 'Updated Tenant',
        editionId: 'edition-2',
      };
      const updatedTenant = { ...mockTenant, name: 'Updated Tenant' };

      mockService.updateTenant.mockResolvedValue(updatedTenant);
      mockService.getTenants.mockResolvedValue({ items: [updatedTenant], totalCount: 1 });

      const result = await stateService.dispatchUpdateTenant(updateRequest);

      expect(mockService.updateTenant).toHaveBeenCalledWith(updateRequest);
      expect(result).toEqual(updatedTenant);
      // Should refresh list after update
      expect(mockService.getTenants).toHaveBeenCalled();
    });

    it('should dispatch deleteTenant and refresh list', async () => {
      mockService.deleteTenant.mockResolvedValue(undefined);
      mockService.getTenants.mockResolvedValue({ items: [], totalCount: 0 });

      await stateService.dispatchDeleteTenant('tenant-1');

      expect(mockService.deleteTenant).toHaveBeenCalledWith('tenant-1');
      // Should refresh list after delete
      expect(mockService.getTenants).toHaveBeenCalled();
    });

    it('should dispatch getLatestTenants and update state', async () => {
      const latestTenants = [mockTenant];
      mockService.getLatestTenants.mockResolvedValue(latestTenants);

      const result = await stateService.dispatchGetLatestTenants();

      expect(mockService.getLatestTenants).toHaveBeenCalled();
      expect(result).toEqual(latestTenants);
      expect(stateService.getLatestTenants()).toEqual(latestTenants);
    });
  });

  describe('Edition Dispatch Methods', () => {
    it('should dispatch getEditions and update state', async () => {
      mockService.getEditions.mockResolvedValue(mockEditionsResponse);

      const result = await stateService.dispatchGetEditions({ maxResultCount: 10 });

      expect(mockService.getEditions).toHaveBeenCalledWith({ maxResultCount: 10 });
      expect(result).toEqual(mockEditionsResponse);
      expect(stateService.getEditions()).toEqual([mockEdition]);
    });

    it('should dispatch getEditions with default params', async () => {
      mockService.getEditions.mockResolvedValue(mockEditionsResponse);

      await stateService.dispatchGetEditions();

      expect(mockService.getEditions).toHaveBeenCalledWith({});
    });

    it('should dispatch getEditionById', async () => {
      mockService.getEditionById.mockResolvedValue(mockEdition);

      const result = await stateService.dispatchGetEditionById('edition-1');

      expect(mockService.getEditionById).toHaveBeenCalledWith('edition-1');
      expect(result).toEqual(mockEdition);
    });

    it('should dispatch createEdition and refresh list', async () => {
      const createRequest: Saas.CreateEditionRequest = {
        displayName: 'Premium Edition',
      };
      const createdEdition = { ...mockEdition, id: 'edition-new', displayName: 'Premium Edition' };

      mockService.createEdition.mockResolvedValue(createdEdition);
      mockService.getEditions.mockResolvedValue({ items: [createdEdition], totalCount: 1 });

      const result = await stateService.dispatchCreateEdition(createRequest);

      expect(mockService.createEdition).toHaveBeenCalledWith(createRequest);
      expect(result).toEqual(createdEdition);
      // Should refresh list after create
      expect(mockService.getEditions).toHaveBeenCalled();
    });

    it('should dispatch updateEdition and refresh list', async () => {
      const updateRequest: Saas.UpdateEditionRequest = {
        id: 'edition-1',
        displayName: 'Updated Edition',
      };
      const updatedEdition = { ...mockEdition, displayName: 'Updated Edition' };

      mockService.updateEdition.mockResolvedValue(updatedEdition);
      mockService.getEditions.mockResolvedValue({ items: [updatedEdition], totalCount: 1 });

      const result = await stateService.dispatchUpdateEdition(updateRequest);

      expect(mockService.updateEdition).toHaveBeenCalledWith(updateRequest);
      expect(result).toEqual(updatedEdition);
      // Should refresh list after update
      expect(mockService.getEditions).toHaveBeenCalled();
    });

    it('should dispatch deleteEdition and refresh list', async () => {
      mockService.deleteEdition.mockResolvedValue(undefined);
      mockService.getEditions.mockResolvedValue({ items: [], totalCount: 0 });

      await stateService.dispatchDeleteEdition('edition-1');

      expect(mockService.deleteEdition).toHaveBeenCalledWith('edition-1');
      // Should refresh list after delete
      expect(mockService.getEditions).toHaveBeenCalled();
    });
  });

  describe('Statistics Dispatch Methods', () => {
    it('should dispatch getUsageStatistics and update state', async () => {
      mockService.getUsageStatistics.mockResolvedValue(mockUsageStatistics);

      const result = await stateService.dispatchGetUsageStatistics();

      expect(mockService.getUsageStatistics).toHaveBeenCalled();
      expect(result).toEqual(mockUsageStatistics);
      expect(stateService.getUsageStatistics()).toEqual(mockUsageStatistics.data);
    });
  });

  describe('State Persistence', () => {
    it('should preserve state across multiple dispatches', async () => {
      // First dispatch tenants
      mockService.getTenants.mockResolvedValue(mockTenantsResponse);
      await stateService.dispatchGetTenants();

      // Then dispatch editions
      mockService.getEditions.mockResolvedValue(mockEditionsResponse);
      await stateService.dispatchGetEditions();

      // Then dispatch usage statistics
      mockService.getUsageStatistics.mockResolvedValue(mockUsageStatistics);
      await stateService.dispatchGetUsageStatistics();

      // All state should be preserved
      expect(stateService.getTenants()).toEqual([mockTenant]);
      expect(stateService.getEditions()).toEqual([mockEdition]);
      expect(stateService.getUsageStatistics()).toEqual(mockUsageStatistics.data);
    });

    it('should handle empty responses', async () => {
      mockService.getTenants.mockResolvedValue({ items: [], totalCount: 0 });
      mockService.getEditions.mockResolvedValue({ items: [], totalCount: 0 });
      mockService.getLatestTenants.mockResolvedValue([]);
      mockService.getUsageStatistics.mockResolvedValue({ data: {} });

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

      mockService.getTenants.mockResolvedValue({
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
      mockService.getTenants.mockRejectedValue(error);

      await expect(stateService.dispatchGetTenants()).rejects.toThrow('Network error');
    });

    it('should propagate errors from getTenantById', async () => {
      const error = new Error('Tenant not found');
      mockService.getTenantById.mockRejectedValue(error);

      await expect(stateService.dispatchGetTenantById('invalid-id')).rejects.toThrow('Tenant not found');
    });

    it('should propagate errors from createTenant', async () => {
      const error = new Error('Validation failed');
      mockService.createTenant.mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateTenant({ name: '' })
      ).rejects.toThrow('Validation failed');
    });

    it('should propagate errors from updateTenant', async () => {
      const error = new Error('Update failed');
      mockService.updateTenant.mockRejectedValue(error);

      await expect(
        stateService.dispatchUpdateTenant({ name: 'Updated' })
      ).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deleteTenant', async () => {
      const error = new Error('Cannot delete tenant with active subscription');
      mockService.deleteTenant.mockRejectedValue(error);

      await expect(stateService.dispatchDeleteTenant('tenant-1')).rejects.toThrow('Cannot delete tenant with active subscription');
    });

    it('should propagate errors from getLatestTenants', async () => {
      const error = new Error('Failed to fetch latest tenants');
      mockService.getLatestTenants.mockRejectedValue(error);

      await expect(stateService.dispatchGetLatestTenants()).rejects.toThrow('Failed to fetch latest tenants');
    });

    it('should propagate errors from getEditions', async () => {
      const error = new Error('Network error');
      mockService.getEditions.mockRejectedValue(error);

      await expect(stateService.dispatchGetEditions()).rejects.toThrow('Network error');
    });

    it('should propagate errors from getEditionById', async () => {
      const error = new Error('Edition not found');
      mockService.getEditionById.mockRejectedValue(error);

      await expect(stateService.dispatchGetEditionById('invalid-id')).rejects.toThrow('Edition not found');
    });

    it('should propagate errors from createEdition', async () => {
      const error = new Error('Edition name already exists');
      mockService.createEdition.mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateEdition({ displayName: 'Duplicate' })
      ).rejects.toThrow('Edition name already exists');
    });

    it('should propagate errors from updateEdition', async () => {
      const error = new Error('Update failed');
      mockService.updateEdition.mockRejectedValue(error);

      await expect(
        stateService.dispatchUpdateEdition({ displayName: 'Updated' })
      ).rejects.toThrow('Update failed');
    });

    it('should propagate errors from deleteEdition', async () => {
      const error = new Error('Cannot delete edition with active tenants');
      mockService.deleteEdition.mockRejectedValue(error);

      await expect(stateService.dispatchDeleteEdition('edition-1')).rejects.toThrow('Cannot delete edition with active tenants');
    });

    it('should propagate errors from getUsageStatistics', async () => {
      const error = new Error('Statistics unavailable');
      mockService.getUsageStatistics.mockRejectedValue(error);

      await expect(stateService.dispatchGetUsageStatistics()).rejects.toThrow('Statistics unavailable');
    });
  });
});
