/**
 * Tests for TenantService (proxy)
 * @since 3.2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TenantService } from '../../../proxy/host/tenant.service';
import type { SaasTenantDto, SaasTenantCreateDto, SaasTenantUpdateDto, GetTenantsInput } from '../../../proxy/host/dtos/models';
import type { PagedResultDto } from '@abpjs/core';

describe('TenantService', () => {
  let service: TenantService;
  let mockRestService: {
    request: ReturnType<typeof vi.fn>;
  };

  // Sample test data
  const mockTenant: SaasTenantDto = {
    id: 'tenant-1',
    name: 'Test Tenant',
    editionId: 'edition-1',
    editionName: 'Basic',
    concurrencyStamp: 'stamp-123',
    creationTime: '2024-01-15T10:00:00Z',
    creatorId: 'user-1',
    extraProperties: { industry: 'technology' },
  };

  const mockTenantsResponse: PagedResultDto<SaasTenantDto> = {
    items: [mockTenant],
    totalCount: 1,
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new TenantService(mockRestService as any);
  });

  describe('Constructor and Properties', () => {
    it('should create an instance', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(TenantService);
    });

    it('should have default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow changing apiName', () => {
      service.apiName = 'saas-api';
      expect(service.apiName).toBe('saas-api');
    });
  });

  describe('create', () => {
    it('should create a tenant with all required fields', async () => {
      const input: SaasTenantCreateDto = {
        name: 'New Tenant',
        adminEmailAddress: 'admin@newtenant.com',
        adminPassword: 'SecurePassword123!',
      };
      const createdTenant = { ...mockTenant, name: 'New Tenant' };
      mockRestService.request.mockResolvedValue(createdTenant);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/saas/tenants',
        body: input,
      });
      expect(result.name).toBe('New Tenant');
    });

    it('should create a tenant with edition', async () => {
      const input: SaasTenantCreateDto = {
        name: 'Enterprise Tenant',
        adminEmailAddress: 'admin@enterprise.com',
        adminPassword: 'EnterprisePass123!',
        editionId: 'edition-enterprise',
      };
      const createdTenant = { ...mockTenant, ...input, editionName: 'Enterprise' };
      mockRestService.request.mockResolvedValue(createdTenant);

      const result = await service.create(input);

      expect(result.editionId).toBe('edition-enterprise');
    });

    it('should create a tenant with extra properties', async () => {
      const input: SaasTenantCreateDto = {
        name: 'Custom Tenant',
        adminEmailAddress: 'admin@custom.com',
        adminPassword: 'CustomPass123!',
        extraProperties: { maxUsers: 50, region: 'us-east' },
      };
      const createdTenant = { ...mockTenant, ...input };
      mockRestService.request.mockResolvedValue(createdTenant);

      const result = await service.create(input);

      expect(result.extraProperties).toEqual(input.extraProperties);
    });

    it('should propagate validation errors', async () => {
      const input: SaasTenantCreateDto = {
        name: '',
        adminEmailAddress: 'invalid-email',
        adminPassword: '123',
      };
      mockRestService.request.mockRejectedValue(new Error('Validation failed'));

      await expect(service.create(input)).rejects.toThrow('Validation failed');
    });

    it('should handle duplicate tenant name', async () => {
      const input: SaasTenantCreateDto = {
        name: 'Existing Tenant',
        adminEmailAddress: 'admin@test.com',
        adminPassword: 'Password123!',
      };
      mockRestService.request.mockRejectedValue(new Error('Tenant name already exists'));

      await expect(service.create(input)).rejects.toThrow('Tenant name already exists');
    });
  });

  describe('delete', () => {
    it('should delete a tenant by ID', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.delete('tenant-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/saas/tenants/tenant-1',
      });
    });

    it('should handle deletion of non-existent tenant', async () => {
      mockRestService.request.mockRejectedValue(new Error('Tenant not found'));

      await expect(service.delete('non-existent')).rejects.toThrow('Tenant not found');
    });

    it('should handle deletion when tenant has active subscriptions', async () => {
      mockRestService.request.mockRejectedValue(new Error('Cannot delete tenant with active subscriptions'));

      await expect(service.delete('tenant-1')).rejects.toThrow('Cannot delete tenant with active subscriptions');
    });
  });

  describe('deleteDefaultConnectionString', () => {
    it('should delete default connection string', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.deleteDefaultConnectionString('tenant-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/saas/tenants/tenant-1/default-connection-string',
      });
    });

    it('should handle tenant not found', async () => {
      mockRestService.request.mockRejectedValue(new Error('Tenant not found'));

      await expect(service.deleteDefaultConnectionString('invalid')).rejects.toThrow('Tenant not found');
    });

    it('should handle no connection string to delete', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.deleteDefaultConnectionString('tenant-without-conn');

      expect(mockRestService.request).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should get a tenant by ID', async () => {
      mockRestService.request.mockResolvedValue(mockTenant);

      const result = await service.get('tenant-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/tenants/tenant-1',
      });
      expect(result).toEqual(mockTenant);
    });

    it('should return full tenant data with all fields', async () => {
      const fullTenant: SaasTenantDto = {
        id: 'tenant-full',
        name: 'Full Tenant',
        editionId: 'edition-1',
        editionName: 'Enterprise',
        concurrencyStamp: 'stamp-xyz',
        creationTime: new Date('2024-01-01'),
        creatorId: 'admin-user',
        extraProperties: { plan: 'annual' },
      };
      mockRestService.request.mockResolvedValue(fullTenant);

      const result = await service.get('tenant-full');

      expect(result.id).toBe('tenant-full');
      expect(result.name).toBe('Full Tenant');
      expect(result.editionName).toBe('Enterprise');
      expect(result.creatorId).toBe('admin-user');
    });

    it('should handle tenant not found', async () => {
      mockRestService.request.mockRejectedValue(new Error('Tenant not found'));

      await expect(service.get('invalid-id')).rejects.toThrow('Tenant not found');
    });
  });

  describe('getDefaultConnectionString', () => {
    it('should get default connection string', async () => {
      const connectionString = 'Server=db.example.com;Database=TenantDB;User=admin;Password=secret';
      mockRestService.request.mockResolvedValue(connectionString);

      const result = await service.getDefaultConnectionString('tenant-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/tenants/tenant-1/default-connection-string',
        responseType: 'text',
      });
      expect(result).toBe(connectionString);
    });

    it('should handle empty connection string', async () => {
      mockRestService.request.mockResolvedValue('');

      const result = await service.getDefaultConnectionString('tenant-1');

      expect(result).toBe('');
    });

    it('should handle tenant not found', async () => {
      mockRestService.request.mockRejectedValue(new Error('Tenant not found'));

      await expect(service.getDefaultConnectionString('invalid')).rejects.toThrow('Tenant not found');
    });
  });

  describe('getList', () => {
    it('should get tenants list with default params', async () => {
      mockRestService.request.mockResolvedValue(mockTenantsResponse);

      const result = await service.getList();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/tenants',
        params: {},
      });
      expect(result).toEqual(mockTenantsResponse);
    });

    it('should get tenants list with filter', async () => {
      const input: GetTenantsInput = { filter: 'Test' };
      mockRestService.request.mockResolvedValue(mockTenantsResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/tenants',
        params: { filter: 'Test' },
      });
    });

    it('should get tenants list with edition names', async () => {
      const input: GetTenantsInput = { getEditionNames: true };
      mockRestService.request.mockResolvedValue(mockTenantsResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/tenants',
        params: { getEditionNames: true },
      });
    });

    it('should get tenants list with pagination', async () => {
      const input: GetTenantsInput = {
        skipCount: 20,
        maxResultCount: 10,
      };
      mockRestService.request.mockResolvedValue(mockTenantsResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/tenants',
        params: { skipCount: 20, maxResultCount: 10 },
      });
    });

    it('should get tenants list with sorting', async () => {
      const input: GetTenantsInput = { sorting: 'name asc' };
      mockRestService.request.mockResolvedValue(mockTenantsResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/tenants',
        params: { sorting: 'name asc' },
      });
    });

    it('should get tenants list with all params', async () => {
      const input: GetTenantsInput = {
        filter: 'Enterprise',
        getEditionNames: true,
        skipCount: 0,
        maxResultCount: 100,
        sorting: 'creationTime desc',
      };
      mockRestService.request.mockResolvedValue(mockTenantsResponse);

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/tenants',
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
      const manyTenants = Array.from({ length: 100 }, (_, i) => ({
        ...mockTenant,
        id: `tenant-${i}`,
        name: `Tenant ${i}`,
      }));
      mockRestService.request.mockResolvedValue({
        items: manyTenants,
        totalCount: 1000,
      });

      const result = await service.getList({ maxResultCount: 100 });

      expect(result.items).toHaveLength(100);
      expect(result.totalCount).toBe(1000);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const input: SaasTenantUpdateDto = {
        name: 'Updated Tenant',
      };
      const updatedTenant = { ...mockTenant, name: 'Updated Tenant' };
      mockRestService.request.mockResolvedValue(updatedTenant);

      const result = await service.update('tenant-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/saas/tenants/tenant-1',
        body: input,
      });
      expect(result.name).toBe('Updated Tenant');
    });

    it('should update a tenant with new edition', async () => {
      const input: SaasTenantUpdateDto = {
        name: 'Upgraded Tenant',
        editionId: 'edition-premium',
      };
      const updatedTenant = { ...mockTenant, ...input, editionName: 'Premium' };
      mockRestService.request.mockResolvedValue(updatedTenant);

      const result = await service.update('tenant-1', input);

      expect(result.editionId).toBe('edition-premium');
    });

    it('should update a tenant with extra properties', async () => {
      const input: SaasTenantUpdateDto = {
        name: 'Custom Tenant',
        extraProperties: { maxUsers: 100, verified: true },
      };
      const updatedTenant = { ...mockTenant, ...input };
      mockRestService.request.mockResolvedValue(updatedTenant);

      const result = await service.update('tenant-1', input);

      expect(result.extraProperties).toEqual(input.extraProperties);
    });

    it('should handle update of non-existent tenant', async () => {
      const input: SaasTenantUpdateDto = { name: 'Updated' };
      mockRestService.request.mockRejectedValue(new Error('Tenant not found'));

      await expect(service.update('non-existent', input)).rejects.toThrow('Tenant not found');
    });

    it('should handle concurrency conflicts', async () => {
      const input: SaasTenantUpdateDto = { name: 'Updated' };
      mockRestService.request.mockRejectedValue(new Error('Concurrency conflict'));

      await expect(service.update('tenant-1', input)).rejects.toThrow('Concurrency conflict');
    });

    it('should handle duplicate name', async () => {
      const input: SaasTenantUpdateDto = { name: 'Existing Tenant Name' };
      mockRestService.request.mockRejectedValue(new Error('Tenant name already exists'));

      await expect(service.update('tenant-1', input)).rejects.toThrow('Tenant name already exists');
    });
  });

  describe('updateDefaultConnectionString', () => {
    it('should update default connection string', async () => {
      const connectionString = 'Server=newdb.example.com;Database=TenantDB;User=admin;Password=newsecret';
      mockRestService.request.mockResolvedValue(undefined);

      await service.updateDefaultConnectionString('tenant-1', connectionString);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/saas/tenants/tenant-1/default-connection-string',
        params: { defaultConnectionString: connectionString },
      });
    });

    it('should handle empty connection string', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.updateDefaultConnectionString('tenant-1', '');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/saas/tenants/tenant-1/default-connection-string',
        params: { defaultConnectionString: '' },
      });
    });

    it('should handle tenant not found', async () => {
      mockRestService.request.mockRejectedValue(new Error('Tenant not found'));

      await expect(
        service.updateDefaultConnectionString('invalid', 'connection-string')
      ).rejects.toThrow('Tenant not found');
    });

    it('should handle invalid connection string', async () => {
      mockRestService.request.mockRejectedValue(new Error('Invalid connection string format'));

      await expect(
        service.updateDefaultConnectionString('tenant-1', 'invalid-format')
      ).rejects.toThrow('Invalid connection string format');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in tenant ID', async () => {
      mockRestService.request.mockResolvedValue(mockTenant);

      await service.get('tenant-with-special-chars-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/saas/tenants/tenant-with-special-chars-123',
      });
    });

    it('should handle network errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Network error'));

      await expect(service.getList()).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Request timeout'));

      await expect(service.create({
        name: 'Test',
        adminEmailAddress: 'test@test.com',
        adminPassword: 'Test123!',
      })).rejects.toThrow('Request timeout');
    });

    it('should handle unauthorized errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Unauthorized'));

      await expect(service.update('tenant-1', { name: 'Test' })).rejects.toThrow('Unauthorized');
    });

    it('should handle forbidden errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Forbidden'));

      await expect(service.delete('tenant-1')).rejects.toThrow('Forbidden');
    });
  });
});
