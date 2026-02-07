/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Permission Management module type definitions
 * Translated from @abp/ng.permission-management v3.2.0
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
   * @deprecated To be deleted in v4.0. Use GetPermissionListResultDto from proxy instead.
   */
  export interface Response {
    entityDisplayName: string;
    groups: Group[];
  }

  /**
   * Permission group containing related permissions
   * @deprecated To be deleted in v4.0. Use PermissionGroupDto from proxy instead.
   */
  export interface Group {
    name: string;
    displayName: string;
    permissions: Permission[];
  }

  /**
   * Minimal permission info for updates
   * @deprecated To be deleted in v4.0. Use UpdatePermissionDto from proxy instead.
   */
  export interface MinimumPermission {
    name: string;
    isGranted: boolean;
  }

  /**
   * Full permission details
   * @deprecated To be deleted in v4.0. Use PermissionGrantInfoDto from proxy instead.
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
   * @deprecated To be deleted in v4.0. Use UpdatePermissionsDto from proxy instead.
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
 * Extended permission with UI-specific style property
 * @since 3.2.0 - Renamed from PermissionWithMargin
 */
export interface PermissionWithStyle extends PermissionManagement.Permission {
  style: string;
}

/**
 * Extended permission with margin property for indentation
 * @deprecated Use PermissionWithStyle instead
 */
export interface PermissionWithMargin extends PermissionManagement.Permission {
  margin: number;
}
