import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityUserLookupService } from '../../../proxy/identity/identity-user-lookup.service';
import type { RestService } from '@abpjs/core';
import type { UserLookupCountInputDto, UserLookupSearchInputDto } from '../../../proxy/identity/models';
import type { UserData } from '../../../proxy/users/models';

/**
 * Tests for IdentityUserLookupService (v3.2.0)
 * New proxy service for user lookup API calls.
 */
describe('IdentityUserLookupService (v3.2.0)', () => {
  let service: IdentityUserLookupService;
  let mockRestService: { request: ReturnType<typeof vi.fn> };

  const mockUserData: UserData = {
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

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new IdentityUserLookupService(mockRestService as unknown as RestService);
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

  describe('findById method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue(mockUserData);

      await service.findById('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/user-1',
      });
    });

    it('should return UserData by ID', async () => {
      mockRestService.request.mockResolvedValue(mockUserData);

      const result = await service.findById('user-1');

      expect(result).toEqual(mockUserData);
      expect(result.id).toBe('user-1');
    });

    it('should propagate errors when user not found', async () => {
      mockRestService.request.mockRejectedValue(new Error('User not found'));

      await expect(service.findById('invalid-id')).rejects.toThrow('User not found');
    });
  });

  describe('findByUserName method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue(mockUserData);

      await service.findByUserName('admin');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/by-username/admin',
      });
    });

    it('should return UserData by username', async () => {
      mockRestService.request.mockResolvedValue(mockUserData);

      const result = await service.findByUserName('admin');

      expect(result.userName).toBe('admin');
    });

    it('should handle special characters in username', async () => {
      mockRestService.request.mockResolvedValue(mockUserData);

      await service.findByUserName('user.name');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/by-username/user.name',
      });
    });

    it('should propagate errors when user not found', async () => {
      mockRestService.request.mockRejectedValue(new Error('User not found'));

      await expect(service.findByUserName('invalid')).rejects.toThrow('User not found');
    });
  });

  describe('getCount method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue(10);

      const input: UserLookupCountInputDto = { filter: 'admin' };
      await service.getCount(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/count',
        params: input,
      });
    });

    it('should return count as number', async () => {
      mockRestService.request.mockResolvedValue(25);

      const result = await service.getCount({ filter: 'user' });

      expect(result).toBe(25);
      expect(typeof result).toBe('number');
    });

    it('should return 0 when no matches', async () => {
      mockRestService.request.mockResolvedValue(0);

      const result = await service.getCount({ filter: 'nonexistent' });

      expect(result).toBe(0);
    });

    it('should handle empty filter', async () => {
      mockRestService.request.mockResolvedValue(100);

      const input: UserLookupCountInputDto = { filter: '' };
      await service.getCount(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/count',
        params: { filter: '' },
      });
    });
  });

  describe('search method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue({ items: [mockUserData] });

      const input: UserLookupSearchInputDto = {
        filter: 'admin',
        skipCount: 0,
        maxResultCount: 10,
      };
      await service.search(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/search',
        params: input,
      });
    });

    it('should return ListResultDto with UserData items', async () => {
      const mockList = { items: [mockUserData, { ...mockUserData, id: 'user-2', userName: 'user2' }] };
      mockRestService.request.mockResolvedValue(mockList);

      const result = await service.search({
        filter: '',
        skipCount: 0,
        maxResultCount: 10,
      });

      expect(result.items).toHaveLength(2);
      expect(result.items[0].userName).toBe('admin');
      expect(result.items[1].userName).toBe('user2');
    });

    it('should return empty list when no matches', async () => {
      mockRestService.request.mockResolvedValue({ items: [] });

      const result = await service.search({
        filter: 'nonexistent',
        skipCount: 0,
        maxResultCount: 10,
      });

      expect(result.items).toHaveLength(0);
    });

    it('should handle pagination correctly', async () => {
      mockRestService.request.mockResolvedValue({ items: [mockUserData] });

      const input: UserLookupSearchInputDto = {
        filter: 'user',
        skipCount: 20,
        maxResultCount: 10,
        sorting: 'userName asc',
      };
      await service.search(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/lookup/search',
        params: input,
      });
    });

    it('should propagate errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Search failed'));

      await expect(
        service.search({ filter: 'test', skipCount: 0, maxResultCount: 10 })
      ).rejects.toThrow('Search failed');
    });
  });
});
