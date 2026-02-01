/**
 * @abpjs/theme-shared
 *
 * ABP Framework Theme Shared components for React.
 * Translated from @abp/ng.theme.shared v2.4.0
 *
 * This package provides shared UI components, services, and utilities
 * for theme/modal management in ABP Framework React applications.
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
