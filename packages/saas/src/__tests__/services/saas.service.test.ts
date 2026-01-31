import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SaasService } from '../../services/saas.service';
import { Saas } from '../../models';

describe('SaasService', () => {
  let saasService: SaasService;
  let mockRestService: {
    request: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    saasService = new SaasService(mockRestService as any);
  });

  describe('Tenant Operations', () => {
    describe('getTenants', () => {
      it('should call request with correct parameters', async () => {
        const expectedResponse: Saas.TenantsResponse = {
          items: [
            { id: 'tenant-1', name: 'Tenant One', editionId: 'ed-1', editionName: 'Basic' },
          ],
          totalCount: 1,
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await saasService.getTenants();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/saas/tenants',
          params: {},
        });
        expect(result).toEqual(expectedResponse);
      });

      it('should pass query parameters', async () => {
        mockRestService.request.mockResolvedValue({ items: [], totalCount: 0 });
        const params: Saas.TenantsQueryParams = {
          skipCount: 0,
          maxResultCount: 10,
          filter: 'test',
          editionId: 'ed-1',
          getEditionNames: true,
        };

        await saasService.getTenants(params);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/saas/tenants',
          params,
        });
      });
    });

    describe('getTenantById', () => {
      it('should fetch tenant by ID', async () => {
        const expectedTenant: Saas.Tenant = {
          id: 'tenant-1',
          name: 'Tenant One',
          editionId: 'ed-1',
          editionName: 'Basic',
          concurrencyStamp: 'stamp1',
        };
        mockRestService.request.mockResolvedValue(expectedTenant);

        const result = await saasService.getTenantById('tenant-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/saas/tenants/tenant-1',
        });
        expect(result).toEqual(expectedTenant);
      });
    });

    describe('createTenant', () => {
      it('should create a new tenant', async () => {
        const newTenant: Saas.CreateTenantRequest = {
          name: 'New Tenant',
          editionId: 'ed-1',
          adminEmailAddress: 'admin@newtenant.com',
          adminPassword: 'Password123!',
        };
        const expectedResponse: Saas.Tenant = {
          id: 'new-tenant-id',
          name: 'New Tenant',
          editionId: 'ed-1',
          concurrencyStamp: 'stamp',
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await saasService.createTenant(newTenant);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'POST',
          url: '/api/saas/tenants',
          body: newTenant,
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('updateTenant', () => {
      it('should update an existing tenant', async () => {
        const updatedTenant: Saas.UpdateTenantRequest = {
          id: 'tenant-1',
          name: 'Updated Tenant',
          editionId: 'ed-2',
          concurrencyStamp: 'stamp1',
        };
        const expectedResponse: Saas.Tenant = {
          id: 'tenant-1',
          name: 'Updated Tenant',
          editionId: 'ed-2',
          concurrencyStamp: 'new-stamp',
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await saasService.updateTenant(updatedTenant);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/saas/tenants/tenant-1',
          body: { name: 'Updated Tenant', editionId: 'ed-2', concurrencyStamp: 'stamp1' },
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('deleteTenant', () => {
      it('should delete a tenant', async () => {
        mockRestService.request.mockResolvedValue(undefined);

        await saasService.deleteTenant('tenant-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'DELETE',
          url: '/api/saas/tenants/tenant-1',
        });
      });
    });
  });

  describe('Connection String Operations', () => {
    describe('getDefaultConnectionString', () => {
      it('should get connection string for a tenant', async () => {
        const connectionString = 'Server=localhost;Database=Tenant1;';
        mockRestService.request.mockResolvedValue(connectionString);

        const result = await saasService.getDefaultConnectionString('tenant-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/saas/tenants/tenant-1/default-connection-string',
          responseType: 'text',
        });
        expect(result).toEqual(connectionString);
      });

      it('should return empty string for shared database', async () => {
        mockRestService.request.mockResolvedValue('');

        const result = await saasService.getDefaultConnectionString('tenant-1');

        expect(result).toEqual('');
      });
    });

    describe('updateDefaultConnectionString', () => {
      it('should update connection string for a tenant', async () => {
        mockRestService.request.mockResolvedValue(undefined);
        const payload: Saas.DefaultConnectionStringRequest = {
          id: 'tenant-1',
          defaultConnectionString: 'Server=localhost;Database=NewDb;',
        };

        await saasService.updateDefaultConnectionString(payload);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/saas/tenants/tenant-1/default-connection-string',
          params: { defaultConnectionString: 'Server=localhost;Database=NewDb;' },
        });
      });
    });

    describe('deleteDefaultConnectionString', () => {
      it('should delete connection string (revert to shared)', async () => {
        mockRestService.request.mockResolvedValue(undefined);

        await saasService.deleteDefaultConnectionString('tenant-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'DELETE',
          url: '/api/saas/tenants/tenant-1/default-connection-string',
        });
      });
    });
  });

  describe('Edition Operations', () => {
    describe('getEditions', () => {
      it('should call request with correct parameters', async () => {
        const expectedResponse: Saas.EditionsResponse = {
          items: [
            { id: 'ed-1', displayName: 'Basic Edition' },
            { id: 'ed-2', displayName: 'Pro Edition' },
          ],
          totalCount: 2,
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await saasService.getEditions();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/saas/editions',
          params: {},
        });
        expect(result).toEqual(expectedResponse);
      });

      it('should pass query parameters', async () => {
        mockRestService.request.mockResolvedValue({ items: [], totalCount: 0 });
        const params: Saas.EditionsQueryParams = {
          skipCount: 0,
          maxResultCount: 10,
          filter: 'pro',
        };

        await saasService.getEditions(params);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/saas/editions',
          params,
        });
      });
    });

    describe('getEditionById', () => {
      it('should fetch edition by ID', async () => {
        const expectedEdition: Saas.Edition = {
          id: 'ed-1',
          displayName: 'Basic Edition',
          concurrencyStamp: 'stamp1',
        };
        mockRestService.request.mockResolvedValue(expectedEdition);

        const result = await saasService.getEditionById('ed-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/saas/editions/ed-1',
        });
        expect(result).toEqual(expectedEdition);
      });
    });

    describe('createEdition', () => {
      it('should create a new edition', async () => {
        const newEdition: Saas.CreateEditionRequest = {
          displayName: 'Enterprise Edition',
        };
        const expectedResponse: Saas.Edition = {
          id: 'new-ed-id',
          displayName: 'Enterprise Edition',
          concurrencyStamp: 'stamp',
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await saasService.createEdition(newEdition);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'POST',
          url: '/api/saas/editions',
          body: newEdition,
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('updateEdition', () => {
      it('should update an existing edition', async () => {
        const updatedEdition: Saas.UpdateEditionRequest = {
          id: 'ed-1',
          displayName: 'Updated Basic Edition',
          concurrencyStamp: 'stamp1',
        };
        const expectedResponse: Saas.Edition = {
          id: 'ed-1',
          displayName: 'Updated Basic Edition',
          concurrencyStamp: 'new-stamp',
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await saasService.updateEdition(updatedEdition);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/saas/editions/ed-1',
          body: { displayName: 'Updated Basic Edition', concurrencyStamp: 'stamp1' },
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('deleteEdition', () => {
      it('should delete an edition', async () => {
        mockRestService.request.mockResolvedValue(undefined);

        await saasService.deleteEdition('ed-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'DELETE',
          url: '/api/saas/editions/ed-1',
        });
      });
    });
  });

  describe('Statistics Operations', () => {
    describe('getUsageStatistics', () => {
      it('should fetch usage statistics', async () => {
        const expectedResponse: Saas.UsageStatisticsResponse = {
          data: [
            { label: 'Basic', value: 10 },
            { label: 'Pro', value: 5 },
            { label: 'Enterprise', value: 2 },
          ],
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await saasService.getUsageStatistics();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/saas/editions/statistics/usage-statistic',
        });
        expect(result).toEqual(expectedResponse);
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from tenant request', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValue(error);

      await expect(saasService.getTenants()).rejects.toThrow('Network error');
    });

    it('should propagate errors from edition request', async () => {
      const error = new Error('Edition not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(saasService.getEditionById('invalid-id')).rejects.toThrow('Edition not found');
    });

    it('should propagate errors from connection string operations', async () => {
      const error = new Error('Connection string operation failed');
      mockRestService.request.mockRejectedValue(error);

      await expect(saasService.getDefaultConnectionString('tenant-1')).rejects.toThrow(
        'Connection string operation failed'
      );
    });
  });
});
