/**
 * Tests for TenantService (v3.2.0)
 * Tests the typed proxy service for Tenant Management API
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { TenantService } from '../../proxy/tenant.service';
import type { GetTenantsInput, TenantCreateDto, TenantDto, TenantUpdateDto } from '../../proxy/models';
import type { RestService, PagedResultDto } from '@abpjs/core';

// Mock RestService with proper typing
interface MockRestService {
  request: Mock;
}

const createMockRestService = (): MockRestService => ({
  request: vi.fn(),
});

describe('TenantService (v3.2.0)', () => {
  let service: TenantService;
  let mockRestService: MockRestService;

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new TenantService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should initialize with RestService', () => {
      expect(service).toBeDefined();
    });

    it('should have default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow changing apiName', () => {
      service.apiName = 'custom';
      expect(service.apiName).toBe('custom');
    });
  });

  describe('create', () => {
    it('should call REST service with POST method and correct URL', async () => {
      const input: TenantCreateDto = {
        name: 'New Tenant',
        adminEmailAddress: 'admin@newtenant.com',
        adminPassword: 'Password123!',
        extraProperties: {},
      };

      const expectedResponse: TenantDto = {
        id: 'created-id',
        name: 'New Tenant',
        extraProperties: {},
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/multi-tenancy/tenants',
        body: input,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should handle create with extraProperties', async () => {
      const input: TenantCreateDto = {
        name: 'Enterprise Tenant',
        adminEmailAddress: 'admin@enterprise.com',
        adminPassword: 'EnterprisePass!',
        extraProperties: { plan: 'enterprise' },
      };

      mockRestService.request.mockResolvedValue({
        id: 'enterprise-id',
        name: 'Enterprise Tenant',
        extraProperties: { plan: 'enterprise' },
      });

      const result = await service.create(input);

      expect(result.extraProperties).toEqual({ plan: 'enterprise' });
    });
  });

  describe('delete', () => {
    it('should call REST service with DELETE method and ID in URL', async () => {
      const id = 'tenant-to-delete';

      mockRestService.request.mockResolvedValue(undefined);

      await service.delete(id);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: `/api/multi-tenancy/tenants/${id}`,
      });
    });

    it('should handle UUID-style IDs', async () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';

      mockRestService.request.mockResolvedValue(undefined);

      await service.delete(id);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: `/api/multi-tenancy/tenants/${id}`,
      });
    });
  });

  describe('deleteDefaultConnectionString', () => {
    it('should call REST service with DELETE method for connection string endpoint', async () => {
      const id = 'tenant-123';

      mockRestService.request.mockResolvedValue(undefined);

      await service.deleteDefaultConnectionString(id);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
      });
    });
  });

  describe('get', () => {
    it('should call REST service with GET method and ID in URL', async () => {
      const id = 'tenant-456';
      const expectedTenant: TenantDto = {
        id,
        name: 'Test Tenant',
        extraProperties: {},
      };

      mockRestService.request.mockResolvedValue(expectedTenant);

      const result = await service.get(id);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: `/api/multi-tenancy/tenants/${id}`,
      });
      expect(result).toEqual(expectedTenant);
    });

    it('should return tenant with extraProperties', async () => {
      const id = 'extended-tenant';
      const expectedTenant: TenantDto = {
        id,
        name: 'Extended Tenant',
        extraProperties: { isActive: true, createdBy: 'admin' },
      };

      mockRestService.request.mockResolvedValue(expectedTenant);

      const result = await service.get(id);

      expect(result.extraProperties).toEqual({ isActive: true, createdBy: 'admin' });
    });
  });

  describe('getDefaultConnectionString', () => {
    it('should call REST service with GET method for connection string endpoint', async () => {
      const id = 'tenant-789';
      const connectionString = 'Server=localhost;Database=TenantDb;';

      mockRestService.request.mockResolvedValue(connectionString);

      const result = await service.getDefaultConnectionString(id);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
      });
      expect(result).toBe(connectionString);
    });

    it('should return empty string for shared database', async () => {
      const id = 'shared-tenant';

      mockRestService.request.mockResolvedValue('');

      const result = await service.getDefaultConnectionString(id);

      expect(result).toBe('');
    });
  });

  describe('getList', () => {
    it('should call REST service with GET method and query params', async () => {
      const input: GetTenantsInput = {
        filter: 'test',
        maxResultCount: 10,
        skipCount: 0,
      };

      const expectedResponse: PagedResultDto<TenantDto> = {
        items: [
          { id: '1', name: 'Test Tenant 1', extraProperties: {} },
          { id: '2', name: 'Test Tenant 2', extraProperties: {} },
        ],
        totalCount: 2,
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/multi-tenancy/tenants',
        params: input,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should handle empty filter', async () => {
      const input: GetTenantsInput = {
        filter: '',
        maxResultCount: 20,
        skipCount: 0,
      };

      const expectedResponse: PagedResultDto<TenantDto> = {
        items: [],
        totalCount: 0,
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.getList(input);

      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('should support pagination', async () => {
      const input: GetTenantsInput = {
        filter: '',
        maxResultCount: 10,
        skipCount: 20,
      };

      mockRestService.request.mockResolvedValue({
        items: [{ id: '21', name: 'Tenant 21', extraProperties: {} }],
        totalCount: 100,
      });

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/multi-tenancy/tenants',
        params: input,
      });
      expect(result.totalCount).toBe(100);
    });

    it('should support sorting', async () => {
      const input: GetTenantsInput = {
        filter: '',
        maxResultCount: 10,
        skipCount: 0,
        sorting: 'name desc',
      };

      mockRestService.request.mockResolvedValue({
        items: [{ id: '1', name: 'Zebra Tenant', extraProperties: {} }],
        totalCount: 1,
      });

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/multi-tenancy/tenants',
        params: expect.objectContaining({ sorting: 'name desc' }),
      });
    });
  });

  describe('update', () => {
    it('should call REST service with PUT method and ID in URL', async () => {
      const id = 'tenant-to-update';
      const input: TenantUpdateDto = {
        name: 'Updated Name',
        extraProperties: {},
      };

      const expectedResponse: TenantDto = {
        id,
        name: 'Updated Name',
        extraProperties: {},
      };

      mockRestService.request.mockResolvedValue(expectedResponse);

      const result = await service.update(id, input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: `/api/multi-tenancy/tenants/${id}`,
        body: input,
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should handle update with extraProperties', async () => {
      const id = 'tenant-123';
      const input: TenantUpdateDto = {
        name: 'New Name',
        extraProperties: { version: 2 },
      };

      mockRestService.request.mockResolvedValue({
        id,
        name: 'New Name',
        extraProperties: { version: 2 },
      });

      const result = await service.update(id, input);

      expect(result.extraProperties).toEqual({ version: 2 });
    });
  });

  describe('updateDefaultConnectionString', () => {
    it('should call REST service with PUT method and connection string as param', async () => {
      const id = 'tenant-abc';
      const connectionString = 'Server=newserver;Database=NewDb;';

      mockRestService.request.mockResolvedValue(undefined);

      await service.updateDefaultConnectionString(id, connectionString);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
        params: { defaultConnectionString: connectionString },
      });
    });

    it('should handle empty connection string to clear', async () => {
      const id = 'tenant-xyz';
      const connectionString = '';

      mockRestService.request.mockResolvedValue(undefined);

      await service.updateDefaultConnectionString(id, connectionString);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: `/api/multi-tenancy/tenants/${id}/default-connection-string`,
        params: { defaultConnectionString: '' },
      });
    });
  });

  describe('Error handling', () => {
    it('should propagate errors from REST service', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValue(error);

      await expect(service.get('any-id')).rejects.toThrow('Network error');
    });

    it('should propagate validation errors', async () => {
      const validationError = new Error('Validation failed: Name is required');
      mockRestService.request.mockRejectedValue(validationError);

      const input: TenantCreateDto = {
        name: '',
        adminEmailAddress: 'admin@test.com',
        adminPassword: 'pass',
        extraProperties: {},
      };

      await expect(service.create(input)).rejects.toThrow('Validation failed');
    });

    it('should propagate not found errors', async () => {
      const notFoundError = new Error('Tenant not found');
      mockRestService.request.mockRejectedValue(notFoundError);

      await expect(service.get('non-existent-id')).rejects.toThrow('not found');
    });
  });

  describe('Method binding', () => {
    it('should have create as arrow function for proper binding', () => {
      const { create } = service;
      expect(typeof create).toBe('function');
    });

    it('should have delete as arrow function for proper binding', () => {
      const { delete: deleteFn } = service;
      expect(typeof deleteFn).toBe('function');
    });

    it('should have get as arrow function for proper binding', () => {
      const { get } = service;
      expect(typeof get).toBe('function');
    });

    it('should have getList as arrow function for proper binding', () => {
      const { getList } = service;
      expect(typeof getList).toBe('function');
    });

    it('should have update as arrow function for proper binding', () => {
      const { update } = service;
      expect(typeof update).toBe('function');
    });
  });
});
