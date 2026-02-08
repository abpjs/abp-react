import { useState, useCallback, useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import type { IdentityUserDto, IdentityUserCreateDto, IdentityUserUpdateDto, IdentityRoleDto, GetIdentityUsersInput } from '../proxy/identity/models';
import { IdentityUserService } from '../proxy/identity/identity-user.service';
import { SortOrder } from './useRoles';

/**
 * Result from user operations
 */
export interface UserOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Return type for useUsers hook
 * @updated 4.0.0 - Now uses IdentityUserDto, IdentityUserCreateDto, IdentityUserUpdateDto, IdentityRoleDto
 */
export interface UseUsersReturn {
  /** List of users */
  users: IdentityUserDto[];
  /** Total count of users */
  totalCount: number;
  /** Currently selected user for editing */
  selectedUser: IdentityUserDto | null;
  /** Roles assigned to the selected user */
  selectedUserRoles: IdentityRoleDto[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current page query parameters */
  pageQuery: GetIdentityUsersInput;
  /** Current sort key @since 1.0.0 */
  sortKey: string;
  /** Current sort order @since 1.0.0 */
  sortOrder: SortOrder;
  /** Fetch users with pagination */
  fetchUsers: (params?: GetIdentityUsersInput) => Promise<UserOperationResult>;
  /** Get a user by ID and set it as selected */
  getUserById: (id: string) => Promise<UserOperationResult>;
  /** Get roles for a user */
  getUserRoles: (id: string) => Promise<UserOperationResult>;
  /** Create a new user */
  createUser: (user: IdentityUserCreateDto) => Promise<UserOperationResult>;
  /** Update an existing user */
  updateUser: (id: string, user: IdentityUserUpdateDto) => Promise<UserOperationResult>;
  /** Delete a user */
  deleteUser: (id: string) => Promise<UserOperationResult>;
  /** Set the selected user */
  setSelectedUser: (user: IdentityUserDto | null) => void;
  /** Set page query parameters */
  setPageQuery: (query: GetIdentityUsersInput) => void;
  /** Set sort key @since 1.0.0 */
  setSortKey: (key: string) => void;
  /** Set sort order @since 1.0.0 */
  setSortOrder: (order: SortOrder) => void;
  /** Reset state */
  reset: () => void;
}

const DEFAULT_PAGE_QUERY: GetIdentityUsersInput = {
  filter: '',
  sorting: 'userName',
  skipCount: 0,
  maxResultCount: 10,
};

/**
 * Hook for managing users
 *
 * This hook provides all the state and actions needed for user management.
 * It handles fetching, creating, updating, and deleting users with pagination support.
 *
 * @updated 4.0.0 - Migrated from deprecated IdentityService to IdentityUserService
 *
 * @example
 * ```tsx
 * function UsersPage() {
 *   const {
 *     users,
 *     totalCount,
 *     isLoading,
 *     pageQuery,
 *     fetchUsers,
 *     createUser,
 *     deleteUser,
 *     setPageQuery,
 *   } = useUsers();
 *
 *   useEffect(() => {
 *     fetchUsers();
 *   }, [fetchUsers]);
 *
 *   const handlePageChange = (page: number) => {
 *     setPageQuery({ ...pageQuery, skipCount: page * 10 });
 *     fetchUsers({ ...pageQuery, skipCount: page * 10 });
 *   };
 *
 *   return (
 *     <div>
 *       {users.map(user => (
 *         <div key={user.id}>{user.userName}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useUsers(): UseUsersReturn {
  const restService = useRestService();

  // Service instance (memoized) - v4.0.0: uses IdentityUserService instead of deprecated IdentityService
  const service = useMemo(() => new IdentityUserService(restService), [restService]);

  // State
  const [users, setUsers] = useState<IdentityUserDto[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<IdentityUserDto | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<IdentityRoleDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageQuery, setPageQuery] = useState<GetIdentityUsersInput>(DEFAULT_PAGE_QUERY);
  // Sorting state (v1.0.0)
  const [sortKey, setSortKey] = useState<string>('userName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');

  /**
   * Fetch users with pagination
   */
  const fetchUsers = useCallback(
    async (params?: GetIdentityUsersInput): Promise<UserOperationResult> => {
      setIsLoading(true);
      setError(null);

      const queryParams = params || pageQuery;

      try {
        const response = await service.getList(queryParams);
        setUsers(response.items || []);
        setTotalCount(response.totalCount || 0);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, pageQuery]
  );

  /**
   * Get a user by ID and set it as selected
   */
  const getUserById = useCallback(
    async (id: string): Promise<UserOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const user = await service.get(id);
        setSelectedUser(user);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Get roles for a user
   */
  const getUserRoles = useCallback(
    async (id: string): Promise<UserOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getRoles(id);
        setSelectedUserRoles(response.items || []);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user roles';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Create a new user
   */
  const createUser = useCallback(
    async (user: IdentityUserCreateDto): Promise<UserOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.create(user);
        // Refresh the list after creating
        await fetchUsers();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchUsers]
  );

  /**
   * Update an existing user
   */
  const updateUser = useCallback(
    async (id: string, user: IdentityUserUpdateDto): Promise<UserOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.update(id, user);
        // Refresh the list after updating
        await fetchUsers();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchUsers]
  );

  /**
   * Delete a user
   */
  const deleteUser = useCallback(
    async (id: string): Promise<UserOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.delete(id);
        // Refresh the list after deleting
        await fetchUsers();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchUsers]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setUsers([]);
    setTotalCount(0);
    setSelectedUser(null);
    setSelectedUserRoles([]);
    setIsLoading(false);
    setError(null);
    setPageQuery(DEFAULT_PAGE_QUERY);
  }, []);

  return {
    users,
    totalCount,
    selectedUser,
    selectedUserRoles,
    isLoading,
    error,
    pageQuery,
    sortKey,
    sortOrder,
    fetchUsers,
    getUserById,
    getUserRoles,
    createUser,
    updateUser,
    deleteUser,
    setSelectedUser,
    setPageQuery,
    setSortKey,
    setSortOrder,
    reset,
  };
}
