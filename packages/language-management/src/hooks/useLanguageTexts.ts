import { useState, useCallback, useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import { LanguageManagement } from '../models';
import { LanguageManagementService } from '../services';

/**
 * Sort order type for language text lists
 */
export type SortOrder = '' | 'asc' | 'desc';

/**
 * Result from language text operations
 * @since 0.7.2
 */
export interface LanguageTextOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Return type for useLanguageTexts hook
 * @since 0.7.2
 */
export interface UseLanguageTextsReturn {
  /** List of language texts */
  languageTexts: LanguageManagement.LanguageText[];
  /** Total count of language texts */
  totalCount: number;
  /** Available localization resources */
  resources: LanguageManagement.Resource[];
  /** Currently selected language text for editing */
  selectedLanguageText: LanguageManagement.LanguageText | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current sort key */
  sortKey: string;
  /** Current sort order */
  sortOrder: SortOrder;
  /** Fetch language texts with filtering */
  fetchLanguageTexts: (
    params: LanguageManagement.LanguageTextQueryParams
  ) => Promise<LanguageTextOperationResult>;
  /** Fetch all available resources */
  fetchResources: () => Promise<LanguageTextOperationResult>;
  /** Get a language text by name */
  getLanguageTextByName: (
    params: LanguageManagement.LanguageTextRequestByNameParams
  ) => Promise<LanguageTextOperationResult>;
  /** Update a language text by name */
  updateLanguageTextByName: (
    params: LanguageManagement.LanguageTextUpdateByNameParams
  ) => Promise<LanguageTextOperationResult>;
  /** Restore a language text to its default value */
  restoreLanguageTextByName: (
    params: LanguageManagement.LanguageTextRequestByNameParams
  ) => Promise<LanguageTextOperationResult>;
  /** Set the selected language text */
  setSelectedLanguageText: (languageText: LanguageManagement.LanguageText | null) => void;
  /** Set sort key */
  setSortKey: (key: string) => void;
  /** Set sort order */
  setSortOrder: (order: SortOrder) => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook for managing language texts (localization strings)
 *
 * This hook provides all the state and actions needed for language text management.
 * It handles fetching, updating, and restoring language texts.
 *
 * @since 0.7.2
 *
 * @example
 * ```tsx
 * function LanguageTextsPage() {
 *   const {
 *     languageTexts,
 *     isLoading,
 *     fetchLanguageTexts,
 *     updateLanguageTextByName,
 *   } = useLanguageTexts();
 *
 *   useEffect(() => {
 *     fetchLanguageTexts({
 *       baseCultureName: 'en',
 *       targetCultureName: 'tr',
 *       getOnlyEmptyValues: false,
 *     });
 *   }, [fetchLanguageTexts]);
 *
 *   const handleUpdate = async (name: string, value: string) => {
 *     const result = await updateLanguageTextByName({
 *       resourceName: 'MyResource',
 *       cultureName: 'tr',
 *       name,
 *       value,
 *     });
 *     if (result.success) {
 *       // Handle success
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {languageTexts.map(text => (
 *         <div key={text.name}>{text.name}: {text.value}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLanguageTexts(): UseLanguageTextsReturn {
  const restService = useRestService();

  // Service instance (memoized)
  const service = useMemo(() => new LanguageManagementService(restService), [restService]);

  // State
  const [languageTexts, setLanguageTexts] = useState<LanguageManagement.LanguageText[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [resources, setResources] = useState<LanguageManagement.Resource[]>([]);
  const [selectedLanguageText, setSelectedLanguageText] =
    useState<LanguageManagement.LanguageText | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Sorting state
  const [sortKey, setSortKey] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');

  // Store last query params for refresh after updates
  const [lastQueryParams, setLastQueryParams] =
    useState<LanguageManagement.LanguageTextQueryParams | null>(null);

  /**
   * Fetch language texts with filtering
   */
  const fetchLanguageTexts = useCallback(
    async (
      params: LanguageManagement.LanguageTextQueryParams
    ): Promise<LanguageTextOperationResult> => {
      setIsLoading(true);
      setError(null);
      setLastQueryParams(params);

      try {
        const response = await service.getLanguageTexts(params);
        setLanguageTexts(response.items || []);
        setTotalCount(response.totalCount || 0);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch language texts';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Fetch all available resources
   */
  const fetchResources = useCallback(async (): Promise<LanguageTextOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.getResources();
      setResources(response || []);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch resources';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [service]);

  /**
   * Get a language text by name
   */
  const getLanguageTextByName = useCallback(
    async (
      params: LanguageManagement.LanguageTextRequestByNameParams
    ): Promise<LanguageTextOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const languageText = await service.getLanguageTextByName(params);
        setSelectedLanguageText(languageText);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch language text';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Update a language text by name
   */
  const updateLanguageTextByName = useCallback(
    async (
      params: LanguageManagement.LanguageTextUpdateByNameParams
    ): Promise<LanguageTextOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.updateLanguageTextByName(params);
        // Refresh the list after updating if we have stored params
        if (lastQueryParams) {
          await fetchLanguageTexts(lastQueryParams);
        } else {
          setIsLoading(false);
        }
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update language text';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, lastQueryParams, fetchLanguageTexts]
  );

  /**
   * Restore a language text to its default value
   */
  const restoreLanguageTextByName = useCallback(
    async (
      params: LanguageManagement.LanguageTextRequestByNameParams
    ): Promise<LanguageTextOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.restoreLanguageTextByName(params);
        // Refresh the list after restoring if we have stored params
        if (lastQueryParams) {
          await fetchLanguageTexts(lastQueryParams);
        } else {
          setIsLoading(false);
        }
        return { success: true };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to restore language text';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, lastQueryParams, fetchLanguageTexts]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setLanguageTexts([]);
    setTotalCount(0);
    setResources([]);
    setSelectedLanguageText(null);
    setIsLoading(false);
    setError(null);
    setLastQueryParams(null);
  }, []);

  return {
    languageTexts,
    totalCount,
    resources,
    selectedLanguageText,
    isLoading,
    error,
    sortKey,
    sortOrder,
    fetchLanguageTexts,
    fetchResources,
    getLanguageTextByName,
    updateLanguageTextByName,
    restoreLanguageTextByName,
    setSelectedLanguageText,
    setSortKey,
    setSortOrder,
    reset,
  };
}
