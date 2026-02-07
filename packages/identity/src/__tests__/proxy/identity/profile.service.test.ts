import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileService } from '../../../proxy/identity/profile.service';
import type { RestService } from '@abpjs/core';
import type { ChangePasswordInput, ProfileDto, UpdateProfileDto } from '../../../proxy/identity/models';

/**
 * Tests for ProfileService (v3.2.0)
 * New proxy service for profile management API calls.
 */
describe('ProfileService (v3.2.0)', () => {
  let service: ProfileService;
  let mockRestService: { request: ReturnType<typeof vi.fn> };

  const mockProfileDto: ProfileDto = {
    userName: 'admin',
    email: 'admin@example.com',
    name: 'Admin',
    surname: 'User',
    phoneNumber: '+1234567890',
    isExternal: false,
    hasPassword: true,
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new ProfileService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should initialize with restService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('apiName property', () => {
    it('should have apiName property with default value "default"', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow apiName to be modified', () => {
      service.apiName = 'customApi';
      expect(service.apiName).toBe('customApi');
    });
  });

  describe('changePassword method', () => {
    it('should call restService with correct POST parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const input: ChangePasswordInput = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };
      await service.changePassword(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/my-profile/change-password',
        body: input,
      });
    });

    it('should return void on success', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const result = await service.changePassword({
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      });

      expect(result).toBeUndefined();
    });

    it('should propagate errors when current password is incorrect', async () => {
      mockRestService.request.mockRejectedValue(new Error('Current password is incorrect'));

      await expect(
        service.changePassword({
          currentPassword: 'WrongPassword!',
          newPassword: 'NewPassword123!',
        })
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should propagate errors when new password does not meet requirements', async () => {
      mockRestService.request.mockRejectedValue(new Error('Password does not meet requirements'));

      await expect(
        service.changePassword({
          currentPassword: 'OldPassword123!',
          newPassword: 'weak',
        })
      ).rejects.toThrow('Password does not meet requirements');
    });
  });

  describe('get method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue(mockProfileDto);

      await service.get();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/my-profile',
      });
    });

    it('should return ProfileDto', async () => {
      mockRestService.request.mockResolvedValue(mockProfileDto);

      const result = await service.get();

      expect(result).toEqual(mockProfileDto);
      expect(result.userName).toBe('admin');
      expect(result.email).toBe('admin@example.com');
    });

    it('should return profile with isExternal true for external users', async () => {
      const externalProfile = { ...mockProfileDto, isExternal: true, hasPassword: false };
      mockRestService.request.mockResolvedValue(externalProfile);

      const result = await service.get();

      expect(result.isExternal).toBe(true);
      expect(result.hasPassword).toBe(false);
    });

    it('should propagate errors when not authenticated', async () => {
      mockRestService.request.mockRejectedValue(new Error('Unauthorized'));

      await expect(service.get()).rejects.toThrow('Unauthorized');
    });
  });

  describe('update method', () => {
    it('should call restService with correct PUT parameters', async () => {
      const input: UpdateProfileDto = {
        userName: 'newusername',
        email: 'new@example.com',
        name: 'New',
        surname: 'Name',
        phoneNumber: '+0987654321',
      };
      mockRestService.request.mockResolvedValue({ ...mockProfileDto, ...input });

      await service.update(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/my-profile',
        body: input,
      });
    });

    it('should return updated ProfileDto', async () => {
      const input: UpdateProfileDto = {
        userName: 'updatedadmin',
        email: 'updated@example.com',
        name: 'Updated',
        surname: 'Admin',
        phoneNumber: '+0987654321',
      };
      const updatedProfile = { ...mockProfileDto, ...input };
      mockRestService.request.mockResolvedValue(updatedProfile);

      const result = await service.update(input);

      expect(result.userName).toBe('updatedadmin');
      expect(result.email).toBe('updated@example.com');
      expect(result.name).toBe('Updated');
    });

    it('should handle partial updates', async () => {
      const input: UpdateProfileDto = {
        userName: 'admin',
        email: 'admin@example.com',
        name: 'Updated Name Only',
        surname: 'User',
        phoneNumber: '+1234567890',
      };
      const updatedProfile = { ...mockProfileDto, name: 'Updated Name Only' };
      mockRestService.request.mockResolvedValue(updatedProfile);

      const result = await service.update(input);

      expect(result.name).toBe('Updated Name Only');
      expect(result.email).toBe('admin@example.com');
    });

    it('should propagate errors when email is already in use', async () => {
      mockRestService.request.mockRejectedValue(new Error('Email is already in use'));

      await expect(
        service.update({
          userName: 'admin',
          email: 'taken@example.com',
          name: 'Admin',
          surname: 'User',
          phoneNumber: '',
        })
      ).rejects.toThrow('Email is already in use');
    });

    it('should propagate errors when username is already in use', async () => {
      mockRestService.request.mockRejectedValue(new Error('Username is already in use'));

      await expect(
        service.update({
          userName: 'takenusername',
          email: 'admin@example.com',
          name: 'Admin',
          surname: 'User',
          phoneNumber: '',
        })
      ).rejects.toThrow('Username is already in use');
    });
  });
});
