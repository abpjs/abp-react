/**
 * Feature Management Models
 * Translated from @abp/ng.feature-management v1.1.0
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
}
