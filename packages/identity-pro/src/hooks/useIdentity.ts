import { useCallback, useMemo } from 'react';
import { useRoles, UseRolesReturn } from './useRoles';
import { useUsers, UseUsersReturn } from './useUsers';

/**
 * Combined identity management return type
 */
export interface UseIdentityReturn {
  /** Role management hook */
  roles: UseRolesReturn;
  /** User management hook */
  users: UseUsersReturn;
  /** Combined loading state */
  isLoading: boolean;
  /** Combined error state */
  error: string | null;
  /** Reset all state */
  resetAll: () => void;
}

/**
 * Hook that combines role and user management for identity operations
 *
 * This hook provides a unified interface for managing both roles and users.
 * It combines the useRoles and useUsers hooks for convenience.
 *
 * @example
 * ```tsx
 * function IdentityManagement() {
 *   const { roles, users, isLoading } = useIdentity();
 *
 *   useEffect(() => {
 *     roles.fetchRoles();
 *     users.fetchUsers();
 *   }, []);
 *
 *   return (
 *     <div>
 *       <h2>Roles</h2>
 *       {roles.roles.map(role => <div key={role.id}>{role.name}</div>)}
 *
 *       <h2>Users</h2>
 *       {users.users.map(user => <div key={user.id}>{user.userName}</div>)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIdentity(): UseIdentityReturn {
  const rolesHook = useRoles();
  const usersHook = useUsers();

  // Combined loading state
  const isLoading = useMemo(
    () => rolesHook.isLoading || usersHook.isLoading,
    [rolesHook.isLoading, usersHook.isLoading]
  );

  // Combined error state (returns the first error found)
  const error = useMemo(
    () => rolesHook.error || usersHook.error,
    [rolesHook.error, usersHook.error]
  );

  // Reset all state
  const resetAll = useCallback(() => {
    rolesHook.reset();
    usersHook.reset();
  }, [rolesHook, usersHook]);

  return {
    roles: rolesHook,
    users: usersHook,
    isLoading,
    error,
    resetAll,
  };
}
