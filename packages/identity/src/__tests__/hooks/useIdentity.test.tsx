import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useIdentity } from '../../hooks/useIdentity';

// Mock IdentityService
const mockGetRoles = vi.fn();
const mockGetUsers = vi.fn();

vi.mock('../../services', () => ({
  IdentityService: vi.fn().mockImplementation(() => ({
    getRoles: mockGetRoles,
    getRoleById: vi.fn(),
    createRole: vi.fn(),
    updateRole: vi.fn(),
    deleteRole: vi.fn(),
    getUsers: mockGetUsers,
    getUserById: vi.fn(),
    getUserRoles: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  })),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({})),
}));

describe('useIdentity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRoles.mockReset();
    mockGetUsers.mockReset();
  });

  it('should return combined hooks', () => {
    const { result } = renderHook(() => useIdentity());

    expect(result.current.roles).toBeDefined();
    expect(result.current.users).toBeDefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.resetAll).toBe('function');
  });

  it('should have roles hook with all properties', () => {
    const { result } = renderHook(() => useIdentity());

    expect(result.current.roles.roles).toEqual([]);
    expect(result.current.roles.totalCount).toBe(0);
    expect(result.current.roles.selectedRole).toBeNull();
    expect(result.current.roles.isLoading).toBe(false);
    expect(result.current.roles.error).toBeNull();
    expect(typeof result.current.roles.fetchRoles).toBe('function');
    expect(typeof result.current.roles.createRole).toBe('function');
    expect(typeof result.current.roles.updateRole).toBe('function');
    expect(typeof result.current.roles.deleteRole).toBe('function');
  });

  it('should have users hook with all properties', () => {
    const { result } = renderHook(() => useIdentity());

    expect(result.current.users.users).toEqual([]);
    expect(result.current.users.totalCount).toBe(0);
    expect(result.current.users.selectedUser).toBeNull();
    expect(result.current.users.selectedUserRoles).toEqual([]);
    expect(result.current.users.isLoading).toBe(false);
    expect(result.current.users.error).toBeNull();
    expect(typeof result.current.users.fetchUsers).toBe('function');
    expect(typeof result.current.users.createUser).toBe('function');
    expect(typeof result.current.users.updateUser).toBe('function');
    expect(typeof result.current.users.deleteUser).toBe('function');
  });

  it('should combine loading states', async () => {
    // Simulate loading state by having a pending promise
    let resolveRoles: (value: any) => void;
    mockGetRoles.mockImplementation(() => new Promise((resolve) => {
      resolveRoles = resolve;
    }));
    mockGetUsers.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useIdentity());

    // Start fetching roles
    act(() => {
      result.current.roles.fetchRoles();
    });

    // isLoading should be true while roles are loading
    expect(result.current.isLoading).toBe(true);

    // Resolve the roles promise
    await act(async () => {
      resolveRoles!({ items: [], totalCount: 0 });
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should combine error states - roles error', async () => {
    mockGetRoles.mockRejectedValue(new Error('Roles error'));
    mockGetUsers.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useIdentity());

    await act(async () => {
      await result.current.roles.fetchRoles();
    });

    expect(result.current.error).toBe('Roles error');
  });

  it('should combine error states - users error', async () => {
    mockGetRoles.mockResolvedValue({ items: [], totalCount: 0 });
    mockGetUsers.mockRejectedValue(new Error('Users error'));

    const { result } = renderHook(() => useIdentity());

    await act(async () => {
      await result.current.users.fetchUsers();
    });

    expect(result.current.error).toBe('Users error');
  });

  it('should reset all state', async () => {
    mockGetRoles.mockResolvedValue({
      items: [{ id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' }],
      totalCount: 1,
    });
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

    const { result } = renderHook(() => useIdentity());

    // Fetch both roles and users
    await act(async () => {
      await result.current.roles.fetchRoles();
      await result.current.users.fetchUsers();
    });

    expect(result.current.roles.roles.length).toBe(1);
    expect(result.current.users.users.length).toBe(1);

    // Reset all
    act(() => {
      result.current.resetAll();
    });

    expect(result.current.roles.roles).toEqual([]);
    expect(result.current.roles.totalCount).toBe(0);
    expect(result.current.users.users).toEqual([]);
    expect(result.current.users.totalCount).toBe(0);
  });

  it('should allow fetching roles and users independently', async () => {
    mockGetRoles.mockResolvedValue({
      items: [{ id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' }],
      totalCount: 1,
    });
    mockGetUsers.mockResolvedValue({
      items: [],
      totalCount: 0,
    });

    const { result } = renderHook(() => useIdentity());

    // Only fetch roles
    await act(async () => {
      await result.current.roles.fetchRoles();
    });

    expect(result.current.roles.roles.length).toBe(1);
    expect(result.current.users.users.length).toBe(0);
    expect(mockGetUsers).not.toHaveBeenCalled();
  });
});
