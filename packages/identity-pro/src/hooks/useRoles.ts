import { useState, useCallback, useMemo } from 'react';
import { useRestService, ABP } from '@abpjs/core';
import { Identity } from '../models';
import { IdentityService } from '../services';

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
 */
export interface UseRolesReturn {
  /** List of roles */
  roles: Identity.RoleItem[];
  /** Total count of roles */
  totalCount: number;
  /** Currently selected role for editing */
  selectedRole: Identity.RoleItem | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current sort key @since 1.0.0 */
  sortKey: string;
  /** Current sort order @since 1.0.0 */
  sortOrder: SortOrder;
  /** Whether permissions modal is visible @since 2.2.0 */
  visiblePermissions: boolean;
  /** Provider key for permissions modal @since 2.2.0 */
  permissionsProviderKey: string;
  /** Fetch all roles with optional pagination/filtering */
  fetchRoles: (params?: ABP.PageQueryParams) => Promise<RoleOperationResult>;
  /** Get a role by ID and set it as selected */
  getRoleById: (id: string) => Promise<RoleOperationResult>;
  /** Create a new role */
  createRole: (role: Identity.RoleSaveRequest) => Promise<RoleOperationResult>;
  /** Update an existing role */
  updateRole: (id: string, role: Identity.RoleSaveRequest) => Promise<RoleOperationResult>;
  /** Delete a role */
  deleteRole: (id: string) => Promise<RoleOperationResult>;
  /** Set the selected role */
  setSelectedRole: (role: Identity.RoleItem | null) => void;
  /** Set sort key @since 1.0.0 */
  setSortKey: (key: string) => void;
  /** Set sort order @since 1.0.0 */
  setSortOrder: (order: SortOrder) => void;
  /** Handle permissions modal visibility change @since 2.2.0 */
  onVisiblePermissionsChange: (value: boolean) => void;
  /** Open permissions modal for a role @since 2.2.0 */
  openPermissionsModal: (providerKey: string) => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook for managing roles
 *
 * This hook provides all the state and actions needed for role management.
 * It handles fetching, creating, updating, and deleting roles.
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
 *   const handleCreate = async (data: Identity.RoleSaveRequest) => {
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

  // Service instance (memoized)
  const service = useMemo(() => new IdentityService(restService), [restService]);

  // State
  const [roles, setRoles] = useState<Identity.RoleItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<Identity.RoleItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Sorting state (v1.0.0)
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');
  // Permissions modal state (v2.2.0)
  const [visiblePermissions, setVisiblePermissions] = useState<boolean>(false);
  const [permissionsProviderKey, setPermissionsProviderKey] = useState<string>('');

  /**
   * Fetch all roles with optional pagination/filtering (v0.9.0)
   * @param params - Optional query parameters for pagination and filtering
   */
  const fetchRoles = useCallback(async (params?: ABP.PageQueryParams): Promise<RoleOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.getRoles(params);
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
        const role = await service.getRoleById(id);
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
    async (role: Identity.RoleSaveRequest): Promise<RoleOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.createRole(role);
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
    async (id: string, role: Identity.RoleSaveRequest): Promise<RoleOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.updateRole(id, role);
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
        await service.deleteRole(id);
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
   * Handle permissions modal visibility change
   * @since 2.2.0
   */
  const onVisiblePermissionsChange = useCallback((value: boolean) => {
    setVisiblePermissions(value);
    if (!value) {
      setPermissionsProviderKey('');
    }
  }, []);

  /**
   * Open permissions modal for a role
   * @since 2.2.0
   */
  const openPermissionsModal = useCallback((providerKey: string) => {
    setPermissionsProviderKey(providerKey);
    setVisiblePermissions(true);
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setRoles([]);
    setTotalCount(0);
    setSelectedRole(null);
    setIsLoading(false);
    setError(null);
    setVisiblePermissions(false);
    setPermissionsProviderKey('');
  }, []);

  return {
    roles,
    totalCount,
    selectedRole,
    isLoading,
    error,
    sortKey,
    sortOrder,
    visiblePermissions,
    permissionsProviderKey,
    fetchRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    setSelectedRole,
    setSortKey,
    setSortOrder,
    onVisiblePermissionsChange,
    openPermissionsModal,
    reset,
  };
}
