import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PermissionManagementService } from '../services/permission-management.service';
import type { PermissionManagement } from '../models';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('PermissionManagementService', () => {
  let service: PermissionManagementService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new PermissionManagementService(mockRestService as any);
  });

  describe('apiName property (v2.4.0)', () => {
    it('should have apiName property with default value "default"', () => {
      expect(service.apiName).toBe('default');
    });

    it('should allow apiName to be modified', () => {
      service.apiName = 'customApi';
      expect(service.apiName).toBe('customApi');
    });

    it('should have apiName as a string type', () => {
      expect(typeof service.apiName).toBe('string');
    });
  });

  describe('getPermissions', () => {
    it('should call rest.request with correct parameters', async () => {
      const mockResponse: PermissionManagement.Response = {
        entityDisplayName: 'Test Role',
        groups: [
          {
            name: 'TestGroup',
            displayName: 'Test Group',
            permissions: [
              {
                name: 'TestPermission',
                displayName: 'Test Permission',
                isGranted: true,
                parentName: '',
                allowedProviders: ['R', 'U'],
                grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
              },
            ],
          },
        ],
      };
      mockRestService.request.mockResolvedValue(mockResponse);

      const params = { providerKey: 'admin', providerName: 'R' };
      const result = await service.getPermissions(params);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/permission-management/permissions',
        params,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty groups response', async () => {
      const mockResponse: PermissionManagement.Response = {
        entityDisplayName: 'Empty Entity',
        groups: [],
      };
      mockRestService.request.mockResolvedValue(mockResponse);

      const result = await service.getPermissions({
        providerKey: 'test',
        providerName: 'U',
      });

      expect(result.groups).toEqual([]);
      expect(result.entityDisplayName).toBe('Empty Entity');
    });

    it('should propagate errors from rest service', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValue(error);

      await expect(
        service.getPermissions({ providerKey: 'test', providerName: 'R' })
      ).rejects.toThrow('Network error');
    });
  });

  describe('updatePermissions', () => {
    it('should call rest.request with correct parameters', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      const request: PermissionManagement.UpdateRequest = {
        providerKey: 'admin',
        providerName: 'R',
        permissions: [
          { name: 'Permission1', isGranted: true },
          { name: 'Permission2', isGranted: false },
        ],
      };

      await service.updatePermissions(request);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/permission-management/permissions',
        body: { permissions: request.permissions },
        params: { providerKey: 'admin', providerName: 'R' },
      });
    });

    it('should handle empty permissions array', async () => {
      mockRestService.request.mockResolvedValue(undefined);

      await service.updatePermissions({
        providerKey: 'test',
        providerName: 'U',
        permissions: [],
      });

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/permission-management/permissions',
        body: { permissions: [] },
        params: { providerKey: 'test', providerName: 'U' },
      });
    });

    it('should propagate errors from rest service', async () => {
      mockRestService.request.mockRejectedValue(new Error('Update failed'));

      await expect(
        service.updatePermissions({
          providerKey: 'test',
          providerName: 'R',
          permissions: [{ name: 'Test', isGranted: true }],
        })
      ).rejects.toThrow('Update failed');
    });
  });
});
