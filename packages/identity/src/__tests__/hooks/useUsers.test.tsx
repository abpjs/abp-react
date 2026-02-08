import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUsers } from '../../hooks/useUsers';

// Mock IdentityUserService (v4.0.0: migrated from IdentityService)
const mockGetList = vi.fn();
const mockGet = vi.fn();
const mockGetRoles = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock('../../proxy/identity/identity-user.service', () => ({
  IdentityUserService: vi.fn().mockImplementation(() => ({
    getList: mockGetList,
    get: mockGet,
    getRoles: mockGetRoles,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  })),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({})),
}));

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetList.mockReset();
    mockGet.mockReset();
    mockGetRoles.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useUsers());

    expect(result.current.users).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.selectedUser).toBeNull();
    expect(result.current.selectedUserRoles).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.pageQuery).toEqual({
      filter: '',
      sorting: 'userName',
      skipCount: 0,
      maxResultCount: 10,
    });
    expect(result.current.sortKey).toBe('userName');
    expect(result.current.sortOrder).toBe('');
  });

  it('should fetch users successfully', async () => {
    const mockUsers = {
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
    mockGetList.mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.fetchUsers();
      expect(response.success).toBe(true);
    });

    expect(result.current.users).toEqual(mockUsers.items);
    expect(result.current.totalCount).toBe(1);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch users error', async () => {
    mockGetList.mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.fetchUsers();
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch');
    });

    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch users with non-Error throw', async () => {
    mockGetList.mockRejectedValue('network failure');

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.fetchUsers();
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch users');
    });

    expect(result.current.error).toBe('Failed to fetch users');
  });

  it('should handle fetch users with undefined items and totalCount', async () => {
    mockGetList.mockResolvedValue({});

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.fetchUsers();
      expect(response.success).toBe(true);
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should fetch users with custom params instead of pageQuery', async () => {
    mockGetList.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useUsers());
    const params = { filter: 'admin', skipCount: 0, maxResultCount: 25, sorting: 'email desc' };

    await act(async () => {
      await result.current.fetchUsers(params);
    });

    expect(mockGetList).toHaveBeenCalledWith(params);
  });

  it('should get user by ID', async () => {
    const mockUser = {
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
    mockGet.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserById('user-1');
      expect(response.success).toBe(true);
    });

    expect(result.current.selectedUser).toEqual(mockUser);
  });

  it('should handle get user by ID error', async () => {
    mockGet.mockRejectedValue(new Error('User not found'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserById('invalid-id');
      expect(response.success).toBe(false);
      expect(response.error).toBe('User not found');
    });

    expect(result.current.error).toBe('User not found');
  });

  it('should handle get user by ID with non-Error throw', async () => {
    mockGet.mockRejectedValue({ status: 404 });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserById('invalid-id');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch user');
    });

    expect(result.current.error).toBe('Failed to fetch user');
  });

  it('should get user roles', async () => {
    const mockRolesResponse = {
      items: [
        { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' },
      ],
      totalCount: 1,
    };
    mockGetRoles.mockResolvedValue(mockRolesResponse);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserRoles('user-1');
      expect(response.success).toBe(true);
    });

    expect(result.current.selectedUserRoles).toEqual(mockRolesResponse.items);
  });

  it('should handle get user roles error', async () => {
    mockGetRoles.mockRejectedValue(new Error('Failed to fetch roles'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserRoles('user-1');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch roles');
    });

    expect(result.current.error).toBe('Failed to fetch roles');
  });

  it('should handle get user roles with non-Error throw', async () => {
    mockGetRoles.mockRejectedValue('forbidden');

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserRoles('user-1');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch user roles');
    });

    expect(result.current.error).toBe('Failed to fetch user roles');
  });

  it('should handle get user roles with undefined items', async () => {
    mockGetRoles.mockResolvedValue({});

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserRoles('user-1');
      expect(response.success).toBe(true);
    });

    expect(result.current.selectedUserRoles).toEqual([]);
  });

  it('should create user successfully', async () => {
    const newUser = {
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
    mockCreate.mockResolvedValue({ id: 'new-id', ...newUser });
    mockGetList.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.createUser(newUser);
      expect(response.success).toBe(true);
    });

    expect(mockCreate).toHaveBeenCalledWith(newUser);
    expect(mockGetList).toHaveBeenCalled();
  });

  it('should handle create user error', async () => {
    mockCreate.mockRejectedValue(new Error('Creation failed'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.createUser({
        userName: 'test',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'Test123!',
        roleNames: [],
      });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Creation failed');
    });

    expect(result.current.error).toBe('Creation failed');
  });

  it('should handle create user with non-Error throw', async () => {
    mockCreate.mockRejectedValue({ code: 'VALIDATION' });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.createUser({
        userName: 'test',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        lockoutEnabled: true,
        password: 'Test123!',
        roleNames: [],
      });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to create user');
    });

    expect(result.current.error).toBe('Failed to create user');
  });

  it('should update user successfully', async () => {
    const updatedUser = {
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
    mockUpdate.mockResolvedValue({ id: 'user-1', ...updatedUser });
    mockGetList.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.updateUser('user-1', updatedUser);
      expect(response.success).toBe(true);
    });

    expect(mockUpdate).toHaveBeenCalledWith('user-1', updatedUser);
    expect(mockGetList).toHaveBeenCalled();
  });

  it('should handle update user error', async () => {
    mockUpdate.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.updateUser('user-1', {
        userName: 'test',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'Test123!',
        roleNames: [],
      });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Update failed');
    });

    expect(result.current.error).toBe('Update failed');
  });

  it('should handle update user with non-Error throw', async () => {
    mockUpdate.mockRejectedValue(null);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.updateUser('user-1', {
        userName: 'test',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        lockoutEnabled: true,
        password: 'Test123!',
        roleNames: [],
      });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to update user');
    });

    expect(result.current.error).toBe('Failed to update user');
  });

  it('should delete user successfully', async () => {
    mockDelete.mockResolvedValue(undefined);
    mockGetList.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.deleteUser('user-1');
      expect(response.success).toBe(true);
    });

    expect(mockDelete).toHaveBeenCalledWith('user-1');
    expect(mockGetList).toHaveBeenCalled();
  });

  it('should handle delete user error', async () => {
    mockDelete.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.deleteUser('user-1');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Delete failed');
    });

    expect(result.current.error).toBe('Delete failed');
  });

  it('should handle delete user with non-Error throw', async () => {
    mockDelete.mockRejectedValue(undefined);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.deleteUser('user-1');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to delete user');
    });

    expect(result.current.error).toBe('Failed to delete user');
  });

  it('should set selected user', () => {
    const { result } = renderHook(() => useUsers());
    const user = {
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

    act(() => {
      result.current.setSelectedUser(user);
    });

    expect(result.current.selectedUser).toEqual(user);
  });

  it('should set page query', () => {
    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.setPageQuery({ filter: '', skipCount: 10, maxResultCount: 20 });
    });

    expect(result.current.pageQuery).toEqual({ filter: '', skipCount: 10, maxResultCount: 20 });
  });

  it('should set sort key', () => {
    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.setSortKey('email');
    });

    expect(result.current.sortKey).toBe('email');
  });

  it('should set sort order', () => {
    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.setSortOrder('desc');
    });

    expect(result.current.sortOrder).toBe('desc');
  });

  it('should reset state', async () => {
    mockGetList.mockResolvedValue({
      items: [{
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
      }],
      totalCount: 1,
    });

    const { result } = renderHook(() => useUsers());

    // First fetch some data
    await act(async () => {
      await result.current.fetchUsers();
    });

    expect(result.current.users.length).toBe(1);

    // Then reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.selectedUser).toBeNull();
    expect(result.current.selectedUserRoles).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.pageQuery).toEqual({
      filter: '',
      sorting: 'userName',
      skipCount: 0,
      maxResultCount: 10,
    });
  });
});
