/**
 * Tests for IdentityUserLookupService
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityUserLookupService } from '../../../proxy/identity/identity-user-lookup.service';
import type { RestService, ListResultDto } from '@abpjs/core';
import type { UserLookupCountInputDto, UserLookupSearchInputDto } from '../../../proxy/identity/models';
import type { UserData } from '../../../proxy/users/models';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('IdentityUserLookupService', () => {
  let service: IdentityUserLookupService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  const mockUserData: UserData = {
    id: 'user-1',
    tenantId: 'tenant-1',
    userName: 'john.doe',
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    emailConfirmed: true,
    phoneNumber: '+1234567890',
    phoneNumberConfirmed: false,
  };

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new IdentityUserLookupService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should create service with default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should create service instance', () => {
      expect(service).toBeInstanceOf(IdentityUserLookupService);
    });
  });

  describe('findById', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockUserData);

      const result = await service.findById('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/user-1',
      });
      expect(result).toEqual(mockUserData);
    });

    it('should return user data', async () => {
      mockRestService.request.mockResolvedValueOnce(mockUserData);

      const result = await service.findById('user-1');

      expect(result.id).toBe('user-1');
      expect(result.userName).toBe('john.doe');
      expect(result.email).toBe('john@example.com');
    });

    it('should handle not found error', async () => {
      const error = new Error('User not found');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.findById('non-existent')).rejects.toThrow('User not found');
    });
  });

  describe('findByUserName', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockUserData);

      const result = await service.findByUserName('john.doe');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/by-username/john.doe',
      });
      expect(result).toEqual(mockUserData);
    });

    it('should return user data by username', async () => {
      mockRestService.request.mockResolvedValueOnce(mockUserData);

      const result = await service.findByUserName('john.doe');

      expect(result.userName).toBe('john.doe');
    });

    it('should handle user not found', async () => {
      const error = new Error('User not found');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.findByUserName('unknown')).rejects.toThrow('User not found');
    });

    it('should handle special characters in username', async () => {
      mockRestService.request.mockResolvedValueOnce(mockUserData);

      await service.findByUserName('user@domain.com');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/by-username/user@domain.com',
      });
    });
  });

  describe('getCount', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(42);

      const input: UserLookupCountInputDto = {
        filter: 'john',
      };

      const result = await service.getCount(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/count',
        params: {
          filter: 'john',
        },
      });
      expect(result).toBe(42);
    });

    it('should return count with empty filter', async () => {
      mockRestService.request.mockResolvedValueOnce(100);

      const input: UserLookupCountInputDto = {
        filter: '',
      };

      const result = await service.getCount(input);

      expect(result).toBe(100);
    });

    it('should return zero when no users match', async () => {
      mockRestService.request.mockResolvedValueOnce(0);

      const input: UserLookupCountInputDto = {
        filter: 'nonexistent',
      };

      const result = await service.getCount(input);

      expect(result).toBe(0);
    });
  });

  describe('search', () => {
    it('should call REST API with correct parameters', async () => {
      const response: ListResultDto<UserData> = {
        items: [mockUserData],
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const input: UserLookupSearchInputDto = {
        filter: 'john',
        sorting: 'userName',
        skipCount: 0,
        maxResultCount: 10,
      };

      const result = await service.search(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/search',
        params: {
          filter: 'john',
          sorting: 'userName',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      expect(result.items).toHaveLength(1);
    });

    it('should handle pagination', async () => {
      const response: ListResultDto<UserData> = {
        items: [],
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const input: UserLookupSearchInputDto = {
        filter: '',
        sorting: 'userName asc',
        skipCount: 20,
        maxResultCount: 10,
      };

      await service.search(input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            skipCount: 20,
            maxResultCount: 10,
          }),
        })
      );
    });

    it('should return multiple users', async () => {
      const response: ListResultDto<UserData> = {
        items: [
          mockUserData,
          { ...mockUserData, id: 'user-2', userName: 'jane.doe' },
          { ...mockUserData, id: 'user-3', userName: 'bob.smith' },
        ],
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const input: UserLookupSearchInputDto = {
        filter: '',
        sorting: '',
        skipCount: 0,
        maxResultCount: 10,
      };

      const result = await service.search(input);

      expect(result.items).toHaveLength(3);
    });

    it('should handle empty results', async () => {
      const response: ListResultDto<UserData> = {
        items: [],
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const input: UserLookupSearchInputDto = {
        filter: 'nonexistent',
        sorting: '',
        skipCount: 0,
        maxResultCount: 10,
      };

      const result = await service.search(input);

      expect(result.items).toHaveLength(0);
    });

    it('should handle sorting options', async () => {
      mockRestService.request.mockResolvedValueOnce({ items: [] });

      const input: UserLookupSearchInputDto = {
        filter: '',
        sorting: 'email desc',
        skipCount: 0,
        maxResultCount: 10,
      };

      await service.search(input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            sorting: 'email desc',
          }),
        })
      );
    });
  });

  describe('error handling', () => {
    it('should propagate network errors', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.findById('user-1')).rejects.toThrow('Network error');
    });

    it('should propagate server errors', async () => {
      const error = new Error('Internal server error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.search({
          filter: '',
          sorting: '',
          skipCount: 0,
          maxResultCount: 10,
        })
      ).rejects.toThrow('Internal server error');
    });
  });
});
