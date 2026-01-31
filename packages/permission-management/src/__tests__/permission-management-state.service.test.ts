import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PermissionManagementStateService } from '../services/permission-management-state.service';
import { PermissionManagementService } from '../services/permission-management.service';
import type { PermissionManagement } from '../models';

// Mock the PermissionManagementService
vi.mock('../services/permission-management.service', () => ({
  PermissionManagementService: vi.fn().mockImplementation(() => ({
    getPermissions: vi.fn(),
    updatePermissions: vi.fn(),
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
      const groups: PermissionManagement.Group[] = [
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
      const groups: PermissionManagement.Group[] = [
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
      const groups1: PermissionManagement.Group[] = [
        { name: 'First', displayName: 'First Group', permissions: [] },
      ];
      const groups2: PermissionManagement.Group[] = [
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
      const groups: PermissionManagement.Group[] = [
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
      const groups: PermissionManagement.Group[] = [
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
      const groups1: PermissionManagement.Group[] = [
        { name: 'First', displayName: 'First Group', permissions: [] },
      ];

      service.setGroups(groups1);
      service.setEntityDisplayName('First Entity');
      service.reset();

      const groups2: PermissionManagement.Group[] = [
        { name: 'Second', displayName: 'Second Group', permissions: [] },
      ];

      service.setGroups(groups2);
      service.setEntityDisplayName('Second Entity');

      expect(service.getPermissionGroups()[0].name).toBe('Second');
      expect(service.getEntityDisplayName()).toBe('Second Entity');
    });
  });

  describe('constructor with PermissionManagementService (v2.0.0)', () => {
    it('should accept PermissionManagementService in constructor', () => {
      const mockPermissionService = {
        getPermissions: vi.fn(),
        updatePermissions: vi.fn(),
      } as unknown as PermissionManagementService;

      const stateService = new PermissionManagementStateService(mockPermissionService);
      expect(stateService).toBeInstanceOf(PermissionManagementStateService);
    });

    it('should work without PermissionManagementService', () => {
      const stateService = new PermissionManagementStateService();
      expect(stateService).toBeInstanceOf(PermissionManagementStateService);
    });

    it('should work with undefined PermissionManagementService', () => {
      const stateService = new PermissionManagementStateService(undefined);
      expect(stateService).toBeInstanceOf(PermissionManagementStateService);
    });
  });

  describe('dispatchGetPermissions (v2.0.0)', () => {
    it('should throw error when PermissionManagementService is not provided', async () => {
      const stateService = new PermissionManagementStateService();

      await expect(
        stateService.dispatchGetPermissions({
          providerKey: 'role-id',
          providerName: 'R',
        })
      ).rejects.toThrow(
        'PermissionManagementService is required for dispatchGetPermissions. Pass it to the constructor.'
      );
    });

    it('should call getPermissions and update internal state', async () => {
      const mockResponse: PermissionManagement.Response = {
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
        getPermissions: vi.fn().mockResolvedValue(mockResponse),
        updatePermissions: vi.fn(),
      } as unknown as PermissionManagementService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      const result = await stateService.dispatchGetPermissions({
        providerKey: 'role-id',
        providerName: 'R',
      });

      expect(mockPermissionService.getPermissions).toHaveBeenCalledWith({
        providerKey: 'role-id',
        providerName: 'R',
      });
      expect(result).toEqual(mockResponse);
      expect(stateService.getPermissionGroups()).toEqual(mockResponse.groups);
      expect(stateService.getEntityDisplayName()).toBe('Admin Role');
    });

    it('should handle empty groups in response', async () => {
      const mockResponse: PermissionManagement.Response = {
        entityDisplayName: 'Empty Entity',
        groups: [],
      };

      const mockPermissionService = {
        getPermissions: vi.fn().mockResolvedValue(mockResponse),
        updatePermissions: vi.fn(),
      } as unknown as PermissionManagementService;

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
        getPermissions: vi.fn().mockRejectedValue(new Error('API Error')),
        updatePermissions: vi.fn(),
      } as unknown as PermissionManagementService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await expect(
        stateService.dispatchGetPermissions({
          providerKey: 'role-id',
          providerName: 'R',
        })
      ).rejects.toThrow('API Error');
    });

    it('should overwrite previous state when called again', async () => {
      const firstResponse: PermissionManagement.Response = {
        entityDisplayName: 'First Entity',
        groups: [{ name: 'Group1', displayName: 'First Group', permissions: [] }],
      };

      const secondResponse: PermissionManagement.Response = {
        entityDisplayName: 'Second Entity',
        groups: [{ name: 'Group2', displayName: 'Second Group', permissions: [] }],
      };

      const mockPermissionService = {
        getPermissions: vi.fn()
          .mockResolvedValueOnce(firstResponse)
          .mockResolvedValueOnce(secondResponse),
        updatePermissions: vi.fn(),
      } as unknown as PermissionManagementService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await stateService.dispatchGetPermissions({ providerKey: 'id1', providerName: 'R' });
      expect(stateService.getEntityDisplayName()).toBe('First Entity');

      await stateService.dispatchGetPermissions({ providerKey: 'id2', providerName: 'U' });
      expect(stateService.getEntityDisplayName()).toBe('Second Entity');
      expect(stateService.getPermissionGroups()[0].name).toBe('Group2');
    });
  });

  describe('dispatchUpdatePermissions (v2.0.0)', () => {
    it('should throw error when PermissionManagementService is not provided', async () => {
      const stateService = new PermissionManagementStateService();

      await expect(
        stateService.dispatchUpdatePermissions({
          providerKey: 'role-id',
          providerName: 'R',
          permissions: [],
        })
      ).rejects.toThrow(
        'PermissionManagementService is required for dispatchUpdatePermissions. Pass it to the constructor.'
      );
    });

    it('should call updatePermissions and then refresh via getPermissions', async () => {
      const refreshedResponse: PermissionManagement.Response = {
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
        getPermissions: vi.fn().mockResolvedValue(refreshedResponse),
        updatePermissions: vi.fn().mockResolvedValue(undefined),
      } as unknown as PermissionManagementService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      const updateRequest: PermissionManagement.UpdateRequest = {
        providerKey: 'role-id',
        providerName: 'R',
        permissions: [{ name: 'AbpIdentity.Users', isGranted: true }],
      };

      await stateService.dispatchUpdatePermissions(updateRequest);

      expect(mockPermissionService.updatePermissions).toHaveBeenCalledWith(updateRequest);
      expect(mockPermissionService.getPermissions).toHaveBeenCalledWith({
        providerKey: 'role-id',
        providerName: 'R',
      });
      expect(stateService.getPermissionGroups()).toEqual(refreshedResponse.groups);
      expect(stateService.getEntityDisplayName()).toBe('Admin Role');
    });

    it('should handle update with empty permissions array', async () => {
      const refreshedResponse: PermissionManagement.Response = {
        entityDisplayName: 'Test Entity',
        groups: [],
      };

      const mockPermissionService = {
        getPermissions: vi.fn().mockResolvedValue(refreshedResponse),
        updatePermissions: vi.fn().mockResolvedValue(undefined),
      } as unknown as PermissionManagementService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await stateService.dispatchUpdatePermissions({
        providerKey: 'user-id',
        providerName: 'U',
        permissions: [],
      });

      expect(mockPermissionService.updatePermissions).toHaveBeenCalled();
      expect(mockPermissionService.getPermissions).toHaveBeenCalled();
    });

    it('should handle updatePermissions API error', async () => {
      const mockPermissionService = {
        getPermissions: vi.fn(),
        updatePermissions: vi.fn().mockRejectedValue(new Error('Update failed')),
      } as unknown as PermissionManagementService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await expect(
        stateService.dispatchUpdatePermissions({
          providerKey: 'role-id',
          providerName: 'R',
          permissions: [],
        })
      ).rejects.toThrow('Update failed');

      // getPermissions should not be called if updatePermissions fails
      expect(mockPermissionService.getPermissions).not.toHaveBeenCalled();
    });

    it('should handle getPermissions failure after successful update', async () => {
      const mockPermissionService = {
        getPermissions: vi.fn().mockRejectedValue(new Error('Refresh failed')),
        updatePermissions: vi.fn().mockResolvedValue(undefined),
      } as unknown as PermissionManagementService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      await expect(
        stateService.dispatchUpdatePermissions({
          providerKey: 'role-id',
          providerName: 'R',
          permissions: [],
        })
      ).rejects.toThrow('Refresh failed');

      // updatePermissions should have been called
      expect(mockPermissionService.updatePermissions).toHaveBeenCalled();
    });

    it('should update multiple permissions at once', async () => {
      const refreshedResponse: PermissionManagement.Response = {
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
        getPermissions: vi.fn().mockResolvedValue(refreshedResponse),
        updatePermissions: vi.fn().mockResolvedValue(undefined),
      } as unknown as PermissionManagementService;

      const stateService = new PermissionManagementStateService(mockPermissionService);

      const updateRequest: PermissionManagement.UpdateRequest = {
        providerKey: 'role-id',
        providerName: 'R',
        permissions: [
          { name: 'AbpIdentity.Users', isGranted: true },
          { name: 'AbpIdentity.Users.Create', isGranted: true },
          { name: 'AbpIdentity.Users.Delete', isGranted: false },
        ],
      };

      await stateService.dispatchUpdatePermissions(updateRequest);

      expect(mockPermissionService.updatePermissions).toHaveBeenCalledWith(updateRequest);
      expect(stateService.getPermissionGroups()[0].permissions).toHaveLength(3);
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical usage flow', () => {
      // Initial state
      expect(service.getPermissionGroups()).toEqual([]);
      expect(service.getEntityDisplayName()).toBe('');

      // Load data
      const groups: PermissionManagement.Group[] = [
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
      const groups: PermissionManagement.Group[] = [
        { name: 'Test', displayName: 'Test Group', permissions: [] },
      ];

      service.setGroups(groups);
      const retrieved = service.getPermissionGroups();

      // The same array reference should be returned
      expect(retrieved).toBe(service.getPermissionGroups());
    });
  });
});
