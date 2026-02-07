import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MultiTenancyService } from './multi-tenancy.service';
import type { RestService } from './rest.service';

describe('MultiTenancyService (v3.1.0)', () => {
  let service: MultiTenancyService;
  let mockRestService: RestService;

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    } as unknown as RestService;

    service = new MultiTenancyService(mockRestService);
  });

  describe('initial state', () => {
    it('should have isTenantBoxVisible set to true by default', () => {
      expect(service.isTenantBoxVisible).toBe(true);
    });

    it('should have apiName set to "default" by default', () => {
      expect(service.apiName).toBe('default');
    });

    it('should have domainTenant set to null by default', () => {
      expect(service.domainTenant).toBeNull();
    });
  });

  describe('isTenantBoxVisible', () => {
    it('should be settable to false', () => {
      service.isTenantBoxVisible = false;
      expect(service.isTenantBoxVisible).toBe(false);
    });

    it('should be settable to true', () => {
      service.isTenantBoxVisible = false;
      service.isTenantBoxVisible = true;
      expect(service.isTenantBoxVisible).toBe(true);
    });
  });

  describe('apiName', () => {
    it('should be settable to custom value', () => {
      service.apiName = 'custom-api';
      expect(service.apiName).toBe('custom-api');
    });
  });

  describe('domainTenant', () => {
    it('should set and get domain tenant', () => {
      const tenant = { id: 'tenant-123', name: 'Test Tenant' };
      service.domainTenant = tenant;

      expect(service.domainTenant).toEqual(tenant);
    });

    it('should allow setting domain tenant to null', () => {
      service.domainTenant = { id: 'tenant-123', name: 'Test' };
      service.domainTenant = null;

      expect(service.domainTenant).toBeNull();
    });
  });

  describe('findTenantByName', () => {
    it('should call restService with correct parameters', async () => {
      const mockResponse = { success: true, name: 'TestTenant', tenantId: 'id-123' };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.findTenantByName('TestTenant');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/abp/multi-tenancy/tenants/by-name/TestTenant',
        headers: undefined,
      });
    });

    it('should return FindTenantResultDto on success', async () => {
      const mockResponse = { success: true, name: 'TestTenant', tenantId: 'id-123' };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.findTenantByName('TestTenant');

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result.name).toBe('TestTenant');
      expect(result.tenantId).toBe('id-123');
    });

    it('should handle tenant not found', async () => {
      const mockResponse = { success: false, name: '', tenantId: undefined };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.findTenantByName('NonExistent');

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(false);
      expect(result.name).toBe('');
      expect(result.tenantId).toBeUndefined();
    });

    it('should pass custom headers to request', async () => {
      const mockResponse = { success: true, name: 'Test', tenantId: 'id' };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const customHeaders = { 'X-Custom-Header': 'custom-value' };
      await service.findTenantByName('Test', customHeaders);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/abp/multi-tenancy/tenants/by-name/Test',
        headers: customHeaders,
      });
    });

    it('should handle tenant name with special characters', async () => {
      const mockResponse = { success: true, name: 'Tenant With Spaces', tenantId: 'id' };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.findTenantByName('Tenant With Spaces');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/abp/multi-tenancy/tenants/by-name/Tenant With Spaces',
        headers: undefined,
      });
    });

    it('should propagate errors from restService', async () => {
      const error = new Error('Network error');
      vi.mocked(mockRestService.request).mockRejectedValue(error);

      await expect(service.findTenantByName('Test')).rejects.toThrow('Network error');
    });
  });

  describe('findTenantById', () => {
    it('should call restService with correct parameters', async () => {
      const mockResponse = { success: true, name: 'TestTenant', tenantId: 'id-123' };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.findTenantById('id-123');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/abp/multi-tenancy/tenants/by-id/id-123',
        headers: undefined,
      });
    });

    it('should return FindTenantResultDto on success', async () => {
      const mockResponse = { success: true, name: 'TestTenant', tenantId: 'id-123' };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.findTenantById('id-123');

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(result.name).toBe('TestTenant');
      expect(result.tenantId).toBe('id-123');
    });

    it('should handle tenant not found', async () => {
      const mockResponse = { success: false, name: '', tenantId: undefined };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const result = await service.findTenantById('non-existent-id');

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(false);
    });

    it('should pass custom headers to request', async () => {
      const mockResponse = { success: true, name: 'Test', tenantId: 'id' };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      const customHeaders = { Authorization: 'Bearer token' };
      await service.findTenantById('id', customHeaders);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/abp/multi-tenancy/tenants/by-id/id',
        headers: customHeaders,
      });
    });

    it('should handle GUID format tenant id', async () => {
      const tenantId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
      const mockResponse = { success: true, name: 'Test', tenantId };
      vi.mocked(mockRestService.request).mockResolvedValue(mockResponse);

      await service.findTenantById(tenantId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: `/api/abp/multi-tenancy/tenants/by-id/${tenantId}`,
        headers: undefined,
      });
    });

    it('should propagate errors from restService', async () => {
      const error = new Error('Server error');
      vi.mocked(mockRestService.request).mockRejectedValue(error);

      await expect(service.findTenantById('id')).rejects.toThrow('Server error');
    });
  });

  describe('integration scenarios', () => {
    it('should support tenant switch workflow', async () => {
      // First, find tenant by name
      const nameResponse = { success: true, name: 'NewTenant', tenantId: 'new-id' };
      vi.mocked(mockRestService.request).mockResolvedValue(nameResponse);

      const result = await service.findTenantByName('NewTenant');

      expect(result.success).toBe(true);
      expect(result.tenantId).toBe('new-id');

      // Then set as domain tenant
      service.domainTenant = { id: result.tenantId!, name: result.name };

      expect(service.domainTenant).toEqual({ id: 'new-id', name: 'NewTenant' });
    });

    it('should support clearing tenant', async () => {
      service.domainTenant = { id: 'tenant-id', name: 'Tenant' };

      // Clear tenant
      service.domainTenant = null;

      expect(service.domainTenant).toBeNull();
    });
  });
});
