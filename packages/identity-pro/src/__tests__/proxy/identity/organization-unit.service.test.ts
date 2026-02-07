/**
 * Tests for OrganizationUnitService (Proxy)
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrganizationUnitService } from '../../../proxy/identity/organization-unit.service';
import type { RestService, ListResultDto, PagedResultDto, PagedAndSortedResultRequestDto } from '@abpjs/core';
import type {
  GetAvailableRolesInput,
  GetAvailableUsersInput,
  GetIdentityUsersInput,
  GetOrganizationUnitInput,
  IdentityRoleDto,
  IdentityUserDto,
  OrganizationUnitCreateDto,
  OrganizationUnitMoveInput,
  OrganizationUnitRoleInput,
  OrganizationUnitUpdateDto,
  OrganizationUnitUserInput,
  OrganizationUnitWithDetailsDto,
} from '../../../proxy/identity/models';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('OrganizationUnitService (Proxy)', () => {
  let service: OrganizationUnitService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  const mockOrganizationUnit: OrganizationUnitWithDetailsDto = {
    id: 'ou-1',
    parentId: undefined,
    code: '00001',
    displayName: 'Engineering',
    roles: [],
    extraProperties: {},
    creationTime: '2024-01-01T12:00:00Z',
    creatorId: 'user-1',
    lastModificationTime: undefined,
    lastModifierId: undefined,
    isDeleted: false,
    deleterId: undefined,
    deletionTime: undefined,
  };

  const mockRole: IdentityRoleDto = {
    id: 'role-1',
    name: 'Admin',
    isDefault: false,
    isStatic: true,
    isPublic: true,
    concurrencyStamp: 'stamp',
    extraProperties: {},
  };

  const mockUser: IdentityUserDto = {
    id: 'user-1',
    userName: 'john.doe',
    email: 'john@example.com',
    name: 'John',
    surname: 'Doe',
    emailConfirmed: true,
    phoneNumber: '',
    phoneNumberConfirmed: false,
    supportTwoFactor: true,
    lockoutEnabled: true,
    isLockedOut: false,
    concurrencyStamp: 'stamp',
    extraProperties: {},
  };

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new OrganizationUnitService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should create service with default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should create service instance', () => {
      expect(service).toBeInstanceOf(OrganizationUnitService);
    });
  });

  describe('addMembers', () => {
    it('should call REST API with correct parameters', async () => {
      const input: OrganizationUnitUserInput = {
        userIds: ['user-1', 'user-2'],
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.addMembers('ou-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/organization-units/ou-1/members',
        body: input,
      });
    });

    it('should handle empty user IDs', async () => {
      const input: OrganizationUnitUserInput = {
        userIds: [],
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.addMembers('ou-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { userIds: [] },
        })
      );
    });
  });

  describe('addRoles', () => {
    it('should call REST API with correct parameters', async () => {
      const input: OrganizationUnitRoleInput = {
        roleIds: ['role-1', 'role-2'],
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.addRoles('ou-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/organization-units/ou-1/roles',
        body: input,
      });
    });
  });

  describe('create', () => {
    it('should call REST API with correct parameters for root unit', async () => {
      const input: OrganizationUnitCreateDto = {
        displayName: 'New Department',
        extraProperties: {},
      };

      mockRestService.request.mockResolvedValueOnce(mockOrganizationUnit);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/organization-units',
        body: input,
      });
      expect(result).toEqual(mockOrganizationUnit);
    });

    it('should call REST API with correct parameters for child unit', async () => {
      const input: OrganizationUnitCreateDto = {
        displayName: 'Sub Department',
        parentId: 'parent-ou-1',
        extraProperties: {},
      };

      const childUnit = { ...mockOrganizationUnit, parentId: 'parent-ou-1', code: '00001.00001' };
      mockRestService.request.mockResolvedValueOnce(childUnit);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            parentId: 'parent-ou-1',
          }),
        })
      );
      expect(result.parentId).toBe('parent-ou-1');
    });
  });

  describe('delete', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.delete('ou-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/identity/organization-units/ou-1',
      });
    });
  });

  describe('get', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockOrganizationUnit);

      const result = await service.get('ou-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/organization-units/ou-1',
      });
      expect(result).toEqual(mockOrganizationUnit);
    });
  });

  describe('getAvailableRoles', () => {
    it('should call REST API with correct parameters', async () => {
      const input: GetAvailableRolesInput = {
        id: 'ou-1',
        filter: 'admin',
        sorting: 'name',
        skipCount: 0,
        maxResultCount: 10,
      };

      const response: PagedResultDto<IdentityRoleDto> = {
        items: [mockRole],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getAvailableRoles(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/organization-units/ou-1/available-roles',
        params: {
          filter: 'admin',
          sorting: 'name',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('getAvailableUsers', () => {
    it('should call REST API with correct parameters', async () => {
      const input: GetAvailableUsersInput = {
        id: 'ou-1',
        filter: 'john',
        sorting: 'userName',
        skipCount: 0,
        maxResultCount: 10,
      };

      const response: PagedResultDto<IdentityUserDto> = {
        items: [mockUser],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getAvailableUsers(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/organization-units/ou-1/available-users',
        params: {
          filter: 'john',
          sorting: 'userName',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('getList', () => {
    it('should call REST API with correct parameters', async () => {
      const input: GetOrganizationUnitInput = {
        filter: 'engineering',
        sorting: 'displayName',
        skipCount: 0,
        maxResultCount: 25,
      };

      const response: PagedResultDto<OrganizationUnitWithDetailsDto> = {
        items: [mockOrganizationUnit],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/organization-units',
        params: {
          filter: 'engineering',
          sorting: 'displayName',
          skipCount: 0,
          maxResultCount: 25,
        },
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('getListAll', () => {
    it('should call REST API and return all organization units', async () => {
      const response: ListResultDto<OrganizationUnitWithDetailsDto> = {
        items: [
          mockOrganizationUnit,
          { ...mockOrganizationUnit, id: 'ou-2', displayName: 'Sales' },
        ],
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getListAll();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/organization-units/all',
      });
      expect(result.items).toHaveLength(2);
    });
  });

  describe('getMembers', () => {
    it('should call REST API with correct parameters', async () => {
      const input: GetIdentityUsersInput = {
        filter: 'john',
        sorting: 'userName',
        skipCount: 0,
        maxResultCount: 10,
      };

      const response: PagedResultDto<IdentityUserDto> = {
        items: [mockUser],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getMembers('ou-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/organization-units/ou-1/members',
        params: {
          filter: 'john',
          sorting: 'userName',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('getRoles', () => {
    it('should call REST API with correct parameters', async () => {
      const input: PagedAndSortedResultRequestDto = {
        sorting: 'name',
        skipCount: 0,
        maxResultCount: 10,
      };

      const response: PagedResultDto<IdentityRoleDto> = {
        items: [mockRole],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getRoles('ou-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/organization-units/ou-1/roles',
        params: {
          sorting: 'name',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('move', () => {
    it('should move unit to new parent', async () => {
      const input: OrganizationUnitMoveInput = {
        newParentId: 'new-parent-ou-1',
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.move('ou-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/organization-units/ou-1/move',
        body: input,
      });
    });

    it('should move unit to root (no parent)', async () => {
      const input: OrganizationUnitMoveInput = {
        newParentId: undefined,
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.move('ou-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { newParentId: undefined },
        })
      );
    });
  });

  describe('removeMember', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.removeMember('ou-1', 'user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/identity/organization-units/ou-1/members/user-1',
      });
    });
  });

  describe('removeRole', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.removeRole('ou-1', 'role-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/identity/organization-units/ou-1/roles/role-1',
      });
    });
  });

  describe('update', () => {
    it('should call REST API with correct parameters', async () => {
      const input: OrganizationUnitUpdateDto = {
        displayName: 'Updated Engineering',
        extraProperties: {},
      };

      const updatedUnit = { ...mockOrganizationUnit, displayName: 'Updated Engineering' };
      mockRestService.request.mockResolvedValueOnce(updatedUnit);

      const result = await service.update('ou-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/organization-units/ou-1',
        body: input,
      });
      expect(result.displayName).toBe('Updated Engineering');
    });
  });

  describe('error handling', () => {
    it('should propagate errors from REST service', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.get('ou-1')).rejects.toThrow('Network error');
    });

    it('should handle not found error', async () => {
      const error = new Error('Not found');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.delete('non-existent')).rejects.toThrow('Not found');
    });

    it('should handle validation errors', async () => {
      const error = new Error('Display name is required');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.create({ displayName: '', extraProperties: {} })
      ).rejects.toThrow('Display name is required');
    });
  });
});
