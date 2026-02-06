/**
 * Tests for Identity Pro Models
 * @abpjs/identity-pro v2.9.0
 */
import { describe, it, expect } from 'vitest';
import { Identity, createOrganizationUnitWithDetailsDto } from '../../models';

describe('Identity namespace', () => {
  describe('ChangePasswordRequest (v2.7.0)', () => {
    it('should accept valid password request object', () => {
      const request: Identity.ChangePasswordRequest = {
        newPassword: 'SecurePassword123!',
      };

      expect(request.newPassword).toBe('SecurePassword123!');
    });

    it('should accept complex password strings', () => {
      const request: Identity.ChangePasswordRequest = {
        newPassword: 'C0mpl3x!P@ssw0rd#2024$%^&*()',
      };

      expect(request.newPassword).toBe('C0mpl3x!P@ssw0rd#2024$%^&*()');
    });

    it('should accept empty string (validation should be server-side)', () => {
      const request: Identity.ChangePasswordRequest = {
        newPassword: '',
      };

      expect(request.newPassword).toBe('');
    });

    it('should be usable in function parameters', () => {
      const mockChangePassword = (id: string, body: Identity.ChangePasswordRequest): boolean => {
        return body.newPassword.length > 0;
      };

      expect(mockChangePassword('user-1', { newPassword: 'Password123!' })).toBe(true);
      expect(mockChangePassword('user-1', { newPassword: '' })).toBe(false);
    });

    it('should be distinct from UserSaveRequest', () => {
      const passwordRequest: Identity.ChangePasswordRequest = {
        newPassword: 'Password123!',
      };

      const userRequest: Identity.UserSaveRequest = {
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'Password123!',
        roleNames: ['User'],
        organizationUnitIds: [],
      };

      // ChangePasswordRequest only has newPassword
      expect(Object.keys(passwordRequest)).toHaveLength(1);
      expect(Object.keys(passwordRequest)).toContain('newPassword');

      // UserSaveRequest has password and other fields
      expect(Object.keys(userRequest)).toContain('password');
      expect(Object.keys(userRequest)).not.toContain('newPassword');
    });

    it('should work with spread operator', () => {
      const baseRequest: Identity.ChangePasswordRequest = {
        newPassword: 'OldPassword123!',
      };

      const updatedRequest: Identity.ChangePasswordRequest = {
        ...baseRequest,
        newPassword: 'NewPassword456!',
      };

      expect(updatedRequest.newPassword).toBe('NewPassword456!');
    });
  });

  describe('existing types validation', () => {
    it('should have RoleItem interface', () => {
      const role: Identity.RoleItem = {
        id: 'role-1',
        name: 'Admin',
        isDefault: false,
        isPublic: true,
        isStatic: false,
        concurrencyStamp: 'stamp',
      };

      expect(role.id).toBe('role-1');
      expect(role.name).toBe('Admin');
    });

    it('should have UserItem interface', () => {
      const user: Identity.UserItem = {
        id: 'user-1',
        userName: 'admin',
        name: 'Admin',
        surname: 'User',
        email: 'admin@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        tenantId: '',
        emailConfirmed: true,
        phoneNumberConfirmed: false,
        isLockedOut: false,
        concurrencyStamp: 'stamp',
      };

      expect(user.id).toBe('user-1');
      expect(user.userName).toBe('admin');
    });

    it('should have ClaimType interface', () => {
      const claimType: Identity.ClaimType = {
        id: 'claim-1',
        name: 'email',
        required: true,
        isStatic: true,
        regex: '',
        regexDescription: '',
        description: 'Email claim',
        valueType: Identity.ClaimValueType.String,
      };

      expect(claimType.name).toBe('email');
      expect(claimType.valueType).toBe(0);
    });

    it('should have ClaimValueType enum', () => {
      expect(Identity.ClaimValueType.String).toBe(0);
      expect(Identity.ClaimValueType.Int).toBe(1);
      expect(Identity.ClaimValueType.Boolean).toBe(2);
      expect(Identity.ClaimValueType.DateTime).toBe(3);
    });
  });

  describe('UserSaveRequest with organizationUnitIds (v2.9.0)', () => {
    it('should include organizationUnitIds property', () => {
      const userRequest: Identity.UserSaveRequest = {
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'Password123!',
        roleNames: ['User'],
        organizationUnitIds: ['unit-1', 'unit-2'],
      };

      expect(userRequest.organizationUnitIds).toHaveLength(2);
      expect(userRequest.organizationUnitIds).toContain('unit-1');
      expect(userRequest.organizationUnitIds).toContain('unit-2');
    });

    it('should accept empty organizationUnitIds array', () => {
      const userRequest: Identity.UserSaveRequest = {
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'Password123!',
        roleNames: [],
        organizationUnitIds: [],
      };

      expect(userRequest.organizationUnitIds).toEqual([]);
    });

    it('should work with user creation containing multiple organization units', () => {
      const createUserData: Identity.UserSaveRequest = {
        userName: 'newemployee',
        name: 'New',
        surname: 'Employee',
        email: 'new.employee@company.com',
        phoneNumber: '+1234567890',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'InitialPassword123!',
        roleNames: ['Employee', 'TeamMember'],
        organizationUnitIds: ['engineering', 'frontend-team', 'project-x'],
      };

      expect(createUserData.organizationUnitIds).toHaveLength(3);
      expect(createUserData.roleNames).toHaveLength(2);
    });
  });

  describe('State with organizationUnits (v2.9.0)', () => {
    it('should include organizationUnits in State interface', () => {
      const state: Identity.State = {
        roles: { items: [], totalCount: 0 },
        users: { items: [], totalCount: 0 },
        selectedRole: {} as Identity.RoleItem,
        selectedUser: {} as Identity.UserItem,
        selectedUserRoles: [],
        claimTypes: [],
        claims: { items: [], totalCount: 0 },
        selectedClaim: {} as Identity.ClaimType,
        organizationUnits: { items: [], totalCount: 0 },
      };

      expect(state.organizationUnits).toBeDefined();
      expect(state.organizationUnits.items).toEqual([]);
      expect(state.organizationUnits.totalCount).toBe(0);
    });

    it('should store organization units with full details', () => {
      const orgUnits = [
        createOrganizationUnitWithDetailsDto({
          id: 'unit-1',
          displayName: 'Engineering',
          code: '00001',
        }),
        createOrganizationUnitWithDetailsDto({
          id: 'unit-2',
          displayName: 'Marketing',
          code: '00002',
        }),
      ];

      const state: Identity.State = {
        roles: { items: [], totalCount: 0 },
        users: { items: [], totalCount: 0 },
        selectedRole: {} as Identity.RoleItem,
        selectedUser: {} as Identity.UserItem,
        selectedUserRoles: [],
        claimTypes: [],
        claims: { items: [], totalCount: 0 },
        selectedClaim: {} as Identity.ClaimType,
        organizationUnits: { items: orgUnits, totalCount: 2 },
      };

      expect(state.organizationUnits.items).toHaveLength(2);
      expect(state.organizationUnits.items[0].displayName).toBe('Engineering');
      expect(state.organizationUnits.items[1].displayName).toBe('Marketing');
    });
  });
});
