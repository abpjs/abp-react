import { useState, useCallback, useMemo } from 'react';
import { useRestService } from '@abpjs/core';
import type { FeatureDto, FeatureGroupDto } from '../models';
import { FeaturesService } from '../services';

/**
 * Result from feature management operations
 */
export interface FeatureManagementResult {
  success: boolean;
  error?: string;
}

/**
 * Return type for useFeatureManagement hook
 */
export interface UseFeatureManagementReturn {
  /** Current feature groups */
  groups: FeatureGroupDto[];
  /** All features (flattened from groups) */
  features: FeatureDto[];
  /** Feature values for form (modifiable) */
  featureValues: Record<string, string>;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Fetch features for a provider */
  fetchFeatures: (
    providerKey: string,
    providerName: string
  ) => Promise<FeatureManagementResult>;
  /** Update features on the server */
  saveFeatures: (
    providerKey: string,
    providerName: string
  ) => Promise<FeatureManagementResult>;
  /** Update a feature value locally */
  updateFeatureValue: (featureName: string, value: string) => void;
  /** Get feature value (from form state) */
  getFeatureValue: (featureName: string) => string;
  /** Check if a toggle feature is enabled */
  isFeatureEnabled: (featureName: string) => boolean;
  /** Reset state */
  reset: () => void;
}

/**
 * Hook for managing features
 *
 * This hook provides all the state and actions needed for the feature
 * management modal. It handles fetching, modifying, and saving features.
 *
 * In v4.0.0, this hook was migrated from the deprecated FeatureManagementService
 * to the new FeaturesService proxy, and from legacy flat Feature[] to grouped
 * FeatureGroupDto[]/FeatureDto[] response format.
 *
 * @example
 * ```tsx
 * function FeatureModal({ providerKey, providerName }) {
 *   const {
 *     features,
 *     groups,
 *     isLoading,
 *     fetchFeatures,
 *     saveFeatures,
 *     updateFeatureValue,
 *   } = useFeatureManagement();
 *
 *   useEffect(() => {
 *     fetchFeatures(providerKey, providerName);
 *   }, [providerKey, providerName]);
 *
 *   return (
 *     // ... modal UI
 *   );
 * }
 * ```
 */
export function useFeatureManagement(): UseFeatureManagementReturn {
  const restService = useRestService();

  // Service instance (memoized) - v4.0.0: uses FeaturesService instead of deprecated FeatureManagementService
  const service = useMemo(() => new FeaturesService(restService), [restService]);

  // State
  const [groups, setGroups] = useState<FeatureGroupDto[]>([]);
  const [features, setFeatures] = useState<FeatureDto[]>([]);
  const [featureValues, setFeatureValues] = useState<Record<string, string>>({});
  const [originalValues, setOriginalValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get feature value from form state
   */
  const getFeatureValue = useCallback(
    (featureName: string): string => {
      return featureValues[featureName] ?? '';
    },
    [featureValues]
  );

  /**
   * Check if a toggle feature is enabled
   */
  const isFeatureEnabled = useCallback(
    (featureName: string): boolean => {
      const value = featureValues[featureName];
      return value === 'true' || value === 'True';
    },
    [featureValues]
  );

  /**
   * Fetch features from the server
   */
  const fetchFeatures = useCallback(
    async (providerKey: string, providerName: string): Promise<FeatureManagementResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await service.get(providerName, providerKey);

        setGroups(response.groups);

        // Flatten features from groups
        const allFeatures = response.groups.flatMap((group) => group.features);
        setFeatures(allFeatures);

        // Build feature values map for form state
        const values: Record<string, string> = {};
        allFeatures.forEach((feature) => {
          values[feature.name] = feature.value;
        });
        setFeatureValues(values);
        setOriginalValues(values);

        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch features';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service]
  );

  /**
   * Save changed features to the server
   */
  const saveFeatures = useCallback(
    async (providerKey: string, providerName: string): Promise<FeatureManagementResult> => {
      // Build features array with current values
      const updatedFeatures = features.map((feature) => ({
        name: feature.name,
        value: featureValues[feature.name] ?? feature.value,
      }));

      // Check if anything changed
      const hasChanges = features.some(
        (feature) => featureValues[feature.name] !== originalValues[feature.name]
      );

      // If nothing changed, just return success
      if (!hasChanges) {
        return { success: true };
      }

      setIsLoading(true);
      setError(null);

      try {
        await service.update(providerName, providerKey, {
          features: updatedFeatures,
        });

        // Update original values to match current
        setOriginalValues({ ...featureValues });

        setIsLoading(false);
        return { success: true };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update features';
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [service, features, featureValues, originalValues]
  );

  /**
   * Update a feature value locally (for form state)
   */
  const updateFeatureValue = useCallback((featureName: string, value: string) => {
    setFeatureValues((prev) => ({
      ...prev,
      [featureName]: value,
    }));
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setGroups([]);
    setFeatures([]);
    setFeatureValues({});
    setOriginalValues({});
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    groups,
    features,
    featureValues,
    isLoading,
    error,
    fetchFeatures,
    saveFeatures,
    updateFeatureValue,
    getFeatureValue,
    isFeatureEnabled,
    reset,
  };
}
