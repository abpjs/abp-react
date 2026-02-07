import { describe, it, expect } from 'vitest';
import type { Identity } from '../../models';
import type { IdentityRoleDto, IdentityUserDto } from '../../proxy/identity/models';

/**
 * @updated 4.0.0 - Removed deprecated legacy type tests (RoleItem, RoleSaveRequest, UserItem, UserSaveRequest, etc.)
 * These types were deleted in v4.0.0. Use IdentityRoleDto/IdentityUserDto from proxy models instead.
 */
describe('Identity Namespace', () => {
  describe('State Interface', () => {
    it('should define State interface with correct properties', () => {
      const state: Identity.State = {
        roles: { items: [], totalCount: 0 },
        users: { items: [], totalCount: 0 },
        selectedRole: {
          id: 'role-1',
          name: 'admin',
          isDefault: false,
          isPublic: true,
          isStatic: false,
          concurrencyStamp: 'stamp',
        },
        selectedUser: {
          id: 'user-1',
          userName: 'admin',
          name: 'Admin',
          surname: 'User',
          email: 'admin@example.com',
          phoneNumber: '123',
          twoFactorEnabled: false,
          lockoutEnabled: true,
          tenantId: 'tenant-1',
          emailConfirmed: true,
          phoneNumberConfirmed: false,
          isLockedOut: false,
          concurrencyStamp: 'stamp',
        },
        selectedUserRoles: [],
      };

      expect(state.roles).toBeDefined();
      expect(state.users).toBeDefined();
      expect(state.selectedRole).toBeDefined();
      expect(state.selectedUser).toBeDefined();
      expect(state.selectedUserRoles).toBeDefined();
    });
  });

  // v2.0.0 Component Interface Types
  // v4.0.0: Callbacks now use IdentityRoleDto/IdentityUserDto
  describe('RolesComponentInputs Interface (v2.0.0, updated v4.0.0)', () => {
    it('should define optional callback properties using IdentityRoleDto', () => {
      const inputs: Identity.RolesComponentInputs = {
        onRoleCreated: (role: IdentityRoleDto) => {
          expect(role.id).toBeDefined();
        },
        onRoleUpdated: (role: IdentityRoleDto) => {
          expect(role.name).toBeDefined();
        },
        onRoleDeleted: (id) => {
          expect(id).toBeDefined();
        },
      };

      expect(inputs.onRoleCreated).toBeDefined();
      expect(inputs.onRoleUpdated).toBeDefined();
      expect(inputs.onRoleDeleted).toBeDefined();
    });

    it('should allow all properties to be optional', () => {
      const inputs: Identity.RolesComponentInputs = {};

      expect(inputs.onRoleCreated).toBeUndefined();
      expect(inputs.onRoleUpdated).toBeUndefined();
      expect(inputs.onRoleDeleted).toBeUndefined();
    });

    it('should allow partial properties', () => {
      const inputs: Identity.RolesComponentInputs = {
        onRoleDeleted: (id) => console.log('Deleted:', id),
      };

      expect(inputs.onRoleCreated).toBeUndefined();
      expect(inputs.onRoleDeleted).toBeDefined();
    });
  });

  describe('RolesComponentOutputs Interface (v2.0.0)', () => {
    it('should define onVisiblePermissionChange callback', () => {
      const outputs: Identity.RolesComponentOutputs = {
        onVisiblePermissionChange: (visible) => {
          expect(typeof visible).toBe('boolean');
        },
      };

      expect(outputs.onVisiblePermissionChange).toBeDefined();
      outputs.onVisiblePermissionChange?.(true);
    });

    it('should allow onVisiblePermissionChange to be optional', () => {
      const outputs: Identity.RolesComponentOutputs = {};

      expect(outputs.onVisiblePermissionChange).toBeUndefined();
    });
  });

  describe('UsersComponentInputs Interface (v2.0.0, updated v4.0.0)', () => {
    it('should define all optional callback and config properties using IdentityUserDto', () => {
      const inputs: Identity.UsersComponentInputs = {
        onUserCreated: (user: IdentityUserDto) => {
          expect(user.id).toBeDefined();
        },
        onUserUpdated: (user: IdentityUserDto) => {
          expect(user.userName).toBeDefined();
        },
        onUserDeleted: (id) => {
          expect(id).toBeDefined();
        },
        passwordRulesArr: ['number', 'small', 'capital', 'special'],
        requiredPasswordLength: 8,
      };

      expect(inputs.onUserCreated).toBeDefined();
      expect(inputs.onUserUpdated).toBeDefined();
      expect(inputs.onUserDeleted).toBeDefined();
      expect(inputs.passwordRulesArr).toEqual(['number', 'small', 'capital', 'special']);
      expect(inputs.requiredPasswordLength).toBe(8);
    });

    it('should allow all properties to be optional', () => {
      const inputs: Identity.UsersComponentInputs = {};

      expect(inputs.onUserCreated).toBeUndefined();
      expect(inputs.onUserUpdated).toBeUndefined();
      expect(inputs.onUserDeleted).toBeUndefined();
      expect(inputs.passwordRulesArr).toBeUndefined();
      expect(inputs.requiredPasswordLength).toBeUndefined();
    });

    it('should validate passwordRulesArr with correct values', () => {
      const inputs: Identity.UsersComponentInputs = {
        passwordRulesArr: ['number'],
      };

      expect(inputs.passwordRulesArr).toContain('number');
    });

    it('should validate passwordRulesArr with all possible values', () => {
      const allRules: ('number' | 'small' | 'capital' | 'special')[] = [
        'number',
        'small',
        'capital',
        'special',
      ];

      const inputs: Identity.UsersComponentInputs = {
        passwordRulesArr: allRules,
      };

      expect(inputs.passwordRulesArr).toHaveLength(4);
      expect(inputs.passwordRulesArr).toContain('number');
      expect(inputs.passwordRulesArr).toContain('small');
      expect(inputs.passwordRulesArr).toContain('capital');
      expect(inputs.passwordRulesArr).toContain('special');
    });
  });

  describe('UsersComponentOutputs Interface (v2.0.0)', () => {
    it('should define onVisiblePermissionChange callback', () => {
      const outputs: Identity.UsersComponentOutputs = {
        onVisiblePermissionChange: (visible) => {
          expect(typeof visible).toBe('boolean');
        },
      };

      expect(outputs.onVisiblePermissionChange).toBeDefined();
      outputs.onVisiblePermissionChange?.(false);
    });

    it('should allow onVisiblePermissionChange to be optional', () => {
      const outputs: Identity.UsersComponentOutputs = {};

      expect(outputs.onVisiblePermissionChange).toBeUndefined();
    });

    it('should call onVisiblePermissionChange with boolean values', () => {
      let capturedValue: boolean | undefined;
      const outputs: Identity.UsersComponentOutputs = {
        onVisiblePermissionChange: (visible) => {
          capturedValue = visible;
        },
      };

      outputs.onVisiblePermissionChange?.(true);
      expect(capturedValue).toBe(true);

      outputs.onVisiblePermissionChange?.(false);
      expect(capturedValue).toBe(false);
    });
  });

  describe('Combined Component Props Pattern (v2.0.0)', () => {
    it('should allow combining RolesComponentInputs and RolesComponentOutputs', () => {
      type RolesProps = Identity.RolesComponentInputs & Identity.RolesComponentOutputs;

      const props: RolesProps = {
        onRoleCreated: (role) => console.log('Created:', role.name),
        onRoleDeleted: (id) => console.log('Deleted:', id),
        onVisiblePermissionChange: (visible) => console.log('Permission modal:', visible),
      };

      expect(props.onRoleCreated).toBeDefined();
      expect(props.onRoleDeleted).toBeDefined();
      expect(props.onVisiblePermissionChange).toBeDefined();
    });

    it('should allow combining UsersComponentInputs and UsersComponentOutputs', () => {
      type UsersProps = Identity.UsersComponentInputs & Identity.UsersComponentOutputs;

      const props: UsersProps = {
        onUserCreated: (user) => console.log('Created:', user.userName),
        passwordRulesArr: ['number', 'capital'],
        requiredPasswordLength: 6,
        onVisiblePermissionChange: (visible) => console.log('Permission modal:', visible),
      };

      expect(props.onUserCreated).toBeDefined();
      expect(props.passwordRulesArr).toHaveLength(2);
      expect(props.requiredPasswordLength).toBe(6);
      expect(props.onVisiblePermissionChange).toBeDefined();
    });
  });
});
