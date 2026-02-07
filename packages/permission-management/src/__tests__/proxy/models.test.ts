import { describe, it, expect } from 'vitest';
import type {
  GetPermissionListResultDto,
  PermissionGrantInfoDto,
  PermissionGroupDto,
  ProviderInfoDto,
  UpdatePermissionDto,
  UpdatePermissionsDto,
} from '../../proxy/models';

/**
 * Tests for proxy models (DTOs) introduced in v3.2.0
 */
describe('Proxy Models (v3.2.0)', () => {
  describe('ProviderInfoDto', () => {
    it('should define provider info with providerName and providerKey', () => {
      const providerInfo: ProviderInfoDto = {
        providerName: 'R',
        providerKey: 'admin-role',
      };

      expect(providerInfo.providerName).toBe('R');
      expect(providerInfo.providerKey).toBe('admin-role');
    });

    it('should accept different provider types', () => {
      const roleProvider: ProviderInfoDto = {
        providerName: 'R',
        providerKey: 'role-123',
      };

      const userProvider: ProviderInfoDto = {
        providerName: 'U',
        providerKey: 'user-456',
      };

      expect(roleProvider.providerName).toBe('R');
      expect(userProvider.providerName).toBe('U');
    });

    it('should handle empty provider key', () => {
      const provider: ProviderInfoDto = {
        providerName: 'R',
        providerKey: '',
      };

      expect(provider.providerKey).toBe('');
    });
  });

  describe('PermissionGrantInfoDto', () => {
    it('should define complete permission grant info', () => {
      const permission: PermissionGrantInfoDto = {
        name: 'AbpIdentity.Users',
        displayName: 'User Management',
        parentName: '',
        isGranted: true,
        allowedProviders: ['R', 'U'],
        grantedProviders: [
          { providerName: 'R', providerKey: 'admin' },
        ],
      };

      expect(permission.name).toBe('AbpIdentity.Users');
      expect(permission.displayName).toBe('User Management');
      expect(permission.parentName).toBe('');
      expect(permission.isGranted).toBe(true);
      expect(permission.allowedProviders).toEqual(['R', 'U']);
      expect(permission.grantedProviders).toHaveLength(1);
    });

    it('should handle permission with parent', () => {
      const permission: PermissionGrantInfoDto = {
        name: 'AbpIdentity.Users.Create',
        displayName: 'Create Users',
        parentName: 'AbpIdentity.Users',
        isGranted: false,
        allowedProviders: ['R'],
        grantedProviders: [],
      };

      expect(permission.parentName).toBe('AbpIdentity.Users');
      expect(permission.isGranted).toBe(false);
    });

    it('should handle multiple granted providers', () => {
      const permission: PermissionGrantInfoDto = {
        name: 'AbpIdentity.Users',
        displayName: 'User Management',
        parentName: '',
        isGranted: true,
        allowedProviders: ['R', 'U'],
        grantedProviders: [
          { providerName: 'R', providerKey: 'admin' },
          { providerName: 'R', providerKey: 'moderator' },
          { providerName: 'U', providerKey: 'user-123' },
        ],
      };

      expect(permission.grantedProviders).toHaveLength(3);
      expect(permission.grantedProviders[0].providerName).toBe('R');
      expect(permission.grantedProviders[2].providerName).toBe('U');
    });

    it('should handle empty allowed providers', () => {
      const permission: PermissionGrantInfoDto = {
        name: 'SomePermission',
        displayName: 'Some Permission',
        parentName: '',
        isGranted: false,
        allowedProviders: [],
        grantedProviders: [],
      };

      expect(permission.allowedProviders).toEqual([]);
    });
  });

  describe('PermissionGroupDto', () => {
    it('should define permission group with name, displayName, and permissions', () => {
      const group: PermissionGroupDto = {
        name: 'IdentityManagement',
        displayName: 'Identity Management',
        permissions: [
          {
            name: 'AbpIdentity.Users',
            displayName: 'User Management',
            parentName: '',
            isGranted: true,
            allowedProviders: ['R'],
            grantedProviders: [],
          },
        ],
      };

      expect(group.name).toBe('IdentityManagement');
      expect(group.displayName).toBe('Identity Management');
      expect(group.permissions).toHaveLength(1);
    });

    it('should handle empty permissions array', () => {
      const group: PermissionGroupDto = {
        name: 'EmptyGroup',
        displayName: 'Empty Group',
        permissions: [],
      };

      expect(group.permissions).toEqual([]);
    });

    it('should handle multiple permissions in group', () => {
      const group: PermissionGroupDto = {
        name: 'IdentityManagement',
        displayName: 'Identity Management',
        permissions: [
          {
            name: 'AbpIdentity.Users',
            displayName: 'User Management',
            parentName: '',
            isGranted: true,
            allowedProviders: ['R'],
            grantedProviders: [],
          },
          {
            name: 'AbpIdentity.Users.Create',
            displayName: 'Create Users',
            parentName: 'AbpIdentity.Users',
            isGranted: true,
            allowedProviders: ['R'],
            grantedProviders: [],
          },
          {
            name: 'AbpIdentity.Roles',
            displayName: 'Role Management',
            parentName: '',
            isGranted: false,
            allowedProviders: ['R'],
            grantedProviders: [],
          },
        ],
      };

      expect(group.permissions).toHaveLength(3);
      expect(group.permissions[0].name).toBe('AbpIdentity.Users');
      expect(group.permissions[1].parentName).toBe('AbpIdentity.Users');
      expect(group.permissions[2].isGranted).toBe(false);
    });
  });

  describe('GetPermissionListResultDto', () => {
    it('should define result with entityDisplayName and groups', () => {
      const result: GetPermissionListResultDto = {
        entityDisplayName: 'Admin Role',
        groups: [
          {
            name: 'IdentityManagement',
            displayName: 'Identity Management',
            permissions: [],
          },
        ],
      };

      expect(result.entityDisplayName).toBe('Admin Role');
      expect(result.groups).toHaveLength(1);
    });

    it('should handle empty groups array', () => {
      const result: GetPermissionListResultDto = {
        entityDisplayName: 'Empty Entity',
        groups: [],
      };

      expect(result.groups).toEqual([]);
    });

    it('should handle multiple groups', () => {
      const result: GetPermissionListResultDto = {
        entityDisplayName: 'Super Admin',
        groups: [
          {
            name: 'IdentityManagement',
            displayName: 'Identity Management',
            permissions: [],
          },
          {
            name: 'TenantManagement',
            displayName: 'Tenant Management',
            permissions: [],
          },
          {
            name: 'SettingManagement',
            displayName: 'Setting Management',
            permissions: [],
          },
        ],
      };

      expect(result.groups).toHaveLength(3);
      expect(result.groups[0].name).toBe('IdentityManagement');
      expect(result.groups[1].name).toBe('TenantManagement');
      expect(result.groups[2].name).toBe('SettingManagement');
    });

    it('should handle complete nested structure', () => {
      const result: GetPermissionListResultDto = {
        entityDisplayName: 'Admin Role',
        groups: [
          {
            name: 'IdentityManagement',
            displayName: 'Identity Management',
            permissions: [
              {
                name: 'AbpIdentity.Users',
                displayName: 'User Management',
                parentName: '',
                isGranted: true,
                allowedProviders: ['R', 'U'],
                grantedProviders: [
                  { providerName: 'R', providerKey: 'admin' },
                ],
              },
              {
                name: 'AbpIdentity.Users.Create',
                displayName: 'Create Users',
                parentName: 'AbpIdentity.Users',
                isGranted: true,
                allowedProviders: ['R'],
                grantedProviders: [
                  { providerName: 'R', providerKey: 'admin' },
                ],
              },
            ],
          },
        ],
      };

      expect(result.entityDisplayName).toBe('Admin Role');
      expect(result.groups[0].permissions).toHaveLength(2);
      expect(result.groups[0].permissions[0].grantedProviders[0].providerKey).toBe('admin');
    });
  });

  describe('UpdatePermissionDto', () => {
    it('should define single permission update with name and isGranted', () => {
      const update: UpdatePermissionDto = {
        name: 'AbpIdentity.Users',
        isGranted: true,
      };

      expect(update.name).toBe('AbpIdentity.Users');
      expect(update.isGranted).toBe(true);
    });

    it('should handle isGranted as false', () => {
      const update: UpdatePermissionDto = {
        name: 'AbpIdentity.Roles',
        isGranted: false,
      };

      expect(update.isGranted).toBe(false);
    });
  });

  describe('UpdatePermissionsDto', () => {
    it('should define batch update with permissions array', () => {
      const update: UpdatePermissionsDto = {
        permissions: [
          { name: 'AbpIdentity.Users', isGranted: true },
          { name: 'AbpIdentity.Roles', isGranted: false },
        ],
      };

      expect(update.permissions).toHaveLength(2);
      expect(update.permissions[0].isGranted).toBe(true);
      expect(update.permissions[1].isGranted).toBe(false);
    });

    it('should handle empty permissions array', () => {
      const update: UpdatePermissionsDto = {
        permissions: [],
      };

      expect(update.permissions).toEqual([]);
    });

    it('should handle single permission update', () => {
      const update: UpdatePermissionsDto = {
        permissions: [
          { name: 'AbpIdentity.Users.Create', isGranted: true },
        ],
      };

      expect(update.permissions).toHaveLength(1);
    });

    it('should handle large batch of permissions', () => {
      const permissions: UpdatePermissionDto[] = [];
      for (let i = 0; i < 50; i++) {
        permissions.push({
          name: `Permission.${i}`,
          isGranted: i % 2 === 0,
        });
      }

      const update: UpdatePermissionsDto = { permissions };

      expect(update.permissions).toHaveLength(50);
      expect(update.permissions[0].isGranted).toBe(true);
      expect(update.permissions[1].isGranted).toBe(false);
    });
  });
});
