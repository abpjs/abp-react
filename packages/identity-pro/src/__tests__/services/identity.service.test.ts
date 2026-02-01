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

    describe('unlockUser (v2.2.0)', () => {
      it('should unlock a locked out user', async () => {
        mockRestService.request.mockResolvedValue(undefined);

        await identityService.unlockUser('user-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/identity/users/user-1/unlock',
        });
      });

      it('should propagate errors when unlocking fails', async () => {
        const error = new Error('User cannot be unlocked');
        mockRestService.request.mockRejectedValue(error);

        await expect(identityService.unlockUser('user-1')).rejects.toThrow('User cannot be unlocked');
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

  // Pro Features: Claim Type Operations
  describe('Pro: Claim Type Operations', () => {
    describe('getClaimTypeNames', () => {
      it('should fetch all claim type names', async () => {
        const expectedResponse: Identity.ClaimTypeName[] = [
          { name: 'email' },
          { name: 'role' },
          { name: 'preferred_username' },
        ];
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.getClaimTypeNames();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/claim-types/all',
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('getClaimTypes', () => {
      it('should fetch claim types with pagination', async () => {
        const expectedResponse: Identity.ClaimResponse = {
          items: [
            {
              id: 'claim-1',
              name: 'email',
              required: true,
              isStatic: true,
              regex: '',
              regexDescription: '',
              description: 'Email claim',
              valueType: 0,
            },
          ],
          totalCount: 1,
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.getClaimTypes();

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/claim-types',
          params: {},
        });
        expect(result).toEqual(expectedResponse);
      });

      it('should pass pagination parameters', async () => {
        mockRestService.request.mockResolvedValue({ items: [], totalCount: 0 });
        const params = { skipCount: 0, maxResultCount: 10, filter: 'email' };

        await identityService.getClaimTypes(params);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/claim-types',
          params,
        });
      });
    });

    describe('getClaimTypeById', () => {
      it('should fetch claim type by ID', async () => {
        const expectedClaimType: Identity.ClaimType = {
          id: 'claim-1',
          name: 'email',
          required: true,
          isStatic: true,
          regex: '',
          regexDescription: '',
          description: 'Email claim',
          valueType: 0,
        };
        mockRestService.request.mockResolvedValue(expectedClaimType);

        const result = await identityService.getClaimTypeById('claim-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/claim-types/claim-1',
        });
        expect(result).toEqual(expectedClaimType);
      });
    });

    describe('createClaimType', () => {
      it('should create a new claim type', async () => {
        const newClaimType: Identity.ClaimType = {
          name: 'custom_claim',
          required: false,
          isStatic: false,
          regex: '^[a-z]+$',
          regexDescription: 'Only lowercase letters',
          description: 'A custom claim type',
          valueType: 0,
        };
        const expectedResponse: Identity.ClaimType = {
          ...newClaimType,
          id: 'new-claim-id',
        };
        mockRestService.request.mockResolvedValue(expectedResponse);

        const result = await identityService.createClaimType(newClaimType);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'POST',
          url: '/api/identity/claim-types',
          body: newClaimType,
        });
        expect(result).toEqual(expectedResponse);
      });
    });

    describe('updateClaimType', () => {
      it('should update an existing claim type', async () => {
        const updatedClaimType: Identity.ClaimType = {
          id: 'claim-1',
          name: 'updated_claim',
          required: true,
          isStatic: false,
          regex: '^[A-Z]+$',
          regexDescription: 'Only uppercase letters',
          description: 'Updated claim type',
          valueType: 1,
        };
        mockRestService.request.mockResolvedValue(updatedClaimType);

        const result = await identityService.updateClaimType(updatedClaimType);

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/identity/claim-types/claim-1',
          body: updatedClaimType,
        });
        expect(result).toEqual(updatedClaimType);
      });
    });

    describe('deleteClaimType', () => {
      it('should delete a claim type', async () => {
        mockRestService.request.mockResolvedValue(undefined);

        await identityService.deleteClaimType('claim-1');

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'DELETE',
          url: '/api/identity/claim-types/claim-1',
        });
      });
    });
  });

  // Pro Features: User/Role Claims
  describe('Pro: User/Role Claims Operations', () => {
    describe('getClaims', () => {
      it('should fetch claims for a user', async () => {
        const expectedClaims: Identity.ClaimRequest[] = [
          { userId: 'user-1', claimType: 'email', claimValue: 'user@example.com' },
          { userId: 'user-1', claimType: 'role', claimValue: 'admin' },
        ];
        mockRestService.request.mockResolvedValue(expectedClaims);

        const result = await identityService.getClaims({ id: 'user-1', type: 'users' });

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/users/user-1/claims',
        });
        expect(result).toEqual(expectedClaims);
      });

      it('should fetch claims for a role', async () => {
        const expectedClaims: Identity.ClaimRequest[] = [
          { roleId: 'role-1', claimType: 'permission', claimValue: 'read' },
        ];
        mockRestService.request.mockResolvedValue(expectedClaims);

        const result = await identityService.getClaims({ id: 'role-1', type: 'roles' });

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'GET',
          url: '/api/identity/roles/role-1/claims',
        });
        expect(result).toEqual(expectedClaims);
      });
    });

    describe('updateClaims', () => {
      it('should update claims for a user', async () => {
        const claims: Identity.ClaimRequest[] = [
          { userId: 'user-1', claimType: 'email', claimValue: 'newemail@example.com' },
        ];
        mockRestService.request.mockResolvedValue(undefined);

        await identityService.updateClaims({ id: 'user-1', type: 'users', claims });

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/identity/users/user-1/claims',
          body: claims,
        });
      });

      it('should update claims for a role', async () => {
        const claims: Identity.ClaimRequest[] = [
          { roleId: 'role-1', claimType: 'permission', claimValue: 'write' },
        ];
        mockRestService.request.mockResolvedValue(undefined);

        await identityService.updateClaims({ id: 'role-1', type: 'roles', claims });

        expect(mockRestService.request).toHaveBeenCalledWith({
          method: 'PUT',
          url: '/api/identity/roles/role-1/claims',
          body: claims,
        });
      });
    });
  });
});
