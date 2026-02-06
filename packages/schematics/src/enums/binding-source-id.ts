/**
 * Binding Source ID Enum
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Identifies the source of parameter binding in API actions.
 */

export enum eBindingSourceId {
  /** Parameter is bound from request body */
  Body = 'Body',
  /** Parameter is bound from model binding */
  Model = 'ModelBinding',
  /** Parameter is bound from URL path */
  Path = 'Path',
  /** Parameter is bound from query string */
  Query = 'Query',
}
