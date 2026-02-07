/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Feature Management Models
 * Translated from @abp/ng.feature-management v4.0.0
 *
 * Changes in v4.0.0:
 * - Removed deprecated legacy models (State, ValueType, Feature, Features, Provider)
 *   These were deprecated in v3.2.0 and deleted in Angular v4.0.0
 * - Only FeatureManagementComponentInputs/Outputs remain in the namespace
 *
 * Changes in v3.2.0:
 * - Added new proxy models (FeatureDto, FeatureGroupDto, etc.)
 * - Added validation models (IStringValueType, IValueValidator)
 * - Added ValueTypes enum
 * - Added FreeTextType and INPUT_TYPES
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
// Component Interface Types
// ============================================================================

export namespace FeatureManagement {
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
