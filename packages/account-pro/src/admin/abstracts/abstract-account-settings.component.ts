/**
 * Abstract Account Settings Component (React hook)
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * This is the React equivalent of the Angular AbstractAccountSettingsComponent.
 * It provides a hook that manages settings loading, submission, and tenant awareness.
 *
 * Changes in v4.0.0:
 * - Added SubmitType generic parameter
 * - Added isTenant support via SessionStateService
 * - Added mapTenantSettingsForSubmit for tenant-specific settings mapping
 * - Constructor now takes ConfigStateService and ApplicationConfigurationService
 *
 * @since 3.2.0
 * @since 4.0.0 - Added SubmitType, isTenant, mapTenantSettingsForSubmit
 */
import { useState, useEffect, useCallback } from 'react';
import type { AbstractAccountSettingsService } from './abstract-account-config.service';

export interface UseAccountSettingsOptions<Type, SubmitType = Type> {
  service: AbstractAccountSettingsService<Type, SubmitType>;
  /** Whether the current user is a tenant (not host) */
  isTenant?: boolean;
  /**
   * Map settings for tenant-specific submission.
   * Should be overridden by children if there is a difference between host and tenant.
   * @since 4.0.0
   */
  mapTenantSettingsForSubmit?: (newSettings: Partial<SubmitType>) => Partial<SubmitType>;
}

export interface UseAccountSettingsReturn<Type, SubmitType = Type> {
  /** Current settings value */
  settings: Type | null;
  /** Whether settings are loading */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether the current session is a tenant */
  isTenant: boolean;
  /** Submit new settings */
  submit: (newSettings: Partial<SubmitType>) => Promise<void>;
  /** Reload settings */
  reload: () => Promise<void>;
}

/**
 * Hook for managing abstract account settings.
 * React equivalent of Angular's AbstractAccountSettingsComponent.
 *
 * @since 3.2.0
 * @since 4.0.0 - Added SubmitType, isTenant, mapTenantSettingsForSubmit
 */
export function useAccountSettings<Type, SubmitType = Type>(
  options: UseAccountSettingsOptions<Type, SubmitType>
): UseAccountSettingsReturn<Type, SubmitType> {
  const { service, isTenant = false, mapTenantSettingsForSubmit } = options;
  const [settings, setSettings] = useState<Type | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getSettings();
      setSettings(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load settings';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  const submit = useCallback(
    async (newSettings: Partial<SubmitType>) => {
      setLoading(true);
      setError(null);
      try {
        const settingsToSubmit =
          isTenant && mapTenantSettingsForSubmit
            ? mapTenantSettingsForSubmit(newSettings)
            : newSettings;
        await service.updateSettings(settingsToSubmit);
        // Reload settings after successful update
        await reload();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update settings';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [service, isTenant, mapTenantSettingsForSubmit, reload]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    settings,
    loading,
    error,
    isTenant,
    submit,
    reload,
  };
}
