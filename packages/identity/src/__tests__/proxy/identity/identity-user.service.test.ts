import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityUserService } from '../../../proxy/identity/identity-user.service';
import type { RestService } from '@abpjs/core';
import type {
  GetIdentityUsersInput,
  IdentityRoleDto,
  IdentityUserCreateDto,
  IdentityUserDto,
  IdentityUserUpdateDto,
  IdentityUserUpdateRolesDto,
} from '../../../proxy/identity/models';

/**
 * Tests for IdentityUserService (v3.2.0)
 * New proxy service for user management API calls.
 */
describe('IdentityUserService (v3.2.0)', () => {
  let service: IdentityUserService;
  let mockRestService: { request: ReturnType<typeof vi.fn> };

  const mockUserDto: IdentityUserDto = {
    id: 'user-1',
    tenantId: 'tenant-123',
    userName: 'admin',
    name: 'Admin',
    surname: 'User',
    email: 'admin@example.com',
    emailConfirmed: true,
    phoneNumber: '+1234567890',
    phoneNumberConfirmed: false,
    lockoutEnabled: true,
    lockoutEnd: undefined,
    concurrencyStamp: 'stamp-123',
  };

  const mockRoleDto: IdentityRoleDto = {
    id: 'role-1',
    name: 'Admin',
    isDefault: false,
    isStatic: true,
    isPublic: true,
    concurrencyStamp: 'stamp-456',
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new IdentityUserService(mockRestService as unknown as RestService);
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

  describe('create method', () => {
    it('should call restService with correct POST parameters', async () => {
      const input: IdentityUserCreateDto = {
        userName: 'newuser',
        name: 'New',
        surname: 'User',
        email: 'new@example.com',
        phoneNumber: '',
        lockoutEnabled: true,
        roleNames: ['User'],
        password: 'Password123!',
      };
      mockRestService.request.mockResolvedValue(mockUserDto);

      await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/users',
        body: input,
      });
    });

    it('should return created user', async () => {
      const input: IdentityUserCreateDto = {
        userName: 'newuser',
        name: 'New',
        surname: 'User',
        email: 'new@example.com',
        phoneNumber: '',
        lockoutEnabled: true,
        roleNames: ['User'],
        password: 'Password123!',
      };
      mockRestService.request.mockResolvedValue(mockUserDto);

      const result = await service.create(input);

      expect(result).toEqual(mockUserDto);
    });

    it('should propagate errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('User creation failed'));

      await expect(
        service.create({
          userName: 'test',
          name: 'Test',
          surname: 'User',
          email: 'test@example.com',
          phoneNumber: '',
          lockoutEnabled: true,
          roleNames: [],
          password: 'pass',
        })
      ).rejects.toThrow('User creation failed');
    });
  });

  describe('delete method', () => {
    it('should call restService with correct DELETE parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.delete('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/identity/users/user-1',
      });
    });

    it('should return void on success', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const result = await service.delete('user-1');

      expect(result).toBeUndefined();
    });
  });

  describe('findByEmail method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue(mockUserDto);

      await service.findByEmail('admin@example.com');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/by-email/admin@example.com',
      });
    });

    it('should return user by email', async () => {
      mockRestService.request.mockResolvedValue(mockUserDto);

      const result = await service.findByEmail('admin@example.com');

      expect(result.email).toBe('admin@example.com');
    });

    it('should propagate errors when user not found', async () => {
      mockRestService.request.mockRejectedValue(new Error('User not found'));

      await expect(service.findByEmail('invalid@example.com')).rejects.toThrow('User not found');
    });
  });

  describe('findByUsername method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue(mockUserDto);

      await service.findByUsername('admin');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/by-username/admin',
      });
    });

    it('should return user by username', async () => {
      mockRestService.request.mockResolvedValue(mockUserDto);

      const result = await service.findByUsername('admin');

      expect(result.userName).toBe('admin');
    });
  });

  describe('get method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue(mockUserDto);

      await service.get('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/user-1',
      });
    });

    it('should return user by ID', async () => {
      mockRestService.request.mockResolvedValue(mockUserDto);

      const result = await service.get('user-1');

      expect(result.id).toBe('user-1');
    });
  });

  describe('getAssignableRoles method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue({ items: [mockRoleDto] });

      await service.getAssignableRoles();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/assignable-roles',
      });
    });

    it('should return ListResultDto with roles', async () => {
      mockRestService.request.mockResolvedValue({ items: [mockRoleDto, { ...mockRoleDto, id: 'role-2' }] });

      const result = await service.getAssignableRoles();

      expect(result.items).toHaveLength(2);
    });
  });

  describe('getList method', () => {
    it('should call restService with pagination and filter parameters', async () => {
      const mockPagedResult = { items: [mockUserDto], totalCount: 1 };
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const input: GetIdentityUsersInput = { skipCount: 0, maxResultCount: 10, filter: 'admin' };
      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users',
        params: input,
      });
    });

    it('should return PagedResultDto with users', async () => {
      const mockPagedResult = { items: [mockUserDto], totalCount: 100 };
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const result = await service.getList({ skipCount: 0, maxResultCount: 10, filter: '' });

      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(100);
    });

    it('should handle empty filter', async () => {
      mockRestService.request.mockResolvedValue({ items: [], totalCount: 0 });

      const input: GetIdentityUsersInput = { skipCount: 0, maxResultCount: 10, filter: '' };
      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users',
        params: input,
      });
    });
  });

  describe('getRoles method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue({ items: [mockRoleDto] });

      await service.getRoles('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/user-1/roles',
      });
    });

    it('should return ListResultDto with user roles', async () => {
      mockRestService.request.mockResolvedValue({ items: [mockRoleDto] });

      const result = await service.getRoles('user-1');

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Admin');
    });
  });

  describe('update method', () => {
    it('should call restService with correct PUT parameters', async () => {
      const input: IdentityUserUpdateDto = {
        userName: 'updateduser',
        name: 'Updated',
        surname: 'User',
        email: 'updated@example.com',
        phoneNumber: '+0987654321',
        lockoutEnabled: false,
        roleNames: ['Admin'],
        password: 'NewPassword123!',
        concurrencyStamp: 'stamp-123',
      };
      mockRestService.request.mockResolvedValue({ ...mockUserDto, ...input });

      await service.update('user-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1',
        body: input,
      });
    });

    it('should return updated user', async () => {
      const input: IdentityUserUpdateDto = {
        userName: 'updateduser',
        name: 'Updated',
        surname: 'User',
        email: 'updated@example.com',
        phoneNumber: '',
        lockoutEnabled: false,
        roleNames: ['Admin'],
        password: '',
        concurrencyStamp: 'stamp-123',
      };
      const updatedUser = { ...mockUserDto, name: 'Updated' };
      mockRestService.request.mockResolvedValue(updatedUser);

      const result = await service.update('user-1', input);

      expect(result.name).toBe('Updated');
    });
  });

  describe('updateRoles method', () => {
    it('should call restService with correct PUT parameters', async () => {
      const input: IdentityUserUpdateRolesDto = {
        roleNames: ['Admin', 'User'],
      };
      mockRestService.request.mockResolvedValue(undefined);

      await service.updateRoles('user-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/roles',
        body: input,
      });
    });

    it('should return void on success', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const result = await service.updateRoles('user-1', { roleNames: ['Admin'] });

      expect(result).toBeUndefined();
    });

    it('should handle empty roleNames array', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.updateRoles('user-1', { roleNames: [] });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/roles',
        body: { roleNames: [] },
      });
    });
  });
});
