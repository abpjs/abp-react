import { describe, it, expect } from 'vitest';
import type { UserData } from '../../../proxy/users/models';

/**
 * Tests for Users Proxy Models (v3.2.0)
 * Type validation tests for UserData.
 */
describe('Users Proxy Models (v3.2.0)', () => {
  describe('UserData', () => {
    it('should have all required properties', () => {
      const userData: UserData = {
        id: 'user-1',
        tenantId: 'tenant-123',
        userName: 'admin',
        name: 'Admin',
        surname: 'User',
        email: 'admin@example.com',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: false,
      };
      expect(userData.id).toBe('user-1');
      expect(userData.userName).toBe('admin');
      expect(userData.email).toBe('admin@example.com');
    });

    it('should allow optional tenantId', () => {
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
      expect(userData.tenantId).toBeUndefined();
    });

    it('should handle confirmed email', () => {
      const userData: UserData = {
        id: 'user-1',
        userName: 'confirmeduser',
        name: 'Confirmed',
        surname: 'User',
        email: 'confirmed@example.com',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: true,
      };
      expect(userData.emailConfirmed).toBe(true);
      expect(userData.phoneNumberConfirmed).toBe(true);
    });

    it('should handle unconfirmed contact info', () => {
      const userData: UserData = {
        id: 'user-2',
        userName: 'newuser',
        name: 'New',
        surname: 'User',
        email: 'new@example.com',
        emailConfirmed: false,
        phoneNumber: '+0987654321',
        phoneNumberConfirmed: false,
      };
      expect(userData.emailConfirmed).toBe(false);
      expect(userData.phoneNumberConfirmed).toBe(false);
    });

    it('should handle empty phone number', () => {
      const userData: UserData = {
        id: 'user-3',
        userName: 'nophone',
        name: 'No',
        surname: 'Phone',
        email: 'nophone@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };
      expect(userData.phoneNumber).toBe('');
    });

    it('should handle multi-tenant scenario', () => {
      const tenant1User: UserData = {
        id: 'user-1',
        tenantId: 'tenant-1',
        userName: 'admin',
        name: 'Tenant1',
        surname: 'Admin',
        email: 'admin@tenant1.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      const tenant2User: UserData = {
        id: 'user-2',
        tenantId: 'tenant-2',
        userName: 'admin',
        name: 'Tenant2',
        surname: 'Admin',
        email: 'admin@tenant2.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
      };

      expect(tenant1User.tenantId).toBe('tenant-1');
      expect(tenant2User.tenantId).toBe('tenant-2');
      expect(tenant1User.userName).toBe(tenant2User.userName);
    });
  });
});
