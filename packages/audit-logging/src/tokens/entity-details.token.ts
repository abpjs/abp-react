/**
 * Entity Details Token
 * Translated from @volo/abp.ng.audit-logging v3.0.0
 *
 * Provides a token for showing entity change details.
 * @since 3.0.0
 */

/**
 * Symbol token for show entity details function.
 * Used for dependency injection of entity details display functionality.
 */
export const SHOW_ENTITY_DETAILS = Symbol('SHOW_ENTITY_DETAILS');

/**
 * Type for the show entity details function
 */
export type ShowEntityDetailsFn = (entityChangeId: string) => void;

/**
 * Symbol token for show entity history function.
 * Used for dependency injection of entity history display functionality.
 */
export const SHOW_ENTITY_HISTORY = Symbol('SHOW_ENTITY_HISTORY');

/**
 * Type for the show entity history function
 */
export type ShowEntityHistoryFn = (entityId: string, entityTypeFullName: string) => void;
