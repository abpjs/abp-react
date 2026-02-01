import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TenantManagementService } from '../services/tenant-management.service';
import type { TenantManagement } from '../models';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('TenantManagementService', () => {
  let service: TenantManagementService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new TenantManagementService(mockRestService as any);
  });

  describe('getAll', () => {
    it('should call rest.request with correct parameters without params', async () => {
      const mockResponse: TenantManagement.Response = {
        items: [{ id: '1', name: 'Tenant 1' }],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValue(mockResponse);

      const result = await service.getAll();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/multi-tenancy/tenants',
        params: {},
      });
      expect(result).toEqual(mockResponse);
    });

    it('should call rest.request with pagination params (v0.9.0 feature)', async () => {
      const mockResponse: TenantManagement.Response = {
        items: [{ id: '1', name: 'Tenant 1' }],
        totalCount: 10,
      };
      mockRestService.request.mockResolvedValue(mockResponse);

      const params = { skipCount: 0, maxResultCount: 10 };
      const result = await service.getAll(params);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/multi-tenancy/tenants',
        params,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should call rest.request with filter param (v0.9.0 feature)', async () => {
      const mockResponse: TenantManagement.Response = {
        items: [{ id: '1', name: 'Test Tenant' }],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValue(mockResponse);

      const params = { filter: 'Test' };
      const result = await service.getAll(params);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/multi-tenancy/tenants',
        params,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should call rest.request with combined pagination and filter params', async () => {
      const mockResponse: TenantManagement.Response = {
        items: [],
        totalCount: 0,
      };
      mockRestService.request.mockResolvedValue(mockResponse);

      const params = { skipCount: 10, maxResultCount: 5, filter: 'Test', sorting: 'name asc' };
      await service.getAll(params);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/multi-tenancy/tenants',
        params,
      });
    });

    it('should handle empty response', async () => {
      const mockResponse: TenantManagement.Response = {
        items: [],
        totalCount: 0,
      };
      mockRestService.request.mockResolvedValue(mockResponse);

      const result = await service.getAll();

      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should propagate errors from rest service', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('should call rest.request with correct tenant id', async () => {
      const mockTenant: TenantManagement.Item = { id: '123', name: 'Test Tenant' };
      mockRestService.request.mockResolvedValue(mockTenant);

      const result = await service.getById('123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/multi-tenancy/tenants/123',
      });
      expect(result).toEqual(mockTenant);
    });

    it('should handle not found error', async () => {
      mockRestService.request.mockRejectedValue(new Error('Not found'));

      await expect(service.getById('non-existent')).rejects.toThrow('Not found');
    });
  });

  describe('create', () => {
    it('should call rest.request with correct body', async () => {
      const newTenant: TenantManagement.AddRequest = {
        name: 'New Tenant',
        adminEmailAddress: 'admin@newtenant.com',
        adminPassword: 'Password123!',
      };
      const createdTenant: TenantManagement.Item = { id: '456', name: 'New Tenant' };
      mockRestService.request.mockResolvedValue(createdTenant);

      const result = await service.create(newTenant);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/multi-tenancy/tenants',
        body: newTenant,
      });
      expect(result).toEqual(createdTenant);
    });

    it('should handle validation error', async () => {
      mockRestService.request.mockRejectedValue(new Error('Validation failed'));

      await expect(service.create({
        name: '',
        adminEmailAddress: 'admin@test.com',
        adminPassword: 'Password123!',
      })).rejects.toThrow('Validation failed');
    });
  });

  describe('update', () => {
    it('should call rest.request with id in url and body without id', async () => {
      const updateRequest: TenantManagement.UpdateRequest = { id: '123', name: 'Updated Tenant' };
      const updatedTenant: TenantManagement.Item = { id: '123', name: 'Updated Tenant' };
      mockRestService.request.mockResolvedValue(updatedTenant);

      const result = await service.update(updateRequest);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/multi-tenancy/tenants/123',
        body: { name: 'Updated Tenant' },
      });
      expect(result).toEqual(updatedTenant);
    });

    it('should handle concurrency error', async () => {
      mockRestService.request.mockRejectedValue(new Error('Concurrency conflict'));

      await expect(service.update({ id: '123', name: 'Test' })).rejects.toThrow('Concurrency conflict');
    });
  });

  describe('delete', () => {
    it('should call rest.request with correct tenant id', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.delete('123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/multi-tenancy/tenants/123',
      });
    });

    it('should handle delete error', async () => {
      mockRestService.request.mockRejectedValue(new Error('Cannot delete tenant'));

      await expect(service.delete('123')).rejects.toThrow('Cannot delete tenant');
    });
  });

  describe('getDefaultConnectionString', () => {
    it('should call rest.request with correct tenant id', async () => {
      const connectionString = 'Server=localhost;Database=TenantDb';
      mockRestService.request.mockResolvedValue(connectionString);

      const result = await service.getDefaultConnectionString('123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/multi-tenancy/tenants/123/default-connection-string',
      });
      expect(result).toBe(connectionString);
    });

    it('should handle empty connection string (shared database)', async () => {
      mockRestService.request.mockResolvedValue('');

      const result = await service.getDefaultConnectionString('123');

      expect(result).toBe('');
    });
  });

  describe('updateDefaultConnectionString', () => {
    it('should call rest.request with connection string as param', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.updateDefaultConnectionString({
        id: '123',
        defaultConnectionString: 'Server=newserver;Database=TenantDb',
      });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/multi-tenancy/tenants/123/default-connection-string',
        params: { defaultConnectionString: 'Server=newserver;Database=TenantDb' },
      });
    });

    it('should handle invalid connection string error', async () => {
      mockRestService.request.mockRejectedValue(new Error('Invalid connection string'));

      await expect(
        service.updateDefaultConnectionString({
          id: '123',
          defaultConnectionString: 'invalid',
        })
      ).rejects.toThrow('Invalid connection string');
    });
  });

  describe('deleteDefaultConnectionString', () => {
    it('should call rest.request with correct tenant id', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.deleteDefaultConnectionString('123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/multi-tenancy/tenants/123/default-connection-string',
      });
    });

    it('should handle error when deleting connection string', async () => {
      mockRestService.request.mockRejectedValue(new Error('Cannot delete connection string'));

      await expect(service.deleteDefaultConnectionString('123')).rejects.toThrow(
        'Cannot delete connection string'
      );
    });
  });

  describe('apiName property (v2.4.0)', () => {
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
});
