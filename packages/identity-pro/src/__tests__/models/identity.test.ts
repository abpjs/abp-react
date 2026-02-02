/**
 * Tests for Identity Pro Models
 * @abpjs/identity-pro v2.7.0
 */
import { describe, it, expect } from 'vitest';
import { Identity } from '../../models';

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
});
