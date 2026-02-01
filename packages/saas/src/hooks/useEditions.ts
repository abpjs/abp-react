/**
 * useEditions Hook
 * Translated from @volo/abp.ng.saas v0.7.2
 */

import { useState, useCallback, useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import { Saas } from '../models';
import { SaasService } from '../services';

/**
 * Sort order type for edition lists
 */
export type SortOrder = '' | 'asc' | 'desc';

/**
 * Result from edition operations
 * @since 0.7.2
 */
export interface EditionOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Return type for useEditions hook
 * @since 0.7.2
 */
export interface UseEditionsReturn {
  /** List of editions */
  editions: Saas.Edition[];
  /** Total count of editions */
  totalCount: number;
  /** Currently selected edition for editing */
  selectedEdition: Saas.Edition | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current sort key */
  sortKey: string;
  /** Current sort order */
  sortOrder: SortOrder;
  /** Usage statistics for editions */
  usageStatistics: Record<string, number>;
  /** Whether features modal is visible @since 2.2.0 */
  visibleFeatures: boolean;
  /** Provider key for features modal @since 2.2.0 */
  featuresProviderKey: string;
  /** Fetch all editions with optional pagination/filtering */
  fetchEditions: (params?: Saas.EditionsQueryParams) => Promise<EditionOperationResult<Saas.EditionsResponse>>;
  /** Get an edition by ID and set it as selected */
  getEditionById: (id: string) => Promise<EditionOperationResult<Saas.Edition>>;
  /** Create a new edition */
  createEdition: (edition: Saas.CreateEditionRequest) => Promise<EditionOperationResult<Saas.Edition>>;
  /** Update an existing edition */
  updateEdition: (edition: Saas.UpdateEditionRequest) => Promise<EditionOperationResult<Saas.Edition>>;
  /** Delete an edition */
  deleteEdition: (id: string) => Promise<EditionOperationResult>;
  /** Fetch usage statistics for editions */
  fetchUsageStatistics: () => Promise<EditionOperationResult<Record<string, number>>>;
  /** Set the selected edition */
  setSelectedEdition: (edition: Saas.Edition | null) => void;
  /** Set sort key */
  setSortKey: (key: string) => void;
  /** Set sort order */
  setSortOrder: (order: SortOrder) => void;
  /** Handle features modal visibility change @since 2.2.0 */
  onVisibleFeaturesChange: (value: boolean) => void;
  /** Open features modal for an edition @since 2.2.0 */
  openFeaturesModal: (providerKey: string) => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook for managing editions
 *
 * This hook provides all the state and actions needed for edition management
 * including CRUD operations and usage statistics.
 *
 * @since 0.7.2
 *
 * @example
 * ```tsx
 * function EditionsPage() {
 *   const {
 *     editions,
 *     isLoading,
 *     fetchEditions,
 *     createEdition,
 *     deleteEdition,
 *   } = useEditions();
 *
 *   useEffect(() => {
 *     fetchEditions();
 *   }, [fetchEditions]);
 *
 *   return (
 *     <div>
 *       {editions.map(edition => (
 *         <div key={edition.id}>{edition.displayName}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useEditions(): UseEditionsReturn {
  const restService = useRestService();

  // Service instance (memoized)
  const service = useMemo(() => new SaasService(restService), [restService]);

  // State
  const [editions, setEditions] = useState<Saas.Edition[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedEdition, setSelectedEdition] = useState<Saas.Edition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>('displayName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');
  const [usageStatistics, setUsageStatistics] = useState<Record<string, number>>({});
  // Features modal state (v2.2.0)
  const [visibleFeatures, setVisibleFeatures] = useState<boolean>(false);
  const [featuresProviderKey, setFeaturesProviderKey] = useState<string>('');

  /**
   * Fetch all editions with optional pagination/filtering
   */
  const fetchEditions = useCallback(
    async (params?: Saas.EditionsQueryParams): Promise<EditionOperationResult<Saas.EditionsResponse>> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getEditions(params);
        setEditions(response.items || []);
        setTotalCount(response.totalCount || 0);
        setIsLoading(false);
        return { success: true, data: response };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch editions';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Get an edition by ID and set it as selected
   */
  const getEditionById = useCallback(
    async (id: string): Promise<EditionOperationResult<Saas.Edition>> => {
      setIsLoading(true);
      setError(null);

      try {
        const edition = await service.getEditionById(id);
        setSelectedEdition(edition);
        setIsLoading(false);
        return { success: true, data: edition };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch edition';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Create a new edition
   */
  const createEdition = useCallback(
    async (edition: Saas.CreateEditionRequest): Promise<EditionOperationResult<Saas.Edition>> => {
      setIsLoading(true);
      setError(null);

      try {
        const created = await service.createEdition(edition);
        setIsLoading(false);
        return { success: true, data: created };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create edition';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Update an existing edition
   */
  const updateEdition = useCallback(
    async (edition: Saas.UpdateEditionRequest): Promise<EditionOperationResult<Saas.Edition>> => {
      setIsLoading(true);
      setError(null);

      try {
        const updated = await service.updateEdition(edition);
        setIsLoading(false);
        return { success: true, data: updated };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update edition';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Delete an edition
   */
  const deleteEdition = useCallback(
    async (id: string): Promise<EditionOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.deleteEdition(id);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete edition';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Fetch usage statistics for editions
   */
  const fetchUsageStatistics = useCallback(
    async (): Promise<EditionOperationResult<Record<string, number>>> => {
      setError(null);

      try {
        const response = await service.getUsageStatistics();
        setUsageStatistics(response.data || {});
        return { success: true, data: response.data };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch usage statistics';
        setError(errorMessage);
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
   * Open features modal for an edition
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
    setEditions([]);
    setTotalCount(0);
    setSelectedEdition(null);
    setIsLoading(false);
    setError(null);
    setSortKey('displayName');
    setSortOrder('');
    setUsageStatistics({});
    setVisibleFeatures(false);
    setFeaturesProviderKey('');
  }, []);

  return {
    editions,
    totalCount,
    selectedEdition,
    isLoading,
    error,
    sortKey,
    sortOrder,
    usageStatistics,
    visibleFeatures,
    featuresProviderKey,
    fetchEditions,
    getEditionById,
    createEdition,
    updateEdition,
    deleteEdition,
    fetchUsageStatistics,
    setSelectedEdition,
    setSortKey,
    setSortOrder,
    onVisibleFeaturesChange,
    openFeaturesModal,
    reset,
  };
}
