import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { PermissionManagement } from '../models';

// Create mock functions
const mockGetPermissions = vi.fn();
const mockUpdatePermissions = vi.fn();

// Mock the service
vi.mock('../services', () => ({
  PermissionManagementService: vi.fn().mockImplementation(() => ({
    getPermissions: mockGetPermissions,
    updatePermissions: mockUpdatePermissions,
  })),
}));

// Mock @abpjs/core
const mockRestService = {};
vi.mock('@abpjs/core', () => ({
  useRestService: () => mockRestService,
}));

// Import hook after mocks are set up
import { usePermissionManagement } from '../hooks/usePermissionManagement';

// Sample test data
const createMockPermissionResponse = (): PermissionManagement.Response => ({
  entityDisplayName: 'Admin Role',
  groups: [
    {
      name: 'IdentityManagement',
      displayName: 'Identity Management',
      permissions: [
        {
          name: 'AbpIdentity.Users',
          displayName: 'User Management',
          isGranted: true,
          parentName: '',
          allowedProviders: ['R', 'U'],
          grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
        },
        {
          name: 'AbpIdentity.Users.Create',
          displayName: 'Create Users',
          isGranted: false,
          parentName: 'AbpIdentity.Users',
          allowedProviders: ['R', 'U'],
          grantedProviders: [],
        },
        {
          name: 'AbpIdentity.Users.Update',
          displayName: 'Update Users',
          isGranted: true,
          parentName: 'AbpIdentity.Users',
          allowedProviders: ['R', 'U'],
          grantedProviders: [{ providerName: 'U', providerKey: 'user123' }],
        },
      ],
    },
    {
      name: 'TenantManagement',
      displayName: 'Tenant Management',
      permissions: [
        {
          name: 'AbpTenantManagement.Tenants',
          displayName: 'Tenant Management',
          isGranted: false,
          parentName: '',
          allowedProviders: ['R'],
          grantedProviders: [],
        },
      ],
    },
  ],
});

describe('usePermissionManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state with empty values', () => {
      const { result } = renderHook(() => usePermissionManagement());

      expect(result.current.groups).toEqual([]);
      expect(result.current.entityDisplayName).toBe('');
      expect(result.current.selectedGroup).toBeNull();
      expect(result.current.permissions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectThisTab).toBe(false);
      expect(result.current.selectAllTab).toBe(false);
    });

    it('should provide all expected methods', () => {
      const { result } = renderHook(() => usePermissionManagement());

      expect(typeof result.current.fetchPermissions).toBe('function');
      expect(typeof result.current.savePermissions).toBe('function');
      expect(typeof result.current.setSelectedGroup).toBe('function');
      expect(typeof result.current.togglePermission).toBe('function');
      expect(typeof result.current.toggleSelectThisTab).toBe('function');
      expect(typeof result.current.toggleSelectAll).toBe('function');
      expect(typeof result.current.getSelectedGroupPermissions).toBe('function');
      expect(typeof result.current.isGranted).toBe('function');
      expect(typeof result.current.isGrantedByRole).toBe('function');
      expect(typeof result.current.isGrantedByOtherProviderName).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('isGrantedByRole (v0.9.0 feature, deprecated in v1.1.0)', () => {
    it('should return true when permission is granted by role provider', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: PermissionManagement.GrantedProvider[] = [
        { providerName: 'R', providerKey: 'admin' },
      ];

      expect(result.current.isGrantedByRole(grantedProviders)).toBe(true);
    });

    it('should return false when permission is granted by user provider only', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: PermissionManagement.GrantedProvider[] = [
        { providerName: 'U', providerKey: 'user123' },
      ];

      expect(result.current.isGrantedByRole(grantedProviders)).toBe(false);
    });

    it('should return true when permission is granted by both role and user', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: PermissionManagement.GrantedProvider[] = [
        { providerName: 'R', providerKey: 'admin' },
        { providerName: 'U', providerKey: 'user123' },
      ];

      expect(result.current.isGrantedByRole(grantedProviders)).toBe(true);
    });

    it('should return false when grantedProviders is empty', () => {
      const { result } = renderHook(() => usePermissionManagement());

      expect(result.current.isGrantedByRole([])).toBe(false);
    });

    it('should return false for other provider types', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: PermissionManagement.GrantedProvider[] = [
        { providerName: 'C', providerKey: 'client123' }, // Client provider
        { providerName: 'T', providerKey: 'tenant123' }, // Tenant provider
      ];

      expect(result.current.isGrantedByRole(grantedProviders)).toBe(false);
    });
  });

  describe('isGrantedByOtherProviderName (v1.1.0 feature)', () => {
    it('should return true when permission is granted by a different provider', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: PermissionManagement.GrantedProvider[] = [
        { providerName: 'R', providerKey: 'admin' },
      ];

      // Current provider is 'U' (user), but permission is granted by 'R' (role)
      expect(result.current.isGrantedByOtherProviderName(grantedProviders, 'U')).toBe(true);
    });

    it('should return false when permission is only granted by the same provider', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: PermissionManagement.GrantedProvider[] = [
        { providerName: 'R', providerKey: 'admin' },
      ];

      // Current provider is 'R' (role), and permission is granted by 'R' (role)
      expect(result.current.isGrantedByOtherProviderName(grantedProviders, 'R')).toBe(false);
    });

    it('should return true when permission is granted by multiple providers including different ones', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: PermissionManagement.GrantedProvider[] = [
        { providerName: 'R', providerKey: 'admin' },
        { providerName: 'U', providerKey: 'user123' },
      ];

      // Current provider is 'U', but permission is also granted by 'R'
      expect(result.current.isGrantedByOtherProviderName(grantedProviders, 'U')).toBe(true);
      // Current provider is 'R', but permission is also granted by 'U'
      expect(result.current.isGrantedByOtherProviderName(grantedProviders, 'R')).toBe(true);
    });

    it('should return false when grantedProviders is empty', () => {
      const { result } = renderHook(() => usePermissionManagement());

      expect(result.current.isGrantedByOtherProviderName([], 'R')).toBe(false);
    });

    it('should work with various provider types', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: PermissionManagement.GrantedProvider[] = [
        { providerName: 'C', providerKey: 'client123' }, // Client provider
        { providerName: 'T', providerKey: 'tenant123' }, // Tenant provider
      ];

      // Current provider is 'R', others are 'C' and 'T'
      expect(result.current.isGrantedByOtherProviderName(grantedProviders, 'R')).toBe(true);
      // Current provider is 'C', and 'T' is different
      expect(result.current.isGrantedByOtherProviderName(grantedProviders, 'C')).toBe(true);
    });
  });

  describe('fetchPermissions', () => {
    it('should fetch permissions and set state', async () => {
      const mockResponse = createMockPermissionResponse();
      mockGetPermissions.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        const response = await result.current.fetchPermissions('admin', 'R');
        expect(response.success).toBe(true);
      });

      expect(result.current.groups).toEqual(mockResponse.groups);
      expect(result.current.entityDisplayName).toBe('Admin Role');
      expect(result.current.selectedGroup).toEqual(mockResponse.groups[0]);
      expect(result.current.permissions.length).toBe(4); // All permissions flattened
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state while fetching', async () => {
      let resolvePromise: (value: PermissionManagement.Response) => void;
      const pendingPromise = new Promise<PermissionManagement.Response>((resolve) => {
        resolvePromise = resolve;
      });
      mockGetPermissions.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => usePermissionManagement());

      act(() => {
        result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!(createMockPermissionResponse());
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle fetch error', async () => {
      mockGetPermissions.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        const response = await result.current.fetchPermissions('admin', 'R');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Network error');
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle non-Error rejection', async () => {
      mockGetPermissions.mockRejectedValue('String error');

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        const response = await result.current.fetchPermissions('admin', 'R');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to fetch permissions');
      });
    });
  });

  describe('isGranted', () => {
    it('should return true for granted permission', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.isGranted('AbpIdentity.Users')).toBe(true);
    });

    it('should return false for non-granted permission', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.isGranted('AbpIdentity.Users.Create')).toBe(false);
    });

    it('should return false for non-existent permission', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.isGranted('NonExistent.Permission')).toBe(false);
    });
  });

  describe('savePermissions', () => {
    it('should save changed permissions', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());
      mockUpdatePermissions.mockResolvedValue(undefined);

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Toggle a permission to change it
      const permission = result.current.groups[0].permissions[1];
      act(() => {
        result.current.togglePermission(permission);
      });

      await act(async () => {
        const response = await result.current.savePermissions('admin', 'R');
        expect(response.success).toBe(true);
      });

      expect(mockUpdatePermissions).toHaveBeenCalled();
    });

    it('should return success without calling API if nothing changed', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Don't change anything
      await act(async () => {
        const response = await result.current.savePermissions('admin', 'R');
        expect(response.success).toBe(true);
      });

      expect(mockUpdatePermissions).not.toHaveBeenCalled();
    });

    it('should handle save error', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());
      mockUpdatePermissions.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Toggle a permission
      const permission = result.current.groups[0].permissions[1];
      act(() => {
        result.current.togglePermission(permission);
      });

      await act(async () => {
        const response = await result.current.savePermissions('admin', 'R');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Update failed');
      });
    });
  });

  describe('togglePermission', () => {
    it('should toggle a permission', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      const initialGranted = result.current.isGranted('AbpIdentity.Users.Create');
      expect(initialGranted).toBe(false);

      const permission = result.current.groups[0].permissions[1];
      act(() => {
        result.current.togglePermission(permission);
      });

      expect(result.current.isGranted('AbpIdentity.Users.Create')).toBe(true);
    });
  });

  describe('toggleSelectAll', () => {
    it('should select all permissions when toggled on', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      act(() => {
        result.current.toggleSelectAll();
      });

      // All permissions should be granted
      expect(result.current.permissions.every((p) => p.isGranted)).toBe(true);
      expect(result.current.selectAllTab).toBe(true);
    });

    it('should deselect all permissions when toggled off', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // First select all
      act(() => {
        result.current.toggleSelectAll();
      });

      // Then deselect all
      act(() => {
        result.current.toggleSelectAll();
      });

      expect(result.current.permissions.every((p) => !p.isGranted)).toBe(true);
      expect(result.current.selectAllTab).toBe(false);
    });
  });

  describe('getSelectedGroupPermissions', () => {
    it('should return empty array when no group selected', () => {
      const { result } = renderHook(() => usePermissionManagement());

      expect(result.current.getSelectedGroupPermissions()).toEqual([]);
    });

    it('should return permissions with margins for selected group', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      const groupPermissions = result.current.getSelectedGroupPermissions();

      expect(groupPermissions.length).toBe(3); // First group has 3 permissions
      expect(groupPermissions[0].margin).toBe(0); // Parent permission
      expect(groupPermissions[1].margin).toBe(20); // Child permission
      expect(groupPermissions[2].margin).toBe(20); // Child permission
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      mockGetPermissions.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.groups.length).toBeGreaterThan(0);

      act(() => {
        result.current.reset();
      });

      expect(result.current.groups).toEqual([]);
      expect(result.current.entityDisplayName).toBe('');
      expect(result.current.selectedGroup).toBeNull();
      expect(result.current.permissions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.selectThisTab).toBe(false);
      expect(result.current.selectAllTab).toBe(false);
    });
  });
});
