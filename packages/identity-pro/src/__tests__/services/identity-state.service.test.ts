/**
 * Tests for IdentityStateService
 * @abpjs/identity-pro v2.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityStateService } from '../../services/identity-state.service';
import type { Identity } from '../../models';

describe('IdentityStateService', () => {
  let mockRequest: ReturnType<typeof vi.fn>;
  let stateService: IdentityStateService;

  beforeEach(() => {
    mockRequest = vi.fn();
    const mockRestService = { request: mockRequest };
    stateService = new IdentityStateService(mockRestService as any);
  });

  // ========================
  // Getter Methods Tests
  // ========================

  describe('Getter Methods', () => {
    it('should return empty roles initially', () => {
      expect(stateService.getRoles()).toEqual([]);
    });

    it('should return 0 roles total count initially', () => {
      expect(stateService.getRolesTotalCount()).toBe(0);
    });

    it('should return empty users initially', () => {
      expect(stateService.getUsers()).toEqual([]);
    });

    it('should return 0 users total count initially', () => {
      expect(stateService.getUsersTotalCount()).toBe(0);
    });

    it('should return empty claim types initially', () => {
      expect(stateService.getClaimTypes()).toEqual([]);
    });

    it('should return 0 claim types total count initially', () => {
      expect(stateService.getClaimTypesTotalCount()).toBe(0);
    });

    it('should return empty claim type names initially', () => {
      expect(stateService.getClaimTypeNames()).toEqual([]);
    });
  });

  // ========================
  // Role Dispatch Methods Tests (v2.0.0)
  // ========================

  describe('Role Dispatch Methods (v2.0.0)', () => {
    const mockRole: Identity.RoleItem = {
      id: 'role-1',
      name: 'Admin',
      isDefault: false,
      isPublic: true,
      isStatic: false,
      concurrencyStamp: 'stamp1',
    };

    describe('dispatchGetRoles', () => {
      it('should fetch roles and update state', async () => {
        const mockResponse: Identity.RoleResponse = {
          items: [mockRole],
          totalCount: 1,
        };
        mockRequest.mockResolvedValue(mockResponse);

        const result = await stateService.dispatchGetRoles();

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/roles',
          params: {},
        });
        expect(result).toEqual(mockResponse);
        expect(stateService.getRoles()).toEqual([mockRole]);
        expect(stateService.getRolesTotalCount()).toBe(1);
      });

      it('should pass query parameters to the API', async () => {
        const mockResponse: Identity.RoleResponse = { items: [], totalCount: 0 };
        mockRequest.mockResolvedValue(mockResponse);

        const params = { skipCount: 0, maxResultCount: 10, filter: 'admin' };
        await stateService.dispatchGetRoles(params);

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/roles',
          params,
        });
      });

      it('should handle empty response', async () => {
        const mockResponse: Identity.RoleResponse = { items: [], totalCount: 0 };
        mockRequest.mockResolvedValue(mockResponse);

        await stateService.dispatchGetRoles();

        expect(stateService.getRoles()).toEqual([]);
        expect(stateService.getRolesTotalCount()).toBe(0);
      });

      it('should handle response with undefined items', async () => {
        const mockResponse = { totalCount: 5 } as Identity.RoleResponse;
        mockRequest.mockResolvedValue(mockResponse);

        await stateService.dispatchGetRoles();

        expect(stateService.getRoles()).toEqual([]);
      });
    });

    describe('dispatchGetRoleById', () => {
      it('should fetch role by ID', async () => {
        mockRequest.mockResolvedValue(mockRole);

        const result = await stateService.dispatchGetRoleById('role-1');

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/roles/role-1',
        });
        expect(result).toEqual(mockRole);
      });
    });

    describe('dispatchDeleteRole', () => {
      it('should delete role and refresh roles list', async () => {
        // First call: delete
        mockRequest.mockResolvedValueOnce(mockRole);
        // Second call: refresh roles
        mockRequest.mockResolvedValueOnce({ items: [], totalCount: 0 });

        const result = await stateService.dispatchDeleteRole('role-1');

        expect(mockRequest).toHaveBeenNthCalledWith(1, {
          method: 'DELETE',
          url: '/api/identity/roles/role-1',
        });
        expect(mockRequest).toHaveBeenNthCalledWith(2, {
          method: 'GET',
          url: '/api/identity/roles',
          params: {},
        });
        expect(result).toEqual(mockRole);
      });
    });

    describe('dispatchCreateRole', () => {
      it('should create role and refresh roles list', async () => {
        const newRole: Identity.RoleSaveRequest = {
          name: 'NewRole',
          isDefault: false,
          isPublic: true,
        };
        const createdRole = { ...newRole, id: 'new-role-id', isStatic: false, concurrencyStamp: 'stamp' };

        // First call: create
        mockRequest.mockResolvedValueOnce(createdRole);
        // Second call: refresh roles
        mockRequest.mockResolvedValueOnce({ items: [createdRole], totalCount: 1 });

        const result = await stateService.dispatchCreateRole(newRole);

        expect(mockRequest).toHaveBeenNthCalledWith(1, {
          method: 'POST',
          url: '/api/identity/roles',
          body: newRole,
        });
        expect(result).toEqual(createdRole);
        expect(stateService.getRoles()).toEqual([createdRole]);
      });
    });

    describe('dispatchUpdateRole', () => {
      it('should update role and refresh roles list', async () => {
        const updatedRoleData: Identity.RoleSaveRequest = {
          name: 'UpdatedRole',
          isDefault: true,
          isPublic: false,
        };
        const updatedRole = { ...updatedRoleData, id: 'role-1', isStatic: false, concurrencyStamp: 'new-stamp' };

        // First call: update
        mockRequest.mockResolvedValueOnce(updatedRole);
        // Second call: refresh roles
        mockRequest.mockResolvedValueOnce({ items: [updatedRole], totalCount: 1 });

        const result = await stateService.dispatchUpdateRole('role-1', updatedRoleData);

        expect(mockRequest).toHaveBeenNthCalledWith(1, {
          method: 'PUT',
          url: '/api/identity/roles/role-1',
          body: updatedRoleData,
        });
        expect(result).toEqual(updatedRole);
      });
    });
  });

  // ========================
  // Claim Type Dispatch Methods Tests (v2.0.0)
  // ========================

  describe('Claim Type Dispatch Methods (v2.0.0)', () => {
    const mockClaimType: Identity.ClaimType = {
      id: 'claim-1',
      name: 'email',
      required: true,
      isStatic: true,
      regex: '',
      regexDescription: '',
      description: 'Email claim',
      valueType: 0,
    };

    describe('dispatchGetClaimTypes', () => {
      it('should fetch claim types and update state', async () => {
        const mockResponse: Identity.ClaimResponse = {
          items: [mockClaimType],
          totalCount: 1,
        };
        mockRequest.mockResolvedValue(mockResponse);

        const result = await stateService.dispatchGetClaimTypes();

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/claim-types',
          params: {},
        });
        expect(result).toEqual(mockResponse);
        expect(stateService.getClaimTypes()).toEqual([mockClaimType]);
        expect(stateService.getClaimTypesTotalCount()).toBe(1);
      });

      it('should pass query parameters to the API', async () => {
        const mockResponse: Identity.ClaimResponse = { items: [], totalCount: 0 };
        mockRequest.mockResolvedValue(mockResponse);

        const params = { skipCount: 0, maxResultCount: 10, filter: 'email' };
        await stateService.dispatchGetClaimTypes(params);

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/claim-types',
          params,
        });
      });

      it('should handle response with undefined items', async () => {
        const mockResponse = { totalCount: 3 } as Identity.ClaimResponse;
        mockRequest.mockResolvedValue(mockResponse);

        await stateService.dispatchGetClaimTypes();

        expect(stateService.getClaimTypes()).toEqual([]);
      });
    });

    describe('dispatchGetClaimTypeById', () => {
      it('should fetch claim type by ID', async () => {
        mockRequest.mockResolvedValue(mockClaimType);

        const result = await stateService.dispatchGetClaimTypeById('claim-1');

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/claim-types/claim-1',
        });
        expect(result).toEqual(mockClaimType);
      });
    });

    describe('dispatchDeleteClaimType', () => {
      it('should delete claim type and refresh claim types list', async () => {
        // First call: delete
        mockRequest.mockResolvedValueOnce(undefined);
        // Second call: refresh claim types
        mockRequest.mockResolvedValueOnce({ items: [], totalCount: 0 });

        await stateService.dispatchDeleteClaimType('claim-1');

        expect(mockRequest).toHaveBeenNthCalledWith(1, {
          method: 'DELETE',
          url: '/api/identity/claim-types/claim-1',
        });
        expect(mockRequest).toHaveBeenNthCalledWith(2, {
          method: 'GET',
          url: '/api/identity/claim-types',
          params: {},
        });
      });
    });

    describe('dispatchCreateClaimType', () => {
      it('should create claim type and refresh claim types list', async () => {
        const newClaimType: Identity.ClaimType = {
          name: 'custom_claim',
          required: false,
          isStatic: false,
          regex: '',
          regexDescription: '',
          description: 'Custom claim',
          valueType: 0,
        };
        const createdClaimType = { ...newClaimType, id: 'new-claim-id' };

        // First call: create
        mockRequest.mockResolvedValueOnce(createdClaimType);
        // Second call: refresh claim types
        mockRequest.mockResolvedValueOnce({ items: [createdClaimType], totalCount: 1 });

        const result = await stateService.dispatchCreateClaimType(newClaimType);

        expect(mockRequest).toHaveBeenNthCalledWith(1, {
          method: 'POST',
          url: '/api/identity/claim-types',
          body: newClaimType,
        });
        expect(result).toEqual(createdClaimType);
      });
    });

    describe('dispatchUpdateClaimType', () => {
      it('should update claim type and refresh claim types list', async () => {
        const updatedClaimType: Identity.ClaimType = {
          id: 'claim-1',
          name: 'updated_claim',
          required: true,
          isStatic: false,
          regex: '^[A-Z]+$',
          regexDescription: 'Uppercase',
          description: 'Updated claim',
          valueType: 1,
        };

        // First call: update
        mockRequest.mockResolvedValueOnce(updatedClaimType);
        // Second call: refresh claim types
        mockRequest.mockResolvedValueOnce({ items: [updatedClaimType], totalCount: 1 });

        const result = await stateService.dispatchUpdateClaimType(updatedClaimType);

        expect(mockRequest).toHaveBeenNthCalledWith(1, {
          method: 'PUT',
          url: '/api/identity/claim-types/claim-1',
          body: updatedClaimType,
        });
        expect(result).toEqual(updatedClaimType);
      });
    });

    describe('dispatchGetClaimTypeNames', () => {
      it('should fetch claim type names and update state', async () => {
        const mockClaimTypeNames: Identity.ClaimTypeName[] = [
          { name: 'email' },
          { name: 'role' },
          { name: 'preferred_username' },
        ];
        mockRequest.mockResolvedValue(mockClaimTypeNames);

        const result = await stateService.dispatchGetClaimTypeNames();

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/claim-types/all',
        });
        expect(result).toEqual(mockClaimTypeNames);
        expect(stateService.getClaimTypeNames()).toEqual(mockClaimTypeNames);
      });

      it('should handle null response', async () => {
        mockRequest.mockResolvedValue(null);

        await stateService.dispatchGetClaimTypeNames();

        expect(stateService.getClaimTypeNames()).toEqual([]);
      });
    });
  });

  // ========================
  // User Dispatch Methods Tests (v2.0.0)
  // ========================

  describe('User Dispatch Methods (v2.0.0)', () => {
    const mockUser: Identity.UserItem = {
      id: 'user-1',
      userName: 'admin',
      name: 'Admin',
      surname: 'User',
      email: 'admin@example.com',
      phoneNumber: '123456789',
      twoFactorEnabled: false,
      lockoutEnabled: true,
      tenantId: '',
      emailConfirmed: true,
      phoneNumberConfirmed: false,
      isLockedOut: false,
      concurrencyStamp: 'stamp1',
    };

    describe('dispatchGetUsers', () => {
      it('should fetch users and update state', async () => {
        const mockResponse: Identity.UserResponse = {
          items: [mockUser],
          totalCount: 1,
        };
        mockRequest.mockResolvedValue(mockResponse);

        const result = await stateService.dispatchGetUsers();

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/users',
          params: {},
        });
        expect(result).toEqual(mockResponse);
        expect(stateService.getUsers()).toEqual([mockUser]);
        expect(stateService.getUsersTotalCount()).toBe(1);
      });

      it('should pass query parameters to the API', async () => {
        const mockResponse: Identity.UserResponse = { items: [], totalCount: 0 };
        mockRequest.mockResolvedValue(mockResponse);

        const params = { skipCount: 0, maxResultCount: 10, filter: 'admin' };
        await stateService.dispatchGetUsers(params);

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/users',
          params,
        });
      });

      it('should handle response with undefined items', async () => {
        const mockResponse = { totalCount: 10 } as Identity.UserResponse;
        mockRequest.mockResolvedValue(mockResponse);

        await stateService.dispatchGetUsers();

        expect(stateService.getUsers()).toEqual([]);
      });
    });

    describe('dispatchGetUserById', () => {
      it('should fetch user by ID', async () => {
        mockRequest.mockResolvedValue(mockUser);

        const result = await stateService.dispatchGetUserById('user-1');

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/users/user-1',
        });
        expect(result).toEqual(mockUser);
      });
    });

    describe('dispatchDeleteUser', () => {
      it('should delete user and refresh users list', async () => {
        // First call: delete
        mockRequest.mockResolvedValueOnce(undefined);
        // Second call: refresh users
        mockRequest.mockResolvedValueOnce({ items: [], totalCount: 0 });

        await stateService.dispatchDeleteUser('user-1');

        expect(mockRequest).toHaveBeenNthCalledWith(1, {
          method: 'DELETE',
          url: '/api/identity/users/user-1',
        });
        expect(mockRequest).toHaveBeenNthCalledWith(2, {
          method: 'GET',
          url: '/api/identity/users',
          params: {},
        });
      });
    });

    describe('dispatchCreateUser', () => {
      it('should create user and refresh users list', async () => {
        const newUser: Identity.UserSaveRequest = {
          userName: 'newuser',
          name: 'New',
          surname: 'User',
          email: 'new@example.com',
          phoneNumber: '987654321',
          twoFactorEnabled: false,
          lockoutEnabled: true,
          password: 'Password123!',
          roleNames: ['User'],
        };
        const createdUser: Identity.UserItem = {
          id: 'new-user-id',
          userName: newUser.userName,
          name: newUser.name,
          surname: newUser.surname,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          twoFactorEnabled: newUser.twoFactorEnabled,
          lockoutEnabled: newUser.lockoutEnabled,
          tenantId: '',
          emailConfirmed: false,
          phoneNumberConfirmed: false,
          isLockedOut: false,
          concurrencyStamp: 'stamp',
        };

        // First call: create
        mockRequest.mockResolvedValueOnce(createdUser);
        // Second call: refresh users
        mockRequest.mockResolvedValueOnce({ items: [createdUser], totalCount: 1 });

        const result = await stateService.dispatchCreateUser(newUser);

        expect(mockRequest).toHaveBeenNthCalledWith(1, {
          method: 'POST',
          url: '/api/identity/users',
          body: newUser,
        });
        expect(result).toEqual(createdUser);
        expect(stateService.getUsers()).toEqual([createdUser]);
      });
    });

    describe('dispatchUpdateUser', () => {
      it('should update user and refresh users list', async () => {
        const updatedUserData: Identity.UserSaveRequest = {
          userName: 'updateduser',
          name: 'Updated',
          surname: 'User',
          email: 'updated@example.com',
          phoneNumber: '111222333',
          twoFactorEnabled: true,
          lockoutEnabled: false,
          password: 'NewPassword123!',
          roleNames: ['Admin'],
        };
        const updatedUser: Identity.UserItem = {
          id: 'user-1',
          userName: updatedUserData.userName,
          name: updatedUserData.name,
          surname: updatedUserData.surname,
          email: updatedUserData.email,
          phoneNumber: updatedUserData.phoneNumber,
          twoFactorEnabled: updatedUserData.twoFactorEnabled,
          lockoutEnabled: updatedUserData.lockoutEnabled,
          tenantId: '',
          emailConfirmed: true,
          phoneNumberConfirmed: false,
          isLockedOut: false,
          concurrencyStamp: 'new-stamp',
        };

        // First call: update
        mockRequest.mockResolvedValueOnce(updatedUser);
        // Second call: refresh users
        mockRequest.mockResolvedValueOnce({ items: [updatedUser], totalCount: 1 });

        const result = await stateService.dispatchUpdateUser('user-1', updatedUserData);

        expect(mockRequest).toHaveBeenNthCalledWith(1, {
          method: 'PUT',
          url: '/api/identity/users/user-1',
          body: updatedUserData,
        });
        expect(result).toEqual(updatedUser);
      });
    });

    describe('dispatchGetUserRoles', () => {
      it('should fetch user roles', async () => {
        const mockRoles: Identity.RoleItem[] = [
          { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' },
          { id: 'role-2', name: 'User', isDefault: true, isPublic: true, isStatic: false, concurrencyStamp: 'stamp2' },
        ];
        mockRequest.mockResolvedValue({ items: mockRoles, totalCount: 2 });

        const result = await stateService.dispatchGetUserRoles('user-1');

        expect(mockRequest).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/users/user-1/roles',
        });
        expect(result).toEqual(mockRoles);
      });

      it('should handle response with undefined items', async () => {
        mockRequest.mockResolvedValue({ totalCount: 0 });

        const result = await stateService.dispatchGetUserRoles('user-1');

        expect(result).toEqual([]);
      });
    });
  });

  // ========================
  // State Update Tests
  // ========================

  describe('State Updates', () => {
    it('should update state after multiple dispatch calls', async () => {
      // First: fetch roles
      const rolesResponse: Identity.RoleResponse = {
        items: [{ id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp' }],
        totalCount: 1,
      };
      mockRequest.mockResolvedValueOnce(rolesResponse);
      await stateService.dispatchGetRoles();

      // Second: fetch users
      const usersResponse: Identity.UserResponse = {
        items: [{ id: 'user-1', userName: 'admin', name: 'Admin', surname: 'User', email: 'admin@example.com', phoneNumber: '', twoFactorEnabled: false, lockoutEnabled: true, tenantId: '', emailConfirmed: true, phoneNumberConfirmed: false, isLockedOut: false, concurrencyStamp: 'stamp' }],
        totalCount: 1,
      };
      mockRequest.mockResolvedValueOnce(usersResponse);
      await stateService.dispatchGetUsers();

      // Third: fetch claim types
      const claimTypesResponse: Identity.ClaimResponse = {
        items: [{ id: 'claim-1', name: 'email', required: true, isStatic: true, regex: '', regexDescription: '', description: 'Email', valueType: 0 }],
        totalCount: 1,
      };
      mockRequest.mockResolvedValueOnce(claimTypesResponse);
      await stateService.dispatchGetClaimTypes();

      // Verify all state was updated correctly
      expect(stateService.getRolesTotalCount()).toBe(1);
      expect(stateService.getUsersTotalCount()).toBe(1);
      expect(stateService.getClaimTypesTotalCount()).toBe(1);
      expect(stateService.getRoles().length).toBe(1);
      expect(stateService.getUsers().length).toBe(1);
      expect(stateService.getClaimTypes().length).toBe(1);
    });
  });

  // ========================
  // Edge Cases and Error Handling
  // ========================

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined totalCount in roles response', async () => {
      const mockResponse = { items: [] } as unknown as Identity.RoleResponse;
      mockRequest.mockResolvedValue(mockResponse);

      await stateService.dispatchGetRoles();

      expect(stateService.getRolesTotalCount()).toBe(0);
    });

    it('should handle undefined totalCount in users response', async () => {
      const mockResponse = { items: [] } as unknown as Identity.UserResponse;
      mockRequest.mockResolvedValue(mockResponse);

      await stateService.dispatchGetUsers();

      expect(stateService.getUsersTotalCount()).toBe(0);
    });

    it('should handle undefined totalCount in claim types response', async () => {
      const mockResponse = { items: [] } as unknown as Identity.ClaimResponse;
      mockRequest.mockResolvedValue(mockResponse);

      await stateService.dispatchGetClaimTypes();

      expect(stateService.getClaimTypesTotalCount()).toBe(0);
    });
  });
});
