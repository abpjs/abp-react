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

  describe('PermissionManagement.State (v4.0.0)', () => {
    it('should define State interface with permissionRes using GetPermissionListResultDto', () => {
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

  describe('PermissionWithMargin (v4.0.0 - extends PermissionGrantInfoDto)', () => {
    it('should extend PermissionGrantInfoDto with margin property', () => {
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

  describe('PermissionWithStyle (v3.2.0, v4.0.0 - extends PermissionGrantInfoDto)', () => {
    it('should extend PermissionGrantInfoDto with style property', () => {
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

    it('should preserve all PermissionGrantInfoDto properties', () => {
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
});
