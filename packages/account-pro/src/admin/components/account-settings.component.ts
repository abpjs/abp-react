/**
 * Account Settings Component (React hook)
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * Main account settings component that coordinates all sub-settings
 * (general, LDAP, 2FA, captcha, external providers).
 *
 * Changes in v4.0.0:
 * - Added SessionStateService for tenant detection
 * - Added AccountCaptchaService and AccountExternalProviderService
 * - Added isExternalProviderEnabled and isCaptchaEnabled flags
 * - Added isTenant property
 *
 * @since 3.2.0
 * @since 4.0.0 - Added captcha, external provider, and tenant support
 */
import { useState, useEffect, useCallback } from 'react';

export interface UseAccountSettingsComponentOptions {
  /** Whether LDAP settings feature is enabled */
  isLdapSettingsEnabled?: boolean;
  /** Whether two-factor settings feature is enabled */
  isTwoFactorSettingsEnabled?: boolean;
  /** Whether external provider settings feature is enabled @since 4.0.0 */
  isExternalProviderEnabled?: boolean;
  /** Whether captcha settings feature is enabled @since 4.0.0 */
  isCaptchaEnabled?: boolean;
  /** Whether the current session is a tenant @since 4.0.0 */
  isTenant?: boolean;
}

export interface UseAccountSettingsComponentReturn {
  /** Whether LDAP settings feature is enabled */
  isLdapSettingsEnabled: boolean;
  /** Whether two-factor settings feature is enabled */
  isTwoFactorSettingsEnabled: boolean;
  /** Whether external provider settings feature is enabled @since 4.0.0 */
  isExternalProviderEnabled: boolean;
  /** Whether captcha settings feature is enabled @since 4.0.0 */
  isCaptchaEnabled: boolean;
  /** Whether the current session is a tenant @since 4.0.0 */
  isTenant: boolean;
  /** Initialize the component (fetches feature flags) */
  initialize: () => void;
}

/**
 * Hook for the main account settings component.
 * React equivalent of Angular's AccountSettingsComponent.
 *
 * @since 3.2.0
 * @since 4.0.0 - Added captcha, external provider, and tenant support
 */
export function useAccountSettingsComponent(
  options: UseAccountSettingsComponentOptions = {}
): UseAccountSettingsComponentReturn {
  const [isLdapSettingsEnabled, setIsLdapSettingsEnabled] = useState(
    options.isLdapSettingsEnabled ?? false
  );
  const [isTwoFactorSettingsEnabled, setIsTwoFactorSettingsEnabled] = useState(
    options.isTwoFactorSettingsEnabled ?? false
  );
  const [isExternalProviderEnabled, setIsExternalProviderEnabled] = useState(
    options.isExternalProviderEnabled ?? false
  );
  const [isCaptchaEnabled, setIsCaptchaEnabled] = useState(options.isCaptchaEnabled ?? false);
  const [isTenant] = useState(options.isTenant ?? false);

  const initialize = useCallback(() => {
    // In Angular, these are determined by checking feature/setting flags
    // via ConfigStateService. In React, they are passed as options or
    // could be derived from the app configuration context.
    setIsLdapSettingsEnabled(options.isLdapSettingsEnabled ?? false);
    setIsTwoFactorSettingsEnabled(options.isTwoFactorSettingsEnabled ?? false);
    setIsExternalProviderEnabled(options.isExternalProviderEnabled ?? false);
    setIsCaptchaEnabled(options.isCaptchaEnabled ?? false);
  }, [
    options.isLdapSettingsEnabled,
    options.isTwoFactorSettingsEnabled,
    options.isExternalProviderEnabled,
    options.isCaptchaEnabled,
  ]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    isLdapSettingsEnabled,
    isTwoFactorSettingsEnabled,
    isExternalProviderEnabled,
    isCaptchaEnabled,
    isTenant,
    initialize,
  };
}
