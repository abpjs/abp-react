/**
 * @abpjs/theme-shared
 *
 * ABP Framework Theme Shared components for React.
 * Translated from @abp/ng.theme.shared v4.0.0
 *
 * This package provides shared UI components, services, and utilities
 * for theme/modal management in ABP Framework React applications.
 *
 * Changes in v4.0.0:
 * - Toaster.Toast now uses LocalizationParam instead of Config.LocalizationParam
 * - Added Toaster.ToasterId type (string | number)
 * - Added Toaster.Service interface (contract for toaster implementations)
 * - Added ToasterContract type (Strict<ToasterService, Toaster.Service>)
 * - Confirmation.Options: cancelText/yesText now use LocalizationParam
 * - ConfirmationService/ToasterService: parameters use LocalizationParam
 * - ToasterService methods now return Toaster.ToasterId
 * - ToasterService.clear parameter renamed from key to containerKey
 * - Added SUPPRESS_UNSAVED_CHANGES_WARNING token and context
 * - Added suppressUnsavedChangesWarning prop to Modal component
 * - Enhanced form validation styles with error icon SVG
 * - Added typeahead dropdown styles
 * - Dependency updates to @abp/ng.core v4.0.0
 *
 * Changes in v3.2.0:
 * - Added .datatable-scroll CSS styles for ngx-datatable horizontal scroll fix
 * - Dependency updates to @abp/ng.core v3.2.0
 *
 * Changes in v3.0.0:
 * - Added NavItemsService (replaces nav-items utility functions)
 * - Added NavItem.id property (required unique identifier)
 * - Changed NavItem.permission to NavItem.requiredPolicy
 * - Added eThemeSharedRouteNames enum for route names
 * - Added THEME_SHARED_ROUTE_PROVIDERS and configureRoutes
 * - Added initializeThemeSharedRoutes for easy route setup
 * - Removed Toaster.Status enum (use Confirmation.Status instead)
 * - Removed Confirmation.Options.closable (use dismissible instead)
 * - Removed setting-management model (use @abpjs/core SettingTabsService)
 * - Removed nav-items utils (use NavItemsService)
 * - Dependency updates to @abp/ng.core v3.0.0
 *
 * Changes in v2.9.0:
 * - Added LocaleDirection type for RTL/LTR support
 * - Added LazyStyleHandler for RTL/LTR style switching
 * - Added NavItem interface and functions (addNavItem, getNavItems, etc.)
 * - Added LAZY_STYLES token and LazyStylesContext
 * - Added BOOTSTRAP constant for bootstrap CSS pattern
 * - Confirmation.Options: Added dismissible property, deprecated closable
 * - Updated styles with RTL support for data-tables-filter
 * - Dependency updates to @abp/ng.core v2.9.0
 *
 * Changes in v2.7.0:
 * - Added ModalService with renderTemplate, clearModal, getContainer, detectChanges
 * - HttpErrorConfig: Added skipHandledErrorCodes, simplified forWhichErrors to array
 * - HttpErrorWrapperComponent: Added isHomeShow property
 * - Added validation-utils with getPasswordValidators function
 * - Added tokens exports (HTTP_ERROR_CONFIG, httpErrorConfigFactory)
 * - Dependency updates to @abp/ng.core v2.7.0
 *
 * Changes in v2.4.0:
 * - Added THEME_SHARED_APPEND_CONTENT token for content appending
 * - Updated Toaster.Status deprecation notice (removal now in v3.0 instead of v2.2)
 * - Dependency updates to @abp/ng.core v2.4.0
 * - appendScript function deprecated (to be deleted in v2.6)
 *
 * Changes in v2.2.0:
 * - Dependency updates to @abp/ng.core v2.2.0
 * - Dependency updates to @fortawesome/fontawesome-free v5.12.1
 * - Dependency updates to @ng-bootstrap/ng-bootstrap v5.3.0
 * - Dependency updates to bootstrap v4.4.1, chart.js v2.9.3
 * - Removed unused Angular-specific dependencies (primeng, primeicons, font-awesome, @angular/cdk)
 * - No functional code changes
 *
 * Changes in v2.1.0:
 * - Dependency updates only (no functional changes)
 *
 * New in v2.0.0:
 * - ToasterService: Methods now return number (toast ID) instead of Promise<Status>
 * - ToasterService: Added subscribe() method for observable pattern
 * - ToasterService: Removed addAll method (use show directly)
 * - Toaster.Options renamed to Toaster.ToastOptions
 * - New Toaster.Toast interface
 * - Toaster.Severity: Changed 'warn' to 'warning', added 'neutral'
 * - Confirmation.Options: No longer extends Toaster.Options
 * - Confirmation: Added DialogData interface and Severity type
 * - Confirmation.Options: Removed deprecated cancelCopy/yesCopy
 * - ConfirmationService: Added show(), listenToEscape(), subscribe() methods
 * - Updated styles with sorting icon classes
 *
 * New in v1.1.0:
 * - ToasterService now accepts Config.LocalizationParam for message and title
 * - Confirmation.Options: Added cancelText/yesText (deprecated cancelCopy/yesCopy)
 * - New HttpErrorConfig types for custom error screen configuration
 * - LoaderBar: Added intervalPeriod and stopDelay props
 *
 * New in v0.9.0:
 * - ChangePassword component (moved from theme-basic)
 * - Profile component (moved from theme-basic)
 * - Modal busy prop for preventing close during operations
 * - Modal height/minHeight props
 * - Modal onInit callback
 */

// Models
export * from './models';

// Constants
export * from './constants';

// Tokens
export * from './tokens';

// Contexts (Services)
export * from './contexts';

// Hooks
export * from './hooks';

// Components
export * from './components';

// Providers
export * from './providers';

// Handlers
export * from './handlers';

// Utils
export * from './utils';

// Theme
export * from './theme';

// Enums (new in v3.0.0)
export * from './enums';

// Services (new in v3.0.0)
export * from './services';
