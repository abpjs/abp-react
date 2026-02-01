import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUsers } from '../../hooks/useUsers';

// Mock IdentityService
const mockGetUsers = vi.fn();
const mockGetUserById = vi.fn();
const mockGetUserRoles = vi.fn();
const mockCreateUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockDeleteUser = vi.fn();
const mockUnlockUser = vi.fn();

vi.mock('../../services', () => ({
  IdentityService: vi.fn().mockImplementation(() => ({
    getUsers: mockGetUsers,
    getUserById: mockGetUserById,
    getUserRoles: mockGetUserRoles,
    createUser: mockCreateUser,
    updateUser: mockUpdateUser,
    deleteUser: mockDeleteUser,
    unlockUser: mockUnlockUser,
  })),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({})),
}));

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUsers.mockReset();
    mockGetUserById.mockReset();
    mockGetUserRoles.mockReset();
    mockCreateUser.mockReset();
    mockUpdateUser.mockReset();
    mockDeleteUser.mockReset();
    mockUnlockUser.mockReset();
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
      sorting: 'userName',
      skipCount: 0,
      maxResultCount: 10,
    });
    expect(result.current.sortKey).toBe('userName');
    expect(result.current.sortOrder).toBe('');
    // v2.2.0 permissions modal state
    expect(result.current.visiblePermissions).toBe(false);
    expect(result.current.permissionsProviderKey).toBe('');
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
    mockGetUsers.mockResolvedValue(mockUsers);

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
    mockGetUsers.mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.fetchUsers();
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch');
    });

    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.isLoading).toBe(false);
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
    mockGetUserById.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserById('user-1');
      expect(response.success).toBe(true);
    });

    expect(result.current.selectedUser).toEqual(mockUser);
  });

  it('should handle get user by ID error', async () => {
    mockGetUserById.mockRejectedValue(new Error('User not found'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserById('invalid-id');
      expect(response.success).toBe(false);
      expect(response.error).toBe('User not found');
    });

    expect(result.current.error).toBe('User not found');
  });

  it('should get user roles', async () => {
    const mockRoles = {
      items: [
        { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' },
      ],
      totalCount: 1,
    };
    mockGetUserRoles.mockResolvedValue(mockRoles);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserRoles('user-1');
      expect(response.success).toBe(true);
    });

    expect(result.current.selectedUserRoles).toEqual(mockRoles.items);
  });

  it('should handle get user roles error', async () => {
    mockGetUserRoles.mockRejectedValue(new Error('Failed to fetch roles'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.getUserRoles('user-1');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch roles');
    });

    expect(result.current.error).toBe('Failed to fetch roles');
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
    mockCreateUser.mockResolvedValue({ id: 'new-id', ...newUser });
    mockGetUsers.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.createUser(newUser);
      expect(response.success).toBe(true);
    });

    expect(mockCreateUser).toHaveBeenCalledWith(newUser);
    expect(mockGetUsers).toHaveBeenCalled();
  });

  it('should handle create user error', async () => {
    mockCreateUser.mockRejectedValue(new Error('Creation failed'));

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
    mockUpdateUser.mockResolvedValue({ id: 'user-1', ...updatedUser });
    mockGetUsers.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.updateUser('user-1', updatedUser);
      expect(response.success).toBe(true);
    });

    expect(mockUpdateUser).toHaveBeenCalledWith('user-1', updatedUser);
    expect(mockGetUsers).toHaveBeenCalled();
  });

  it('should handle update user error', async () => {
    mockUpdateUser.mockRejectedValue(new Error('Update failed'));

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

  it('should delete user successfully', async () => {
    mockDeleteUser.mockResolvedValue(undefined);
    mockGetUsers.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.deleteUser('user-1');
      expect(response.success).toBe(true);
    });

    expect(mockDeleteUser).toHaveBeenCalledWith('user-1');
    expect(mockGetUsers).toHaveBeenCalled();
  });

  it('should handle delete user error', async () => {
    mockDeleteUser.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      const response = await result.current.deleteUser('user-1');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Delete failed');
    });

    expect(result.current.error).toBe('Delete failed');
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
      result.current.setPageQuery({ skipCount: 10, maxResultCount: 20 });
    });

    expect(result.current.pageQuery).toEqual({ skipCount: 10, maxResultCount: 20 });
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
    mockGetUsers.mockResolvedValue({
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
      sorting: 'userName',
      skipCount: 0,
      maxResultCount: 10,
    });
    // v2.2.0 permissions modal state should also reset
    expect(result.current.visiblePermissions).toBe(false);
    expect(result.current.permissionsProviderKey).toBe('');
  });

  // v2.2.0 Features
  describe('v2.2.0 - unlockUser', () => {
    it('should unlock user successfully', async () => {
      mockUnlockUser.mockResolvedValue(undefined);
      mockGetUsers.mockResolvedValue({ items: [], totalCount: 0 });

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        const response = await result.current.unlockUser('user-1');
        expect(response.success).toBe(true);
      });

      expect(mockUnlockUser).toHaveBeenCalledWith('user-1');
      expect(mockGetUsers).toHaveBeenCalled(); // Should refresh list
    });

    it('should handle unlock user error', async () => {
      mockUnlockUser.mockRejectedValue(new Error('Failed to unlock user'));

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        const response = await result.current.unlockUser('user-1');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to unlock user');
      });

      expect(result.current.error).toBe('Failed to unlock user');
    });

    it('should handle unlock user with non-Error rejection', async () => {
      mockUnlockUser.mockRejectedValue('string error');

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        const response = await result.current.unlockUser('user-1');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to unlock user');
      });
    });
  });

  describe('v2.2.0 - openPermissionsModal', () => {
    it('should open permissions modal with provider key', () => {
      const { result } = renderHook(() => useUsers());

      act(() => {
        result.current.openPermissionsModal('user-123');
      });

      expect(result.current.visiblePermissions).toBe(true);
      expect(result.current.permissionsProviderKey).toBe('user-123');
    });

    it('should close permissions modal and clear provider key', () => {
      const { result } = renderHook(() => useUsers());

      // First open
      act(() => {
        result.current.openPermissionsModal('user-123');
      });

      expect(result.current.visiblePermissions).toBe(true);
      expect(result.current.permissionsProviderKey).toBe('user-123');

      // Then close
      act(() => {
        result.current.onVisiblePermissionsChange(false);
      });

      expect(result.current.visiblePermissions).toBe(false);
      expect(result.current.permissionsProviderKey).toBe('');
    });

    it('should allow changing visibility without clearing provider key when opening', () => {
      const { result } = renderHook(() => useUsers());

      // Set provider key first via openPermissionsModal
      act(() => {
        result.current.openPermissionsModal('user-123');
      });

      // Close
      act(() => {
        result.current.onVisiblePermissionsChange(false);
      });

      // Open with a new provider key
      act(() => {
        result.current.openPermissionsModal('user-456');
      });

      expect(result.current.visiblePermissions).toBe(true);
      expect(result.current.permissionsProviderKey).toBe('user-456');
    });

    it('should keep provider key when setting visibility to true', () => {
      const { result } = renderHook(() => useUsers());

      act(() => {
        result.current.openPermissionsModal('user-123');
      });

      // Setting visibility to true should not clear the key
      act(() => {
        result.current.onVisiblePermissionsChange(true);
      });

      expect(result.current.visiblePermissions).toBe(true);
      expect(result.current.permissionsProviderKey).toBe('user-123');
    });
  });
});
