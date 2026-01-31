import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityStateService } from '../../services/identity-state.service';
import { IdentityService } from '../../services/identity.service';
import type { Identity } from '../../models';

// Mock IdentityService
const mockIdentityService = {
  getRoles: vi.fn(),
  getRoleById: vi.fn(),
  deleteRole: vi.fn(),
  createRole: vi.fn(),
  updateRole: vi.fn(),
  getUsers: vi.fn(),
  getUserById: vi.fn(),
  getUserRoles: vi.fn(),
  deleteUser: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
} as unknown as IdentityService;

// Mock data
const mockRoles: Identity.RoleItem[] = [
  { id: 'role-1', name: 'admin', isDefault: false, isPublic: true, isStatic: true, concurrencyStamp: 'stamp-1' },
  { id: 'role-2', name: 'user', isDefault: true, isPublic: true, isStatic: false, concurrencyStamp: 'stamp-2' },
];

const mockUsers: Identity.UserItem[] = [
  {
    id: 'user-1',
    userName: 'admin',
    email: 'admin@example.com',
    phoneNumber: '123-456-7890',
    name: 'Admin',
    surname: 'User',
    lockoutEnabled: true,
    twoFactorEnabled: false,
    tenantId: 'tenant-1',
    emailConfirmed: true,
    phoneNumberConfirmed: false,
    isLockedOut: false,
    concurrencyStamp: 'stamp-1',
  },
  {
    id: 'user-2',
    userName: 'john',
    email: 'john@example.com',
    phoneNumber: '098-765-4321',
    name: 'John',
    surname: 'Doe',
    lockoutEnabled: true,
    twoFactorEnabled: true,
    tenantId: 'tenant-1',
    emailConfirmed: true,
    phoneNumberConfirmed: true,
    isLockedOut: false,
    concurrencyStamp: 'stamp-2',
  },
];

describe('IdentityStateService', () => {
  let stateService: IdentityStateService;

  beforeEach(() => {
    vi.clearAllMocks();
    stateService = new IdentityStateService(mockIdentityService);
  });

  describe('Initial State', () => {
    it('should have empty roles initially', () => {
      expect(stateService.getRoles()).toEqual([]);
    });

    it('should have zero roles total count initially', () => {
      expect(stateService.getRolesTotalCount()).toBe(0);
    });

    it('should have empty users initially', () => {
      expect(stateService.getUsers()).toEqual([]);
    });

    it('should have zero users total count initially', () => {
      expect(stateService.getUsersTotalCount()).toBe(0);
    });
  });

  describe('Role Operations', () => {
    describe('dispatchGetRoles', () => {
      it('should fetch roles and update state', async () => {
        const mockResponse: Identity.RoleResponse = {
          items: mockRoles,
          totalCount: 2,
        };
        vi.mocked(mockIdentityService.getRoles).mockResolvedValue(mockResponse);

        const result = await stateService.dispatchGetRoles();

        expect(mockIdentityService.getRoles).toHaveBeenCalledWith(undefined);
        expect(result).toEqual(mockResponse);
        expect(stateService.getRoles()).toEqual(mockRoles);
        expect(stateService.getRolesTotalCount()).toBe(2);
      });

      it('should pass query parameters to service', async () => {
        const mockResponse: Identity.RoleResponse = {
          items: mockRoles,
          totalCount: 2,
        };
        vi.mocked(mockIdentityService.getRoles).mockResolvedValue(mockResponse);

        const params = { skipCount: 10, maxResultCount: 5, filter: 'admin' };
        await stateService.dispatchGetRoles(params);

        expect(mockIdentityService.getRoles).toHaveBeenCalledWith(params);
      });

      it('should handle empty response', async () => {
        const mockResponse: Identity.RoleResponse = {
          items: [],
          totalCount: 0,
        };
        vi.mocked(mockIdentityService.getRoles).mockResolvedValue(mockResponse);

        await stateService.dispatchGetRoles();

        expect(stateService.getRoles()).toEqual([]);
        expect(stateService.getRolesTotalCount()).toBe(0);
      });
    });

    describe('dispatchGetRoleById', () => {
      it('should fetch a role by ID', async () => {
        const mockRole = mockRoles[0];
        vi.mocked(mockIdentityService.getRoleById).mockResolvedValue(mockRole);

        const result = await stateService.dispatchGetRoleById('role-1');

        expect(mockIdentityService.getRoleById).toHaveBeenCalledWith('role-1');
        expect(result).toEqual(mockRole);
      });
    });

    describe('dispatchDeleteRole', () => {
      it('should delete a role and refresh the list', async () => {
        const deletedRole = mockRoles[1];
        vi.mocked(mockIdentityService.deleteRole).mockResolvedValue(deletedRole);
        vi.mocked(mockIdentityService.getRoles).mockResolvedValue({
          items: [mockRoles[0]],
          totalCount: 1,
        });

        const result = await stateService.dispatchDeleteRole('role-2');

        expect(mockIdentityService.deleteRole).toHaveBeenCalledWith('role-2');
        expect(mockIdentityService.getRoles).toHaveBeenCalled();
        expect(result).toEqual(deletedRole);
        expect(stateService.getRoles()).toEqual([mockRoles[0]]);
        expect(stateService.getRolesTotalCount()).toBe(1);
      });
    });

    describe('dispatchCreateRole', () => {
      it('should create a role and refresh the list', async () => {
        const newRole: Identity.RoleSaveRequest = {
          name: 'newRole',
          isDefault: false,
          isPublic: true,
        };
        const createdRole: Identity.RoleItem = {
          ...newRole,
          id: 'role-3',
          isStatic: false,
          concurrencyStamp: 'stamp-3',
        };
        vi.mocked(mockIdentityService.createRole).mockResolvedValue(createdRole);
        vi.mocked(mockIdentityService.getRoles).mockResolvedValue({
          items: [...mockRoles, createdRole],
          totalCount: 3,
        });

        const result = await stateService.dispatchCreateRole(newRole);

        expect(mockIdentityService.createRole).toHaveBeenCalledWith(newRole);
        expect(mockIdentityService.getRoles).toHaveBeenCalled();
        expect(result).toEqual(createdRole);
        expect(stateService.getRolesTotalCount()).toBe(3);
      });
    });

    describe('dispatchUpdateRole', () => {
      it('should update a role and refresh the list', async () => {
        const updatedData: Identity.RoleSaveRequest = {
          name: 'updatedAdmin',
          isDefault: true,
          isPublic: false,
        };
        const updatedRole: Identity.RoleItem = {
          ...mockRoles[0],
          ...updatedData,
        };
        vi.mocked(mockIdentityService.updateRole).mockResolvedValue(updatedRole);
        vi.mocked(mockIdentityService.getRoles).mockResolvedValue({
          items: [updatedRole, mockRoles[1]],
          totalCount: 2,
        });

        const result = await stateService.dispatchUpdateRole({
          id: 'role-1',
          body: updatedData,
        });

        expect(mockIdentityService.updateRole).toHaveBeenCalledWith('role-1', updatedData);
        expect(mockIdentityService.getRoles).toHaveBeenCalled();
        expect(result).toEqual(updatedRole);
      });
    });
  });

  describe('User Operations', () => {
    describe('dispatchGetUsers', () => {
      it('should fetch users and update state', async () => {
        const mockResponse: Identity.UserResponse = {
          items: mockUsers,
          totalCount: 2,
        };
        vi.mocked(mockIdentityService.getUsers).mockResolvedValue(mockResponse);

        const result = await stateService.dispatchGetUsers();

        expect(mockIdentityService.getUsers).toHaveBeenCalledWith(undefined);
        expect(result).toEqual(mockResponse);
        expect(stateService.getUsers()).toEqual(mockUsers);
        expect(stateService.getUsersTotalCount()).toBe(2);
      });

      it('should pass query parameters to service', async () => {
        const mockResponse: Identity.UserResponse = {
          items: mockUsers,
          totalCount: 2,
        };
        vi.mocked(mockIdentityService.getUsers).mockResolvedValue(mockResponse);

        const params = { skipCount: 0, maxResultCount: 10, filter: 'john' };
        await stateService.dispatchGetUsers(params);

        expect(mockIdentityService.getUsers).toHaveBeenCalledWith(params);
      });

      it('should handle empty response', async () => {
        const mockResponse: Identity.UserResponse = {
          items: [],
          totalCount: 0,
        };
        vi.mocked(mockIdentityService.getUsers).mockResolvedValue(mockResponse);

        await stateService.dispatchGetUsers();

        expect(stateService.getUsers()).toEqual([]);
        expect(stateService.getUsersTotalCount()).toBe(0);
      });
    });

    describe('dispatchGetUserById', () => {
      it('should fetch a user by ID', async () => {
        const mockUser = mockUsers[0];
        vi.mocked(mockIdentityService.getUserById).mockResolvedValue(mockUser);

        const result = await stateService.dispatchGetUserById('user-1');

        expect(mockIdentityService.getUserById).toHaveBeenCalledWith('user-1');
        expect(result).toEqual(mockUser);
      });
    });

    describe('dispatchDeleteUser', () => {
      it('should delete a user and refresh the list', async () => {
        vi.mocked(mockIdentityService.deleteUser).mockResolvedValue(undefined);
        vi.mocked(mockIdentityService.getUsers).mockResolvedValue({
          items: [mockUsers[1]],
          totalCount: 1,
        });

        await stateService.dispatchDeleteUser('user-1');

        expect(mockIdentityService.deleteUser).toHaveBeenCalledWith('user-1');
        expect(mockIdentityService.getUsers).toHaveBeenCalled();
        expect(stateService.getUsers()).toEqual([mockUsers[1]]);
        expect(stateService.getUsersTotalCount()).toBe(1);
      });
    });

    describe('dispatchCreateUser', () => {
      it('should create a user and refresh the list', async () => {
        const newUser: Identity.UserSaveRequest = {
          userName: 'newuser',
          name: 'New',
          surname: 'User',
          email: 'new@example.com',
          phoneNumber: '555-555-5555',
          password: 'Password123!',
          lockoutEnabled: true,
          twoFactorEnabled: false,
          roleNames: ['user'],
        };
        const createdUser: Identity.UserItem = {
          id: 'user-3',
          userName: newUser.userName,
          name: newUser.name,
          surname: newUser.surname,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          lockoutEnabled: newUser.lockoutEnabled,
          twoFactorEnabled: newUser.twoFactorEnabled,
          tenantId: 'tenant-1',
          emailConfirmed: false,
          phoneNumberConfirmed: false,
          isLockedOut: false,
          concurrencyStamp: 'stamp-3',
        };
        vi.mocked(mockIdentityService.createUser).mockResolvedValue(createdUser);
        vi.mocked(mockIdentityService.getUsers).mockResolvedValue({
          items: [...mockUsers, createdUser],
          totalCount: 3,
        });

        const result = await stateService.dispatchCreateUser(newUser);

        expect(mockIdentityService.createUser).toHaveBeenCalledWith(newUser);
        expect(mockIdentityService.getUsers).toHaveBeenCalled();
        expect(result).toEqual(createdUser);
        expect(stateService.getUsersTotalCount()).toBe(3);
      });
    });

    describe('dispatchUpdateUser', () => {
      it('should update a user and refresh the list', async () => {
        const updatedData: Identity.UserSaveRequest = {
          userName: 'admin_updated',
          name: 'Admin Updated',
          surname: 'User',
          email: 'admin_updated@example.com',
          phoneNumber: '111-111-1111',
          password: '',
          lockoutEnabled: false,
          twoFactorEnabled: true,
          roleNames: ['admin', 'user'],
        };
        const updatedUser: Identity.UserItem = {
          ...mockUsers[0],
          userName: updatedData.userName,
          name: updatedData.name,
          email: updatedData.email,
          phoneNumber: updatedData.phoneNumber,
          lockoutEnabled: updatedData.lockoutEnabled,
          twoFactorEnabled: updatedData.twoFactorEnabled,
        };
        vi.mocked(mockIdentityService.updateUser).mockResolvedValue(updatedUser);
        vi.mocked(mockIdentityService.getUsers).mockResolvedValue({
          items: [updatedUser, mockUsers[1]],
          totalCount: 2,
        });

        const result = await stateService.dispatchUpdateUser({
          id: 'user-1',
          body: updatedData,
        });

        expect(mockIdentityService.updateUser).toHaveBeenCalledWith('user-1', updatedData);
        expect(mockIdentityService.getUsers).toHaveBeenCalled();
        expect(result).toEqual(updatedUser);
      });
    });

    describe('dispatchGetUserRoles', () => {
      it('should fetch user roles', async () => {
        const mockRoleResponse: Identity.RoleResponse = {
          items: mockRoles,
          totalCount: 2,
        };
        vi.mocked(mockIdentityService.getUserRoles).mockResolvedValue(mockRoleResponse);

        const result = await stateService.dispatchGetUserRoles('user-1');

        expect(mockIdentityService.getUserRoles).toHaveBeenCalledWith('user-1');
        expect(result).toEqual(mockRoleResponse);
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from getRoles', async () => {
      const error = new Error('Network error');
      vi.mocked(mockIdentityService.getRoles).mockRejectedValue(error);

      await expect(stateService.dispatchGetRoles()).rejects.toThrow('Network error');
    });

    it('should propagate errors from createRole', async () => {
      const error = new Error('Validation error');
      vi.mocked(mockIdentityService.createRole).mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateRole({ name: '', isDefault: false, isPublic: false })
      ).rejects.toThrow('Validation error');
    });

    it('should propagate errors from getUsers', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(mockIdentityService.getUsers).mockRejectedValue(error);

      await expect(stateService.dispatchGetUsers()).rejects.toThrow('Unauthorized');
    });

    it('should propagate errors from deleteUser', async () => {
      const error = new Error('Not found');
      vi.mocked(mockIdentityService.deleteUser).mockRejectedValue(error);

      await expect(stateService.dispatchDeleteUser('nonexistent')).rejects.toThrow('Not found');
    });
  });

  describe('State Persistence', () => {
    it('should maintain roles state across multiple calls', async () => {
      // First call
      vi.mocked(mockIdentityService.getRoles).mockResolvedValueOnce({
        items: [mockRoles[0]],
        totalCount: 1,
      });
      await stateService.dispatchGetRoles();
      expect(stateService.getRoles()).toHaveLength(1);

      // Second call with different data
      vi.mocked(mockIdentityService.getRoles).mockResolvedValueOnce({
        items: mockRoles,
        totalCount: 2,
      });
      await stateService.dispatchGetRoles();
      expect(stateService.getRoles()).toHaveLength(2);
    });

    it('should maintain users state across multiple calls', async () => {
      // First call
      vi.mocked(mockIdentityService.getUsers).mockResolvedValueOnce({
        items: [mockUsers[0]],
        totalCount: 1,
      });
      await stateService.dispatchGetUsers();
      expect(stateService.getUsers()).toHaveLength(1);

      // Second call with different data
      vi.mocked(mockIdentityService.getUsers).mockResolvedValueOnce({
        items: mockUsers,
        totalCount: 2,
      });
      await stateService.dispatchGetUsers();
      expect(stateService.getUsers()).toHaveLength(2);
    });
  });
});
