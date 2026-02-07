/**
 * Tests for ProfileService
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileService } from '../../../proxy/identity/profile.service';
import type { RestService } from '@abpjs/core';
import type {
  ChangePasswordInput,
  ProfileDto,
  UpdateProfileDto,
} from '../../../proxy/identity/models';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('ProfileService', () => {
  let service: ProfileService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  const mockProfile: ProfileDto = {
    userName: 'john.doe',
    email: 'john@example.com',
    emailConfirmed: true,
    name: 'John',
    surname: 'Doe',
    phoneNumber: '+1234567890',
    phoneNumberConfirmed: false,
    isExternal: false,
    hasPassword: true,
    extraProperties: {},
  };

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new ProfileService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should create service with default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should create service instance', () => {
      expect(service).toBeInstanceOf(ProfileService);
    });
  });

  describe('changePassword', () => {
    it('should call REST API with correct parameters', async () => {
      const input: ChangePasswordInput = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword456!',
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.changePassword(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/my-profile/change-password',
        body: input,
      });
    });

    it('should handle incorrect current password error', async () => {
      const error = new Error('Current password is incorrect');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.changePassword({
          currentPassword: 'WrongPassword',
          newPassword: 'NewPassword123!',
        })
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should handle weak password error', async () => {
      const error = new Error('Password does not meet requirements');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.changePassword({
          currentPassword: 'OldPassword123!',
          newPassword: '123',
        })
      ).rejects.toThrow('Password does not meet requirements');
    });
  });

  describe('get', () => {
    it('should call REST API and return profile', async () => {
      mockRestService.request.mockResolvedValueOnce(mockProfile);

      const result = await service.get();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/my-profile',
      });
      expect(result).toEqual(mockProfile);
    });

    it('should return all profile fields', async () => {
      mockRestService.request.mockResolvedValueOnce(mockProfile);

      const result = await service.get();

      expect(result.userName).toBe('john.doe');
      expect(result.email).toBe('john@example.com');
      expect(result.emailConfirmed).toBe(true);
      expect(result.name).toBe('John');
      expect(result.surname).toBe('Doe');
      expect(result.phoneNumber).toBe('+1234567890');
      expect(result.phoneNumberConfirmed).toBe(false);
      expect(result.isExternal).toBe(false);
      expect(result.hasPassword).toBe(true);
    });

    it('should handle external user profile', async () => {
      const externalProfile: ProfileDto = {
        ...mockProfile,
        isExternal: true,
        hasPassword: false,
      };
      mockRestService.request.mockResolvedValueOnce(externalProfile);

      const result = await service.get();

      expect(result.isExternal).toBe(true);
      expect(result.hasPassword).toBe(false);
    });

    it('should handle unauthorized error', async () => {
      const error = new Error('Unauthorized');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.get()).rejects.toThrow('Unauthorized');
    });
  });

  describe('getTwoFactorEnabled', () => {
    it('should return true when two-factor is enabled', async () => {
      mockRestService.request.mockResolvedValueOnce(true);

      const result = await service.getTwoFactorEnabled();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/my-profile/two-factor-enabled',
      });
      expect(result).toBe(true);
    });

    it('should return false when two-factor is disabled', async () => {
      mockRestService.request.mockResolvedValueOnce(false);

      const result = await service.getTwoFactorEnabled();

      expect(result).toBe(false);
    });
  });

  describe('setTwoFactorEnabled', () => {
    it('should enable two-factor authentication', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.setTwoFactorEnabled(true);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/my-profile/two-factor/true',
      });
    });

    it('should disable two-factor authentication', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.setTwoFactorEnabled(false);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/my-profile/two-factor/false',
      });
    });

    it('should handle error when two-factor is forced', async () => {
      const error = new Error('Two-factor authentication is required');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.setTwoFactorEnabled(false)).rejects.toThrow(
        'Two-factor authentication is required'
      );
    });
  });

  describe('update', () => {
    it('should call REST API with correct parameters', async () => {
      const input: UpdateProfileDto = {
        userName: 'john.doe.updated',
        email: 'john.updated@example.com',
        name: 'John',
        surname: 'Doe Updated',
        phoneNumber: '+9876543210',
        extraProperties: {},
      };

      const updatedProfile: ProfileDto = {
        ...mockProfile,
        ...input,
      };
      mockRestService.request.mockResolvedValueOnce(updatedProfile);

      const result = await service.update(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/my-profile',
        body: input,
      });
      expect(result.surname).toBe('Doe Updated');
    });

    it('should update username', async () => {
      const input: UpdateProfileDto = {
        userName: 'new.username',
        email: 'john@example.com',
        name: 'John',
        surname: 'Doe',
        phoneNumber: '',
        extraProperties: {},
      };

      const updatedProfile = { ...mockProfile, userName: 'new.username' };
      mockRestService.request.mockResolvedValueOnce(updatedProfile);

      const result = await service.update(input);

      expect(result.userName).toBe('new.username');
    });

    it('should update email', async () => {
      const input: UpdateProfileDto = {
        userName: 'john.doe',
        email: 'newemail@example.com',
        name: 'John',
        surname: 'Doe',
        phoneNumber: '',
        extraProperties: {},
      };

      const updatedProfile = { ...mockProfile, email: 'newemail@example.com' };
      mockRestService.request.mockResolvedValueOnce(updatedProfile);

      const result = await service.update(input);

      expect(result.email).toBe('newemail@example.com');
    });

    it('should handle username update disabled error', async () => {
      const error = new Error('Username update is disabled');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.update({
          userName: 'new.username',
          email: 'john@example.com',
          name: 'John',
          surname: 'Doe',
          phoneNumber: '',
          extraProperties: {},
        })
      ).rejects.toThrow('Username update is disabled');
    });

    it('should handle email update disabled error', async () => {
      const error = new Error('Email update is disabled');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.update({
          userName: 'john.doe',
          email: 'newemail@example.com',
          name: 'John',
          surname: 'Doe',
          phoneNumber: '',
          extraProperties: {},
        })
      ).rejects.toThrow('Email update is disabled');
    });

    it('should handle duplicate username error', async () => {
      const error = new Error('Username is already taken');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.update({
          userName: 'existing.user',
          email: 'john@example.com',
          name: 'John',
          surname: 'Doe',
          phoneNumber: '',
          extraProperties: {},
        })
      ).rejects.toThrow('Username is already taken');
    });

    it('should handle duplicate email error', async () => {
      const error = new Error('Email is already registered');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.update({
          userName: 'john.doe',
          email: 'existing@example.com',
          name: 'John',
          surname: 'Doe',
          phoneNumber: '',
          extraProperties: {},
        })
      ).rejects.toThrow('Email is already registered');
    });
  });

  describe('error handling', () => {
    it('should propagate network errors', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.get()).rejects.toThrow('Network error');
    });

    it('should propagate server errors', async () => {
      const error = new Error('Internal server error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.get()).rejects.toThrow('Internal server error');
    });
  });
});
