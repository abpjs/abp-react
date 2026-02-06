/**
 * @abpjs/core
 * ABP Framework Core module for React
 * Translated from @abp/ng.core v2.9.0
 *
 * Changes in v2.9.0:
 * - Added ApplicationConfiguration.CurrentUser.email field
 * - Added ABP.Root.sendNullsAsQueryParam option for query string handling
 * - Added Extensible entity DTOs (ExtensibleObject, ExtensibleEntityDto, etc.)
 * - Added ListService for query management with debouncing
 * - Added LazyLoadService.remove() method for unloading resources
 * - Changed LazyLoadService.loaded from Set to Map for element tracking
 * - Added LoadingStrategy.element property for element reference
 * - Added localization methods: localize, localizeSync, localizeWithFallback, localizeWithFallbackSync
 * - Added localization-utils: getLocaleDirection, createLocalizer, createLocalizerWithFallback
 * - Added validators module: AbpValidators with creditCard, emailAddress, minAge, range, required, stringLength, url
 *
 * Changes in v2.7.0:
 * - Added CurrentCulture and DateTimeFormat interfaces to ApplicationConfiguration.Localization
 * - Added ABP.Option<T> type for enum-to-options mapping
 * - Added ABP.Test interface for test configuration
 * - Added ABP.Root.skipGetAppConfiguration option
 * - Added utility types: InferredInstanceOf, InferredContextOf
 * - Added form-utils: mapEnumToOptions() for converting enums to select options
 * - Added number-utils: isNumber() for value validation
 * - Added generator-utils: generatePassword() for random password generation
 * - Updated DomInsertionService: added removeContent(), renamed hasInserted() to has()
 * - Updated ContentStrategy.insertElement() to return the inserted element
 *
 * Changes in v2.4.0:
 * - Added Config.hmr flag for Hot Module Replacement
 * - Added Config.ApiConfig type for better API configuration typing
 * - Added Rest.Config.apiName for specifying API name in requests
 * - Deprecated ABP.Root.requirements (to be deleted in v3.0)
 * - Added new DTO classes (EntityDto, AuditedEntityDto, FullAuditedEntityDto, etc.)
 * - Added new strategies (DOM, Loading, Content, CrossOrigin, ContentSecurity)
 * - Added DomInsertionService for tracking DOM insertions
 * - Added LazyLoadService.load() with LoadingStrategy support
 * - Added utility functions: isUndefinedOrEmptyString, generateHash, fromLazyLoad
 *
 * Changes in v2.2.0:
 * - Angular: AuthGuard now uses Injector instead of direct Router injection
 * - React: No changes needed (already uses useNavigate hook idiomatically)
 * - Dependency updates to @ngxs/* packages v3.6.2
 * - Added @angular/localize dependency (Angular-specific, not applicable to React)
 *
 * @since 0.7.6
 * @updated 2.9.0
 */

// Models
export * from './models';

// Enums
export * from './enums';

// Redux Slices
export * from './slices';

// Store
export * from './store';

// Services
export * from './services';

// Strategies
export * from './strategies';

// Interceptors
export * from './interceptors';

// Hooks
export * from './hooks';

// Guards
export * from './guards';

// Components
export * from './components';

// Contexts
export * from './contexts';

// Utils
export * from './utils';

// Validators (added in v2.9.0)
export * from './validators';
