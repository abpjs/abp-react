/**
 * Feature Management Models
 * Translated from @abp/ng.feature-management v2.0.0
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
    name: string;
    value: string;
    description?: string;
    valueType?: ValueType;
    depth?: number;
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
