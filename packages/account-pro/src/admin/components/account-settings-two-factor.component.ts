/**
 * Account Settings Two-Factor Component (React hook)
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * Manages two-factor authentication settings for the account admin.
 *
 * @since 3.2.0
 */
import {
  useAccountSettings,
  type UseAccountSettingsReturn,
} from '../abstracts/abstract-account-settings.component';
import { eTwoFactorBehaviour } from '../enums/two-factor-behaviour';
import type { AccountTwoFactorSettingsDto } from '../models/account-settings';
import type { AccountTwoFactorSettingService } from '../services/account-two-factor-settings.service';

export interface UseAccountSettingsTwoFactorOptions {
  service: AccountTwoFactorSettingService;
  isTenant?: boolean;
}

export interface UseAccountSettingsTwoFactorReturn
  extends UseAccountSettingsReturn<AccountTwoFactorSettingsDto> {
  /** The eTwoFactorBehaviour enum for rendering options */
  eTwoFactorBehaviour: typeof eTwoFactorBehaviour;
}

/**
 * Hook for managing two-factor account settings.
 * React equivalent of Angular's AccountSettingsTwoFactorComponent.
 *
 * @since 3.2.0
 */
export function useAccountSettingsTwoFactor(
  options: UseAccountSettingsTwoFactorOptions
): UseAccountSettingsTwoFactorReturn {
  const { service, isTenant = false } = options;

  const baseResult = useAccountSettings<AccountTwoFactorSettingsDto>({
    service,
    isTenant,
  });

  return {
    ...baseResult,
    eTwoFactorBehaviour,
  };
}
