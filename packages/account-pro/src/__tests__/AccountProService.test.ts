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

  describe('sendEmailConfirmationToken (v3.1.0)', () => {
    it('should call POST with correct URL and email', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      await service.sendEmailConfirmationToken('new@example.com');

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/send-email-confirmation-token',
        { newEmail: 'new@example.com' },
        { skipHandleError: true }
      );
    });

    it('should handle successful response', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      const result = await service.sendEmailConfirmationToken('test@example.com');

      expect(result).toBeUndefined();
    });

    it('should propagate errors', async () => {
      const error = new Error('Failed to send email token');
      (mockRest.post as any).mockRejectedValue(error);

      await expect(
        service.sendEmailConfirmationToken('invalid@example.com')
      ).rejects.toThrow('Failed to send email token');
    });
  });

  describe('confirmEmail (v3.1.0)', () => {
    it('should call POST with correct URL and params', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      await service.confirmEmail({
        userId: 'user-123',
        token: 'confirm-token',
      });

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/confirm-email',
        { userId: 'user-123', token: 'confirm-token' },
        { skipHandleError: true }
      );
    });

    it('should include tenantId when provided', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      await service.confirmEmail({
        userId: 'user-123',
        token: 'confirm-token',
        tenantId: 'tenant-456',
      });

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/confirm-email',
        { userId: 'user-123', token: 'confirm-token', tenantId: 'tenant-456' },
        { skipHandleError: true }
      );
    });

    it('should handle successful confirmation', async () => {
      (mockRest.post as any).mockResolvedValue(undefined);

      const result = await service.confirmEmail({
        userId: 'user-123',
        token: 'valid-token',
      });

      expect(result).toBeUndefined();
    });

    it('should propagate errors for invalid token', async () => {
      const error = new Error('Invalid confirmation token');
      (mockRest.post as any).mockRejectedValue(error);

      await expect(
        service.confirmEmail({ userId: 'user-123', token: 'invalid-token' })
      ).rejects.toThrow('Invalid confirmation token');
    });
  });

  describe('getMySecurityLogs (v3.1.0)', () => {
    const mockSecurityLogsResponse = {
      items: [
        {
          id: 'log-1',
          applicationName: 'TestApp',
          identity: 'test-identity',
          action: 'Login',
          userId: 'user-123',
          userName: 'testuser',
          clientIpAddress: '192.168.1.1',
          browserInfo: 'Chrome',
          creationTime: '2024-01-15T10:30:00Z',
        },
        {
          id: 'log-2',
          tenantId: 'tenant-456',
          applicationName: 'TestApp',
          action: 'Logout',
          userId: 'user-123',
          userName: 'testuser',
          tenantName: 'TestTenant',
          clientId: 'client-789',
          correlationId: 'corr-123',
          clientIpAddress: '192.168.1.1',
          creationTime: '2024-01-15T11:00:00Z',
        },
      ],
      totalCount: 2,
    };

    it('should call GET with correct URL when no params provided', async () => {
      (mockRest.get as any).mockResolvedValue(mockSecurityLogsResponse);

      const result = await service.getMySecurityLogs();

      expect(mockRest.get).toHaveBeenCalledWith('/api/account/my-security-logs');
      expect(result).toEqual(mockSecurityLogsResponse);
    });

    it('should call GET with query params when provided', async () => {
      (mockRest.get as any).mockResolvedValue(mockSecurityLogsResponse);

      await service.getMySecurityLogs({
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-01-31T23:59:59Z',
        applicationName: 'TestApp',
        skipCount: 0,
        maxResultCount: 10,
      });

      expect(mockRest.get).toHaveBeenCalledWith(
        '/api/account/my-security-logs?startTime=2024-01-01T00%3A00%3A00Z&endTime=2024-01-31T23%3A59%3A59Z&applicationName=TestApp&skipCount=0&maxResultCount=10'
      );
    });

    it('should filter out undefined and null params', async () => {
      (mockRest.get as any).mockResolvedValue(mockSecurityLogsResponse);

      await service.getMySecurityLogs({
        applicationName: 'TestApp',
        identity: undefined,
        action: null as any,
        skipCount: 0,
      });

      expect(mockRest.get).toHaveBeenCalledWith(
        '/api/account/my-security-logs?applicationName=TestApp&skipCount=0'
      );
    });

    it('should include all filter params', async () => {
      (mockRest.get as any).mockResolvedValue(mockSecurityLogsResponse);

      await service.getMySecurityLogs({
        identity: 'test-identity',
        action: 'Login',
        clientId: 'client-123',
        correlationId: 'corr-456',
        sorting: 'creationTime desc',
      });

      expect(mockRest.get).toHaveBeenCalledWith(
        '/api/account/my-security-logs?identity=test-identity&action=Login&clientId=client-123&correlationId=corr-456&sorting=creationTime+desc'
      );
    });

    it('should return items and totalCount', async () => {
      (mockRest.get as any).mockResolvedValue(mockSecurityLogsResponse);

      const result = await service.getMySecurityLogs();

      expect(result.items).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      expect(result.items[0].id).toBe('log-1');
      expect(result.items[1].tenantId).toBe('tenant-456');
    });

    it('should handle empty results', async () => {
      const emptyResponse = { items: [], totalCount: 0 };
      (mockRest.get as any).mockResolvedValue(emptyResponse);

      const result = await service.getMySecurityLogs();

      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });

    it('should propagate errors', async () => {
      const error = new Error('Failed to fetch security logs');
      (mockRest.get as any).mockRejectedValue(error);

      await expect(service.getMySecurityLogs()).rejects.toThrow(
        'Failed to fetch security logs'
      );
    });
  });
});
