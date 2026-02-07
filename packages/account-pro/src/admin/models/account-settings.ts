/**
 * Admin account settings model interfaces
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * @since 4.0.0
 */

import { eTwoFactorBehaviour } from '../enums/two-factor-behaviour';

/**
 * Account general settings DTO
 * @since 3.2.0
 */
export interface AccountSettingsDto {
  isSelfRegistrationEnabled: boolean;
  enableLocalLogin: boolean;
}

/**
 * Account LDAP settings DTO
 * @since 3.2.0
 */
export interface AccountLdapSettingsDto {
  enableLdapLogin: boolean;
}

/**
 * Account two-factor settings DTO
 * @since 3.2.0
 */
export interface AccountTwoFactorSettingsDto {
  isTwoFactorEnabled: boolean;
  twoFactorBehaviour: eTwoFactorBehaviour;
  isRememberBrowserEnabled: boolean;
  usersCanChange: boolean;
}

/**
 * Account captcha settings DTO
 * @since 4.0.0
 */
export interface AccountCaptchaSettings {
  useCaptchaOnLogin: boolean;
  useCaptchaOnRegistration: boolean;
  verifyBaseUrl: string;
  siteKey: string;
  siteSecret: string;
  version: number;
}

/**
 * External provider setting for a single provider
 * @since 4.0.0
 */
export interface AccountExternalProviderSetting {
  name: string;
  enabled: boolean;
  properties: {
    name: string;
    value: string;
  }[];
  secretProperties: {
    name: string;
    value: string;
  }[];
  useHostSettings?: boolean;
}

/**
 * External provider settings collection
 * @since 4.0.0
 */
export interface AccountExternalProviderSettings {
  settings: AccountExternalProviderSetting[];
}
