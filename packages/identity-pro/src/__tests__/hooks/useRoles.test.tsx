import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRoles } from '../../hooks/useRoles';

// Mock IdentityService
const mockGetRoles = vi.fn();
const mockGetRoleById = vi.fn();
const mockCreateRole = vi.fn();
const mockUpdateRole = vi.fn();
const mockDeleteRole = vi.fn();

vi.mock('../../services', () => ({
  IdentityService: vi.fn().mockImplementation(() => ({
    getRoles: mockGetRoles,
    getRoleById: mockGetRoleById,
    createRole: mockCreateRole,
    updateRole: mockUpdateRole,
    deleteRole: mockDeleteRole,
  })),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({})),
}));

describe('useRoles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRoles.mockReset();
    mockGetRoleById.mockReset();
    mockCreateRole.mockReset();
    mockUpdateRole.mockReset();
    mockDeleteRole.mockReset();
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
    mockGetRoles.mockResolvedValue(mockRoles);

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
    mockGetRoles.mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.fetchRoles();
      expect(response.success).toBe(false);
      expect(response.error).toBe('Failed to fetch');
    });

    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.isLoading).toBe(false);
  });

  it('should get role by ID', async () => {
    const mockRole = { id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' };
    mockGetRoleById.mockResolvedValue(mockRole);

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.getRoleById('role-1');
      expect(response.success).toBe(true);
    });

    expect(result.current.selectedRole).toEqual(mockRole);
  });

  it('should handle get role by ID error', async () => {
    mockGetRoleById.mockRejectedValue(new Error('Role not found'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.getRoleById('invalid-id');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Role not found');
    });

    expect(result.current.error).toBe('Role not found');
  });

  it('should create role successfully', async () => {
    const newRole = { name: 'NewRole', isDefault: false, isPublic: true };
    mockCreateRole.mockResolvedValue({ id: 'new-id', ...newRole, isStatic: false, concurrencyStamp: 'stamp' });
    mockGetRoles.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.createRole(newRole);
      expect(response.success).toBe(true);
    });

    expect(mockCreateRole).toHaveBeenCalledWith(newRole);
    expect(mockGetRoles).toHaveBeenCalled(); // Should refresh list
  });

  it('should handle create role error', async () => {
    mockCreateRole.mockRejectedValue(new Error('Creation failed'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.createRole({ name: 'Test', isDefault: false, isPublic: true });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Creation failed');
    });

    expect(result.current.error).toBe('Creation failed');
  });

  it('should update role successfully', async () => {
    const updatedRole = { name: 'UpdatedRole', isDefault: true, isPublic: false };
    mockUpdateRole.mockResolvedValue({ id: 'role-1', ...updatedRole, isStatic: false, concurrencyStamp: 'new-stamp' });
    mockGetRoles.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.updateRole('role-1', updatedRole);
      expect(response.success).toBe(true);
    });

    expect(mockUpdateRole).toHaveBeenCalledWith('role-1', updatedRole);
    expect(mockGetRoles).toHaveBeenCalled(); // Should refresh list
  });

  it('should handle update role error', async () => {
    mockUpdateRole.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.updateRole('role-1', { name: 'Test', isDefault: false, isPublic: true });
      expect(response.success).toBe(false);
      expect(response.error).toBe('Update failed');
    });

    expect(result.current.error).toBe('Update failed');
  });

  it('should delete role successfully', async () => {
    mockDeleteRole.mockResolvedValue({});
    mockGetRoles.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.deleteRole('role-1');
      expect(response.success).toBe(true);
    });

    expect(mockDeleteRole).toHaveBeenCalledWith('role-1');
    expect(mockGetRoles).toHaveBeenCalled(); // Should refresh list
  });

  it('should handle delete role error', async () => {
    mockDeleteRole.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useRoles());

    await act(async () => {
      const response = await result.current.deleteRole('role-1');
      expect(response.success).toBe(false);
      expect(response.error).toBe('Delete failed');
    });

    expect(result.current.error).toBe('Delete failed');
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
    mockGetRoles.mockResolvedValue({
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
