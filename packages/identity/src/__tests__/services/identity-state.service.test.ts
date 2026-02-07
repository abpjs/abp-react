import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityStateService } from '../../services/identity-state.service';
import { IdentityRoleService } from '../../proxy/identity/identity-role.service';
import { IdentityUserService } from '../../proxy/identity/identity-user.service';
import type { IdentityRoleDto, IdentityUserDto } from '../../proxy/identity/models';

// Mock IdentityRoleService
const mockRoleService = {
  getList: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  getAllList: vi.fn(),
} as unknown as IdentityRoleService;

// Mock IdentityUserService
const mockUserService = {
  getList: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  getRoles: vi.fn(),
  getAssignableRoles: vi.fn(),
  findByUsername: vi.fn(),
  findByEmail: vi.fn(),
  updateRoles: vi.fn(),
} as unknown as IdentityUserService;

// Mock data
const mockRoles: IdentityRoleDto[] = [
  { id: 'role-1', name: 'admin', isDefault: false, isPublic: true, isStatic: true, concurrencyStamp: 'stamp-1' },
  { id: 'role-2', name: 'user', isDefault: true, isPublic: true, isStatic: false, concurrencyStamp: 'stamp-2' },
];

const mockUsers: IdentityUserDto[] = [
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

/**
 * @updated 4.0.0 - Migrated from IdentityService to IdentityRoleService/IdentityUserService
 */
describe('IdentityStateService', () => {
  let stateService: IdentityStateService;

  beforeEach(() => {
    vi.clearAllMocks();
    stateService = new IdentityStateService(mockRoleService, mockUserService);
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
        const mockResponse = {
          items: mockRoles,
          totalCount: 2,
        };
        vi.mocked(mockRoleService.getList).mockResolvedValue(mockResponse);

        const result = await stateService.dispatchGetRoles();

        expect(mockRoleService.getList).toHaveBeenCalled();
        expect(result).toEqual(mockResponse);
        expect(stateService.getRoles()).toEqual(mockRoles);
        expect(stateService.getRolesTotalCount()).toBe(2);
      });

      it('should pass query parameters to service', async () => {
        const mockResponse = {
          items: mockRoles,
          totalCount: 2,
        };
        vi.mocked(mockRoleService.getList).mockResolvedValue(mockResponse);

        const params = { skipCount: 10, maxResultCount: 5, sorting: 'name' };
        await stateService.dispatchGetRoles(params);

        expect(mockRoleService.getList).toHaveBeenCalledWith(params);
      });

      it('should handle empty response', async () => {
        const mockResponse = {
          items: [],
          totalCount: 0,
        };
        vi.mocked(mockRoleService.getList).mockResolvedValue(mockResponse);

        await stateService.dispatchGetRoles();

        expect(stateService.getRoles()).toEqual([]);
        expect(stateService.getRolesTotalCount()).toBe(0);
      });

      it('should handle response with undefined items and totalCount', async () => {
        vi.mocked(mockRoleService.getList).mockResolvedValue({} as any);

        await stateService.dispatchGetRoles();

        expect(stateService.getRoles()).toEqual([]);
        expect(stateService.getRolesTotalCount()).toBe(0);
      });
    });

    describe('dispatchGetRoleById', () => {
      it('should fetch a role by ID', async () => {
        const mockRole = mockRoles[0];
        vi.mocked(mockRoleService.get).mockResolvedValue(mockRole);

        const result = await stateService.dispatchGetRoleById('role-1');

        expect(mockRoleService.get).toHaveBeenCalledWith('role-1');
        expect(result).toEqual(mockRole);
      });
    });

    describe('dispatchDeleteRole', () => {
      it('should delete a role and refresh the list', async () => {
        vi.mocked(mockRoleService.delete).mockResolvedValue(undefined);
        vi.mocked(mockRoleService.getList).mockResolvedValue({
          items: [mockRoles[0]],
          totalCount: 1,
        });

        await stateService.dispatchDeleteRole('role-2');

        expect(mockRoleService.delete).toHaveBeenCalledWith('role-2');
        expect(mockRoleService.getList).toHaveBeenCalled();
        expect(stateService.getRoles()).toEqual([mockRoles[0]]);
        expect(stateService.getRolesTotalCount()).toBe(1);
      });
    });

    describe('dispatchCreateRole', () => {
      it('should create a role and refresh the list', async () => {
        const newRole = {
          name: 'newRole',
          isDefault: false,
          isPublic: true,
        };
        const createdRole: IdentityRoleDto = {
          ...newRole,
          id: 'role-3',
          isStatic: false,
          concurrencyStamp: 'stamp-3',
        };
        vi.mocked(mockRoleService.create).mockResolvedValue(createdRole);
        vi.mocked(mockRoleService.getList).mockResolvedValue({
          items: [...mockRoles, createdRole],
          totalCount: 3,
        });

        const result = await stateService.dispatchCreateRole(newRole);

        expect(mockRoleService.create).toHaveBeenCalledWith(newRole);
        expect(mockRoleService.getList).toHaveBeenCalled();
        expect(result).toEqual(createdRole);
        expect(stateService.getRolesTotalCount()).toBe(3);
      });
    });

    describe('dispatchUpdateRole', () => {
      it('should update a role and refresh the list', async () => {
        const updatedData = {
          name: 'updatedAdmin',
          isDefault: true,
          isPublic: false,
        };
        const updatedRole: IdentityRoleDto = {
          ...mockRoles[0],
          ...updatedData,
        };
        vi.mocked(mockRoleService.update).mockResolvedValue(updatedRole);
        vi.mocked(mockRoleService.getList).mockResolvedValue({
          items: [updatedRole, mockRoles[1]],
          totalCount: 2,
        });

        const result = await stateService.dispatchUpdateRole({
          id: 'role-1',
          body: updatedData,
        });

        expect(mockRoleService.update).toHaveBeenCalledWith('role-1', updatedData);
        expect(mockRoleService.getList).toHaveBeenCalled();
        expect(result).toEqual(updatedRole);
      });
    });
  });

  describe('User Operations', () => {
    describe('dispatchGetUsers', () => {
      it('should fetch users and update state', async () => {
        const mockResponse = {
          items: mockUsers,
          totalCount: 2,
        };
        vi.mocked(mockUserService.getList).mockResolvedValue(mockResponse);

        const result = await stateService.dispatchGetUsers();

        expect(mockUserService.getList).toHaveBeenCalled();
        expect(result).toEqual(mockResponse);
        expect(stateService.getUsers()).toEqual(mockUsers);
        expect(stateService.getUsersTotalCount()).toBe(2);
      });

      it('should pass query parameters to service', async () => {
        const mockResponse = {
          items: mockUsers,
          totalCount: 2,
        };
        vi.mocked(mockUserService.getList).mockResolvedValue(mockResponse);

        const params = { skipCount: 0, maxResultCount: 10, filter: 'john', sorting: 'userName' };
        await stateService.dispatchGetUsers(params);

        expect(mockUserService.getList).toHaveBeenCalledWith(params);
      });

      it('should handle empty response', async () => {
        const mockResponse = {
          items: [],
          totalCount: 0,
        };
        vi.mocked(mockUserService.getList).mockResolvedValue(mockResponse);

        await stateService.dispatchGetUsers();

        expect(stateService.getUsers()).toEqual([]);
        expect(stateService.getUsersTotalCount()).toBe(0);
      });

      it('should handle response with undefined items and totalCount', async () => {
        vi.mocked(mockUserService.getList).mockResolvedValue({} as any);

        await stateService.dispatchGetUsers();

        expect(stateService.getUsers()).toEqual([]);
        expect(stateService.getUsersTotalCount()).toBe(0);
      });
    });

    describe('dispatchGetUserById', () => {
      it('should fetch a user by ID', async () => {
        const mockUser = mockUsers[0];
        vi.mocked(mockUserService.get).mockResolvedValue(mockUser);

        const result = await stateService.dispatchGetUserById('user-1');

        expect(mockUserService.get).toHaveBeenCalledWith('user-1');
        expect(result).toEqual(mockUser);
      });
    });

    describe('dispatchDeleteUser', () => {
      it('should delete a user and refresh the list', async () => {
        vi.mocked(mockUserService.delete).mockResolvedValue(undefined);
        vi.mocked(mockUserService.getList).mockResolvedValue({
          items: [mockUsers[1]],
          totalCount: 1,
        });

        await stateService.dispatchDeleteUser('user-1');

        expect(mockUserService.delete).toHaveBeenCalledWith('user-1');
        expect(mockUserService.getList).toHaveBeenCalled();
        expect(stateService.getUsers()).toEqual([mockUsers[1]]);
        expect(stateService.getUsersTotalCount()).toBe(1);
      });
    });

    describe('dispatchCreateUser', () => {
      it('should create a user and refresh the list', async () => {
        const newUser = {
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
        const createdUser: IdentityUserDto = {
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
        vi.mocked(mockUserService.create).mockResolvedValue(createdUser);
        vi.mocked(mockUserService.getList).mockResolvedValue({
          items: [...mockUsers, createdUser],
          totalCount: 3,
        });

        const result = await stateService.dispatchCreateUser(newUser);

        expect(mockUserService.create).toHaveBeenCalledWith(newUser);
        expect(mockUserService.getList).toHaveBeenCalled();
        expect(result).toEqual(createdUser);
        expect(stateService.getUsersTotalCount()).toBe(3);
      });
    });

    describe('dispatchUpdateUser', () => {
      it('should update a user and refresh the list', async () => {
        const updatedData = {
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
        const updatedUser: IdentityUserDto = {
          ...mockUsers[0],
          userName: updatedData.userName,
          name: updatedData.name,
          email: updatedData.email,
          phoneNumber: updatedData.phoneNumber,
          lockoutEnabled: updatedData.lockoutEnabled,
          twoFactorEnabled: updatedData.twoFactorEnabled,
        };
        vi.mocked(mockUserService.update).mockResolvedValue(updatedUser);
        vi.mocked(mockUserService.getList).mockResolvedValue({
          items: [updatedUser, mockUsers[1]],
          totalCount: 2,
        });

        const result = await stateService.dispatchUpdateUser({
          id: 'user-1',
          body: updatedData,
        });

        expect(mockUserService.update).toHaveBeenCalledWith('user-1', updatedData);
        expect(mockUserService.getList).toHaveBeenCalled();
        expect(result).toEqual(updatedUser);
      });
    });

    describe('dispatchGetUserRoles', () => {
      it('should fetch user roles', async () => {
        const mockRoleResponse = {
          items: mockRoles,
        };
        vi.mocked(mockUserService.getRoles).mockResolvedValue(mockRoleResponse);

        const result = await stateService.dispatchGetUserRoles('user-1');

        expect(mockUserService.getRoles).toHaveBeenCalledWith('user-1');
        expect(result).toEqual(mockRoleResponse);
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate errors from getRoles', async () => {
      const error = new Error('Network error');
      vi.mocked(mockRoleService.getList).mockRejectedValue(error);

      await expect(stateService.dispatchGetRoles()).rejects.toThrow('Network error');
    });

    it('should propagate errors from createRole', async () => {
      const error = new Error('Validation error');
      vi.mocked(mockRoleService.create).mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateRole({ name: '', isDefault: false, isPublic: false })
      ).rejects.toThrow('Validation error');
    });

    it('should propagate errors from getUsers', async () => {
      const error = new Error('Unauthorized');
      vi.mocked(mockUserService.getList).mockRejectedValue(error);

      await expect(stateService.dispatchGetUsers()).rejects.toThrow('Unauthorized');
    });

    it('should propagate errors from deleteUser', async () => {
      const error = new Error('Not found');
      vi.mocked(mockUserService.delete).mockRejectedValue(error);

      await expect(stateService.dispatchDeleteUser('nonexistent')).rejects.toThrow('Not found');
    });

    it('should propagate errors from updateRole', async () => {
      const error = new Error('Conflict');
      vi.mocked(mockRoleService.update).mockRejectedValue(error);

      await expect(
        stateService.dispatchUpdateRole({ id: 'role-1', body: { name: 'test', isDefault: false, isPublic: false } })
      ).rejects.toThrow('Conflict');
    });

    it('should propagate errors from deleteRole', async () => {
      const error = new Error('Cannot delete static role');
      vi.mocked(mockRoleService.delete).mockRejectedValue(error);

      await expect(stateService.dispatchDeleteRole('role-1')).rejects.toThrow('Cannot delete static role');
    });

    it('should propagate errors from getRoleById', async () => {
      const error = new Error('Not found');
      vi.mocked(mockRoleService.get).mockRejectedValue(error);

      await expect(stateService.dispatchGetRoleById('nonexistent')).rejects.toThrow('Not found');
    });

    it('should propagate errors from getUserById', async () => {
      const error = new Error('User not found');
      vi.mocked(mockUserService.get).mockRejectedValue(error);

      await expect(stateService.dispatchGetUserById('nonexistent')).rejects.toThrow('User not found');
    });

    it('should propagate errors from updateUser', async () => {
      const error = new Error('Validation failed');
      vi.mocked(mockUserService.update).mockRejectedValue(error);

      await expect(
        stateService.dispatchUpdateUser({
          id: 'user-1',
          body: { userName: '', name: '', surname: '', email: '', phoneNumber: '', password: '', lockoutEnabled: false, roleNames: [] },
        })
      ).rejects.toThrow('Validation failed');
    });

    it('should propagate errors from createUser', async () => {
      const error = new Error('Duplicate username');
      vi.mocked(mockUserService.create).mockRejectedValue(error);

      await expect(
        stateService.dispatchCreateUser({
          userName: 'admin', name: 'A', surname: 'B', email: 'a@b.com',
          phoneNumber: '', password: 'Pass123!', lockoutEnabled: true, roleNames: [],
        })
      ).rejects.toThrow('Duplicate username');
    });

    it('should propagate errors from getUserRoles', async () => {
      const error = new Error('Forbidden');
      vi.mocked(mockUserService.getRoles).mockRejectedValue(error);

      await expect(stateService.dispatchGetUserRoles('user-1')).rejects.toThrow('Forbidden');
    });
  });

  describe('State Persistence', () => {
    it('should maintain roles state across multiple calls', async () => {
      // First call
      vi.mocked(mockRoleService.getList).mockResolvedValueOnce({
        items: [mockRoles[0]],
        totalCount: 1,
      });
      await stateService.dispatchGetRoles();
      expect(stateService.getRoles()).toHaveLength(1);

      // Second call with different data
      vi.mocked(mockRoleService.getList).mockResolvedValueOnce({
        items: mockRoles,
        totalCount: 2,
      });
      await stateService.dispatchGetRoles();
      expect(stateService.getRoles()).toHaveLength(2);
    });

    it('should maintain users state across multiple calls', async () => {
      // First call
      vi.mocked(mockUserService.getList).mockResolvedValueOnce({
        items: [mockUsers[0]],
        totalCount: 1,
      });
      await stateService.dispatchGetUsers();
      expect(stateService.getUsers()).toHaveLength(1);

      // Second call with different data
      vi.mocked(mockUserService.getList).mockResolvedValueOnce({
        items: mockUsers,
        totalCount: 2,
      });
      await stateService.dispatchGetUsers();
      expect(stateService.getUsers()).toHaveLength(2);
    });
  });
});
