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
 * @example
 * ```tsx
 * // In React, prefer using the usePermissionManagement hook directly:
 * import { usePermissionManagement } from '@abpjs/permission-management';
 *
 * function MyComponent() {
 *   const { groups, entityDisplayName } = usePermissionManagement();
 *   // Use groups and entityDisplayName as needed
 * }
 * ```
 */

import type { PermissionManagement } from '../models';

/**
 * State service for permission management
 *
 * Note: In React, this is primarily for API compatibility with Angular.
 * The preferred approach is to use the usePermissionManagement hook directly.
 */
export class PermissionManagementStateService {
  private _groups: PermissionManagement.Group[] = [];
  private _entityDisplayName: string = '';

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
   * Reset the state
   */
  reset(): void {
    this._groups = [];
    this._entityDisplayName = '';
  }
}
