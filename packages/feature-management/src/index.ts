/**
 * @abpjs/feature-management
 * ABP Framework Feature Management module for React
 * Translated from @abp/ng.feature-management v3.2.0
 *
 * Changes in v3.2.0:
 * - Added new proxy models: FeatureDto, FeatureGroupDto, FeatureProviderDto, GetFeatureListResultDto, UpdateFeatureDto, UpdateFeaturesDto
 * - Added validation models: IStringValueType, IValueValidator
 * - Added ValueTypes enum for feature value types
 * - Added FreeTextType interface and INPUT_TYPES constant
 * - Added getInputType() utility function
 * - Added FeaturesService (new proxy service)
 * - Deprecated legacy models (State, ValueType, Feature, Features, Provider) - to be deleted in v4.0
 *
 * Changes in v3.1.0:
 * - Added displayName property to Feature interface
 *
 * Changes in v3.0.0:
 * - Angular: visible property changed to getter/setter (React already uses props)
 * - Dependency updates to @abp/ng.theme.shared v3.0.0
 * - No functional code changes needed (React implementation already handles visibility via props)
 *
 * Changes in v2.9.0:
 * - Version bump only (dependency updates to @abp/ng.theme.shared v2.9.0)
 * - No functional code changes
 *
 * Changes in v2.7.0:
 * - Added eFeatureManagementComponents enum for component replacement system
 *
 * Changes in v2.4.0:
 * - Added apiName property to FeatureManagementService
 * - Dependency updates to @abp/ng.theme.shared v2.4.0
 *
 * @version 3.2.0
 * @since 2.0.0 - Added FeatureManagementComponentInputs/Outputs interfaces
 * @since 2.1.0 - Version bump only (dependency updates to @abp/ng.theme.shared v2.1.0)
 * @since 2.2.0 - Version bump only (dependency updates)
 * @since 2.4.0 - Added apiName property to FeatureManagementService
 * @since 2.7.0 - Added eFeatureManagementComponents enum
 * @since 2.9.0 - Version bump only (dependency updates)
 * @since 3.0.0 - Dependency updates (no React changes needed)
 * @since 3.1.0 - Added displayName property to Feature interface
 * @since 3.2.0 - Added proxy models, validation models, FeaturesService, ValueTypes enum
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
