import { describe, it, expect } from 'vitest';
import type { Identity } from '../../models';

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

  describe('RoleItem Interface', () => {
    it('should define RoleItem with all required properties', () => {
      const role: Identity.RoleItem = {
        id: 'role-1',
        name: 'admin',
        isDefault: true,
        isPublic: true,
        isStatic: false,
        concurrencyStamp: 'abc123',
      };

      expect(role.id).toBe('role-1');
      expect(role.name).toBe('admin');
      expect(role.isDefault).toBe(true);
      expect(role.isPublic).toBe(true);
      expect(role.isStatic).toBe(false);
      expect(role.concurrencyStamp).toBe('abc123');
    });
  });

  describe('RoleSaveRequest Interface', () => {
    it('should define RoleSaveRequest for creating/updating roles', () => {
      const request: Identity.RoleSaveRequest = {
        name: 'newRole',
        isDefault: false,
        isPublic: true,
      };

      expect(request.name).toBe('newRole');
      expect(request.isDefault).toBe(false);
      expect(request.isPublic).toBe(true);
    });
  });

  describe('UserItem Interface', () => {
    it('should define UserItem with all required properties', () => {
      const user: Identity.UserItem = {
        id: 'user-1',
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '555-1234',
        twoFactorEnabled: true,
        lockoutEnabled: true,
        tenantId: 'tenant-1',
        emailConfirmed: true,
        phoneNumberConfirmed: false,
        isLockedOut: false,
        concurrencyStamp: 'xyz789',
      };

      expect(user.id).toBe('user-1');
      expect(user.userName).toBe('testuser');
      expect(user.name).toBe('Test');
      expect(user.surname).toBe('User');
      expect(user.email).toBe('test@example.com');
      expect(user.phoneNumber).toBe('555-1234');
      expect(user.twoFactorEnabled).toBe(true);
      expect(user.lockoutEnabled).toBe(true);
      expect(user.tenantId).toBe('tenant-1');
      expect(user.emailConfirmed).toBe(true);
      expect(user.phoneNumberConfirmed).toBe(false);
      expect(user.isLockedOut).toBe(false);
      expect(user.concurrencyStamp).toBe('xyz789');
    });
  });

  describe('UserSaveRequest Interface', () => {
    it('should define UserSaveRequest for creating/updating users', () => {
      const request: Identity.UserSaveRequest = {
        userName: 'newuser',
        name: 'New',
        surname: 'User',
        email: 'new@example.com',
        phoneNumber: '555-0000',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'SecurePassword123!',
        roleNames: ['admin', 'user'],
      };

      expect(request.userName).toBe('newuser');
      expect(request.password).toBe('SecurePassword123!');
      expect(request.roleNames).toEqual(['admin', 'user']);
    });
  });

  // v2.0.0 Component Interface Types
  describe('RolesComponentInputs Interface (v2.0.0)', () => {
    it('should define optional callback properties', () => {
      const inputs: Identity.RolesComponentInputs = {
        onRoleCreated: (role) => {
          expect(role.id).toBeDefined();
        },
        onRoleUpdated: (role) => {
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

  describe('UsersComponentInputs Interface (v2.0.0)', () => {
    it('should define all optional callback and config properties', () => {
      const inputs: Identity.UsersComponentInputs = {
        onUserCreated: (user) => {
          expect(user.id).toBeDefined();
        },
        onUserUpdated: (user) => {
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
