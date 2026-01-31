import { useSetting } from '@abpjs/core';

/**
 * ABP setting key for self-registration
 */
const SELF_REGISTRATION_SETTING = 'Abp.Account.IsSelfRegistrationEnabled';

/**
 * Hook to check if self-registration is enabled.
 *
 * This reads the `Abp.Account.IsSelfRegistrationEnabled` setting from the
 * ABP application configuration.
 *
 * @since 2.0.0
 *
 * @returns true if self-registration is enabled, false otherwise
 *
 * @example
 * ```tsx
 * function RegisterLink() {
 *   const isSelfRegistrationEnabled = useSelfRegistrationEnabled();
 *
 *   if (!isSelfRegistrationEnabled) {
 *     return null;
 *   }
 *
 *   return <Link to="/account/register">Register</Link>;
 * }
 * ```
 */
export function useSelfRegistrationEnabled(): boolean {
  const setting = useSetting(SELF_REGISTRATION_SETTING);

  // Default to true if setting is not configured (matches ABP default behavior)
  if (setting === undefined || setting === null) {
    return true;
  }

  // Setting is stored as string 'true' or 'false'
  return setting.toLowerCase() === 'true';
}
