import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRoles } from '../../hooks/useRoles';

// Mock IdentityRoleService (v4.0.0: migrated from IdentityService)
const mockGetList = vi.fn();
const mockGet = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock('../../proxy/identity/identity-role.service', () => ({
  IdentityRoleService: vi.fn().mockImplementation(() => ({
    getList: mockGetList,
    get: mockGet,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  })),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({})),
}));

describe('useRoles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetList.mockReset();
    mockGet.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useRoles());

    expect(result.current.roles).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.selectedRole).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.sortKey).toBe('name');
    expect(result.current.sortOrder).toBe('');
  });

  it('should fetch roles successfully', async () => {
    const mockRoles = {
      items: [
        { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' },
        { id: 'role-2', name: 'User', isDefault: true, isPublic: true, isStatic: false, concurrencyStamp: 'stamp2' },
      ],
      totalCount: 2,
    };
    mockGetList.mockResolvedValue(mockRoles);

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.fetchRoles();
      expect(response.success).toBe(true);
    });

    expect(result.current.roles).toEqual(mockRoles.items);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch roles error', async () => {
    mockGetList.mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.fetchRoles();
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch');
    });

    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch roles with non-Error throw', async () => {
    mockGetList.mockRejectedValue('network failure');

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.fetchRoles();
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch roles');
    });

    expect(result.current.error).toBe('Failed to fetch roles');
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle fetch roles with undefined items and totalCount', async () => {
    mockGetList.mockResolvedValue({});

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.fetchRoles();
      expect(response.success).toBe(true);
    });

    expect(result.current.roles).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should fetch roles with custom params', async () => {
    mockGetList.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useRoles());
    const params = { skipCount: 10, maxResultCount: 5, sorting: 'name desc' };

    await act(async () => {
      await result.current.fetchRoles(params);
    });

    expect(mockGetList).toHaveBeenCalledWith(params);
  });

  it('should get role by ID', async () => {
    const mockRole = { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' };
    mockGet.mockResolvedValue(mockRole);

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.getRoleById('role-1');
      expect(response.success).toBe(true);
    });

    expect(result.current.selectedRole).toEqual(mockRole);
  });

  it('should handle get role by ID error', async () => {
    mockGet.mockRejectedValue(new Error('Role not found'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.getRoleById('invalid-id');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Role not found');
    });

    expect(result.current.error).toBe('Role not found');
  });

  it('should handle get role by ID with non-Error throw', async () => {
    mockGet.mockRejectedValue('string error');

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.getRoleById('invalid-id');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch role');
    });

    expect(result.current.error).toBe('Failed to fetch role');
  });

  it('should create role successfully', async () => {
    const newRole = { name: 'NewRole', isDefault: false, isPublic: true };
    mockCreate.mockResolvedValue({ id: 'new-id', ...newRole, isStatic: false, concurrencyStamp: 'stamp' });
    mockGetList.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.createRole(newRole);
      expect(response.success).toBe(true);
    });

    expect(mockCreate).toHaveBeenCalledWith(newRole);
    expect(mockGetList).toHaveBeenCalled(); // Should refresh list
  });

  it('should handle create role error', async () => {
    mockCreate.mockRejectedValue(new Error('Creation failed'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.createRole({ name: 'Test', isDefault: false, isPublic: true });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Creation failed');
    });

    expect(result.current.error).toBe('Creation failed');
  });

  it('should handle create role with non-Error throw', async () => {
    mockCreate.mockRejectedValue({ code: 500 });

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.createRole({ name: 'Test', isDefault: false, isPublic: true });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to create role');
    });

    expect(result.current.error).toBe('Failed to create role');
  });

  it('should update role successfully', async () => {
    const updatedRole = { name: 'UpdatedRole', isDefault: true, isPublic: false };
    mockUpdate.mockResolvedValue({ id: 'role-1', ...updatedRole, isStatic: false, concurrencyStamp: 'new-stamp' });
    mockGetList.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.updateRole('role-1', updatedRole);
      expect(response.success).toBe(true);
    });

    expect(mockUpdate).toHaveBeenCalledWith('role-1', updatedRole);
    expect(mockGetList).toHaveBeenCalled(); // Should refresh list
  });

  it('should handle update role error', async () => {
    mockUpdate.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.updateRole('role-1', { name: 'Test', isDefault: false, isPublic: true });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Update failed');
    });

    expect(result.current.error).toBe('Update failed');
  });

  it('should handle update role with non-Error throw', async () => {
    mockUpdate.mockRejectedValue(null);

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.updateRole('role-1', { name: 'Test', isDefault: false, isPublic: true });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to update role');
    });

    expect(result.current.error).toBe('Failed to update role');
  });

  it('should delete role successfully', async () => {
    mockDelete.mockResolvedValue({});
    mockGetList.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.deleteRole('role-1');
      expect(response.success).toBe(true);
    });

    expect(mockDelete).toHaveBeenCalledWith('role-1');
    expect(mockGetList).toHaveBeenCalled(); // Should refresh list
  });

  it('should handle delete role error', async () => {
    mockDelete.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.deleteRole('role-1');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Delete failed');
    });

    expect(result.current.error).toBe('Delete failed');
  });

  it('should handle delete role with non-Error throw', async () => {
    mockDelete.mockRejectedValue(undefined);

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.deleteRole('role-1');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to delete role');
    });

    expect(result.current.error).toBe('Failed to delete role');
  });

  it('should set selected role', () => {
    const { result } = renderHook(() => useRoles());
    const role = { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' };

    act(() => {
      result.current.setSelectedRole(role);
    });

    expect(result.current.selectedRole).toEqual(role);
  });

  it('should set sort key', () => {
    const { result } = renderHook(() => useRoles());

    act(() => {
      result.current.setSortKey('isDefault');
    });

    expect(result.current.sortKey).toBe('isDefault');
  });

  it('should set sort order', () => {
    const { result } = renderHook(() => useRoles());

    act(() => {
      result.current.setSortOrder('asc');
    });

    expect(result.current.sortOrder).toBe('asc');
  });

  it('should reset state', async () => {
    mockGetList.mockResolvedValue({
      items: [{ id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' }],
      totalCount: 1,
    });

    const { result } = renderHook(() => useRoles());

    // First fetch some data
    await act(async () => {
      await result.current.fetchRoles();
    });

    expect(result.current.roles.length).toBe(1);

    // Then reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.roles).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.selectedRole).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
