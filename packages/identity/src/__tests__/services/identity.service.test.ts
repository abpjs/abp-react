import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityService } from '../../services/identity.service';
import { Identity } from '../../models';

describe('IdentityService', () => {
  let identityService: IdentityService;
  let mockRestService: {
    request: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRestService = {
      request: vi.fn(),
    };
    identityService = new IdentityService(mockRestService as any);
  });

  describe('apiName property (v2.4.0)', () => {
    it('should have apiName property with default value "default"', () => {
      expect(identityService.apiName).toBe('default');
    });

    it('should allow apiName to be modified', () => {
      identityService.apiName = 'customApi';
      expect(identityService.apiName).toBe('customApi');
    });

    it('should have apiName as a string type', () => {
      expect(typeof identityService.apiName).toBe('string');
    });
  });

  describe('Role Operations', () => {
    describe('getRoles', () => {
      it('should call request with correct parameters', async () => {
        const expectedResponse: Identity.RoleResponse = {
          items: [
            { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' },
          ],
          totalCount: 1,
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.getRoles();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/roles',
          params: {},
        });
        expect(result).toEqual(expectedResponse);
      });

      it('should pass pagination parameters', async () => {
        mockRestService.request.mockResolvedValue({ items: [], totalCount: 0 });
        const params = { skipCount: 0, maxResultCount: 10, filter: 'admin' };

        await identityService.getRoles(params);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/roles',
          params,
        });
      });
    });

    describe('getAllRoles (v2.4.0)', () => {
      it('should call request with correct parameters', async () => {
        const expectedResponse: Identity.RoleResponse = {
          items: [
            { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' },
            { id: 'role-2', name: 'User', isDefault: true, isPublic: true, isStatic: false, concurrencyStamp: 'stamp2' },
            { id: 'role-3', name: 'Moderator', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp3' },
          ],
          totalCount: 3,
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.getAllRoles();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/roles/all',
        });
        expect(result).toEqual(expectedResponse);
      });

      it('should return all roles without pagination', async () => {
        const expectedResponse: Identity.RoleResponse = {
          items: [
            { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' },
            { id: 'role-2', name: 'User', isDefault: true, isPublic: true, isStatic: false, concurrencyStamp: 'stamp2' },
          ],
          totalCount: 2,
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.getAllRoles();

        expect(result.items).toHaveLength(2);
        expect(result.totalCount).toBe(2);
      });

      it('should propagate errors from request', async () => {
        const error = new Error('Failed to fetch all roles');
        mockRestService.request.mockRejectedValue(error);

        await expect(identityService.getAllRoles()).rejects.toThrow('Failed to fetch all roles');
      });
    });

    describe('getRoleById', () => {
      it('should fetch role by ID', async () => {
        const expectedRole: Identity.RoleItem = {
          id: 'role-1',
          name: 'Admin',
          isDefault: false,
          isPublic: true,
          isStatic: false,
          concurrencyStamp: 'stamp1',
        };
        mockRestService.request.mockResolvedValue(expectedRole);

        const result = await identityService.getRoleById('role-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/roles/role-1',
        });
        expect(result).toEqual(expectedRole);
      });
    });

    describe('createRole', () => {
      it('should create a new role', async () => {
        const newRole: Identity.RoleSaveRequest = {
          name: 'NewRole',
          isDefault: false,
          isPublic: true,
        };
        const expectedResponse: Identity.RoleItem = {
          id: 'new-role-id',
          ...newRole,
          isStatic: false,
          concurrencyStamp: 'stamp',
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.createRole(newRole);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'POST',
          url: '/api/identity/roles',
          body: newRole,
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('updateRole', () => {
      it('should update an existing role', async () => {
        const updatedRole: Identity.RoleSaveRequest = {
          name: 'UpdatedRole',
          isDefault: true,
          isPublic: false,
        };
        const expectedResponse: Identity.RoleItem = {
          id: 'role-1',
          ...updatedRole,
          isStatic: false,
          concurrencyStamp: 'new-stamp',
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.updateRole('role-1', updatedRole);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/identity/roles/role-1',
          body: updatedRole,
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('deleteRole', () => {
      it('should delete a role', async () => {
        const deletedRole: Identity.RoleItem = {
          id: 'role-1',
          name: 'ToDelete',
          isDefault: false,
          isPublic: true,
          isStatic: false,
          concurrencyStamp: 'stamp',
        };
        mockRestService.request.mockResolvedValue(deletedRole);

        const result = await identityService.deleteRole('role-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'DELETE',
          url: '/api/identity/roles/role-1',
        });
        expect(result).toEqual(deletedRole);
      });
    });
  });

  describe('User Operations', () => {
    describe('getUsers', () => {
      it('should call request with correct parameters', async () => {
        const expectedResponse: Identity.UserResponse = {
          items: [
            {
              id: 'user-1',
              userName: 'admin',
              name: 'Admin',
              surname: 'User',
              email: 'admin@example.com',
              phoneNumber: '',
              twoFactorEnabled: false,
              lockoutEnabled: true,
              tenantId: '',
              emailConfirmed: true,
              phoneNumberConfirmed: false,
              isLockedOut: false,
              concurrencyStamp: 'stamp1',
            },
          ],
          totalCount: 1,
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.getUsers();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/users',
          params: {},
        });
        expect(result).toEqual(expectedResponse);
      });

      it('should pass pagination parameters', async () => {
        mockRestService.request.mockResolvedValue({ items: [], totalCount: 0 });
        const params = { skipCount: 10, maxResultCount: 20, filter: 'john' };

        await identityService.getUsers(params);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/users',
          params,
        });
      });
    });

    describe('getUserById', () => {
      it('should fetch user by ID', async () => {
        const expectedUser: Identity.UserItem = {
          id: 'user-1',
          userName: 'admin',
          name: 'Admin',
          surname: 'User',
          email: 'admin@example.com',
          phoneNumber: '',
          twoFactorEnabled: false,
          lockoutEnabled: true,
          tenantId: '',
          emailConfirmed: true,
          phoneNumberConfirmed: false,
          isLockedOut: false,
          concurrencyStamp: 'stamp1',
        };
        mockRestService.request.mockResolvedValue(expectedUser);

        const result = await identityService.getUserById('user-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/users/user-1',
        });
        expect(result).toEqual(expectedUser);
      });
    });

    describe('getUserRoles', () => {
      it('should fetch roles for a user', async () => {
        const expectedResponse: Identity.RoleResponse = {
          items: [
            { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' },
          ],
          totalCount: 1,
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.getUserRoles('user-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/users/user-1/roles',
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('createUser', () => {
      it('should create a new user', async () => {
        const newUser: Identity.UserSaveRequest = {
          userName: 'newuser',
          name: 'New',
          surname: 'User',
          email: 'new@example.com',
          phoneNumber: '123456789',
          twoFactorEnabled: false,
          lockoutEnabled: true,
          password: 'Password123!',
          roleNames: ['User'],
        };
        const expectedResponse: Identity.UserItem = {
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
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.createUser(newUser);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'POST',
          url: '/api/identity/users',
          body: newUser,
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('updateUser', () => {
      it('should update an existing user', async () => {
        const updatedUser: Identity.UserSaveRequest = {
          userName: 'updateduser',
          name: 'Updated',
          surname: 'User',
          email: 'updated@example.com',
          phoneNumber: '987654321',
          twoFactorEnabled: true,
          lockoutEnabled: false,
          password: 'NewPassword123!',
          roleNames: ['Admin'],
        };
        const expectedResponse: Identity.UserItem = {
          id: 'user-1',
          userName: updatedUser.userName,
          name: updatedUser.name,
          surname: updatedUser.surname,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          twoFactorEnabled: updatedUser.twoFactorEnabled,
          lockoutEnabled: updatedUser.lockoutEnabled,
          tenantId: '',
          emailConfirmed: true,
          phoneNumberConfirmed: false,
          isLockedOut: false,
          concurrencyStamp: 'new-stamp',
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.updateUser('user-1', updatedUser);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/identity/users/user-1',
          body: updatedUser,
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('deleteUser', () => {
      it('should delete a user', async () => {
        mockRestService.request.mockResolvedValue(undefined);

        await identityService.deleteUser('user-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'DELETE',
          url: '/api/identity/users/user-1',
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from request', async () => {
      const error = new Error('Network error');
      mockRestService.request.mockRejectedValue(error);

      await expect(identityService.getRoles()).rejects.toThrow('Network error');
    });

    it('should propagate errors from user operations', async () => {
      const error = new Error('User not found');
      mockRestService.request.mockRejectedValue(error);

      await expect(identityService.getUserById('invalid-id')).rejects.toThrow('User not found');
    });
  });
});
