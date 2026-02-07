import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { ProfileService } from '../../services/profile.service';
import { ProfilePictureType } from '../../config/enums/profile-picture-type';
import type {
  ProfilePictureInput,
  ProfilePictureSourceDto,
} from '../../models';

// Mock RestService interface
interface MockRestService {
  get: Mock;
  post: Mock;
}

const createMockRestService = (): MockRestService => ({
  get: vi.fn(),
  post: vi.fn(),
});

describe('ProfileService (v3.2.0)', () => {
  let service: ProfileService;
  let mockRest: MockRestService;

  beforeEach(() => {
    mockRest = createMockRestService();
    service = new ProfileService(mockRest as never);
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      expect(service).toBeInstanceOf(ProfileService);
    });

    it('should have default apiName', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('getProfilePicture', () => {
    it('should call rest.get with correct URL', async () => {
      const mockResponse: ProfilePictureSourceDto = {
        type: ProfilePictureType.Gravatar,
        source: 'https://gravatar.com/avatar/test',
      };
      mockRest.get.mockResolvedValue(mockResponse);

      const result = await service.getProfilePicture();

      expect(mockRest.get).toHaveBeenCalledWith('/api/account/profile-picture');
      expect(result).toEqual(mockResponse);
    });

    it('should return ProfilePictureSourceDto for None type', async () => {
      const mockResponse: ProfilePictureSourceDto = {
        type: ProfilePictureType.None,
        source: '',
      };
      mockRest.get.mockResolvedValue(mockResponse);

      const result = await service.getProfilePicture();

      expect(result.type).toBe(ProfilePictureType.None);
      expect(result.source).toBe('');
    });

    it('should return ProfilePictureSourceDto for Image type with fileContent', async () => {
      const mockResponse: ProfilePictureSourceDto = {
        type: ProfilePictureType.Image,
        source: '/api/account/profile-picture/download',
        fileContent: 'base64encodedcontent',
      };
      mockRest.get.mockResolvedValue(mockResponse);

      const result = await service.getProfilePicture();

      expect(result.type).toBe(ProfilePictureType.Image);
      expect(result.fileContent).toBe('base64encodedcontent');
    });

    it('should handle errors', async () => {
      mockRest.get.mockRejectedValue(new Error('Network error'));

      await expect(service.getProfilePicture()).rejects.toThrow('Network error');
    });
  });

  describe('setProfilePicture', () => {
    it('should call rest.post with correct URL and input for Gravatar', async () => {
      const input: ProfilePictureInput = {
        type: ProfilePictureType.Gravatar,
      };
      mockRest.post.mockResolvedValue(undefined);

      await service.setProfilePicture(input);

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/profile-picture',
        input,
        { skipHandleError: true }
      );
    });

    it('should call rest.post with correct URL and input for Image with fileBytes', async () => {
      const input: ProfilePictureInput = {
        type: ProfilePictureType.Image,
        fileBytes: 'base64encodedimage',
      };
      mockRest.post.mockResolvedValue(undefined);

      await service.setProfilePicture(input);

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/profile-picture',
        input,
        { skipHandleError: true }
      );
    });

    it('should call rest.post with correct URL and input for None', async () => {
      const input: ProfilePictureInput = {
        type: ProfilePictureType.None,
      };
      mockRest.post.mockResolvedValue(undefined);

      await service.setProfilePicture(input);

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/profile-picture',
        input,
        { skipHandleError: true }
      );
    });

    it('should handle errors', async () => {
      const input: ProfilePictureInput = {
        type: ProfilePictureType.Image,
        fileBytes: 'invalid',
      };
      mockRest.post.mockRejectedValue(new Error('Invalid image'));

      await expect(service.setProfilePicture(input)).rejects.toThrow(
        'Invalid image'
      );
    });
  });

  describe('getProfilePictureByUserId', () => {
    it('should call rest.get with correct URL including userId', async () => {
      const userId = 'user-123-abc';
      const mockResponse: ProfilePictureSourceDto = {
        type: ProfilePictureType.Gravatar,
        source: 'https://gravatar.com/avatar/user123',
      };
      mockRest.get.mockResolvedValue(mockResponse);

      const result = await service.getProfilePictureByUserId(userId);

      expect(mockRest.get).toHaveBeenCalledWith(
        `/api/account/profile-picture/${userId}`
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle different user IDs', async () => {
      const mockResponse: ProfilePictureSourceDto = {
        type: ProfilePictureType.None,
        source: '',
      };
      mockRest.get.mockResolvedValue(mockResponse);

      await service.getProfilePictureByUserId('another-user-456');

      expect(mockRest.get).toHaveBeenCalledWith(
        '/api/account/profile-picture/another-user-456'
      );
    });

    it('should handle GUID-format user IDs', async () => {
      const guidUserId = '550e8400-e29b-41d4-a716-446655440000';
      const mockResponse: ProfilePictureSourceDto = {
        type: ProfilePictureType.Image,
        source: '/api/account/profile-picture/download/550e8400',
      };
      mockRest.get.mockResolvedValue(mockResponse);

      const result = await service.getProfilePictureByUserId(guidUserId);

      expect(mockRest.get).toHaveBeenCalledWith(
        `/api/account/profile-picture/${guidUserId}`
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors for non-existent users', async () => {
      mockRest.get.mockRejectedValue(new Error('User not found'));

      await expect(
        service.getProfilePictureByUserId('non-existent')
      ).rejects.toThrow('User not found');
    });
  });

  describe('getTwoFactorEnabled', () => {
    it('should call rest.get with correct URL', async () => {
      mockRest.get.mockResolvedValue(true);

      const result = await service.getTwoFactorEnabled();

      expect(mockRest.get).toHaveBeenCalledWith('/api/account/two-factor-enabled');
      expect(result).toBe(true);
    });

    it('should return true when 2FA is enabled', async () => {
      mockRest.get.mockResolvedValue(true);

      const result = await service.getTwoFactorEnabled();

      expect(result).toBe(true);
    });

    it('should return false when 2FA is disabled', async () => {
      mockRest.get.mockResolvedValue(false);

      const result = await service.getTwoFactorEnabled();

      expect(result).toBe(false);
    });

    it('should handle errors', async () => {
      mockRest.get.mockRejectedValue(new Error('Unauthorized'));

      await expect(service.getTwoFactorEnabled()).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('setTwoFactorEnabled', () => {
    it('should call rest.post with enabled=true', async () => {
      mockRest.post.mockResolvedValue(undefined);

      await service.setTwoFactorEnabled(true);

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/two-factor-enabled',
        { enabled: true },
        { skipHandleError: true }
      );
    });

    it('should call rest.post with enabled=false', async () => {
      mockRest.post.mockResolvedValue(undefined);

      await service.setTwoFactorEnabled(false);

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/two-factor-enabled',
        { enabled: false },
        { skipHandleError: true }
      );
    });

    it('should handle errors when enabling 2FA', async () => {
      mockRest.post.mockRejectedValue(new Error('2FA setup required first'));

      await expect(service.setTwoFactorEnabled(true)).rejects.toThrow(
        '2FA setup required first'
      );
    });

    it('should handle errors when disabling 2FA', async () => {
      mockRest.post.mockRejectedValue(
        new Error('Cannot disable 2FA: policy requires it')
      );

      await expect(service.setTwoFactorEnabled(false)).rejects.toThrow(
        'Cannot disable 2FA: policy requires it'
      );
    });
  });

  describe('integration scenarios', () => {
    it('should support getting profile picture, then updating it', async () => {
      // First get the current picture
      const currentPicture: ProfilePictureSourceDto = {
        type: ProfilePictureType.None,
        source: '',
      };
      mockRest.get.mockResolvedValueOnce(currentPicture);

      const getPictureResult = await service.getProfilePicture();
      expect(getPictureResult.type).toBe(ProfilePictureType.None);

      // Then set a new picture
      const newPicture: ProfilePictureInput = {
        type: ProfilePictureType.Gravatar,
      };
      mockRest.post.mockResolvedValue(undefined);

      await service.setProfilePicture(newPicture);

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/profile-picture',
        newPicture,
        { skipHandleError: true }
      );
    });

    it('should support checking and toggling 2FA status', async () => {
      // First check current status
      mockRest.get.mockResolvedValueOnce(false);

      const isEnabled = await service.getTwoFactorEnabled();
      expect(isEnabled).toBe(false);

      // Then enable 2FA
      mockRest.post.mockResolvedValue(undefined);

      await service.setTwoFactorEnabled(true);

      expect(mockRest.post).toHaveBeenCalledWith(
        '/api/account/two-factor-enabled',
        { enabled: true },
        { skipHandleError: true }
      );
    });
  });
});
