/**
 * Permission Management module type definitions
 * Translated from @abp/ng.permission-management v1.0.0
 */

/**
 * PermissionManagement namespace containing all permission-related types
 */
export namespace PermissionManagement {
  /**
   * State interface for permission management store
   */
  export interface State {
    permissionRes: Response;
  }

  /**
   * API response for permission data
   */
  export interface Response {
    entityDisplayName: string;
    groups: Group[];
  }

  /**
   * Permission group containing related permissions
   */
  export interface Group {
    name: string;
    displayName: string;
    permissions: Permission[];
  }

  /**
   * Minimal permission info for updates
   */
  export interface MinimumPermission {
    name: string;
    isGranted: boolean;
  }

  /**
   * Full permission details
   */
  export interface Permission extends MinimumPermission {
    displayName: string;
    parentName: string;
    allowedProviders: string[];
    grantedProviders: GrantedProvider[];
  }

  /**
   * Provider that granted a permission
   */
  export interface GrantedProvider {
    providerName: string;
    providerKey: string;
  }

  /**
   * Request payload for updating permissions
   */
  export interface UpdateRequest {
    permissions: MinimumPermission[];
    providerKey: string;
    providerName: string;
  }

  /**
   * Parameters for fetching permissions
   */
  export interface GetPermissionsParams {
    providerKey: string;
    providerName: string;
  }

  // ========================
  // Component Interface Types (v2.0.0)
  // ========================

  /**
   * Input props for PermissionManagementComponent
   * @since 2.0.0
   */
  export interface PermissionManagementComponentInputs {
    /** Whether the modal is visible */
    visible: boolean;
    /** Provider name (e.g., 'R' for Role, 'U' for User) */
    readonly providerName: string;
    /** Provider key (e.g., role ID or user ID) */
    readonly providerKey: string;
    /** Hide the provider badges on permissions */
    readonly hideBadges: boolean;
  }

  /**
   * Output callbacks for PermissionManagementComponent
   * @since 2.0.0
   */
  export interface PermissionManagementComponentOutputs {
    /** Callback when visibility changes */
    readonly visibleChange?: (visible: boolean) => void;
  }
}

/**
 * Extended permission with UI-specific properties
 */
export interface PermissionWithMargin extends PermissionManagement.Permission {
  margin: number;
}
