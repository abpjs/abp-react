/**
 * Tests for OrganizationUnitService
 * @abpjs/identity-pro v2.9.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrganizationUnitService } from '../../services/organization-unit.service';
import {
  createOrganizationUnitCreateDto,
  createOrganizationUnitUpdateDto,
  createOrganizationUnitMoveInput,
  createOrganizationUnitRoleInput,
  createOrganizationUnitUserInput,
  createGetOrganizationUnitInput,
  createOrganizationUnitWithDetailsDto,
} from '../../models';

// Mock RestService
const createMockRestService = () => ({
  request: vi.fn(),
});

describe('OrganizationUnitService', () => {
  let service: OrganizationUnitService;
  let mockRestService: ReturnType<typeof createMockRestService>;

  beforeEach(() => {
    mockRestService = createMockRestService();
    service = new OrganizationUnitService(mockRestService as any);
  });

  describe('constructor', () => {
    it('should create service with default apiName', () => {
      expect(service.apiName).toBe('default');
    });
  });

  describe('addRolesByIdAndInput', () => {
    it('should call REST API with correct parameters', async () => {
      const roleInput = createOrganizationUnitRoleInput({
        roleIds: ['role-1', 'role-2'],
      });
      const unitId = 'unit-123';

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.addRolesByIdAndInput(roleInput, unitId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: `/api/identity/organization-units/${unitId}/roles`,
        body: roleInput,
      });
    });

    it('should handle empty role IDs', async () => {
      const roleInput = createOrganizationUnitRoleInput({ roleIds: [] });
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.addRolesByIdAndInput(roleInput, 'unit-1');

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { roleIds: [] },
        })
      );
    });
  });

  describe('addMembersByIdAndInput', () => {
    it('should call REST API with correct parameters', async () => {
      const userInput = createOrganizationUnitUserInput({
        userIds: ['user-1', 'user-2', 'user-3'],
      });
      const unitId = 'unit-456';

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.addMembersByIdAndInput(userInput, unitId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: `/api/identity/organization-units/${unitId}/members`,
        body: userInput,
      });
    });

    it('should handle single user', async () => {
      const userInput = createOrganizationUnitUserInput({
        userIds: ['single-user'],
      });
      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.addMembersByIdAndInput(userInput, 'unit-1');

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { userIds: ['single-user'] },
        })
      );
    });
  });

  describe('createByInput', () => {
    it('should create organization unit and return result', async () => {
      const createDto = createOrganizationUnitCreateDto({
        displayName: 'New Unit',
        parentId: 'parent-1',
      });
      const expectedResult = createOrganizationUnitWithDetailsDto({
        id: 'new-unit-id',
        displayName: 'New Unit',
        parentId: 'parent-1',
        code: '00001.00001',
      });

      mockRestService.request.mockResolvedValueOnce(expectedResult);

      const result = await service.createByInput(createDto);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/identity/organization-units',
        body: createDto,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should create root unit (no parent)', async () => {
      const createDto = createOrganizationUnitCreateDto({
        displayName: 'Root Unit',
      });

      mockRestService.request.mockResolvedValueOnce({
        id: 'root-id',
        displayName: 'Root Unit',
        parentId: null,
        code: '00001',
      });

      await service.createByInput(createDto);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            displayName: 'Root Unit',
          }),
        })
      );
    });
  });

  describe('deleteById', () => {
    it('should call DELETE endpoint with correct ID', async () => {
      const unitId = 'unit-to-delete';

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.deleteById(unitId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: `/api/identity/organization-units/${unitId}`,
      });
    });
  });

  describe('getById', () => {
    it('should fetch organization unit by ID', async () => {
      const unitId = 'unit-123';
      const expectedUnit = createOrganizationUnitWithDetailsDto({
        id: unitId,
        displayName: 'Engineering',
        code: '00001',
      });

      mockRestService.request.mockResolvedValueOnce(expectedUnit);

      const result = await service.getById(unitId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: `/api/identity/organization-units/${unitId}`,
      });
      expect(result).toEqual(expectedUnit);
    });
  });

  describe('getListByInput', () => {
    it('should fetch list with default parameters', async () => {
      const expectedResponse = {
        items: [
          createOrganizationUnitWithDetailsDto({ id: '1', displayName: 'Unit 1' }),
          createOrganizationUnitWithDetailsDto({ id: '2', displayName: 'Unit 2' }),
        ],
        totalCount: 2,
      };

      mockRestService.request.mockResolvedValueOnce(expectedResponse);

      const result = await service.getListByInput();

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/identity/organization-units',
        params: undefined,
      });
      expect(result.items).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });

    it('should fetch list with filter', async () => {
      const input = createGetOrganizationUnitInput({
        filter: 'engineering',
      });

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 0 });

      await service.getListByInput(input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            filter: 'engineering',
          }),
        })
      );
    });

    it('should fetch list with pagination', async () => {
      const input = createGetOrganizationUnitInput({
        skipCount: 10,
        maxResultCount: 20,
      });

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 50 });

      await service.getListByInput(input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            skipCount: 10,
            maxResultCount: 20,
          }),
        })
      );
    });

    it('should fetch list with sorting', async () => {
      const input = createGetOrganizationUnitInput({
        sorting: 'displayName desc',
      });

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 0 });

      await service.getListByInput(input);

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            sorting: 'displayName desc',
          }),
        })
      );
    });
  });

  describe('getRolesById', () => {
    it('should fetch roles for organization unit', async () => {
      const unitId = 'unit-123';
      const params = { skipCount: 0, maxResultCount: 10 };
      const expectedResponse = {
        items: [
          { id: 'role-1', name: 'Admin' },
          { id: 'role-2', name: 'User' },
        ],
        totalCount: 2,
      };

      mockRestService.request.mockResolvedValueOnce(expectedResponse);

      const result = await service.getRolesById(params, unitId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: `/api/identity/organization-units/${unitId}/roles`,
        params,
      });
      expect(result.items).toHaveLength(2);
    });

    it('should handle pagination for roles', async () => {
      const params = { skipCount: 5, maxResultCount: 5 };

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 10 });

      await service.getRolesById(params, 'unit-1');

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { skipCount: 5, maxResultCount: 5 },
        })
      );
    });
  });

  describe('getMembersById', () => {
    it('should fetch members for organization unit', async () => {
      const unitId = 'unit-456';
      const params = { skipCount: 0, maxResultCount: 10 };
      const expectedResponse = {
        items: [
          { id: 'user-1', userName: 'john' },
          { id: 'user-2', userName: 'jane' },
        ],
        totalCount: 2,
      };

      mockRestService.request.mockResolvedValueOnce(expectedResponse);

      const result = await service.getMembersById(params, unitId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'GET',
        url: `/api/identity/organization-units/${unitId}/members`,
        params,
      });
      expect(result.items).toHaveLength(2);
    });

    it('should handle pagination for members', async () => {
      const params = { skipCount: 20, maxResultCount: 10 };

      mockRestService.request.mockResolvedValueOnce({ items: [], totalCount: 100 });

      await service.getMembersById(params, 'unit-1');

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          params: { skipCount: 20, maxResultCount: 10 },
        })
      );
    });
  });

  describe('moveByIdAndInput', () => {
    it('should move unit to new parent', async () => {
      const unitId = 'unit-to-move';
      const moveInput = createOrganizationUnitMoveInput({
        newParentId: 'new-parent-id',
      });

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.moveByIdAndInput(moveInput, unitId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: `/api/identity/organization-units/${unitId}/move`,
        body: moveInput,
      });
    });

    it('should move unit to root (no parent)', async () => {
      const moveInput = createOrganizationUnitMoveInput({
        newParentId: undefined,
      });

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.moveByIdAndInput(moveInput, 'unit-1');

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { newParentId: undefined },
        })
      );
    });
  });

  describe('updateByIdAndInput', () => {
    it('should update organization unit', async () => {
      const unitId = 'unit-to-update';
      const updateDto = createOrganizationUnitUpdateDto({
        displayName: 'Updated Name',
      });
      const expectedResult = createOrganizationUnitWithDetailsDto({
        id: unitId,
        displayName: 'Updated Name',
        code: '00001',
      });

      mockRestService.request.mockResolvedValueOnce(expectedResult);

      const result = await service.updateByIdAndInput(updateDto, unitId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'PUT',
        url: `/api/identity/organization-units/${unitId}`,
        body: updateDto,
      });
      expect(result.displayName).toBe('Updated Name');
    });

    it('should update with extra properties', async () => {
      const updateDto = createOrganizationUnitUpdateDto({
        displayName: 'Test',
        extraProperties: [{ key: 'value' }],
      });

      mockRestService.request.mockResolvedValueOnce({});

      await service.updateByIdAndInput(updateDto, 'unit-1');

      expect(mockRestService.request).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            extraProperties: [{ key: 'value' }],
          }),
        })
      );
    });
  });

  describe('removeMemberByIdAndMemberId', () => {
    it('should remove member from organization unit', async () => {
      const unitId = 'unit-123';
      const memberId = 'member-456';

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.removeMemberByIdAndMemberId(unitId, memberId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: `/api/identity/organization-units/${unitId}/members/${memberId}`,
      });
    });
  });

  describe('removeRoleByIdAndRoleId', () => {
    it('should remove role from organization unit', async () => {
      const unitId = 'unit-123';
      const roleId = 'role-789';

      mockRestService.request.mockResolvedValueOnce(undefined);

      await service.removeRoleByIdAndRoleId(unitId, roleId);

      expect(mockRestService.request).toHaveBeenCalledWith({
        method: 'DELETE',
        url: `/api/identity/organization-units/${unitId}/roles/${roleId}`,
      });
    });
  });

  describe('error handling', () => {
    it('should propagate errors from REST service', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.getById('unit-1')).rejects.toThrow('Network error');
    });

    it('should propagate errors on create', async () => {
      const error = new Error('Validation error');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(
        service.createByInput(createOrganizationUnitCreateDto({ displayName: '' }))
      ).rejects.toThrow('Validation error');
    });

    it('should propagate errors on delete', async () => {
      const error = new Error('Not found');
      mockRestService.request.mockRejectedValueOnce(error);

      await expect(service.deleteById('non-existent')).rejects.toThrow('Not found');
    });
  });
});
