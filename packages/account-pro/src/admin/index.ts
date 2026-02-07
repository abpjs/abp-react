/**
 * Admin module barrel export
 * Translated from @volo/abp.ng.account/admin v4.0.0
 *
 * Note: In Angular, admin is a separate entry point (@volo/abp.ng.account/admin).
 * In our React package, we selectively export to avoid naming collisions with
 * existing types (eTwoFactorBehaviour, AccountTwoFactorSettingsDto) that are already
 * exported from config/enums and models.
 *
 * @since 3.2.0
 * @since 4.0.0 - Added captcha and external provider services/components
 */
export * from './abstracts';
export * from './components';

// Only export new v4.0.0 model types that don't collide with existing exports
export type {
  AccountSettingsDto,
  AccountLdapSettingsDto,
  AccountCaptchaSettings,
  AccountExternalProviderSetting,
  AccountExternalProviderSettings,
} from './models';

// Only export new v4.0.0 services that don't collide with existing exports
export {
  AccountSettingsService,
  AccountLdapService,
  AccountTwoFactorSettingService,
  AccountCaptchaService,
  AccountExternalProviderService,
} from './services';
