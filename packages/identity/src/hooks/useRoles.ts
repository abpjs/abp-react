import { useState, useCallback, useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import type { PagedAndSortedResultRequestDto } from '@abpjs/core';
import type { IdentityRoleDto, IdentityRoleCreateDto, IdentityRoleUpdateDto } from '../proxy/identity/models';
import { IdentityRoleService } from '../proxy/identity/identity-role.service';

/**
 * Result from role operations
 */
export interface RoleOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Sort order type
 * @since 1.0.0
 */
export type SortOrder = 'asc' | 'desc' | '';

/**
 * Return type for useRoles hook
 * @updated 4.0.0 - Now uses IdentityRoleDto, IdentityRoleCreateDto, IdentityRoleUpdateDto
 */
export interface UseRolesReturn {
  /** List of roles */
  roles: IdentityRoleDto[];
  /** Total count of roles */
  totalCount: number;
  /** Currently selected role for editing */
  selectedRole: IdentityRoleDto | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current sort key @since 1.0.0 */
  sortKey: string;
  /** Current sort order @since 1.0.0 */
  sortOrder: SortOrder;
  /** Fetch all roles with optional pagination/filtering */
  fetchRoles: (params?: PagedAndSortedResultRequestDto) => Promise<RoleOperationResult>;
  /** Get a role by ID and set it as selected */
  getRoleById: (id: string) => Promise<RoleOperationResult>;
  /** Create a new role */
  createRole: (role: IdentityRoleCreateDto) => Promise<RoleOperationResult>;
  /** Update an existing role */
  updateRole: (id: string, role: IdentityRoleUpdateDto) => Promise<RoleOperationResult>;
  /** Delete a role */
  deleteRole: (id: string) => Promise<RoleOperationResult>;
  /** Set the selected role */
  setSelectedRole: (role: IdentityRoleDto | null) => void;
  /** Set sort key @since 1.0.0 */
  setSortKey: (key: string) => void;
  /** Set sort order @since 1.0.0 */
  setSortOrder: (order: SortOrder) => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook for managing roles
 *
 * This hook provides all the state and actions needed for role management.
 * It handles fetching, creating, updating, and deleting roles.
 *
 * @updated 4.0.0 - Migrated from deprecated IdentityService to IdentityRoleService
 *
 * @example
 * ```tsx
 * function RolesPage() {
 *   const {
 *     roles,
 *     isLoading,
 *     fetchRoles,
 *     createRole,
 *     deleteRole,
 *   } = useRoles();
 *
 *   useEffect(() => {
 *     fetchRoles();
 *   }, [fetchRoles]);
 *
 *   const handleCreate = async (data: IdentityRoleCreateDto) => {
 *     const result = await createRole(data);
 *     if (result.success) {
 *       // Handle success
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {roles.map(role => (
 *         <div key={role.id}>{role.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useRoles(): UseRolesReturn {
  const restService = useRestService();

  // Service instance (memoized) - v4.0.0: uses IdentityRoleService instead of deprecated IdentityService
  const service = useMemo(() => new IdentityRoleService(restService), [restService]);

  // State
  const [roles, setRoles] = useState<IdentityRoleDto[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<IdentityRoleDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Sorting state (v1.0.0)
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');

  /**
   * Fetch all roles with optional pagination/filtering
   * @param params - Optional pagination/sorting parameters
   */
  const fetchRoles = useCallback(async (params?: PagedAndSortedResultRequestDto): Promise<RoleOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.getList(params || {} as PagedAndSortedResultRequestDto);
      setRoles(response.items || []);
      setTotalCount(response.totalCount || 0);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch roles';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [service]);

  /**
   * Get a role by ID and set it as selected
   */
  const getRoleById = useCallback(
    async (id: string): Promise<RoleOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const role = await service.get(id);
        setSelectedRole(role);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch role';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Create a new role
   */
  const createRole = useCallback(
    async (role: IdentityRoleCreateDto): Promise<RoleOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.create(role);
        // Refresh the list after creating
        await fetchRoles();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create role';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchRoles]
  );

  /**
   * Update an existing role
   */
  const updateRole = useCallback(
    async (id: string, role: IdentityRoleUpdateDto): Promise<RoleOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.update(id, role);
        // Refresh the list after updating
        await fetchRoles();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update role';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchRoles]
  );

  /**
   * Delete a role
   */
  const deleteRole = useCallback(
    async (id: string): Promise<RoleOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.delete(id);
        // Refresh the list after deleting
        await fetchRoles();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete role';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchRoles]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setRoles([]);
    setTotalCount(0);
    setSelectedRole(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    roles,
    totalCount,
    selectedRole,
    isLoading,
    error,
    sortKey,
    sortOrder,
    fetchRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    setSelectedRole,
    setSortKey,
    setSortOrder,
    reset,
  };
}
