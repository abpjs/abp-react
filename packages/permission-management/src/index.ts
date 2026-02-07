/**
 * @abpjs/permission-management
 * ABP Framework Permission Management module for React
 * Translated from @abp/ng.permission-management v3.2.0
 *
 * Changes in v3.2.0:
 * - New proxy service: PermissionsService with typed methods (get, update)
 * - New proxy models: GetPermissionListResultDto, PermissionGrantInfoDto, PermissionGroupDto,
 *   ProviderInfoDto, UpdatePermissionDto, UpdatePermissionsDto
 * - Added PermissionWithStyle interface (replaces PermissionWithMargin internally)
 * - Deprecated legacy types (to be deleted in v4.0):
 *   - PermissionManagement.Response -> use GetPermissionListResultDto
 *   - PermissionManagement.Group -> use PermissionGroupDto
 *   - PermissionManagement.MinimumPermission -> use UpdatePermissionDto
 *   - PermissionManagement.Permission -> use PermissionGrantInfoDto
 *   - PermissionManagement.UpdateRequest -> use UpdatePermissionsDto
 *   - PermissionWithMargin -> use PermissionWithStyle
 *
 * Changes in v3.1.0:
 * - Added shouldFetchAppConfig(providerKey, providerName) method to usePermissionManagement hook
 *   Returns true if the app configuration should be refreshed after saving permissions
 *   (when modifying current user's permissions or a role the current user belongs to)
 *
 * Changes in v3.0.0:
 * - Added getAssignedCount(groupName: string) method to usePermissionManagement hook
 * - Internal: visible property changed to getter/setter (Angular-specific, no React impact)
 * - Internal: selectedGroupPermissions$ changed to getter (Angular-specific, no React impact)
 *
 * Changes in v2.9.0:
 * - Version bump only (dependency updates to @abp/ng.theme.shared v2.9.0)
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

// Proxy (v3.2.0)
export * from './proxy';
