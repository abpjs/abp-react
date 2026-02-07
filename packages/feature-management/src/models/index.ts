/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Feature Management Models
 * Translated from @abp/ng.feature-management v3.1.0
 *
 * Changes in v3.1.0:
 * - Added displayName property to Feature interface
 */

export namespace FeatureManagement {
  /**
   * Feature management state
   */
  export interface State {
    features: Feature[];
  }

  /**
   * Feature value type definition
   */
  export interface ValueType {
    name: string;
    properties: object;
    validator: object;
  }

  /**
   * Individual feature definition
   */
  export interface Feature {
    /** Feature name (identifier) */
    name: string;
    /** Display name for the feature (v3.1.0) */
    displayName: string;
    /** Feature value */
    value: string;
    /** Optional description */
    description?: string;
    /** Value type definition */
    valueType?: ValueType;
    /** Hierarchy depth level */
    depth?: number;
    /** Parent feature name for hierarchy */
    parentName?: string;
  }

  /**
   * Container for features array
   */
  export interface Features {
    features: Feature[];
  }

  /**
   * Provider information for feature management
   */
  export interface Provider {
    providerName: string;
    providerKey: string;
  }

  // ============================================================================
  // Component Interface Types - v2.0.0
  // ============================================================================

  /**
   * Inputs for FeatureManagement component
   *
   * @since 2.0.0
   */
  export interface FeatureManagementComponentInputs {
    /** Whether the modal is visible */
    visible: boolean;
    /** Provider name (e.g., 'T' for Tenant) */
    readonly providerName: string;
    /** Provider key (e.g., tenant ID) */
    readonly providerKey: string;
  }

  /**
   * Outputs for FeatureManagement component
   *
   * In Angular, this uses EventEmitter<boolean>.
   * In React, this is a callback function.
   *
   * @since 2.0.0
   */
  export interface FeatureManagementComponentOutputs {
    /** Callback when visibility changes */
    readonly visibleChange?: (visible: boolean) => void;
  }
}
