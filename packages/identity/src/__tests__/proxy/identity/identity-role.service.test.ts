import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityRoleService } from '../../../proxy/identity/identity-role.service';
import type { RestService } from '@abpjs/core';
import type {
  IdentityRoleCreateDto,
  IdentityRoleDto,
  IdentityRoleUpdateDto,
} from '../../../proxy/identity/models';

/**
 * Tests for IdentityRoleService (v3.2.0)
 * New proxy service for role management API calls.
 */
describe('IdentityRoleService (v3.2.0)', () => {
  let service: IdentityRoleService;
  let mockRestService: { request: ReturnType<typeof vi.fn> };

  const mockRoleDto: IdentityRoleDto = {
    id: 'role-1',
    name: 'Admin',
    isDefault: false,
    isStatic: true,
    isPublic: true,
    concurrencyStamp: 'stamp-123',
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    service = new IdentityRoleService(mockRestService as unknown as RestService);
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
      const input: IdentityRoleCreateDto = {
        name: 'NewRole',
        isDefault: false,
        isPublic: true,
      };
      mockRestService.request.mockResolvedValue(mockRoleDto);

      await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/roles',
        body: input,
      });
    });

    it('should return created role', async () => {
      const input: IdentityRoleCreateDto = {
        name: 'NewRole',
        isDefault: false,
        isPublic: true,
      };
      mockRestService.request.mockResolvedValue(mockRoleDto);

      const result = await service.create(input);

      expect(result).toEqual(mockRoleDto);
    });

    it('should propagate errors', async () => {
      const error = new Error('Creation failed');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.create({ name: 'Test', isDefault: false, isPublic: true })
      ).rejects.toThrow('Creation failed');
    });
  });

  describe('delete method', () => {
    it('should call restService with correct DELETE parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.delete('role-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/identity/roles/role-1',
      });
    });

    it('should return void on success', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const result = await service.delete('role-1');

      expect(result).toBeUndefined();
    });

    it('should propagate errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Delete failed'));

      await expect(service.delete('role-1')).rejects.toThrow('Delete failed');
    });
  });

  describe('get method', () => {
    it('should call restService with correct GET parameters', async () => {
      mockRestService.request.mockResolvedValue(mockRoleDto);

      await service.get('role-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/roles/role-1',
      });
    });

    it('should return role by ID', async () => {
      mockRestService.request.mockResolvedValue(mockRoleDto);

      const result = await service.get('role-1');

      expect(result).toEqual(mockRoleDto);
      expect(result.id).toBe('role-1');
    });

    it('should propagate errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Role not found'));

      await expect(service.get('invalid-id')).rejects.toThrow('Role not found');
    });
  });

  describe('getAllList method', () => {
    it('should call restService with correct GET parameters', async () => {
      const mockList = { items: [mockRoleDto] };
      mockRestService.request.mockResolvedValue(mockList);

      await service.getAllList();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/roles/all',
      });
    });

    it('should return ListResultDto with roles', async () => {
      const mockList = { items: [mockRoleDto, { ...mockRoleDto, id: 'role-2', name: 'User' }] };
      mockRestService.request.mockResolvedValue(mockList);

      const result = await service.getAllList();

      expect(result.items).toHaveLength(2);
    });

    it('should return empty list when no roles exist', async () => {
      mockRestService.request.mockResolvedValue({ items: [] });

      const result = await service.getAllList();

      expect(result.items).toHaveLength(0);
    });
  });

  describe('getList method', () => {
    it('should call restService with pagination parameters', async () => {
      const mockPagedResult = { items: [mockRoleDto], totalCount: 1 };
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const input = { skipCount: 0, maxResultCount: 10 };
      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/roles',
        params: input,
      });
    });

    it('should return PagedResultDto with roles', async () => {
      const mockPagedResult = { items: [mockRoleDto], totalCount: 100 };
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const result = await service.getList({ skipCount: 0, maxResultCount: 10 });

      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(100);
    });

    it('should handle sorting parameter', async () => {
      const mockPagedResult = { items: [], totalCount: 0 };
      mockRestService.request.mockResolvedValue(mockPagedResult);

      const input = { skipCount: 0, maxResultCount: 10, sorting: 'name asc' };
      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/roles',
        params: input,
      });
    });
  });

  describe('update method', () => {
    it('should call restService with correct PUT parameters', async () => {
      const input: IdentityRoleUpdateDto = {
        name: 'UpdatedRole',
        isDefault: true,
        isPublic: false,
        concurrencyStamp: 'stamp-123',
      };
      mockRestService.request.mockResolvedValue({ ...mockRoleDto, ...input });

      await service.update('role-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/roles/role-1',
        body: input,
      });
    });

    it('should return updated role', async () => {
      const input: IdentityRoleUpdateDto = {
        name: 'UpdatedRole',
        isDefault: true,
        isPublic: false,
        concurrencyStamp: 'stamp-123',
      };
      const updatedRole = { ...mockRoleDto, name: 'UpdatedRole', isDefault: true };
      mockRestService.request.mockResolvedValue(updatedRole);

      const result = await service.update('role-1', input);

      expect(result.name).toBe('UpdatedRole');
      expect(result.isDefault).toBe(true);
    });

    it('should propagate errors', async () => {
      mockRestService.request.mockRejectedValue(new Error('Concurrency conflict'));

      await expect(
        service.update('role-1', { name: 'Test', isDefault: false, isPublic: true, concurrencyStamp: 'old' })
      ).rejects.toThrow('Concurrency conflict');
    });
  });
});
