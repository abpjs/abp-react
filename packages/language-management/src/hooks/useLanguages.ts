import { useState, useCallback, useMemo } from 'react';
import { useRestService, ABP } from '@abpjs/core';
import { LanguageManagement } from '../models';
import { LanguageManagementService } from '../services';

/**
 * Sort order type for language lists
 */
export type SortOrder = '' | 'asc' | 'desc';

/**
 * Result from language operations
 * @since 0.7.2
 */
export interface LanguageOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Return type for useLanguages hook
 * @since 0.7.2
 */
export interface UseLanguagesReturn {
  /** List of languages */
  languages: LanguageManagement.Language[];
  /** Total count of languages */
  totalCount: number;
  /** Available cultures for creating languages */
  cultures: LanguageManagement.Culture[];
  /** Currently selected language for editing */
  selectedLanguage: LanguageManagement.Language | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current sort key */
  sortKey: string;
  /** Current sort order */
  sortOrder: SortOrder;
  /** Fetch all languages with optional pagination/filtering */
  fetchLanguages: (params?: ABP.PageQueryParams) => Promise<LanguageOperationResult>;
  /** Fetch all available cultures */
  fetchCultures: () => Promise<LanguageOperationResult>;
  /** Get a language by ID and set it as selected */
  getLanguageById: (id: string) => Promise<LanguageOperationResult>;
  /** Create a new language */
  createLanguage: (
    language: LanguageManagement.CreateLanguageInput
  ) => Promise<LanguageOperationResult>;
  /** Update an existing language */
  updateLanguage: (
    id: string,
    language: LanguageManagement.UpdateLanguageInput
  ) => Promise<LanguageOperationResult>;
  /** Delete a language */
  deleteLanguage: (id: string) => Promise<LanguageOperationResult>;
  /** Set a language as default */
  setAsDefaultLanguage: (id: string) => Promise<LanguageOperationResult>;
  /** Set the selected language */
  setSelectedLanguage: (language: LanguageManagement.Language | null) => void;
  /** Set sort key */
  setSortKey: (key: string) => void;
  /** Set sort order */
  setSortOrder: (order: SortOrder) => void;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook for managing languages
 *
 * This hook provides all the state and actions needed for language management.
 * It handles fetching, creating, updating, and deleting languages.
 *
 * @since 0.7.2
 *
 * @example
 * ```tsx
 * function LanguagesPage() {
 *   const {
 *     languages,
 *     isLoading,
 *     fetchLanguages,
 *     createLanguage,
 *     deleteLanguage,
 *   } = useLanguages();
 *
 *   useEffect(() => {
 *     fetchLanguages();
 *   }, [fetchLanguages]);
 *
 *   const handleCreate = async (data: LanguageManagement.CreateLanguageInput) => {
 *     const result = await createLanguage(data);
 *     if (result.success) {
 *       // Handle success
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {languages.map(lang => (
 *         <div key={lang.id}>{lang.displayName}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLanguages(): UseLanguagesReturn {
  const restService = useRestService();

  // Service instance (memoized)
  const service = useMemo(() => new LanguageManagementService(restService), [restService]);

  // State
  const [languages, setLanguages] = useState<LanguageManagement.Language[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [cultures, setCultures] = useState<LanguageManagement.Culture[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageManagement.Language | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Sorting state
  const [sortKey, setSortKey] = useState<string>('displayName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('');

  /**
   * Fetch all languages with optional pagination/filtering
   */
  const fetchLanguages = useCallback(
    async (params?: ABP.PageQueryParams): Promise<LanguageOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.getLanguages(params);
        setLanguages(response.items || []);
        setTotalCount(response.totalCount || 0);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch languages';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Fetch all available cultures
   */
  const fetchCultures = useCallback(async (): Promise<LanguageOperationResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.getCultures();
      setCultures(response || []);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cultures';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [service]);

  /**
   * Get a language by ID and set it as selected
   */
  const getLanguageById = useCallback(
    async (id: string): Promise<LanguageOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const language = await service.getLanguageById(id);
        setSelectedLanguage(language);
        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch language';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Create a new language
   */
  const createLanguage = useCallback(
    async (language: LanguageManagement.CreateLanguageInput): Promise<LanguageOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.createLanguage(language);
        // Refresh the list after creating
        await fetchLanguages();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create language';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchLanguages]
  );

  /**
   * Update an existing language
   */
  const updateLanguage = useCallback(
    async (
      id: string,
      language: LanguageManagement.UpdateLanguageInput
    ): Promise<LanguageOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.updateLanguage(id, language);
        // Refresh the list after updating
        await fetchLanguages();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update language';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchLanguages]
  );

  /**
   * Delete a language
   */
  const deleteLanguage = useCallback(
    async (id: string): Promise<LanguageOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.deleteLanguage(id);
        // Refresh the list after deleting
        await fetchLanguages();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete language';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchLanguages]
  );

  /**
   * Set a language as the default language
   */
  const setAsDefaultLanguage = useCallback(
    async (id: string): Promise<LanguageOperationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        await service.setAsDefaultLanguage(id);
        // Refresh the list after setting default
        await fetchLanguages();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to set language as default';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, fetchLanguages]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setLanguages([]);
    setTotalCount(0);
    setCultures([]);
    setSelectedLanguage(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    languages,
    totalCount,
    cultures,
    selectedLanguage,
    isLoading,
    error,
    sortKey,
    sortOrder,
    fetchLanguages,
    fetchCultures,
    getLanguageById,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    setAsDefaultLanguage,
    setSelectedLanguage,
    setSortKey,
    setSortOrder,
    reset,
  };
}
