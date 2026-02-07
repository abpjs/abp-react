import { describe, it, expect } from 'vitest';
import type { PermissionManagement, PermissionWithMargin, PermissionWithStyle } from '../../models';

describe('PermissionManagement models', () => {
  describe('PermissionManagementComponentInputs (v2.0.0)', () => {
    it('should define all required input properties', () => {
      const inputs: PermissionManagement.PermissionManagementComponentInputs = {
        visible: true,
        providerName: 'R',
        providerKey: 'role-id-123',
        hideBadges: false,
      };

      expect(inputs.visible).toBe(true);
      expect(inputs.providerName).toBe('R');
      expect(inputs.providerKey).toBe('role-id-123');
      expect(inputs.hideBadges).toBe(false);
    });

    it('should accept visible as false', () => {
      const inputs: PermissionManagement.PermissionManagementComponentInputs = {
        visible: false,
        providerName: 'U',
        providerKey: 'user-id-456',
        hideBadges: true,
      };

      expect(inputs.visible).toBe(false);
    });

    it('should accept different provider types', () => {
      const roleInputs: PermissionManagement.PermissionManagementComponentInputs = {
        visible: true,
        providerName: 'R',
        providerKey: 'admin-role',
        hideBadges: false,
      };

      const userInputs: PermissionManagement.PermissionManagementComponentInputs = {
        visible: true,
        providerName: 'U',
        providerKey: 'user-123',
        hideBadges: false,
      };

      expect(roleInputs.providerName).toBe('R');
      expect(userInputs.providerName).toBe('U');
    });

    it('should accept hideBadges as true', () => {
      const inputs: PermissionManagement.PermissionManagementComponentInputs = {
        visible: true,
        providerName: 'R',
        providerKey: 'role-id',
        hideBadges: true,
      };

      expect(inputs.hideBadges).toBe(true);
    });

    it('should handle empty provider key', () => {
      const inputs: PermissionManagement.PermissionManagementComponentInputs = {
        visible: true,
        providerName: 'R',
        providerKey: '',
        hideBadges: false,
      };

      expect(inputs.providerKey).toBe('');
    });
  });

  describe('PermissionManagementComponentOutputs (v2.0.0)', () => {
    it('should define optional visibleChange callback', () => {
      const outputs: PermissionManagement.PermissionManagementComponentOutputs = {
        visibleChange: (visible: boolean) => {
          expect(typeof visible).toBe('boolean');
        },
      };

      expect(typeof outputs.visibleChange).toBe('function');
      outputs.visibleChange?.(true);
    });

    it('should allow undefined visibleChange', () => {
      const outputs: PermissionManagement.PermissionManagementComponentOutputs = {};

      expect(outputs.visibleChange).toBeUndefined();
    });

    it('should handle visibleChange with true', () => {
      let capturedValue: boolean | undefined;
      const outputs: PermissionManagement.PermissionManagementComponentOutputs = {
        visibleChange: (visible: boolean) => {
          capturedValue = visible;
        },
      };

      outputs.visibleChange?.(true);
      expect(capturedValue).toBe(true);
    });

    it('should handle visibleChange with false', () => {
      let capturedValue: boolean | undefined;
      const outputs: PermissionManagement.PermissionManagementComponentOutputs = {
        visibleChange: (visible: boolean) => {
          capturedValue = visible;
        },
      };

      outputs.visibleChange?.(false);
      expect(capturedValue).toBe(false);
    });
  });

  describe('PermissionManagement.State', () => {
    it('should define State interface with permissionRes', () => {
      const state: PermissionManagement.State = {
        permissionRes: {
          entityDisplayName: 'Admin',
          groups: [],
        },
      };

      expect(state.permissionRes.entityDisplayName).toBe('Admin');
      expect(state.permissionRes.groups).toEqual([]);
    });
  });

  describe('PermissionManagement.Response', () => {
    it('should define Response with entityDisplayName and groups', () => {
      const response: PermissionManagement.Response = {
        entityDisplayName: 'Test Entity',
        groups: [
          {
            name: 'TestGroup',
            displayName: 'Test Group',
            permissions: [],
          },
        ],
      };

      expect(response.entityDisplayName).toBe('Test Entity');
      expect(response.groups).toHaveLength(1);
    });
  });

  describe('PermissionManagement.Group', () => {
    it('should define Group with name, displayName, and permissions', () => {
      const group: PermissionManagement.Group = {
        name: 'IdentityManagement',
        displayName: 'Identity Management',
        permissions: [
          {
            name: 'AbpIdentity.Users',
            displayName: 'User Management',
            isGranted: true,
            parentName: '',
            allowedProviders: ['R', 'U'],
            grantedProviders: [],
          },
        ],
      };

      expect(group.name).toBe('IdentityManagement');
      expect(group.displayName).toBe('Identity Management');
      expect(group.permissions).toHaveLength(1);
    });
  });

  describe('PermissionManagement.Permission', () => {
    it('should define Permission with all properties', () => {
      const permission: PermissionManagement.Permission = {
        name: 'AbpIdentity.Users',
        displayName: 'User Management',
        isGranted: true,
        parentName: '',
        allowedProviders: ['R', 'U'],
        grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
      };

      expect(permission.name).toBe('AbpIdentity.Users');
      expect(permission.displayName).toBe('User Management');
      expect(permission.isGranted).toBe(true);
      expect(permission.parentName).toBe('');
      expect(permission.allowedProviders).toEqual(['R', 'U']);
      expect(permission.grantedProviders).toHaveLength(1);
    });

    it('should handle permission with parent', () => {
      const permission: PermissionManagement.Permission = {
        name: 'AbpIdentity.Users.Create',
        displayName: 'Create Users',
        isGranted: false,
        parentName: 'AbpIdentity.Users',
        allowedProviders: ['R'],
        grantedProviders: [],
      };

      expect(permission.parentName).toBe('AbpIdentity.Users');
    });
  });

  describe('PermissionManagement.MinimumPermission', () => {
    it('should define MinimumPermission with name and isGranted', () => {
      const minPermission: PermissionManagement.MinimumPermission = {
        name: 'AbpIdentity.Users',
        isGranted: true,
      };

      expect(minPermission.name).toBe('AbpIdentity.Users');
      expect(minPermission.isGranted).toBe(true);
    });
  });

  describe('PermissionManagement.GrantedProvider', () => {
    it('should define GrantedProvider with providerName and providerKey', () => {
      const provider: PermissionManagement.GrantedProvider = {
        providerName: 'R',
        providerKey: 'admin',
      };

      expect(provider.providerName).toBe('R');
      expect(provider.providerKey).toBe('admin');
    });
  });

  describe('PermissionManagement.UpdateRequest', () => {
    it('should define UpdateRequest with permissions, providerKey, providerName', () => {
      const request: PermissionManagement.UpdateRequest = {
        permissions: [
          { name: 'AbpIdentity.Users', isGranted: true },
          { name: 'AbpIdentity.Roles', isGranted: false },
        ],
        providerKey: 'role-id',
        providerName: 'R',
      };

      expect(request.permissions).toHaveLength(2);
      expect(request.providerKey).toBe('role-id');
      expect(request.providerName).toBe('R');
    });
  });

  describe('PermissionManagement.GetPermissionsParams', () => {
    it('should define GetPermissionsParams with providerKey and providerName', () => {
      const params: PermissionManagement.GetPermissionsParams = {
        providerKey: 'user-id-123',
        providerName: 'U',
      };

      expect(params.providerKey).toBe('user-id-123');
      expect(params.providerName).toBe('U');
    });
  });

  describe('PermissionWithMargin', () => {
    it('should extend Permission with margin property', () => {
      const permissionWithMargin: PermissionWithMargin = {
        name: 'AbpIdentity.Users.Create',
        displayName: 'Create Users',
        isGranted: true,
        parentName: 'AbpIdentity.Users',
        allowedProviders: ['R'],
        grantedProviders: [],
        margin: 24,
      };

      expect(permissionWithMargin.margin).toBe(24);
      expect(permissionWithMargin.name).toBe('AbpIdentity.Users.Create');
    });

    it('should handle zero margin', () => {
      const permissionWithMargin: PermissionWithMargin = {
        name: 'AbpIdentity.Users',
        displayName: 'User Management',
        isGranted: true,
        parentName: '',
        allowedProviders: ['R'],
        grantedProviders: [],
        margin: 0,
      };

      expect(permissionWithMargin.margin).toBe(0);
    });

    it('should handle nested margin levels', () => {
      const level1: PermissionWithMargin = {
        name: 'AbpIdentity.Users',
        displayName: 'Users',
        isGranted: true,
        parentName: '',
        allowedProviders: ['R'],
        grantedProviders: [],
        margin: 0,
      };

      const level2: PermissionWithMargin = {
        name: 'AbpIdentity.Users.Create',
        displayName: 'Create Users',
        isGranted: true,
        parentName: 'AbpIdentity.Users',
        allowedProviders: ['R'],
        grantedProviders: [],
        margin: 24,
      };

      const level3: PermissionWithMargin = {
        name: 'AbpIdentity.Users.Create.Advanced',
        displayName: 'Advanced Create',
        isGranted: false,
        parentName: 'AbpIdentity.Users.Create',
        allowedProviders: ['R'],
        grantedProviders: [],
        margin: 48,
      };

      expect(level1.margin).toBe(0);
      expect(level2.margin).toBe(24);
      expect(level3.margin).toBe(48);
    });
  });

  describe('PermissionWithStyle (v3.2.0)', () => {
    it('should extend Permission with style property', () => {
      const permissionWithStyle: PermissionWithStyle = {
        name: 'AbpIdentity.Users.Create',
        displayName: 'Create Users',
        isGranted: true,
        parentName: 'AbpIdentity.Users',
        allowedProviders: ['R'],
        grantedProviders: [],
        style: 'margin-left: 24px',
      };

      expect(permissionWithStyle.style).toBe('margin-left: 24px');
      expect(permissionWithStyle.name).toBe('AbpIdentity.Users.Create');
    });

    it('should handle empty style string', () => {
      const permissionWithStyle: PermissionWithStyle = {
        name: 'AbpIdentity.Users',
        displayName: 'User Management',
        isGranted: true,
        parentName: '',
        allowedProviders: ['R'],
        grantedProviders: [],
        style: '',
      };

      expect(permissionWithStyle.style).toBe('');
    });

    it('should handle complex style values', () => {
      const permissionWithStyle: PermissionWithStyle = {
        name: 'AbpIdentity.Users.Create',
        displayName: 'Create Users',
        isGranted: true,
        parentName: 'AbpIdentity.Users',
        allowedProviders: ['R'],
        grantedProviders: [],
        style: 'margin-left: 24px; padding: 8px; border-left: 2px solid gray',
      };

      expect(permissionWithStyle.style).toContain('margin-left: 24px');
      expect(permissionWithStyle.style).toContain('padding: 8px');
    });

    it('should handle nested style levels', () => {
      const level1: PermissionWithStyle = {
        name: 'AbpIdentity.Users',
        displayName: 'Users',
        isGranted: true,
        parentName: '',
        allowedProviders: ['R'],
        grantedProviders: [],
        style: '',
      };

      const level2: PermissionWithStyle = {
        name: 'AbpIdentity.Users.Create',
        displayName: 'Create Users',
        isGranted: true,
        parentName: 'AbpIdentity.Users',
        allowedProviders: ['R'],
        grantedProviders: [],
        style: 'margin-left: 24px',
      };

      const level3: PermissionWithStyle = {
        name: 'AbpIdentity.Users.Create.Advanced',
        displayName: 'Advanced Create',
        isGranted: false,
        parentName: 'AbpIdentity.Users.Create',
        allowedProviders: ['R'],
        grantedProviders: [],
        style: 'margin-left: 48px',
      };

      expect(level1.style).toBe('');
      expect(level2.style).toBe('margin-left: 24px');
      expect(level3.style).toBe('margin-left: 48px');
    });

    it('should preserve all Permission properties', () => {
      const permission: PermissionWithStyle = {
        name: 'AbpIdentity.Roles',
        displayName: 'Role Management',
        isGranted: false,
        parentName: '',
        allowedProviders: ['R', 'U'],
        grantedProviders: [
          { providerName: 'R', providerKey: 'admin' },
        ],
        style: 'font-weight: bold',
      };

      expect(permission.name).toBe('AbpIdentity.Roles');
      expect(permission.displayName).toBe('Role Management');
      expect(permission.isGranted).toBe(false);
      expect(permission.parentName).toBe('');
      expect(permission.allowedProviders).toEqual(['R', 'U']);
      expect(permission.grantedProviders).toHaveLength(1);
      expect(permission.style).toBe('font-weight: bold');
    });
  });

  describe('Deprecated types (v3.2.0)', () => {
    // Note: These types are deprecated but still supported for backwards compatibility
    // Tests verify they still work as expected

    it('should still support deprecated Response type', () => {
      // @deprecated - use GetPermissionListResultDto from proxy instead
      const response: PermissionManagement.Response = {
        entityDisplayName: 'Test',
        groups: [],
      };

      expect(response.entityDisplayName).toBe('Test');
    });

    it('should still support deprecated Group type', () => {
      // @deprecated - use PermissionGroupDto from proxy instead
      const group: PermissionManagement.Group = {
        name: 'Test',
        displayName: 'Test Group',
        permissions: [],
      };

      expect(group.name).toBe('Test');
    });

    it('should still support deprecated MinimumPermission type', () => {
      // @deprecated - use UpdatePermissionDto from proxy instead
      const minPerm: PermissionManagement.MinimumPermission = {
        name: 'Test',
        isGranted: true,
      };

      expect(minPerm.name).toBe('Test');
    });

    it('should still support deprecated UpdateRequest type', () => {
      // @deprecated - use UpdatePermissionsDto from proxy instead
      const request: PermissionManagement.UpdateRequest = {
        permissions: [],
        providerKey: 'key',
        providerName: 'R',
      };

      expect(request.providerName).toBe('R');
    });

    it('should still support deprecated PermissionWithMargin type', () => {
      // @deprecated - use PermissionWithStyle instead
      const perm: PermissionWithMargin = {
        name: 'Test',
        displayName: 'Test',
        isGranted: true,
        parentName: '',
        allowedProviders: [],
        grantedProviders: [],
        margin: 24,
      };

      expect(perm.margin).toBe(24);
    });
  });
});
