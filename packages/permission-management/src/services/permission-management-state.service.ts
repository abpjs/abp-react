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
 * import { PermissionManagementStateService, PermissionManagementService } from '@abpjs/permission-management';
 * import { RestService } from '@abpjs/core';
 *
 * const rest = new RestService();
 * const service = new PermissionManagementService(rest);
 * const stateService = new PermissionManagementStateService(service);
 *
 * // Fetch permissions
 * await stateService.dispatchGetPermissions({ providerKey: 'role-id', providerName: 'R' });
 * const groups = stateService.getPermissionGroups();
 * ```
 */

import type { PermissionManagement } from '../models';
import { PermissionManagementService } from './permission-management.service';

/**
 * State service for permission management
 *
 * Note: In React, this is primarily for API compatibility with Angular.
 * The preferred approach is to use the usePermissionManagement hook directly.
 */
export class PermissionManagementStateService {
  private _groups: PermissionManagement.Group[] = [];
  private _entityDisplayName: string = '';
  private _permissionService?: PermissionManagementService;

  /**
   * Create a new PermissionManagementStateService
   * @param permissionService Optional service for API calls. Required for dispatch methods.
   */
  constructor(permissionService?: PermissionManagementService) {
    this._permissionService = permissionService;
  }

  /**
   * Set the permission groups
   */
  setGroups(groups: PermissionManagement.Group[]): void {
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
   */
  getPermissionGroups(): PermissionManagement.Group[] {
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
   * @param params Provider key and name
   * @returns Promise with the permission response
   * @since 2.0.0
   */
  async dispatchGetPermissions(
    params: PermissionManagement.GetPermissionsParams
  ): Promise<PermissionManagement.Response> {
    if (!this._permissionService) {
      throw new Error(
        'PermissionManagementService is required for dispatchGetPermissions. Pass it to the constructor.'
      );
    }

    const response = await this._permissionService.getPermissions(params);
    this._groups = response.groups;
    this._entityDisplayName = response.entityDisplayName;
    return response;
  }

  /**
   * Dispatch update permissions action
   * Updates permissions via the API.
   * @param request Update request with permissions, providerKey and providerName
   * @returns Promise that resolves when update completes
   * @since 2.0.0
   */
  async dispatchUpdatePermissions(
    request: PermissionManagement.UpdateRequest
  ): Promise<void> {
    if (!this._permissionService) {
      throw new Error(
        'PermissionManagementService is required for dispatchUpdatePermissions. Pass it to the constructor.'
      );
    }

    await this._permissionService.updatePermissions(request);
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
