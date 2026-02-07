import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  TenantManagementStateService,
  getTenantManagementStateService,
} from '../services/tenant-management-state.service';
import { TenantService } from '../proxy/tenant.service';
import type { TenantDto, TenantCreateDto } from '../proxy/models';
import type { PagedResultDto } from '@abpjs/core';

// Mock the TenantService
vi.mock('../proxy/tenant.service', () => ({
  TenantService: vi.fn().mockImplementation(() => ({
    getList: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  })),
}));

describe('TenantManagementStateService', () => {
  let service: TenantManagementStateService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new TenantManagementStateService();
  });

  describe('initial state', () => {
    it('should have empty tenants array initially', () => {
      expect(service.get()).toEqual([]);
    });

    it('should have zero total count initially', () => {
      expect(service.getTenantsTotalCount()).toBe(0);
    });
  });

  describe('get', () => {
    it('should return empty array when no tenants set', () => {
      expect(service.get()).toEqual([]);
    });

    it('should return tenants after setting them', () => {
      const tenants: TenantDto[] = [
        { id: '1', name: 'Tenant 1' },
        { id: '2', name: 'Tenant 2' },
      ];

      service.setTenants(tenants);
      expect(service.get()).toEqual(tenants);
    });

    it('should return a copy of tenants array', () => {
      const tenants: TenantDto[] = [{ id: '1', name: 'Tenant 1' }];
      service.setTenants(tenants);

      const result1 = service.get();
      const result2 = service.get();

      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2);
    });
  });

  describe('getTenantsTotalCount', () => {
    it('should return zero when no count set', () => {
      expect(service.getTenantsTotalCount()).toBe(0);
    });

    it('should return the set total count', () => {
      service.setTotalCount(100);
      expect(service.getTenantsTotalCount()).toBe(100);
    });

    it('should handle various count values', () => {
      service.setTotalCount(0);
      expect(service.getTenantsTotalCount()).toBe(0);

      service.setTotalCount(1);
      expect(service.getTenantsTotalCount()).toBe(1);

      service.setTotalCount(999);
      expect(service.getTenantsTotalCount()).toBe(999);
    });
  });

  describe('setTenants', () => {
    it('should set tenants', () => {
      const tenants: TenantDto[] = [
        { id: '1', name: 'Tenant 1' },
        { id: '2', name: 'Tenant 2' },
      ];

      service.setTenants(tenants);
      expect(service.get()).toEqual(tenants);
    });

    it('should notify subscribers when tenants are set', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      service.setTenants([{ id: '1', name: 'Tenant 1' }]);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should overwrite previous tenants', () => {
      service.setTenants([{ id: '1', name: 'Tenant 1' }]);
      service.setTenants([{ id: '2', name: 'Tenant 2' }]);

      expect(service.get()).toEqual([{ id: '2', name: 'Tenant 2' }]);
    });

    it('should create a copy of the input array', () => {
      const tenants: TenantDto[] = [{ id: '1', name: 'Tenant 1' }];
      service.setTenants(tenants);

      tenants.push({ id: '2', name: 'Tenant 2' });
      expect(service.get()).toHaveLength(1);
    });
  });

  describe('setTotalCount', () => {
    it('should set total count', () => {
      service.setTotalCount(50);
      expect(service.getTenantsTotalCount()).toBe(50);
    });

    it('should notify subscribers when count is set', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      service.setTotalCount(10);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should overwrite previous count', () => {
      service.setTotalCount(10);
      service.setTotalCount(20);

      expect(service.getTenantsTotalCount()).toBe(20);
    });
  });

  describe('reset', () => {
    it('should reset tenants to empty array', () => {
      service.setTenants([{ id: '1', name: 'Tenant 1' }]);
      expect(service.get()).toHaveLength(1);

      service.reset();
      expect(service.get()).toEqual([]);
    });

    it('should reset total count to zero', () => {
      service.setTotalCount(100);
      expect(service.getTenantsTotalCount()).toBe(100);

      service.reset();
      expect(service.getTenantsTotalCount()).toBe(0);
    });

    it('should notify subscribers when reset', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      service.reset();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should allow setting values again after reset', () => {
      service.setTenants([{ id: '1', name: 'Tenant 1' }]);
      service.setTotalCount(10);
      service.reset();

      service.setTenants([{ id: '2', name: 'Tenant 2' }]);
      service.setTotalCount(20);

      expect(service.get()).toEqual([{ id: '2', name: 'Tenant 2' }]);
      expect(service.getTenantsTotalCount()).toBe(20);
    });
  });

  describe('subscribe', () => {
    it('should add subscriber and call on changes', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      service.setTenants([{ id: '1', name: 'Tenant 1' }]);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = service.subscribe(callback);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should stop calling callback after unsubscribe', () => {
      const callback = vi.fn();
      const unsubscribe = service.subscribe(callback);

      service.setTenants([{ id: '1', name: 'Tenant 1' }]);
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();
      service.setTenants([{ id: '2', name: 'Tenant 2' }]);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should support multiple subscribers', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      service.subscribe(callback1);
      service.subscribe(callback2);
      service.subscribe(callback3);

      service.setTenants([{ id: '1', name: 'Tenant 1' }]);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it('should only unsubscribe the specific callback', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = service.subscribe(callback1);
      service.subscribe(callback2);

      service.setTenants([{ id: '1', name: 'Tenant 1' }]);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      unsubscribe1();
      service.setTenants([{ id: '2', name: 'Tenant 2' }]);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(2);
    });
  });

  describe('constructor with TenantService (v4.0.0)', () => {
    it('should accept TenantService in constructor', () => {
      const mockTenantService = {
        getList: vi.fn(),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);
      expect(stateService).toBeInstanceOf(TenantManagementStateService);
    });

    it('should work without TenantService', () => {
      const stateService = new TenantManagementStateService();
      expect(stateService).toBeInstanceOf(TenantManagementStateService);
    });

    it('should work with undefined TenantService', () => {
      const stateService = new TenantManagementStateService(undefined);
      expect(stateService).toBeInstanceOf(TenantManagementStateService);
    });
  });

  describe('dispatchGetTenants (v4.0.0)', () => {
    it('should throw error when TenantService is not provided', async () => {
      const stateService = new TenantManagementStateService();

      await expect(stateService.dispatchGetTenants()).rejects.toThrow(
        'TenantService is required for dispatchGetTenants. Pass it to the constructor.'
      );
    });

    it('should call getList and update internal state', async () => {
      const mockResponse: PagedResultDto<TenantDto> = {
        items: [
          { id: '1', name: 'Tenant A' },
          { id: '2', name: 'Tenant B' },
        ],
        totalCount: 2,
      };

      const mockTenantService = {
        getList: vi.fn().mockResolvedValue(mockResponse),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      const result = await stateService.dispatchGetTenants();

      expect(mockTenantService.getList).toHaveBeenCalledWith({
        filter: '',
        maxResultCount: 10,
        skipCount: 0,
      });
      expect(result).toEqual(mockResponse);
      expect(stateService.get()).toEqual(mockResponse.items);
      expect(stateService.getTenantsTotalCount()).toBe(2);
    });

    it('should pass query params to getList', async () => {
      const mockResponse: PagedResultDto<TenantDto> = {
        items: [],
        totalCount: 0,
      };

      const mockTenantService = {
        getList: vi.fn().mockResolvedValue(mockResponse),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      await stateService.dispatchGetTenants({ skipCount: 10, maxResultCount: 20 });

      expect(mockTenantService.getList).toHaveBeenCalledWith({
        filter: '',
        skipCount: 10,
        maxResultCount: 20,
      });
    });

    it('should handle API errors', async () => {
      const mockTenantService = {
        getList: vi.fn().mockRejectedValue(new Error('API Error')),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      await expect(stateService.dispatchGetTenants()).rejects.toThrow('API Error');
    });

    it('should handle response with undefined items and totalCount', async () => {
      const mockResponse: PagedResultDto<TenantDto> = {
        items: undefined,
        totalCount: undefined,
      };

      const mockTenantService = {
        getList: vi.fn().mockResolvedValue(mockResponse),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      const result = await stateService.dispatchGetTenants();

      expect(result).toEqual(mockResponse);
      expect(stateService.get()).toEqual([]);
      expect(stateService.getTenantsTotalCount()).toBe(0);
    });
  });

  describe('dispatchGetTenantById (v4.0.0)', () => {
    it('should throw error when TenantService is not provided', async () => {
      const stateService = new TenantManagementStateService();

      await expect(stateService.dispatchGetTenantById('tenant-id')).rejects.toThrow(
        'TenantService is required for dispatchGetTenantById. Pass it to the constructor.'
      );
    });

    it('should call get and return tenant', async () => {
      const mockTenant: TenantDto = { id: '1', name: 'Tenant A' };

      const mockTenantService = {
        getList: vi.fn(),
        get: vi.fn().mockResolvedValue(mockTenant),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      const result = await stateService.dispatchGetTenantById('1');

      expect(mockTenantService.get).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTenant);
    });

    it('should handle API errors', async () => {
      const mockTenantService = {
        getList: vi.fn(),
        get: vi.fn().mockRejectedValue(new Error('Tenant not found')),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      await expect(stateService.dispatchGetTenantById('invalid-id')).rejects.toThrow('Tenant not found');
    });
  });

  describe('dispatchCreateTenant (v4.0.0)', () => {
    const validCreateInput: TenantCreateDto = {
      name: 'New Tenant',
      adminEmailAddress: 'admin@newtenant.com',
      adminPassword: 'Password123!',
    };

    it('should throw error when TenantService is not provided', async () => {
      const stateService = new TenantManagementStateService();

      await expect(stateService.dispatchCreateTenant(validCreateInput)).rejects.toThrow(
        'TenantService is required for dispatchCreateTenant. Pass it to the constructor.'
      );
    });

    it('should call create and refresh tenant list', async () => {
      const createdTenant: TenantDto = { id: '3', name: 'New Tenant' };
      const refreshedResponse: PagedResultDto<TenantDto> = {
        items: [
          { id: '1', name: 'Tenant A' },
          { id: '2', name: 'Tenant B' },
          { id: '3', name: 'New Tenant' },
        ],
        totalCount: 3,
      };

      const mockTenantService = {
        getList: vi.fn().mockResolvedValue(refreshedResponse),
        get: vi.fn(),
        create: vi.fn().mockResolvedValue(createdTenant),
        update: vi.fn(),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      const result = await stateService.dispatchCreateTenant(validCreateInput);

      expect(mockTenantService.create).toHaveBeenCalledWith(validCreateInput);
      expect(mockTenantService.getList).toHaveBeenCalled();
      expect(result).toEqual(createdTenant);
      expect(stateService.get()).toHaveLength(3);
    });

    it('should handle API errors during creation', async () => {
      const mockTenantService = {
        getList: vi.fn(),
        get: vi.fn(),
        create: vi.fn().mockRejectedValue(new Error('Creation failed')),
        update: vi.fn(),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      await expect(stateService.dispatchCreateTenant(validCreateInput)).rejects.toThrow('Creation failed');
      expect(mockTenantService.getList).not.toHaveBeenCalled();
    });
  });

  describe('dispatchUpdateTenant (v4.0.0)', () => {
    it('should throw error when TenantService is not provided', async () => {
      const stateService = new TenantManagementStateService();

      await expect(stateService.dispatchUpdateTenant('1', { name: 'Updated' })).rejects.toThrow(
        'TenantService is required for dispatchUpdateTenant. Pass it to the constructor.'
      );
    });

    it('should call update with id and input, then refresh tenant list', async () => {
      const updatedTenant: TenantDto = { id: '1', name: 'Updated Tenant' };
      const refreshedResponse: PagedResultDto<TenantDto> = {
        items: [
          { id: '1', name: 'Updated Tenant' },
          { id: '2', name: 'Tenant B' },
        ],
        totalCount: 2,
      };

      const mockTenantService = {
        getList: vi.fn().mockResolvedValue(refreshedResponse),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn().mockResolvedValue(updatedTenant),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      const result = await stateService.dispatchUpdateTenant('1', { name: 'Updated Tenant' });

      expect(mockTenantService.update).toHaveBeenCalledWith('1', { name: 'Updated Tenant' });
      expect(mockTenantService.getList).toHaveBeenCalled();
      expect(result).toEqual(updatedTenant);
      expect(stateService.get()[0].name).toBe('Updated Tenant');
    });

    it('should handle API errors during update', async () => {
      const mockTenantService = {
        getList: vi.fn(),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn().mockRejectedValue(new Error('Update failed')),
        delete: vi.fn(),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      await expect(stateService.dispatchUpdateTenant('1', { name: 'Updated' })).rejects.toThrow('Update failed');
      expect(mockTenantService.getList).not.toHaveBeenCalled();
    });
  });

  describe('dispatchDeleteTenant (v4.0.0)', () => {
    it('should throw error when TenantService is not provided', async () => {
      const stateService = new TenantManagementStateService();

      await expect(stateService.dispatchDeleteTenant('1')).rejects.toThrow(
        'TenantService is required for dispatchDeleteTenant. Pass it to the constructor.'
      );
    });

    it('should call delete and refresh tenant list', async () => {
      const refreshedResponse: PagedResultDto<TenantDto> = {
        items: [{ id: '2', name: 'Tenant B' }],
        totalCount: 1,
      };

      const mockTenantService = {
        getList: vi.fn().mockResolvedValue(refreshedResponse),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn().mockResolvedValue(undefined),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      await stateService.dispatchDeleteTenant('1');

      expect(mockTenantService.delete).toHaveBeenCalledWith('1');
      expect(mockTenantService.getList).toHaveBeenCalled();
      expect(stateService.get()).toHaveLength(1);
      expect(stateService.getTenantsTotalCount()).toBe(1);
    });

    it('should handle API errors during deletion', async () => {
      const mockTenantService = {
        getList: vi.fn(),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn().mockRejectedValue(new Error('Deletion failed')),
      } as unknown as TenantService;

      const stateService = new TenantManagementStateService(mockTenantService);

      await expect(stateService.dispatchDeleteTenant('1')).rejects.toThrow('Deletion failed');
      expect(mockTenantService.getList).not.toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical usage flow', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      // Initial state
      expect(service.get()).toEqual([]);
      expect(service.getTenantsTotalCount()).toBe(0);

      // Set tenants and total count directly
      service.setTenants([
        { id: '1', name: 'Tenant A' },
        { id: '2', name: 'Tenant B' },
      ]);
      service.setTotalCount(50);
      expect(callback).toHaveBeenCalledTimes(2);

      // Verify data
      expect(service.get()).toHaveLength(2);
      expect(service.getTenantsTotalCount()).toBe(50);

      // Reset for refresh
      service.reset();
      expect(callback).toHaveBeenCalledTimes(3);

      expect(service.get()).toEqual([]);
      expect(service.getTenantsTotalCount()).toBe(0);
    });
  });
});

describe('getTenantManagementStateService', () => {
  it('should return a TenantManagementStateService instance', () => {
    const service = getTenantManagementStateService();
    expect(service).toBeInstanceOf(TenantManagementStateService);
  });

  it('should return the same instance on multiple calls (singleton)', () => {
    const service1 = getTenantManagementStateService();
    const service2 = getTenantManagementStateService();
    expect(service1).toBe(service2);
  });
});
