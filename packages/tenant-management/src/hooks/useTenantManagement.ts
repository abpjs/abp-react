import { useState, useCallback, useMemo } from 'react';
import { useRestService, ABP } from '@abpjs/core';
import { TenantManagement } from '../models';
import { TenantManagementService } from '../services';

/**
 * Result from tenant management operations
 */
export interface TenantManagementResult {
  success: boolean;
  error?: string;
}

/**
 * Sort order type
 * @since 1.0.0
 */
export type SortOrder = 'asc' | 'desc' | '';

/**
 * Return type for useTenantManagement hook
 */
export interface UseTenantManagementReturn {
  /** List of tenants */
  tenants: TenantManagement.Item[];
  /** Total count of tenants */
  totalCount: number;
  /** Currently selected tenant */
  selectedTenant: TenantManagement.Item | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Default connection string for selected tenant */
  defaultConnectionString: string;
  /** Whether the selected tenant uses shared database */
  useSharedDatabase: boolean;
  /** Current sort key @since 1.0.0 */
  sortKey: string;
  /** Current sort order @since 1.0.0 */
  sortOrder: SortOrder;
  /** Fetch all tenants (with optional params) */
  fetchTenants: (params?: ABP.PageQueryParams) => Promise<TenantManagementResult>;
  /** Fetch a tenant by ID */
  fetchTenantById: (id: string) => Promise<TenantManagementResult>;
  /** Create a new tenant */
  createTenant: (data: TenantManagement.AddRequest) => Promise<TenantManagementResult>;
  /** Update an existing tenant */
  updateTenant: (data: TenantManagement.UpdateRequest) => Promise<TenantManagementResult>;
  /** Delete a tenant */
  deleteTenant: (id: string) => Promise<TenantManagementResult>;
  /** Fetch connection string for a tenant */
  fetchConnectionString: (id: string) => Promise<TenantManagementResult>;
  /** Update connection string for a tenant */
  updateConnectionString: (
    id: string,
    connectionString: string
  ) => Promise<TenantManagementResult>;
  /** Delete connection string (use shared database) */
  deleteConnectionString: (id: string) => Promise<TenantManagementResult>;
  /** Set selected tenant */
  setSelectedTenant: (tenant: TenantManagement.Item | null) => void;
  /** Set use shared database flag */
  setUseSharedDatabase: (value: boolean) => void;
  /** Set default connection string */
  setDefaultConnectionString: (value: string) => void;
  /** Set sort key @since 1.0.0 */
  setSortKey: (key: string) => void;
  /** Set sort order @since 1.0.0 */
  setSortOrder: (order: SortOrder) => void;
  /** Reset all state */
  reset: () => void;
}

/**
 * Hook for managing tenants
 *
 * This hook provides all the state and actions needed for the tenant
 * management modal. It handles fetching, creating, updating, and deleting tenants,
 * as well as managing connection strings.
 *
 * @example
 * ```tsx
 * function TenantModal() {
 *   const {
 *     tenants,
 *     selectedTenant,
 *     isLoading,
 *     fetchTenants,
 *     createTenant,
 *     updateTenant,
 *     deleteTenant,
 *   } = useTenantManagement();
 *
 *   useEffect(() => {
 *     fetchTenants();
 *   }, [fetchTenants]);
 *
 *   return (
 *     // ... modal UI
 *   );
 * }
 * ```
 */
export function useTenantManagement(): UseTenantManagementReturn {
  const restService = useRestService();

  // Service instance (memoized)
  const service = useMemo(() => new TenantManagementService(restService), [restService]);

  // State
  const [tenants, setTenants] = useState<TenantManagement.Item[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedTenant, setSelectedTenant] = useState<TenantManagement.Item | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultConnectionString, setDefaultConnectionString] = useState<string>('');
  const [useSharedDatabase, setUseSharedDatabase] = useState<boolean>(true);
  // Sorting state (v1.0.0)
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');

  /**
   * Fetch all tenants (with optional params in v0.9.0)
   */
  const fetchTenants = useCallback(async (params?: ABP.PageQueryParams): Promise<TenantManagementResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.getAll(params);
      setTenants(response.items);
      setTotalCount(response.totalCount);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tenants';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [service]);

  /**
   * Fetch a tenant by ID
   */
  const fetchTenantById = useCallback(
    async (id: string): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const tenant = await service.getById(id);
        setSelectedTenant(tenant);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tenant';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Create a new tenant
   */
  const createTenant = useCallback(
    async (data: TenantManagement.AddRequest): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.create(data);
        // Refresh the list after creation
        await service.getAll().then((response) => setTenants(response.items));
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create tenant';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Update an existing tenant
   */
  const updateTenant = useCallback(
    async (data: TenantManagement.UpdateRequest): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.update(data);
        // Refresh the list after update
        await service.getAll().then((response) => setTenants(response.items));
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update tenant';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Delete a tenant
   */
  const deleteTenant = useCallback(
    async (id: string): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.delete(id);
        // Refresh the list after deletion
        await service.getAll().then((response) => setTenants(response.items));
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete tenant';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Fetch connection string for a tenant
   */
  const fetchConnectionString = useCallback(
    async (id: string): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const connectionString = await service.getDefaultConnectionString(id);
        setDefaultConnectionString(connectionString || '');
        setUseSharedDatabase(!connectionString);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch connection string';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Update connection string for a tenant
   */
  const updateConnectionString = useCallback(
    async (id: string, connectionString: string): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.updateDefaultConnectionString({
          id,
          defaultConnectionString: connectionString,
        });
        setDefaultConnectionString(connectionString);
        setUseSharedDatabase(false);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update connection string';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Delete connection string (use shared database)
   */
  const deleteConnectionString = useCallback(
    async (id: string): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.deleteDefaultConnectionString(id);
        setDefaultConnectionString('');
        setUseSharedDatabase(true);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete connection string';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setTenants([]);
    setTotalCount(0);
    setSelectedTenant(null);
    setIsLoading(false);
    setError(null);
    setDefaultConnectionString('');
    setUseSharedDatabase(true);
  }, []);

  return {
    tenants,
    totalCount,
    selectedTenant,
    isLoading,
    error,
    defaultConnectionString,
    useSharedDatabase,
    sortKey,
    sortOrder,
    fetchTenants,
    fetchTenantById,
    createTenant,
    updateTenant,
    deleteTenant,
    fetchConnectionString,
    updateConnectionString,
    deleteConnectionString,
    setSelectedTenant,
    setUseSharedDatabase,
    setDefaultConnectionString,
    setSortKey,
    setSortOrder,
    reset,
  };
}
