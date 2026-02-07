/**
 * Tests for IdentityRoleService
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityRoleService } from '../../../proxy/identity/identity-role.service';
import type { RestService, ListResultDto, PagedResultDto } from '@abpjs/core';
import type {
  ClaimTypeDto,
  GetIdentityRoleListInput,
  IdentityRoleClaimDto,
  IdentityRoleCreateDto,
  IdentityRoleDto,
  IdentityRoleUpdateDto,
} from '../../../proxy/identity/models';
import { IdentityClaimValueType } from '../../../proxy/identity/identity-claim-value-type.enum';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('IdentityRoleService', () => {
  let service: IdentityRoleService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  const mockRole: IdentityRoleDto = {
    id: 'role-1',
    name: 'Admin',
    isDefault: false,
    isStatic: true,
    isPublic: true,
    concurrencyStamp: 'stamp123',
    extraProperties: {},
  };

  const mockClaimType: ClaimTypeDto = {
    id: 'claim-1',
    name: 'permission',
    required: false,
    isStatic: true,
    regex: '',
    regexDescription: '',
    description: 'Permission claim',
    valueType: IdentityClaimValueType.String,
    valueTypeAsString: 'String',
    extraProperties: {},
  };

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new IdentityRoleService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should create service with default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should create service instance', () => {
      expect(service).toBeInstanceOf(IdentityRoleService);
    });
  });

  describe('create', () => {
    it('should call REST API with correct parameters', async () => {
      const input: IdentityRoleCreateDto = {
        name: 'NewRole',
        isDefault: false,
        isPublic: true,
        extraProperties: {},
      };

      mockRestService.request.mockResolvedValueOnce(mockRole);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/roles',
        body: input,
      });
      expect(result).toEqual(mockRole);
    });

    it('should handle duplicate name error', async () => {
      const input: IdentityRoleCreateDto = {
        name: 'Admin',
        isDefault: false,
        isPublic: true,
        extraProperties: {},
      };
      const error = new Error('Role name already exists');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.create(input)).rejects.toThrow('Role name already exists');
    });
  });

  describe('delete', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.delete('role-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/identity/roles/role-1',
      });
    });

    it('should handle static role deletion error', async () => {
      const error = new Error('Cannot delete static role');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.delete('admin-role')).rejects.toThrow('Cannot delete static role');
    });
  });

  describe('get', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockRole);

      const result = await service.get('role-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/roles/role-1',
      });
      expect(result).toEqual(mockRole);
    });
  });

  describe('getAllClaimTypes', () => {
    it('should call REST API and return claim types', async () => {
      const claimTypes = [mockClaimType];
      mockRestService.request.mockResolvedValueOnce(claimTypes);

      const result = await service.getAllClaimTypes();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/roles/all-claim-types',
      });
      expect(result).toEqual(claimTypes);
    });

    it('should handle empty claim types', async () => {
      mockRestService.request.mockResolvedValueOnce([]);

      const result = await service.getAllClaimTypes();

      expect(result).toEqual([]);
    });
  });

  describe('getAllList', () => {
    it('should call REST API and return all roles', async () => {
      const response: ListResultDto<IdentityRoleDto> = {
        items: [mockRole, { ...mockRole, id: 'role-2', name: 'User' }],
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getAllList();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/roles/all',
      });
      expect(result.items).toHaveLength(2);
    });
  });

  describe('getClaims', () => {
    it('should call REST API with correct parameters', async () => {
      const claims: IdentityRoleClaimDto[] = [
        { roleId: 'role-1', claimType: 'permission', claimValue: 'read:users' },
        { roleId: 'role-1', claimType: 'permission', claimValue: 'write:users' },
      ];
      mockRestService.request.mockResolvedValueOnce(claims);

      const result = await service.getClaims('role-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/roles/role-1/claims',
      });
      expect(result).toHaveLength(2);
    });

    it('should handle role with no claims', async () => {
      mockRestService.request.mockResolvedValueOnce([]);

      const result = await service.getClaims('role-1');

      expect(result).toEqual([]);
    });
  });

  describe('getList', () => {
    it('should call REST API with correct parameters', async () => {
      const input: GetIdentityRoleListInput = {
        filter: 'admin',
        sorting: 'name asc',
        skipCount: 0,
        maxResultCount: 10,
      };

      const response: PagedResultDto<IdentityRoleDto> = {
        items: [mockRole],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/roles',
        params: {
          filter: 'admin',
          sorting: 'name asc',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      expect(result.items).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });

    it('should handle pagination', async () => {
      const input: GetIdentityRoleListInput = {
        filter: '',
        sorting: '',
        skipCount: 20,
        maxResultCount: 10,
      };

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 50 });

      await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            skipCount: 20,
            maxResultCount: 10,
          }),
        })
      );
    });
  });

  describe('update', () => {
    it('should call REST API with correct parameters', async () => {
      const input: IdentityRoleUpdateDto = {
        name: 'UpdatedAdmin',
        isDefault: true,
        isPublic: false,
        concurrencyStamp: 'stamp123',
        extraProperties: {},
      };

      const updatedRole = { ...mockRole, ...input };
      mockRestService.request.mockResolvedValueOnce(updatedRole);

      const result = await service.update('role-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/roles/role-1',
        body: input,
      });
      expect(result.name).toBe('UpdatedAdmin');
    });

    it('should handle concurrency conflict', async () => {
      const error = new Error('Concurrency conflict');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.update('role-1', {
          name: 'Test',
          isDefault: false,
          isPublic: true,
          concurrencyStamp: 'old-stamp',
          extraProperties: {},
        })
      ).rejects.toThrow('Concurrency conflict');
    });
  });

  describe('updateClaims', () => {
    it('should call REST API with correct parameters', async () => {
      const claims: IdentityRoleClaimDto[] = [
        { roleId: 'role-1', claimType: 'permission', claimValue: 'read:all' },
      ];

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.updateClaims('role-1', claims);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/roles/role-1/claims',
        body: claims,
      });
    });

    it('should handle clearing all claims', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.updateClaims('role-1', []);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/roles/role-1/claims',
        body: [],
      });
    });
  });
});
