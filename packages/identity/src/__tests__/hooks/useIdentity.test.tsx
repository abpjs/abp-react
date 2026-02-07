import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIdentity } from '../../hooks/useIdentity';

// Mock proxy services (v4.0.0: IdentityService removed, use IdentityRoleService/IdentityUserService)
const mockGetRoleList = vi.fn();
const mockGetUserList = vi.fn();
const mockGetUserRoles = vi.fn();

vi.mock('../../proxy/identity/identity-role.service', () => ({
  IdentityRoleService: vi.fn().mockImplementation(() => ({
    getList: mockGetRoleList,
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getAllList: vi.fn(),
  })),
}));

vi.mock('../../proxy/identity/identity-user.service', () => ({
  IdentityUserService: vi.fn().mockImplementation(() => ({
    getList: mockGetUserList,
    get: vi.fn(),
    getRoles: mockGetUserRoles,
    getAssignableRoles: vi.fn(),
    findByUsername: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateRoles: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useRestService: vi.fn(() => ({})),
}));

/**
 * @updated 4.0.0 - Migrated mocks from IdentityService to IdentityRoleService/IdentityUserService
 */
describe('useIdentity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetRoleList.mockReset();
    mockGetUserList.mockReset();
    mockGetUserRoles.mockReset();
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
    mockGetRoleList.mockImplementation(() => new Promise((resolve) => {
      resolveRoles = resolve;
    }));
    mockGetUserList.mockResolvedValue({ items: [], totalCount: 0 });

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
    mockGetRoleList.mockRejectedValue(new Error('Roles error'));
    mockGetUserList.mockResolvedValue({ items: [], totalCount: 0 });

    const { result } = renderHook(() => useIdentity());

    await act(async () => {
      await result.current.roles.fetchRoles();
    });

    expect(result.current.error).toBe('Roles error');
  });

  it('should combine error states - users error', async () => {
    mockGetRoleList.mockResolvedValue({ items: [], totalCount: 0 });
    mockGetUserList.mockRejectedValue(new Error('Users error'));

    const { result } = renderHook(() => useIdentity());

    await act(async () => {
      await result.current.users.fetchUsers();
    });

    expect(result.current.error).toBe('Users error');
  });

  it('should reset all state', async () => {
    mockGetRoleList.mockResolvedValue({
      items: [{ id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' }],
      totalCount: 1,
    });
    mockGetUserList.mockResolvedValue({
      items: [{
        id: 'user-1',
        userName: 'admin',
        name: 'Admin',
        surname: 'User',
        email: 'admin@example.com',
        phoneNumber: '',
        lockoutEnabled: true,
        tenantId: '',
        emailConfirmed: true,
        phoneNumberConfirmed: false,
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
    mockGetRoleList.mockResolvedValue({
      items: [{ id: 'role-1', name: 'Admin', isDefault: false, isPublic: true, isStatic: false, concurrencyStamp: 'stamp1' }],
      totalCount: 1,
    });
    mockGetUserList.mockResolvedValue({
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
    expect(mockGetUserList).not.toHaveBeenCalled();
  });
});
