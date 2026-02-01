/**
 * @abpjs/core
 * ABP Framework Core module for React
 * Translated from @abp/ng.core v2.4.0
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
 * @updated 2.4.0
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
