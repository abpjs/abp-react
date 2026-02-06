/**
 * Account module enums
 *
 * @since 2.7.0
 * @updated 3.0.0 - eAccountRouteNames moved to config/enums, re-exported here for compatibility
 */
export * from './components';

// Re-export route-names from config for backward compatibility
// In Angular v3.0.0, route-names was moved from lib/enums to config/enums
export { eAccountRouteNames } from '../config/enums/route-names';
