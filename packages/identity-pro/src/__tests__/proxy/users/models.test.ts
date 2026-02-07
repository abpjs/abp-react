/**
 * Tests for User data models
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect } from 'vitest';
import type { UserData } from '../../../proxy/users/models';

describe('UserData', () => {
  describe('interface structure', () => {
    it('should accept valid user data with all fields', () => {
      const userData: UserData = {
        id: 'user-1',
        tenantId: 'tenant-1',
        userName: 'john.doe',
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: true,
      };

      expect(userData.id).toBe('user-1');
      expect(userData.tenantId).toBe('tenant-1');
      expect(userData.userName).toBe('john.doe');
      expect(userData.name).toBe('John');
      expect(userData.surname).toBe('Doe');
      expect(userData.email).toBe('john@example.com');
      expect(userData.emailConfirmed).toBe(true);
      expect(userData.phoneNumber).toBe('+1234567890');
      expect(userData.phoneNumberConfirmed).toBe(true);
    });

    it('should accept user data without tenantId', () => {
      const userData: UserData = {
        id: 'user-1',
        userName: 'admin',
        name: 'Admin',
        surname: 'User',
        email: 'admin@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      expect(userData.id).toBe('user-1');
      expect(userData.tenantId).toBeUndefined();
    });

    it('should accept user with unconfirmed email', () => {
      const userData: UserData = {
        id: 'user-1',
        userName: 'newuser',
        name: 'New',
        surname: 'User',
        email: 'newuser@example.com',
        emailConfirmed: false,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      expect(userData.emailConfirmed).toBe(false);
    });

    it('should accept user with empty phone number', () => {
      const userData: UserData = {
        id: 'user-1',
        userName: 'user',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      expect(userData.phoneNumber).toBe('');
      expect(userData.phoneNumberConfirmed).toBe(false);
    });

    it('should accept user with confirmed phone number', () => {
      const userData: UserData = {
        id: 'user-1',
        userName: 'verified',
        name: 'Verified',
        surname: 'User',
        email: 'verified@example.com',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: true,
      };

      expect(userData.phoneNumber).toBe('+1234567890');
      expect(userData.phoneNumberConfirmed).toBe(true);
    });
  });

  describe('user data validation patterns', () => {
    it('should support email format validation', () => {
      const validateEmail = (userData: UserData): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(userData.email);
      };

      const validUser: UserData = {
        id: 'user-1',
        userName: 'test',
        name: 'Test',
        surname: 'User',
        email: 'valid@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      expect(validateEmail(validUser)).toBe(true);
    });

    it('should support full name computation', () => {
      const getFullName = (userData: UserData): string => {
        return `${userData.name} ${userData.surname}`.trim();
      };

      const user: UserData = {
        id: 'user-1',
        userName: 'john.doe',
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      expect(getFullName(user)).toBe('John Doe');
    });

    it('should support verification status check', () => {
      const isFullyVerified = (userData: UserData): boolean => {
        return userData.emailConfirmed &&
               (userData.phoneNumber === '' || userData.phoneNumberConfirmed);
      };

      const fullyVerified: UserData = {
        id: 'user-1',
        userName: 'verified',
        name: 'Verified',
        surname: 'User',
        email: 'verified@example.com',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: true,
      };

      const partiallyVerified: UserData = {
        id: 'user-2',
        userName: 'partial',
        name: 'Partial',
        surname: 'User',
        email: 'partial@example.com',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: false,
      };

      const noPhoneVerified: UserData = {
        id: 'user-3',
        userName: 'nophone',
        name: 'No',
        surname: 'Phone',
        email: 'nophone@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      expect(isFullyVerified(fullyVerified)).toBe(true);
      expect(isFullyVerified(partiallyVerified)).toBe(false);
      expect(isFullyVerified(noPhoneVerified)).toBe(true);
    });
  });

  describe('multi-tenant scenarios', () => {
    it('should handle tenant-scoped user', () => {
      const user: UserData = {
        id: 'user-1',
        tenantId: 'tenant-abc',
        userName: 'tenant.user',
        name: 'Tenant',
        surname: 'User',
        email: 'tenant@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      expect(user.tenantId).toBe('tenant-abc');
    });

    it('should handle host user (no tenant)', () => {
      const user: UserData = {
        id: 'host-user-1',
        userName: 'host.admin',
        name: 'Host',
        surname: 'Admin',
        email: 'host@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      expect(user.tenantId).toBeUndefined();
    });

    it('should support tenant filtering', () => {
      const users: UserData[] = [
        {
          id: 'user-1',
          tenantId: 'tenant-a',
          userName: 'user1',
          name: 'User',
          surname: 'One',
          email: 'user1@example.com',
          emailConfirmed: true,
          phoneNumber: '',
          phoneNumberConfirmed: false,
        },
        {
          id: 'user-2',
          tenantId: 'tenant-b',
          userName: 'user2',
          name: 'User',
          surname: 'Two',
          email: 'user2@example.com',
          emailConfirmed: true,
          phoneNumber: '',
          phoneNumberConfirmed: false,
        },
        {
          id: 'user-3',
          tenantId: 'tenant-a',
          userName: 'user3',
          name: 'User',
          surname: 'Three',
          email: 'user3@example.com',
          emailConfirmed: true,
          phoneNumber: '',
          phoneNumberConfirmed: false,
        },
      ];

      const filterByTenant = (tenantId: string) =>
        users.filter((u) => u.tenantId === tenantId);

      expect(filterByTenant('tenant-a')).toHaveLength(2);
      expect(filterByTenant('tenant-b')).toHaveLength(1);
      expect(filterByTenant('tenant-c')).toHaveLength(0);
    });
  });

  describe('serialization', () => {
    it('should serialize to JSON', () => {
      const user: UserData = {
        id: 'user-1',
        tenantId: 'tenant-1',
        userName: 'john.doe',
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: true,
      };

      const json = JSON.stringify(user);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe('user-1');
      expect(parsed.userName).toBe('john.doe');
      expect(parsed.emailConfirmed).toBe(true);
    });

    it('should deserialize from JSON', () => {
      const json = `{
        "id": "user-1",
        "userName": "john.doe",
        "name": "John",
        "surname": "Doe",
        "email": "john@example.com",
        "emailConfirmed": true,
        "phoneNumber": "+1234567890",
        "phoneNumberConfirmed": false
      }`;

      const user: UserData = JSON.parse(json);

      expect(user.id).toBe('user-1');
      expect(user.tenantId).toBeUndefined();
      expect(user.emailConfirmed).toBe(true);
    });
  });
});
