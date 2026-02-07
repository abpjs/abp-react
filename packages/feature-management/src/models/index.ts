/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Feature Management Models
 * Translated from @abp/ng.feature-management v3.2.0
 *
 * Changes in v3.2.0:
 * - Added new proxy models (FeatureDto, FeatureGroupDto, etc.)
 * - Added validation models (IStringValueType, IValueValidator)
 * - Added ValueTypes enum
 * - Added FreeTextType and INPUT_TYPES
 * - Deprecated old State, ValueType, Feature, Features, Provider interfaces (to be deleted in v4.0)
 *
 * Changes in v3.1.0:
 * - Added displayName property to Feature interface
 */

// ============================================================================
// Proxy Models - v3.2.0
// ============================================================================

/**
 * Value validator interface
 * @since 3.2.0
 */
export interface IValueValidator {
  name: string;
  item: object;
  properties: Record<string, object>;
}

/**
 * String value type interface
 * @since 3.2.0
 */
export interface IStringValueType {
  name: string;
  item: object;
  properties: Record<string, object>;
  validator: IValueValidator;
}

/**
 * Feature provider DTO
 * @since 3.2.0
 */
export interface FeatureProviderDto {
  name: string;
  key: string;
}

/**
 * Feature DTO - represents a single feature
 * @since 3.2.0
 */
export interface FeatureDto {
  name: string;
  displayName: string;
  value: string;
  provider: FeatureProviderDto;
  description: string;
  valueType: IStringValueType;
  depth: number;
  parentName: string;
}

/**
 * Feature group DTO - represents a group of features
 * @since 3.2.0
 */
export interface FeatureGroupDto {
  name: string;
  displayName: string;
  features: FeatureDto[];
}

/**
 * Result DTO for getting features
 * @since 3.2.0
 */
export interface GetFeatureListResultDto {
  groups: FeatureGroupDto[];
}

/**
 * DTO for updating a single feature
 * @since 3.2.0
 */
export interface UpdateFeatureDto {
  name: string;
  value: string;
}

/**
 * DTO for updating multiple features
 * @since 3.2.0
 */
export interface UpdateFeaturesDto {
  features: UpdateFeatureDto[];
}

/**
 * Feature value types enum
 * @since 3.2.0
 */
export enum ValueTypes {
  ToggleStringValueType = 'ToggleStringValueType',
  FreeTextStringValueType = 'FreeTextStringValueType',
  SelectionStringValueType = 'SelectionStringValueType',
}

/**
 * Free text type interface for input validation
 * @since 3.2.0
 */
export interface FreeTextType {
  valueType: {
    validator: {
      name: string;
    };
  };
}

/**
 * Input types for free text features
 * @since 3.2.0
 */
export const INPUT_TYPES = {
  numeric: 'number',
  default: 'text',
} as const;

/**
 * Get input type based on validator name
 * @param feature The feature to get input type for
 * @returns Input type string
 * @since 3.2.0
 */
export function getInputType(feature: FreeTextType): string {
  const validatorName = feature?.valueType?.validator?.name?.toLowerCase() || '';
  if (validatorName.includes('numeric') || validatorName.includes('number')) {
    return INPUT_TYPES.numeric;
  }
  return INPUT_TYPES.default;
}

// ============================================================================
// Legacy Models (deprecated in v3.2.0, to be deleted in v4.0)
// ============================================================================

export namespace FeatureManagement {
  /**
   * Feature management state
   * @deprecated To be deleted in v4.0. Use GetFeatureListResultDto instead.
   */
  export interface State {
    features: Feature[];
  }

  /**
   * Feature value type definition
   * @deprecated To be deleted in v4.0. Use IStringValueType instead.
   */
  export interface ValueType {
    name: string;
    properties: object;
    validator: object;
  }

  /**
   * Individual feature definition
   * @deprecated To be deleted in v4.0. Use FeatureDto instead.
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
   * @deprecated To be deleted in v4.0. Use UpdateFeaturesDto instead.
   */
  export interface Features {
    features: Feature[];
  }

  /**
   * Provider information for feature management
   * @deprecated To be deleted in v4.0. Use FeatureProviderDto instead.
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
