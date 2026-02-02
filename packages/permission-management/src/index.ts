/**
 * @abpjs/permission-management
 * ABP Framework Permission Management module for React
 * Translated from @abp/ng.permission-management v2.7.0
 *
 * Changes in v2.7.0:
 * - Added ePermissionManagementComponents enum for component replacement keys
 *
 * Changes in v2.4.0:
 * - Added apiName property to PermissionManagementService
 * - Dependency updates to @abp/ng.theme.shared v2.4.0
 *
 * Changes in v2.2.0:
 * - Dependency updates to @abp/ng.theme.shared v2.2.0
 * - No functional code changes
 *
 * Changes in v1.1.0:
 * - Added hideBadges prop to PermissionManagementModal
 * - Added isGrantedByOtherProviderName method (replaces isGrantedByRole)
 * - Added PermissionManagementStateService
 * - Fixed typo: getEntitiyDisplayName -> getEntityDisplayName
 *
 * Changes in v2.0.0:
 * - Added PermissionManagementComponentInputs interface
 * - Added PermissionManagementComponentOutputs interface
 * - Added dispatchGetPermissions() to PermissionManagementStateService
 * - Added dispatchUpdatePermissions() to PermissionManagementStateService
 * - openModal() now returns Observable<Response> (in Angular)
 *
 * Changes in v2.1.0:
 * - Version bump only (dependency updates to @abp/ng.theme.shared v2.1.0)
 */

// Enums (v2.7.0)
export * from './enums';

// Models
export * from './models';

// Services
export * from './services';

// Hooks
export * from './hooks';

// Components
export * from './components';
