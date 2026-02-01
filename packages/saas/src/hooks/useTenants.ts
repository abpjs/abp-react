/**
 * useTenants Hook
 * Translated from @volo/abp.ng.saas v0.7.2
 */

import { useState, useCallback, useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import { Saas } from '../models';
import { SaasService } from '../services';

/**
 * Sort order type for tenant lists
 */
export type SortOrder = '' | 'asc' | 'desc';

/**
 * Result from tenant operations
 * @since 0.7.2
 */
export interface TenantOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Return type for useTenants hook
 * @since 0.7.2
 */
export interface UseTenantsReturn {
  /** List of tenants */
  tenants: Saas.Tenant[];
  /** Total count of tenants */
  totalCount: number;
  /** Currently selected tenant for editing */
  selectedTenant: Saas.Tenant | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current sort key */
  sortKey: string;
  /** Current sort order */
  sortOrder: SortOrder;
  /** Default connection string for selected tenant */
  defaultConnectionString: string;
  /** Whether the tenant uses shared database */
  useSharedDatabase: boolean;
  /** Whether features modal is visible @since 2.2.0 */
  visibleFeatures: boolean;
  /** Provider key for features modal @since 2.2.0 */
  featuresProviderKey: string;
  /** Fetch all tenants with optional pagination/filtering */
  fetchTenants: (params?: Saas.TenantsQueryParams) => Promise<TenantOperationResult<Saas.TenantsResponse>>;
  /** Get a tenant by ID and set it as selected */
  getTenantById: (id: string) => Promise<TenantOperationResult<Saas.Tenant>>;
  /** Create a new tenant */
  createTenant: (tenant: Saas.CreateTenantRequest) => Promise<TenantOperationResult<Saas.Tenant>>;
  /** Update an existing tenant */
  updateTenant: (tenant: Saas.UpdateTenantRequest) => Promise<TenantOperationResult<Saas.Tenant>>;
  /** Delete a tenant */
  deleteTenant: (id: string) => Promise<TenantOperationResult>;
  /** Get the default connection string for a tenant */
  getDefaultConnectionString: (id: string) => Promise<TenantOperationResult<string>>;
  /** Update the default connection string */
  updateDefaultConnectionString: (payload: Saas.DefaultConnectionStringRequest) => Promise<TenantOperationResult>;
  /** Delete the default connection string (use shared database) */
  deleteDefaultConnectionString: (id: string) => Promise<TenantOperationResult>;
  /** Set the selected tenant */
  setSelectedTenant: (tenant: Saas.Tenant | null) => void;
  /** Set sort key */
  setSortKey: (key: string) => void;
  /** Set sort order */
  setSortOrder: (order: SortOrder) => void;
  /** Handle features modal visibility change @since 2.2.0 */
  onVisibleFeaturesChange: (value: boolean) => void;
  /** Open features modal for a tenant @since 2.2.0 */
  openFeaturesModal: (providerKey: string) => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook for managing tenants
 *
 * This hook provides all the state and actions needed for tenant management
 * including CRUD operations and connection string management.
 *
 * @since 0.7.2
 *
 * @example
 * ```tsx
 * function TenantsPage() {
 *   const {
 *     tenants,
 *     isLoading,
 *     fetchTenants,
 *     createTenant,
 *     deleteTenant,
 *   } = useTenants();
 *
 *   useEffect(() => {
 *     fetchTenants();
 *   }, [fetchTenants]);
 *
 *   return (
 *     <div>
 *       {tenants.map(tenant => (
 *         <div key={tenant.id}>{tenant.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTenants(): UseTenantsReturn {
  const restService = useRestService();

  // Service instance (memoized)
  const service = useMemo(() => new SaasService(restService), [restService]);

  // State
  const [tenants, setTenants] = useState<Saas.Tenant[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedTenant, setSelectedTenant] = useState<Saas.Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');
  const [defaultConnectionString, setDefaultConnectionString] = useState<string>('');
  const [useSharedDatabase, setUseSharedDatabase] = useState<boolean>(true);
  // Features modal state (v2.2.0)
  const [visibleFeatures, setVisibleFeatures] = useState<boolean>(false);
  const [featuresProviderKey, setFeaturesProviderKey] = useState<string>('');

  /**
   * Fetch all tenants with optional pagination/filtering
   */
  const fetchTenants = useCallback(
    async (params?: Saas.TenantsQueryParams): Promise<TenantOperationResult<Saas.TenantsResponse>> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getTenants(params);
        setTenants(response.items || []);
        setTotalCount(response.totalCount || 0);
        setIsLoading(false);
        return { success: true, data: response };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tenants';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Get a tenant by ID and set it as selected
   */
  const getTenantById = useCallback(
    async (id: string): Promise<TenantOperationResult<Saas.Tenant>> => {
      setIsLoading(true);
      setError(null);

      try {
        const tenant = await service.getTenantById(id);
        setSelectedTenant(tenant);
        setIsLoading(false);
        return { success: true, data: tenant };
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
    async (tenant: Saas.CreateTenantRequest): Promise<TenantOperationResult<Saas.Tenant>> => {
      setIsLoading(true);
      setError(null);

      try {
        const created = await service.createTenant(tenant);
        setIsLoading(false);
        return { success: true, data: created };
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
    async (tenant: Saas.UpdateTenantRequest): Promise<TenantOperationResult<Saas.Tenant>> => {
      setIsLoading(true);
      setError(null);

      try {
        const updated = await service.updateTenant(tenant);
        setIsLoading(false);
        return { success: true, data: updated };
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
    async (id: string): Promise<TenantOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.deleteTenant(id);
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
   * Get the default connection string for a tenant
   */
  const getDefaultConnectionString = useCallback(
    async (id: string): Promise<TenantOperationResult<string>> => {
      setError(null);

      try {
        const connString = await service.getDefaultConnectionString(id);
        setDefaultConnectionString(connString || '');
        setUseSharedDatabase(!connString);
        return { success: true, data: connString };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch connection string';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Update the default connection string
   */
  const updateDefaultConnectionString = useCallback(
    async (payload: Saas.DefaultConnectionStringRequest): Promise<TenantOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.updateDefaultConnectionString(payload);
        setDefaultConnectionString(payload.defaultConnectionString);
        setUseSharedDatabase(false);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update connection string';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Delete the default connection string (use shared database)
   */
  const deleteDefaultConnectionString = useCallback(
    async (id: string): Promise<TenantOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.deleteDefaultConnectionString(id);
        setDefaultConnectionString('');
        setUseSharedDatabase(true);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete connection string';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

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
   * Open features modal for a tenant
   * @since 2.2.0
   */
  const openFeaturesModal = useCallback((providerKey: string) => {
    setFeaturesProviderKey(providerKey);
    setVisibleFeatures(true);
  }, []);

  /**
   * Reset all state to initial values
   */
  const reset = useCallback(() => {
    setTenants([]);
    setTotalCount(0);
    setSelectedTenant(null);
    setIsLoading(false);
    setError(null);
    setSortKey('name');
    setSortOrder('');
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
    sortKey,
    sortOrder,
    defaultConnectionString,
    useSharedDatabase,
    visibleFeatures,
    featuresProviderKey,
    fetchTenants,
    getTenantById,
    createTenant,
    updateTenant,
    deleteTenant,
    getDefaultConnectionString,
    updateDefaultConnectionString,
    deleteDefaultConnectionString,
    setSelectedTenant,
    setSortKey,
    setSortOrder,
    onVisibleFeaturesChange,
    openFeaturesModal,
    reset,
  };
}
