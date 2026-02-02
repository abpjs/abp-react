/**
 * Feature Management component keys for component replacement system
 *
 * These keys are used by ABP's component replacement system to allow
 * customization of feature management module components.
 *
 * Translated from @abp/ng.feature-management v2.7.0 eFeatureManagementComponents enum.
 *
 * @since 2.7.0
 *
 * @example
 * ```tsx
 * import { eFeatureManagementComponents } from '@abpjs/feature-management';
 *
 * // Use in component replacement
 * const key = eFeatureManagementComponents.FeatureManagement;
 * ```
 */
export const eFeatureManagementComponents = {
  /**
   * Key for the FeatureManagement component
   */
  FeatureManagement: 'FeatureManagement.FeatureManagementComponent',
} as const;

/**
 * Type for eFeatureManagementComponents values
 */
export type eFeatureManagementComponents = (typeof eFeatureManagementComponents)[keyof typeof eFeatureManagementComponents];
