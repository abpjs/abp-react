/**
 * @abpjs/account-pro
 * ABP Framework Account Pro module for React
 * Translated from @volo/abp.ng.account v4.0.0
 *
 * Changes in v4.0.0:
 * - Added admin module with abstracts, services, components, models, enums
 * - Added AbstractAccountSettingsService<Type, SubmitType> (second generic for submit type)
 * - Added useAccountSettings hook (React equivalent of AbstractAccountSettingsComponent)
 * - Added AccountCaptchaSettings, AccountExternalProviderSetting, AccountExternalProviderSettings interfaces
 * - Added AccountCaptchaService for captcha settings management
 * - Added AccountExternalProviderService for external provider settings management
 * - Added useAccountSettingsCaptcha hook with tenant-aware settings mapping
 * - Added useAccountSettingsExternalProvider hook with tenant-aware settings mapping
 * - Added useAccountSettingsComponent hook with captcha/external provider/tenant support
 * - Removed eAccountManageProfileTabNames from config/enums (deprecated)
 * - Removed eAccountRouteNames from config/enums (deprecated)
 * - Removed route.provider from config/providers (deprecated)
 * - Removed ManageProfileTabsService from config/services (deprecated)
 * - Deprecated eAccountComponents, eAccountRouteNames from lib/enums (Angular public-api now exports {})
 *
 * Changes in v3.2.0:
 * - Added ProfilePicture component key to eAccountComponents
 * - Added eAccountManageProfileTabNames enum for manage profile tab names
 * - Added ProfilePictureType enum (None, Gravatar, Image)
 * - Added eTwoFactorBehaviour enum (Optional, Disabled, Forced)
 * - Added ProfilePictureInput interface for setting profile pictures
 * - Added ProfilePictureSourceDto interface for profile picture data
 * - Added AccountTwoFactorSettingsDto interface for 2FA settings
 * - Added ProfileService for profile picture and two-factor operations
 * - Added ManageProfileTabsService for managing profile tabs
 * - Added getManageProfileTabsService() singleton accessor
 * - Added ACCOUNT_MANAGE_PROFILE_TAB_PROVIDERS constants
 * - Added ACCOUNT_MANAGE_PROFILE_TAB_ORDERS constants
 * - Added ACCOUNT_MANAGE_PROFILE_TAB_NAMES constants
 *
 * Changes in v3.1.0:
 * - Added EmailConfirmation route name to eAccountRouteNames
 * - Added MySecurityLogs route name to eAccountRouteNames
 * - Added EmailConfirmation component key to eAccountComponents
 * - Added MySecurityLogs component key to eAccountComponents
 * - Added AccountSettings interface for general configuration
 * - Added AccountLdapSettings interface for LDAP authentication configuration
 * - Added EmailConfirmationInput interface for email confirmation flow
 * - Added sendEmailConfirmationToken() method to AccountProService
 * - Added confirmEmail() method to AccountProService
 * - Added getMySecurityLogs() method to AccountProService for security logs
 *
 * Changes in v3.0.0:
 * - Added config subpackage with enums and providers
 * - Added eAccountRouteNames and eAccountSettingTabNames to config/enums
 * - Added ACCOUNT_ROUTE_PROVIDERS, configureRoutes, initializeAccountRoutes
 * - Added ACCOUNT_SETTING_TAB_PROVIDERS, configureSettingTabs, initializeAccountSettingTabs
 * - Added AccountConfigOptions interface with redirectUrl
 * - Added ACCOUNT_OPTIONS token and accountOptionsFactory utility
 *
 * Changes in v2.9.0:
 * - Added Logo component key to eAccountComponents enum
 * - Added LogoComponent for displaying application logo on account pages
 * - LoginComponent: isSelfRegistrationEnabled is now derived from settings (observable pattern)
 * - AccountComponent: Added logoKey property for Logo component replacement
 *
 * Changes in v2.7.0:
 * - Added eAccountComponents enum for component replacement keys
 * - Added eAccountRouteNames enum for route name keys
 *
 * Changes in v2.4.0:
 * - Added apiName property to AccountProService (defaults to 'default')
 * - Added sendPhoneNumberConfirmationToken() method to AccountProService
 * - Added confirmPhoneNumber(token: string) method to AccountProService
 * - Added phoneNumberConfirmed field to ProfileResponse type
 * - Services are now exported from public API (already done in React)
 * - Dependency updates to @abp/ng.theme.shared ~2.4.0, @volo/abp.commercial.ng.ui ^2.4.0
 *
 * Changes in v2.2.0:
 * - Version bump only (dependency updates to @abp/ng.theme.shared v2.2.0)
 *
 * Changes in v2.1.1:
 * - Version bump only (dependency updates to @abp/ng.theme.shared v2.1.0)
 */

// Admin module (v4.0.0)
export * from './admin';

// Config (v3.0.0)
export * from './config';

// Enums (v2.7.0) - deprecated in v4.0.0 (Angular lib/enums removed from public-api)
export * from './enums';

// Models
export * from './models';

// Services
export * from './services';

// Routes
export * from './routes';

// Providers
export * from './providers';

// Hooks
export * from './hooks';

// Components
export * from './components';

// Tokens (v3.0.0)
export * from './tokens';

// Utils (v3.0.0)
export * from './utils';
