import { useState, useCallback, useMemo } from 'react';
import { useRestService, ABP } from '@abpjs/core';
import { Identity } from '../models';
import { IdentityService } from '../services';

/**
 * Result from user operations
 */
export interface UserOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Return type for useUsers hook
 */
export interface UseUsersReturn {
  /** List of users */
  users: Identity.UserItem[];
  /** Total count of users */
  totalCount: number;
  /** Currently selected user for editing */
  selectedUser: Identity.UserItem | null;
  /** Roles assigned to the selected user */
  selectedUserRoles: Identity.RoleItem[];
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current page query parameters */
  pageQuery: ABP.PageQueryParams;
  /** Fetch users with pagination */
  fetchUsers: (params?: ABP.PageQueryParams) => Promise<UserOperationResult>;
  /** Get a user by ID and set it as selected */
  getUserById: (id: string) => Promise<UserOperationResult>;
  /** Get roles for a user */
  getUserRoles: (id: string) => Promise<UserOperationResult>;
  /** Create a new user */
  createUser: (user: Identity.UserSaveRequest) => Promise<UserOperationResult>;
  /** Update an existing user */
  updateUser: (id: string, user: Identity.UserSaveRequest) => Promise<UserOperationResult>;
  /** Delete a user */
  deleteUser: (id: string) => Promise<UserOperationResult>;
  /** Set the selected user */
  setSelectedUser: (user: Identity.UserItem | null) => void;
  /** Set page query parameters */
  setPageQuery: (query: ABP.PageQueryParams) => void;
  /** Reset state */
  reset: () => void;
}

const DEFAULT_PAGE_QUERY: ABP.PageQueryParams = {
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

  // Service instance (memoized)
  const service = useMemo(() => new IdentityService(restService), [restService]);

  // State
  const [users, setUsers] = useState<Identity.UserItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<Identity.UserItem | null>(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState<Identity.RoleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageQuery, setPageQuery] = useState<ABP.PageQueryParams>(DEFAULT_PAGE_QUERY);

  /**
   * Fetch users with pagination
   */
  const fetchUsers = useCallback(
    async (params?: ABP.PageQueryParams): Promise<UserOperationResult> => {
      setIsLoading(true);
      setError(null);

      const queryParams = params || pageQuery;

      try {
        const response = await service.getUsers(queryParams);
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
        const user = await service.getUserById(id);
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
        const response = await service.getUserRoles(id);
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
    async (user: Identity.UserSaveRequest): Promise<UserOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.createUser(user);
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
    async (id: string, user: Identity.UserSaveRequest): Promise<UserOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.updateUser(id, user);
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
        await service.deleteUser(id);
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
    fetchUsers,
    getUserById,
    getUserRoles,
    createUser,
    updateUser,
    deleteUser,
    setSelectedUser,
    setPageQuery,
    reset,
  };
}
