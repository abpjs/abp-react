/**
 * @abpjs/feature-management
 * ABP Framework Feature Management module for React
 * Translated from @abp/ng.feature-management v4.0.0
 *
 * Changes in v4.0.0:
 * - Removed deprecated legacy models: State, ValueType, Feature, Features, Provider
 *   (were in FeatureManagement namespace, deprecated since v3.2.0)
 * - Removed deprecated FeatureManagementService (replaced by FeaturesService in v3.2.0)
 * - Removed deprecated FeatureManagementState and GetFeatures/UpdateFeatures actions
 * - Migrated useFeatureManagement hook from FeatureManagementService to FeaturesService
 * - Hook now returns grouped features (groups: FeatureGroupDto[]) alongside flat features
 * - Component now uses ConfigStateService internally (React: useConfig hook, no change needed)
 *
 * Changes in v3.2.0:
 * - Added new proxy models: FeatureDto, FeatureGroupDto, FeatureProviderDto, GetFeatureListResultDto, UpdateFeatureDto, UpdateFeaturesDto
 * - Added validation models: IStringValueType, IValueValidator
 * - Added ValueTypes enum for feature value types
 * - Added FreeTextType interface and INPUT_TYPES constant
 * - Added getInputType() utility function
 * - Added FeaturesService (new proxy service)
 *
 * @version 4.0.0
 * @since 2.0.0 - Added FeatureManagementComponentInputs/Outputs interfaces
 * @since 2.7.0 - Added eFeatureManagementComponents enum
 * @since 3.2.0 - Added proxy models, validation models, FeaturesService, ValueTypes enum
 * @since 4.0.0 - Removed deprecated models/services, migrated hook to FeaturesService
 */

// Enums (v2.7.0)
export * from './enums';

// Models
export * from './models';

// Services
export * from './services';

// Hooks
export * from './hooks';

// Components
export * from './components';
