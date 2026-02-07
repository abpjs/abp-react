/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Permission Management module type definitions
 * Translated from @abp/ng.permission-management v4.0.0
 */

import type { GetPermissionListResultDto, PermissionGrantInfoDto } from '../proxy/models';

/**
 * PermissionManagement namespace containing all permission-related types
 */
export namespace PermissionManagement {
  /**
   * State interface for permission management store
   * @updated 4.0.0 - permissionRes changed from Response to GetPermissionListResultDto
   */
  export interface State {
    permissionRes: GetPermissionListResultDto;
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
 * @updated 4.0.0 - Now extends PermissionGrantInfoDto instead of PermissionManagement.Permission
 */
export interface PermissionWithStyle extends PermissionGrantInfoDto {
  style: string;
}

/**
 * Extended permission with margin property for indentation
 * @deprecated Use PermissionWithStyle instead. To be deleted in v5.0.
 */
export interface PermissionWithMargin extends PermissionGrantInfoDto {
  margin: number;
}
