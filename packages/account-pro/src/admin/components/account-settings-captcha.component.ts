/**
 * Account Settings Captcha Component (React hook)
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * Manages captcha settings for the account admin.
 * Extends the abstract account settings with tenant-specific mapping.
 *
 * @since 4.0.0
 */
import { useCallback } from 'react';
import {
  useAccountSettings,
  type UseAccountSettingsReturn,
} from '../abstracts/abstract-account-settings.component';
import type { AccountCaptchaSettings } from '../models/account-settings';
import type { AccountCaptchaService } from '../services/account-captcha.service';

export interface UseAccountSettingsCaptchaOptions {
  service: AccountCaptchaService;
  isTenant?: boolean;
}

/**
 * Hook for managing captcha account settings.
 * React equivalent of Angular's AccountSettingsCaptchaComponent.
 *
 * Overrides mapTenantSettingsForSubmit to only submit version, siteKey, and siteSecret
 * when in tenant context.
 *
 * @since 4.0.0
 */
export function useAccountSettingsCaptcha(
  options: UseAccountSettingsCaptchaOptions
): UseAccountSettingsReturn<AccountCaptchaSettings> {
  const { service, isTenant = false } = options;

  const mapTenantSettingsForSubmit = useCallback(
    (newSettings: Partial<AccountCaptchaSettings>): Partial<AccountCaptchaSettings> => {
      return {
        version: newSettings.version,
        siteKey: newSettings.siteKey,
        siteSecret: newSettings.siteSecret,
      };
    },
    []
  );

  return useAccountSettings<AccountCaptchaSettings>({
    service,
    isTenant,
    mapTenantSettingsForSubmit: isTenant ? mapTenantSettingsForSubmit : undefined,
  });
}
