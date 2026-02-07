import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PermissionManagementStateService } from '../services/permission-management-state.service';
import { PermissionsService } from '../proxy/permissions.service';
import type { PermissionGroupDto, GetPermissionListResultDto, ProviderInfoDto, UpdatePermissionsDto } from '../proxy/models';

// Mock the PermissionsService
vi.mock('../proxy/permissions.service', () => ({
  PermissionsService: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    update: vi.fn(),
  })),
}));

describe('PermissionManagementStateService', () => {
  let service: PermissionManagementStateService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PermissionManagementStateService();
  });

  describe('initial state', () => {
    it('should have empty groups initially', () => {
      expect(service.getPermissionGroups()).toEqual([]);
    });

    it('should have empty entity display name initially', () => {
      expect(service.getEntityDisplayName()).toBe('');
    });
  });

  describe('setGroups and getPermissionGroups', () => {
    it('should set and get permission groups', () => {
      const groups: PermissionGroupDto[] = [
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
          ],
        },
      ];

      service.setGroups(groups);
      expect(service.getPermissionGroups()).toEqual(groups);
    });

    it('should handle multiple groups', () => {
      const groups: PermissionGroupDto[] = [
        {
          name: 'Group1',
          displayName: 'Group One',
          permissions: [],
        },
        {
          name: 'Group2',
          displayName: 'Group Two',
          permissions: [],
        },
        {
          name: 'Group3',
          displayName: 'Group Three',
          permissions: [],
        },
      ];

      service.setGroups(groups);
      expect(service.getPermissionGroups()).toHaveLength(3);
      expect(service.getPermissionGroups()[0].name).toBe('Group1');
      expect(service.getPermissionGroups()[2].name).toBe('Group3');
    });

    it('should overwrite previous groups', () => {
      const groups1: PermissionGroupDto[] = [
        { name: 'First', displayName: 'First Group', permissions: [] },
      ];
      const groups2: PermissionGroupDto[] = [
        { name: 'Second', displayName: 'Second Group', permissions: [] },
      ];

      service.setGroups(groups1);
      expect(service.getPermissionGroups()[0].name).toBe('First');

      service.setGroups(groups2);
      expect(service.getPermissionGroups()).toHaveLength(1);
      expect(service.getPermissionGroups()[0].name).toBe('Second');
    });
  });

  describe('setEntityDisplayName and getEntityDisplayName', () => {
    it('should set and get entity display name', () => {
      service.setEntityDisplayName('Admin Role');
      expect(service.getEntityDisplayName()).toBe('Admin Role');
    });

    it('should handle empty string', () => {
      service.setEntityDisplayName('Some Name');
      service.setEntityDisplayName('');
      expect(service.getEntityDisplayName()).toBe('');
    });

    it('should handle special characters', () => {
      const specialName = 'Role: Admin (Test) <Special>';
      service.setEntityDisplayName(specialName);
      expect(service.getEntityDisplayName()).toBe(specialName);
    });

    it('should overwrite previous entity display name', () => {
      service.setEntityDisplayName('First Name');
      service.setEntityDisplayName('Second Name');
      expect(service.getEntityDisplayName()).toBe('Second Name');
    });
  });

  describe('reset', () => {
    it('should reset groups to empty array', () => {
      const groups: PermissionGroupDto[] = [
        { name: 'Test', displayName: 'Test Group', permissions: [] },
      ];
      service.setGroups(groups);
      expect(service.getPermissionGroups()).toHaveLength(1);

      service.reset();
      expect(service.getPermissionGroups()).toEqual([]);
    });

    it('should reset entity display name to empty string', () => {
      service.setEntityDisplayName('Admin Role');
      expect(service.getEntityDisplayName()).toBe('Admin Role');

      service.reset();
      expect(service.getEntityDisplayName()).toBe('');
    });

    it('should reset all state at once', () => {
      const groups: PermissionGroupDto[] = [
        {
          name: 'IdentityManagement',
          displayName: 'Identity Management',
          permissions: [
            {
              name: 'AbpIdentity.Users',
              displayName: 'User Management',
              isGranted: true,
              parentName: '',
              allowedProviders: ['R'],
              grantedProviders: [],
            },
          ],
        },
      ];

      service.setGroups(groups);
      service.setEntityDisplayName('Test Entity');

      expect(service.getPermissionGroups()).toHaveLength(1);
      expect(service.getEntityDisplayName()).toBe('Test Entity');

      service.reset();

      expect(service.getPermissionGroups()).toEqual([]);
      expect(service.getEntityDisplayName()).toBe('');
    });

    it('should allow setting values again after reset', () => {
      const groups1: PermissionGroupDto[] = [
        { name: 'First', displayName: 'First Group', permissions: [] },
      ];

      service.setGroups(groups1);
      service.setEntityDisplayName('First Entity');
      service.reset();

      const groups2: PermissionGroupDto[] = [
        { name: 'Second', displayName: 'Second Group', permissions: [] },
      ];

      service.setGroups(groups2);
      service.setEntityDisplayName('Second Entity');

      expect(service.getPermissionGroups()[0].name).toBe('Second');
      expect(service.getEntityDisplayName()).toBe('Second Entity');
    });
  });

  describe('constructor with PermissionsService (v4.0.0)', () => {
    it('should accept PermissionsService in constructor', () => {
      const mockPermissionService = {
        get: vi.fn(),
        update: vi.fn(),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);
      expect(stateService).toBeInstanceOf(PermissionManagementStateService);
    });

    it('should work without PermissionsService', () => {
      const stateService = new PermissionManagementStateService();
      expect(stateService).toBeInstanceOf(PermissionManagementStateService);
    });

    it('should work with undefined PermissionsService', () => {
      const stateService = new PermissionManagementStateService(undefined);
      expect(stateService).toBeInstanceOf(PermissionManagementStateService);
    });
  });

  describe('dispatchGetPermissions (v2.0.0, updated v4.0.0)', () => {
    it('should throw error when PermissionsService is not provided', async () => {
      const stateService = new PermissionManagementStateService();

      await expect(
        stateService.dispatchGetPermissions({
          providerKey: 'role-id',
          providerName: 'R',
        })
      ).rejects.toThrow(
        'PermissionsService is required for dispatchGetPermissions. Pass it to the constructor.'
      );
    });

    it('should call get and update internal state', async () => {
      const mockResponse: GetPermissionListResultDto = {
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
            ],
          },
        ],
      };

      const mockPermissionService = {
        get: vi.fn().mockResolvedValue(mockResponse),
        update: vi.fn(),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      const result = await stateService.dispatchGetPermissions({
        providerKey: 'role-id',
        providerName: 'R',
      });

      expect(mockPermissionService.get).toHaveBeenCalledWith('R', 'role-id');
      expect(result).toEqual(mockResponse);
      expect(stateService.getPermissionGroups()).toEqual(mockResponse.groups);
      expect(stateService.getEntityDisplayName()).toBe('Admin Role');
    });

    it('should handle empty groups in response', async () => {
      const mockResponse: GetPermissionListResultDto = {
        entityDisplayName: 'Empty Entity',
        groups: [],
      };

      const mockPermissionService = {
        get: vi.fn().mockResolvedValue(mockResponse),
        update: vi.fn(),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await stateService.dispatchGetPermissions({
        providerKey: 'user-id',
        providerName: 'U',
      });

      expect(stateService.getPermissionGroups()).toEqual([]);
      expect(stateService.getEntityDisplayName()).toBe('Empty Entity');
    });

    it('should handle API errors', async () => {
      const mockPermissionService = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
        update: vi.fn(),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await expect(
        stateService.dispatchGetPermissions({
          providerKey: 'role-id',
          providerName: 'R',
        })
      ).rejects.toThrow('API Error');
    });

    it('should overwrite previous state when called again', async () => {
      const firstResponse: GetPermissionListResultDto = {
        entityDisplayName: 'First Entity',
        groups: [{ name: 'Group1', displayName: 'First Group', permissions: [] }],
      };

      const secondResponse: GetPermissionListResultDto = {
        entityDisplayName: 'Second Entity',
        groups: [{ name: 'Group2', displayName: 'Second Group', permissions: [] }],
      };

      const mockPermissionService = {
        get: vi.fn()
          .mockResolvedValueOnce(firstResponse)
          .mockResolvedValueOnce(secondResponse),
        update: vi.fn(),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await stateService.dispatchGetPermissions({ providerKey: 'id1', providerName: 'R' });
      expect(stateService.getEntityDisplayName()).toBe('First Entity');

      await stateService.dispatchGetPermissions({ providerKey: 'id2', providerName: 'U' });
      expect(stateService.getEntityDisplayName()).toBe('Second Entity');
      expect(stateService.getPermissionGroups()[0].name).toBe('Group2');
    });
  });

  describe('dispatchUpdatePermissions (v2.0.0, updated v4.0.0)', () => {
    it('should throw error when PermissionsService is not provided', async () => {
      const stateService = new PermissionManagementStateService();

      await expect(
        stateService.dispatchUpdatePermissions({
          providerKey: 'role-id',
          providerName: 'R',
          permissions: [],
        })
      ).rejects.toThrow(
        'PermissionsService is required for dispatchUpdatePermissions. Pass it to the constructor.'
      );
    });

    it('should call update and then refresh via get', async () => {
      const refreshedResponse: GetPermissionListResultDto = {
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
                allowedProviders: ['R'],
                grantedProviders: [],
              },
            ],
          },
        ],
      };

      const mockPermissionService = {
        get: vi.fn().mockResolvedValue(refreshedResponse),
        update: vi.fn().mockResolvedValue(undefined),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      const updateRequest: ProviderInfoDto & UpdatePermissionsDto = {
        providerKey: 'role-id',
        providerName: 'R',
        permissions: [{ name: 'AbpIdentity.Users', isGranted: true }],
      };

      await stateService.dispatchUpdatePermissions(updateRequest);

      expect(mockPermissionService.update).toHaveBeenCalledWith('R', 'role-id', {
        permissions: [{ name: 'AbpIdentity.Users', isGranted: true }],
      });
      expect(mockPermissionService.get).toHaveBeenCalledWith('R', 'role-id');
      expect(stateService.getPermissionGroups()).toEqual(refreshedResponse.groups);
      expect(stateService.getEntityDisplayName()).toBe('Admin Role');
    });

    it('should handle update with empty permissions array', async () => {
      const refreshedResponse: GetPermissionListResultDto = {
        entityDisplayName: 'Test Entity',
        groups: [],
      };

      const mockPermissionService = {
        get: vi.fn().mockResolvedValue(refreshedResponse),
        update: vi.fn().mockResolvedValue(undefined),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await stateService.dispatchUpdatePermissions({
        providerKey: 'user-id',
        providerName: 'U',
        permissions: [],
      });

      expect(mockPermissionService.update).toHaveBeenCalled();
      expect(mockPermissionService.get).toHaveBeenCalled();
    });

    it('should handle update API error', async () => {
      const mockPermissionService = {
        get: vi.fn(),
        update: vi.fn().mockRejectedValue(new Error('Update failed')),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await expect(
        stateService.dispatchUpdatePermissions({
          providerKey: 'role-id',
          providerName: 'R',
          permissions: [],
        })
      ).rejects.toThrow('Update failed');

      // get should not be called if update fails
      expect(mockPermissionService.get).not.toHaveBeenCalled();
    });

    it('should handle get failure after successful update', async () => {
      const mockPermissionService = {
        get: vi.fn().mockRejectedValue(new Error('Refresh failed')),
        update: vi.fn().mockResolvedValue(undefined),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await expect(
        stateService.dispatchUpdatePermissions({
          providerKey: 'role-id',
          providerName: 'R',
          permissions: [],
        })
      ).rejects.toThrow('Refresh failed');

      // update should have been called
      expect(mockPermissionService.update).toHaveBeenCalled();
    });

    it('should update multiple permissions at once', async () => {
      const refreshedResponse: GetPermissionListResultDto = {
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
                allowedProviders: ['R'],
                grantedProviders: [],
              },
              {
                name: 'AbpIdentity.Users.Create',
                displayName: 'Create Users',
                isGranted: true,
                parentName: 'AbpIdentity.Users',
                allowedProviders: ['R'],
                grantedProviders: [],
              },
              {
                name: 'AbpIdentity.Users.Delete',
                displayName: 'Delete Users',
                isGranted: false,
                parentName: 'AbpIdentity.Users',
                allowedProviders: ['R'],
                grantedProviders: [],
              },
            ],
          },
        ],
      };

      const mockPermissionService = {
        get: vi.fn().mockResolvedValue(refreshedResponse),
        update: vi.fn().mockResolvedValue(undefined),
      } as unknown as PermissionsService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      const updateRequest: ProviderInfoDto & UpdatePermissionsDto = {
        providerKey: 'role-id',
        providerName: 'R',
        permissions: [
          { name: 'AbpIdentity.Users', isGranted: true },
          { name: 'AbpIdentity.Users.Create', isGranted: true },
          { name: 'AbpIdentity.Users.Delete', isGranted: false },
        ],
      };

      await stateService.dispatchUpdatePermissions(updateRequest);

      expect(mockPermissionService.update).toHaveBeenCalledWith('R', 'role-id', {
        permissions: updateRequest.permissions,
      });
      expect(stateService.getPermissionGroups()[0].permissions).toHaveLength(3);
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical usage flow', () => {
      // Initial state
      expect(service.getPermissionGroups()).toEqual([]);
      expect(service.getEntityDisplayName()).toBe('');

      // Load data
      const groups: PermissionGroupDto[] = [
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
          ],
        },
      ];

      service.setGroups(groups);
      service.setEntityDisplayName('Admin Role');

      // Verify data
      expect(service.getPermissionGroups()).toHaveLength(1);
      expect(service.getPermissionGroups()[0].permissions).toHaveLength(2);
      expect(service.getEntityDisplayName()).toBe('Admin Role');

      // Reset for new context
      service.reset();

      expect(service.getPermissionGroups()).toEqual([]);
      expect(service.getEntityDisplayName()).toBe('');
    });

    it('should maintain reference equality for arrays', () => {
      const groups: PermissionGroupDto[] = [
        { name: 'Test', displayName: 'Test Group', permissions: [] },
      ];

      service.setGroups(groups);
      const retrieved = service.getPermissionGroups();

      // The same array reference should be returned
      expect(retrieved).toBe(service.getPermissionGroups());
    });
  });
});
