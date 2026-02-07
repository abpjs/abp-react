import { useState, useCallback, useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import type { TenantDto, TenantCreateDto, TenantUpdateDto, GetTenantsInput } from '../proxy/models';
import { TenantService } from '../proxy/tenant.service';

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
 * Modal content type for tenant management
 * @since 1.1.0
 */
export type ModalContentType = 'saveConnStr' | 'saveTenant';

/**
 * Return type for useTenantManagement hook
 * @since 4.0.0 - Uses TenantDto, TenantCreateDto, TenantUpdateDto instead of legacy types
 */
export interface UseTenantManagementReturn {
  /** List of tenants */
  tenants: TenantDto[];
  /** Total count of tenants */
  totalCount: number;
  /** Currently selected tenant */
  selectedTenant: TenantDto | null;
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
  /** Whether the save button should be disabled @since 1.1.0 */
  isDisabledSaveButton: boolean;
  /** Fetch all tenants (with optional params) */
  fetchTenants: (input?: Partial<GetTenantsInput>) => Promise<TenantManagementResult>;
  /** Fetch a tenant by ID */
  fetchTenantById: (id: string) => Promise<TenantManagementResult>;
  /** Create a new tenant */
  createTenant: (data: TenantCreateDto) => Promise<TenantManagementResult>;
  /** Update an existing tenant */
  updateTenant: (id: string, data: TenantUpdateDto) => Promise<TenantManagementResult>;
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
  setSelectedTenant: (tenant: TenantDto | null) => void;
  /** Set use shared database flag */
  setUseSharedDatabase: (value: boolean) => void;
  /** Set default connection string */
  setDefaultConnectionString: (value: string) => void;
  /** Set sort key @since 1.0.0 */
  setSortKey: (key: string) => void;
  /** Set sort order @since 1.0.0 */
  setSortOrder: (order: SortOrder) => void;
  /** Handle shared database checkbox change @since 1.1.0 */
  onSharedDatabaseChange: (value: boolean) => void;
  /** Whether the features modal is visible @since 2.2.0 */
  visibleFeatures: boolean;
  /** Provider key for the features modal (tenant ID) @since 2.2.0 */
  featuresProviderKey: string;
  /** Callback when features modal visibility changes @since 2.2.0 */
  onVisibleFeaturesChange: (value: boolean) => void;
  /** Open the features modal for a tenant @since 2.2.0 */
  openFeaturesModal: (providerKey: string) => void;
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
 * @since 4.0.0 - Uses TenantService (proxy) instead of TenantManagementService
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

  // Service instance (memoized) - v4.0.0: uses TenantService instead of TenantManagementService
  const service = useMemo(() => new TenantService(restService), [restService]);

  // State
  const [tenants, setTenants] = useState<TenantDto[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedTenant, setSelectedTenant] = useState<TenantDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultConnectionString, setDefaultConnectionString] = useState<string>('');
  const [useSharedDatabase, setUseSharedDatabase] = useState<boolean>(true);
  // Sorting state (v1.0.0)
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');
  // Features modal state (v2.2.0)
  const [visibleFeatures, setVisibleFeatures] = useState<boolean>(false);
  const [featuresProviderKey, setFeaturesProviderKey] = useState<string>('');

  /**
   * Fetch all tenants (with optional params)
   * @since 4.0.0 - Uses TenantService.getList with GetTenantsInput
   */
  const fetchTenants = useCallback(async (input?: Partial<GetTenantsInput>): Promise<TenantManagementResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.getList({
        filter: '',
        maxResultCount: 10,
        skipCount: 0,
        ...input,
      } as GetTenantsInput);
      setTenants(response.items ?? []);
      setTotalCount(response.totalCount ?? 0);
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
   * @since 4.0.0 - Uses TenantService.get
   */
  const fetchTenantById = useCallback(
    async (id: string): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const tenant = await service.get(id);
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
   * @since 4.0.0 - Uses TenantCreateDto instead of TenantManagement.AddRequest
   */
  const createTenant = useCallback(
    async (data: TenantCreateDto): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.create(data);
        // Refresh the list after creation
        await service.getList({ filter: '', maxResultCount: 10, skipCount: 0 } as GetTenantsInput).then((response) => setTenants(response.items ?? []));
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
   * @since 4.0.0 - Uses TenantUpdateDto instead of TenantManagement.UpdateRequest, takes id separately
   */
  const updateTenant = useCallback(
    async (id: string, data: TenantUpdateDto): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.update(id, data);
        // Refresh the list after update
        await service.getList({ filter: '', maxResultCount: 10, skipCount: 0 } as GetTenantsInput).then((response) => setTenants(response.items ?? []));
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
        await service.getList({ filter: '', maxResultCount: 10, skipCount: 0 } as GetTenantsInput).then((response) => setTenants(response.items ?? []));
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
   * @since 4.0.0 - Uses TenantService.updateDefaultConnectionString(id, connectionString)
   */
  const updateConnectionString = useCallback(
    async (id: string, connectionString: string): Promise<TenantManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.updateDefaultConnectionString(id, connectionString);
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
   * Handle shared database checkbox change
   * Clears connection string when switching to shared database
   * @since 1.1.0
   */
  const onSharedDatabaseChange = useCallback((value: boolean) => {
    setUseSharedDatabase(value);
    if (value) {
      setDefaultConnectionString('');
    }
  }, []);

  /**
   * Handle features modal visibility change
   * @since 2.2.0
   */
  const onVisibleFeaturesChange = useCallback((value: boolean) => {
    setVisibleFeatures(value);
    if (!value) {
      setFeaturesProviderKey('');
    }
  }, []);

  /**
   * Open the features modal for a specific tenant
   * @since 2.2.0
   */
  const openFeaturesModal = useCallback((providerKey: string) => {
    setFeaturesProviderKey(providerKey);
    setVisibleFeatures(true);
  }, []);

  /**
   * Compute whether save button should be disabled
   * Disabled when not using shared database but connection string is empty
   * @since 1.1.0
   */
  const isDisabledSaveButton = useMemo(() => {
    return !useSharedDatabase && !defaultConnectionString.trim();
  }, [useSharedDatabase, defaultConnectionString]);

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
    setVisibleFeatures(false);
    setFeaturesProviderKey('');
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
    isDisabledSaveButton,
    visibleFeatures,
    featuresProviderKey,
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
    onSharedDatabaseChange,
    onVisibleFeaturesChange,
    openFeaturesModal,
    reset,
  };
}
