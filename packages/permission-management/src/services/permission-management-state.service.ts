/**
 * PermissionManagementStateService
 *
 * A service for accessing permission management state.
 * This is the React equivalent of Angular's PermissionManagementStateService.
 *
 * In Angular, this uses NGXS store selectors. In React, we provide
 * a simpler approach using the usePermissionManagement hook.
 *
 * @since 1.1.0
 *
 * Changes in v4.0.0:
 * - Migrated from PermissionManagementService to PermissionsService (proxy)
 * - Uses proxy DTOs (PermissionGroupDto, ProviderInfoDto, etc.) instead of legacy types
 * - getPermissionGroups() now returns PermissionGroupDto[] instead of PermissionManagement.Group[]
 * - dispatchGetPermissions() now accepts ProviderInfoDto and returns GetPermissionListResultDto
 * - dispatchUpdatePermissions() now accepts ProviderInfoDto & UpdatePermissionsDto
 *
 * Changes in v2.0.0:
 * - Added dispatchGetPermissions() method
 * - Added dispatchUpdatePermissions() method
 *
 * @example
 * ```tsx
 * // In React, prefer using the usePermissionManagement hook directly:
 * import { usePermissionManagement } from '@abpjs/permission-management';
 *
 * function MyComponent() {
 *   const { groups, entityDisplayName } = usePermissionManagement();
 *   // Use groups and entityDisplayName as needed
 * }
 *
 * // Or use the state service for programmatic access:
 * import { PermissionManagementStateService, PermissionsService } from '@abpjs/permission-management';
 * import { RestService } from '@abpjs/core';
 *
 * const rest = new RestService();
 * const service = new PermissionsService(rest);
 * const stateService = new PermissionManagementStateService(service);
 *
 * // Fetch permissions
 * await stateService.dispatchGetPermissions({ providerKey: 'role-id', providerName: 'R' });
 * const groups = stateService.getPermissionGroups();
 * ```
 */

import type { PermissionGroupDto, GetPermissionListResultDto, ProviderInfoDto, UpdatePermissionsDto } from '../proxy/models';
import { PermissionsService } from '../proxy/permissions.service';

/**
 * State service for permission management
 *
 * Note: In React, this is primarily for API compatibility with Angular.
 * The preferred approach is to use the usePermissionManagement hook directly.
 *
 * @updated 4.0.0 - Migrated from PermissionManagementService to PermissionsService
 */
export class PermissionManagementStateService {
  private _groups: PermissionGroupDto[] = [];
  private _entityDisplayName: string = '';
  private _permissionService?: PermissionsService;

  /**
   * Create a new PermissionManagementStateService
   * @param permissionService Optional service for API calls. Required for dispatch methods.
   * @updated 4.0.0 - Now accepts PermissionsService instead of PermissionManagementService
   */
  constructor(permissionService?: PermissionsService) {
    this._permissionService = permissionService;
  }

  /**
   * Set the permission groups
   * @updated 4.0.0 - Accepts PermissionGroupDto[] instead of PermissionManagement.Group[]
   */
  setGroups(groups: PermissionGroupDto[]): void {
    this._groups = groups;
  }

  /**
   * Set the entity display name
   */
  setEntityDisplayName(name: string): void {
    this._entityDisplayName = name;
  }

  /**
   * Get the permission groups
   * @updated 4.0.0 - Returns PermissionGroupDto[] instead of PermissionManagement.Group[]
   */
  getPermissionGroups(): PermissionGroupDto[] {
    return this._groups;
  }

  /**
   * Get the entity display name
   */
  getEntityDisplayName(): string {
    return this._entityDisplayName;
  }

  /**
   * Dispatch get permissions action
   * Fetches permissions from the API and updates internal state.
   * @param params Provider info (providerName and providerKey)
   * @returns Promise with the permission response
   * @since 2.0.0
   * @updated 4.0.0 - Accepts ProviderInfoDto, returns GetPermissionListResultDto, uses PermissionsService
   */
  async dispatchGetPermissions(
    params: ProviderInfoDto
  ): Promise<GetPermissionListResultDto> {
    if (!this._permissionService) {
      throw new Error(
        'PermissionsService is required for dispatchGetPermissions. Pass it to the constructor.'
      );
    }

    const response = await this._permissionService.get(params.providerName, params.providerKey);
    this._groups = response.groups;
    this._entityDisplayName = response.entityDisplayName;
    return response;
  }

  /**
   * Dispatch update permissions action
   * Updates permissions via the API.
   * @param request Provider info combined with update permissions DTO
   * @returns Promise that resolves when update completes
   * @since 2.0.0
   * @updated 4.0.0 - Accepts ProviderInfoDto & UpdatePermissionsDto, uses PermissionsService
   */
  async dispatchUpdatePermissions(
    request: ProviderInfoDto & UpdatePermissionsDto
  ): Promise<void> {
    if (!this._permissionService) {
      throw new Error(
        'PermissionsService is required for dispatchUpdatePermissions. Pass it to the constructor.'
      );
    }

    await this._permissionService.update(request.providerName, request.providerKey, {
      permissions: request.permissions,
    });
    // Refresh permissions after update
    await this.dispatchGetPermissions({
      providerKey: request.providerKey,
      providerName: request.providerName,
    });
  }

  /**
   * Reset the state
   */
  reset(): void {
    this._groups = [];
    this._entityDisplayName = '';
  }
}
