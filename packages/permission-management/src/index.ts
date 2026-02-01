/**
 * @abpjs/permission-management
 * ABP Framework Permission Management module for React
 * Translated from @abp/ng.permission-management v2.1.0
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

// Models
export * from './models';

// Services
export * from './services';

// Hooks
export * from './hooks';

// Components
export * from './components';
