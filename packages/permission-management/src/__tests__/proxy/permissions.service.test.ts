import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PermissionsService } from '../../proxy/permissions.service';
import type { GetPermissionListResultDto, UpdatePermissionsDto } from '../../proxy/models';

// Mock RestService
const mockRequest = vi.fn();
const mockRestService = {
  request: mockRequest,
} as any;

describe('PermissionsService (v3.2.0)', () => {
  let service: PermissionsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PermissionsService(mockRestService);
  });

  describe('constructor', () => {
    it('should create service instance', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(PermissionsService);
    });
  });

  describe('apiName property', () => {
    it('should have default apiName of "default"', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow apiName to be modified', () => {
      service.apiName = 'identity';
      expect(service.apiName).toBe('identity');
    });
  });

  describe('get method', () => {
    const mockResponse: GetPermissionListResultDto = {
      entityDisplayName: 'Admin Role',
      groups: [
        {
          name: 'IdentityManagement',
          displayName: 'Identity Management',
          permissions: [
            {
              name: 'AbpIdentity.Users',
              displayName: 'User Management',
              parentName: '',
              isGranted: true,
              allowedProviders: ['R', 'U'],
              grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
            },
          ],
        },
      ],
    };

    it('should call restService.request with correct parameters for role provider', async () => {
      mockRequest.mockResolvedValue(mockResponse);

      const result = await service.get('R', 'admin-role-id');

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/permission-management/permissions',
        params: { providerName: 'R', providerKey: 'admin-role-id' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should call restService.request with correct parameters for user provider', async () => {
      mockRequest.mockResolvedValue(mockResponse);

      const result = await service.get('U', 'user-123');

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/permission-management/permissions',
        params: { providerName: 'U', providerKey: 'user-123' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty provider key', async () => {
      mockRequest.mockResolvedValue(mockResponse);

      await service.get('R', '');

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/permission-management/permissions',
        params: { providerName: 'R', providerKey: '' },
      });
    });

    it('should return the response from restService', async () => {
      const customResponse: GetPermissionListResultDto = {
        entityDisplayName: 'Test User',
        groups: [],
      };
      mockRequest.mockResolvedValue(customResponse);

      const result = await service.get('U', 'test-user');

      expect(result.entityDisplayName).toBe('Test User');
      expect(result.groups).toEqual([]);
    });

    it('should propagate errors from restService', async () => {
      const error = new Error('API error');
      mockRequest.mockRejectedValue(error);

      await expect(service.get('R', 'role-id')).rejects.toThrow('API error');
    });

    it('should handle response with multiple groups', async () => {
      const multiGroupResponse: GetPermissionListResultDto = {
        entityDisplayName: 'Super Admin',
        groups: [
          {
            name: 'Identity',
            displayName: 'Identity',
            permissions: [],
          },
          {
            name: 'Tenants',
            displayName: 'Tenants',
            permissions: [],
          },
        ],
      };
      mockRequest.mockResolvedValue(multiGroupResponse);

      const result = await service.get('R', 'super-admin');

      expect(result.groups).toHaveLength(2);
    });
  });

  describe('update method', () => {
    const updateInput: UpdatePermissionsDto = {
      permissions: [
        { name: 'AbpIdentity.Users', isGranted: true },
        { name: 'AbpIdentity.Roles', isGranted: false },
      ],
    };

    it('should call restService.request with correct parameters', async () => {
      mockRequest.mockResolvedValue(undefined);

      await service.update('R', 'admin-role-id', updateInput);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/permission-management/permissions',
        body: updateInput,
        params: { providerName: 'R', providerKey: 'admin-role-id' },
      });
    });

    it('should call restService.request for user provider', async () => {
      mockRequest.mockResolvedValue(undefined);

      await service.update('U', 'user-456', updateInput);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/permission-management/permissions',
        body: updateInput,
        params: { providerName: 'U', providerKey: 'user-456' },
      });
    });

    it('should handle empty permissions array', async () => {
      mockRequest.mockResolvedValue(undefined);
      const emptyInput: UpdatePermissionsDto = { permissions: [] };

      await service.update('R', 'role-id', emptyInput);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/permission-management/permissions',
        body: emptyInput,
        params: { providerName: 'R', providerKey: 'role-id' },
      });
    });

    it('should handle single permission update', async () => {
      mockRequest.mockResolvedValue(undefined);
      const singleInput: UpdatePermissionsDto = {
        permissions: [{ name: 'AbpIdentity.Users.Create', isGranted: true }],
      };

      await service.update('R', 'role-id', singleInput);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/permission-management/permissions',
        body: singleInput,
        params: { providerName: 'R', providerKey: 'role-id' },
      });
    });

    it('should return void on success', async () => {
      mockRequest.mockResolvedValue(undefined);

      const result = await service.update('R', 'role-id', updateInput);

      expect(result).toBeUndefined();
    });

    it('should propagate errors from restService', async () => {
      const error = new Error('Update failed');
      mockRequest.mockRejectedValue(error);

      await expect(service.update('R', 'role-id', updateInput)).rejects.toThrow('Update failed');
    });

    it('should handle large batch of permissions', async () => {
      mockRequest.mockResolvedValue(undefined);
      const largeInput: UpdatePermissionsDto = {
        permissions: Array.from({ length: 100 }, (_, i) => ({
          name: `Permission.${i}`,
          isGranted: i % 2 === 0,
        })),
      };

      await service.update('R', 'role-id', largeInput);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/permission-management/permissions',
        body: largeInput,
        params: { providerName: 'R', providerKey: 'role-id' },
      });
    });

    it('should handle special characters in provider key', async () => {
      mockRequest.mockResolvedValue(undefined);

      await service.update('R', 'role-with-special-chars!@#$%', updateInput);

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/permission-management/permissions',
        body: updateInput,
        params: { providerName: 'R', providerKey: 'role-with-special-chars!@#$%' },
      });
    });
  });

  describe('API endpoint consistency', () => {
    it('should use same endpoint for get and update', async () => {
      mockRequest.mockResolvedValue({
        entityDisplayName: 'Test',
        groups: [],
      });

      await service.get('R', 'role-id');
      await service.update('R', 'role-id', { permissions: [] });

      const getCalls = mockRequest.mock.calls.filter(
        (call) => call[0].method === 'GET'
      );
      const putCalls = mockRequest.mock.calls.filter(
        (call) => call[0].method === 'PUT'
      );

      expect(getCalls[0][0].url).toBe('/api/permission-management/permissions');
      expect(putCalls[0][0].url).toBe('/api/permission-management/permissions');
    });
  });
});
