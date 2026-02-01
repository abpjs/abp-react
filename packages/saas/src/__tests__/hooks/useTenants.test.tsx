import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTenants } from '../../hooks/useTenants';

// Mock SaasService
const mockGetTenants = vi.fn();
const mockGetTenantById = vi.fn();
const mockCreateTenant = vi.fn();
const mockUpdateTenant = vi.fn();
const mockDeleteTenant = vi.fn();
const mockGetDefaultConnectionString = vi.fn();
const mockUpdateDefaultConnectionString = vi.fn();
const mockDeleteDefaultConnectionString = vi.fn();

vi.mock('../../services', () => ({
  SaasService: vi.fn().mockImplementation(() => ({
    getTenants: mockGetTenants,
    getTenantById: mockGetTenantById,
    createTenant: mockCreateTenant,
    updateTenant: mockUpdateTenant,
    deleteTenant: mockDeleteTenant,
    getDefaultConnectionString: mockGetDefaultConnectionString,
    updateDefaultConnectionString: mockUpdateDefaultConnectionString,
    deleteDefaultConnectionString: mockDeleteDefaultConnectionString,
  })),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({})),
}));

describe('useTenants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenants.mockReset();
    mockGetTenantById.mockReset();
    mockCreateTenant.mockReset();
    mockUpdateTenant.mockReset();
    mockDeleteTenant.mockReset();
    mockGetDefaultConnectionString.mockReset();
    mockUpdateDefaultConnectionString.mockReset();
    mockDeleteDefaultConnectionString.mockReset();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useTenants());

    expect(result.current.tenants).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.selectedTenant).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.sortKey).toBe('name');
    expect(result.current.sortOrder).toBe('');
    expect(result.current.defaultConnectionString).toBe('');
    expect(result.current.useSharedDatabase).toBe(true);
    // v2.2.0 features modal state
    expect(result.current.visibleFeatures).toBe(false);
    expect(result.current.featuresProviderKey).toBe('');
  });

  describe('fetchTenants', () => {
    it('should fetch tenants successfully', async () => {
      const mockTenants = {
        items: [
          { id: 'tenant-1', name: 'Tenant One', editionId: 'ed-1', editionName: 'Basic' },
          { id: 'tenant-2', name: 'Tenant Two', editionId: 'ed-2', editionName: 'Pro' },
        ],
        totalCount: 2,
      };
      mockGetTenants.mockResolvedValue(mockTenants);

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.fetchTenants();
        expect(response.success).toBe(true);
      });

      expect(result.current.tenants).toEqual(mockTenants.items);
      expect(result.current.totalCount).toBe(2);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle fetch tenants error', async () => {
      mockGetTenants.mockRejectedValue(new Error('Failed to fetch tenants'));

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.fetchTenants();
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to fetch tenants');
      });

      expect(result.current.error).toBe('Failed to fetch tenants');
      expect(result.current.isLoading).toBe(false);
    });

    it('should pass query parameters', async () => {
      mockGetTenants.mockResolvedValue({ items: [], totalCount: 0 });

      const { result } = renderHook(() => useTenants());
      const params = { skipCount: 0, maxResultCount: 10, filter: 'test', getEditionNames: true };

      await act(async () => {
        await result.current.fetchTenants(params);
      });

      expect(mockGetTenants).toHaveBeenCalledWith(params);
    });
  });

  describe('getTenantById', () => {
    it('should get tenant by ID', async () => {
      const mockTenant = { id: 'tenant-1', name: 'Tenant One', editionId: 'ed-1', concurrencyStamp: 'stamp1' };
      mockGetTenantById.mockResolvedValue(mockTenant);

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.getTenantById('tenant-1');
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockTenant);
      });

      expect(result.current.selectedTenant).toEqual(mockTenant);
    });

    it('should handle get tenant by ID error', async () => {
      mockGetTenantById.mockRejectedValue(new Error('Tenant not found'));

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.getTenantById('invalid-id');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Tenant not found');
      });

      expect(result.current.error).toBe('Tenant not found');
    });
  });

  describe('createTenant', () => {
    it('should create tenant successfully', async () => {
      const newTenant = { name: 'New Tenant', editionId: 'ed-1', adminEmailAddress: 'admin@test.com', adminPassword: 'Pass123!' };
      const createdTenant = { id: 'new-tenant-id', name: 'New Tenant', editionId: 'ed-1', concurrencyStamp: 'stamp' };
      mockCreateTenant.mockResolvedValue(createdTenant);

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.createTenant(newTenant);
        expect(response.success).toBe(true);
        expect(response.data).toEqual(createdTenant);
      });

      expect(mockCreateTenant).toHaveBeenCalledWith(newTenant);
    });

    it('should handle create tenant error', async () => {
      mockCreateTenant.mockRejectedValue(new Error('Creation failed'));

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.createTenant({ name: 'Test', adminEmailAddress: 'admin@test.com', adminPassword: 'Pass123!' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Creation failed');
      });

      expect(result.current.error).toBe('Creation failed');
    });
  });

  describe('updateTenant', () => {
    it('should update tenant successfully', async () => {
      const updatedTenant = { id: 'tenant-1', name: 'Updated Tenant', editionId: 'ed-2', concurrencyStamp: 'stamp1' };
      const responseData = { ...updatedTenant, concurrencyStamp: 'new-stamp' };
      mockUpdateTenant.mockResolvedValue(responseData);

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.updateTenant(updatedTenant);
        expect(response.success).toBe(true);
        expect(response.data).toEqual(responseData);
      });

      expect(mockUpdateTenant).toHaveBeenCalledWith(updatedTenant);
    });

    it('should handle update tenant error', async () => {
      mockUpdateTenant.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.updateTenant({ id: 'tenant-1', name: 'Test', concurrencyStamp: 'stamp' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Update failed');
      });

      expect(result.current.error).toBe('Update failed');
    });
  });

  describe('deleteTenant', () => {
    it('should delete tenant successfully', async () => {
      mockDeleteTenant.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.deleteTenant('tenant-1');
        expect(response.success).toBe(true);
      });

      expect(mockDeleteTenant).toHaveBeenCalledWith('tenant-1');
    });

    it('should handle delete tenant error', async () => {
      mockDeleteTenant.mockRejectedValue(new Error('Delete failed'));

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.deleteTenant('tenant-1');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Delete failed');
      });

      expect(result.current.error).toBe('Delete failed');
    });
  });

  describe('Connection String Operations', () => {
    it('should get default connection string', async () => {
      const connectionString = 'Server=localhost;Database=Tenant1;';
      mockGetDefaultConnectionString.mockResolvedValue(connectionString);

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.getDefaultConnectionString('tenant-1');
        expect(response.success).toBe(true);
        expect(response.data).toBe(connectionString);
      });

      expect(result.current.defaultConnectionString).toBe(connectionString);
      expect(result.current.useSharedDatabase).toBe(false);
    });

    it('should detect shared database when no connection string', async () => {
      mockGetDefaultConnectionString.mockResolvedValue('');

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.getDefaultConnectionString('tenant-1');
        expect(response.success).toBe(true);
      });

      expect(result.current.defaultConnectionString).toBe('');
      expect(result.current.useSharedDatabase).toBe(true);
    });

    it('should handle get connection string error', async () => {
      mockGetDefaultConnectionString.mockRejectedValue(new Error('Connection string fetch failed'));

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.getDefaultConnectionString('tenant-1');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Connection string fetch failed');
      });

      expect(result.current.error).toBe('Connection string fetch failed');
    });

    it('should update default connection string', async () => {
      mockUpdateDefaultConnectionString.mockResolvedValue(undefined);
      const payload = { id: 'tenant-1', defaultConnectionString: 'Server=localhost;Database=NewDb;' };

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.updateDefaultConnectionString(payload);
        expect(response.success).toBe(true);
      });

      expect(mockUpdateDefaultConnectionString).toHaveBeenCalledWith(payload);
      expect(result.current.defaultConnectionString).toBe(payload.defaultConnectionString);
      expect(result.current.useSharedDatabase).toBe(false);
    });

    it('should handle update connection string error', async () => {
      mockUpdateDefaultConnectionString.mockRejectedValue(new Error('Update connection string failed'));

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.updateDefaultConnectionString({ id: 'tenant-1', defaultConnectionString: 'test' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Update connection string failed');
      });

      expect(result.current.error).toBe('Update connection string failed');
    });

    it('should delete default connection string (revert to shared)', async () => {
      mockDeleteDefaultConnectionString.mockResolvedValue(undefined);

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.deleteDefaultConnectionString('tenant-1');
        expect(response.success).toBe(true);
      });

      expect(mockDeleteDefaultConnectionString).toHaveBeenCalledWith('tenant-1');
      expect(result.current.defaultConnectionString).toBe('');
      expect(result.current.useSharedDatabase).toBe(true);
    });

    it('should handle delete connection string error', async () => {
      mockDeleteDefaultConnectionString.mockRejectedValue(new Error('Delete connection string failed'));

      const { result } = renderHook(() => useTenants());

      await act(async () => {
        const response = await result.current.deleteDefaultConnectionString('tenant-1');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Delete connection string failed');
      });

      expect(result.current.error).toBe('Delete connection string failed');
    });
  });

  describe('State Management', () => {
    it('should set selected tenant', () => {
      const { result } = renderHook(() => useTenants());
      const tenant = { id: 'tenant-1', name: 'Tenant One', editionId: 'ed-1', concurrencyStamp: 'stamp1' };

      act(() => {
        result.current.setSelectedTenant(tenant);
      });

      expect(result.current.selectedTenant).toEqual(tenant);
    });

    it('should clear selected tenant', () => {
      const { result } = renderHook(() => useTenants());
      const tenant = { id: 'tenant-1', name: 'Tenant One', editionId: 'ed-1', concurrencyStamp: 'stamp1' };

      act(() => {
        result.current.setSelectedTenant(tenant);
      });
      expect(result.current.selectedTenant).toEqual(tenant);

      act(() => {
        result.current.setSelectedTenant(null);
      });
      expect(result.current.selectedTenant).toBeNull();
    });

    it('should set sort key', () => {
      const { result } = renderHook(() => useTenants());

      act(() => {
        result.current.setSortKey('editionName');
      });

      expect(result.current.sortKey).toBe('editionName');
    });

    it('should set sort order', () => {
      const { result } = renderHook(() => useTenants());

      act(() => {
        result.current.setSortOrder('asc');
      });

      expect(result.current.sortOrder).toBe('asc');
    });

    it('should reset state', async () => {
      mockGetTenants.mockResolvedValue({
        items: [{ id: 'tenant-1', name: 'Tenant One', editionId: 'ed-1' }],
        totalCount: 1,
      });

      const { result } = renderHook(() => useTenants());

      // First fetch some data
      await act(async () => {
        await result.current.fetchTenants();
      });

      expect(result.current.tenants.length).toBe(1);

      // Change some state
      act(() => {
        result.current.setSortKey('editionId');
        result.current.setSortOrder('desc');
      });

      // Open features modal
      act(() => {
        result.current.openFeaturesModal('T:tenant-1');
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('T:tenant-1');

      // Then reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.tenants).toEqual([]);
      expect(result.current.totalCount).toBe(0);
      expect(result.current.selectedTenant).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.sortKey).toBe('name');
      expect(result.current.sortOrder).toBe('');
      expect(result.current.defaultConnectionString).toBe('');
      expect(result.current.useSharedDatabase).toBe(true);
      // v2.2.0 features modal state
      expect(result.current.visibleFeatures).toBe(false);
      expect(result.current.featuresProviderKey).toBe('');
    });
  });

  describe('v2.2.0 - Features Modal', () => {
    it('should open features modal with provider key', () => {
      const { result } = renderHook(() => useTenants());

      act(() => {
        result.current.openFeaturesModal('T:tenant-1');
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('T:tenant-1');
    });

    it('should close features modal and clear provider key', () => {
      const { result } = renderHook(() => useTenants());

      // Open modal first
      act(() => {
        result.current.openFeaturesModal('T:tenant-1');
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('T:tenant-1');

      // Close modal
      act(() => {
        result.current.onVisibleFeaturesChange(false);
      });

      expect(result.current.visibleFeatures).toBe(false);
      expect(result.current.featuresProviderKey).toBe('');
    });

    it('should set visibleFeatures to true without clearing provider key', () => {
      const { result } = renderHook(() => useTenants());

      // Open modal first
      act(() => {
        result.current.openFeaturesModal('T:tenant-1');
      });

      // Call with true (should not clear provider key)
      act(() => {
        result.current.onVisibleFeaturesChange(true);
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('T:tenant-1');
    });

    it('should handle multiple modal open/close cycles', () => {
      const { result } = renderHook(() => useTenants());

      // First cycle
      act(() => {
        result.current.openFeaturesModal('T:tenant-1');
      });
      expect(result.current.featuresProviderKey).toBe('T:tenant-1');

      act(() => {
        result.current.onVisibleFeaturesChange(false);
      });
      expect(result.current.featuresProviderKey).toBe('');

      // Second cycle with different key
      act(() => {
        result.current.openFeaturesModal('T:tenant-2');
      });
      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('T:tenant-2');

      act(() => {
        result.current.onVisibleFeaturesChange(false);
      });
      expect(result.current.visibleFeatures).toBe(false);
      expect(result.current.featuresProviderKey).toBe('');
    });

    it('should allow changing provider key while modal is open', () => {
      const { result } = renderHook(() => useTenants());

      act(() => {
        result.current.openFeaturesModal('T:tenant-1');
      });

      expect(result.current.featuresProviderKey).toBe('T:tenant-1');

      // Open with different key (simulating switching tenants)
      act(() => {
        result.current.openFeaturesModal('T:tenant-2');
      });

      expect(result.current.visibleFeatures).toBe(true);
      expect(result.current.featuresProviderKey).toBe('T:tenant-2');
    });
  });
});
