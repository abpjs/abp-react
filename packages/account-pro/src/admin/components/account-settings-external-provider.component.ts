/**
 * Account Settings External Provider Component (React hook)
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * Manages external provider settings for the account admin.
 * Extends the abstract account settings with tenant-specific mapping.
 *
 * @since 4.0.0
 */
import { useState, useEffect, useCallback } from 'react';
import type {
  AccountExternalProviderSettings,
  AccountExternalProviderSetting,
} from '../models/account-settings';
import type { AccountExternalProviderService } from '../services/account-external-provider.service';

export interface UseAccountSettingsExternalProviderOptions {
  service: AccountExternalProviderService;
  isTenant?: boolean;
}

export interface UseAccountSettingsExternalProviderReturn {
  /** Current settings value */
  settings: AccountExternalProviderSettings | null;
  /** Whether settings are loading */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Whether the current session is a tenant */
  isTenant: boolean;
  /** Submit updated provider settings */
  submit: (newSettings: AccountExternalProviderSetting[]) => Promise<void>;
  /** Reload settings */
  reload: () => Promise<void>;
}

/**
 * Hook for managing external provider account settings.
 * React equivalent of Angular's AccountSettingsExternalProviderComponent.
 *
 * Uses AccountExternalProviderSettings as the read type and
 * AccountExternalProviderSetting[] as the submit type.
 *
 * Overrides mapTenantSettingsForSubmit to filter and clear property values
 * for providers that use host settings.
 *
 * @since 4.0.0
 */
export function useAccountSettingsExternalProvider(
  options: UseAccountSettingsExternalProviderOptions
): UseAccountSettingsExternalProviderReturn {
  const { service, isTenant = false } = options;
  const [settings, setSettings] = useState<AccountExternalProviderSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapInitialTenantSettings = useCallback(
    (result: AccountExternalProviderSettings): AccountExternalProviderSettings => ({
      settings: result.settings.map((setting) => ({
        ...setting,
        useHostSettings: setting.useHostSettings ?? true,
      })),
    }),
    []
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getSettings();
      setSettings(isTenant ? mapInitialTenantSettings(result) : result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load settings';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [service, isTenant, mapInitialTenantSettings]);

  const mapTenantSettingsForSubmit = useCallback(
    (newSettings: AccountExternalProviderSetting[]): AccountExternalProviderSetting[] => {
      return newSettings.map((setting) => {
        if (setting.useHostSettings) {
          // Clear property values when using host settings
          return {
            name: setting.name,
            enabled: setting.enabled,
            properties: setting.properties.map((p) => ({ name: p.name, value: '' })),
            secretProperties: setting.secretProperties.map((p) => ({ name: p.name, value: '' })),
          };
        }
        return {
          name: setting.name,
          enabled: setting.enabled,
          properties: setting.properties,
          secretProperties: setting.secretProperties,
        };
      });
    },
    []
  );

  const submit = useCallback(
    async (newSettings: AccountExternalProviderSetting[]) => {
      setLoading(true);
      setError(null);
      try {
        const settingsToSubmit = isTenant
          ? mapTenantSettingsForSubmit(newSettings)
          : newSettings;
        // The service accepts Partial<AccountExternalProviderSettings> for updateSettings,
        // so we wrap the array in the settings object
        await service.updateSettings({ settings: settingsToSubmit });
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
