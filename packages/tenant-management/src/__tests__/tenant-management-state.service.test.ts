import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  TenantManagementStateService,
  getTenantManagementStateService,
} from '../services/tenant-management-state.service';
import type { TenantManagement } from '../models';

describe('TenantManagementStateService', () => {
  let service: TenantManagementStateService;

  beforeEach(() => {
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
      const tenants = [
        { id: '1', name: 'Tenant 1' },
        { id: '2', name: 'Tenant 2' },
      ];

      service.setTenants(tenants);
      expect(service.get()).toEqual(tenants);
    });

    it('should return a copy of tenants array', () => {
      const tenants = [{ id: '1', name: 'Tenant 1' }];
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
      const tenants = [
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
      const tenants = [{ id: '1', name: 'Tenant 1' }];
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

  describe('updateFromResponse', () => {
    it('should update tenants and total count from response', () => {
      const response: TenantManagement.Response = {
        items: [
          { id: '1', name: 'Tenant 1' },
          { id: '2', name: 'Tenant 2' },
        ],
        totalCount: 2,
      };

      service.updateFromResponse(response);

      expect(service.get()).toEqual(response.items);
      expect(service.getTenantsTotalCount()).toBe(2);
    });

    it('should notify subscribers when updated from response', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      const response: TenantManagement.Response = {
        items: [{ id: '1', name: 'Tenant 1' }],
        totalCount: 1,
      };

      service.updateFromResponse(response);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should handle empty response', () => {
      const response: TenantManagement.Response = {
        items: [],
        totalCount: 0,
      };

      service.updateFromResponse(response);

      expect(service.get()).toEqual([]);
      expect(service.getTenantsTotalCount()).toBe(0);
    });

    it('should handle response with many items', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: String(i + 1),
        name: `Tenant ${i + 1}`,
      }));

      const response: TenantManagement.Response = {
        items,
        totalCount: 500,
      };

      service.updateFromResponse(response);

      expect(service.get()).toHaveLength(100);
      expect(service.getTenantsTotalCount()).toBe(500);
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

  describe('integration scenarios', () => {
    it('should handle typical usage flow', () => {
      const callback = vi.fn();
      service.subscribe(callback);

      // Initial state
      expect(service.get()).toEqual([]);
      expect(service.getTenantsTotalCount()).toBe(0);

      // Load data from response
      const response: TenantManagement.Response = {
        items: [
          { id: '1', name: 'Tenant A' },
          { id: '2', name: 'Tenant B' },
        ],
        totalCount: 50,
      };
      service.updateFromResponse(response);
      expect(callback).toHaveBeenCalledTimes(1);

      // Verify data
      expect(service.get()).toHaveLength(2);
      expect(service.getTenantsTotalCount()).toBe(50);

      // Reset for refresh
      service.reset();
      expect(callback).toHaveBeenCalledTimes(2);

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
