/**
 * Tests for IdentitySettingsService
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentitySettingsService } from '../../../proxy/identity/identity-settings.service';
import type { RestService } from '@abpjs/core';
import type { IdentitySettingsDto } from '../../../proxy/identity/models';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('IdentitySettingsService', () => {
  let service: IdentitySettingsService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  const mockSettings: IdentitySettingsDto = {
    password: {
      requiredLength: 8,
      requiredUniqueChars: 2,
      requireNonAlphanumeric: true,
      requireLowercase: true,
      requireUppercase: true,
      requireDigit: true,
    },
    lockout: {
      allowedForNewUsers: true,
      lockoutDuration: 300,
      maxFailedAccessAttempts: 5,
    },
    signIn: {
      requireConfirmedEmail: true,
      enablePhoneNumberConfirmation: false,
      requireConfirmedPhoneNumber: false,
    },
    user: {
      isUserNameUpdateEnabled: true,
      isEmailUpdateEnabled: true,
    },
  };

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new IdentitySettingsService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should create service with default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should create service instance', () => {
      expect(service).toBeInstanceOf(IdentitySettingsService);
    });
  });

  describe('get', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockSettings);

      const result = await service.get();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/settings',
      });
      expect(result).toEqual(mockSettings);
    });

    it('should return password settings', async () => {
      mockRestService.request.mockResolvedValueOnce(mockSettings);

      const result = await service.get();

      expect(result.password.requiredLength).toBe(8);
      expect(result.password.requireNonAlphanumeric).toBe(true);
    });

    it('should return lockout settings', async () => {
      mockRestService.request.mockResolvedValueOnce(mockSettings);

      const result = await service.get();

      expect(result.lockout.lockoutDuration).toBe(300);
      expect(result.lockout.maxFailedAccessAttempts).toBe(5);
    });

    it('should return signIn settings', async () => {
      mockRestService.request.mockResolvedValueOnce(mockSettings);

      const result = await service.get();

      expect(result.signIn.requireConfirmedEmail).toBe(true);
    });

    it('should return user settings', async () => {
      mockRestService.request.mockResolvedValueOnce(mockSettings);

      const result = await service.get();

      expect(result.user.isUserNameUpdateEnabled).toBe(true);
      expect(result.user.isEmailUpdateEnabled).toBe(true);
    });

    it('should handle errors', async () => {
      const error = new Error('Unauthorized');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.get()).rejects.toThrow('Unauthorized');
    });
  });

  describe('update', () => {
    it('should call REST API with correct parameters', async () => {
      const updatedSettings: IdentitySettingsDto = {
        ...mockSettings,
        password: {
          ...mockSettings.password,
          requiredLength: 12,
        },
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.update(updatedSettings);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/settings',
        body: updatedSettings,
      });
    });

    it('should update password settings', async () => {
      const updatedSettings: IdentitySettingsDto = {
        ...mockSettings,
        password: {
          requiredLength: 10,
          requiredUniqueChars: 3,
          requireNonAlphanumeric: false,
          requireLowercase: true,
          requireUppercase: true,
          requireDigit: true,
        },
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.update(updatedSettings);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            password: expect.objectContaining({
              requiredLength: 10,
              requireNonAlphanumeric: false,
            }),
          }),
        })
      );
    });

    it('should update lockout settings', async () => {
      const updatedSettings: IdentitySettingsDto = {
        ...mockSettings,
        lockout: {
          allowedForNewUsers: false,
          lockoutDuration: 600,
          maxFailedAccessAttempts: 3,
        },
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.update(updatedSettings);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            lockout: expect.objectContaining({
              allowedForNewUsers: false,
              lockoutDuration: 600,
            }),
          }),
        })
      );
    });

    it('should update signIn settings', async () => {
      const updatedSettings: IdentitySettingsDto = {
        ...mockSettings,
        signIn: {
          requireConfirmedEmail: false,
          enablePhoneNumberConfirmation: true,
          requireConfirmedPhoneNumber: true,
        },
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.update(updatedSettings);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            signIn: expect.objectContaining({
              requireConfirmedEmail: false,
              enablePhoneNumberConfirmation: true,
            }),
          }),
        })
      );
    });

    it('should update user settings', async () => {
      const updatedSettings: IdentitySettingsDto = {
        ...mockSettings,
        user: {
          isUserNameUpdateEnabled: false,
          isEmailUpdateEnabled: false,
        },
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.update(updatedSettings);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            user: expect.objectContaining({
              isUserNameUpdateEnabled: false,
              isEmailUpdateEnabled: false,
            }),
          }),
        })
      );
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation error: requiredLength must be at least 6');
      mockRestService.request.mockRejectedValueOnce(error);

      const invalidSettings: IdentitySettingsDto = {
        ...mockSettings,
        password: {
          ...mockSettings.password,
          requiredLength: 2,
        },
      };

      await expect(service.update(invalidSettings)).rejects.toThrow('Validation error');
    });

    it('should handle permission errors', async () => {
      const error = new Error('Forbidden');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.update(mockSettings)).rejects.toThrow('Forbidden');
    });
  });
});
