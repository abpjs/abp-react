import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AccountProService } from '../services/account-pro.service';
import type { RestService } from '@abpjs/core';

describe('AccountProService', () => {
  let service: AccountProService;
  let mockRest: RestService;

  beforeEach(() => {
    mockRest = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as RestService;
    service = new AccountProService(mockRest);
  });

  describe('apiName (v2.4.0)', () => {
    it('should have apiName property set to default', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow apiName to be modified', () => {
      service.apiName = 'custom-api';
      expect(service.apiName).toBe('custom-api');
    });
  });

  describe('findTenant', () => {
    it('should call GET with correct URL', async () => {
      const mockResponse = { success: true, tenantId: '123' };
      (mockRest.get as any).mockResolvedValue(mockResponse);

      const result = await service.findTenant('test-tenant');

      expect(mockRest.get).toHaveBeenCalledWith('/api/abp/multi-tenancy/tenants/by-name/test-tenant');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('should call POST with correct URL and body', async () => {
      const mockResponse = { id: '123', userName: 'testuser' };
      (mockRest.post as any).mockResolvedValue(mockResponse);

      const body = {
        userName: 'testuser',
        emailAddress: 'test@example.com',
        password: 'Test123!',
      };
      const result = await service.register(body);

      expect(mockRest.post).toHaveBeenCalledWith('/api/account/register', body, { skipHandleError: true });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('sendPasswordResetCode', () => {
    it('should call POST with correct URL and body', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      const body = { email: 'test@example.com' };
      await service.sendPasswordResetCode(body);

      expect(mockRest.post).toHaveBeenCalledWith('/api/account/send-password-reset-code', body, { skipHandleError: true });
    });
  });

  describe('resetPassword', () => {
    it('should call POST with correct URL and body', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      const body = {
        userId: '123',
        resetToken: 'token123',
        password: 'NewPass123!',
      };
      await service.resetPassword(body);

      expect(mockRest.post).toHaveBeenCalledWith('/api/account/reset-password', body, { skipHandleError: true });
    });
  });

  describe('changePassword', () => {
    it('should call POST with correct URL and body', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      const body = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
      };
      await service.changePassword(body);

      expect(mockRest.post).toHaveBeenCalledWith('/api/identity/my-profile/change-password', body, { skipHandleError: true });
    });
  });

  describe('getProfile', () => {
    it('should call GET with correct URL', async () => {
      const mockResponse = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
      };
      (mockRest.get as any).mockResolvedValue(mockResponse);

      const result = await service.getProfile();

      expect(mockRest.get).toHaveBeenCalledWith('/api/identity/my-profile');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateProfile', () => {
    it('should call PUT with correct URL and body', async () => {
      const mockResponse = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Updated',
        surname: 'User',
      };
      (mockRest.put as any).mockResolvedValue(mockResponse);

      const body = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Updated',
        surname: 'User',
      };
      const result = await service.updateProfile(body);

      expect(mockRest.put).toHaveBeenCalledWith('/api/identity/my-profile', body, { skipHandleError: true });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('sendPhoneNumberConfirmationToken (v2.4.0)', () => {
    it('should call POST with correct URL', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      await service.sendPhoneNumberConfirmationToken();

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/send-phone-number-confirmation-token',
        undefined,
        { skipHandleError: true }
      );
    });

    it('should handle successful response', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      const result = await service.sendPhoneNumberConfirmationToken();

      expect(result).toBeUndefined();
    });

    it('should propagate errors', async () => {
      const error = new Error('Failed to send token');
      (mockRest.post as any).mockRejectedValue(error);

      await expect(service.sendPhoneNumberConfirmationToken()).rejects.toThrow('Failed to send token');
    });
  });

  describe('confirmPhoneNumber (v2.4.0)', () => {
    it('should call POST with correct URL and token', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      await service.confirmPhoneNumber('123456');

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/confirm-phone-number',
        { token: '123456' },
        { skipHandleError: true }
      );
    });

    it('should handle successful confirmation', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      const result = await service.confirmPhoneNumber('valid-token');

      expect(result).toBeUndefined();
    });

    it('should propagate errors for invalid token', async () => {
      const error = new Error('Invalid token');
      (mockRest.post as any).mockRejectedValue(error);

      await expect(service.confirmPhoneNumber('invalid-token')).rejects.toThrow('Invalid token');
    });

    it('should handle empty token', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      await service.confirmPhoneNumber('');

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/confirm-phone-number',
        { token: '' },
        { skipHandleError: true }
      );
    });
  });
});
