/**
 * Identity module enums
 * @since 2.7.0
 * @since 3.0.0 - route-names moved to config/enums, re-exported for backward compatibility
 */
export * from './components';

// Re-export route names from config for backward compatibility
// Note: In v3.0.0, eIdentityRouteNames no longer includes Administration key
export { eIdentityRouteNames, type IdentityRouteNameKey } from '../config/enums/route-names';
