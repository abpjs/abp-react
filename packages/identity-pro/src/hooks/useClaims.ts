import { useState, useCallback, useMemo } from 'react';
import { useRestService, ABP } from '@abpjs/core';
import { Identity } from '../models';
import { IdentityService } from '../services';
import type { SortOrder } from './useRoles';

/**
 * Result from claim operations
 * @since 0.7.2
 */
export interface ClaimOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Return type for useClaims hook
 * @since 0.7.2
 */
export interface UseClaimsReturn {
  /** List of claim types */
  claimTypes: Identity.ClaimType[];
  /** Total count of claim types */
  totalCount: number;
  /** Claim type names for dropdowns */
  claimTypeNames: Identity.ClaimTypeName[];
  /** Currently selected claim type for editing */
  selectedClaimType: Identity.ClaimType | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current sort key */
  sortKey: string;
  /** Current sort order */
  sortOrder: SortOrder;
  /** Fetch all claim types with optional pagination/filtering */
  fetchClaimTypes: (params?: ABP.PageQueryParams) => Promise<ClaimOperationResult>;
  /** Fetch claim type names for dropdowns */
  fetchClaimTypeNames: () => Promise<ClaimOperationResult>;
  /** Get a claim type by ID and set it as selected */
  getClaimTypeById: (id: string) => Promise<ClaimOperationResult>;
  /** Create a new claim type */
  createClaimType: (claimType: Identity.ClaimType) => Promise<ClaimOperationResult>;
  /** Update an existing claim type */
  updateClaimType: (claimType: Identity.ClaimType) => Promise<ClaimOperationResult>;
  /** Delete a claim type */
  deleteClaimType: (id: string) => Promise<ClaimOperationResult>;
  /** Set the selected claim type */
  setSelectedClaimType: (claimType: Identity.ClaimType | null) => void;
  /** Set sort key */
  setSortKey: (key: string) => void;
  /** Set sort order */
  setSortOrder: (order: SortOrder) => void;
  /** Reset state */
  reset: () => void;
  // User/Role Claims
  /** Get claims for a user or role */
  getClaims: (id: string, type: 'users' | 'roles') => Promise<Identity.ClaimRequest[]>;
  /** Update claims for a user or role */
  updateClaims: (id: string, type: 'users' | 'roles', claims: Identity.ClaimRequest[]) => Promise<ClaimOperationResult>;
}

/**
 * Hook for managing claim types
 *
 * This hook provides all the state and actions needed for claim type management.
 * It handles fetching, creating, updating, and deleting claim types.
 *
 * Pro feature since 0.7.2
 *
 * @example
 * ```tsx
 * function ClaimsPage() {
 *   const {
 *     claimTypes,
 *     isLoading,
 *     fetchClaimTypes,
 *     createClaimType,
 *     deleteClaimType,
 *   } = useClaims();
 *
 *   useEffect(() => {
 *     fetchClaimTypes();
 *   }, [fetchClaimTypes]);
 *
 *   const handleCreate = async (data: Identity.ClaimType) => {
 *     const result = await createClaimType(data);
 *     if (result.success) {
 *       // Handle success
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {claimTypes.map(claim => (
 *         <div key={claim.id}>{claim.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useClaims(): UseClaimsReturn {
  const restService = useRestService();

  // Service instance (memoized)
  const service = useMemo(() => new IdentityService(restService), [restService]);

  // State
  const [claimTypes, setClaimTypes] = useState<Identity.ClaimType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [claimTypeNames, setClaimTypeNames] = useState<Identity.ClaimTypeName[]>([]);
  const [selectedClaimType, setSelectedClaimType] = useState<Identity.ClaimType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Sorting state
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');

  /**
   * Fetch all claim types with optional pagination/filtering
   */
  const fetchClaimTypes = useCallback(async (params?: ABP.PageQueryParams): Promise<ClaimOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.getClaimTypes(params);
      setClaimTypes(response.items || []);
      setTotalCount(response.totalCount || 0);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch claim types';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [service]);

  /**
   * Fetch claim type names for dropdowns
   */
  const fetchClaimTypeNames = useCallback(async (): Promise<ClaimOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.getClaimTypeNames();
      setClaimTypeNames(response || []);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch claim type names';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [service]);

  /**
   * Get a claim type by ID and set it as selected
   */
  const getClaimTypeById = useCallback(
    async (id: string): Promise<ClaimOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const claimType = await service.getClaimTypeById(id);
        setSelectedClaimType(claimType);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch claim type';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Create a new claim type
   */
  const createClaimType = useCallback(
    async (claimType: Identity.ClaimType): Promise<ClaimOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.createClaimType(claimType);
        // Refresh the list after creating
        await fetchClaimTypes();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create claim type';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchClaimTypes]
  );

  /**
   * Update an existing claim type
   */
  const updateClaimType = useCallback(
    async (claimType: Identity.ClaimType): Promise<ClaimOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.updateClaimType(claimType);
        // Refresh the list after updating
        await fetchClaimTypes();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update claim type';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchClaimTypes]
  );

  /**
   * Delete a claim type
   */
  const deleteClaimType = useCallback(
    async (id: string): Promise<ClaimOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.deleteClaimType(id);
        // Refresh the list after deleting
        await fetchClaimTypes();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete claim type';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchClaimTypes]
  );

  /**
   * Get claims for a user or role
   */
  const getClaims = useCallback(
    async (id: string, type: 'users' | 'roles'): Promise<Identity.ClaimRequest[]> => {
      try {
        return await service.getClaims({ id, type });
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch claims';
        setError(errorMessage);
        return [];
      }
    },
    [service]
  );

  /**
   * Update claims for a user or role
   */
  const updateClaims = useCallback(
    async (id: string, type: 'users' | 'roles', claims: Identity.ClaimRequest[]): Promise<ClaimOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.updateClaims({ id, type, claims });
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update claims';
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
    setClaimTypes([]);
    setTotalCount(0);
    setClaimTypeNames([]);
    setSelectedClaimType(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    claimTypes,
    totalCount,
    claimTypeNames,
    selectedClaimType,
    isLoading,
    error,
    sortKey,
    sortOrder,
    fetchClaimTypes,
    fetchClaimTypeNames,
    getClaimTypeById,
    createClaimType,
    updateClaimType,
    deleteClaimType,
    setSelectedClaimType,
    setSortKey,
    setSortOrder,
    reset,
    getClaims,
    updateClaims,
  };
}
