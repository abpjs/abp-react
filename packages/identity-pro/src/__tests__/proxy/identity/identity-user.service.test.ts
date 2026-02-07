/**
 * Tests for IdentityUserService
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityUserService } from '../../../proxy/identity/identity-user.service';
import type { RestService, ListResultDto, PagedResultDto } from '@abpjs/core';
import type {
  ClaimTypeDto,
  GetIdentityUsersInput,
  IdentityRoleDto,
  IdentityUserClaimDto,
  IdentityUserCreateDto,
  IdentityUserDto,
  IdentityUserUpdateDto,
  IdentityUserUpdatePasswordInput,
  IdentityUserUpdateRolesDto,
  OrganizationUnitDto,
  OrganizationUnitWithDetailsDto,
} from '../../../proxy/identity/models';
import { IdentityClaimValueType } from '../../../proxy/identity/identity-claim-value-type.enum';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('IdentityUserService', () => {
  let service: IdentityUserService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  const mockUser: IdentityUserDto = {
    id: 'user-1',
    tenantId: 'tenant-1',
    userName: 'john.doe',
    email: 'john@example.com',
    name: 'John',
    surname: 'Doe',
    emailConfirmed: true,
    phoneNumber: '+1234567890',
    phoneNumberConfirmed: false,
    supportTwoFactor: true,
    lockoutEnabled: true,
    isLockedOut: false,
    concurrencyStamp: 'stamp123',
    extraProperties: {},
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

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new IdentityUserService(mockRestService as unknown as RestService);
  });

  describe('constructor', () => {
    it('should create service with default apiName', () => {
      expect(service.apiName).toBe('default');
    });

    it('should create service instance', () => {
      expect(service).toBeInstanceOf(IdentityUserService);
    });
  });

  describe('create', () => {
    it('should call REST API with correct parameters', async () => {
      const input: IdentityUserCreateDto = {
        userName: 'newuser',
        name: 'New',
        surname: 'User',
        email: 'new@example.com',
        phoneNumber: '+1234567890',
        lockoutEnabled: true,
        roleNames: ['User'],
        organizationUnitIds: [],
        password: 'Password123!',
        extraProperties: {},
      };

      mockRestService.request.mockResolvedValueOnce(mockUser);

      const result = await service.create(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/users',
        body: input,
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle duplicate username error', async () => {
      const error = new Error('Username already exists');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.create({
          userName: 'existing',
          name: '',
          surname: '',
          email: '',
          phoneNumber: '',
          lockoutEnabled: false,
          roleNames: [],
          organizationUnitIds: [],
          password: 'test',
          extraProperties: {},
        })
      ).rejects.toThrow('Username already exists');
    });
  });

  describe('delete', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.delete('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/identity/users/user-1',
      });
    });
  });

  describe('findByEmail', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/by-email/john@example.com',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByUsername', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockUser);

      const result = await service.findByUsername('john.doe');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/by-username/john.doe',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('get', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(mockUser);

      const result = await service.get('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/user-1',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getAllClaimTypes', () => {
    it('should call REST API and return claim types', async () => {
      const claimTypes: ClaimTypeDto[] = [
        {
          id: 'claim-1',
          name: 'email',
          required: true,
          isStatic: true,
          regex: '',
          regexDescription: '',
          description: '',
          valueType: IdentityClaimValueType.String,
          valueTypeAsString: 'String',
          extraProperties: {},
        },
      ];
      mockRestService.request.mockResolvedValueOnce(claimTypes);

      const result = await service.getAllClaimTypes();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/all-claim-types',
      });
      expect(result).toEqual(claimTypes);
    });
  });

  describe('getAssignableRoles', () => {
    it('should call REST API and return assignable roles', async () => {
      const response: ListResultDto<IdentityRoleDto> = {
        items: [mockRole],
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getAssignableRoles();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/assignable-roles',
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('getAvailableOrganizationUnits', () => {
    it('should call REST API and return organization units', async () => {
      const response: ListResultDto<OrganizationUnitWithDetailsDto> = {
        items: [
          {
            id: 'ou-1',
            code: '00001',
            displayName: 'Engineering',
            roles: [],
            extraProperties: {},
            creationTime: '',
            creatorId: '',
            lastModificationTime: '',
            lastModifierId: '',
            isDeleted: false,
            deleterId: '',
            deletionTime: '',
          },
        ],
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getAvailableOrganizationUnits();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/available-organization-units',
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('getClaims', () => {
    it('should call REST API with correct parameters', async () => {
      const claims: IdentityUserClaimDto[] = [
        { userId: 'user-1', claimType: 'department', claimValue: 'Engineering' },
      ];
      mockRestService.request.mockResolvedValueOnce(claims);

      const result = await service.getClaims('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/user-1/claims',
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('getList', () => {
    it('should call REST API with correct parameters', async () => {
      const input: GetIdentityUsersInput = {
        filter: 'john',
        sorting: 'userName asc',
        skipCount: 0,
        maxResultCount: 10,
      };

      const response: PagedResultDto<IdentityUserDto> = {
        items: [mockUser],
        totalCount: 1,
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getList(input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users',
        params: {
          filter: 'john',
          sorting: 'userName asc',
          skipCount: 0,
          maxResultCount: 10,
        },
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('getOrganizationUnits', () => {
    it('should call REST API with correct parameters', async () => {
      const ous: OrganizationUnitDto[] = [
        {
          id: 'ou-1',
          code: '00001',
          displayName: 'Engineering',
          roles: [],
          extraProperties: {},
          creationTime: '',
          creatorId: '',
          lastModificationTime: '',
          lastModifierId: '',
          isDeleted: false,
          deleterId: '',
          deletionTime: '',
        },
      ];
      mockRestService.request.mockResolvedValueOnce(ous);

      const result = await service.getOrganizationUnits('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/user-1/organization-units',
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('getRoles', () => {
    it('should call REST API with correct parameters', async () => {
      const response: ListResultDto<IdentityRoleDto> = {
        items: [mockRole],
      };
      mockRestService.request.mockResolvedValueOnce(response);

      const result = await service.getRoles('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/user-1/roles',
      });
      expect(result.items).toHaveLength(1);
    });
  });

  describe('getTwoFactorEnabled', () => {
    it('should return true when two-factor is enabled', async () => {
      mockRestService.request.mockResolvedValueOnce(true);

      const result = await service.getTwoFactorEnabled('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/users/user-1/two-factor-enabled',
      });
      expect(result).toBe(true);
    });

    it('should return false when two-factor is disabled', async () => {
      mockRestService.request.mockResolvedValueOnce(false);

      const result = await service.getTwoFactorEnabled('user-1');

      expect(result).toBe(false);
    });
  });

  describe('lock', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.lock('user-1', 300);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/lock/300',
      });
    });

    it('should handle different lockout durations', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.lock('user-1', 3600);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/lock/3600',
      });
    });
  });

  describe('setTwoFactorEnabled', () => {
    it('should enable two-factor authentication', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.setTwoFactorEnabled('user-1', true);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/two-factor/true',
      });
    });

    it('should disable two-factor authentication', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.setTwoFactorEnabled('user-1', false);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/two-factor/false',
      });
    });
  });

  describe('unlock', () => {
    it('should call REST API with correct parameters', async () => {
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.unlock('user-1');

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/unlock',
      });
    });
  });

  describe('update', () => {
    it('should call REST API with correct parameters', async () => {
      const input: IdentityUserUpdateDto = {
        userName: 'john.doe.updated',
        name: 'John',
        surname: 'Doe Updated',
        email: 'john.updated@example.com',
        phoneNumber: '+9876543210',
        lockoutEnabled: false,
        roleNames: ['Admin', 'User'],
        organizationUnitIds: ['ou-1'],
        concurrencyStamp: 'stamp123',
        extraProperties: {},
      };

      const updatedUser = { ...mockUser, ...input };
      mockRestService.request.mockResolvedValueOnce(updatedUser);

      const result = await service.update('user-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1',
        body: input,
      });
      expect(result.surname).toBe('Doe Updated');
    });
  });

  describe('updateClaims', () => {
    it('should call REST API with correct parameters', async () => {
      const claims: IdentityUserClaimDto[] = [
        { userId: 'user-1', claimType: 'department', claimValue: 'Sales' },
      ];

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.updateClaims('user-1', claims);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/claims',
        body: claims,
      });
    });
  });

  describe('updatePassword', () => {
    it('should call REST API with correct parameters', async () => {
      const input: IdentityUserUpdatePasswordInput = {
        newPassword: 'NewSecurePassword!',
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.updatePassword('user-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/change-password',
        body: input,
      });
    });
  });

  describe('updateRoles', () => {
    it('should call REST API with correct parameters', async () => {
      const input: IdentityUserUpdateRolesDto = {
        roleNames: ['Admin', 'Manager'],
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.updateRoles('user-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/roles',
        body: input,
      });
    });

    it('should handle removing all roles', async () => {
      const input: IdentityUserUpdateRolesDto = {
        roleNames: [],
      };

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.updateRoles('user-1', input);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/identity/users/user-1/roles',
        body: { roleNames: [] },
      });
    });
  });
});
