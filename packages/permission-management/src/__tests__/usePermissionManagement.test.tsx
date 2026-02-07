import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { GetPermissionListResultDto, ProviderInfoDto } from '../proxy/models';

// Create mock functions - v4.0.0: uses PermissionsService.get/update instead of PermissionManagementService
const mockGet = vi.fn();
const mockUpdate = vi.fn();

// Mock the proxy service
vi.mock('../proxy/permissions.service', () => ({
  PermissionsService: vi.fn().mockImplementation(() => ({
    get: mockGet,
    update: mockUpdate,
  })),
}));

// Mock @abpjs/core
const mockRestService = {};
const mockCurrentUser = {
  id: 'user-123',
  userName: 'admin',
  roles: ['admin-role', 'editor-role'],
};
vi.mock('@abpjs/core', () => ({
  useRestService: () => mockRestService,
  useCurrentUserInfo: () => mockCurrentUser,
}));

// Import hook after mocks are set up
import { usePermissionManagement } from '../hooks/usePermissionManagement';

// Sample test data - v4.0.0: uses GetPermissionListResultDto instead of PermissionManagement.Response
const createMockPermissionResponse = (): GetPermissionListResultDto => ({
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
      expect(typeof result.current.getAssignedCount).toBe('function');
      expect(typeof result.current.isGranted).toBe('function');
      expect(typeof result.current.isGrantedByRole).toBe('function');
      expect(typeof result.current.isGrantedByOtherProviderName).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('isGrantedByRole (v0.9.0 feature, deprecated in v1.1.0)', () => {
    it('should return true when permission is granted by role provider', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: ProviderInfoDto[] = [
        { providerName: 'R', providerKey: 'admin' },
      ];

      expect(result.current.isGrantedByRole(grantedProviders)).toBe(true);
    });

    it('should return false when permission is granted by user provider only', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: ProviderInfoDto[] = [
        { providerName: 'U', providerKey: 'user123' },
      ];

      expect(result.current.isGrantedByRole(grantedProviders)).toBe(false);
    });

    it('should return true when permission is granted by both role and user', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: ProviderInfoDto[] = [
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

      const grantedProviders: ProviderInfoDto[] = [
        { providerName: 'C', providerKey: 'client123' }, // Client provider
        { providerName: 'T', providerKey: 'tenant123' }, // Tenant provider
      ];

      expect(result.current.isGrantedByRole(grantedProviders)).toBe(false);
    });
  });

  describe('isGrantedByOtherProviderName (v1.1.0 feature)', () => {
    it('should return true when permission is granted by a different provider', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: ProviderInfoDto[] = [
        { providerName: 'R', providerKey: 'admin' },
      ];

      // Current provider is 'U' (user), but permission is granted by 'R' (role)
      expect(result.current.isGrantedByOtherProviderName(grantedProviders, 'U')).toBe(true);
    });

    it('should return false when permission is only granted by the same provider', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: ProviderInfoDto[] = [
        { providerName: 'R', providerKey: 'admin' },
      ];

      // Current provider is 'R' (role), and permission is granted by 'R' (role)
      expect(result.current.isGrantedByOtherProviderName(grantedProviders, 'R')).toBe(false);
    });

    it('should return true when permission is granted by multiple providers including different ones', () => {
      const { result } = renderHook(() => usePermissionManagement());

      const grantedProviders: ProviderInfoDto[] = [
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

      const grantedProviders: ProviderInfoDto[] = [
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
      mockGet.mockResolvedValue(mockResponse);

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
      let resolvePromise: (value: GetPermissionListResultDto) => void;
      const pendingPromise = new Promise<GetPermissionListResultDto>((resolve) => {
        resolvePromise = resolve;
      });
      mockGet.mockReturnValue(pendingPromise);

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
      mockGet.mockRejectedValue(new Error('Network error'));

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
      mockGet.mockRejectedValue('String error');

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
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.isGranted('AbpIdentity.Users')).toBe(true);
    });

    it('should return false for non-granted permission', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.isGranted('AbpIdentity.Users.Create')).toBe(false);
    });

    it('should return false for non-existent permission', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.isGranted('NonExistent.Permission')).toBe(false);
    });
  });

  describe('savePermissions', () => {
    it('should save changed permissions', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());
      mockUpdate.mockResolvedValue(undefined);

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

      expect(mockUpdate).toHaveBeenCalled();
    });

    it('should return success without calling API if nothing changed', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Don't change anything
      await act(async () => {
        const response = await result.current.savePermissions('admin', 'R');
        expect(response.success).toBe(true);
      });

      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should handle save error', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());
      mockUpdate.mockRejectedValue(new Error('Update failed'));

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

    it('should handle non-Error rejection', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());
      mockUpdate.mockRejectedValue('String error');

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Toggle a permission to create a change
      const permission = result.current.groups[0].permissions[1];
      act(() => {
        result.current.togglePermission(permission);
      });

      await act(async () => {
        const response = await result.current.savePermissions('admin', 'R');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to update permissions');
      });
    });
  });

  describe('togglePermission', () => {
    it('should toggle a permission', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

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

    it('should uncheck children when parent is unchecked', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // AbpIdentity.Users is granted, Users.Update is granted (child of Users)
      expect(result.current.isGranted('AbpIdentity.Users')).toBe(true);
      expect(result.current.isGranted('AbpIdentity.Users.Update')).toBe(true);

      // Uncheck the parent permission (AbpIdentity.Users)
      const parentPermission = result.current.groups[0].permissions[0]; // Users (parent)
      act(() => {
        result.current.togglePermission(parentPermission);
      });

      // Parent should be unchecked
      expect(result.current.isGranted('AbpIdentity.Users')).toBe(false);
      // Children should also be unchecked
      expect(result.current.isGranted('AbpIdentity.Users.Create')).toBe(false);
      expect(result.current.isGranted('AbpIdentity.Users.Update')).toBe(false);
    });

    it('should check parent when child is checked', async () => {
      // Create response where parent is not granted but child will be toggled on
      const response = createMockPermissionResponse();
      // Set parent to not granted
      response.groups[0].permissions[0].isGranted = false;
      // Set child to not granted
      response.groups[0].permissions[1].isGranted = false;
      mockGet.mockResolvedValue(response);

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.isGranted('AbpIdentity.Users')).toBe(false);
      expect(result.current.isGranted('AbpIdentity.Users.Create')).toBe(false);

      // Toggle the child on - parent should also be checked
      const childPermission = result.current.groups[0].permissions[1]; // Users.Create
      act(() => {
        result.current.togglePermission(childPermission);
      });

      // Child should be checked
      expect(result.current.isGranted('AbpIdentity.Users.Create')).toBe(true);
      // Parent should also be checked
      expect(result.current.isGranted('AbpIdentity.Users')).toBe(true);
    });
  });

  describe('toggleSelectAll', () => {
    it('should select all permissions when toggled on', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

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
      mockGet.mockResolvedValue(createMockPermissionResponse());

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

  describe('toggleSelectThisTab', () => {
    it('should select all permissions in the current tab when toggled on', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Initially not all are granted in first group (Users.Create is false)
      expect(result.current.selectThisTab).toBe(false);

      act(() => {
        result.current.toggleSelectThisTab();
      });

      // All permissions in the selected group (IdentityManagement) should be granted
      const groupPermNames = ['AbpIdentity.Users', 'AbpIdentity.Users.Create', 'AbpIdentity.Users.Update'];
      for (const name of groupPermNames) {
        expect(result.current.isGranted(name)).toBe(true);
      }
      expect(result.current.selectThisTab).toBe(true);
    });

    it('should deselect all permissions in the current tab when toggled off', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // First select all in tab
      act(() => {
        result.current.toggleSelectThisTab();
      });

      expect(result.current.selectThisTab).toBe(true);

      // Then deselect all in tab
      act(() => {
        result.current.toggleSelectThisTab();
      });

      // All permissions in the selected group should be un-granted
      const groupPermNames = ['AbpIdentity.Users', 'AbpIdentity.Users.Create', 'AbpIdentity.Users.Update'];
      for (const name of groupPermNames) {
        expect(result.current.isGranted(name)).toBe(false);
      }
      expect(result.current.selectThisTab).toBe(false);
    });

    it('should not affect permissions in other groups', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // TenantManagement permission is initially not granted
      expect(result.current.isGranted('AbpTenantManagement.Tenants')).toBe(false);

      // Toggle select all in tab (IdentityManagement is selected)
      act(() => {
        result.current.toggleSelectThisTab();
      });

      // TenantManagement permission should still not be granted
      expect(result.current.isGranted('AbpTenantManagement.Tenants')).toBe(false);
    });

    it('should do nothing when no group is selected', () => {
      const { result } = renderHook(() => usePermissionManagement());

      // No group selected, should not throw
      act(() => {
        result.current.toggleSelectThisTab();
      });

      expect(result.current.permissions).toEqual([]);
    });
  });

  describe('setSelectedGroup', () => {
    it('should change the selected group', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Initially first group is selected
      expect(result.current.selectedGroup?.name).toBe('IdentityManagement');

      // Change to second group
      act(() => {
        result.current.setSelectedGroup(result.current.groups[1]);
      });

      expect(result.current.selectedGroup?.name).toBe('TenantManagement');
    });

    it('should update tab permissions view after group change', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Change to second group
      act(() => {
        result.current.setSelectedGroup(result.current.groups[1]);
      });

      // Get permissions for the new selected group
      const groupPerms = result.current.getSelectedGroupPermissions();
      expect(groupPerms.length).toBe(1);
      expect(groupPerms[0].name).toBe('AbpTenantManagement.Tenants');
    });
  });

  describe('getSelectedGroupPermissions', () => {
    it('should return empty array when no group selected', () => {
      const { result } = renderHook(() => usePermissionManagement());

      expect(result.current.getSelectedGroupPermissions()).toEqual([]);
    });

    it('should return permissions with margins for selected group', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

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

  describe('getAssignedCount (v3.0.0 feature)', () => {
    it('should return 0 when groups are empty', () => {
      const { result } = renderHook(() => usePermissionManagement());

      expect(result.current.getAssignedCount('IdentityManagement')).toBe(0);
    });

    it('should return 0 for non-existent group', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      expect(result.current.getAssignedCount('NonExistentGroup')).toBe(0);
    });

    it('should return correct count for group with granted permissions', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // IdentityManagement group has 3 permissions: Users (granted), Users.Create (not granted), Users.Update (granted)
      expect(result.current.getAssignedCount('IdentityManagement')).toBe(2);
    });

    it('should return 0 for group with no granted permissions', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // TenantManagement group has 1 permission: Tenants (not granted)
      expect(result.current.getAssignedCount('TenantManagement')).toBe(0);
    });

    it('should update count when permissions are toggled', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Initial count
      expect(result.current.getAssignedCount('IdentityManagement')).toBe(2);

      // Toggle Users.Create to grant it
      const permission = result.current.groups[0].permissions[1]; // Users.Create
      act(() => {
        result.current.togglePermission(permission);
      });

      // Count should increase
      expect(result.current.getAssignedCount('IdentityManagement')).toBe(3);
    });

    it('should reflect changes after toggleSelectAll', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

      const { result } = renderHook(() => usePermissionManagement());

      await act(async () => {
        await result.current.fetchPermissions('admin', 'R');
      });

      // Select all permissions
      act(() => {
        result.current.toggleSelectAll();
      });

      // All permissions in each group should be granted
      expect(result.current.getAssignedCount('IdentityManagement')).toBe(3);
      expect(result.current.getAssignedCount('TenantManagement')).toBe(1);

      // Deselect all permissions
      act(() => {
        result.current.toggleSelectAll();
      });

      // No permissions should be granted
      expect(result.current.getAssignedCount('IdentityManagement')).toBe(0);
      expect(result.current.getAssignedCount('TenantManagement')).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      mockGet.mockResolvedValue(createMockPermissionResponse());

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

  describe('shouldFetchAppConfig (v3.1.0 feature)', () => {
    it('should return true when modifying a role the current user belongs to', () => {
      const { result } = renderHook(() => usePermissionManagement());

      // mockCurrentUser has roles: ['admin-role', 'editor-role']
      expect(result.current.shouldFetchAppConfig('admin-role', 'R')).toBe(true);
      expect(result.current.shouldFetchAppConfig('editor-role', 'R')).toBe(true);
    });

    it('should return false when modifying a role the current user does not belong to', () => {
      const { result } = renderHook(() => usePermissionManagement());

      // mockCurrentUser has roles: ['admin-role', 'editor-role']
      expect(result.current.shouldFetchAppConfig('other-role', 'R')).toBe(false);
      expect(result.current.shouldFetchAppConfig('viewer-role', 'R')).toBe(false);
    });

    it('should return true when modifying the current user permissions', () => {
      const { result } = renderHook(() => usePermissionManagement());

      // mockCurrentUser has id: 'user-123'
      expect(result.current.shouldFetchAppConfig('user-123', 'U')).toBe(true);
    });

    it('should return false when modifying a different user permissions', () => {
      const { result } = renderHook(() => usePermissionManagement());

      // mockCurrentUser has id: 'user-123'
      expect(result.current.shouldFetchAppConfig('other-user-456', 'U')).toBe(false);
      expect(result.current.shouldFetchAppConfig('another-user', 'U')).toBe(false);
    });

    it('should return false for unknown provider names', () => {
      const { result } = renderHook(() => usePermissionManagement());

      expect(result.current.shouldFetchAppConfig('some-key', 'T')).toBe(false); // Tenant
      expect(result.current.shouldFetchAppConfig('some-key', 'C')).toBe(false); // Client
      expect(result.current.shouldFetchAppConfig('some-key', '')).toBe(false);
    });

    it('should be available as a method on the hook return', () => {
      const { result } = renderHook(() => usePermissionManagement());

      expect(typeof result.current.shouldFetchAppConfig).toBe('function');
    });
  });
});
