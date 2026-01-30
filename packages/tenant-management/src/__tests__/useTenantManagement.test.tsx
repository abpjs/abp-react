import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { TenantManagement } from '../models';

// Create mock functions
const mockGetAll = vi.fn();
const mockGetById = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockGetDefaultConnectionString = vi.fn();
const mockUpdateDefaultConnectionString = vi.fn();
const mockDeleteDefaultConnectionString = vi.fn();

// Mock the service
vi.mock('../services', () => ({
  TenantManagementService: vi.fn().mockImplementation(() => ({
    getAll: mockGetAll,
    getById: mockGetById,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    getDefaultConnectionString: mockGetDefaultConnectionString,
    updateDefaultConnectionString: mockUpdateDefaultConnectionString,
    deleteDefaultConnectionString: mockDeleteDefaultConnectionString,
  })),
}));

// Mock @abpjs/core
const mockRestService = {};
vi.mock('@abpjs/core', () => ({
  useRestService: () => mockRestService,
}));

// Import hook after mocks are set up
import { useTenantManagement } from '../hooks/useTenantManagement';

describe('useTenantManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state with empty tenants array', () => {
      const { result } = renderHook(() => useTenantManagement());

      expect(result.current.tenants).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.selectedTenant).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.defaultConnectionString).toBe('');
      expect(result.current.useSharedDatabase).toBe(true);
    });

    it('should provide all expected methods', () => {
      const { result } = renderHook(() => useTenantManagement());

      expect(typeof result.current.fetchTenants).toBe('function');
      expect(typeof result.current.fetchTenantById).toBe('function');
      expect(typeof result.current.createTenant).toBe('function');
      expect(typeof result.current.updateTenant).toBe('function');
      expect(typeof result.current.deleteTenant).toBe('function');
      expect(typeof result.current.fetchConnectionString).toBe('function');
      expect(typeof result.current.updateConnectionString).toBe('function');
      expect(typeof result.current.deleteConnectionString).toBe('function');
      expect(typeof result.current.setSelectedTenant).toBe('function');
      expect(typeof result.current.setUseSharedDatabase).toBe('function');
      expect(typeof result.current.setDefaultConnectionString).toBe('function');
      expect(typeof result.current.setSortKey).toBe('function');
      expect(typeof result.current.setSortOrder).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('should return initial sorting state (v1.0.0)', () => {
      const { result } = renderHook(() => useTenantManagement());

      expect(result.current.sortKey).toBe('name');
      expect(result.current.sortOrder).toBe('');
    });
  });

  describe('fetchTenants', () => {
    it('should fetch tenants without params', async () => {
      const mockResponse: TenantManagement.Response = {
        items: [{ id: '1', name: 'Tenant 1' }, { id: '2', name: 'Tenant 2' }],
        totalCount: 2,
      };
      mockGetAll.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.fetchTenants();
        expect(response.success).toBe(true);
      });

      expect(result.current.tenants).toEqual(mockResponse.items);
      expect(result.current.totalCount).toBe(2);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should fetch tenants with pagination params (v0.9.0 feature)', async () => {
      const mockResponse: TenantManagement.Response = {
        items: [{ id: '3', name: 'Tenant 3' }],
        totalCount: 10,
      };
      mockGetAll.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useTenantManagement());

      const params = { skipCount: 2, maxResultCount: 1 };
      await act(async () => {
        await result.current.fetchTenants(params);
      });

      expect(mockGetAll).toHaveBeenCalledWith(params);
      expect(result.current.tenants).toEqual(mockResponse.items);
      expect(result.current.totalCount).toBe(10);
    });

    it('should fetch tenants with filter param (v0.9.0 feature)', async () => {
      const mockResponse: TenantManagement.Response = {
        items: [{ id: '1', name: 'Filtered Tenant' }],
        totalCount: 1,
      };
      mockGetAll.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useTenantManagement());

      const params = { filter: 'Filtered' };
      await act(async () => {
        await result.current.fetchTenants(params);
      });

      expect(mockGetAll).toHaveBeenCalledWith(params);
      expect(result.current.tenants).toHaveLength(1);
    });

    it('should set loading state while fetching', async () => {
      let resolvePromise: (value: TenantManagement.Response) => void;
      const pendingPromise = new Promise<TenantManagement.Response>((resolve) => {
        resolvePromise = resolve;
      });
      mockGetAll.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => useTenantManagement());

      act(() => {
        result.current.fetchTenants();
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!({ items: [], totalCount: 0 });
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle fetch error', async () => {
      mockGetAll.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.fetchTenants();
        expect(response.success).toBe(false);
        expect(response.error).toBe('Network error');
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle non-Error rejection', async () => {
      mockGetAll.mockRejectedValue('String error');

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.fetchTenants();
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to fetch tenants');
      });
    });
  });

  describe('fetchTenantById', () => {
    it('should fetch tenant by id and set as selected', async () => {
      const mockTenant: TenantManagement.Item = { id: '123', name: 'Test Tenant' };
      mockGetById.mockResolvedValue(mockTenant);

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.fetchTenantById('123');
        expect(response.success).toBe(true);
      });

      expect(result.current.selectedTenant).toEqual(mockTenant);
    });

    it('should handle error when fetching by id', async () => {
      mockGetById.mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.fetchTenantById('non-existent');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Not found');
      });
    });
  });

  describe('createTenant', () => {
    it('should create tenant and refresh list', async () => {
      const newTenant: TenantManagement.AddRequest = { name: 'New Tenant' };
      mockCreate.mockResolvedValue({ id: '456', name: 'New Tenant' });
      mockGetAll.mockResolvedValue({
        items: [{ id: '456', name: 'New Tenant' }],
        totalCount: 1,
      });

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.createTenant(newTenant);
        expect(response.success).toBe(true);
      });

      expect(mockCreate).toHaveBeenCalledWith(newTenant);
      expect(mockGetAll).toHaveBeenCalled();
    });

    it('should handle create error', async () => {
      mockCreate.mockRejectedValue(new Error('Validation failed'));

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.createTenant({ name: '' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Validation failed');
      });
    });
  });

  describe('updateTenant', () => {
    it('should update tenant and refresh list', async () => {
      const updateRequest: TenantManagement.UpdateRequest = { id: '123', name: 'Updated Tenant' };
      mockUpdate.mockResolvedValue({ id: '123', name: 'Updated Tenant' });
      mockGetAll.mockResolvedValue({
        items: [{ id: '123', name: 'Updated Tenant' }],
        totalCount: 1,
      });

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.updateTenant(updateRequest);
        expect(response.success).toBe(true);
      });

      expect(mockUpdate).toHaveBeenCalledWith(updateRequest);
    });

    it('should handle update error', async () => {
      mockUpdate.mockRejectedValue(new Error('Concurrency conflict'));

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.updateTenant({ id: '123', name: 'Test' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Concurrency conflict');
      });
    });
  });

  describe('deleteTenant', () => {
    it('should delete tenant and refresh list', async () => {
      mockDelete.mockResolvedValue(undefined);
      mockGetAll.mockResolvedValue({ items: [], totalCount: 0 });

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.deleteTenant('123');
        expect(response.success).toBe(true);
      });

      expect(mockDelete).toHaveBeenCalledWith('123');
    });

    it('should handle delete error', async () => {
      mockDelete.mockRejectedValue(new Error('Cannot delete tenant'));

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.deleteTenant('123');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Cannot delete tenant');
      });
    });
  });

  describe('connection string operations', () => {
    it('should fetch connection string', async () => {
      mockGetDefaultConnectionString.mockResolvedValue('Server=localhost;Database=TenantDb');

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.fetchConnectionString('123');
        expect(response.success).toBe(true);
      });

      expect(result.current.defaultConnectionString).toBe('Server=localhost;Database=TenantDb');
      expect(result.current.useSharedDatabase).toBe(false);
    });

    it('should set useSharedDatabase to true when connection string is empty', async () => {
      mockGetDefaultConnectionString.mockResolvedValue('');

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        await result.current.fetchConnectionString('123');
      });

      expect(result.current.defaultConnectionString).toBe('');
      expect(result.current.useSharedDatabase).toBe(true);
    });

    it('should update connection string', async () => {
      mockUpdateDefaultConnectionString.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.updateConnectionString('123', 'Server=new;Database=Db');
        expect(response.success).toBe(true);
      });

      expect(result.current.defaultConnectionString).toBe('Server=new;Database=Db');
      expect(result.current.useSharedDatabase).toBe(false);
    });

    it('should delete connection string', async () => {
      mockDeleteDefaultConnectionString.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTenantManagement());

      await act(async () => {
        const response = await result.current.deleteConnectionString('123');
        expect(response.success).toBe(true);
      });

      expect(result.current.defaultConnectionString).toBe('');
      expect(result.current.useSharedDatabase).toBe(true);
    });
  });

  describe('state setters', () => {
    it('should set selected tenant', () => {
      const { result } = renderHook(() => useTenantManagement());

      act(() => {
        result.current.setSelectedTenant({ id: '123', name: 'Test' });
      });

      expect(result.current.selectedTenant).toEqual({ id: '123', name: 'Test' });
    });

    it('should set use shared database', () => {
      const { result } = renderHook(() => useTenantManagement());

      act(() => {
        result.current.setUseSharedDatabase(false);
      });

      expect(result.current.useSharedDatabase).toBe(false);
    });

    it('should set default connection string', () => {
      const { result } = renderHook(() => useTenantManagement());

      act(() => {
        result.current.setDefaultConnectionString('Server=test');
      });

      expect(result.current.defaultConnectionString).toBe('Server=test');
    });

    it('should set sort key (v1.0.0)', () => {
      const { result } = renderHook(() => useTenantManagement());

      act(() => {
        result.current.setSortKey('id');
      });

      expect(result.current.sortKey).toBe('id');
    });

    it('should set sort order to asc (v1.0.0)', () => {
      const { result } = renderHook(() => useTenantManagement());

      act(() => {
        result.current.setSortOrder('asc');
      });

      expect(result.current.sortOrder).toBe('asc');
    });

    it('should set sort order to desc (v1.0.0)', () => {
      const { result } = renderHook(() => useTenantManagement());

      act(() => {
        result.current.setSortOrder('desc');
      });

      expect(result.current.sortOrder).toBe('desc');
    });

    it('should clear sort order (v1.0.0)', () => {
      const { result } = renderHook(() => useTenantManagement());

      // First set a sort order
      act(() => {
        result.current.setSortOrder('asc');
      });
      expect(result.current.sortOrder).toBe('asc');

      // Then clear it
      act(() => {
        result.current.setSortOrder('');
      });
      expect(result.current.sortOrder).toBe('');
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      mockGetAll.mockResolvedValue({
        items: [{ id: '1', name: 'Tenant' }],
        totalCount: 1,
      });

      const { result } = renderHook(() => useTenantManagement());

      // Populate state
      await act(async () => {
        await result.current.fetchTenants();
        result.current.setSelectedTenant({ id: '1', name: 'Tenant' });
        result.current.setDefaultConnectionString('Server=test');
        result.current.setUseSharedDatabase(false);
      });

      // Verify state is populated
      expect(result.current.tenants.length).toBe(1);
      expect(result.current.selectedTenant).not.toBeNull();

      // Reset
      act(() => {
        result.current.reset();
      });

      // Verify reset
      expect(result.current.tenants).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.selectedTenant).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.defaultConnectionString).toBe('');
      expect(result.current.useSharedDatabase).toBe(true);
    });
  });

  describe('sorting (v1.0.0)', () => {
    it('should change sort key and order together', () => {
      const { result } = renderHook(() => useTenantManagement());

      act(() => {
        result.current.setSortKey('createdAt');
        result.current.setSortOrder('desc');
      });

      expect(result.current.sortKey).toBe('createdAt');
      expect(result.current.sortOrder).toBe('desc');
    });

    it('should maintain sort state independently of other state changes', async () => {
      mockGetAll.mockResolvedValue({
        items: [{ id: '1', name: 'Tenant' }],
        totalCount: 1,
      });

      const { result } = renderHook(() => useTenantManagement());

      // Set sort state
      act(() => {
        result.current.setSortKey('id');
        result.current.setSortOrder('asc');
      });

      // Fetch tenants
      await act(async () => {
        await result.current.fetchTenants();
      });

      // Sort state should be maintained
      expect(result.current.sortKey).toBe('id');
      expect(result.current.sortOrder).toBe('asc');
      expect(result.current.tenants).toHaveLength(1);
    });

    it('should allow toggling sort order between asc, desc, and empty', () => {
      const { result } = renderHook(() => useTenantManagement());

      // Initial state
      expect(result.current.sortOrder).toBe('');

      // Set to asc
      act(() => {
        result.current.setSortOrder('asc');
      });
      expect(result.current.sortOrder).toBe('asc');

      // Toggle to desc
      act(() => {
        result.current.setSortOrder('desc');
      });
      expect(result.current.sortOrder).toBe('desc');

      // Clear sort order
      act(() => {
        result.current.setSortOrder('');
      });
      expect(result.current.sortOrder).toBe('');
    });
  });
});
